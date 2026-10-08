export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })

  return NextResponse.json(post)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const data = await request.json()

  const updateData: any = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.pillar !== undefined) updateData.pillar = data.pillar
  if (data.type !== undefined) updateData.type = data.type
  if (data.script !== undefined) updateData.script = data.script
  if (data.caption !== undefined) updateData.caption = data.caption
  if (data.hashtags !== undefined) updateData.hashtags = data.hashtags
  if (data.cta !== undefined) updateData.cta = data.cta
  if (data.status !== undefined) updateData.status = data.status
  if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null
  if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl
  if (data.assetId !== undefined) updateData.assetId = data.assetId

  const post = await prisma.post.update({ where: { id }, data: updateData })

  let action = 'POST_UPDATED'
  if (data.status === 'APPROVED') action = 'POST_APPROVED'
  if (data.status === 'SCHEDULED') action = 'POST_SCHEDULED'
  if (data.status === 'PUBLISHED') action = 'POST_PUBLISHED'
  if (data.status === 'REJECTED') action = 'POST_REJECTED'

  await prisma.activityLog.create({
    data: {
      action,
      details: `Post "${post.title}" ${action === 'POST_UPDATED' ? 'atualizado' : action === 'POST_APPROVED' ? 'aprovado' : action === 'POST_SCHEDULED' ? 'agendado' : action === 'POST_PUBLISHED' ? 'publicado' : 'rejeitado'}`,
      postId: post.id,
    },
  })

  return NextResponse.json(post)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  await prisma.activityLog.deleteMany({ where: { postId: id } })
  await prisma.post.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
