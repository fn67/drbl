'use client'

import { useState } from 'react'
import { MatchCard } from '@/components/match-card'
import { Match, Prediction } from '@/types'

function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00Z')
  const now = new Date()
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const tomorrowUTC = new Date(todayUTC.getTime() + 86400000)
  const matchUTC = date.getTime()

  if (matchUTC === todayUTC.getTime()) return 'TODAY'
  if (matchUTC === tomorrowUTC.getTime()) return 'TOMORROW'
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).toUpperCase()
}

function groupByDate(matches: Match[]) {
  const groups = new Map<string, Match[]>()
  for (const m of matches) {
    const key = new Date(m.kickoff_at).toISOString().split('T')[0]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(m)
  }
  return Array.from(groups.entries()).map(([key, ms]) => ({
    label: formatDateLabel(key),
    sub: new Date(key + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }),
    matches: ms,
  }))
}

interface Props {
  matches: Match[]
  predictions: Prediction[]
  voteCounts: Record<string, { home: number; draw: number; away: number }>
}

export function MatchTimeline({ matches, predictions, voteCounts }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  const upcoming = matches
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime())

  const past = matches
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime())

  const getPrediction = (id: string) => predictions.find(p => p.match_id === id)

  const display = tab === 'upcoming' ? upcoming : past
  const groups = groupByDate(display)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
          FIFA World Cup 2026 · Office League
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.5 }}>
          Match timeline
        </h1>
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 999, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)', marginBottom: 28,
      }}>
        {(['upcoming', 'past'] as const).map((t) => {
          const active = tab === t
          const count = t === 'upcoming' ? upcoming.length : past.length
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
              fontSize: 13.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999,
              border: 'none',
              background: active ? 'var(--primary)' : 'transparent',
              color: active ? 'var(--primary-foreground)' : 'rgba(255,255,255,0.62)',
              cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: 0.1, textTransform: 'capitalize',
              boxShadow: 'none',
            }}>
              {t}
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
                background: active ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.06)',
                color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
              }}>{count}</span>
            </button>
          )
        })}
      </div>

      {groups.length === 0 ? (
        <div style={{ padding: '48px 16px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--muted-foreground)' }}>
          {tab === 'upcoming' ? 'No upcoming matches' : 'No past matches yet'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {groups.map(group => (
            <div key={group.label}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '4px 4px 0', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: 1.2 }}>{group.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>{group.sub}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: 4 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.matches.map(m => (
                  <MatchCard key={m.id} match={m} userPrediction={getPrediction(m.id)} voteCounts={voteCounts[m.id]} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
