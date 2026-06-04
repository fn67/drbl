# DRBL — Task List

Claude Code reads this file at the start of every session.
Pick the next unchecked task, build it, mark it ✅, move to next.
Never skip a task. Never mark done unless working and tested on mobile.
Never commit automatically — wait for explicit instruction unless in a long autonomous build session.

---

## PHASE 1 — Project Setup ✅
- ✅ Next.js scaffold with TypeScript, Tailwind, App Router
- ✅ shadcn init and tweakcn theme applied
- ✅ shadcn components installed
- ✅ Quicksand font added, dark mode as default
- ✅ Full folder structure created
- ✅ TypeScript types in src/types/index.ts
- ✅ Mock data in src/lib/mock-data.ts
- ✅ Git initialized, first commit made

## PHASE 2 — Navigation Shell ✅
- ✅ Floating pill navbar (frosted glass, fixed position)
- ✅ Mobile bottom nav bar
- ✅ Main layout with navbar and bottom nav
- ✅ Committed: `feat(nav): floating pill navbar and mobile bottom nav`

## PHASE 3 — Home Page ✅
- ✅ Match card component with all four status variants
- ✅ Upcoming tab (today first, sorted by soonest)
- ✅ Past tab (most recent first)
- ✅ Date group headers
- ✅ Empty states
- ✅ Mobile responsive
- ✅ Committed: `feat(home): match timeline with all four card states`

## PHASE 4 — Match Detail Page ✅
- ✅ Match hero (teams, flags, kickoff, status badge)
- ✅ Vote form (winner toggle + goal difference pills)
- ✅ Knockout mode (no draw option)
- ✅ Voter reveal — locked state (three columns)
- ✅ Voter reveal — completed state (with results and points)
- ✅ Mobile responsive
- ✅ Committed: `feat(match): vote form and voter reveal columns`

## PHASE 5 — Leaderboard Page ✅
- ✅ Leaderboard list (no rank, alphabetical tie-break)
- ✅ Top 3 elevated treatment
- ✅ Current user row highlighted
- ✅ View predictions slide-over modal
- ✅ Bottom sheet on mobile
- ✅ Committed: `feat(leaderboard): list with predictions modal`

## PHASE 6 — My Space Page ✅
- ✅ Pending votes reminder (amber, conditional)
- ✅ Profile card (avatar, name, email, points, stats)
- ✅ Active predictions section
- ✅ Prediction history section
- ✅ Empty states
- ✅ Committed: `feat(myspace): profile pending votes and history`

## PHASE 7 — Admin Panel ✅
- ✅ Admin layout with sidebar
- ✅ Match management page (create, edit, delete, lock/unlock)
- ✅ Results approval page
- ✅ Committed: `feat(admin): match management and results approval`

## PHASE 8 — Supabase Setup ✅
- ✅ Supabase project created (personal account for dev)
- ✅ schema.sql run — users, matches, predictions tables created
- ✅ Leaderboard view created
- ✅ calculate_points() function created
- ✅ RLS policies applied
- ✅ Supabase browser and server clients created
- ✅ Committed: `chore(supabase): client setup and schema`

## PHASE 9 — Microsoft SSO Auth ✅
- ✅ Azure app registered (personal account for dev)
- ✅ Redirect URIs added (Supabase callback + localhost)
- ✅ Microsoft provider enabled in Supabase Auth
- ✅ Login page with Microsoft SSO button
- ✅ Auth callback route
- ✅ Middleware protecting all main and admin routes
- ✅ Auth helper created
- ✅ Committed: `feat(auth): supabase clients, microsoft SSO and route protection`

## PHASE 10 — Wire Home Page ✅
- ✅ Matches API route
- ✅ Home page connected to Supabase
- ✅ Loading skeleton states
- ✅ Committed: `feat(home+match): wire match timeline and voting to supabase`

## PHASE 11 — Wire Match Detail + Voting ✅
- ✅ Single match API with predictions
- ✅ Predictions API (create/update)
- ✅ Vote form wired to real API
- ✅ Voter reveal with real data

