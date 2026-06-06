'use client'

import { useState } from 'react'
import { LeaderboardEntry } from '@/types'
import { PredictionsModal } from './predictions-modal'

const AVATAR_COLORS = [
  '#E8C887', '#87C8E8', '#E887C8', '#87E8C8', '#C8E887',
  '#C887E8', '#E8A887', '#87A8E8', '#A8E887', '#E887A8',
]

const MEDAL_RING = {
  0: 'oklch(0.82 0.14 90)',
  1: 'oklch(0.82 0.01 250)',
  2: 'oklch(0.66 0.10 50)',
}

const MOCK_PREDICTIONS_PER_USER: Record<string, { match: string; prediction: string; result: string; pts: number; correct: boolean }[]> = {
  u1: [
    { match: 'Brazil vs Argentina', prediction: '🇧🇷 Brazil +2', result: '🇧🇷 Brazil +1', pts: 10, correct: true },
    { match: 'Mexico vs USA',       prediction: '🇺🇸 USA +2',   result: '🇺🇸 USA +2',   pts: 15, correct: true },
  ],
  u2: [
    { match: 'Brazil vs Argentina', prediction: '🇧🇷 Brazil +1', result: '🇧🇷 Brazil +1', pts: 15, correct: true },
  ],
  'user-1': [
    { match: 'Brazil vs Argentina', prediction: '🇧🇷 Brazil +2', result: '🇧🇷 Brazil +1', pts: 10, correct: true },
    { match: 'Mexico vs USA',       prediction: '🇺🇸 USA +2',   result: '🇺🇸 USA +2',   pts: 15, correct: true },
  ],
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[]
  currentUserId: string
  isFiltered?: boolean
}

export function LeaderboardList({ entries, currentUserId, isFiltered = false }: LeaderboardListProps) {
  const [modalUser, setModalUser] = useState<(LeaderboardEntry & {
    initials: string; color: string;
    predictions: { match: string; prediction: string; result: string; pts: number; correct: boolean }[]
  }) | null>(null)

  const handleView = (entry: LeaderboardEntry, idx: number) => {
    setModalUser({
      ...entry,
      initials: getInitials(entry.name),
      color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      predictions: MOCK_PREDICTIONS_PER_USER[entry.user_id] ?? [],
    })
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {entries.map((entry, idx) => {
          const isMe = entry.user_id === currentUserId
          const isTop3 = !isFiltered && idx < 3
          const initials = getInitials(entry.name)
          const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
          const medalRing = MEDAL_RING[idx as 0 | 1 | 2]

          return (
            <div key={entry.user_id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: isTop3 ? '9px 14px' : '7px 14px',
              borderRadius: 'var(--radius)',
              background: isMe
                ? 'linear-gradient(90deg, rgba(98,200,150,0.12), rgba(98,200,150,0.04) 40%, var(--card))'
                : isTop3
                ? 'oklch(0.30 0.027 264)'
                : 'var(--card)',
              border: isMe ? '1px solid rgba(98,200,150,0.35)' : '1px solid var(--border)',
              borderLeft: isMe ? '3px solid var(--primary)' : isTop3 ? '1px solid var(--border)' : '1px solid var(--border)',
              boxShadow: isTop3
                ? '0 1px 0 rgba(255,255,255,0.05) inset, 0 10px 28px -14px rgba(0,0,0,0.55)'
                : '0 1px 0 rgba(255,255,255,0.03) inset',
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0, width: isTop3 ? 34 : 30, height: isTop3 ? 34 : 30 }}>
                <div style={{
                  width: isTop3 ? 34 : 30, height: isTop3 ? 34 : 30,
                  borderRadius: 999, background: color,
                  color: 'rgba(0,0,0,0.72)', fontWeight: 700, fontSize: isTop3 ? 13 : 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isTop3
                    ? `inset 0 1px 0 rgba(255,255,255,0.35), 0 0 0 2px ${medalRing}, 0 0 14px -2px ${medalRing}`
                    : 'inset 0 1px 0 rgba(255,255,255,0.3)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                }}>{initials}</div>
                {isTop3 && (
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 14, height: 14,
                    borderRadius: 999, background: medalRing,
                    border: '2px solid var(--card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 6px -1px ${medalRing}`,
                  }}>
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="rgba(0,0,0,0.6)">
                      <path d="M12 2l2.6 6.3L21 9l-5 4.6L17.5 21 12 17.3 6.5 21 8 13.6 3 9l6.4-.7z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Name + stats — single line */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <span style={{
                  fontSize: isTop3 ? 13.5 : 12.5, fontWeight: 600, color: 'var(--foreground)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1,
                }}>{entry.name}</span>
                {isMe && (
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                    color: 'var(--primary-foreground)', background: 'var(--primary)',
                    padding: '1px 6px', borderRadius: 999, flexShrink: 0,
                  }}>You</span>
                )}
                <span style={{
                  fontSize: 11, fontWeight: 500, color: 'var(--muted-foreground)',
                  whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                       stroke="oklch(0.72 0.115 164)" strokeWidth="2.5"
                       strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {entry.correct_predictions} correct
                </span>
              </div>

              {/* Points */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, flexShrink: 0 }}>
                <span style={{
                  fontSize: isTop3 ? 19 : 17, fontWeight: 700,
                  color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums',
                  letterSpacing: -0.5, lineHeight: 1,
                }}>{entry.total_points.toLocaleString()}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted-foreground)' }}>pts</span>
              </div>

              {/* View button */}
              <button onClick={() => handleView(entry, idx)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600,
                padding: '4px 9px', borderRadius: 999,
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--foreground)', cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span className="hidden sm:inline">View</span>
              </button>
            </div>
          )
        })}
      </div>

      <PredictionsModal user={modalUser} open={modalUser !== null} onClose={() => setModalUser(null)} />
    </>
  )
}
