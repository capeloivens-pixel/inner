'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { CheckCircle, X, Edit3, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'
import { useDraftCount } from '@/hooks/use-draft-count'

interface Post {
  id: string
  title: string
  pillar: string
  type: string
  script: string | null
  caption: string | null
  hashtags: string | null
  cta: string | null
  status: string
  scheduledAt: string | null
  createdAt: string
}

export function DraftsClient() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Post>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { mutate: mutateDraftCount } = useDraftCount()

  const loadDrafts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts?status=DRAFT')
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadDrafts() }, [loadDrafts])

  const approve = async (id: string) => {
    const scheduleDate = new Date()
    scheduleDate.setDate(scheduleDate.getDate() + 1)
    scheduleDate.setHours(9, 0, 0, 0)

    const res = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SCHEDULED', scheduledAt: scheduleDate.toISOString() }),
    })
    if (res.ok) {
      toast.success('Post aprovado e agendado!')
      loadDrafts()
      mutateDraftCount?.()
    }
  }

  const reject = async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'REJECTED' }),
    })
    if (res.ok) {
      toast.success('Post rejeitado')
      loadDrafts()
      mutateDraftCount?.()
    }
  }

  const deletePost = async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Post eliminado')
      loadDrafts()
      mutateDraftCount?.()
    }
  }

  const startEdit = (post: Post) => {
    setEditingId(post.id)
    setEditData({ script: post.script ?? '', caption: post.caption ?? '', hashtags: post.hashtags ?? '' })
  }

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    if (res.ok) {
      toast.success('Alterações guardadas')
      setEditingId(null)
      loadDrafts()
    }
  }

  const TYPE_LABEL: Record<string, string> = { REEL: 'Reel', CARROSSEL: 'Carrossel', POST: 'Post' }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1,2,3].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Rascunhos para Revisão</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} {posts.length === 1 ? 'rascunho' : 'rascunhos'} pendentes</p>
        </div>
      </FadeIn>

      {posts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum rascunho pendente. Gera conteúdo novo na página de geração.</p>
          </CardContent>
        </Card>
      )}

      <Stagger className="space-y-4">
        {(posts ?? []).map((post: Post) => (
          <StaggerItem key={post.id}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[post.type] ?? post.type}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{post.pillar}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}>
                      {expandedId === post.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {(expandedId === post.id || editingId === post.id) && (
                <CardContent className="space-y-4">
                  {editingId === post.id ? (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Script</label>
                        <Textarea
                          value={editData?.script ?? ''}
                          onChange={(e: any) => setEditData({ ...editData, script: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Caption</label>
                        <Textarea
                          value={editData?.caption ?? ''}
                          onChange={(e: any) => setEditData({ ...editData, caption: e.target.value })}
                          rows={5}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Hashtags</label>
                        <Textarea
                          value={editData?.hashtags ?? ''}
                          onChange={(e: any) => setEditData({ ...editData, hashtags: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(post.id)}>Guardar</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancelar</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {post.script && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Script</h4>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{post.script}</p>
                        </div>
                      )}
                      {post.caption && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Caption</h4>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{post.caption}</p>
                        </div>
                      )}
                      {post.cta && (
                        <div className="text-xs text-muted-foreground"><strong>CTA:</strong> {post.cta}</div>
                      )}
                      {post.hashtags && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Hashtags</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{post.hashtags}</p>
                        </div>
                      )}
                    </>
                  )}

                  {editingId !== post.id && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button size="sm" className="gap-1" onClick={() => approve(post.id)}>
                        <CheckCircle className="w-4 h-4" /> Aprovar e Agendar
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => startEdit(post)}>
                        <Edit3 className="w-4 h-4" /> Editar
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => reject(post.id)}>
                        <X className="w-4 h-4" /> Rejeitar
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1 text-destructive ml-auto" onClick={() => deletePost(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