## PHASE 12 — Wire Leaderboard + My Space ✅
- ✅ Leaderboard API connected
- ✅ Predictions modal with real history
- ✅ My Space API connected
- ✅ Pending votes from real data
- ✅ Committed: `feat(leaderboard+myspace): wire to supabase with real data`

## PHASE 13 — Wire Admin Panel ✅
- ✅ Admin matches API wired (create, edit, delete, lock/unlock)
- ✅ Results approval wired (triggers calculate_points)
- ✅ Committed: `feat(admin): wire match management and results to supabase`

## PHASE 14 — Polish ✅
- ✅ Loading states and skeletons
- ✅ Mobile QA pass
- ✅ Status auto-update on page load
- ✅ Committed: `polish: loading skeletons, mobile QA, status auto-update`

---

## POST-LAUNCH TWEAKS

### Auth Fixes ✅
- ✅ Fixed user name showing as email after Microsoft SSO
- ✅ Removed manual user creation — trigger handles it
- ✅ handle_new_user trigger updated to use split_part(email, '@', 1) as fallback name
- ✅ Committed: `fix(auth): resolve user name showing as email after Microsoft SSO`
- ✅ Committed: `fix(auth): remove manual name-patching, trust handle_new_user trigger`

### Navigation ✅
- ✅ Admin link added to navbar for is_admin = true users
- ✅ Committed: `feat(nav): show Admin link for admin users`

### Logout ✅
- ✅ Avatar dropdown in navbar with name, email, logout (desktop)
- ✅ Log out button at bottom of My Space (mobile only)
- ✅ Committed: `feat(auth): avatar dropdown menu and My Space logout button`
- ✅ Committed: `fix(myspace): hide logout button on desktop, mobile only`

### Admin Panel ✅
- ✅ Searchable team dropdowns using teams.ts
- ✅ Group dropdown auto-hides for knockout rounds
- ✅ Flag emoji field removed from teams.ts
- ✅ Committed: `feat(admin): team picker with search and group dropdown for match form`

### Flags ✅
- ✅ Replaced emoji flags with flag-icons library
- ✅ Circular style applied (fis class + border-radius 50%)
- ✅ Flag emoji removed from Team interface and TEAMS array
- ✅ Committed: `feat(flags): replace emoji with flag-icons circular flags`
- ⏳ White stroke around circular flags — deferred post-launch

### UI Tweaks (branch: ui-tweaks) 🔄
- ✅ My Space active prediction card restructured:
  Row 1: team names + vs (full width)
  Row 2: pick badge + lock time + edit button
- ✅ Edit button made smaller
- ✅ YOUR PICK pill made smaller
- ✅ Committed: `fix(myspace): restructure active prediction card layout`
- [ ] Further tweaks TBD on ui-tweaks branch

### Test Auth (branch: test-auth) — NOT MERGING
- ✅ Mock employee validation middleware created
- ✅ Rejects non @company.com emails with access denied message
- ✅ For understanding the flow only — real integration needs IT team API details

---

## REMAINING TASKS

### Seed Scripts
- [ ] Create scripts/seed.ts — 20 matches, 10 users, predictions
- [ ] Create scripts/clear.ts — wipe all seeded data
- [ ] Add npm run seed and npm run clear to package.json
- [ ] Test seed runs cleanly
- [ ] Test clear runs cleanly

### UI Polish (ui-tweaks branch)
- [ ] Merge ui-tweaks to dev when all tweaks are confirmed
- [ ] White stroke around circular flags (post-launch)

### Pre Go-Live
- [ ] Company Supabase account created, schema deployed
- [ ] Company Azure AD app registered by IT team
- [ ] Azure credentials updated in Supabase Auth
- [ ] Vercel account created, env vars configured
- [ ] Production deployment via vercel --prod
- [ ] All 104 match data seeded via Postman or admin panel
- [ ] Smoke test — login, predict, leaderboard, admin, points
- [ ] Internal announcement sent