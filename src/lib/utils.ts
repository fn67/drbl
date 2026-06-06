import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MatchStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function computeStatus(match: {
  kickoff_at: string
  status: string
  manually_locked?: boolean
}): MatchStatus {
  if (match.status === 'completed') return 'completed'
  if (match.manually_locked) return 'locked'
  const now = new Date()
  const kickoff = new Date(match.kickoff_at)
  const votingOpens = new Date(kickoff.getTime() - 48 * 60 * 60 * 1000)
  if (now >= kickoff) return 'locked'
  if (now >= votingOpens) return 'voting_open'
  return 'upcoming'
}

const AVATAR_COLORS = [
  '#E8C887', '#87C8E8', '#E887C8', '#87E8C8', '#C8E887',
  '#C887E8', '#E8A887', '#87A8E8', '#A8E887', '#E887A8',
]

export function getAvatarColor(name: string): string {
  let hash = 0
  for (const c of name) hash = ((hash << 5) - hash + c.charCodeAt(0)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function getMatchWinner(match: {
  status: string
  home_score: number | null
  away_score: number | null
  winner_override?: 'home' | 'away' | null
}): 'home' | 'draw' | 'away' | undefined {
  if (match.status !== 'completed' || match.home_score === null || match.away_score === null) return undefined
  if (match.winner_override) return match.winner_override
  if (match.home_score > match.away_score) return 'home'
  if (match.away_score > match.home_score) return 'away'
  return 'draw'
}
