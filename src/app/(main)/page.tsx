import { createClient } from '@/lib/supabase-server'
import { getUser } from '@/lib/auth'
import { computeStatus } from '@/lib/utils'
import { MatchTimeline } from '@/components/match-timeline'

export default async function HomePage() {
  const supabase = await createClient()
  const user = await getUser()

  const { data: rawMatches } = await supabase
    .from('matches')
    .select('*')
    .order('kickoff_at')

  const matches = (rawMatches ?? []).map(m => ({ ...m, status: computeStatus(m) }))

  const { data: predictions } = user
    ? await supabase.from('predictions').select('*').eq('user_id', user.id)
    : { data: [] }

  const { data: allVotes } = await supabase
    .from('predictions')
    .select('match_id, predicted_winner')

  const voteCounts: Record<string, { home: number; draw: number; away: number }> = {}
  for (const v of allVotes ?? []) {
    if (!voteCounts[v.match_id]) voteCounts[v.match_id] = { home: 0, draw: 0, away: 0 }
    voteCounts[v.match_id][v.predicted_winner as 'home' | 'draw' | 'away']++
  }

  return <MatchTimeline matches={matches} predictions={predictions ?? []} voteCounts={voteCounts} />
}
