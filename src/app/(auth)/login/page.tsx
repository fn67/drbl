'use client'

import Image from 'next/image'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const handleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: { scopes: 'email', redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--background)',
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '48px 40px',
        maxWidth: 400, width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        boxShadow: '0 32px 64px -24px rgba(0,0,0,0.5)',
      }}>
        <Image src="/logo.svg" alt="DRBL" width={80} height={80} unoptimized />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 32, fontWeight: 900, color: 'var(--foreground)', letterSpacing: 4 }}>DRBL</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 4 }}>
            FIFA World Cup 2026 · Office League
          </div>
        </div>
        <button onClick={handleSignIn} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '14px 20px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--foreground)', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 600, fontSize: 15,
          justifyContent: 'center',
          transition: 'background .15s',
        }}>
          <svg width="20" height="20" viewBox="0 0 23 23" fill="none">
            <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
            <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
            <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
            <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
          </svg>
          Sign in with Microsoft
        </button>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', textAlign: 'center' }}>
          Use your company Microsoft account
        </p>
      </div>
    </div>
  )
}
