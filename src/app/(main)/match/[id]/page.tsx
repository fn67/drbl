import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { getUser } from '@/lib/auth'
import { computeStatus, getAvatarColor, getInitials, getMatchWinner, formatIST } from '@/lib/utils'
import { PageTitle } from '@/components/page-title'

export const metadata: Metadata = { title: 'DRBL | Match' }
import { VoteForm } from '@/components/vote-form'
import { VoterReveal } from '@/components/voter-reveal'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'
import { Toaster } from '@/components/ui/sonner'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const user = await getUser()

  const { data: raw } = await supabase.from('matches').select('*').eq('id', id).single()
  if (!raw) notFound()

  const match = { ...raw, status: computeStatus(raw) }

  const [{ data: predRows }, { data: userPredRow }] = await Promise.all([
    supabase.from('predictions').select('*, users(name, email)').eq('match_id', id),
    user
      ? supabase.from('predictions').select('*').eq('match_id', id).eq('user_id', user.id).single()
      : Promise.resolve({ data: null }),
  ])

  const predictions = predRows ?? []

  type PredRow = typeof predictions[number]
  const toVoter = (p: PredRow) => {
    const name = (p.users as { name: string } | null)?.name ?? 'Unknown'
    return {
      name,
      initials: getInitials(name),
      color: getAvatarColor(name),
      diff: p.goal_difference as number | null,
      correct: match.status === 'completed' ? p.points_earned > 0 : undefined,
      pts: match.status === 'completed' ? (p.points_earned as number) : undefined,
      bonus: match.status === 'completed' && p.points_earned === 15 ? 5 : undefined,
    }
  }

  const voters = {
    home: predictions.filter(p => p.predicted_winner === 'home').map(toVoter),
    draw: predictions.filter(p => p.predicted_winner === 'draw').map(toVoter),
    away: predictions.filter(p => p.predicted_winner === 'away').map(toVoter),
  }

  const kickoffDate = new Date(match.kickoff_at)
  const dateStr = kickoffDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
  const timeStr = formatIST(match.kickoff_at)

  const statusConfigMap: Record<string, { tone: string; label: string }> = {
    upcoming:    { tone: 'blue',  label: 'Upcoming' },
    voting_open: { tone: 'green', label: 'Voting open' },
    locked:      { tone: 'amber', label: 'Live' },
    completed:   { tone: 'gray',  label: 'Full time' },
  }
  const statusConfig = statusConfigMap[match.status] ?? { tone: 'gray', label: match.status }

  const badgeMap = {
    blue:  { bg: 'rgba(108,165,240,0.14)', fg: 'oklch(0.82 0.10 230)', dot: 'oklch(0.72 0.13 230)' },
    green: { bg: 'rgba(98,200,150,0.16)',  fg: 'oklch(0.85 0.10 164)', dot: 'oklch(0.72 0.115 164)' },
    amber: { bg: 'rgba(240,170,80,0.18)',  fg: 'oklch(0.85 0.10 80)',  dot: 'oklch(0.78 0.13 75)' },
    gray:  { bg: 'rgba(255,255,255,0.06)', fg: 'rgba(255,255,255,0.62)', dot: 'rgba(255,255,255,0.45)' },
  } as const
  const badgeColors = badgeMap[statusConfig.tone as keyof typeof badgeMap]

  const roundLabel = match.group_name ? `${match.group_name} · ${match.round}` : match.round

  const winner = getMatchWinner(match)

  return (
    <>
      <Toaster />
      <PageTitle title={`DRBL | ${match.home_team} vs ${match.away_team}`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to matches
        </Link>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 24px 20px', boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 16px 40px -18px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', letterSpacing: 1.4, textTransform: 'uppercase' }}>{roundLabel}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: badgeColors.bg, color: badgeColors.fg, fontSize: 12, fontWeight: 600, padding: '5px 10px 5px 9px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: badgeColors.dot, ...(match.status === 'locked' ? { animation: 'pulseDot 1.6s ease-out infinite' } : {}) }} />
              {statusConfig.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, flex: 1 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flag code={getTeamCode(match.home_team)} size={52} /></div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: winner === 'home' ? 'var(--primary)' : winner === 'away' ? 'var(--muted-foreground)' : 'var(--foreground)' }}>{match.home_team}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 120 }}>
              {match.status === 'completed' && match.home_score !== null ? (
                <>
                  <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums', letterSpacing: 2, lineHeight: 1 }}>{match.home_score} – {match.away_score}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase' }}>{match.winner_override ? 'Full time · Pens' : 'Full time'}</div>
                  {match.winner_override && (
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted-foreground)', opacity: 0.7, textAlign: 'center' }}>
                      {match.winner_override === 'home' ? match.home_team : match.away_team} won on penalties
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{timeStr}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Kickoff</div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flex: 1 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flag code={getTeamCode(match.away_team)} size={52} /></div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3, textAlign: 'right', color: winner === 'away' ? 'var(--primary)' : winner === 'home' ? 'var(--muted-foreground)' : 'var(--foreground)' }}>{match.away_team}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)' }}>
            <span>{dateStr}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{timeStr}</span>
          </div>
        </div>

        {match.status === 'voting_open' && (
          <VoteForm match={match} existingPrediction={userPredRow ?? undefined} />
        )}

        {(match.status === 'locked' || match.status === 'completed') && (
          <VoterReveal
            homeTeam={match.home_team} homeFlag={match.home_flag}
            awayTeam={match.away_team} awayFlag={match.away_flag}
            votersHome={voters.home} votersDraw={voters.draw} votersAway={voters.away}
            completed={match.status === 'completed'}
            winner={winner}
            round={match.round}
          />
        )}

        {match.status === 'upcoming' && (
          <div style={{ padding: '32px 24px', textAlign: 'center', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--muted-foreground)' }}>Voting opens 48 hours before kickoff</div>
          </div>
        )}
      </div>
    </>
  )
}
