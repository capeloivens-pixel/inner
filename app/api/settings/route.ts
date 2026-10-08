export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  let settings = await prisma.settings.findFirst()
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        publicationMode: 'DRAFT',
        postsPerWeek: 5,
        preferredDays: '1,2,3,4,5',
        preferredTimes: '09:00,12:00,18:00',
        globalPause: false,
      },
    })
  }

  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const data = await request.json()
  let settings = await prisma.settings.findFirst()

  if (!settings) {
    settings = await prisma.settings.create({ data: { ...data } })
  } else {
    settings = await prisma.settings.update({ where: { id: settings.id }, data })
  }

  await prisma.activityLog.create({
    data: {
      action: 'SETTINGS_UPDATED',
      details: `Configurações atualizadas: ${JSON.stringify(data)}`,
    },
  })

  return NextResponse.json(settings)
}
