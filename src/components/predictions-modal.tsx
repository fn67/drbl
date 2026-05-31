'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { LeaderboardEntry } from '@/types'

interface PredictionRow {
  match: string
  prediction: string
  result: string
  pts: number
  correct: boolean
}

interface PredictionsModalProps {
  user: (LeaderboardEntry & { initials: string; color: string; predictions: PredictionRow[] }) | null
  open: boolean
  onClose: () => void
}

export function PredictionsModal({ user, open, onClose }: PredictionsModalProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        maxWidth: 540, width: '100%',
        padding: 0,
      }}>
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <SheetHeader style={{ padding: '20px 22px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 999,
                  background: user.color,
                  color: 'rgba(0,0,0,0.72)', fontWeight: 700, fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {user.initials}
                </div>
                <div>
                  <SheetTitle style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>
                    {user.name}
                  </SheetTitle>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 2 }}>
                    {user.total_points.toLocaleString()} pts · {user.correct_predictions} of {user.total_predictions} correct
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Subtitle */}
            <div style={{
              padding: '14px 18px 6px',
              fontSize: 11.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
            }}>
              Completed matches · {user.predictions.length}
            </div>

            {/* Prediction list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {user.predictions.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 16px',
                  borderRadius: 'calc(var(--radius) - 4px)',
                  background: p.correct ? 'rgba(98,200,150,0.06)' : 'rgba(255,255,255,0.02)',
                  border: p.correct ? '1px solid rgba(98,200,150,0.18)' : '1px solid var(--border)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{p.match}</div>
                    <div style={{
                      display: 'flex', gap: 12, marginTop: 4,
                      fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', flexWrap: 'wrap',
                    }}>
                      <span>Predicted: <span style={{ color: 'var(--foreground)' }}>{p.prediction}</span></span>
                      <span>Result: <span style={{ color: 'var(--foreground)' }}>{p.result}</span></span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{p.correct ? '✅' : '❌'}</span>
                    <span style={{
                      fontSize: 12.5, fontWeight: 700,
                      color: p.correct ? 'oklch(0.78 0.13 164)' : 'var(--muted-foreground)',
                    }}>{p.correct ? `+${p.pts}` : '0'} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
