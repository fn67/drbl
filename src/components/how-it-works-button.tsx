'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { HowItWorksContent } from './how-it-works-content'

export function HowItWorksButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          padding: '12px 18px',
          borderRadius: 'calc(var(--radius) - 4px)',
          border: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.04)',
          color: 'var(--foreground)',
          cursor: 'pointer',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
        How it works
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px 24px 32px' }}
        >
          <SheetHeader style={{ marginBottom: 20, padding: 0 }}>
            <SheetTitle style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>
              How DRBL works
            </SheetTitle>
          </SheetHeader>
          <HowItWorksContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
