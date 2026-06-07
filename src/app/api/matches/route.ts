import { createClient } from '@/lib/supabase-server'
import { computeStatus } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const offsetParam = searchParams.get('offset')

  const supabase = await createClient()

  if (offsetParam !== null) {
    const offset = parseInt(offsetParam, 10)
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'completed')
      .order('kickoff_at', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + 19)

    if (error) return Response.json({ error: error.message }, { status: 500 })
    const enriched = (data ?? []).map(m => ({ ...m, status: computeStatus(m) }))
    return Response.json(enriched)
  }

  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .order('kickoff_at')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const enriched = (matches ?? []).map(m => ({ ...m, status: computeStatus(m) }))
  return Response.json(enriched)
}
