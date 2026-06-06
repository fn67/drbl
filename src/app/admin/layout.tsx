import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user?.is_admin) redirect('/')

  return (
    <div className="h-screen overflow-hidden bg-background flex">
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        height: '100%', overflow: 'hidden',
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
          <Image src="/logo.svg" alt="DRBL" width={44} height={28} unoptimized style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 900, fontSize: 15, color: 'var(--foreground)', letterSpacing: 1 }}>DRBL</div>
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
