export interface Team {
  name: string
  flag: string
  group: string
}

export const TEAMS: Team[] = [
  // Group A
  { name: 'USA',          flag: '🇺🇸', group: 'Group A' },
  { name: 'Brazil',       flag: '🇧🇷', group: 'Group A' },
  { name: 'Morocco',      flag: '🇲🇦', group: 'Group A' },
  { name: 'New Zealand',  flag: '🇳🇿', group: 'Group A' },
  // Group B
  { name: 'Mexico',       flag: '🇲🇽', group: 'Group B' },
  { name: 'Germany',      flag: '🇩🇪', group: 'Group B' },
  { name: 'Colombia',     flag: '🇨🇴', group: 'Group B' },
  { name: 'Saudi Arabia', flag: '🇸🇦', group: 'Group B' },
  // Group C
  { name: 'Canada',       flag: '🇨🇦', group: 'Group C' },
  { name: 'England',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'Group C' },
  { name: 'Ivory Coast',  flag: '🇨🇮', group: 'Group C' },
  { name: 'Japan',        flag: '🇯🇵', group: 'Group C' },
  // Group D
  { name: 'France',       flag: '🇫🇷', group: 'Group D' },
  { name: 'Argentina',    flag: '🇦🇷', group: 'Group D' },
  { name: 'Nigeria',      flag: '🇳🇬', group: 'Group D' },
  { name: 'South Korea',  flag: '🇰🇷', group: 'Group D' },
  // Group E
  { name: 'Spain',        flag: '🇪🇸', group: 'Group E' },
  { name: 'Ecuador',      flag: '🇪🇨', group: 'Group E' },
  { name: 'Egypt',        flag: '🇪🇬', group: 'Group E' },
  { name: 'Australia',    flag: '🇦🇺', group: 'Group E' },
  // Group F
  { name: 'Portugal',     flag: '🇵🇹', group: 'Group F' },
  { name: 'Uruguay',      flag: '🇺🇾', group: 'Group F' },
  { name: 'Tunisia',      flag: '🇹🇳', group: 'Group F' },
  { name: 'South Africa', flag: '🇿🇦', group: 'Group F' },
  // Group G
  { name: 'Netherlands',  flag: '🇳🇱', group: 'Group G' },
  { name: 'Costa Rica',   flag: '🇨🇷', group: 'Group G' },
  { name: 'Senegal',      flag: '🇸🇳', group: 'Group G' },
  { name: 'Jordan',       flag: '🇯🇴', group: 'Group G' },
  // Group H
  { name: 'Belgium',      flag: '🇧🇪', group: 'Group H' },
  { name: 'Paraguay',     flag: '🇵🇾', group: 'Group H' },
  { name: 'Ghana',        flag: '🇬🇭', group: 'Group H' },
  { name: 'Qatar',        flag: '🇶🇦', group: 'Group H' },
  // Group I
  { name: 'Switzerland',  flag: '🇨🇭', group: 'Group I' },
  { name: 'Honduras',     flag: '🇭🇳', group: 'Group I' },
  { name: 'Cameroon',     flag: '🇨🇲', group: 'Group I' },
  { name: 'Iran',         flag: '🇮🇷', group: 'Group I' },
  // Group J
  { name: 'Denmark',      flag: '🇩🇰', group: 'Group J' },
  { name: 'Panama',       flag: '🇵🇦', group: 'Group J' },
  { name: 'Turkey',       flag: '🇹🇷', group: 'Group J' },
  { name: 'Iraq',         flag: '🇮🇶', group: 'Group J' },
  // Group K
  { name: 'Italy',        flag: '🇮🇹', group: 'Group K' },
  { name: 'Croatia',      flag: '🇭🇷', group: 'Group K' },
  { name: 'Poland',       flag: '🇵🇱', group: 'Group K' },
  { name: 'Slovakia',     flag: '🇸🇰', group: 'Group K' },
  // Group L
  { name: 'Austria',      flag: '🇦🇹', group: 'Group L' },
  { name: 'Scotland',     flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'Group L' },
  { name: 'Hungary',      flag: '🇭🇺', group: 'Group L' },
  { name: 'Serbia',       flag: '🇷🇸', group: 'Group L' },
]

export const GROUPS = ['Group A','Group B','Group C','Group D','Group E','Group F',
                       'Group G','Group H','Group I','Group J','Group K','Group L']
