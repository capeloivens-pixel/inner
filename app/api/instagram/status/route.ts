export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ isConnected: false, status: 'demo' })

  const account = await prisma.instagramAccount.findFirst()

  if (!account) {
    return NextResponse.json({ isConnected: false, status: 'demo', username: '' })
  }

  let status = 'demo'
  if (account.isConnected) {
    if (account.tokenExpiry && new Date(account.tokenExpiry) < new Date()) {
      status = 'expired'
    } else {
      status = 'connected'
    }
  }

  return NextResponse.json({
    isConnected: account.isConnected,
    status,
    username: account.username ?? '',
  })
}
