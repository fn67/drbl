import { createClient } from '@/lib/supabase-server'
import { getUser } from '@/lib/auth'
import { computeStatus } from '@/lib/utils'
import { MatchTimeline } from '@/components/match-timeline'

export default async function HomePage() {
  const supabase = await createClient()
  const user = await getUser()

  const [{ data: rawUpcoming }, { data: rawPast }] = await Promise.all([
    supabase.from('matches').select('*').neq('status', 'completed').order('kickoff_at'),
    supabase.from('matches').select('*').eq('status', 'completed').order('kickoff_at', { ascending: false }).limit(20),
  ])

  const { data: userPredictions } = user
    ? await supabase.from('predictions').select('*').eq('user_id', user.id)
    : { data: [] }

  const upcomingMatches = (rawUpcoming ?? []).map(m => ({ ...m, status: computeStatus(m) }))
  const pastMatches = (rawPast ?? []).map(m => ({ ...m, status: computeStatus(m) }))

  const lockedIds = upcomingMatches.filter(m => m.status === 'locked').map(m => m.id)
  const pastIds = pastMatches.map(m => m.id)
  const voteIds = [...lockedIds, ...pastIds]

  const { data: allVotes } = voteIds.length
    ? await supabase.from('predictions').select('match_id, predicted_winner').in('match_id', voteIds)
    : { data: [] }

  const voteCounts: Record<string, { home: number; draw: number; away: number }> = {}
  for (const v of allVotes ?? []) {
    if (!voteCounts[v.match_id]) voteCounts[v.match_id] = { home: 0, draw: 0, away: 0 }
    voteCounts[v.match_id][v.predicted_winner as 'home' | 'draw' | 'away']++
  }

  return (
    <MatchTimeline
      upcomingMatches={upcomingMatches}
      pastMatches={pastMatches}
      predictions={userPredictions ?? []}
      voteCounts={voteCounts}
    />
  )
}
