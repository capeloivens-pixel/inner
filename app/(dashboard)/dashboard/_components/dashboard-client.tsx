'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Clock, CheckCircle, Sparkles, Eye, PauseCircle, PlayCircle, Activity } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { SafeDate } from '@/components/safe-format'
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate'

interface Stats {
  drafts: number
  scheduled: number
  publishedThisWeek: number
  total: number
  nextScheduled: { scheduledAt: string; title: string } | null
}

interface Log {
  id: string
  action: string
  details: string | null
  createdAt: string
  post: { title: string; pillar: string } | null
}

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [logs, setLogs] = useState<Log[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/posts/stats').then(r => r.json()),
      fetch('/api/logs?limit=10').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
    ]).then(([s, l, st]) => {
      setStats(s)
      setLogs(Array.isArray(l) ? l : [])
      setSettings(st)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const togglePause = async () => {
    const newPause = !settings?.globalPause
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ globalPause: newPause }),
    })
    if (res.ok) {
      const updated = await res.json()
      setSettings(updated)
      toast.success(newPause ? 'Agendamentos pausados' : 'Agendamentos retomados')
    }
  }

  const actionLabel = (action: string) => {
    const map: Record<string, string> = {
      POST_CREATED: 'Criado',
      POST_APPROVED: 'Aprovado',
      POST_SCHEDULED: 'Agendado',
      POST_PUBLISHED: 'Publicado',
      POST_REJECTED: 'Rejeitado',
      POST_UPDATED: 'Atualizado',
      SETTINGS_UPDATED: 'Config.',
      ASSET_UPLOADED: 'Upload',
    }
    return map[action] ?? action
  }

  const actionColor = (action: string) => {
    if (action?.includes('PUBLISHED')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    if (action?.includes('APPROVED') || action?.includes('SCHEDULED')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    if (action?.includes('REJECTED')) return 'bg-red-500/10 text-red-600 dark:text-red-400'
    return 'bg-muted text-muted-foreground'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Visão geral da conta @inner_momentum_for_life</p>
          </div>
          <Button
            variant={settings?.globalPause ? 'default' : 'outline'}
            onClick={togglePause}
            className="gap-2"
          >
            {settings?.globalPause ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            {settings?.globalPause ? 'Retomar' : 'Pausar Tudo'}
          </Button>
        </div>
      </FadeIn>

      {settings?.globalPause && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3">
          <PauseCircle className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
            Todos os agendamentos estão pausados. Clique em &ldquo;Retomar&rdquo; para reativar.
          </span>
        </div>
      )}

      <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rascunhos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{stats?.drafts ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Pendentes para revisão</p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Agendados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{stats?.scheduled ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Prontos para publicar</p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Publicados</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{stats?.publishedThisWeek ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Próximo</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stats?.nextScheduled ? (
                <>
                  <div className="text-sm font-bold truncate">{stats.nextScheduled.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <SafeDate date={stats.nextScheduled.scheduledAt} options={{ dateStyle: 'medium', timeStyle: 'short' }} locale="pt-PT" />
                  </p>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Nenhum agendado</div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SlideIn from="left" className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/gerar">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Sparkles className="w-4 h-4" /> Gerar Conteúdo com IA
                </Button>
              </Link>
              <Link href="/calendario">
                <Button className="w-full justify-start gap-2 mt-2" variant="outline">
                  <Calendar className="w-4 h-4" /> Ver Calendário
                </Button>
              </Link>
              <Link href="/rascunhos">
                <Button className="w-full justify-start gap-2 mt-2" variant="outline">
                  <Eye className="w-4 h-4" /> Rever Rascunhos
                  {(stats?.drafts ?? 0) > 0 && (
                    <Badge variant="destructive" className="ml-auto text-[10px] px-1.5">{stats?.drafts}</Badge>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </SlideIn>

        <SlideIn from="right" className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {(logs ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Sem atividade recente.</p>
                )}
                {(logs ?? []).map((log: Log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${actionColor(log.action)}`}>
                      {actionLabel(log.action)}
                    </span>
                    <span className="text-muted-foreground truncate flex-1">{log.details ?? ''}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      <SafeDate date={log.createdAt} options={{ dateStyle: 'short', timeStyle: 'short' }} locale="pt-PT" />
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideIn>
      </div>
    </div>
  )
}
