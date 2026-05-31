'use client'

import { useState } from 'react'
import { MOCK_MATCHES } from '@/lib/mock-data'
import { Match } from '@/types'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Input } from '@/components/ui/input'

export default function AdminResultsPage() {
  const [matches, setMatches] = useState<Match[]>(
    MOCK_MATCHES.filter(m => m.status === 'locked' || m.status === 'completed')
  )
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({})
  const [overriding, setOverriding] = useState<string | null>(null)

  const setScore = (id: string, side: 'home' | 'away', val: string) => {
    setScores(s => ({
      ...s,
      [id]: { ...(s[id] ?? { home: '', away: '' }), [side]: val },
    }))
  }

  const handleApprove = (id: string) => {
    const s = scores[id]
    if (!s || s.home === '' || s.away === '') {
      toast.error('Enter both scores before approving')
      return
    }
    const home = parseInt(s.home)
    const away = parseInt(s.away)
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      toast.error('Scores must be valid numbers')
      return
    }
    setMatches(ms => ms.map(m => m.id === id
      ? { ...m, status: 'completed', home_score: home, away_score: away }
      : m
    ))
    setOverriding(null)
    toast.success('Result approved — points calculated!')
  }

  const handleOverride = (id: string) => {
    const m = matches.find(m => m.id === id)!
    setScores(s => ({
      ...s,
      [id]: { home: String(m.home_score ?? ''), away: String(m.away_score ?? '') },
    }))
    setOverriding(id)
  }

  return (
    <>
      <Toaster />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)' }}>Results</h1>
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>
            Approve match results and trigger points calculation
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {matches.map((m) => {
            const s = scores[m.id] ?? { home: '', away: '' }
            const isCompleted = m.status === 'completed'
            const isOverriding = overriding === m.id

            return (
              <div key={m.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
              }}>
                {/* Match info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>
                    {m.home_flag} {m.home_team} vs {m.away_flag} {m.away_team}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>
                    {m.group_name ? `${m.group_name} · ` : ''}{m.round}
                    {isCompleted && m.home_score !== null && (
                      <span style={{ marginLeft: 10, fontWeight: 700, color: 'var(--foreground)' }}>
                        Final: {m.home_score} – {m.away_score}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <span style={{
                  background: isCompleted ? 'rgba(255,255,255,0.06)' : 'rgba(240,170,80,0.18)',
                  color: isCompleted ? 'rgba(255,255,255,0.62)' : 'oklch(0.85 0.10 80)',
                  fontSize: 12, fontWeight: 600,
                  padding: '5px 12px', borderRadius: 999,
                }}>
                  {isCompleted ? 'Completed' : 'Live'}
                </span>

                {/* Score input or result action */}
                {(!isCompleted || isOverriding) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Input
                      type="number" min="0" max="99"
                      value={s.home}
                      onChange={e => setScore(m.id, 'home', e.target.value)}
                      placeholder="0"
                      style={{ width: 64, textAlign: 'center' }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--muted-foreground)' }}>–</span>
                    <Input
                      type="number" min="0" max="99"
                      value={s.away}
                      onChange={e => setScore(m.id, 'away', e.target.value)}
                      placeholder="0"
                      style={{ width: 64, textAlign: 'center' }}
                    />
                    <button onClick={() => handleApprove(m.id)} style={{
                      background: 'var(--primary)', color: 'var(--primary-foreground)',
                      border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                      padding: '9px 16px', borderRadius: 'var(--radius)', cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}>
                      Approve result
                    </button>
                    {isOverriding && (
                      <button onClick={() => setOverriding(null)} style={{
                        background: 'transparent', border: '1px solid var(--border)',
                        color: 'var(--muted-foreground)', fontFamily: 'inherit',
                        fontWeight: 600, fontSize: 13, padding: '9px 14px',
                        borderRadius: 'var(--radius)', cursor: 'pointer',
                      }}>Cancel</button>
                    )}
                  </div>
                ) : (
                  <button onClick={() => handleOverride(m.id)} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                    color: 'var(--foreground)', fontFamily: 'inherit',
                    fontWeight: 600, fontSize: 13, padding: '8px 14px',
                    borderRadius: 'var(--radius)', cursor: 'pointer',
                  }}>Override</button>
                )}
              </div>
            )
          })}

          {matches.length === 0 && (
            <div style={{
              padding: '48px 24px', textAlign: 'center',
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 14, fontWeight: 600, color: 'var(--muted-foreground)',
            }}>
              No locked or completed matches yet
            </div>
          )}
        </div>
      </div>
    </>
  )
}
