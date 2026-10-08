import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const PILLARS = [
  'Disciplina',
  'Clareza Mental',
  'Mentalidade de Crescimento',
  'Produtividade Real',
  'UGC/Comunidade',
  'Conhecimento Rápido',
]

const DEMO_POSTS = [
  {
    title: 'A disciplina não é punição',
    pillar: 'Disciplina',
    type: 'REEL',
    script: 'A disciplina não é punição. É a promessa que fazes a ti mesmo de que és mais importante do que o teu humor do momento. Todos os dias tens uma escolha: seguir o plano ou seguir o humor. E a verdade é simples — a consistência vence o talento. Sempre. Começa hoje. Um passo de cada vez.',
    caption: '🧠 A disciplina não é punição.\n\nÉ a promessa que fazes a ti mesmo.\n\nTodos os dias escolhes: seguir o plano ou o humor?\n\nA consistência vence o talento todas as vezes. 💪\n\n👇 Deixa um 🔥 se isto te faz sentido',
    hashtags: '#mindset #disciplina #growthmindset #selfdevelopment #innermomentum #consistencia #motivacao #focoemdisciplina #mentalidadedevencedor #desenvolvimentopessoal #mindsetshift #disciplinadiaria #rotina #habitos #autodesenvolvimento #clarityovernoise #mindsetcoach #disciplineiskey #realselfdevelopment #vidasaudavel #mudancadehabitos #focoedisciplina #mentalidadedecrescimento #produtividade #sucesso',
    cta: 'Deixa um 🔥 nos comentários',
    status: 'PUBLISHED',
    dayOffset: -5,
  },
  {
    title: 'Clareza é o superpoder mais subestimado',
    pillar: 'Clareza Mental',
    type: 'REEL',
    script: 'Se não decides o que é importante, tudo parece urgente. A clareza é o superpoder mais subestimado. Quando sabes exactamente o que importa, paras de perder energia no que não importa. Pergunta-te: o meu dia de hoje estava alinhado com o que realmente quero?',
    caption: '🎯 A clareza é o superpoder mais subestimado.\n\nQuando sabes exactamente o que importa, paras de perder energia no que não importa.\n\nUma pergunta: o teu dia de hoje estava alinhado com o que realmente queres?\n\n💬 Responde nos comentários.',
    hashtags: '#clareza #foco #mindset #produtividade #innermomentum #clarezamental #focoprofundo #prioridades #energiamental #autoconhecimento #mindsetshift #desenvolvimentopessoal #selfdevelopment #personaldevelopment #growthmindset #clarityovernoise #mindsetcoach #vidareal #saude #equilibrio #mentalhealthmatters #selfimprovement #dailymindset #rotina #focoeresultados',
    cta: 'Responde nos comentários',
    status: 'SCHEDULED',
    dayOffset: 1,
  },
  {
    title: 'O fracasso é feedback, não destino',
    pillar: 'Mentalidade de Crescimento',
    type: 'REEL',
    script: 'Falhaste? Ótimo. Agora sabes o que não funciona. O fracasso não é o oposto do sucesso — é parte do caminho. Cada erro é um dado novo. Cada obstáculo é um professor. A única forma de realmente falhar é desistir de aprender.',
    caption: '💡 Falhaste? Ótimo.\n\nAgora sabes o que não funciona.\n\nO fracasso não é o oposto do sucesso — é parte do caminho.\n\nCada erro é um dado novo. Cada obstáculo é um professor.\n\n🔄 Partilha com alguém que precisa de ouvir isto.',
    hashtags: '#mentalidade #crescimento #resiliencia #mindset #growthmindset #innermomentum #fracasso #sucesso #aprendizagem #motivacao #mindsetshift #selfdevelopment #personaldevelopment #mentalhealthmatters #disciplina #foco #autodesenvolvimento #mentalidadedecrescimento #erros #evolucao #vidacomproposito #focoedisciplina #mudancadehabitos #superacao #clarityovernoise',
    cta: 'Partilha com alguém que precise',
    status: 'PUBLISHED',
    dayOffset: -3,
  },
  {
    title: 'Gere energia, não tempo',
    pillar: 'Produtividade Real',
    type: 'CARROSSEL',
    script: 'Pára de gerir o tempo. Começa a gerir a tua energia. O segredo da produtividade não é fazer mais — é fazer o que importa quando tens mais energia. Identifica os teus picos. Protege-os. Usa-os para o trabalho que realmente conta.',
    caption: '⚡ Pára de gerir o tempo. Começa a gerir a tua energia.\n\nO segredo da produtividade não é fazer mais — é fazer o que importa quando tens mais energia.\n\n3 passos simples:\n1️⃣ Identifica os teus picos de energia\n2️⃣ Protege esses blocos\n3️⃣ Usa-os para o trabalho que conta\n\n📌 Guarda este post para rever depois.',
    hashtags: '#produtividade #energia #gestaodetempo #mindset #innermomentum #produtividadereal #gestaodeenergia #trabalho #performance #foco #selfdevelopment #growthmindset #mindsetshift #desenvolvimentopessoal #habitos #rotina #autodesenvolvimento #clarityovernoise #disciplina #eficiencia #resultados #vidaprodutiva #organizacao #planeamento #mentalhealthmatters',
    cta: 'Guarda este post',
    status: 'SCHEDULED',
    dayOffset: 2,
  },
  {
    title: 'A tua história importa',
    pillar: 'UGC/Comunidade',
    type: 'POST',
    script: 'Cada um de nós tem uma história de superação. Às vezes parece pequena, mas para alguém pode ser exactamente o que precisa de ouvir. Partilha a tua nos comentários. Vão encontrar-se.',
    caption: '🧡 A tua história importa.\n\nCada um de nós tem uma história de superação. Às vezes parece pequena, mas para alguém pode ser exactamente o que precisa de ouvir.\n\n👇 Partilha a tua história nos comentários. Vamos construir isto juntos.',
    hashtags: '#comunidade #historias #superacao #ugc #innermomentum #motivacao #inspiracao #partilha #conexao #humanidade #mindset #growthmindset #selfdevelopment #desenvolvimentopessoal #vidareal #mentalhealthmatters #mindsetshift #selfimprovement #autodesenvolvimento #clarityovernoise #mudanca #coragem #vulnerabilidade #apoio #juntos',
    cta: 'Partilha a tua história',
    status: 'DRAFT',
    dayOffset: 3,
  },
  {
    title: 'O cérebro decide em 0.1 segundos',
    pillar: 'Conhecimento Rápido',
    type: 'REEL',
    script: 'Sabias que o teu cérebro toma decisões emocionais em 0.1 segundos? Antes mesmo de pensares, já decidiste. Por isso é que ambiente e hábitos são tão importantes. Não confies na força de vontade — desenha o teu ambiente.',
    caption: '🧠 O teu cérebro toma decisões emocionais em 0.1 segundos.\n\nAntes mesmo de pensares, já decidiste.\n\nPor isso é que:\n• O ambiente importa mais que a motivação\n• Hábitos vencem força de vontade\n• Sistemas vencem metas\n\n💡 Segue @inner_momentum_for_life para mais.',
    hashtags: '#neurociencia #cerebro #ciencia #mindset #innermomentum #habitos #decisoes #psicologia #conhecimento #factos #growthmindset #selfdevelopment #desenvolvimentopessoal #mentalhealthmatters #mindsetshift #cienciacomportamental #aprendizagem #curiosidade #educacao #autoconhecimento #clarityovernoise #forcadevontade #ambiente #sistemas #selfimprovement',
    cta: 'Segue para mais dicas',
    status: 'PUBLISHED',
    dayOffset: -7,
  },
  {
    title: 'Rotina matinal de 5 minutos',
    pillar: 'Disciplina',
    type: 'REEL',
    script: 'Não precisas de 2 horas. Precisas de 5 minutos com intenção. Acorda. Bebe água. Escreve 3 coisas que queres alcançar hoje. Respira fundo 3 vezes. Pronto. O teu dia já começou melhor que o de 90% das pessoas.',
    caption: '☕ Rotina matinal de 5 minutos:\n\n1️⃣ Bebe água\n2️⃣ Escreve 3 objetivos do dia\n3️⃣ Respira fundo 3x\n\nNão precisas de 2 horas. Precisas de 5 minutos com intenção.\n\n🔥 Começa amanhã.',
    hashtags: '#rotinamatinal #disciplina #habitos #mindset #innermomentum #manha #rotina #produtividade #intencao #consistencia #growthmindset #selfdevelopment #mindsetshift #desenvolvimentopessoal #wellness #saude #autodesenvolvimento #clarityovernoise #disciplineiskey #realselfdevelopment #motivacao #foco #energia #vidasaudavel #mentalhealthmatters',
    cta: 'Começa amanhã e conta-nos como correu',
    status: 'SCHEDULED',
    dayOffset: 4,
  },
  {
    title: 'Desliga as notificações',
    pillar: 'Clareza Mental',
    type: 'POST',
    script: 'Cada notificação é alguém a decidir a tua prioridade. Desliga. Escolhe tu o que merece a tua atenção. O teu foco é o teu recurso mais valioso.',
    caption: '🔕 Cada notificação é alguém a decidir a tua prioridade.\n\nDesliga.\nEscolhe tu o que merece a tua atenção.\n\nO teu foco é o teu recurso mais valioso. Protege-o.\n\n💬 Quantas notificações desligaste esta semana?',
    hashtags: '#foco #detox #clarezamental #mindset #innermomentum #atencao #prioridades #produtividade #selfdevelopment #growthmindset #mindsetshift #desenvolvimentopessoal #mentalhealthmatters #focoprofundo #distracao #bemestar #autoconhecimento #clarityovernoise #mindsetcoach #disciplina #saudmental #equilibrio #vidareal #selfimprovement #dailymindset',
    cta: 'Quantas notificações desligaste?',
    status: 'DRAFT',
    dayOffset: 5,
  },
  {
    title: 'Muda a pergunta, muda a vida',
    pillar: 'Mentalidade de Crescimento',
    type: 'REEL',
    script: 'Em vez de "porquê eu?", pergunta "o que posso aprender com isto?". Em vez de "não consigo", pergunta "como posso melhorar?". A qualidade das tuas perguntas determina a qualidade da tua vida.',
    caption: '🔄 Muda a pergunta, muda a vida.\n\n❌ "Porquê eu?" → ✅ "O que posso aprender?"\n❌ "Não consigo" → ✅ "Como posso melhorar?"\n\nA qualidade das tuas perguntas determina a qualidade da tua vida.\n\n📌 Guarda e partilha.',
    hashtags: '#mentalidade #perguntas #mindset #crescimento #innermomentum #growthmindset #reencadramento #resiliencia #aprendizagem #evolucao #selfdevelopment #mindsetshift #desenvolvimentopessoal #personaldevelopment #mentalhealthmatters #autodesenvolvimento #clarityovernoise #mindsetcoach #disciplineiskey #motivacao #foco #transformacao #mudanca #superacao #vidacomproposito',
    cta: 'Guarda e partilha com alguém',
    status: 'SCHEDULED',
    dayOffset: 6,
  },
  {
    title: 'O método 2-minutos',
    pillar: 'Produtividade Real',
    type: 'REEL',
    script: 'Se demora menos de 2 minutos, faz agora. Não adies. Não escrevas na lista. Faz. Este simples hábito elimina 80% da tua procrastinação. Testa hoje.',
    caption: '⏱️ O Método 2-Minutos:\n\nSe demora menos de 2 minutos, faz AGORA.\n\nNão adies. Não escrevas na lista. Faz.\n\nEste simples hábito elimina 80% da procrastinação.\n\n👇 Testa hoje e conta como correu.',
    hashtags: '#produtividade #metodo #habitos #mindset #innermomentum #procrastinacao #eficiencia #gestaodetempo #foco #disciplina #growthmindset #selfdevelopment #mindsetshift #desenvolvimentopessoal #selfimprovement #autodesenvolvimento #clarityovernoise #produtividadereal #resultados #acao #simplicidade #rotina #organizacao #performance #mentalhealthmatters',
    cta: 'Testa hoje e conta como correu',
    status: 'DRAFT',
    dayOffset: 7,
  },
  {
    title: 'O que aprendeste esta semana?',
    pillar: 'UGC/Comunidade',
    type: 'POST',
    script: 'Todas as sextas fazemos o balanço. O que aprendeste esta semana? Uma lição, um erro, uma vitória. Partilha nos comentários.',
    caption: '📝 Sexta de reflexão.\n\nO que aprendeste esta semana?\n\n• Uma lição\n• Um erro\n• Uma vitória\n\n👇 Partilha nos comentários. Vamos crescer juntos.',
    hashtags: '#reflexao #comunidade #aprendizagem #ugc #innermomentum #sexta #balanco #crescimento #partilha #motivacao #growthmindset #mindset #selfdevelopment #desenvolvimentopessoal #mentalhealthmatters #selfimprovement #mindsetshift #vidareal #autodesenvolvimento #clarityovernoise #equipa #juntos #evolucao #conexao #feedback',
    cta: 'Partilha a tua reflexão',
    status: 'DRAFT',
    dayOffset: 8,
  },
  {
    title: 'Dopamina e produtividade',
    pillar: 'Conhecimento Rápido',
    type: 'REEL',
    script: 'A dopamina não é a molécula do prazer. É a molécula da motivação. Quando scrollas redes sociais, gastas dopamina sem retorno. Quando trabalhas num projeto difícil, construís dopamina sustentável. Escolhe o teu investimento.',
    caption: '🧪 A dopamina não é a molécula do prazer.\nÉ a molécula da motivação.\n\n📱 Scrollar redes = dopamina gasta sem retorno\n💻 Trabalho difícil = dopamina sustentável\n\nEscolhe o teu investimento. 💡\n\n#ciencia #neurociencia',
    hashtags: '#dopamina #neurociencia #cerebro #motivacao #innermomentum #ciencia #psicologia #habitos #produtividade #foco #mindset #growthmindset #selfdevelopment #mindsetshift #desenvolvimentopessoal #mentalhealthmatters #conhecimento #educacao #saude #bemestar #autoconhecimento #clarityovernoise #cienciacomportamental #saudmental #curiosidade',
    cta: 'Segue para mais ciência comportamental',
    status: 'SCHEDULED',
    dayOffset: 9,
  },
  {
    title: 'Pequenas vitórias diárias',
    pillar: 'Disciplina',
    type: 'CARROSSEL',
    script: 'Não subestimes as pequenas vitórias. Arrumaste a cama? Vitória. Treinaste 20 min? Vitória. Disseste não a uma distração? Vitória. Estas pequenas vitórias criam o momentum que te leva às grandes.',
    caption: '🏆 Não subestimes as pequenas vitórias.\n\n✅ Arrumaste a cama? Vitória.\n✅ Treinaste 20 min? Vitória.\n✅ Disseste não a uma distração? Vitória.\n\nEstas pequenas vitórias criam o momentum.\n\n🔥 Qual foi a tua vitória de hoje?',
    hashtags: '#vitorias #disciplina #habitos #mindset #innermomentum #consistencia #momentum #motivacao #pequenasconquistas #progresso #growthmindset #selfdevelopment #mindsetshift #desenvolvimentopessoal #mentalhealthmatters #selfimprovement #autodesenvolvimento #clarityovernoise #disciplineiskey #rotina #foco #superacao #evolucao #diaadiia #realselfdevelopment',
    cta: 'Qual foi a tua vitória de hoje?',
    status: 'DRAFT',
    dayOffset: 10,
  },
  {
    title: 'Foco profundo: 90 minutos',
    pillar: 'Clareza Mental',
    type: 'REEL',
    script: 'O teu cérebro funciona em ciclos de 90 minutos. Usa isso a teu favor. 90 minutos de foco profundo. Sem telemóvel. Sem interrupções. Depois, pausa de 15-20 minutos. Repete. Vais fazer mais em 3 horas do que a maioria faz em 8.',
    caption: '🎯 90 minutos que mudam tudo.\n\nO cérebro funciona em ciclos ultradianos de 90 min.\n\n💡 Usa isso:\n• 90 min de foco profundo\n• Sem telemóvel\n• Pausa de 15-20 min\n• Repete\n\nVais fazer mais em 3h do que a maioria em 8.\n\n📌 Guarda para experimentar.',
    hashtags: '#focoprofundo #produtividade #clarezamental #mindset #innermomentum #ultradianos #concentracao #deepwork #performance #eficiencia #growthmindset #selfdevelopment #mindsetshift #desenvolvimentopessoal #mentalhealthmatters #selfimprovement #foco #rotina #habitos #disciplina #clarityovernoise #ciencia #cerebro #energia #resultados',
    cta: 'Guarda para experimentar',
    status: 'DRAFT',
    dayOffset: 11,
  },
  {
    title: 'Resiliência não é nunca cair',
    pillar: 'Mentalidade de Crescimento',
    type: 'POST',
    script: 'Resiliência não é nunca cair. É escolher levantar-se. Todas as vezes. Sem desculpas. Sem drama. Com calma e com força.',
    caption: '🧱 Resiliência não é nunca cair.\n\nÉ escolher levantar-se. Todas as vezes.\n\nSem desculpas.\nSem drama.\nCom calma e com força.\n\n💪 Marca alguém que precisa de ouvir isto.',
    hashtags: '#resiliencia #mentalidade #forca #mindset #innermomentum #superacao #coragem #crescimento #motivacao #inspiracao #growthmindset #selfdevelopment #mindsetshift #desenvolvimentopessoal #mentalhealthmatters #selfimprovement #autodesenvolvimento #clarityovernoise #vidacomproposito #evolucao #mudanca #determinacao #persistencia #foco #realselfdevelopment',
    cta: 'Marca alguém que precise',
    status: 'SCHEDULED',
    dayOffset: 12,
  },
]

