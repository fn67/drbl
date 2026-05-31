# DRBL — Task List

Claude Code reads this file at the start of every session.
Pick the next unchecked task, build it, mark it ✅, move to next.
Never skip a task. Never mark done unless it's working and tested on mobile.
Commit to git after every completed section.

---

## How to use this file

At the start of every Claude Code session, paste this:
```
Read CLAUDE.md and tasks.md. Continue from the first unchecked task.
Use the design handoff link provided for UI reference.
Mark each task ✅ as you complete it.
```

---

## PHASE 1 — Project Setup

### 1.1 Next.js scaffold
- ✅ Run `npx create-next-app@latest drbl` with TypeScript, Tailwind, App Router, ESLint, src/ directory
- ✅ Verify dev server runs on localhost:3000 with no errors

### 1.2 shadcn setup
- ✅ Run `npx shadcn@latest init` — choose default style, yes to globals.css, yes to CSS variables
- ✅ Apply tweakcn theme: `npx shadcn@latest add https://tweakcn.com/r/themes/cmmc6lpi5000404kz6dff2cl1`
- ✅ Install shadcn components: `npx shadcn@latest add button card badge avatar sheet dialog tabs input select table toast`

### 1.3 Theme and fonts
- ✅ Add Quicksand font from Google Fonts in `src/app/layout.tsx`
- ✅ Set dark mode as default — add `class="dark"` to html tag in layout.tsx
- ✅ Verify tweakcn CSS variables are present in `src/app/globals.css`
- ✅ Confirm primary green, dark background and card colors are correct in browser

### 1.4 Folder structure
- ✅ Create full folder structure as defined in CLAUDE.md
- ✅ Add placeholder `page.tsx` in every route so nothing 404s

### 1.5 Types and utilities
- ✅ Create `src/types/index.ts` with all types from CLAUDE.md (Match, User, Prediction, LeaderboardEntry, MatchStatus, PredictedWinner)
- ✅ Create `src/lib/utils.ts` with cn() helper
- ✅ Create `src/lib/mock-data.ts` with MOCK_MATCHES, MOCK_USER, MOCK_PREDICTIONS, MOCK_LEADERBOARD from CLAUDE.md

### 1.6 Git init
- ✅ Run `git init`, add .gitignore, make first commit `chore(setup): nextjs scaffold and tweakcn theme`

---

## PHASE 2 — Navigation Shell

### 2.1 Floating navbar
- ✅ Create `src/components/navbar.tsx`
- ✅ Floating pill shape — centered horizontally, NOT full width
- ✅ Fixed position, top: 1.5rem, z-index 50
- ✅ Frosted glass: backdrop-blur-md, bg-card/70, border border-border
- ✅ Logo: small green circle + "DRBL" bold text on left
- ✅ Nav links center: Matches · Leaderboard · My Space (hidden on mobile)
- ✅ Right side: trophy icon + "75 pts" mock points (clicking navigates to /myspace)
- ✅ Right side: avatar circle with initials "RM" mock user
- ✅ Active nav link uses primary color
- ✅ Verify navbar floats correctly over page content

### 2.2 Bottom nav (mobile)
- ✅ Create `src/components/bottom-nav.tsx`
- ✅ Fixed bottom, full width, visible only on mobile (hidden on md+)
- ✅ Three items: Matches (home icon) · Leaderboard (trophy icon) · My Space (user icon)
- ✅ Label + icon for each item
- ✅ Active item highlighted with primary green
- ✅ Correct active state based on current route

### 2.3 Main layout
- ✅ Create `src/app/(main)/layout.tsx`
- ✅ Includes navbar and bottom-nav components
- ✅ Sufficient top padding so content clears floating navbar
- ✅ Bottom padding on mobile so content clears bottom nav
- ✅ Dark background fills full viewport
- ✅ Test at 375px mobile width

### 2.4 Git commit
- ✅ Commit `feat(nav): floating pill navbar and mobile bottom nav`

---

## PHASE 3 — Home Page (Match Timeline)

### 3.1 Match card component
- ✅ Create `src/components/match-card.tsx`
- ✅ Props: match, userPrediction (optional)
- ✅ Top row: group/round label left, status badge right
- ✅ Center: home flag + team name, kickoff time or score in middle, away flag + team name
- ✅ Status badge variants: upcoming (blue), voting_open (green), locked (amber), completed (gray)

