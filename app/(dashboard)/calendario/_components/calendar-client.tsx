'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react'
import { FadeIn } from '@/components/ui/animate'
import { cn } from '@/lib/utils'

interface Post {
  id: string
  title: string
  pillar: string
  type: string
  status: string
  scheduledAt: string | null
  publishedAt: string | null
  createdAt: string
}

const PILLAR_COLORS: Record<string, string> = {
  'Disciplina': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'Clareza Mental': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Mentalidade de Crescimento': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'Produtividade Real': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  'UGC/Comunidade': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  'Conhecimento Rápido': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  APPROVED: 'Aprovado',
  SCHEDULED: 'Agendado',
  PUBLISHED: 'Publicado',
  REJECTED: 'Rejeitado',
  FAILED: 'Falhado',
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  APPROVED: 'bg-blue-500/10 text-blue-600',
  SCHEDULED: 'bg-amber-500/10 text-amber-600',
  PUBLISHED: 'bg-emerald-500/10 text-emerald-600',
  REJECTED: 'bg-red-500/10 text-red-600',
  FAILED: 'bg-red-500/10 text-red-600',
}

const TYPE_EMOJI: Record<string, string> = {
  REEL: '🎬',
  CARROSSEL: '🖼️',
  POST: '📷',
}

export function CalendarClient() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  const month = (currentDate?.getMonth() ?? 9) + 1
  const year = currentDate?.getFullYear() ?? 2026

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/posts?month=${month}&year=${year}`)
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => { loadPosts() }, [loadPosts])

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const getPostDate = (post: Post) => {
    return post.scheduledAt ?? post.publishedAt ?? post.createdAt
  }

  const getPostsForDay = (day: number) => {
    return (posts ?? []).filter((p: Post) => {
      const d = new Date(getPostDate(p))
      return d.getDate() === day && d.getMonth() === month - 1 && d.getFullYear() === year
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1))
  }

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  const [todayDate, setTodayDate] = useState<{d:number;m:number;y:number}|null>(null)
  useEffect(() => {
    const n = new Date()
    setTodayDate({ d: n.getDate(), m: n.getMonth(), y: n.getFullYear() })
  }, [])
  const isToday = (day: number) => todayDate ? day === todayDate.d && month - 1 === todayDate.m && year === todayDate.y : false

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Calendário de Conteúdo</h1>
            <p className="text-sm text-muted-foreground mt-1">Planificação mensal de publicações</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-display font-semibold text-sm min-w-[140px] text-center">
              {monthNames[month - 1]} {year}
            </span>
            <Button variant="outline" size="icon-sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </FadeIn>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayPosts = getPostsForDay(day)
              return (
                <div
                  key={day}
                  className={cn(
                    'min-h-[100px] rounded-lg p-1.5 border border-transparent transition-colors',
                    isToday(day) ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                  )}
                >
                  <div className={cn(
                    'text-xs font-medium mb-1',
                    isToday(day) ? 'text-primary font-bold' : 'text-muted-foreground'
                  )}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayPosts.map((p: Post) => (
                      <div
                        key={p.id}
                        className={cn(
                          'text-[10px] leading-tight p-1 rounded border cursor-pointer transition-all hover:shadow-sm',
                          PILLAR_COLORS[p.pillar] ?? 'bg-muted text-foreground'
                        )}
                        title={`${p.title} (${STATUS_LABELS[p.status] ?? p.status})`}
                      >
                        <span className="mr-0.5">{TYPE_EMOJI[p.type] ?? '📄'}</span>
                        <span className="truncate">{p.title?.length > 18 ? p.title.slice(0, 18) + '…' : p.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        {Object.entries(PILLAR_COLORS).map(([pillar, cls]) => (
          <div key={pillar} className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border', cls)}>
            {pillar}
          </div>
        ))}
      </div>
    </div>
  )
}
