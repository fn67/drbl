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

  return <MatchTimeline matches={matches} predictions={predictions ?? []} />
}