### 3.2 Match card — upcoming state
- ✅ Badge: "Voting opens in Xh" — calculate hours from kickoff minus 48hrs
- ✅ Shows kickoff time below teams
- ✅ No vote bar, no CTA button

### 3.3 Match card — voting_open, not voted
- ✅ Green "Voting open" badge
- ✅ "Cast your prediction" primary button at bottom
- ✅ NO vote % bar shown
- ✅ Button navigates to /match/[id]

### 3.4 Match card — voting_open, already voted
- ✅ Green "Voting open" badge
- ✅ Shows "You voted: 🇫🇷 France +1" with pencil edit icon
- ✅ NO vote % bar shown
- ✅ Clicking navigates to /match/[id] to edit

### 3.5 Match card — locked state
- ✅ Amber "Live" badge
- ✅ Three-segment vote % bar: home (primary green) / draw (muted gray) / away (secondary blue)
- ✅ % labels above each segment
- ✅ No CTA, no user prediction shown

### 3.6 Match card — completed state
- ✅ Gray "Completed" badge
- ✅ Final score shown center between teams
- ✅ Vote % bar shown
- ✅ User prediction result inline: "You predicted: 🇧🇷 Brazil +2 ✅ +15 pts" or ❌ "0 pts"

### 3.7 Home page layout
- ✅ Create `src/app/(main)/page.tsx`
- ✅ Page label: muted "FIFA WORLD CUP 2026 · OFFICE LEAGUE"
- ✅ Bold "Match timeline" heading
- ✅ Two toggle pills: Upcoming (default, primary green active) · Past
- ✅ Toggle switches between upcoming and past views

### 3.8 Upcoming tab
- ✅ Shows matches with status: upcoming, voting_open, locked
- ✅ Grouped by date with date label headers (TODAY / TOMORROW / date)
- ✅ Sorted soonest at top within each day
- ✅ Uses mock data showing all voting states

### 3.9 Past tab
- ✅ Shows matches with status: completed
- ✅ Grouped by date, most recent first (YESTERDAY / date / date)
- ✅ Each card shows result + vote % + user prediction outcome

### 3.10 Empty states
- ✅ Upcoming tab empty: "No upcoming matches" muted message
- ✅ Past tab empty: "No past matches yet" muted message

### 3.11 Mobile check
- ✅ Cards full width on mobile
- ✅ All text readable at 375px
- ✅ No horizontal overflow

### 3.12 Git commit
- ✅ Commit `feat(home): match timeline with all four card states`

---

## PHASE 4 — Match Detail Page

### 4.1 Match hero
- ✅ Create `src/app/(main)/match/[id]/page.tsx`
- ✅ Large hero: group + round label, status badge
- ✅ Two teams side by side: large flag emoji, bold team name
- ✅ Score center if completed, kickoff date/time if not
- ✅ Reads match id from URL, finds in mock data

### 4.2 Vote form component — base
- ✅ Create `src/components/vote-form.tsx`
- ✅ Three large toggle buttons: [Home Team] [Draw] [Away Team]
- ✅ Selected state uses primary green highlight
- ✅ Only one can be selected at a time

### 4.3 Vote form — goal difference
- ✅ Goal difference row appears when home or away selected
- ✅ Label: "Win by how many goals?"
- ✅ Pill options: 1 · 2 · 3 · 4 · 5+
- ✅ Goal difference row hidden completely when draw selected
- ✅ One pill selectable at a time

### 4.4 Vote form — knockout mode
- ✅ Draw button hidden when round is "Round of 16", "Quarter Final", "Semi Final", "Final"
- ✅ Only home and away options shown

### 4.5 Vote form — new prediction
- ✅ "Confirm prediction" button, primary green, full width
- ✅ Button disabled until winner AND goal difference selected (or draw selected)
- ✅ On click: console.log prediction object (no Supabase yet)
- ✅ Show success toast on submit

### 4.6 Vote form — edit existing prediction
- ✅ Form pre-filled with user's existing prediction from mock data
- ✅ Button text: "Update prediction"
- ✅ Muted note below: "Voting closes at kickoff · you can edit until then"

### 4.7 Voter reveal component — locked state
- ✅ Create `src/components/voter-reveal.tsx`
- ✅ Section label: "Who voted for who"
- ✅ Three columns: home team name / Draw / away team name
- ✅ Each column lists voter names + goal difference: "Rahul M. +2"
- ✅ Columns have subtle card backgrounds
- ✅ No ✅ ❌ shown yet
- ✅ Muted note: "Results and points will update once the match is completed"

