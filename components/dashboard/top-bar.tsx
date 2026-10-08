'use client'

import { PanelLeft, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { signOut, useSession } from 'next-auth/react'
import { DemoBanner } from './demo-banner'

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession()

  return (
    <>
      <DemoBanner />
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b bg-background/80 backdrop-blur-md">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onMenuClick}>
          <PanelLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user?.name ?? session.user?.email ?? ''}
              </span>
              <Button variant="ghost" size="icon-sm" onClick={() => signOut({ redirectTo: '/login' })}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
