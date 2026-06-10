-- DRBL — Supabase Database Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- MATCHES
-- ─────────────────────────────────────────
create table public.matches (
  id uuid primary key default uuid_generate_v4(),
  home_team text not null,
  away_team text not null,
  home_flag text not null default '',   -- emoji flag e.g. 🇧🇷
  away_flag text not null default '',
  kickoff_at timestamptz not null,
  round text not null,                  -- 'Group Stage' | 'Round of 16' | 'Quarter Final' | 'Semi Final' | 'Final'
  group_name text not null default '',  -- 'Group A' etc, empty for knockouts
  status text not null default 'upcoming'
    check (status in ('upcoming', 'voting_open', 'locked', 'completed')),
  home_score integer,
  away_score integer,
  manually_locked boolean default false,
  winner_override text check (winner_override in ('home', 'away')), -- penalty/shootout winner for knockout draws
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- PREDICTIONS
-- ─────────────────────────────────────────
create table public.predictions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  match_id uuid references public.matches(id) on delete cascade not null,
  predicted_winner text not null
    check (predicted_winner in ('home', 'draw', 'away')),
  goal_difference integer,              -- null when draw predicted
  points_earned integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, match_id)             -- one prediction per user per match
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_prediction_updated
  before update on public.predictions
  for each row execute procedure public.handle_updated_at();

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

-- Users table
alter table public.users enable row level security;

create policy "Users can read all users"
  on public.users for select
  using (auth.role() = 'authenticated');

create policy "Users can update their own record"
  on public.users for update
  using (auth.uid() = id);

-- Matches table
alter table public.matches enable row level security;

create policy "Anyone authenticated can read matches"
  on public.matches for select
  using (auth.role() = 'authenticated');

create policy "Only admins can insert matches"
  on public.matches for insert
  with check (exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  ));

create policy "Only admins can update matches"
  on public.matches for update
  using (exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  ));

create policy "Only admins can delete matches"
  on public.matches for delete
  using (exists (
    select 1 from public.users
    where id = auth.uid() and is_admin = true
  ));

-- Predictions table
alter table public.predictions enable row level security;

create policy "Anyone authenticated can read predictions"
  on public.predictions for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own predictions"
  on public.predictions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own predictions"
  on public.predictions for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- LEADERBOARD VIEW
-- ─────────────────────────────────────────
create or replace view public.leaderboard as
select
  u.id as user_id,
  u.name,
  u.email,
  coalesce(sum(p.points_earned), 0) as total_points,
  count(case when p.points_earned > 0 then 1 end) as correct_predictions,
  count(p.id) as total_predictions
from public.users u
left join public.predictions p on p.user_id = u.id
group by u.id, u.name, u.email
order by total_points desc, u.name asc;

-- ─────────────────────────────────────────
-- POINTS CALCULATION FUNCTION
-- Call this after admin approves a result
-- ─────────────────────────────────────────
create or replace function public.calculate_points(match_id_input uuid)
returns void as $$
declare
  match_record public.matches%rowtype;
  actual_winner text;
  actual_diff integer;
  pts_multiplier integer;
begin
  -- Get the match
  select * into match_record
  from public.matches
  where id = match_id_input and status = 'completed';

  if not found then
    raise exception 'Match not found or not completed';
  end if;

  -- Featured matches award double points
  pts_multiplier := case when match_record.is_featured then 2 else 1 end;

  -- Determine actual winner (winner_override takes precedence for penalty shootouts)
  if match_record.winner_override is not null then
    actual_winner := match_record.winner_override;
    actual_diff := 0; -- scores were level; no goal diff bonus possible
  elsif match_record.home_score > match_record.away_score then
    actual_winner := 'home';
    actual_diff := match_record.home_score - match_record.away_score;
  elsif match_record.away_score > match_record.home_score then
    actual_winner := 'away';
    actual_diff := match_record.away_score - match_record.home_score;
  else
    actual_winner := 'draw';
    actual_diff := 0;
  end if;

  -- Update points for all predictions on this match
  update public.predictions
  set points_earned = pts_multiplier * case
    -- Correct winner + correct goal difference = 15 pts (base)
    when predicted_winner = actual_winner
      and goal_difference = actual_diff
      and actual_winner != 'draw'
    then 15
    -- Correct winner only = 10 pts (base)
    when predicted_winner = actual_winner
    then 10
    -- Wrong prediction = 0 pts
    else 0
  end
  where match_id = match_id_input;
end;
$$ language plpgsql security definer;