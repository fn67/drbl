'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { Match, Prediction } from '@/types'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'
import { getMatchWinner, formatIST } from '@/lib/utils'

const KNOCKOUT_ROUNDS = ['Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Third Place Play-off', 'Final']

interface MatchCardProps {
  match: Match
  userPrediction?: Prediction
  voteCounts?: { home: number; draw: number; away: number }
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

const VoteBar = ({ homeP, drawP, awayP, homeTeam, awayTeam, isKnockout = false }: {
  homeP: number; drawP: number; awayP: number; homeTeam: string; awayTeam: string; isKnockout?: boolean
}) => (
  <div style={{ marginTop: 4 }}>
    <div style={{
      display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden',
      background: 'var(--muted)',
    }}>
      <div style={{ width: `${homeP}%`, background: 'oklch(0.72 0.115 164)' }} />
      {!isKnockout && (
        <>
          <div style={{ width: 2, background: 'var(--card)' }} />
          <div style={{ width: `${drawP}%`, background: 'rgba(255,255,255,0.32)' }} />
        </>
      )}
      <div style={{ width: 2, background: 'var(--card)' }} />
      <div style={{ width: `${awayP}%`, background: 'oklch(0.72 0.13 230)' }} />
    </div>
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      marginTop: 6, fontSize: 12, color: 'var(--muted-foreground)',
      fontWeight: 600,
    }}>
      <span>{homeTeam.split(' ')[0]} {homeP}%</span>
      {!isKnockout && <span>Draw {drawP}%</span>}
      <span>{awayP}% {awayTeam.split(' ')[0]}</span>
    </div>
  </div>
)

export function MatchCard({ match, userPrediction, voteCounts }: MatchCardProps) {
  const timeStr = formatIST(match.kickoff_at)

  const hoursUntilVoting = Math.max(0, Math.ceil((new Date(match.kickoff_at).getTime() - 48 * 3600000 - Date.now()) / 3600000))

  const roundLabel = match.group_name
    ? `${match.group_name} · ${match.round}`
    : match.round

  const winner = getMatchWinner(match)
  const isKnockout = KNOCKOUT_ROUNDS.includes(match.round)

  const vc = voteCounts ?? { home: 0, draw: 0, away: 0 }
  const vTotal = vc.home + vc.draw + vc.away
  const homeP = vTotal ? Math.round((vc.home / vTotal) * 100) : 0
  const drawP = vTotal ? Math.round((vc.draw / vTotal) * 100) : 0
  const awayP = vTotal ? 100 - homeP - drawP : 0

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 0.6,
              textTransform: 'uppercase', color: 'var(--muted-foreground)',
            }}>{roundLabel}</span>
            {match.is_featured && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(240,170,80,0.16)', color: 'oklch(0.85 0.10 80)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, letterSpacing: 0.3 }}>
                <Star size={14} strokeWidth={2} />
                2x pts
              </span>
            )}
          </div>
          <StatusBadge status={match.status} />
        </div>

        {/* Teams row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Home team */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <Flag code={getTeamCode(match.home_team)} size={32} />
            <span style={{
              fontSize: 16, fontWeight: winner === 'home' ? 700 : 600,
              color: winner === 'home' ? 'var(--primary)' : winner === 'away' ? 'var(--muted-foreground)' : 'var(--foreground)',
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
              fontSize: 16, fontWeight: winner === 'away' ? 700 : 600,
              color: winner === 'away' ? 'var(--primary)' : winner === 'home' ? 'var(--muted-foreground)' : 'var(--foreground)',
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
          <VoteBar homeP={homeP} drawP={drawP} awayP={awayP}
                   homeTeam={match.home_team} awayTeam={match.away_team}
                   isKnockout={isKnockout} />
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
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="oklch(0.72 0.115 164)" strokeWidth="2.5"
                     strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span style={{ color: 'oklch(0.78 0.13 164)', fontWeight: 700 }}>
                  +{userPrediction.points_earned} pts
                </span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="oklch(0.62 0.18 25)" strokeWidth="2.5"
                     strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>0 pts</span>
              </>
            )}
          </div>
        )}

        {match.status === 'completed' && match.winner_override && (
          <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted-foreground)', opacity: 0.7 }}>
            {match.winner_override === 'home' ? match.home_team : match.away_team} won on penalties
          </div>
        )}
      </div>
    </Link>
  )
}
