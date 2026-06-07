# DRBL — Project Brief

DRBL is an office World Cup 2026 prediction game web app.
Name derived from "dribble" — football themed.
Built for ~1,000 employees. Fun, competitive, minimal.

⚠️ IMPORTANT: This file must never be overwritten by automated
tools, scaffolding, or package installers (e.g. create-next-app).
Only update this file when explicitly instructed to do so.

---

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
- **Flags:** flag-icons library (circular style, replaces emoji flags)

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
      layout.tsx
      page.tsx
      match/
        [id]/
          page.tsx
      leaderboard/
        page.tsx
      myspace/
        page.tsx
    admin/
      layout.tsx
      matches/
        page.tsx
      results/
        page.tsx
    api/
      predictions/route.ts
      matches/route.ts
      matches/[id]/route.ts
      leaderboard/route.ts
      myspace/route.ts
      admin/matches/route.ts
      admin/results/[id]/route.ts
  components/
    ui/                       ← shadcn auto-generated, do not edit
    navbar.tsx
    bottom-nav.tsx
    match-card.tsx
    vote-form.tsx
    voter-reveal.tsx
    leaderboard-list.tsx
    predictions-modal.tsx
    pending-votes.tsx
  lib/
    supabase.ts
    supabase-server.ts
    points.ts
    utils.ts
    teams.ts                  ← hardcoded 48 World Cup 2026 teams
    auth.ts
  types/
    index.ts
scripts/
  seed.ts                     ← seeds db with sample data (dev only)
  clear.ts                    ← clears all seeded data (dev only)
docs/
  schema.sql
