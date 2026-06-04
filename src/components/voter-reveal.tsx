'use client'

import { useEffect, useState } from 'react'
import { Flag } from '@/components/flag'
import { getTeamCode } from '@/lib/teams'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

interface Voter {
  name: string
  initials: string
  color: string
  diff: number | null
  correct?: boolean
  pts?: number
  bonus?: number
}

interface VoterRevealProps {
  homeTeam: string
  homeFlag: string
  awayTeam: string
  awayFlag: string
  votersHome: Voter[]
  votersDraw: Voter[]
  votersAway: Voter[]
  completed: boolean
  winner?: 'home' | 'draw' | 'away'
}

const VoterRow = ({ voter, completed }: { voter: Voter; completed: boolean }) => {
  const correct = completed && voter.correct === true
  const wrong = completed && voter.correct === false
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px',
      borderRadius: 'calc(var(--radius) - 6px)',
      background: correct ? 'rgba(98, 200, 150, 0.08)' : 'rgba(255,255,255,0.025)',
      border: correct ? '1px solid rgba(98, 200, 150, 0.22)' : '1px solid transparent',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 999,
        background: voter.color,
        color: 'rgba(0,0,0,0.7)', fontWeight: 700, fontSize: 11,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '1.5px solid rgba(255,255,255,0.1)',
      }}>{voter.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 600, color: 'var(--foreground)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{voter.name}</div>
        <div style={{
          fontSize: 11.5, fontWeight: 600, color: 'var(--muted-foreground)',
          marginTop: 1, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {voter.diff !== null && voter.diff !== undefined ? `+${voter.diff}` : 'Draw'}
          {voter.bonus && (
            <span style={{
              padding: '1px 5px', borderRadius: 4,
              background: 'rgba(240, 170, 80, 0.16)',
              color: 'oklch(0.85 0.10 80)',
              fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}>+{voter.bonus} bonus</span>
          )}
        </div>
      </div>
      {completed && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          {correct ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="oklch(0.72 0.115 164)" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="oklch(0.62 0.18 25)" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          )}
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: correct ? 'oklch(0.78 0.13 164)' : 'rgba(255,255,255,0.4)',
            fontVariantNumeric: 'tabular-nums',
          }}>{correct ? `+${voter.pts}` : '0'} pts</span>
        </div>
      )}
    </div>
  )
}

const VoterColumn = ({
  header, sub, voters, completed, isWinner,
}: {
  header: React.ReactNode; sub: string; voters: Voter[];
  completed: boolean; isWinner: boolean;
}) => (
  <div style={{
    flex: 1, minWidth: 0,
    background: isWinner
      ? 'linear-gradient(180deg, rgba(98, 200, 150, 0.10), rgba(98, 200, 150, 0.03))'
      : 'var(--card)',
    border: isWinner
      ? '1px solid rgba(98, 200, 150, 0.40)'
      : '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 14,
    display: 'flex', flexDirection: 'column', gap: 10,
    position: 'relative',
    boxShadow: isWinner
      ? '0 0 0 1px rgba(98, 200, 150, 0.15) inset, 0 12px 32px -10px rgba(98, 200, 150, 0.25)'
      : '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.4)',
  }}>
    {isWinner && (
      <div style={{
        position: 'absolute', top: -10, right: 14,
        background: 'var(--primary)', color: 'var(--primary-foreground)',
        fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6,
        textTransform: 'uppercase',
        padding: '3px 9px', borderRadius: 999,
        boxShadow: '0 4px 12px -2px rgba(98, 200, 150, 0.6)',
      }}>Correct</div>
    )}
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>{header}</div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)',
          padding: '2px 8px', borderRadius: 999,
          background: 'rgba(255,255,255,0.05)',
        }}>{voters.length}</div>
      </div>
      <div style={{
        fontSize: 11.5, fontWeight: 600, color: 'var(--muted-foreground)',
        marginTop: 3,
      }}>{sub}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {voters.length === 0 ? (
        <div style={{
          padding: '20px 8px', textAlign: 'center',
          fontSize: 12.5, color: 'var(--muted-foreground)', fontWeight: 600,
          border: '1px dashed var(--border)', borderRadius: 'calc(var(--radius) - 6px)',
        }}>No voters</div>
      ) : voters.map((v, i) => (
        <VoterRow key={i} voter={v} completed={completed} />
      ))}
    </div>
  </div>
)

export function VoterReveal({
  homeTeam, homeFlag, awayTeam, awayFlag,
  votersHome, votersDraw, votersAway,
  completed, winner,
}: VoterRevealProps) {
  const isMobile = useIsMobile()
  const total = votersHome.length + votersDraw.length + votersAway.length
  const correct = completed
    ? (winner === 'home' ? votersHome : winner === 'draw' ? votersDraw : votersAway)
        .filter(v => v.correct).length
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary bar (completed only) */}
      {completed && total > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14, padding: '14px 18px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 1 }}>Voters</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums' }}>{total}</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 1 }}>Got it right</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                {correct} <span style={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: 14 }}>· {Math.round(100 * correct / total)}%</span>
              </div>
            </div>
          </div>
          <div style={{
            flex: 1, maxWidth: 320,
            height: 8, borderRadius: 999, background: 'var(--muted)',
            overflow: 'hidden', marginLeft: 18,
          }}>
            <div style={{
              height: '100%', width: `${(correct / total) * 100}%`,
              background: 'linear-gradient(90deg, oklch(0.72 0.115 164), oklch(0.85 0.10 164))',
              boxShadow: '0 0 12px rgba(98, 200, 150, 0.5)',
            }} />
          </div>
        </div>
      )}

      {/* Section header */}
      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>
        Who voted for who
      </div>

      {/* Three columns */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
        <VoterColumn
          header={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Flag code={getTeamCode(homeTeam)} size={18} />{homeTeam}</span>}
          sub="Win prediction"
          voters={votersHome}
          completed={completed}
          isWinner={completed && winner === 'home'}
        />
        <VoterColumn
          header="Draw"
          sub="No goal diff needed"
          voters={votersDraw}
          completed={completed}
          isWinner={completed && winner === 'draw'}
        />
        <VoterColumn
          header={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Flag code={getTeamCode(awayTeam)} size={18} />{awayTeam}</span>}
          sub="Win prediction"
          voters={votersAway}
          completed={completed}
          isWinner={completed && winner === 'away'}
        />
      </div>

      {!completed && (
        <div style={{
          fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600,
          textAlign: 'center',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed var(--border)',
          borderRadius: 'calc(var(--radius) - 4px)',
        }}>
          Results and points will update once the match is completed
        </div>
      )}
    </div>
  )
}
