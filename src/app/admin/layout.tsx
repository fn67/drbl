import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

const Logo = () => (
  <div style={{
    width: 24, height: 24, borderRadius: 6,
    background: 'linear-gradient(135deg, oklch(0.72 0.115 164) 0%, oklch(0.5 0.09 164) 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.8" fill="none"/>
      <path d="M12 4 L13.5 9 L18 9.5 L14.5 12.5 L16 17 L12 14.5 L8 17 L9.5 12.5 L6 9.5 L10.5 9 Z"
            fill="white" opacity="0.95"/>
    </svg>
  </div>
)

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user?.is_admin) redirect('/')

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 0',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 20px 24px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 12,
        }}>
          <Logo />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--foreground)' }}>DRBL</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 1 }}>Admin panel</div>
          </div>
        </div>

        <nav style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { href: '/admin/matches', label: 'Match Management', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/>
              </svg>
            )},
            { href: '/admin/results', label: 'Results', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            )},
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'calc(var(--radius) - 4px)',
              textDecoration: 'none',
              fontSize: 14, fontWeight: 600, color: 'var(--foreground)',
              transition: 'background .15s',
            }}>
              {icon}
              {label}
            </Link>
          ))}
        </nav>

        {/* Back to app */}
        <div style={{ marginTop: 'auto', padding: '16px 8px 0', borderTop: '1px solid var(--border)' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'calc(var(--radius) - 4px)',
            textDecoration: 'none',
            fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to app
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
