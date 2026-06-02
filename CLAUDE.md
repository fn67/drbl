# DRBL — Project Brief

DRBL is an office World Cup 2026 prediction game web app.
Name derived from "dribble" — football themed.
Built for ~1000 employees. Fun, competitive, minimal.

## App Name
DRBL — use this everywhere: navbar, page titles, browser tab title, and any branding text.
Never use "Predictor 2026" — that was a design placeholder only.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS v4 + tweakcn theme
- **Database:** Supabase (PostgreSQL)
- **Auth:** Microsoft SSO via Supabase Auth (Azure AD)
- **Hosting:** Vercel
- **Font:** Quicksand (Google Fonts)

---

## Theme

Dark mode as default. tweakcn theme applied via:
```
npx shadcn@latest add https://tweakcn.com/r/themes/cmmc6lpi5000404kz6dff2cl1
```

Full CSS variables are in `app/globals.css`.

Key tokens:
- Primary (green): `oklch(0.6289 0.0949 164.1065)`
- Background (dark): `oklch(0.2263 0.0214 264.0065)`
- Card (dark): `oklch(0.2561 0.0259 263.9536)`
- Border radius: `0.8rem`
- Font: Quicksand, Inter, sans-serif

Always use CSS variables — never hardcode colors.

---

## Folder Structure

```
src/
  app/
    (auth)/
      login/
        page.tsx
    (main)/
      layout.tsx              ← floating navbar + page wrapper
      page.tsx                ← home / match timeline
      match/
        [id]/
          page.tsx            ← match detail, shareable URL
      leaderboard/
        page.tsx
      myspace/
        page.tsx
    admin/
      layout.tsx              ← admin wrapper, check is_admin
      matches/
        page.tsx              ← create, edit, delete matches
      results/
        page.tsx              ← approve results, lock/unlock
    api/
      predictions/
        route.ts
      matches/
        route.ts
        [id]/
          route.ts
      leaderboard/
        route.ts
      myspace/
        route.ts
      admin/
        matches/
          route.ts
        results/
          [id]/
            route.ts
  components/
    ui/                       ← shadcn auto-generated, do not edit
    navbar.tsx                ← floating pill navbar
    bottom-nav.tsx            ← mobile bottom navigation
    match-card.tsx            ← match card for timeline
    vote-form.tsx             ← prediction form on match detail
    voter-reveal.tsx          ← three-column voter display
    leaderboard-list.tsx      ← leaderboard rows
    predictions-modal.tsx     ← view predictions slide-over
    pending-votes.tsx         ← reminder section in myspace
  lib/
    supabase.ts               ← supabase browser client
    supabase-server.ts        ← supabase server client
    points.ts                 ← points calculation logic
    utils.ts                  ← cn() and helpers
    teams.ts                  ← hardcoded 48 World Cup 2026 teams
    auth.ts                   ← helper to get current user server-side
  types/
    index.ts                  ← all TypeScript types
docs/
  schema.sql                  ← supabase table definitions
CLAUDE.md                     ← this file
tasks.md                      ← granular task list
```

---

## TypeScript Types

```typescript
export type MatchStatus = 'upcoming' | 'voting_open' | 'locked' | 'completed'
export type PredictedWinner = 'home' | 'draw' | 'away'

export interface User {
  id: string
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export interface Match {
  id: string
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  kickoff_at: string
  round: string
  group_name: string
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  manually_locked: boolean
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  predicted_winner: PredictedWinner
  goal_difference: number | null
  points_earned: number
  created_at: string
  updated_at: string
  user?: User
  match?: Match
}

export interface LeaderboardEntry {
  user_id: string
  name: string
  email: string
  total_points: number
  correct_predictions: number
  total_predictions: number
}

export interface Team {
  name: string
  flag: string
  group: string
}
```

---

## Database Schema

Three core tables: `users`, `matches`, `predictions`
Full SQL in `docs/schema.sql`.

---

## Teams

All 48 World Cup 2026 teams are hardcoded in `src/lib/teams.ts`.
Not stored in the database — teams never change during the tournament.
Each team has: name, flag emoji, group (Group A through Group L).
The Add Match form uses this list for searchable team dropdowns.
Flags are always sourced from the selected team — never typed manually.

---

## Match Status Flow

```
upcoming → voting_open → locked → completed
```

- `upcoming`: kickoff more than 48hrs away
- `voting_open`: kickoff within 48hrs, voting allowed
- `locked`: match has kicked off, voting closed, no result yet
- `completed`: result approved by admin, points calculated

Status auto-updates on page load based on `kickoff_at` time.
No cron job needed — calculated client/server side on every load.
Admin can manually override lock/unlock at any time.

