import { MatchCardSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ width: 180, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.6s ease-in-out infinite', marginBottom: 10 }} />
        <div style={{ width: 220, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.6s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => <MatchCardSkeleton key={i} />)}
      </div>
    </div>
  )
}