### 4.8 Voter reveal component — completed state
- ✅ Winning column has subtle green tint background
- ✅ Each correct voter: "Rahul M. +2 ✅ 15 pts"
- ✅ Wrong voters: "Sneha K. ❌ 0 pts"
- ✅ Correct goal difference shows "+5 bonus" small badge
- ✅ Summary line: "247 voters · 62% got it right"

### 4.9 Page state routing
- ✅ voting_open status → show vote form
- ✅ locked status → show voter reveal (no results)
- ✅ completed status → show voter reveal (with results)
- ✅ Test all three states with different mock match IDs

### 4.10 Mobile
- ✅ Hero stacks vertically on mobile
- ✅ Voter columns scroll horizontally on mobile or stack
- ✅ Vote form full width on mobile

### 4.11 Git commit
- ✅ Commit `feat(match): vote form and voter reveal columns`

---

## PHASE 5 — Leaderboard Page

### 5.1 Leaderboard list
- ✅ Create `src/app/(main)/leaderboard/page.tsx`
- ✅ Page header: muted label + bold "Leaderboard"
- ✅ Two stat chips: "1,000 players" · "12 matches played"
- ✅ Scrollable list, no rank numbers
- ✅ Sorted by total points desc, alphabetical tie-break

### 5.2 Leaderboard row
- ✅ Avatar circle with initials, varied colors across users
- ✅ Name medium weight + "8 of 12 correct" muted below
- ✅ Total points right: large bold + "pts" muted
- ✅ "View predictions" outline button far right

### 5.3 Top three treatment
- ✅ Top 3 rows slightly elevated card style
- ✅ Gold / silver / bronze dot accent on avatar circle
- ✅ Subtle — not flashy

### 5.4 Current user highlight
- ✅ Current user row has subtle green left border accent
- ✅ User can spot themselves instantly without rank

### 5.5 Predictions modal
- ✅ Create `src/components/predictions-modal.tsx`
- ✅ Uses shadcn Sheet component
- ✅ Header: user avatar + name
- ✅ List of completed matches: Match · Predicted · Result · Points · ✅ ❌
- ✅ Scrollable content
- ✅ Clean close button

### 5.6 Mobile
- ✅ "View predictions" becomes eye icon button on mobile
- ✅ Sheet becomes bottom sheet on mobile
- ✅ Rows full width, readable at 375px

### 5.7 Git commit
- ✅ Commit `feat(leaderboard): list with predictions modal`

---

## PHASE 6 — My Space Page

### 6.1 Pending votes reminder
- ✅ Create `src/components/pending-votes.tsx`
- ✅ Amber tinted card, warning icon
- ✅ "You have X matches to predict" heading
- ✅ Lists each pending match: name · group · "Closes in Xh"
- ✅ Each row taps to /match/[id]
- ✅ Shows "✅ All caught up!" chip when nothing pending
- ✅ Hidden completely when no voting_open matches exist

### 6.2 Profile card
- ✅ Large avatar circle with initials
- ✅ Name bold, email muted below
- ✅ Total points large + bold + trophy icon on right
- ✅ Three stat chips: "12 predicted" · "8 correct" · "67% accuracy"

### 6.3 Active predictions section
- ✅ Label + muted subtext
- ✅ Cards: match teams + flags, user's vote, time until lock, edit button
- ✅ Edit button navigates to /match/[id]
- ✅ Empty state: "No active predictions right now"

### 6.4 Prediction history section
- ✅ Label: "Prediction history"
- ✅ Divider-separated rows (not full cards)
- ✅ Teams · Prediction · Result · Points (green/muted) · ✅ ❌
- ✅ Empty state if no completed predictions

### 6.5 New user empty state
- ✅ If zero predictions exist: skip sections 3 and 4
- ✅ Show centered icon + message + "Go to matches" button

### 6.6 My Space page assembly
- ✅ Create `src/app/(main)/myspace/page.tsx`
- ✅ Assemble all four sections in order
- ✅ Sections are conditional — only render when data exists

### 6.7 Mobile
- ✅ Profile card stacks vertically on mobile
- ✅ All sections full width
- ✅ Pending reminder full width amber banner

### 6.8 Git commit
- ✅ Commit `feat(myspace): profile pending votes and history`

---

## PHASE 7 — Admin Panel

### 7.1 Admin layout
- ✅ Create `src/app/admin/layout.tsx`
- ✅ Simple sidebar or top bar — different from main layout
- ✅ "DRBL Admin" label
- ✅ Links: Match Management · Results
- ✅ Redirect non-admins to home (check mock is_admin flag for now)