---

## Points System

- Correct winner or correct draw: **10 points**
- Correct winner + correct goal difference: **15 points**
- Draw prediction: **10 points only** (no goal difference field)
- Wrong prediction: **0 points**
- Knockout rounds: **no draw option shown**

---

## Voting Rules

- Opens automatically 48hrs before kickoff
- Locks automatically at kickoff time
- Admin can manually lock/unlock any match
- Users can edit prediction anytime before lock
- Vote % hidden until voting locks
- After lock: vote % shown, voter names revealed in three columns
- Voter names shown in three columns: Home | Draw | Away
- On mobile voter columns stack vertically, desktop shows three columns side by side

---

## Screens

### 1. Login `/login`
- Microsoft SSO button only
- Full screen, dark, branded

### 2. Home `/`
- Floating pill navbar
- Two toggle pills: Upcoming (default) | Past
- Upcoming: today first, soonest at top
- Past: most recent first
- Match cards grouped by date

### 3. Match Detail `/match/[id]`
- Shareable URL
- Three states: voting_open, locked, completed
- voting_open: prediction form
- locked: voter reveal, no result
- completed: voter reveal with results and points

### 4. Leaderboard `/leaderboard`
- No rank numbers
- Sorted by total points desc, alphabetical tie-break
- Current user row highlighted with green left border
- Top 3 slightly elevated
- View predictions slide-over modal
- On mobile: bottom sheet

### 5. My Space `/myspace`
- Pending votes reminder (amber, conditional)
- Profile card (avatar, name, email, points, stats)
- Active predictions (editable)
- Prediction history (completed)
- Log out button at bottom (mobile)

### 6. Admin — Match Management `/admin/matches`
- Only visible to is_admin = true users
- Admin link appears in navbar for admin users only
- Searchable team dropdowns for home/away (from teams.ts)
- Group dropdown (A-L) only shows when Round is Group Stage
- Lock/unlock toggle per match

### 7. Admin — Results `/admin/results`
- Enter scores and approve results
- Triggers calculate_points() on approval

---

## Navbar

Floating pill — centered, fixed, frosted glass effect.
Contents: logo + DRBL | Matches · Leaderboard · My Space | 🏆 pts | avatar
- Admin users see an extra Admin link
- Avatar circle is clickable — opens dropdown with name, email, logout
- Points display is non-clickable, informational only
- On mobile: logo only in pill, bottom nav bar for navigation

## Logout
- Desktop: avatar dropdown in navbar → Log out button
- Mobile: Log out button at bottom of My Space page
- Both call Supabase signOut() and redirect to /login

---

## Key UI Rules (Never Break These)

- Never use HTML `<form>` tags — always use `onClick` handlers
- Never hardcode colors — always use CSS variables
- Always TypeScript — never use `any`
- Mobile first — every component must work at 375px width
- Never install new packages without flagging it first
- Always use existing shadcn components before building custom ones
- Keep components under 150 lines — split if longer
- Dark mode is default — test every component in dark
- Use Quicksand font — loaded via Google Fonts in layout.tsx
- Flags are emoji — sourced from teams.ts, never typed manually

---

## Git Commit Rules

Commit after every completed phase section. Never batch multiple sections into one commit.

Format: `type(scope): short description`

Types:
- `feat` — new component or screen
- `fix` — something broken
- `chore` — setup, config, package installs
- `style` — visual tweaks only, no logic changes

Examples:
```
chore(setup): nextjs scaffold and tweakcn theme
feat(nav): floating pill navbar with frosted glass
feat(nav): mobile bottom navigation bar
feat(home): match timeline with all four card states
feat(match): vote form with goal difference picker
feat(match): voter reveal three column layout
feat(leaderboard): list with predictions modal
feat(myspace): profile pending votes and history
feat(admin): match management and results approval
fix(auth): microsoft SSO callback handler
style(match-card): tighten spacing on completed state
```

Never use: "update", "fix stuff", "wip", "changes".
Scope matches component or page name.
Description says what it does, not what file changed.

---

## Notes for Claude Code

- UI designs provided via Claude Designer handoff links in session prompts
- Always check if a shadcn component exists before building custom
- Floating navbar must use backdrop-blur and position fixed
- Voter reveal is always three columns: home | draw | away
- Goal difference field only appears when home or away selected (not draw)
- Draw option hidden for Round of 16 and beyond
- Vote % bar hidden when status is voting_open
- Vote % bar shown when status is locked or completed
- Voter names shown when status is locked or completed
- Points shown on voter names only when status is completed
- Name displayed everywhere comes from Microsoft SSO full_name (raw_user_meta_data), never email