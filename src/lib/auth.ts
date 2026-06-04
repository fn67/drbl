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

  return data ?? null
}
