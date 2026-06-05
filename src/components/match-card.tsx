'use client'

import Link from 'next/link'
import { Match, Prediction } from '@/types'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'

interface MatchCardProps {
  match: Match
  userPrediction?: Prediction
}

const StatusBadge = ({ status }: { status: Match['status'] }) => {
  const config = {
    upcoming:    { bg: 'rgba(108, 165, 240, 0.14)', fg: 'oklch(0.82 0.10 230)', dot: 'oklch(0.72 0.13 230)', label: 'Upcoming' },
    voting_open: { bg: 'rgba(98, 200, 150, 0.16)',  fg: 'oklch(0.85 0.10 164)', dot: 'oklch(0.72 0.115 164)', label: 'Voting open' },
    locked:      { bg: 'rgba(240, 170, 80, 0.18)',  fg: 'oklch(0.85 0.10 80)',  dot: 'oklch(0.78 0.13 75)', label: 'Live' },
    completed:   { bg: 'rgba(255, 255, 255, 0.06)', fg: 'rgba(255,255,255,0.62)', dot: 'rgba(255,255,255,0.45)', label: 'Completed' },
  }
  const c = config[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: c.bg, color: c.fg,
      fontSize: 12, fontWeight: 600, letterSpacing: 0.1,
      padding: '5px 10px 5px 9px', borderRadius: 999,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999, background: c.dot, flexShrink: 0,
        ...(status === 'locked' ? { animation: 'pulseDot 1.6s ease-out infinite', color: c.dot } : {}),
      }} />
      {c.label}
    </span>
  )
}

const VoteBar = ({ homeP, drawP, awayP, homeTeam, awayTeam }: {
  homeP: number; drawP: number; awayP: number; homeTeam: string; awayTeam: string
}) => (
  <div style={{ marginTop: 4 }}>
    <div style={{
      display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden',
      background: 'var(--muted)',
    }}>
      <div style={{ width: `${homeP}%`, background: 'oklch(0.72 0.115 164)' }} />
      <div style={{ width: 2, background: 'var(--card)' }} />
      <div style={{ width: `${drawP}%`, background: 'rgba(255,255,255,0.32)' }} />
      <div style={{ width: 2, background: 'var(--card)' }} />
      <div style={{ width: `${awayP}%`, background: 'oklch(0.72 0.13 230)' }} />
    </div>
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      marginTop: 6, fontSize: 12, color: 'var(--muted-foreground)',
      fontWeight: 600,
    }}>
      <span>{homeTeam.split(' ')[0]} {homeP}%</span>
      <span>Draw {drawP}%</span>
      <span>{awayP}% {awayTeam.split(' ')[0]}</span>
    </div>
  </div>
)

