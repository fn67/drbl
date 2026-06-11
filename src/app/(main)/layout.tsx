export const dynamic = 'force-dynamic'

import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { getInitials } from '@/lib/utils'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  const initials = user?.name ? getInitials(user.name) : '?'

  let points = 0
  if (user) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('leaderboard')
      .select('total_points')
      .eq('user_id', user.id)
      .single()
    points = (data?.total_points as number) ?? 0
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar points={points} userInitials={initials} userName={user?.name} userEmail={user?.email} isAdmin={user?.is_admin} />
      <main className="pt-24 pb-24 md:pb-8 px-4 max-w-4xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
