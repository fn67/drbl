export type MatchStatus = 'upcoming' | 'voting_open' | 'locked' | 'completed'

export type PredictedWinner = 'home' | 'draw' | 'away'

export interface User {
  id: string
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export interface Match {
  id: string
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  kickoff_at: string
  round: string
  group_name: string
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  manually_locked: boolean
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  predicted_winner: PredictedWinner
  goal_difference: number | null
  points_earned: number
  created_at: string
  user?: User
  match?: Match
}

export interface LeaderboardEntry {
  user_id: string
  name: string
  email: string
  total_points: number
  correct_predictions: number
  total_predictions: number
}