export function MatchCard({ match, userPrediction }: MatchCardProps) {
  const kickoffDate = new Date(match.kickoff_at)
  const timeStr = kickoffDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })

  const hoursUntilVoting = Math.max(0, Math.ceil((new Date(match.kickoff_at).getTime() - 48 * 3600000 - Date.now()) / 3600000))

  const roundLabel = match.group_name
    ? `${match.group_name} · ${match.round}`
    : match.round

  return (
    <Link href={`/match/${match.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '18px 20px 16px',
        boxShadow:
          '0 1px 0 rgba(255, 255, 255, 0.04) inset, ' +
          '0 8px 24px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex', flexDirection: 'column', gap: 14,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 12, fontWeight: 600, letterSpacing: 0.6,
            textTransform: 'uppercase', color: 'var(--muted-foreground)',
          }}>{roundLabel}</span>
          <StatusBadge status={match.status} />
        </div>

        {/* Teams row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Home team */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <Flag code={getTeamCode(match.home_team)} size={32} />
            <span style={{
              fontSize: 16, fontWeight: 600, color: 'var(--foreground)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{match.home_team}</span>
          </div>

          {/* Center */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minWidth: 72, flexShrink: 0,
          }}>
            {match.status === 'completed' && match.home_score !== null ? (
              <span style={{
                fontSize: 24, fontWeight: 700, color: 'var(--foreground)',
                fontVariantNumeric: 'tabular-nums', letterSpacing: 1,
              }}>{match.home_score} – {match.away_score}</span>
            ) : (
              <>
                <span style={{
                  fontSize: 20, fontWeight: 700, color: 'var(--foreground)',
                  fontVariantNumeric: 'tabular-nums',
                }}>{timeStr}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 1, letterSpacing: 0.8 }}>KICKOFF</span>
              </>
            )}
          </div>

          {/* Away team */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, flexDirection: 'row-reverse' }}>
            <Flag code={getTeamCode(match.away_team)} size={32} />
            <span style={{
              fontSize: 16, fontWeight: 600, color: 'var(--foreground)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              textAlign: 'right',
            }}>{match.away_team}</span>
          </div>
        </div>

        {/* Status-specific bottom section */}
        {match.status === 'upcoming' && (
          <div style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.72 0.10 230)' }}>
            Voting opens in {hoursUntilVoting}h
          </div>
        )}

        {match.status === 'voting_open' && !userPrediction && (
          <div style={{ marginTop: 2 }}>
            <button style={{
              background: 'var(--primary)', color: 'var(--primary-foreground)',
              border: 'none', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 14, letterSpacing: 0.1,
              padding: '11px 18px', borderRadius: 'calc(var(--radius) - 4px)',
              cursor: 'pointer',
              boxShadow: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Cast your prediction
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
          </div>
        )}

        {match.status === 'voting_open' && userPrediction && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(98, 200, 150, 0.10)',
            border: '1px dashed rgba(98, 200, 150, 0.35)',
            borderRadius: 'calc(var(--radius) - 6px)',
            padding: '10px 14px',
            fontSize: 14, fontWeight: 600, color: 'var(--foreground)',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--muted-foreground)' }}>You voted:</span>
              {userPrediction.predicted_winner === 'home' ? (
                <><Flag code={getTeamCode(match.home_team)} size={16} /> {match.home_team}</>
              ) : userPrediction.predicted_winner === 'away' ? (
                <><Flag code={getTeamCode(match.away_team)} size={16} /> {match.away_team}</>
              ) : 'Draw'}
              {userPrediction.goal_difference ? ` +${userPrediction.goal_difference}` : ''}
            </span>
            <span style={{ color: 'var(--muted-foreground)', fontSize: 12.5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                   style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
              Edit
            </span>
          </div>
        )}

        {(match.status === 'locked' || match.status === 'completed') && (
          <VoteBar homeP={52} drawP={18} awayP={30}
                   homeTeam={match.home_team} awayTeam={match.away_team} />
        )}

        {match.status === 'completed' && userPrediction && (
          <div style={{
            fontSize: 13, color: 'var(--muted-foreground)',
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontWeight: 600 }}>You predicted:</span>
            <span style={{ color: 'var(--foreground)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {userPrediction.predicted_winner === 'home' ? (
                <><Flag code={getTeamCode(match.home_team)} size={16} /> {match.home_team}</>
              ) : userPrediction.predicted_winner === 'away' ? (
                <><Flag code={getTeamCode(match.away_team)} size={16} /> {match.away_team}</>
              ) : 'Draw'}
              {userPrediction.goal_difference ? ` +${userPrediction.goal_difference}` : ''}
            </span>
            {userPrediction.points_earned > 0 ? (
              <>
                <span style={{ color: 'oklch(0.78 0.13 164)', fontWeight: 700 }}>✓</span>
                <span style={{ color: 'oklch(0.78 0.13 164)', fontWeight: 700 }}>
                  +{userPrediction.points_earned} pts
                </span>
              </>
            ) : (
              <>
                <span style={{ color: 'oklch(0.72 0.16 25)', fontWeight: 700 }}>✗</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>0 pts</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
