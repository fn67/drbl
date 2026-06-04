'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { LeaderboardEntry } from '@/types'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

interface PredictionRow {
  match: string
  prediction: string
  result: string
  pts: number
  correct: boolean
}

interface PredictionsModalProps {
  user: (LeaderboardEntry & { initials: string; color: string }) | null
  open: boolean
  onClose: () => void
}

export function PredictionsModal({ user, open, onClose }: PredictionsModalProps) {
  const isMobile = useIsMobile()
  const [predictions, setPredictions] = useState<PredictionRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !user) return
    setLoading(true)
    fetch(`/api/predictions?userId=${user.user_id}`)
      .then(r => r.json())
      .then((data: { matches: { home_team: string; away_team: string; home_score: number | null; away_score: number | null }; predicted_winner: string; goal_difference: number | null; points_earned: number }[]) => {
        const rows: PredictionRow[] = (data ?? [])
          .filter((p) => p.matches && (p.matches as { home_score: number | null }).home_score !== null)
          .map((p) => {
            const m = p.matches as { home_team: string; away_team: string; home_score: number | null; away_score: number | null }
            const predLabel =
              p.predicted_winner === 'draw'
                ? 'Draw'
                : p.predicted_winner === 'home'
                ? `${m.home_team}${p.goal_difference ? ` +${p.goal_difference}` : ''}`
                : `${m.away_team}${p.goal_difference ? ` +${p.goal_difference}` : ''}`
            return {
              match: `${m.home_team} vs ${m.away_team}`,
              prediction: predLabel,
              result: `${m.home_score} – ${m.away_score}`,
              pts: p.points_earned,
              correct: p.points_earned > 0,
            }
          })
        setPredictions(rows)
      })
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false))
  }, [open, user])

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        ...(isMobile
          ? { maxHeight: '85vh', width: '100%', borderRadius: '20px 20px 0 0' }
          : { maxWidth: 540, width: '100%' }),
        padding: 0,
      }}>
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <SheetHeader style={{ padding: '20px 22px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 999, background: user.color, color: 'rgba(0,0,0,0.72)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

            <div style={{ padding: '14px 18px 6px', fontSize: 11.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
              Completed matches · {predictions.length}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loading ? (
                <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>Loading…</div>
              ) : predictions.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>No completed predictions yet</div>
              ) : predictions.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 'calc(var(--radius) - 4px)', background: p.correct ? 'rgba(98,200,150,0.06)' : 'rgba(255,255,255,0.02)', border: p.correct ? '1px solid rgba(98,200,150,0.18)' : '1px solid var(--border)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{p.match}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', flexWrap: 'wrap' }}>
                      <span>Predicted: <span style={{ color: 'var(--foreground)' }}>{p.prediction}</span></span>
                      <span>Result: <span style={{ color: 'var(--foreground)' }}>{p.result}</span></span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                    {p.correct ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                           stroke="oklch(0.72 0.115 164)" strokeWidth="2.5"
                           strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                           stroke="oklch(0.62 0.18 25)" strokeWidth="2.5"
                           strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    )}
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: p.correct ? 'oklch(0.78 0.13 164)' : 'var(--muted-foreground)' }}>{p.correct ? `+${p.pts}` : '0'} pts</span>
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
