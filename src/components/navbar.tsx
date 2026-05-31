'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Logo = () => (
  <div style={{
    width: 26, height: 26, borderRadius: 8,
    background: 'linear-gradient(135deg, oklch(0.72 0.115 164) 0%, oklch(0.5 0.09 164) 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.35), ' +
      '0 0 0 1px rgba(255,255,255,0.06), ' +
      '0 4px 12px -2px rgba(38, 170, 110, 0.45)',
    flexShrink: 0,
  }}>
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.8" fill="none"/>
      <path d="M12 4 L13.5 9 L18 9.5 L14.5 12.5 L16 17 L12 14.5 L8 17 L9.5 12.5 L6 9.5 L10.5 9 Z"
            fill="white" opacity="0.95"/>
    </svg>
  </div>
)

interface NavbarProps {
  points?: number
  userInitials?: string
}

export function Navbar({ points = 75, userInitials = 'RM' }: NavbarProps) {
  const pathname = usePathname()
  const links = [
    { label: 'Matches', href: '/' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'My Space', href: '/myspace' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const glassBg = 'rgba(40, 50, 75, 0.55)'
  const glassBorder = '1px solid rgba(255, 255, 255, 0.08)'
  const glassShadow =
    '0 1px 0 rgba(255,255,255,0.06) inset, ' +
    '0 0 0 1px rgba(255,255,255,0.04) inset, ' +
    '0 16px 40px -10px rgba(0, 0, 0, 0.55), ' +
    '0 4px 16px -4px rgba(0, 0, 0, 0.35)'
  const dividerCol = 'rgba(255,255,255,0.10)'

  return (
    <div className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none">
      <div style={{
        pointerEvents: 'auto',
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 8px 8px 14px',
        background: glassBg,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: glassBorder,
        borderRadius: 999,
        boxShadow: glassShadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingRight: 10 }}>
          <Logo />
          <span style={{
            fontWeight: 700, fontSize: 14.5, color: 'var(--foreground)',
            letterSpacing: -0.2,
          }}>
            DRBL
          </span>
        </div>
        <div style={{ width: 1, height: 22, background: dividerCol, margin: '0 4px' }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map((link) => (
            <Link key={link.label} href={link.href} style={{
              fontFamily: 'var(--font-quicksand), Quicksand, sans-serif',
              fontSize: 14, fontWeight: 600,
              color: isActive(link.href) ? 'var(--foreground)' : 'rgba(255,255,255,0.55)',
              padding: '7px 14px', borderRadius: 999,
              textDecoration: 'none',
              background: isActive(link.href) ? 'rgba(255,255,255,0.08)' : 'transparent',
              transition: 'background .15s',
            }}>{link.label}</Link>
          ))}
        </nav>
        <div style={{ width: 1, height: 22, background: dividerCol, margin: '0 4px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
          <Link href="/myspace" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 10px 6px 8px',
              fontFamily: 'var(--font-quicksand), Quicksand, sans-serif',
              fontSize: 13, fontWeight: 700,
              color: 'oklch(0.85 0.08 164)',
              background:
                'linear-gradient(180deg, rgba(98, 200, 150, 0.16) 0%, rgba(98, 200, 150, 0.08) 100%)',
              border: '1px solid rgba(98, 200, 150, 0.28)',
              borderRadius: 999,
              cursor: 'pointer',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.06), ' +
                '0 1px 2px rgba(0,0,0,0.2)',
              letterSpacing: 0.1,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="oklch(0.78 0.13 90)" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
                <path d="M17 5h2a2 2 0 0 1 0 4h-2M7 5H5a2 2 0 0 0 0 4h2"/>
              </svg>
              <span>{points}</span>
              <span style={{ opacity: 0.65, fontWeight: 600, fontSize: 11.5, marginLeft: -2 }}>pts</span>
            </div>
          </Link>
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            background: 'linear-gradient(135deg, #E8C887 0%, #C99A4B 100%)',
            color: '#3a2a10', fontWeight: 700, fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 3px rgba(0,0,0,0.4)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            letterSpacing: 0.3,
          }}>
            {userInitials}
          </div>
        </div>
      </div>
    </div>
  )
}
