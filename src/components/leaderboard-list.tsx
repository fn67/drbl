'use client'

import { useState } from 'react'
import { LeaderboardEntry } from '@/types'
import { PredictionsModal } from './predictions-modal'

const AVATAR_COLORS = [
  '#E8C887', '#87C8E8', '#E887C8', '#87E8C8', '#C8E887',
  '#C887E8', '#E8A887', '#87A8E8', '#A8E887', '#E887A8',
]

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
}

export function LeaderboardList({ entries, currentUserId }: LeaderboardListProps) {
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
          const initials = getInitials(entry.name)
          const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]

          return (
            <div key={entry.user_id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 14px',
              borderRadius: 'var(--radius)',
              background: isMe
                ? 'linear-gradient(90deg, rgba(98,200,150,0.12), rgba(98,200,150,0.04) 40%, var(--card))'
                : 'var(--card)',
              border: isMe ? '1px solid rgba(98,200,150,0.35)' : '1px solid var(--border)',
              borderLeft: isMe ? '3px solid var(--primary)' : '1px solid var(--border)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset',
            }}>
              {/* Avatar */}
              <div style={{ flexShrink: 0, width: 30, height: 30 }}>
                <div style={{
                  width: 30, height: 30,
                  borderRadius: 999, background: color,
                  color: 'rgba(0,0,0,0.72)', fontWeight: 700, fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                }}>{initials}</div>
              </div>

              {/* Name + stats — single line */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <span style={{
                  fontSize: 12.5, fontWeight: 600, color: 'var(--foreground)',
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
                  fontSize: 17, fontWeight: 700,
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
