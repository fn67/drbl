'use client'

import { useState } from 'react'
import { Match, Prediction, PredictedWinner } from '@/types'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const KNOCKOUT_ROUNDS = ['Round of 16', 'Quarter Final', 'Semi Final', 'Final']

interface VoteFormProps {
  match: Match
  existingPrediction?: Prediction
}

export function VoteForm({ match, existingPrediction }: VoteFormProps) {
  const router = useRouter()
  const [pick, setPick] = useState<PredictedWinner | null>(
    existingPrediction?.predicted_winner ?? null
  )
  const [diff, setDiff] = useState<number | null>(
    existingPrediction?.goal_difference ?? null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isKnockout = KNOCKOUT_ROUNDS.includes(match.round)
  const isTeam = pick === 'home' || pick === 'away'
  const canSubmit = pick !== null && (pick === 'draw' || diff !== null)

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id, predictedWinner: pick, goalDifference: diff }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        toast.error(error ?? 'Failed to submit prediction')
        return
      }
      toast.success(existingPrediction ? 'Prediction updated!' : 'Prediction confirmed!')
      router.refresh()
    } catch {
      toast.error('Network error — please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePillStyle = (active: boolean, muted = false) => ({
    flex: 1,
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 700,
    padding: '16px 12px',
    borderRadius: 'calc(var(--radius) - 2px)',
    border: active ? '1px solid transparent' : '1px solid var(--border)',
    background: active
      ? 'var(--primary)'
      : muted ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.04)',
    color: active
      ? 'var(--primary-foreground)'
      : muted ? 'rgba(255,255,255,0.55)' : 'var(--foreground)',
    cursor: 'pointer',
    letterSpacing: 0.1,
    transition: 'all .15s',
    boxShadow: active
      ? '0 2px 0 rgba(0,0,0,0.25), 0 8px 18px -4px rgba(98, 200, 150, 0.55)'
      : 'inset 0 1px 0 rgba(255,255,255,0.03)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  } as React.CSSProperties)

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '22px 24px 24px',
      boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 16px 40px -16px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)',
          letterSpacing: 1.2, textTransform: 'uppercase',
        }}>
          {existingPrediction ? 'Your prediction' : 'Cast your prediction'}
        </div>
        {existingPrediction && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(98, 200, 150, 0.16)', color: 'oklch(0.85 0.10 164)',
            fontSize: 12, fontWeight: 600,
            padding: '5px 10px', borderRadius: 999,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'oklch(0.72 0.115 164)' }} />
            Submitted
          </span>
        )}
      </div>

      {/* Team toggles */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={togglePillStyle(pick === 'home')} onClick={() => setPick('home')}>
          <Flag code={getTeamCode(match.home_team)} size={22} />
          {match.home_team}
        </button>
        {!isKnockout && (
          <button style={togglePillStyle(pick === 'draw', pick !== 'draw')} onClick={() => setPick('draw')}>
            <span style={{ opacity: 0.7 }}>Draw</span>
          </button>
        )}
        <button style={togglePillStyle(pick === 'away')} onClick={() => setPick('away')}>
          <Flag code={getTeamCode(match.away_team)} size={22} />
          {match.away_team}
        </button>
      </div>

      {/* Goal diff row */}
      {isTeam && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)' }}>
              Win by how many goals?
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Flag code={getTeamCode(pick === 'home' ? match.home_team : match.away_team)} size={14} />
              {pick === 'home' ? match.home_team : match.away_team}
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+{diff ?? '?'}</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([1, 2, 3, 4, '5+'] as const).map((n) => {
              const val = n === '5+' ? 5 : n
              const active = n === '5+' ? diff !== null && diff >= 5 : diff === n
              return (
                <button key={n} onClick={() => setDiff(val)} style={{
                  flex: 1,
                  fontFamily: 'inherit',
                  fontSize: 17, fontWeight: 700,
                  padding: '13px 0',
                  borderRadius: 'calc(var(--radius) - 4px)',
                  border: active ? '1px solid transparent' : '1px solid var(--border)',
                  background: active ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  color: active ? 'var(--primary-foreground)' : 'var(--foreground)',
                  cursor: 'pointer',
                  boxShadow: active
                    ? '0 2px 0 rgba(0,0,0,0.25), 0 6px 14px -4px rgba(98, 200, 150, 0.5)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                }}>
                  +{n}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} style={{
        width: '100%',
        background: canSubmit ? 'var(--primary)' : 'var(--muted)',
        color: canSubmit ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
        border: 'none', fontFamily: 'inherit',
        fontWeight: 700, fontSize: 15.5, letterSpacing: 0.2, padding: '15px 18px',
        borderRadius: 'calc(var(--radius) - 4px)',
        cursor: canSubmit && !isSubmitting ? 'pointer' : 'not-allowed',
        opacity: isSubmitting ? 0.7 : 1,
        boxShadow: canSubmit ? '0 2px 0 rgba(0,0,0,0.25), 0 10px 20px -6px rgba(98,200,150,0.6)' : 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginTop: 4, transition: 'all .15s',
      }}>
        {isSubmitting ? 'Submitting…' : existingPrediction ? 'Update prediction' : 'Confirm prediction'}
        {!isSubmitting && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        )}
      </button>

      {existingPrediction && (
        <div style={{
          fontSize: 12.5, color: 'var(--muted-foreground)',
          textAlign: 'center', letterSpacing: 0.1, marginTop: -2,
        }}>
          Voting closes at kickoff — you can edit until then.
        </div>
      )}
    </div>
  )
}
