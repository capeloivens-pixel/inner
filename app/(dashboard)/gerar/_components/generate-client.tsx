'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Loader2, CheckCircle, Save, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'

const PILLARS = ['Disciplina', 'Clareza Mental', 'Mentalidade de Crescimento', 'Produtividade Real', 'UGC/Comunidade', 'Conhecimento Rápido']
const FORMATS = ['REEL', 'CARROSSEL', 'POST']
const TONES = ['Motivacional', 'Educativo', 'Inspirador', 'Prático', 'Provocador']

interface GeneratedPost {
  title: string
  pillar: string
  type: string
  script: string
  caption: string
  hashtags: string
  cta: string
  bestTime: string
}

export function GenerateClient() {
  const [mode, setMode] = useState<'weekly' | 'individual'>('weekly')
  const [pillar, setPillar] = useState('')
  const [format, setFormat] = useState('REEL')
  const [tone, setTone] = useState('Motivacional')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<GeneratedPost[]>([])
  const [savedIndexes, setSavedIndexes] = useState<Set<number>>(new Set())

  const generate = async () => {
    setGenerating(true)
    setProgress(0)
    setResults([])
    setSavedIndexes(new Set())

    try {
      const body: any = { mode }
      if (mode === 'individual') {
        body.pillar = pillar || undefined
        body.format = format
        body.tone = tone.toLowerCase()
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar conteúdo')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Stream não disponível')

      const decoder = new TextDecoder()
      let partialRead = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        partialRead += decoder.decode(value, { stream: true })
        let lines = partialRead.split('\n')
        partialRead = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed?.status === 'processing') {
                setProgress(prev => Math.min(prev + 2, 95))
              } else if (parsed?.status === 'completed') {
                const posts = parsed?.result?.posts ?? []
                setResults(posts)
                setProgress(100)
              } else if (parsed?.status === 'error') {
                throw new Error(parsed?.message ?? 'Erro na geração')
              }
            } catch {
              // skip invalid
            }
          }
        }
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao gerar conteúdo')
    } finally {
      setGenerating(false)
    }
  }

  const savePost = async (post: GeneratedPost, index: number) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          pillar: post.pillar,
          type: post.type,
          script: post.script,
          caption: post.caption,
          hashtags: post.hashtags,
          cta: post.cta,
        }),
      })
      if (res.ok) {
        setSavedIndexes(prev => new Set([...(Array.from(prev)), index]))
        toast.success(`"${post.title}" guardado como rascunho`)
      }
    } catch {
      toast.error('Erro ao guardar')
    }
  }

  const saveAll = async () => {
    for (let i = 0; i < (results ?? []).length; i++) {
      if (!savedIndexes.has(i)) {
        await savePost(results[i], i)
      }
    }
    toast.success('Todos os posts guardados como rascunhos!')
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Gerar Conteúdo</h1>
          <p className="text-sm text-muted-foreground mt-1">Usa IA para criar conteúdo para o Instagram</p>
        </div>
      </FadeIn>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <Button
              variant={mode === 'weekly' ? 'default' : 'outline'}
              onClick={() => setMode('weekly')}
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-1" /> Plano Semanal
            </Button>
            <Button
              variant={mode === 'individual' ? 'default' : 'outline'}
              onClick={() => setMode('individual')}
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-1" /> Individual
            </Button>
          </div>

          {mode === 'individual' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Pilar</label>
                <Select value={pillar} onValueChange={setPillar}>
                  <SelectTrigger><SelectValue placeholder="Automático" /></SelectTrigger>
                  <SelectContent>
                    {PILLARS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Formato</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FORMATS.map(f => <SelectItem key={f} value={f}>{f === 'REEL' ? 'Reel' : f === 'CARROSSEL' ? 'Carrossel' : 'Post'}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tom</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button onClick={generate} disabled={generating} className="gap-2">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'A gerar...' : mode === 'weekly' ? 'Gerar Plano Semanal' : 'Gerar Conteúdo'}
          </Button>

          {generating && (
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">A gerar conteúdo com IA... {progress}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      {(results ?? []).length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'} gerados
            </h2>
            <Button onClick={saveAll} variant="outline" size="sm" className="gap-2">
              <Save className="w-4 h-4" /> Guardar Todos como Rascunho
            </Button>
          </div>

          <Stagger className="space-y-4">
            {(results ?? []).map((post: GeneratedPost, i: number) => (
              <StaggerItem key={i}>
                <Card className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{post?.title ?? 'Sem título'}</CardTitle>
                        <Badge variant="outline" className="text-[10px]">{post?.type ?? 'REEL'}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{post?.pillar ?? ''}</Badge>
                      </div>
                      <Button
                        onClick={() => savePost(post, i)}
                        disabled={savedIndexes.has(i)}
                        size="sm"
                        variant={savedIndexes.has(i) ? 'ghost' : 'default'}
                        className="gap-1"
                      >
                        {savedIndexes.has(i) ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                        {savedIndexes.has(i) ? 'Guardado' : 'Guardar'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {post?.script && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Script</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{post.script}</p>
                      </div>
                    )}
                    {post?.caption && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Caption</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{post.caption}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {post?.cta && <span><strong>CTA:</strong> {post.cta}</span>}
                      {post?.bestTime && <span><strong>Melhor horário:</strong> {post.bestTime}</span>}
                    </div>
                    {post?.hashtags && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Hashtags</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{post.hashtags}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </>
      )}
    </div>
  )
}
