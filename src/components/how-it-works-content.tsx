const SECTIONS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.115 164)"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    title: 'Predict matches',
    lines: [
      'For each match, pick which team wins or predict a draw.',
      'If you pick a team, also choose the goal difference.',
      'You can change your prediction anytime before kickoff.',
    ],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.78 0.13 90)"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
        <path d="M17 5h2a2 2 0 0 1 0 4h-2M7 5H5a2 2 0 0 0 0 4h2"/>
      </svg>
    ),
    title: 'Points',
    lines: [
      'Correct winner prediction → 10 points',
      'Correct draw prediction → 10 points',
      'Correct winner + exact goal difference → 15 points',
      'Wrong prediction → 0 points',
    ],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.75 0.09 230)"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
      </svg>
    ),
    title: 'Voting window',
    lines: [
      'Voting opens 48 hours before each match.',
      'Locks automatically when the match kicks off.',
    ],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.14 30)"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Knockout matches',
    lines: [
      'Draw option is not available for knockout matches.',
      'If a knockout match ends level after extra time, the match is decided on penalties. The team that wins on penalties is the winner — no bonus points for goal difference in penalty matches.',
    ],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.10 50)"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Leaderboard',
    lines: [
      'Points accumulate across all matches.',
      'Most points at the end of the tournament wins.',
    ],
  },
]

export function HowItWorksContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {SECTIONS.map(({ icon, title, lines }) => (
        <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
          <div style={{ paddingTop: 2 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--foreground)', marginBottom: 5 }}>
              {title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {lines.map((line, i) => (
                <div key={i} style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
