'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Film, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'

interface Asset {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  cloudStoragePath: string
  isPublic: boolean
  duration: number | null
  width: number | null
  height: number | null
  url: string | null
  createdAt: string
}

export function AssetsClient() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const loadAssets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/assets')
      const data = await res.json()
      setAssets(Array.isArray(data) ? data : [])
    } catch { setAssets([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadAssets() }, [loadAssets])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (!file) return

    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm']
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Use MP4, MOV ou WebM.')
      return
    }

    if (file.size > 300 * 1024 * 1024) {
      toast.error('Ficheiro demasiado grande. Máximo 300MB.')
      return
    }

    setUploading(true)
    try {
      // Get presigned URL
      const presignRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: false }),
      })
      const { uploadUrl, cloud_storage_path } = await presignRes.json()

      // Upload to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      // Complete upload
      await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudStoragePath: cloud_storage_path,
          isPublic: false,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      })

      toast.success('Vídeo carregado com sucesso!')
      loadAssets()
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao carregar ficheiro')
    } finally {
      setUploading(false)
    }
  }

  const deleteAsset = async (id: string) => {
    try {
      await fetch(`/api/assets/${id}`, { method: 'DELETE' })
      toast.success('Asset eliminado')
      loadAssets()
    } catch {
      toast.error('Erro ao eliminar')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const checkCompliance = (asset: Asset) => {
    const issues: string[] = []
    if (asset.duration != null && (asset.duration < 5 || asset.duration > 90)) {
      issues.push(`Duração: ${asset.duration?.toFixed?.(1) ?? '0'}s (requer 5-90s)`)
    }
    if (asset.width && asset.height) {
      const ratio = asset.height / asset.width
      if (Math.abs(ratio - 16/9) > 0.1) {
        issues.push(`Aspect ratio: ${asset.width}x${asset.height} (requer 9:16)`)
      }
    }
    return issues
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Biblioteca de Assets</h1>
            <p className="text-sm text-muted-foreground mt-1">Gere os teus vídeos e ficheiros para Reels</p>
          </div>
          <div>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleUpload}
              className="hidden"
              id="video-upload"
              disabled={uploading}
            />
            <label htmlFor="video-upload">
              <Button asChild disabled={uploading} className="gap-2 cursor-pointer">
                <span>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'A carregar...' : 'Carregar Vídeo'}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </FadeIn>

      <Card>
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Especificações para Reels:</strong></p>
            <p>• Formato: MP4 ou MOV (H.264) • Aspect Ratio: 9:16 (vertical)</p>
            <p>• Duração: 5-90 segundos • Tamanho máximo: 300MB</p>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : assets.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Film className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum asset carregado. Carrega um vídeo para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(assets ?? []).map((asset: Asset) => {
            const issues = checkCompliance(asset)
            return (
              <StaggerItem key={asset.id}>
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {asset.url && asset.fileType?.startsWith('video/') ? (
                      <video
                        src={asset.url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Film className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{asset.fileName}</span>
                      <Button variant="ghost" size="icon-sm" onClick={() => deleteAsset(asset.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatSize(asset.fileSize)}</span>
                      {asset.duration != null && <span>{asset.duration?.toFixed?.(1) ?? '0'}s</span>}
                    </div>
                    {issues.length > 0 ? (
                      <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>{issues.join(' | ')}</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Conforme para Reels</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </Stagger>
      )}
    </div>
  )
}
