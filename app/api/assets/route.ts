export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getFileUrl } from '@/lib/s3'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const assetsWithUrls = await Promise.all(
    (assets ?? []).map(async (a: any) => {
      try {
        const url = await getFileUrl(a.cloudStoragePath, a.fileType, a.isPublic)
        return { ...a, url }
      } catch {
        return { ...a, url: null }
      }
    })
  )

  return NextResponse.json(assetsWithUrls)
}
