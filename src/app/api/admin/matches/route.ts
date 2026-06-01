import { createClient } from '@/lib/supabase-server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  return (data as { is_admin: boolean } | null)?.is_admin ? user : null
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { data, error } = await supabase.from('matches').insert(body).select().single()
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...updates } = await request.json()
  const { data, error } = await supabase.from('matches').update(updates).eq('id', id).select().single()
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  const { error } = await supabase.from('matches').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ ok: true })
}
