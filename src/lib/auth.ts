import { createClient } from '@/lib/supabase-server'
import type { User } from '@/types'

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user: authUser }, error } = await supabase.auth.getUser()
  if (error || !authUser) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!data) return null

  // The trigger falls back to email when full_name is absent from the OAuth metadata.
  // If that happened, pull the real name from user_metadata and fix the row.
  const meta = authUser.user_metadata ?? {}
  const metaName: string | undefined =
    meta.full_name || meta.name || meta.display_name || undefined

  if (metaName && data.name === data.email) {
    await supabase.from('users').update({ name: metaName }).eq('id', authUser.id)
    return { ...data, name: metaName }
  }

  return data
}
