import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LoginForm } from './_components/login-form'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">IM</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Inner Momentum Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">Entra na tua conta para gerir o conteúdo</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