async function main() {
  console.log('Seeding database...')

  // Create hidden test account
  const hashedPassword = await bcrypt.hash('FfQ$qO0YmG', 12)
  await prisma.user.upsert({
    where: { email: 'abacus-e46776bb@example.com' },
    update: {},
    create: {
      email: 'abacus-e46776bb@example.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  // Create default settings
  const existingSettings = await prisma.settings.findFirst()
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        publicationMode: 'DRAFT',
        postsPerWeek: 5,
        preferredDays: '1,2,3,4,5',
        preferredTimes: '09:00,12:00,18:00',
        globalPause: false,
      },
    })
  }

  // Create demo Instagram account (disconnected)
  const existingIg = await prisma.instagramAccount.findFirst()
  if (!existingIg) {
    await prisma.instagramAccount.create({
      data: {
        igUserId: null,
        accessToken: null,
        tokenExpiry: null,
        username: 'inner_momentum_for_life',
        isConnected: false,
      },
    })
  }

  // Create demo posts
  const now = new Date()
  for (const postData of DEMO_POSTS) {
    const targetDate = new Date(now)
    targetDate.setDate(targetDate.getDate() + postData.dayOffset)
    targetDate.setHours(9, 0, 0, 0)

    const existingPost = await prisma.post.findFirst({
      where: { title: postData.title },
    })

    if (!existingPost) {
      const post = await prisma.post.create({
        data: {
          title: postData.title,
          pillar: postData.pillar,
          type: postData.type,
          script: postData.script,
          caption: postData.caption,
          hashtags: postData.hashtags,
          cta: postData.cta,
          status: postData.status,
          scheduledAt: postData.status === 'SCHEDULED' ? targetDate : null,
          publishedAt: postData.status === 'PUBLISHED' ? targetDate : null,
        },
      })

      await prisma.activityLog.create({
        data: {
          action: postData.status === 'PUBLISHED' ? 'POST_PUBLISHED' : postData.status === 'SCHEDULED' ? 'POST_SCHEDULED' : 'POST_CREATED',
          details: `Post "${postData.title}" criado (demo)`,
          postId: post.id,
        },
      })
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
