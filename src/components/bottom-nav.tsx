'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MatchesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/>
  </svg>
)

const LeaderboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
    <path d="M17 5h2a2 2 0 0 1 0 4h-2M7 5H5a2 2 0 0 0 0 4h2"/>
  </svg>
)

const MySpaceIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>
  </svg>
)

export function BottomNav() {
  const pathname = usePathname()

  const items = [
    { label: 'Matches',     href: '/',            icon: <MatchesIcon /> },
    { label: 'Leaderboard', href: '/leaderboard', icon: <LeaderboardIcon /> },
    { label: 'My Space',    href: '/myspace',      icon: <MySpaceIcon /> },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 md:hidden" style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 4px 12px',
      background: 'rgba(40, 50, 75, 0.55)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 24,
      boxShadow:
        '0 1px 0 rgba(255,255,255,0.06) inset, ' +
        '0 -8px 24px -10px rgba(0, 0, 0, 0.5), ' +
        '0 14px 32px -10px rgba(0, 0, 0, 0.55)',
    }}>
      {items.map((item) => {
        const active = isActive(item.href)
        return (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
            position: 'relative',
            padding: '2px 12px',
            textDecoration: 'none',
          }}>
            {active && (
              <span style={{
                position: 'absolute', top: -10, width: 20, height: 3,
                background: 'var(--primary)', borderRadius: 999,
                boxShadow: '0 0 12px rgba(98, 200, 150, 0.7)',
              }} />
            )}
            {item.icon}
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.1 }}>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
