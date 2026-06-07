'use client'

import { useState, useEffect } from 'react'
import { Match } from '@/types'
import { computeStatus } from '@/lib/utils'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Input } from '@/components/ui/input'

export default function AdminResultsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({})
  const [overrides, setOverrides] = useState<Record<string, 'home' | 'away'>>({})
  const [overriding, setOverriding] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  useEffect(() => { document.title = 'DRBL | Admin' }, [])

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then((data: Match[]) => {
        const relevant = data
          .filter(m => { const s = computeStatus(m); return s === 'locked' || s === 'completed' })
          .sort((a, b) => {
            const sa = computeStatus(a)
            const sb = computeStatus(b)
            if (sa !== sb) return sa === 'locked' ? -1 : 1
            return new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime()
          })
        setMatches(relevant)
      })
      .catch(() => toast.error('Failed to load matches'))
      .finally(() => setLoading(false))
  }, [])

  const setScore = (id: string, side: 'home' | 'away', val: string) => {
    setScores(s => ({ ...s, [id]: { ...(s[id] ?? { home: '', away: '' }), [side]: val } }))
  }

  const handleApprove = async (id: string) => {
    const s = scores[id]
    if (!s || s.home === '' || s.away === '') { toast.error('Enter both scores before approving'); return }
    const home = parseInt(s.home)
    const away = parseInt(s.away)
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) { toast.error('Scores must be valid numbers'); return }

    const m = matches.find(m => m.id === id)!
    const needsOverride = m.round !== 'Group Stage' && home === away
    if (needsOverride && !overrides[id]) { toast.error('Select the penalty winner before approving'); return }

    setApprovingId(id)
    const res = await fetch(`/api/admin/results/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        homeScore: home,
        awayScore: away,
        winnerOverride: needsOverride ? overrides[id] : null,
      }),
    })
    if (!res.ok) {
      const { error } = await res.json()
      toast.error(error ?? 'Failed to approve result')
      setApprovingId(null)
      return
    }
    setMatches(ms => ms.map(m => m.id === id ? { ...m, status: 'completed', home_score: home, away_score: away } : m))
    setOverriding(null)
    setApprovingId(null)
    toast.success('Result approved — points calculated!')
  }

  const handleOverride = (id: string) => {
    const m = matches.find(m => m.id === id)!
    setScores(s => ({ ...s, [id]: { home: String(m.home_score ?? ''), away: String(m.away_score ?? '') } }))
    if (m.winner_override) setOverrides(o => ({ ...o, [id]: m.winner_override as 'home' | 'away' }))
    setOverriding(id)
  }

  return (
    <>
      <Toaster />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)' }}>Results</h1>
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>Approve match results and trigger points calculation</p>
        </div>

        {loading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--muted-foreground)' }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {matches.map((m) => {
              const s = scores[m.id] ?? { home: '', away: '' }
              const isCompleted = m.status === 'completed'
              const isOverriding = overriding === m.id
              const homeVal = parseInt(s.home)
              const awayVal = parseInt(s.away)
              const scoresEntered = s.home !== '' && s.away !== '' && !isNaN(homeVal) && !isNaN(awayVal)
              const needsOverride = m.round !== 'Group Stage' && scoresEntered && homeVal === awayVal
              const canApprove = scoresEntered && (!needsOverride || !!overrides[m.id])

              return (
                <div key={m.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}><Flag code={getTeamCode(m.home_team)} size={18} />{m.home_team} vs <Flag code={getTeamCode(m.away_team)} size={18} />{m.away_team}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>
                      {m.group_name ? `${m.group_name} · ` : ''}{m.round} · {new Date(m.kickoff_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })}
                      {isCompleted && m.home_score !== null && (
                        <span style={{ marginLeft: 10, fontWeight: 700, color: 'var(--foreground)' }}>Final: {m.home_score} – {m.away_score}</span>
                      )}
                    </div>
                  </div>
                  <span style={{ background: isCompleted ? 'rgba(255,255,255,0.06)' : 'rgba(240,170,80,0.18)', color: isCompleted ? 'rgba(255,255,255,0.62)' : 'oklch(0.85 0.10 80)', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 999 }}>
                    {isCompleted ? 'Completed' : 'Live'}
                  </span>
                  {(!isCompleted || isOverriding) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Input type="number" min="0" max="99" value={s.home} onChange={e => setScore(m.id, 'home', e.target.value)} placeholder="0" style={{ width: 64, textAlign: 'center' }} />
                        <span style={{ fontWeight: 700, color: 'var(--muted-foreground)' }}>–</span>
                        <Input type="number" min="0" max="99" value={s.away} onChange={e => setScore(m.id, 'away', e.target.value)} placeholder="0" style={{ width: 64, textAlign: 'center' }} />
                        <button onClick={() => handleApprove(m.id)} disabled={!canApprove || approvingId === m.id} style={{ background: canApprove && approvingId !== m.id ? 'var(--primary)' : 'var(--muted)', color: canApprove && approvingId !== m.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)', border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: '9px 16px', borderRadius: 'var(--radius)', cursor: canApprove && approvingId !== m.id ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', boxShadow: 'none' }}>{approvingId === m.id ? 'Approving…' : 'Approve result'}</button>
                        {isOverriding && (
                          <button onClick={() => setOverriding(null)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted-foreground)', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '9px 14px', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancel</button>
                        )}
                        <a href={`/match/${m.id}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--muted-foreground)', padding: '9px 9px', borderRadius: 'var(--radius)', textDecoration: 'none', flexShrink: 0 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      </div>
                      {needsOverride && (
                        <div style={{ padding: '12px 14px', borderRadius: 'calc(var(--radius) - 2px)', background: 'rgba(240,170,80,0.08)', border: '1px solid rgba(240,170,80,0.22)' }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'oklch(0.85 0.10 80)', marginBottom: 8 }}>
                            Scores are level — select penalty winner:
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {(['home', 'away'] as const).map(side => {
                              const team = side === 'home' ? m.home_team : m.away_team
                              const active = overrides[m.id] === side
                              return (
                                <button key={side} onClick={() => setOverrides(o => ({ ...o, [m.id]: side }))}
                                  style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 'calc(var(--radius) - 2px)', border: active ? '1.5px solid oklch(0.85 0.10 80)' : '1px solid rgba(240,170,80,0.30)', background: active ? 'rgba(240,170,80,0.18)' : 'rgba(255,255,255,0.03)', color: active ? 'oklch(0.90 0.10 80)' : 'var(--muted-foreground)', cursor: 'pointer' }}>
                                  {team}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => handleOverride(m.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--foreground)', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '8px 14px', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Override</button>
                      <a href={`/match/${m.id}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--muted-foreground)', padding: '8px 9px', borderRadius: 'var(--radius)', textDecoration: 'none', flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
            {matches.length === 0 && (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, color: 'var(--muted-foreground)' }}>No locked or completed matches yet</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
