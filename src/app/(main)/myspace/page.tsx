import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'DRBL | My Space' }
import { createClient } from '@/lib/supabase-server'
import { getUser } from '@/lib/auth'
import { computeStatus, getInitials, formatIST } from '@/lib/utils'
import { PendingVotes } from '@/components/pending-votes'
import { LogoutButton } from '@/components/logout-button'
import { HowItWorksButton } from '@/components/how-it-works-button'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'

export default async function MySpacePage() {
  const supabase = await createClient()
  const user = await getUser()

  const [
    { data: rawMatches },
    { data: predictions },
    { data: leaderboard },
  ] = await Promise.all([
    supabase.from('matches').select('*').order('kickoff_at'),
    user ? supabase.from('predictions').select('*, matches(*)').eq('user_id', user.id) : Promise.resolve({ data: [] }),
    user ? supabase.from('leaderboard').select('total_points,correct_predictions,total_predictions').eq('user_id', user.id).single() : Promise.resolve({ data: null }),
  ])

  const matches = (rawMatches ?? []).map(m => ({ ...m, status: computeStatus(m) }))

  const pendingMatches = matches.filter(
    m => m.status === 'voting_open' &&
    !(predictions ?? []).find((p: { match_id: string }) => p.match_id === m.id)
  )

  const activeMatches = matches.filter(
    m => (m.status === 'voting_open' || m.status === 'upcoming') &&
    (predictions ?? []).find((p: { match_id: string }) => p.match_id === m.id)
  )

  const completedPredictions = (predictions ?? [])
    .filter((p: { matches: { status: string } | null }) => (p.matches as { status: string } | null)?.status === 'completed')

  const totalPoints = (leaderboard as { total_points: number } | null)?.total_points ?? 0
  const totalPredicted = (leaderboard as { total_predictions: number } | null)?.total_predictions ?? 0
  const totalCorrect = (leaderboard as { correct_predictions: number } | null)?.correct_predictions ?? 0
  const hasAnyPredictions = (predictions ?? []).length > 0
  const initials = user?.name ? getInitials(user.name) : '?'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
          FIFA World Cup 2026 · Office League
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.5 }}>My Space</h1>
      </div>

      <PendingVotes matches={pendingMatches} />

      {/* Profile card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 26px', boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 16px 40px -18px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 240, height: 240, background: 'radial-gradient(circle, rgba(98,200,150,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, flexShrink: 0, background: 'linear-gradient(135deg, #E8C887 0%, #C99A4B 100%)', color: 'rgba(0,0,0,0.75)', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.35), 0 8px 24px -8px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.14)' }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.4 }}>{user?.name ?? '—'}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 3 }}>
              {user?.email ?? '—'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', background: 'rgba(98,200,150,0.08)', border: '1px solid rgba(98,200,150,0.25)', borderRadius: 999 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="oklch(0.80 0.13 90)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
              <path d="M17 5h2a2 2 0 0 1 0 4h-2M7 5H5a2 2 0 0 0 0 4h2"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums' }}>{totalPoints.toLocaleString()}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>pts</span>
          </div>
          {[
            { value: totalPredicted, label: 'predicted' },
            { value: totalCorrect, label: 'correct' },
            { value: pendingMatches.length, label: 'pending' },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 999 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {!hasAnyPredictions ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, padding: '80px 40px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ width: 96, height: 96, borderRadius: 28, background: 'linear-gradient(135deg, rgba(98,200,150,0.18), rgba(98,200,150,0.06))', border: '1px solid rgba(98,200,150,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.115 164)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.3 }}>No predictions yet</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 8, maxWidth: 320, lineHeight: 1.5 }}>Your predictions will appear here once you start voting on matches.</div>
          </div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--primary)', color: 'var(--primary-foreground)', textDecoration: 'none', fontWeight: 700, fontSize: 15, letterSpacing: 0.2, padding: '14px 22px', borderRadius: 'calc(var(--radius) - 4px)', boxShadow: 'none' }}>
            Go to matches
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
        </div>
      ) : (
        <>
          {/* Active predictions */}
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>Your active predictions</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 3 }}>These matches haven&apos;t started yet — you can still edit</div>
            </div>
            {activeMatches.length === 0 ? (
              <div style={{ padding: '22px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>No active predictions right now</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeMatches.map(m => {
                  const pred = (predictions ?? []).find((p: { match_id: string }) => p.match_id === m.id)
                  return (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                      {/* Row 1: teams */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Flag code={getTeamCode(m.home_team)} size={20} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{m.home_team}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>vs</span>
                        <Flag code={getTeamCode(m.away_team)} size={20} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{m.away_team}</span>
                      </div>
                      {/* Row 2: pick badge + lock time + edit */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999, background: 'rgba(98,200,150,0.10)', border: '1px solid rgba(98,200,150,0.25)', fontSize: 11.5, fontWeight: 700, color: 'oklch(0.85 0.10 164)' }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: 'oklch(0.78 0.06 164)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Your pick</span>
                          {pred?.predicted_winner === 'home' ? <><Flag code={getTeamCode(m.home_team)} size={12} /> {m.home_team}</> :
                           pred?.predicted_winner === 'away' ? <><Flag code={getTeamCode(m.away_team)} size={12} /> {m.away_team}</> : 'Draw'}
                          {pred?.goal_difference ? ` +${pred.goal_difference}` : ''}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: 'var(--muted-foreground)' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                          Locks at {formatIST(m.kickoff_at)}
                        </div>
                        <Link href={`/match/${m.id}`} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 999, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--foreground)', textDecoration: 'none', fontSize: 11.5, fontWeight: 600 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
                          Edit
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Prediction history */}
          {completedPredictions.length > 0 && (
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', marginBottom: 14 }}>Prediction history</div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 18px' }}>
                {completedPredictions.map((p: { id: string; match_id: string; predicted_winner: string; goal_difference: number | null; points_earned: number; matches: { home_team: string; away_team: string; home_flag: string; away_flag: string; home_score: number | null; away_score: number | null; winner_override: 'home' | 'away' | null } | null }, i: number) => {
                  const m = p.matches
                  if (!m) return null
                  const correct = p.points_earned > 0
                  const isLast = i === completedPredictions.length - 1
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 6px', borderBottom: isLast ? 'none' : '1px solid var(--border)', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <Flag code={getTeamCode(m.home_team)} size={22} />
                          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{m.home_team}</span>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted-foreground)' }}>vs</span>
                          <Flag code={getTeamCode(m.away_team)} size={22} />
                          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{m.away_team}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 4 }}>
                          Predicted{' '}
                          <span style={{ color: 'var(--foreground)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {p.predicted_winner === 'home' ? <><Flag code={getTeamCode(m.home_team)} size={12} /> {m.home_team}</> :
                             p.predicted_winner === 'away' ? <><Flag code={getTeamCode(m.away_team)} size={12} /> {m.away_team}</> : 'Draw'}
                            {p.goal_difference ? ` +${p.goal_difference}` : ''}
                          </span>
                          <span style={{ opacity: 0.4, margin: '0 7px' }}>·</span>
                          Result{' '}
                          <span style={{ color: 'var(--foreground)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                            {m.home_score} – {m.away_score}{m.winner_override ? ` (${m.winner_override === 'home' ? m.home_team : m.away_team} - pens)` : ''}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: correct ? 'oklch(0.80 0.13 164)' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                        {correct ? `+${p.points_earned}` : '0'} pts
                      </div>
                      {correct ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                             stroke="oklch(0.72 0.115 164)" strokeWidth="2.5"
                             strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                             stroke="oklch(0.62 0.18 25)" strokeWidth="2.5"
                             strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
      <div className="flex flex-col gap-2 md:hidden" style={{ paddingTop: 4, paddingBottom: 8 }}>
        <HowItWorksButton />
        <LogoutButton />
      </div>
    </div>
  )
}