### 7.2 Match management page
- ✅ Create `src/app/admin/matches/page.tsx`
- ✅ Table: Teams, Kickoff, Round/Group, Status, Actions
- ✅ Uses shadcn Table component

### 7.3 Create match form
- ✅ "Add match" button opens shadcn Dialog
- ✅ Fields: Home team, Away team, Home flag emoji, Away flag emoji, Kickoff date, Kickoff time, Round (Select dropdown), Group name
- ✅ Save button — console.log for now
- ✅ Form validation — all fields required

### 7.4 Edit and delete
- ✅ Edit action opens same dialog pre-filled
- ✅ Delete action shows confirm dialog before removing from mock data
- ✅ Status badge shown per row

### 7.5 Lock/unlock toggle
- ✅ Toggle button per match row
- ✅ Locked → shows locked icon + "Unlock" option
- ✅ Unlocked → shows "Lock" option
- ✅ Updates mock status locally

### 7.6 Results page
- ✅ Create `src/app/admin/results/page.tsx`
- ✅ Shows only locked and completed matches
- ✅ Locked: score input fields (home score, away score) + "Approve result" button
- ✅ Completed: shows result + "Override" button
- ✅ Approve shows success toast (no points calc yet)

### 7.7 Git commit
- ✅ Commit `feat(admin): match management and results approval`

---

## PHASE 8 — Supabase Setup

### 8.1 Supabase project
- [ ] Create project at supabase.com
- [ ] Copy project URL and anon key
- [ ] Create `.env.local` from `.env.example`
- [ ] Install: `npm install @supabase/supabase-js @supabase/ssr`

### 8.2 Supabase clients
- [ ] Create `src/lib/supabase.ts` — browser client
- [ ] Create `src/lib/supabase-server.ts` — server client for API routes
- [ ] Test connection with a simple query

### 8.3 Run schema
- [ ] Paste `docs/schema.sql` into Supabase SQL editor
- [ ] Verify all tables created: users, matches, predictions
- [ ] Verify leaderboard view created
- [ ] Verify calculate_points function created
- [ ] Verify RLS policies applied

### 8.4 Git commit
- [ ] Commit `chore(supabase): client setup and schema`

---

## PHASE 9 — Microsoft SSO Auth

### 9.1 Azure app registration
- [ ] Register app in Azure Portal
- [ ] Add redirect URI: http://localhost:3000/auth/callback
- [ ] Copy client ID and client secret
- [ ] Add to Supabase Auth → Microsoft provider

### 9.2 Auth routes
- [ ] Create `src/app/(auth)/login/page.tsx` — Microsoft SSO button
- [ ] Create `src/app/auth/callback/route.ts` — handles OAuth callback
- [ ] Create middleware.ts — protect all (main) and admin routes, redirect to /login

### 9.3 Auth context
- [ ] Create `src/lib/auth.ts` — helper to get current user server-side
- [ ] Update navbar to show real user name and points
- [ ] Update admin layout to check real is_admin flag

### 9.4 Git commit
- [ ] Commit `feat(auth): microsoft SSO login and route protection`

---

## PHASE 10 — Wire Home Page

### 10.1 Matches API route
- [ ] Create `src/app/api/matches/route.ts` — GET all matches
- [ ] Returns matches sorted by kickoff_at
- [ ] Auto-updates status based on kickoff_at time (upcoming → voting_open at 48hrs before)

### 10.2 Home page data
- [ ] Replace mock data with real Supabase fetch
- [ ] Upcoming tab: fetch upcoming + voting_open + locked matches
- [ ] Past tab: fetch completed matches
- [ ] Add loading skeleton state for cards

### 10.3 User predictions on home
- [ ] Fetch current user's predictions for displayed matches
- [ ] Show correct voted/not-voted state on each card

### 10.4 Git commit
- [ ] Commit `feat(home): wire match timeline to supabase`

---

## PHASE 11 — Wire Match Detail + Voting

### 11.1 Single match API
- [ ] Create `src/app/api/matches/[id]/route.ts` — GET single match with predictions + voters

### 11.2 Predictions API
- [ ] Create `src/app/api/predictions/route.ts`
- [ ] POST — create or update prediction (upsert)
- [ ] Validate: match must be voting_open, user can only predict once
- [ ] Return updated prediction

