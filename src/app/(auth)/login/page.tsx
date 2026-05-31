export default function LoginPage() {
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
        <button style={{
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
