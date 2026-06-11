import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'DRBL | Leaderboard' }
import { getUser } from '@/lib/auth'
import { LeaderboardClient } from '@/components/leaderboard-client'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const user = await getUser()

  const [leaderboardResult, matchResult] = await Promise.all([
    supabase
      .from('leaderboard')
      .select('*', { count: 'exact' })
      .order('total_points', { ascending: false })
      .order('name', { ascending: true })
      .range(0, 49),
    supabase.from('matches').select('id', { count: 'exact' }).eq('status', 'completed'),
  ])

  const entries = leaderboardResult.data ?? []
  const playerCount = leaderboardResult.count ?? 0
  const completedCount = matchResult.count ?? 0

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
          FIFA World Cup 2026 · Office League
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.5, marginBottom: 14 }}>
          Leaderboard
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { value: playerCount.toLocaleString(), label: 'users' },
            { value: String(completedCount),       label: 'matches completed' },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)' }}>
              <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>{value}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <LeaderboardClient
        initialEntries={entries}
        totalCount={playerCount}
        currentUserId={user?.id ?? ''}
      />
    </div>
  )
}
