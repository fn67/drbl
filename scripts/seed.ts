import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Env ───────────────────────────────────────────────────────────────────────

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Time helpers ──────────────────────────────────────────────────────────────

const now = new Date()

const daysAgo = (d: number, h = 18): string => {
  const t = new Date(now)
  t.setDate(t.getDate() - d)
  t.setUTCHours(h, 0, 0, 0)
  return t.toISOString()
}
const hoursAgo = (h: number): string =>
  new Date(now.getTime() - h * 3_600_000).toISOString()
const hoursFromNow = (h: number): string =>
  new Date(now.getTime() + h * 3_600_000).toISOString()
const daysFromNow = (d: number, h = 18): string => {
  const t = new Date(now)
  t.setDate(t.getDate() + d)
  t.setUTCHours(h, 0, 0, 0)
  return t.toISOString()
}

// ── Users ─────────────────────────────────────────────────────────────────────

const SEED_USERS = [
  { name: 'James Fletcher', email: 'james.fletcher@drbl-seed.test' },
  { name: 'Sarah Okafor',   email: 'sarah.okafor@drbl-seed.test'   },
  { name: 'Ravi Patel',     email: 'ravi.patel@drbl-seed.test'     },
  { name: 'Carlos Mendez',  email: 'carlos.mendez@drbl-seed.test'  },
  { name: 'Priya Sharma',   email: 'priya.sharma@drbl-seed.test'   },
  { name: 'Emma Walsh',     email: 'emma.walsh@drbl-seed.test'     },
  { name: 'Tom Bishop',     email: 'tom.bishop@drbl-seed.test'     },
  { name: 'Mei Chen',       email: 'mei.chen@drbl-seed.test'       },
  { name: 'David Osei',     email: 'david.osei@drbl-seed.test'     },
  { name: 'Sophie Laurent', email: 'sophie.laurent@drbl-seed.test' },
]

// ── Matches ───────────────────────────────────────────────────────────────────
// Indices: 0-3 completed, 4-7 locked, 8-13 voting_open, 14-19 upcoming

