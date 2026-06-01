import { createClient } from '@/lib/supabase-server'
import { computeStatus } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const supabase = await createClient()

  const query = supabase
    .from('predictions')
    .select('*, matches(*)')
    .order('created_at', { ascending: false })

  const { data, error } = userId
    ? await query.eq('user_id', userId)
    : await query

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data ?? [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId, predictedWinner, goalDifference } = await request.json()

  const { data: match } = await supabase
    .from('matches')
    .select('status, kickoff_at, manually_locked')
    .eq('id', matchId)
    .single()

  if (!match || computeStatus(match) !== 'voting_open') {
    return Response.json({ error: 'Match is not open for predictions' }, { status: 422 })
  }

  const { data, error } = await supabase
    .from('predictions')
    .upsert(
      { user_id: user.id, match_id: matchId, predicted_winner: predictedWinner, goal_difference: goalDifference ?? null },
      { onConflict: 'user_id,match_id' }
    )
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}
