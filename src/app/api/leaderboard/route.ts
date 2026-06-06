import { createClient } from '@/lib/supabase-server'

const PAGE_SIZE = 50

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10))

  const supabase = await createClient()

  let query = supabase
    .from('leaderboard')
    .select('*', { count: 'exact' })
    .order('total_points', { ascending: false })
    .order('name', { ascending: true })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  } else {
    query = query.range(offset, offset + PAGE_SIZE - 1)
  }

  const { data, error, count } = await query

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ entries: data ?? [], total: count ?? 0 })
}
