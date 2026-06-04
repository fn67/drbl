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

// ── Main ──────────────────────────────────────────────────────────────────────

async function clear() {
  console.log('🗑️  Clearing seeded data...\n')

  // 1. Delete all predictions
  const { error: predErr } = await sb
    .from('predictions')
    .delete()
    .gte('created_at', '1970-01-01')
  if (predErr) throw new Error(`delete predictions: ${predErr.message}`)
  console.log('  ✓ Predictions cleared')

  // 2. Delete all matches
  const { error: matchErr } = await sb
    .from('matches')
    .delete()
    .gte('created_at', '1970-01-01')
  if (matchErr) throw new Error(`delete matches: ${matchErr.message}`)
  console.log('  ✓ Matches cleared')

  // 3. Find and delete seed users from auth (identified by @drbl-seed.test)
  const { data: { users }, error: listErr } = await sb.auth.admin.listUsers({ perPage: 1000 })
  if (listErr) throw new Error(`list users: ${listErr.message}`)

  const seedUsers = users.filter(u => u.email?.endsWith('@drbl-seed.test'))
  if (seedUsers.length === 0) {
    console.log('  ✓ No seed users found')
  } else {
    for (const u of seedUsers) {
      const { error } = await sb.auth.admin.deleteUser(u.id)
      if (error) throw new Error(`deleteUser ${u.email}: ${error.message}`)
    }
    console.log(`  ✓ ${seedUsers.length} seed users deleted`)
  }

  console.log('\n✅ Clear complete')
}

clear().catch(err => {
  console.error('\n❌', err.message)
  process.exit(1)
})
