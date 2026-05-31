import { MOCK_LEADERBOARD } from '@/lib/mock-data'
import { LeaderboardList } from '@/components/leaderboard-list'

export default function LeaderboardPage() {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
          FIFA World Cup 2026 · Office League
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.5, marginBottom: 14 }}>
          Leaderboard
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { value: '1,000', label: 'players' },
            { value: '12',    label: 'matches played' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)',
            }}>
              <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>{value}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <LeaderboardList entries={MOCK_LEADERBOARD} currentUserId="user-1" />
    </div>
  )
}
