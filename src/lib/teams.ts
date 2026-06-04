export interface Team {
  name: string
  code: string  // ISO 3166-1 alpha-2 (lowercase), e.g. 'us', 'gb-eng'
  group: string
}

export const TEAMS: Team[] = [
  // Group A
  { name: 'USA',          code: 'us',     group: 'Group A' },
  { name: 'Brazil',       code: 'br',     group: 'Group A' },
  { name: 'Morocco',      code: 'ma',     group: 'Group A' },
  { name: 'New Zealand',  code: 'nz',     group: 'Group A' },
  // Group B
  { name: 'Mexico',       code: 'mx',     group: 'Group B' },
  { name: 'Germany',      code: 'de',     group: 'Group B' },
  { name: 'Colombia',     code: 'co',     group: 'Group B' },
  { name: 'Saudi Arabia', code: 'sa',     group: 'Group B' },
  // Group C
  { name: 'Canada',       code: 'ca',     group: 'Group C' },
  { name: 'England',      code: 'gb-eng', group: 'Group C' },
  { name: 'Ivory Coast',  code: 'ci',     group: 'Group C' },
  { name: 'Japan',        code: 'jp',     group: 'Group C' },
  // Group D
  { name: 'France',       code: 'fr',     group: 'Group D' },
  { name: 'Argentina',    code: 'ar',     group: 'Group D' },
  { name: 'Nigeria',      code: 'ng',     group: 'Group D' },
  { name: 'South Korea',  code: 'kr',     group: 'Group D' },
  // Group E
  { name: 'Spain',        code: 'es',     group: 'Group E' },
  { name: 'Ecuador',      code: 'ec',     group: 'Group E' },
  { name: 'Egypt',        code: 'eg',     group: 'Group E' },
  { name: 'Australia',    code: 'au',     group: 'Group E' },
  // Group F
  { name: 'Portugal',     code: 'pt',     group: 'Group F' },
  { name: 'Uruguay',      code: 'uy',     group: 'Group F' },
  { name: 'Tunisia',      code: 'tn',     group: 'Group F' },
  { name: 'South Africa', code: 'za',     group: 'Group F' },
  // Group G
  { name: 'Netherlands',  code: 'nl',     group: 'Group G' },
  { name: 'Costa Rica',   code: 'cr',     group: 'Group G' },
  { name: 'Senegal',      code: 'sn',     group: 'Group G' },
  { name: 'Jordan',       code: 'jo',     group: 'Group G' },
  // Group H
  { name: 'Belgium',      code: 'be',     group: 'Group H' },
  { name: 'Paraguay',     code: 'py',     group: 'Group H' },
  { name: 'Ghana',        code: 'gh',     group: 'Group H' },
  { name: 'Qatar',        code: 'qa',     group: 'Group H' },
  // Group I
  { name: 'Switzerland',  code: 'ch',     group: 'Group I' },
  { name: 'Honduras',     code: 'hn',     group: 'Group I' },
  { name: 'Cameroon',     code: 'cm',     group: 'Group I' },
  { name: 'Iran',         code: 'ir',     group: 'Group I' },
  // Group J
  { name: 'Denmark',      code: 'dk',     group: 'Group J' },
  { name: 'Panama',       code: 'pa',     group: 'Group J' },
  { name: 'Turkey',       code: 'tr',     group: 'Group J' },
  { name: 'Iraq',         code: 'iq',     group: 'Group J' },
  // Group K
  { name: 'Italy',        code: 'it',     group: 'Group K' },
  { name: 'Croatia',      code: 'hr',     group: 'Group K' },
  { name: 'Poland',       code: 'pl',     group: 'Group K' },
  { name: 'Slovakia',     code: 'sk',     group: 'Group K' },
  // Group L
  { name: 'Austria',      code: 'at',     group: 'Group L' },
  { name: 'Scotland',     code: 'gb-sct', group: 'Group L' },
  { name: 'Hungary',      code: 'hu',     group: 'Group L' },
  { name: 'Serbia',       code: 'rs',     group: 'Group L' },
]

export const GROUPS = ['Group A','Group B','Group C','Group D','Group E','Group F',
                       'Group G','Group H','Group I','Group J','Group K','Group L']

export function getTeamCode(name: string): string {
  return TEAMS.find(t => t.name === name)?.code ?? 'un'
}
