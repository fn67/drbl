import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar points={75} userInitials="RM" />
      <main className="pt-24 pb-24 md:pb-8 px-4 max-w-2xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
