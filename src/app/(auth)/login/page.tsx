'use client'

import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Your account is not active. Please contact IT support.',
  auth_failed:   'Sign in failed. Please try again.',
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorMessage = error ? ERROR_MESSAGES[error] ?? 'An error occurred. Please try again.' : null

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
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'linear-gradient(135deg, oklch(0.72 0.115 164) 0%, oklch(0.5 0.09 164) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.8" fill="none"/>
            <path d="M12 4 L13.5 9 L18 9.5 L14.5 12.5 L16 17 L12 14.5 L8 17 L9.5 12.5 L6 9.5 L10.5 9 Z"
                  fill="white" opacity="0.95"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', letterSpacing: -0.5 }}>DRBL</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', marginTop: 4 }}>
            FIFA World Cup 2026 · Office League
          </div>
        </div>
        {errorMessage && (
          <div style={{
            width: '100%', padding: '12px 16px',
            background: 'rgba(255,80,80,0.10)',
            border: '1px solid rgba(255,80,80,0.25)',
            borderRadius: 'var(--radius)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,0.9)"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,140,140,0.95)', lineHeight: 1.5 }}>
              {errorMessage}
            </span>
          </div>
        )}
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
