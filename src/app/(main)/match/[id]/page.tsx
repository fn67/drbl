import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_MATCHES, MOCK_PREDICTIONS, MOCK_VOTERS } from '@/lib/mock-data'
import { VoteForm } from '@/components/vote-form'
import { VoterReveal } from '@/components/voter-reveal'
import { Toaster } from '@/components/ui/sonner'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params
  const match = MOCK_MATCHES.find(m => m.id === id)
  if (!match) notFound()

  const userPrediction = MOCK_PREDICTIONS.find(p => p.match_id === id)
  const voters = MOCK_VOTERS[id as keyof typeof MOCK_VOTERS] ?? { home: [], draw: [], away: [] }

  const kickoffDate = new Date(match.kickoff_at)
  const dateStr = kickoffDate.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
  const timeStr = kickoffDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  })

  const statusConfig = {
    upcoming:    { tone: 'blue',  label: 'Upcoming' },
    voting_open: { tone: 'green', label: 'Voting open' },
    locked:      { tone: 'amber', label: 'Live' },
    completed:   { tone: 'gray',  label: 'Full time' },
  }[match.status]

  const badgeMap = {
    blue:  { bg: 'rgba(108, 165, 240, 0.14)', fg: 'oklch(0.82 0.10 230)', dot: 'oklch(0.72 0.13 230)' },
    green: { bg: 'rgba(98, 200, 150, 0.16)',  fg: 'oklch(0.85 0.10 164)', dot: 'oklch(0.72 0.115 164)' },
    amber: { bg: 'rgba(240, 170, 80, 0.18)',  fg: 'oklch(0.85 0.10 80)',  dot: 'oklch(0.78 0.13 75)' },
    gray:  { bg: 'rgba(255, 255, 255, 0.06)', fg: 'rgba(255,255,255,0.62)', dot: 'rgba(255,255,255,0.45)' },
  } as const
  const badgeColors = badgeMap[statusConfig.tone as keyof typeof badgeMap]

  const roundLabel = match.group_name
    ? `${match.group_name} · ${match.round}`
    : match.round

  return (
    <>
      <Toaster />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Back link */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)',
          textDecoration: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to matches
        </Link>

        {/* Hero */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '24px 24px 20px',
          boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 16px 40px -18px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {/* Top meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: 12, fontWeight: 700, color: 'var(--primary)',
              letterSpacing: 1.4, textTransform: 'uppercase',
            }}>{roundLabel}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: badgeColors.bg, color: badgeColors.fg,
              fontSize: 12, fontWeight: 600, padding: '5px 10px 5px 9px', borderRadius: 999,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 999, background: badgeColors.dot,
                ...(match.status === 'locked' ? { animation: 'pulseDot 1.6s ease-out infinite' } : {}),
              }} />
              {statusConfig.label}
            </span>
          </div>

          {/* Teams */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Home */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, flex: 1,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 52, lineHeight: 1,
              }}>{match.home_flag}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.3 }}>
                {match.home_team}
              </div>
            </div>

            {/* Center */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              minWidth: 120,
            }}>
              {match.status === 'completed' && match.home_score !== null ? (
                <>
                  <div style={{
                    fontSize: 48, fontWeight: 700, color: 'var(--foreground)',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: 2, lineHeight: 1,
                  }}>{match.home_score} – {match.away_score}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                    Full time
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    fontSize: 40, fontWeight: 700, color: 'var(--foreground)',
                    fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  }}>{timeStr}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                    Kickoff
                  </div>
                </>
              )}
            </div>

            {/* Away */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flex: 1,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 52, lineHeight: 1,
              }}>{match.away_flag}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.3, textAlign: 'right' }}>
                {match.away_team}
              </div>
            </div>
          </div>

          {/* Bottom meta */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 12,
            fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)',
          }}>
            <span>{dateStr}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{timeStr} UTC</span>
          </div>
        </div>

        {/* Content based on status */}
        {match.status === 'voting_open' && (
          <VoteForm match={match} existingPrediction={userPrediction} />
        )}

        {(match.status === 'locked' || match.status === 'completed') && (
          <VoterReveal
            homeTeam={match.home_team}
            homeFlag={match.home_flag}
            awayTeam={match.away_team}
            awayFlag={match.away_flag}
            votersHome={voters.home}
            votersDraw={voters.draw}
            votersAway={voters.away}
            completed={match.status === 'completed'}
            winner={match.status === 'completed' && match.home_score !== null && match.away_score !== null
              ? match.home_score > match.away_score ? 'home'
              : match.away_score > match.home_score ? 'away'
              : 'draw'
              : undefined}
          />
        )}

        {match.status === 'upcoming' && (
          <div style={{
            padding: '32px 24px', textAlign: 'center',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--muted-foreground)' }}>
              Voting opens 48 hours before kickoff
            </div>
          </div>
        )}
      </div>
    </>
  )
}