### 11.3 Wire vote form
- [ ] Replace console.log with real POST to /api/predictions
- [ ] Handle success: show toast, refresh voter counts
- [ ] Handle error: show error toast

### 11.4 Wire voter reveal
- [ ] Fetch real voter list from match API
- [ ] Show real % bars on locked/completed matches
- [ ] Show real names and predictions in columns

### 11.5 Git commit
- [ ] Commit "feat: match detail and voting wired to supabase"

---

## PHASE 12 — Wire Leaderboard + My Space

### 12.1 Leaderboard API
- [ ] Create `src/app/api/leaderboard/route.ts` — query leaderboard view
- [ ] Returns users sorted by total_points desc, name asc

### 12.2 Wire leaderboard
- [ ] Replace mock leaderboard with real data
- [ ] Wire predictions modal to fetch real prediction history per user
- [ ] Add loading state

### 12.3 My Space API
- [ ] Create `src/app/api/myspace/route.ts`
- [ ] Returns current user's stats + active predictions + completed predictions

### 12.4 Wire My Space
- [ ] Replace mock data with real fetch
- [ ] Pending votes: real open matches user hasn't predicted
- [ ] Active predictions: real voted matches not yet kicked off
- [ ] History: real completed match predictions

### 12.5 Git commit
- [ ] Commit "feat: leaderboard and myspace wired to supabase"

---

## PHASE 13 — Wire Admin Panel

### 13.1 Admin matches API
- [ ] Create `src/app/api/admin/matches/route.ts`
- [ ] POST — create match
- [ ] PATCH — edit match, lock/unlock
- [ ] DELETE — delete match

### 13.2 Wire admin match management
- [ ] Create/edit/delete forms call real API
- [ ] Lock/unlock calls real API
- [ ] Table shows real matches from Supabase

### 13.3 Admin results API
- [ ] Create `src/app/api/admin/results/[id]/route.ts`
- [ ] POST — set scores, change status to completed, call calculate_points()

### 13.4 Wire admin results
- [ ] Approve result calls real API
- [ ] Points automatically calculated on approval
- [ ] Override result re-runs calculate_points()

### 13.5 Git commit
- [ ] Commit "feat: admin panel wired to supabase"

---

## PHASE 14 — Polish

### 14.1 Loading states
- [ ] Add skeleton loaders for match cards on home page
- [ ] Add skeleton for leaderboard rows
- [ ] Add loading spinner for vote submission

### 14.2 Error states
- [ ] Network error on home: "Unable to load matches" with retry button
- [ ] Failed vote submission: clear error toast
- [ ] 404 on /match/[id] if match doesn't exist

### 14.3 Mobile QA pass
- [ ] Test every page at 375px
- [ ] Test every page at 768px tablet
- [ ] Fix any overflow, font size, or tap target issues
- [ ] Ensure bottom nav doesn't overlap content

### 14.4 Status auto-update
- [ ] Verify status calculation based on kickoff_at is accurate
- [ ] Test voting_open triggers correctly at 48hrs before kickoff
- [ ] Test locked triggers at kickoff time

### 14.5 Git commit
- [ ] Commit "polish: loading states, error states, mobile QA"

---

## PHASE 15 — Deploy

### 15.1 Vercel setup
- [ ] Push repo to GitHub
- [ ] Connect repo to Vercel
- [ ] Add all env vars to Vercel dashboard
- [ ] Add production redirect URI to Azure app registration

### 15.2 Supabase production
- [ ] Add Vercel production URL to Supabase allowed URLs
- [ ] Test Microsoft SSO on production URL

### 15.3 Smoke test
- [ ] Login works
- [ ] Can view matches
- [ ] Can cast a prediction
- [ ] Leaderboard loads
- [ ] My Space loads
- [ ] Admin can create a match and approve a result

### 15.4 Git commit
- [ ] Commit "deploy: production ready"

---

## Summary

```
Phase 1   Project setup          6 sections
Phase 2   Navigation shell       4 sections
Phase 3   Home page             12 sections
Phase 4   Match detail          11 sections
Phase 5   Leaderboard            7 sections
Phase 6   My Space               8 sections
Phase 7   Admin panel            7 sections
Phase 8   Supabase setup         4 sections
Phase 9   Auth                   4 sections
Phase 10  Wire home              4 sections
Phase 11  Wire match detail      5 sections
Phase 12  Wire leaderboard       5 sections
Phase 13  Wire admin             5 sections
Phase 14  Polish                 5 sections
Phase 15  Deploy                 4 sections
```
