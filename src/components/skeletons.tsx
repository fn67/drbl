const pulse = { animation: 'pulse 1.6s ease-in-out infinite' } as React.CSSProperties
const shimmer = (w: string | number, h: number, r = 8) => ({
  width: w, height: h, borderRadius: r,
  background: 'rgba(255,255,255,0.06)',
  ...pulse,
}) as React.CSSProperties

export function MatchCardSkeleton() {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={shimmer(80, 14)} />
        <div style={shimmer(70, 20, 999)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={shimmer(44, 44, 10)} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={shimmer('60%', 14)} />
          <div style={shimmer('40%', 12)} />
        </div>
        <div style={shimmer(48, 48, 14)} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={shimmer('60%', 14)} />
          <div style={shimmer('40%', 12)} />
        </div>
        <div style={shimmer(44, 44, 10)} />
      </div>
    </div>
  )
}

export function LeaderboardRowSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderRadius: 'var(--radius)', background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div style={shimmer(44, 44, 999)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={shimmer('50%', 14)} />
        <div style={shimmer('35%', 12)} />
      </div>
      <div style={shimmer(60, 28, 6)} />
      <div style={shimmer(110, 32, 999)} />
    </div>
  )
}
