export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 100),
    include: { post: { select: { title: true, pillar: true } } },
  })

  return NextResponse.json(logs)
}
