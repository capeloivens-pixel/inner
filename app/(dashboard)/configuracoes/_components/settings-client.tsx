'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Settings, Instagram, Shield, Clock, Activity, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'
import { useInstagramStatus } from '@/hooks/use-instagram-status'
import { SafeDate } from '@/components/safe-format'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SettingsData {
  id: string
  publicationMode: string
  postsPerWeek: number
  preferredDays: string
  preferredTimes: string
  globalPause: boolean
}

interface LogEntry {
  id: string
  action: string
  details: string | null
  createdAt: string
}

export function SettingsClient() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showAutoConfirm, setShowAutoConfirm] = useState(false)
  const { isConnected, status, username } = useInstagramStatus()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [settingsRes, logsRes] = await Promise.all([
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/logs?limit=50').then(r => r.json()),
      ])
      setSettings(settingsRes)
      setLogs(Array.isArray(logsRes) ? logsRes : [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const updateSetting = async (data: Partial<SettingsData>) => {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      setSettings(updated)
      toast.success('Configurações atualizadas')
    }
  }

  const toggleAutoPublish = () => {
    if (settings?.publicationMode === 'DRAFT') {
      setShowAutoConfirm(true)
    } else {
      updateSetting({ publicationMode: 'DRAFT' })
    }
  }

  const confirmAutoPublish = () => {
    updateSetting({ publicationMode: 'AUTO' })
    setShowAutoConfirm(false)
  }

  const statusBadge = () => {
    switch (status) {
      case 'connected': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" />Ligado</Badge>
      case 'expired': return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><AlertTriangle className="w-3 h-3 mr-1" />Expirado</Badge>
      default: return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="w-3 h-3 mr-1" />Modo Demo</Badge>
    }
  }

  const actionLabel = (action: string) => {
    const map: Record<string, string> = {
      POST_CREATED: 'Criado', POST_APPROVED: 'Aprovado', POST_SCHEDULED: 'Agendado',
      POST_PUBLISHED: 'Publicado', POST_REJECTED: 'Rejeitado', POST_UPDATED: 'Atualizado',
      SETTINGS_UPDATED: 'Config.', ASSET_UPLOADED: 'Upload',
    }
    return map[action] ?? action
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" /></div>
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerir conta, agendamento e preferências</p>
        </div>
      </FadeIn>

      <Stagger className="space-y-6">
        {/* Instagram Connection */}
        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Instagram className="w-4 h-4" /> Ligação Instagram
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">@{username || 'inner_momentum_for_life'}</p>
                  <p className="text-xs text-muted-foreground">Estado da ligação</p>
                </div>
                {statusBadge()}
              </div>
              {status === 'demo' && (
                <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-medium">Como ligar a conta Instagram:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                    <li>Cria uma Meta Developer App em developers.facebook.com</li>
                    <li>Adiciona o produto &ldquo;Instagram Basic Display&rdquo; ou &ldquo;Instagram Graph API&rdquo;</li>
                    <li>Configura as variáveis META_APP_ID, META_APP_SECRET e META_REDIRECT_URI</li>
                    <li>Submete para Meta App Review (necessário para publicar via API)</li>
                    <li>Volta aqui e clica em &ldquo;Ligar Conta&rdquo;</li>
                  </ol>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ Em modo de desenvolvimento, a API funciona apenas para o próprio developer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Publication Mode */}
        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" /> Modo de Publicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Modo Auto-publicação</Label>
                  <p className="text-xs text-muted-foreground">
                    {settings?.publicationMode === 'AUTO'
                      ? 'Posts aprovados são publicados automaticamente'
                      : 'Todos os posts requerem aprovação manual (recomendado)'}
                  </p>
                </div>
                <Switch
                  checked={settings?.publicationMode === 'AUTO'}
                  onCheckedChange={toggleAutoPublish}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Pausar Agendamentos (Kill Switch)</Label>
                  <p className="text-xs text-muted-foreground">Suspender todas as publicações agendadas</p>
                </div>
                <Switch
                  checked={settings?.globalPause ?? false}
                  onCheckedChange={(checked: boolean) => updateSetting({ globalPause: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Cadence */}
        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" /> Cadência de Publicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Posts por semana</Label>
                  <Select
                    value={String(settings?.postsPerWeek ?? 5)}
                    onValueChange={(v: string) => updateSetting({ postsPerWeek: parseInt(v) })}
                  >
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[3,4,5,6,7].map(n => <SelectItem key={n} value={String(n)}>{n} posts/semana</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Horários preferidos</Label>
                  <Input
                    className="mt-1"
                    value={settings?.preferredTimes ?? '09:00,12:00,18:00'}
                    onChange={(e: any) => updateSetting({ preferredTimes: e.target.value })}
                    placeholder="09:00,12:00,18:00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Activity Log */}
        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4" /> Log de Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {(logs ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Sem atividade registada.</p>
                )}
                {(logs ?? []).map((log: LogEntry) => (
                  <div key={log.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                    <Badge variant="outline" className="text-[10px] shrink-0">{actionLabel(log.action)}</Badge>
                    <span className="text-muted-foreground truncate flex-1 text-xs">{log.details ?? ''}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      <SafeDate date={log.createdAt} options={{ dateStyle: 'short', timeStyle: 'short' }} locale="pt-PT" />
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>

      {/* Auto-publish confirmation dialog */}
      <Dialog open={showAutoConfirm} onOpenChange={setShowAutoConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ativar Auto-publicação?</DialogTitle>
            <DialogDescription>
              No modo auto-publicação, o conteúdo gerado por IA será publicado automaticamente no horário agendado, sem revisão manual. Tens a certeza?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoConfirm(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmAutoPublish}>Sim, ativar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
