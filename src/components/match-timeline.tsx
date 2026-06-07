'use client'

import { useState } from 'react'
import { MatchCard } from '@/components/match-card'
import { Match, Prediction } from '@/types'
import { computeStatus } from '@/lib/utils'

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
  upcomingMatches: Match[]
  pastMatches: Match[]
  predictions: Prediction[]
  voteCounts: Record<string, { home: number; draw: number; away: number }>
}

export function MatchTimeline({ upcomingMatches, pastMatches, predictions, voteCounts }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [displayedPast, setDisplayedPast] = useState(pastMatches)
  const [displayedVoteCounts, setDisplayedVoteCounts] = useState(voteCounts)
  const [offset, setOffset] = useState(20)
  const [hasMore, setHasMore] = useState(pastMatches.length === 20)
  const [loadingMore, setLoadingMore] = useState(false)

  const getPrediction = (id: string) => predictions.find(p => p.match_id === id)

  const loadMore = async () => {
    setLoadingMore(true)
    const res = await fetch(`/api/matches?offset=${offset}`)
    const newMatches = (await res.json() as Match[]).map(m => ({ ...m, status: computeStatus(m) }))

    if (newMatches.length > 0) {
      const newIds = newMatches.map(m => m.id)
      const votesRes = await fetch(`/api/predictions?matchIds=${newIds.join(',')}`)
      const newVotes = votesRes.ok
        ? (await votesRes.json() as { match_id: string; predicted_winner: string }[])
        : []

      const merged = { ...displayedVoteCounts }
      for (const v of newVotes) {
        if (!merged[v.match_id]) merged[v.match_id] = { home: 0, draw: 0, away: 0 }
        merged[v.match_id][v.predicted_winner as 'home' | 'draw' | 'away']++
      }
      setDisplayedPast(prev => [...prev, ...newMatches])
      setDisplayedVoteCounts(merged)
      setOffset(prev => prev + 20)
      setHasMore(newMatches.length === 20)
    } else {
      setHasMore(false)
    }
    setLoadingMore(false)
  }

  const display = tab === 'upcoming' ? upcomingMatches : displayedPast
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
          const label = t === 'past' ? 'Results' : 'Upcoming'
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
              fontSize: 13.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999,
              border: 'none',
              background: active ? 'var(--primary)' : 'transparent',
              color: active ? 'var(--primary-foreground)' : 'rgba(255,255,255,0.62)',
              cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: 0.1,
              boxShadow: 'none',
            }}>
              {label}
              {t === 'upcoming' && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
                  background: active ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.06)',
                  color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                }}>{upcomingMatches.length}</span>
              )}
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
                  <MatchCard key={m.id} match={m} userPrediction={getPrediction(m.id)} voteCounts={displayedVoteCounts[m.id]} />
                ))}
              </div>
            </div>
          ))}

          {tab === 'past' && hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                width: '100%', padding: '13px 18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: loadingMore ? 'var(--muted-foreground)' : 'var(--foreground)',
                fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
                cursor: loadingMore ? 'default' : 'pointer',
              }}
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
