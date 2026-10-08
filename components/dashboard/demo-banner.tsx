'use client'

import { AlertTriangle } from 'lucide-react'
import { useInstagramStatus } from '@/hooks/use-instagram-status'

export function DemoBanner() {
  const { isConnected, isLoading } = useInstagramStatus()

  if (isLoading || isConnected) return null

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-2 text-sm">
      <AlertTriangle className="w-4 h-4 text-amber-500" />
      <span className="text-amber-700 dark:text-amber-400 font-medium">
        Modo Demonstração — Instagram não ligado. Configure nas Definições.
      </span>
    </div>
  )
}
