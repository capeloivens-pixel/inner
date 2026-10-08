# Inner Momentum Manager

Inner Momentum Manager — Sistema de gestão autónoma de Instagram para @inner_momentum_for_life

## Stack
- Next.js (App Router) + TypeScript
- Prisma (PostgreSQL)
- NextAuth
- Tailwind CSS

## Configuração
1. Criar um ficheiro `.env` com `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `ABACUSAI_API_KEY` e as variáveis AWS (`AWS_REGION`, `AWS_BUCKET_NAME`, `AWS_FOLDER_PREFIX`).
2. `yarn install`
3. `yarn prisma generate && yarn prisma db push`
4. `yarn dev`
