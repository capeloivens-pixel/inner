export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const [drafts, scheduled, publishedThisWeek, total] = await Promise.all([
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.post.count({ where: { status: 'SCHEDULED' } }),
    prisma.post.count({ where: { status: 'PUBLISHED', publishedAt: { gte: weekStart } } }),
    prisma.post.count(),
  ])

  const nextScheduled = await prisma.post.findFirst({
    where: { status: 'SCHEDULED', scheduledAt: { gte: now } },
    orderBy: { scheduledAt: 'asc' },
    select: { scheduledAt: true, title: true },
  })

  return NextResponse.json({ drafts, scheduled, publishedThisWeek, total, nextScheduled })
}
