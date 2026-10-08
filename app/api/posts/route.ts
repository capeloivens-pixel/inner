export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const pillar = searchParams.get('pillar')
  const month = searchParams.get('month')
  const year = searchParams.get('year')

  const where: any = {}
  if (status) where.status = status
  if (pillar) where.pillar = pillar

  if (month && year) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
    where.OR = [
      { scheduledAt: { gte: startDate, lte: endDate } },
      { publishedAt: { gte: startDate, lte: endDate } },
      { createdAt: { gte: startDate, lte: endDate }, scheduledAt: null, publishedAt: null },
    ]
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const data = await request.json()
  const post = await prisma.post.create({
    data: {
      title: data.title ?? 'Sem título',
      pillar: data.pillar ?? 'Disciplina',
      type: data.type ?? 'REEL',
      script: data.script ?? null,
      caption: data.caption ?? null,
      hashtags: data.hashtags ?? null,
      cta: data.cta ?? null,
      status: 'DRAFT',
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      videoUrl: data.videoUrl ?? null,
    },
  })

  await prisma.activityLog.create({
    data: {
      action: 'POST_CREATED',
      details: `Post "${post.title}" criado via IA`,
      postId: post.id,
    },
  })

  return NextResponse.json(post)
}
