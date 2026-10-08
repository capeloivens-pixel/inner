export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { cloudStoragePath, isPublic, fileName, fileType, fileSize, duration, width, height } = await request.json()

  const asset = await prisma.asset.create({
    data: {
      fileName: fileName ?? 'unknown',
      fileType: fileType ?? 'video/mp4',
      fileSize: fileSize ?? 0,
      cloudStoragePath,
      isPublic: isPublic ?? false,
      duration: duration ?? null,
      width: width ?? null,
      height: height ?? null,
    },
  })

  await prisma.activityLog.create({
    data: {
      action: 'ASSET_UPLOADED',
      details: `Ficheiro "${fileName}" carregado`,
    },
  })

  return NextResponse.json(asset)
}
