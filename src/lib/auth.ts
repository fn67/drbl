import { cache } from 'react'
import { createClient } from '@/lib/supabase-server'
import type { User } from '@/types'

export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return data ?? null
})
