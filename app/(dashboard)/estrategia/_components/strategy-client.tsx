'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Clock, Hash, CheckSquare, Lightbulb, TrendingUp, Users, Brain, Zap, BookOpen } from 'lucide-react'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'

const PILLARS = [
  { name: 'Disciplina', icon: Target, color: 'text-blue-500', desc: 'Rotinas matinais, consistência, pequenas vitórias diárias', topics: ['Rotina de 5 minutos', 'Hábitos atómicos', 'Consistência vs. motivação', 'Pequenas vitórias'] },
  { name: 'Clareza Mental', icon: Brain, color: 'text-purple-500', desc: 'Eliminar distrações, foco profundo, prioridades', topics: ['Notificações e foco', 'Ciclos ultradianos', 'Minimalismo digital', 'Gestão de atenção'] },
  { name: 'Mentalidade de Crescimento', icon: TrendingUp, color: 'text-emerald-500', desc: 'Reencadramento, resiliência, aprendizagem', topics: ['Fracasso como feedback', 'Mudar a pergunta', 'Resiliência', 'Zona de desconforto'] },
  { name: 'Produtividade Real', icon: Zap, color: 'text-orange-500', desc: 'Sistemas simples, gestão de energia, não de tempo', topics: ['Método 2-minutos', 'Gestão de energia', 'Blocos de tempo', 'Eliminar tarefas'] },
  { name: 'UGC/Comunidade', icon: Users, color: 'text-pink-500', desc: 'Histórias reais, transformações, perguntas à audiência', topics: ['Partilha de histórias', 'Reflexão semanal', 'Perguntas abertas', 'Desafios comunitários'] },
  { name: 'Conhecimento Rápido', icon: BookOpen, color: 'text-cyan-500', desc: 'Dicas em 30s, factos sobre o cérebro, ciência comportamental', topics: ['Dopamina e hábitos', 'Neurónios espelho', 'Efeito Zeigarnik', 'Psicologia da motivação'] },
]

const WEEK_PLAN = [
  { week: 'Semana 1', title: 'Estabelecer Presença', desc: 'Publicar conteúdo de valor, estabelecer tom de voz, preencher perfil', color: 'border-blue-500' },
  { week: 'Semana 2', title: 'Engagement', desc: 'Interagir com contas semelhantes, responder comentários, fazer perguntas nos stories', color: 'border-emerald-500' },
  { week: 'Semana 3', title: 'Autoridade no Nicho', desc: 'Conteúdo educativo, scripts mais longos, carrosséis informativos', color: 'border-purple-500' },
  { week: 'Semana 4', title: 'CTA e Conversão', desc: 'Call-to-action mais forte, link na bio, perguntas diretas à audiência', color: 'border-orange-500' },
]

const BEST_TIMES = [
  { day: 'Segunda', times: ['7:00-9:00', '12:00-13:00', '19:00-21:00'] },
  { day: 'Terça', times: ['7:00-9:00', '12:00-13:00', '18:00-20:00'] },
  { day: 'Quarta', times: ['7:00-9:00', '12:00-13:00', '19:00-21:00'] },
  { day: 'Quinta', times: ['7:00-9:00', '12:00-13:00', '18:00-20:00'] },
  { day: 'Sexta', times: ['7:00-9:00', '11:00-13:00', '19:00-22:00'] },
]

const HASHTAG_SETS: Record<string, string[]> = {
  'Grandes': ['#mindset', '#growth', '#motivation', '#selfdevelopment', '#personaldevelopment'],
  'Médias': ['#mindsetshift', '#growthmindset', '#dailymindset', '#mentalhealthmatters', '#selfimprovement'],
  'Nicho': ['#innermomentum', '#clarityovernoise', '#mindsetcoach', '#disciplineiskey', '#realselfdevelopment'],
}

export function StrategyClient() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Estratégia de Conteúdo</h1>
          <p className="text-sm text-muted-foreground mt-1">Guia completo para @inner_momentum_for_life</p>
        </div>
      </FadeIn>

      {/* Pilares */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Pilares de Conteúdo
        </h2>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map(p => (
            <StaggerItem key={p.name}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <p.icon className={`w-4 h-4 ${p.color}`} />
                    {p.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {(p.topics ?? []).map(t => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Plano 30 dias */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Plano de 30 Dias
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WEEK_PLAN.map(w => (
            <Card key={w.week} className={`border-l-4 ${w.color}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">{w.week}</CardTitle>
                <p className="font-display font-semibold text-sm">{w.title}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{w.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Melhores horários */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" /> Melhores Horários para Publicar
        </h2>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {BEST_TIMES.map(bt => (
                <div key={bt.day} className="text-center">
                  <div className="text-xs font-semibold mb-2">{bt.day}</div>
                  {(bt.times ?? []).map(t => (
                    <Badge key={t} variant="outline" className="text-[10px] block mb-1 mx-auto">{t}</Badge>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              Baseado em dados gerais para nicho de desenvolvimento pessoal (Europa). Ajustar conforme dados reais da conta.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Hashtags */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5" /> Sets de Hashtags
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(HASHTAG_SETS).map(([cat, tags]) => (
            <Card key={cat}>
              <CardHeader className="pb-2"><CardTitle className="text-sm">{cat}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {(tags ?? []).map(t => (
                    <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Compliance */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckSquare className="w-5 h-5" /> Checklist de Compliance
        </h2>
        <Card>
          <CardContent className="p-4 space-y-2 text-sm">
            {[
              'Nunca prometer resultados de crescimento específicos',
              'Divulgar parcerias/conteúdo patrocinado quando aplicável',
              'Não usar testemunhos fabricados',
              'Menções apenas a contas relevantes e verificadas',
              'Respeitar direitos de autor em música e imagens',
              'Manter tom autêntico e prático (sem hype excessivo)',
            ].map(item => (
              <div key={item} className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* O que é automatizado */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Automatização vs. Manual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-emerald-600 dark:text-emerald-400">✅ Automatizado</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1 text-muted-foreground">
              <p>• Geração de scripts e captions com IA</p>
              <p>• Sugestão de hashtags e CTA</p>
              <p>• Agendamento de publicações</p>
              <p>• Publicação via Instagram API (quando configurada)</p>
              <p>• Logs de atividade</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-600 dark:text-amber-400">✍️ Requer Ação Manual</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1 text-muted-foreground">
              <p>• Gravação e edição de vídeos</p>
              <p>• Revisão e aprovação de conteúdo</p>
              <p>• Resposta a comentários e DMs</p>
              <p>• Engagement com outras contas</p>
              <p>• Configuração da Meta Developer App</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
