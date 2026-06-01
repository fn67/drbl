import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data ?? [])
}
