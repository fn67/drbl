'use client'

import Link from 'next/link'
import { Match } from '@/types'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'

interface PendingVotesProps {
  matches: Match[]
}

export function PendingVotes({ matches }: PendingVotesProps) {
  if (matches.length === 0) return null

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(240,170,80,0.12), rgba(240,170,80,0.05))',
      border: '1px solid rgba(240,170,80,0.30)',
      borderRadius: 'var(--radius)',
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: 'rgba(240,170,80,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="oklch(0.82 0.12 80)" strokeWidth="2.2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
            <path d="M12 9v4M12 17h.01"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: 'oklch(0.88 0.08 85)' }}>
            You have {matches.length} match{matches.length > 1 ? 'es' : ''} to predict
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'oklch(0.78 0.05 85)', marginTop: 1 }}>
            Voting closes soon — don&apos;t miss out on points
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {matches.map((m) => {
          const kickoff = new Date(m.kickoff_at)
          const hoursUntilKickoff = Math.max(0, Math.ceil((kickoff.getTime() - Date.now()) / 3600000))
          return (
            <Link key={m.id} href={`/match/${m.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px',
              borderRadius: 'calc(var(--radius) - 4px)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              textDecoration: 'none',
            }}>
              <Flag code={getTeamCode(m.home_team)} size={22} />
              <Flag code={getTeamCode(m.away_team)} size={22} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{m.home_team} vs {m.away_team}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 1 }}>
                  {m.group_name} · <span style={{ color: 'oklch(0.82 0.10 80)' }}>Closes in {hoursUntilKickoff}h</span>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="var(--muted-foreground)" strokeWidth="2.2"
                   strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