const SEED_MATCHES = [
  // ── Completed (4) ────────────────────────────────────────────────────────
  { home_team: 'Brazil',      away_team: 'Morocco',      home_flag: 'br',     away_flag: 'ma',
    kickoff_at: daysAgo(14),      round: 'Group Stage',  group_name: 'Group A',
    status: 'completed', home_score: 2, away_score: 1, manually_locked: false },
  { home_team: 'Germany',     away_team: 'Colombia',     home_flag: 'de',     away_flag: 'co',
    kickoff_at: daysAgo(10),      round: 'Group Stage',  group_name: 'Group B',
    status: 'completed', home_score: 1, away_score: 1, manually_locked: false },
  { home_team: 'France',      away_team: 'Nigeria',      home_flag: 'fr',     away_flag: 'ng',
    kickoff_at: daysAgo(7),       round: 'Group Stage',  group_name: 'Group D',
    status: 'completed', home_score: 3, away_score: 0, manually_locked: false },
  { home_team: 'Spain',       away_team: 'Australia',    home_flag: 'es',     away_flag: 'au',
    kickoff_at: daysAgo(3),       round: 'Group Stage',  group_name: 'Group E',
    status: 'completed', home_score: 2, away_score: 0, manually_locked: false },

  // ── Locked (4) ───────────────────────────────────────────────────────────
  { home_team: 'England',     away_team: 'Japan',        home_flag: 'gb-eng', away_flag: 'jp',
    kickoff_at: hoursAgo(6),      round: 'Group Stage',  group_name: 'Group C',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Portugal',    away_team: 'Tunisia',      home_flag: 'pt',     away_flag: 'tn',
    kickoff_at: hoursAgo(3),      round: 'Group Stage',  group_name: 'Group F',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Netherlands', away_team: 'Jordan',       home_flag: 'nl',     away_flag: 'jo',
    kickoff_at: hoursAgo(18),     round: 'Group Stage',  group_name: 'Group G',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Belgium',     away_team: 'Qatar',        home_flag: 'be',     away_flag: 'qa',
    kickoff_at: hoursAgo(2),      round: 'Group Stage',  group_name: 'Group H',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },

  // ── Voting open (6) ──────────────────────────────────────────────────────
  { home_team: 'USA',         away_team: 'New Zealand',  home_flag: 'us',     away_flag: 'nz',
    kickoff_at: hoursFromNow(4),  round: 'Group Stage',  group_name: 'Group A',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Mexico',      away_team: 'Saudi Arabia', home_flag: 'mx',     away_flag: 'sa',
    kickoff_at: hoursFromNow(8),  round: 'Group Stage',  group_name: 'Group B',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Canada',      away_team: 'Ivory Coast',  home_flag: 'ca',     away_flag: 'ci',
    kickoff_at: hoursFromNow(20), round: 'Group Stage',  group_name: 'Group C',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Argentina',   away_team: 'South Korea',  home_flag: 'ar',     away_flag: 'kr',
    kickoff_at: hoursFromNow(30), round: 'Group Stage',  group_name: 'Group D',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Egypt',       away_team: 'Ecuador',      home_flag: 'eg',     away_flag: 'ec',
    kickoff_at: hoursFromNow(36), round: 'Group Stage',  group_name: 'Group E',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Uruguay',     away_team: 'South Africa', home_flag: 'uy',     away_flag: 'za',
    kickoff_at: hoursFromNow(44), round: 'Group Stage',  group_name: 'Group F',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },

  // ── Upcoming (6) ─────────────────────────────────────────────────────────
  { home_team: 'Switzerland', away_team: 'Cameroon',     home_flag: 'ch',     away_flag: 'cm',
    kickoff_at: daysFromNow(3),   round: 'Group Stage',   group_name: 'Group I',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Denmark',     away_team: 'Iraq',         home_flag: 'dk',     away_flag: 'iq',
    kickoff_at: daysFromNow(4),   round: 'Group Stage',   group_name: 'Group J',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Italy',       away_team: 'Slovakia',     home_flag: 'it',     away_flag: 'sk',
    kickoff_at: daysFromNow(5),   round: 'Group Stage',   group_name: 'Group K',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Austria',     away_team: 'Hungary',      home_flag: 'at',     away_flag: 'hu',
    kickoff_at: daysFromNow(7),   round: 'Group Stage',   group_name: 'Group L',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Brazil',      away_team: 'France',       home_flag: 'br',     away_flag: 'fr',
    kickoff_at: daysFromNow(10),  round: 'Quarter Final', group_name: '',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'England',     away_team: 'Spain',        home_flag: 'gb-eng', away_flag: 'es',
    kickoff_at: daysFromNow(14),  round: 'Semi Final',    group_name: '',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
]

// ── Prediction matrix ─────────────────────────────────────────────────────────
// [userIdx, matchIdx, predicted_winner, goal_difference]
//
// Completed match results:
//   M0: Brazil 2-1 Morocco   → home wins, diff=1
//   M1: Germany 1-1 Colombia → draw
//   M2: France 3-0 Nigeria   → home wins, diff=3
//   M3: Spain 2-0 Australia  → home wins, diff=2
//
// Expected leaderboard after calculate_points():
//   James 55 · Sarah 45 · Ravi 40 · Carlos 35 · Priya 30
//   Emma 25 · Tom 15 · David 10 · Mei 10 · Sophie 10

type PredRow = [number, number, 'home' | 'draw' | 'away', number | null]

const SEED_PREDICTIONS: PredRow[] = [
  // ── M0: Brazil 2-1 Morocco ────────────────────────────────────────────────
  [0, 0, 'home', 1], [1, 0, 'home', 1], [2, 0, 'home', 2], [3, 0, 'home', 2],
  [4, 0, 'away', null], [5, 0, 'home', 1], [6, 0, 'away', null],
  [7, 0, 'home', 3], [8, 0, 'home', 2], [9, 0, 'away', null],

  // ── M1: Germany 1-1 Colombia ──────────────────────────────────────────────
  [0, 1, 'draw', null], [1, 1, 'draw', null], [2, 1, 'home', 1], [3, 1, 'draw', null],
  [4, 1, 'draw', null], [5, 1, 'away', null], [6, 1, 'home', 1],
  [7, 1, 'away', null], [8, 1, 'home', 2],    [9, 1, 'home', 1],

  // ── M2: France 3-0 Nigeria ────────────────────────────────────────────────
  [0, 2, 'home', 3], [1, 2, 'home', 2], [2, 2, 'home', 3], [3, 2, 'away', null],
  [4, 2, 'home', 1], [5, 2, 'home', 1], [6, 2, 'draw', null],
  [7, 2, 'away', null], [8, 2, 'away', null], [9, 2, 'away', null],

  // ── M3: Spain 2-0 Australia ───────────────────────────────────────────────
  [0, 3, 'home', 2], [1, 3, 'home', 1], [2, 3, 'home', 2], [3, 3, 'home', 2],
  [4, 3, 'home', 1], [5, 3, 'draw', null], [6, 3, 'home', 2],
  [7, 3, 'draw', null], [8, 3, 'away', null], [9, 3, 'home', 1],

  // ── M4: England vs Japan (locked) — all 10 predicted ─────────────────────
  [0, 4, 'home', 1], [1, 4, 'home', 2], [2, 4, 'home', 1], [3, 4, 'draw', null],
  [4, 4, 'home', 1], [5, 4, 'away', null], [6, 4, 'home', 2],
  [7, 4, 'draw', null], [8, 4, 'home', 1], [9, 4, 'home', 3],

  // ── M5: Portugal vs Tunisia (locked) — all 10 ────────────────────────────
  [0, 5, 'home', 2], [1, 5, 'home', 1], [2, 5, 'home', 2], [3, 5, 'home', 1],
  [4, 5, 'draw', null], [5, 5, 'home', 1], [6, 5, 'away', null],
  [7, 5, 'home', 2], [8, 5, 'home', 1], [9, 5, 'draw', null],

  // ── M6: Netherlands vs Jordan (locked) — 9 predicted (Sophie missing) ────
  [0, 6, 'home', 3], [1, 6, 'home', 2], [2, 6, 'home', 3], [3, 6, 'home', 2],
  [4, 6, 'home', 1], [5, 6, 'home', 2], [6, 6, 'draw', null],
  [7, 6, 'home', 1], [8, 6, 'away', null],

  // ── M7: Belgium vs Qatar (locked) — 8 predicted (David, Sophie missing) ──
  [0, 7, 'home', 2], [1, 7, 'home', 1], [2, 7, 'home', 2], [3, 7, 'draw', null],
  [4, 7, 'home', 1], [5, 7, 'home', 2], [6, 7, 'away', null], [7, 7, 'home', 1],

  // ── M8: USA vs New Zealand (voting_open) — 9 voted ───────────────────────
  [0, 8, 'home', 2], [1, 8, 'home', 1], [2, 8, 'home', 2], [3, 8, 'draw', null],
  [4, 8, 'home', 1], [5, 8, 'home', 1], [6, 8, 'away', null],
  [7, 8, 'home', 2], [8, 8, 'home', 1],

  // ── M9: Mexico vs Saudi Arabia (voting_open) — 8 voted ───────────────────
  [0, 9, 'home', 1], [1, 9, 'home', 2], [2, 9, 'away', null], [3, 9, 'home', 1],
  [4, 9, 'draw', null], [5, 9, 'home', 1], [6, 9, 'home', 2], [7, 9, 'draw', null],

  // ── M10: Canada vs Ivory Coast (voting_open) — 7 voted ───────────────────
  [0, 10, 'home', 1], [1, 10, 'away', null], [2, 10, 'home', 2],
  [3, 10, 'draw', null], [4, 10, 'home', 1], [5, 10, 'away', null], [6, 10, 'home', 1],

  // ── M11: Argentina vs South Korea (voting_open) — 7 voted ────────────────
  [0, 11, 'home', 2], [1, 11, 'home', 1], [2, 11, 'home', 2], [3, 11, 'home', 1],
  [4, 11, 'draw', null], [5, 11, 'home', 1], [6, 11, 'away', null],

  // ── M12: Egypt vs Ecuador (voting_open) — 5 voted ────────────────────────
  [0, 12, 'draw', null], [1, 12, 'home', 1], [2, 12, 'away', null],
  [3, 12, 'home', 2], [4, 12, 'draw', null],

  // ── M13: Uruguay vs South Africa (voting_open) — 4 voted ─────────────────
  [0, 13, 'home', 2], [1, 13, 'home', 1], [2, 13, 'home', 1], [3, 13, 'away', null],

  // ── Upcoming: sparse ─────────────────────────────────────────────────────
  [0, 14, 'home', 1], [1, 14, 'home', 2],
  [0, 15, 'home', 2], [1, 15, 'home', 1], [2, 15, 'away', null],
  [0, 16, 'home', 2],
  [0, 17, 'home', 1], [1, 17, 'draw', null],
  [0, 18, 'home', 1], [1, 18, 'away', null],
  [0, 19, 'home', 2],
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding database...\n')

  // 1. Create auth users (handle_new_user trigger creates public.users rows)
  console.log('Creating users...')
  const userIds: string[] = []
  for (const u of SEED_USERS) {
    const { data, error } = await sb.auth.admin.createUser({
      email: u.email,
      password: 'SeedPass123!',
      email_confirm: true,
      user_metadata: { full_name: u.name },
    })
    if (error) throw new Error(`createUser ${u.email}: ${error.message}`)
    userIds.push(data.user.id)
    process.stdout.write(`  ✓ ${u.name}\n`)
  }

  // 2. Insert matches
  console.log('\nInserting matches...')
  const { data: matchRows, error: matchErr } = await sb
    .from('matches')
    .insert(SEED_MATCHES)
    .select('id')
  if (matchErr || !matchRows) throw new Error(`insert matches: ${matchErr?.message}`)
  const matchIds = matchRows.map((r: { id: string }) => r.id)
  console.log(`  ✓ ${matchIds.length} matches`)

  // 3. Insert predictions
  console.log('\nInserting predictions...')
  const predRows = SEED_PREDICTIONS.map(([ui, mi, winner, diff]) => ({
    user_id: userIds[ui],
    match_id: matchIds[mi],
    predicted_winner: winner,
    goal_difference: diff,
    points_earned: 0,
  }))
  const { error: predErr } = await sb.from('predictions').insert(predRows)
  if (predErr) throw new Error(`insert predictions: ${predErr.message}`)
  console.log(`  ✓ ${predRows.length} predictions`)

  // 4. Calculate points for the 4 completed matches
  console.log('\nCalculating points...')
  for (let i = 0; i < 4; i++) {
    const { error } = await sb.rpc('calculate_points', { match_id_input: matchIds[i] })
    if (error) throw new Error(`calculate_points M${i}: ${error.message}`)
    const m = SEED_MATCHES[i]
    console.log(`  ✓ ${m.home_team} ${m.home_score}–${m.away_score} ${m.away_team}`)
  }

  console.log(`\n✅ Done — ${userIds.length} users · ${matchIds.length} matches · ${predRows.length} predictions`)
  console.log('\nExpected leaderboard:')
  console.log('  James 55 · Sarah 45 · Ravi 40 · Carlos 35 · Priya 30')
  console.log('  Emma 25 · Tom 15 · David 10 · Mei 10 · Sophie 10')
}

seed().catch(err => {
  console.error('\n❌', err.message)
  process.exit(1)
})
