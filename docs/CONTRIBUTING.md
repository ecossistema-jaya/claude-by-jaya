# Contribuir com o claude-by-jaya

> Guia operacional em pt-BR, como o resto de `docs/`. Código, commits e specs
> técnicas seguem em inglês.

Site Next.js 15 (App Router) que serve o curso "Claude do Zero": cinco aulas em HTML
estático atrás de login Google, mais duas superfícies públicas (Zona de Genialidade e
deck da palestra). Deploy automático na Vercel a cada push em `main` — ver
[RUNBOOK.md](./RUNBOOK.md).

## Setup

Pré-requisitos: Node 24 (default atual da Vercel; o `package.json` não fixa `engines`) e npm.

```bash
npm install
cp .env.example .env.local   # preencha as variáveis abaixo
npm run dev                  # regenera os derivados e sobe http://localhost:3000
```

Para entrar localmente o seu e-mail Google precisa estar em `alunos_claude` — o
passo a passo de OAuth e Supabase está em [acesso-com-google.md](./acesso-com-google.md).

## Scripts

<!-- AUTO-GENERATED: package.json scripts — regenerar com /update-docs -->
| Comando | O que faz |
|---|---|
| `npm run dev` | Roda `aulas`, `artes`, `zona`, `manual`, `deck` e sobe `next dev` |
| `npm run build` | Mesma cadeia de derivados e `next build` (é o que a Vercel roda) |
| `npm run start` | `next start` sobre um build pronto |
| `npm run aulas` | Copia `originais/*.html` → `public/aulas/` (iframes das aulas) |
| `npm run artes` | Converte `originais/zona-genialidade/*.png` → `public/zona/arte/*.webp` em duas larguras |
| `npm run zona` | Publica `originais/zona-de-genialidade.html` → `public/zona/index.html`, injetando a taxonomia da Carta de Travessia; roda `audit:taxonomia` antes |
| `npm run manual` | Copia a pasta `originais/manual-8-recursos/` → `public/manual/` |
| `npm run deck` | Publica o HTML exportado de `originais/arquitetura-da-consciencia/` → `public/deck/index.html` |
| `npm run skill` | Empacota `originais/skill-<nome>/` → `public/skill/<nome>.skill` (zip). **Fora da cadeia de build** — rode à mão e commite o artefato |
| `npm run audit:taxonomia` | Verifica que todo sinal de `docs/carta-travessia-1.1.json` consegue disparar; falha quebra o build |
<!-- /AUTO-GENERATED -->

Scripts avulsos em `scripts/` sem entrada no `package.json` (`assinar-arcanos.mjs`,
`extract-images.mjs`, `normalize.mjs`) são ferramentas de migração pontual,
idempotentes; rode com `node scripts/<nome>.mjs` só quando o cabeçalho do arquivo disser.

Não existem `lint`, `typecheck` nem `test` neste projeto. O gate antes do commit é
`npm run build` passar limpo.

## Variáveis de ambiente

<!-- AUTO-GENERATED: .env.example + uso em app/ e middleware.ts — regenerar com /update-docs -->
| Variável | Obrigatória | Para quê | Onde é lida |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase que guarda as tabelas `*_claude` | `app/lib/supabase/config.ts` (substituída em build) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública (`sb_publishable_…`) do mesmo projeto | `app/lib/supabase/config.ts` |
| `AUTH_SECRET` | Sim | Assina o cookie de acesso de 10 min. Sem ela o middleware devolve 500 em toda rota. Gere com `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` | `middleware.ts`, `app/api/zona/analyze`, `app/api/zona/lead` (assinatura em `app/lib/auth.ts`) |
| `GEMINI_API_KEY` | Sim | Chave do Google AI Studio para `/api/analyze` e `/api/zona/analyze` | `app/lib/gemini.ts` |
| `VERCEL_PROJECT_PRODUCTION_URL` | Não | Injetada pela Vercel; monta a base absoluta dos metadados em `app/layout.tsx`. Local cai em `localhost` | `app/layout.tsx` |
<!-- /AUTO-GENERATED -->

`.env*` está no `.gitignore` (só `.env.example` sobe). Em produção as variáveis vivem
em **Vercel → Settings → Environment Variables**.

## Fonte × derivado

Regra única do repositório: `originais/` é a fonte editável; `public/` é derivado e
regenerado pelos scripts acima. Editar `public/aulas/`, `public/zona/`, `public/manual/`
ou `public/deck/` direto é trabalho perdido no próximo `npm run dev`.

Três exceções documentadas no `.gitignore`: `public/imagens/` (biblioteca de
trabalho, ~430 MB), `originais/zona-genialidade/` (PNGs brutos) e
`originais/arquitetura-da-consciencia/` (export de 5 MB) ficam fora do Git — o
derivado versionado em `public/` é o que a Vercel serve.

O `.vercelignore` tira `docs/` e `originais/` do upload. Consequência: **todo
`scripts/build-*.mjs` precisa tolerar fonte ausente e sair com código 0**, senão o
deploy cai (aconteceu em 2026-09-03 com `build-manual.mjs`). Ao mexer num script de
build, teste num espelho sem `originais/` e `docs/`.

## Estilo

- Comentários de cabeçalho em pt-BR explicando o *porquê*, como os scripts já fazem.
- Nomes de arquivo e identificadores em pt-BR quando falam do domínio (`aluno`,
  `emitirAcesso`), inglês quando são infraestrutura genérica.
- Commits: conventional commits em inglês, atômicos, com escopo
  (`fix(manual): survive the deploy, where originais/ does not exist`).
- Sem formatter nem pre-commit hook configurados; siga o arquivo vizinho.

## Antes de abrir PR

- [ ] `npm run build` passa localmente.
- [ ] Mexeu em `scripts/build-*.mjs`? Validou contra o `.vercelignore` (fonte ausente → exit 0).
- [ ] Mexeu em asset da tela de login? Entrou na lista de exceções do `matcher` em `middleware.ts` — sem isso vira 307 silencioso.
- [ ] Editou `originais/`, não `public/`.
- [ ] Alterou `docs/carta-travessia-1.1.json`? `npm run audit:taxonomia` verde.
- [ ] Nada de `.env*` no diff.
- [ ] `git push` e PR são do `@devops` (Gage).
