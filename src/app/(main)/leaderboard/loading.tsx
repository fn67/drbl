import { LeaderboardRowSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ width: 180, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.6s ease-in-out infinite', marginBottom: 10 }} />
        <div style={{ width: 180, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.6s ease-in-out infinite', marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          {[120, 160].map(w => <div key={w} style={{ width: w, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.6s ease-in-out infinite' }} />)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: 8 }).map((_, i) => <LeaderboardRowSkeleton key={i} />)}
      </div>
    </div>
  )
}