CLAUDE.md
tasks.md
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
  winner_override: 'home' | 'away' | null  // penalty/shootout winner for knockout draws
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
  code: string   ← ISO 3166-1 alpha-2 lowercase e.g. 'us', 'gb-eng'
  group: string
}
```

---

## Teams

All 48 World Cup 2026 teams are hardcoded in `src/lib/teams.ts`.
Each team has: name, code (ISO), group (Group A through Group L).
Flag emoji field has been removed — flags rendered via flag-icons using code.
The Add Match form uses this list for searchable team dropdowns.

## Flags

Using flag-icons library for all flag rendering.
Import: `import 'flag-icons/css/flag-icons.min.css'`
Usage: `<span className="fi fi-{code} fis" />` with border-radius 50% for circular style.
Special codes: England = gb-eng, Scotland = gb-sct.
Planned: white stroke around circular flags (deferred, post-launch).

---

## Database Schema

Three core tables: `users`, `matches`, `predictions`
Full SQL in `docs/schema.sql`.

Key notes:
- `handle_new_user` trigger auto-creates user row in public.users on first login
- Name field uses: full_name → name → display_name → split_part(email, '@', 1)
- This is a personal Microsoft account limitation — company accounts send full name automatically
- Do NOT add manual user creation logic in the auth callback — trigger handles it

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
Admin can manually override lock/unlock at any time.

---

## Points System

- Correct winner or correct draw: **10 points**
- Correct winner + correct goal difference: **15 points**
- Draw prediction: **10 points only** (no goal difference field)
- Wrong prediction: **0 points**
- Knockout rounds: **no draw option shown**
- Penalty/shootout wins: winner_override determines the winner.
  Actual goal diff is 0 so nobody earns the 15pt bonus.
  Correct winner prediction earns 10pts.

---

## Voting Rules

- Opens automatically 48hrs before kickoff
- Locks automatically at kickoff time
- Admin can manually lock/unlock any match
- Users can edit prediction anytime before lock
- Vote % hidden until voting locks
- After lock: vote % shown, voter names revealed in three columns
- On mobile voter columns stack vertically, desktop shows three columns side by side

---

## Screens

### 1. Login `/login`
- Microsoft SSO button only

### 2. Home `/`
- Floating pill navbar
- Two toggle pills: Upcoming (default) | Results
  - Upcoming pill shows match count badge; Results pill has no count badge
- Match cards grouped by date
- Data fetching: two separate server queries
  - Upcoming: non-completed matches, ordered by kickoff_at asc
  - Results: completed matches only, ordered by kickoff_at desc, limit 20
- Results tab is paginated — 20 at a time, Load more button appends next batch
- Vote counts fetched only for locked matches (from upcoming) + currently loaded completed matches

### 3. Match Detail `/match/[id]`
- Shareable URL
- Three states: voting_open, locked, completed
- Vote form confirm button disabled by default — enables only when valid selection made
- Vote form edit state: shows change indicator "Mexico +5 → Mexico +3" 
  using same arrow icon as Update prediction button
  Left side: saved prediction (static), Right side: current selection (live)
  Only shows arrow when selection differs from saved

### 4. Leaderboard `/leaderboard`
- No rank numbers
- Sorted by total points desc, alphabetical tie-break
- Current user row highlighted with green left border
- Top 3 slightly elevated
- View predictions modal — bottom sheet on mobile

### 5. My Space `/myspace`
- Pending votes reminder (amber, conditional)
- Profile card (avatar, name from email prefix, email, points, stats)
- Active predictions — two row layout:
  Row 1: team names and vs (full width)
  Row 2: user pick badge, lock time, edit button (smaller sizing)
- Prediction history (completed)
- Log out button at bottom (mobile only)

### 6. Admin — Match Management `/admin/matches`
- Visible only to is_admin = true users
- Admin link in navbar for admin users only
- Searchable team dropdowns using teams.ts
- Group dropdown only shows when Round is Group Stage
- Sidebar is fixed — only content area scrolls

### 7. Admin — Results `/admin/results`
- Enter scores and approve results
- Triggers calculate_points() on approval
- Penalty override: when round is not Group Stage and scores are equal,
  inline penalty winner selector appears automatically
- Admin selects winning team, saved as winner_override in matches table
- Approve button disabled until winner selected in penalty scenario

---

## Navbar

Floating pill — centered, fixed, frosted glass effect.
Max width: max-w-4xl — same as content area.
Contents: logo + DRBL | Matches · Leaderboard · My Space · Admin (admin only) | 🏆 pts | avatar

Logo: /public/logo.svg — use as Next.js Image, 32x32px in navbar.
Favicon: src/app/favicon.ico

Avatar circle:
- Clickable — opens dropdown with name, email, logout
- Points display is non-clickable, informational only

Mobile: logo only in pill, bottom nav bar for navigation.

## Logout
- Desktop: avatar dropdown → Log out
- Mobile: Log out button at bottom of My Space page
- Both call Supabase signOut() and redirect to /login

---

## Branches

- `main` — clean, empty base
- `dev` — main development branch, all completed work lives here
- `ui-tweaks` — open branch for UI polish (branched from dev)
- `test-auth` — experimental employee validation middleware, NOT merging

---

## Seed Scripts (Dev Only)

```bash
npm run seed    ← populates db with 20 matches, 10 users, predictions
npm run clear   ← wipes all seeded data
```

Scripts live in `/scripts/`. Use Supabase service role key (bypasses RLS).
Never run seed on production.

---

## Key UI Rules (Never Break These)

- Never use HTML `<form>` tags — always use `onClick` handlers
- Never hardcode colors — always use CSS variables
- Global content width: max-w-4xl on all pages
- Logo: always use /public/logo.svg — never text or icon placeholder
- No glow or box-shadow effects on any buttons
- Always TypeScript — never use `any`
- Mobile first — every component must work at 375px width
- Never install new packages without flagging it first
- Always use existing shadcn components before building custom ones
- Keep components under 150 lines — split if longer
- Dark mode is default — test every component in dark
- Use Quicksand font — loaded via Google Fonts in layout.tsx
- Flags use flag-icons with circular style — never emoji flags
- Never commit automatically — always wait for explicit instruction to commit
  Exception: long autonomous build sessions (phases) where committing per section is expected

---

## Git Commit Rules

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
feat(flags): replace emoji with flag-icons circular flags
fix(auth): resolve user name showing as email after SSO
fix(myspace): restructure active prediction card layout
```

Never use: "update", "fix stuff", "wip", "changes".

---

## Notes for Claude Code

- UI designs provided via Claude Designer handoff links in session prompts
- Always check if a shadcn component exists before building custom
- Floating navbar must use backdrop-blur and position fixed
- Voter reveal is always three columns: home | draw | away
- Exception: knockout matches (Round of 16+) — hide Draw column entirely
- Draw column hidden in voter reveal for same rounds as vote form
- Goal difference field only appears when home or away selected (not draw)
- Draw option hidden for Round of 16 and beyond
- Vote % bar hidden when status is voting_open
- Vote % bar shown when status is locked or completed
- Voter names shown when status is locked or completed
- Points shown on voter names only when status is completed
- Name displayed everywhere comes from public.users name field — never from auth session email directly
- User row in public.users is created automatically by handle_new_user trigger on first login
- Do not add manual user creation code anywhere — it conflicts with the trigger
- Always use getMatchWinner(match) helper to determine winner — never inline score comparison
  getMatchWinner checks winner_override first, then falls back to score comparison
- winner_override takes precedence over scores everywhere: match cards, match detail, 
  voter reveal highlight, points calculation, "You predicted" result display