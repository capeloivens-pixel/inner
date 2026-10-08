'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Email e password são obrigatórios')
      return
    }
    if (password.length < 6) {
      toast.error('Password deve ter pelo menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'Erro ao criar conta')
        return
      }
      // Auto-login after signup
      const loginResult = await signIn('credentials', { email, password, redirect: false })
      if (loginResult?.error) {
        toast.error('Conta criada, mas erro ao iniciar sessão. Tenta fazer login.')
        router.push('/login')
      } else {
        toast.success('Conta criada com sucesso!')
        router.push('/dashboard')
      }
    } catch {
      toast.error('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <div className="relative mt-1.5">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                placeholder="O teu nome"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="o-teu@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Criar Conta
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Já tens conta?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Iniciar sessão
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
