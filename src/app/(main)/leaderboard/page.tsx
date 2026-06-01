import { createClient } from '@/lib/supabase-server'
import { getUser } from '@/lib/auth'
import { LeaderboardList } from '@/components/leaderboard-list'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const user = await getUser()

  const [{ data: entries }, { data: matchCount }] = await Promise.all([
    supabase.from('leaderboard').select('*'),
    supabase.from('matches').select('id', { count: 'exact' }).eq('status', 'completed'),
  ])

  const playerCount = (entries ?? []).length
  const completedCount = (matchCount as unknown as { count: number } | null)?.count ?? 0

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
            { value: playerCount.toLocaleString(), label: 'players' },
            { value: String(completedCount),       label: 'matches played' },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)' }}>
              <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>{value}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <LeaderboardList entries={entries ?? []} currentUserId={user?.id ?? ''} />
    </div>
  )
}
