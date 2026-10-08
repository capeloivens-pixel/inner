export const dynamic = "force-dynamic";
import { auth } from '@/auth'

const PILLARS = ['Disciplina', 'Clareza Mental', 'Mentalidade de Crescimento', 'Produtividade Real', 'UGC/Comunidade', 'Conhecimento Rápido']

const SYSTEM_PROMPT = `És um criador de conteúdo especializado em mentalidade e desenvolvimento pessoal para Instagram.
A conta é @inner_momentum_for_life com a bio: "Inner Momentum. Training your mindset for real life. Clarity over noise."

Pilares de conteúdo:
1. Disciplina - rotinas matinais, consistência, pequenas vitórias diárias
2. Clareza Mental - eliminar distrações, foco profundo, prioridades
3. Mentalidade de Crescimento - reencadramento, resiliência, aprendizagem
4. Produtividade Real - sistemas simples, gestão de energia, não de tempo
5. UGC/Comunidade - histórias reais, transformações, perguntas à audiência
6. Conhecimento Rápido - dicas em 30s, factos sobre o cérebro, ciência comportamental

Hashtags base do nicho:
Grandes: #mindset #growth #motivation #selfdevelopment #personaldevelopment
Médias: #mindsetshift #growthmindset #dailymindset #mentalhealthmatters #selfimprovement
Nicho: #innermomentum #clarityovernoise #mindsetcoach #disciplineiskey #realselfdevelopment

Regras:
- Todo o conteúdo (scripts, captions) deve ser em Português de Portugal (não Brasil)
- Usa "tu" e não "você"
- Hashtags podem ser em inglês (normal para este nicho)
- Scripts de Reels: 30-60 segundos, formato gancho-desenvolvimento-CTA
- Captions: emojis, espaçamento, CTA no final
- Mix de hashtags: 5 grandes + 10 médias + 10-15 nicho (máximo 30)
- NUNCA prometer resultados específicos
- Não usar testemunhos fabricados
`

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 })
  }

  const body = await request.json()
  const { mode, pillar, format, tone, count } = body

  let userPrompt = ''

  if (mode === 'weekly') {
    const numPosts = count ?? 6
    userPrompt = `Gera um plano semanal com ${numPosts} ideias de conteúdo para Instagram, distribuídas pelos 6 pilares.

Para cada post, gera:
- title: título curto
- pillar: um dos 6 pilares
- type: "REEL" ou "CARROSSEL" ou "POST" (priorizar Reels)
- script: script completo do reel/post (30-60 segundos se reel)
- caption: caption formatada para Instagram com emojis e espaçamento
- hashtags: 25-30 hashtags separadas por espaço
- cta: call-to-action específico
- bestTime: melhor horário sugerido (ex: "9:00", "12:00", "18:00")

Responde com raw JSON apenas, com esta estrutura exacta:
{"posts": [{"title": "...", "pillar": "...", "type": "...", "script": "...", "caption": "...", "hashtags": "...", "cta": "...", "bestTime": "..."}]}
Responde com raw JSON only. Do not include code blocks, markdown, or any other formatting.`
  } else {
    const selectedPillar = pillar ?? PILLARS[Math.floor(Math.random() * PILLARS.length)]
    const selectedFormat = format ?? 'REEL'
    const selectedTone = tone ?? 'motivacional e prático'

    userPrompt = `Gera 1 peça de conteúdo para Instagram:
- Pilar: ${selectedPillar}
- Formato: ${selectedFormat}
- Tom: ${selectedTone}

Gera:
- title: título curto
- pillar: ${selectedPillar}
- type: ${selectedFormat}
- script: script completo (30-60 segundos se reel)
- caption: caption formatada para Instagram
- hashtags: 25-30 hashtags separadas por espaço
- cta: call-to-action específico
- bestTime: melhor horário sugerido

Responde com raw JSON apenas, com esta estrutura exacta:
{"posts": [{"title": "...", "pillar": "...", "type": "...", "script": "...", "caption": "...", "hashtags": "...", "cta": "...", "bestTime": "..."}]}
Responde com raw JSON only. Do not include code blocks, markdown, or any other formatting.`
  }

  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ error: `LLM API error: ${errorText}` }), { status: 500 })
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    let buffer = ''
    let partialRead = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (!reader) {
            controller.close()
            return
          }
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            partialRead += decoder.decode(value, { stream: true })
            let lines = partialRead.split('\n')
            partialRead = lines.pop() ?? ''
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  try {
                    const finalResult = JSON.parse(buffer)
                    const finalData = JSON.stringify({ status: 'completed', result: finalResult })
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))
                  } catch {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Failed to parse LLM response' })}\n\n`))
                  }
                  controller.close()
                  return
                }
                try {
                  const parsed = JSON.parse(data)
                  buffer += parsed?.choices?.[0]?.delta?.content ?? ''
                  const progressData = JSON.stringify({ status: 'processing', message: 'A gerar conteúdo...' })
                  controller.enqueue(encoder.encode(`data: ${progressData}\n\n`))
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
          // If stream ended without [DONE]
          if (buffer) {
            try {
              const finalResult = JSON.parse(buffer)
              const finalData = JSON.stringify({ status: 'completed', result: finalResult })
              controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))
            } catch {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Resposta LLM inválida' })}\n\n`))
            }
          }
          controller.close()
        } catch (error: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: error?.message ?? 'Erro desconhecido' })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Erro ao chamar LLM' }), { status: 500 })
  }
}
