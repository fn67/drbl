import { createClient } from '@/lib/supabase-server'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!(profile as { is_admin: boolean } | null)?.is_admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { homeScore, awayScore, winnerOverride } = await request.json()

  const { error: updateError } = await supabase
    .from('matches')
    .update({
      status: 'completed',
      home_score: homeScore,
      away_score: awayScore,
      winner_override: winnerOverride ?? null,
    })
    .eq('id', id)

  if (updateError) return Response.json({ error: updateError.message }, { status: 400 })

  const { error: calcError } = await supabase.rpc('calculate_points', { match_id_input: id })
  if (calcError) return Response.json({ error: calcError.message }, { status: 500 })

  return Response.json({ ok: true })
}
