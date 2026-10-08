'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Calendar, Sparkles, FileText, Film, BarChart3, Settings, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDraftCount } from '@/hooks/use-draft-count'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendario', label: 'Calendário', icon: Calendar },
  { href: '/gerar', label: 'Gerar Conteúdo', icon: Sparkles },
  { href: '/rascunhos', label: 'Rascunhos', icon: FileText, badge: true },
  { href: '/assets', label: 'Assets / Vídeos', icon: Film },
  { href: '/estrategia', label: 'Estratégia', icon: BarChart3 },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { count: draftCount } = useDraftCount()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-normal lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight">Inner Momentum</span>
            <span className="block text-[10px] text-muted-foreground leading-none">Manager</span>
          </div>
        </Link>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-fast',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (draftCount ?? 0) > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
                  {draftCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="text-[10px] text-muted-foreground text-center">
          @inner_momentum_for_life
        </div>
      </div>
    </aside>
  )
}
