export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { generatePresignedUploadUrl } from '@/lib/s3'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { fileName, contentType, isPublic } = await request.json()
  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'fileName e contentType são obrigatórios' }, { status: 400 })
  }

  try {
    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(fileName, contentType, isPublic ?? false)
    return NextResponse.json({ uploadUrl, cloud_storage_path })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro ao gerar URL' }, { status: 500 })
  }
}
