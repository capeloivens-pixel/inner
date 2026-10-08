export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/s3'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const asset = await prisma.asset.findUnique({ where: { id } })
  if (!asset) return NextResponse.json({ error: 'Asset não encontrado' }, { status: 404 })

  try {
    await deleteFile(asset.cloudStoragePath)
  } catch {
    // File may already be deleted from S3
  }

  await prisma.asset.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
