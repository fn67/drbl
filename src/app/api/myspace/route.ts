import { createClient } from '@/lib/supabase-server'
import { NO_STORE_HEADERS } from '@/lib/http-headers'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE_HEADERS })

  const [
    { data: profile },
    { data: predictions },
    { data: matches },
    { data: leaderboard },
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('predictions').select('*, matches(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('matches').select('*').order('kickoff_at'),
    supabase.from('leaderboard').select('total_points').eq('user_id', user.id).single(),
  ])

  return Response.json({ profile, predictions: predictions ?? [], matches: matches ?? [], totalPoints: leaderboard?.total_points ?? 0 }, { headers: NO_STORE_HEADERS })
}
