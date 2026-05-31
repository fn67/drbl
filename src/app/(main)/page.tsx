'use client'

import { useState } from 'react'
import { MatchCard } from '@/components/match-card'
import { MOCK_MATCHES, MOCK_PREDICTIONS } from '@/lib/mock-data'
import { Match } from '@/types'

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date('2026-05-31')
  const tomorrow = new Date('2026-06-01')

  const matchDate = new Date(date.toDateString())
  const todayDate = new Date(today.toDateString())
  const tomorrowDate = new Date(tomorrow.toDateString())

  if (matchDate.getTime() === todayDate.getTime()) return 'TODAY'
  if (matchDate.getTime() === tomorrowDate.getTime()) return 'TOMORROW'

  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()
}

function groupMatchesByDate(matches: Match[]): { label: string; sub: string; matches: Match[] }[] {
  const groups = new Map<string, Match[]>()
  for (const m of matches) {
    const dateKey = new Date(m.kickoff_at).toISOString().split('T')[0]
    if (!groups.has(dateKey)) groups.set(dateKey, [])
    groups.get(dateKey)!.push(m)
  }

  return Array.from(groups.entries()).map(([dateKey, matches]) => {
    const date = new Date(dateKey + 'T00:00:00Z')
    const sub = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })
    return { label: formatDateLabel(matches[0].kickoff_at), sub, matches }
  })
}

export default function HomePage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  const upcomingMatches = MOCK_MATCHES
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime())

  const pastMatches = MOCK_MATCHES
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime())

  const displayMatches = tab === 'upcoming' ? upcomingMatches : pastMatches
  const groups = groupMatchesByDate(displayMatches)

  const getPrediction = (matchId: string) =>
    MOCK_PREDICTIONS.find(p => p.match_id === matchId)

  const upcomingCount = upcomingMatches.length
  const pastCount = pastMatches.length

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
          FIFA World Cup 2026 · Office League
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.5 }}>
          Match timeline
        </h1>
      </div>

      {/* Toggle pills */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: 4,
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 999,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        marginBottom: 28,
      }}>
        {(['upcoming', 'past'] as const).map((t) => {
          const active = tab === t
          const count = t === 'upcoming' ? upcomingCount : pastCount
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: 'inherit',
              fontSize: 13.5, fontWeight: 700,
              padding: '7px 16px', borderRadius: 999,
              border: 'none',
              background: active ? 'var(--primary)' : 'transparent',
              color: active ? 'var(--primary-foreground)' : 'rgba(255,255,255,0.62)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: active
                ? '0 2px 0 rgba(0,0,0,0.25), 0 6px 14px -4px rgba(98, 200, 150, 0.55)'
                : 'none',
              letterSpacing: 0.1,
              transition: 'background .15s',
              textTransform: 'capitalize',
            }}>
              {t}
              <span style={{
                fontSize: 11, fontWeight: 700,
                padding: '1px 7px', borderRadius: 999,
                background: active ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.06)',
                color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
              }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Match list */}
      {groups.length === 0 ? (
        <div style={{
          padding: '48px 16px', textAlign: 'center',
          fontSize: 14, fontWeight: 600, color: 'var(--muted-foreground)',
        }}>
          {tab === 'upcoming' ? 'No upcoming matches' : 'No past matches yet'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {groups.map((group) => (
            <div key={group.label}>
              {/* Date header */}
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 10,
                padding: '4px 4px 0', marginBottom: 14,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--foreground)',
                  textTransform: 'uppercase', letterSpacing: 1.2,
                }}>{group.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>{group.sub}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: 4 }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.matches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    userPrediction={getPrediction(match.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
