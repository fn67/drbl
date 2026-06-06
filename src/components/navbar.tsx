'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { HowItWorksContent } from './how-it-works-content'

interface NavbarProps {
  points?: number
  userInitials?: string
  userName?: string
  userEmail?: string
  isAdmin?: boolean
}

export function Navbar({ points = 75, userInitials = 'RM', userName, userEmail, isAdmin }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }
  const links = [
    { label: 'Matches', href: '/' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'My Space', href: '/myspace' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin/matches' }] : []),
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
    <>
    <div className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-4xl" style={{
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 10 }}>
          <Image src="/logo.svg" alt="DRBL" width={20} height={20} unoptimized style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontWeight: 900, fontSize: 18, color: 'var(--foreground)',
            letterSpacing: 2,
          }}>
            DRBL
          </span>
        </div>
        <div style={{ width: 1, height: 22, background: dividerCol, margin: '0 4px' }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
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
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setOpen(v => !v)}
              style={{
                width: 32, height: 32, borderRadius: 999,
                background: 'linear-gradient(135deg, #E8C887 0%, #C99A4B 100%)',
                color: '#3a2a10', fontWeight: 700, fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 3px rgba(0,0,0,0.4)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                letterSpacing: 0.3, cursor: 'pointer', padding: 0,
                outline: open ? '2px solid rgba(255,255,255,0.2)' : 'none',
                outlineOffset: 2,
              }}
            >
              {userInitials}
            </button>

            {open && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                minWidth: 220,
                background: 'rgba(28,34,52,0.96)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 14,
                boxShadow: '0 16px 48px -12px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset',
                padding: '6px',
                zIndex: 100,
              }}>
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.2, lineHeight: 1.2 }}>
                    {userName ?? userInitials}
                  </div>
                  {userEmail && (
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {userEmail}
                    </div>
                  )}
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 6px' }} />
                <button
                  onClick={() => { setOpen(false); setHelpOpen(true) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', marginTop: 6,
                    padding: '9px 12px', borderRadius: 9,
                    background: 'transparent', border: 'none',
                    color: 'var(--foreground)', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5,
                    transition: 'background .12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                  Help
                </button>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 6px' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', marginTop: 6,
                    padding: '9px 12px', borderRadius: 9,
                    background: 'transparent', border: 'none',
                    color: 'rgba(255,100,100,0.85)', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5,
                    transition: 'background .12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,80,80,0.10)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent style={{ background: 'var(--card)', border: '1px solid var(--border)', maxWidth: 480 }}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>
            How DRBL works
          </DialogTitle>
        </DialogHeader>
        <HowItWorksContent />
      </DialogContent>
    </Dialog>
    </>
  )
}
