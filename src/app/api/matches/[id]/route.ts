import { createClient } from '@/lib/supabase-server'
import { computeStatus } from '@/lib/utils'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: match, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !match) return Response.json({ error: 'Not found' }, { status: 404 })

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*, users(name, email)')
    .eq('match_id', id)

  return Response.json({ match: { ...match, status: computeStatus(match) }, predictions: predictions ?? [] })
}
