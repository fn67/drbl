import { createClient } from '@/lib/supabase-server'
import { computeStatus } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()

  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .order('kickoff_at')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const enriched = (matches ?? []).map(m => ({ ...m, status: computeStatus(m) }))
  return Response.json(enriched)
}
