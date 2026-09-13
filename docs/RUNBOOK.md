# Runbook — claude-by-jaya

> Operação em produção. Setup de desenvolvimento está em
> [CONTRIBUTING.md](./CONTRIBUTING.md); OAuth, tabelas e RLS em
> [acesso-com-google.md](./acesso-com-google.md).

**Produção:** <https://claude-by-jaya.vercel.app> · Vercel, projeto
`claude-by-jaya`, team `betinhapotters-projects` · Supabase, projeto "Projetos"
(`zflksglibxhbnxndfwxo`).

## Deploy

Não há pipeline manual. Push em `main` = build na Vercel = publicação para os alunos.

1. `npm run build` verde localmente.
2. Commit atômico (conventional commits, inglês).
3. `@devops` faz o push. A Vercel roda `npm run build` com Node 24.
4. Confirme no dashboard da Vercel que o deployment ficou **Ready**, e abra
   `/login` e `/zona-de-genialidade` em produção.

O que a Vercel **não** recebe (`.vercelignore`): `docs/`, `originais/`,
`public/0*.png`, `public/1*.png`. O build só enxerga o derivado versionado em
`public/`. Por isso cada `scripts/build-*.mjs` imprime `= sem <fonte>, ...` e sai
com 0 quando a fonte não existe — esse é o caminho normal no deploy, não um erro.

`public/skill/*.skill` não é gerado no build: rode `npm run skill` na máquina depois de
editar `originais/skill-<nome>/` e commite o artefato.

## Variáveis em produção

Vercel → Settings → Environment Variables. As quatro obrigatórias
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `AUTH_SECRET`,
`GEMINI_API_KEY`) estão listadas com o uso em [CONTRIBUTING.md](./CONTRIBUTING.md#variáveis-de-ambiente).
Trocar `NEXT_PUBLIC_*` exige **redeploy** — o Next embute o valor em tempo de build.

## Verificação de saúde

Não há endpoint `/health`. Três checagens manuais cobrem o que importa:

| O quê | Como | Esperado |
|---|---|---|
| Site de pé + auth | `curl -sI https://claude-by-jaya.vercel.app/aula-1` | `307` para `/login` (middleware vivo). `500` = `AUTH_SECRET` faltando. Rotas `/api/*` protegidas devolvem `401` JSON, não redirect |
| Superfície pública | `curl -sI https://claude-by-jaya.vercel.app/zona-de-genialidade` | `200` com `text/html` |
| Banco acessível | Login com a conta admin e abrir `/admin` | Lista de alunos aparece. `42501` no log = permissão de tabela, ver abaixo |

Logs de runtime e de build: dashboard da Vercel → Deployments → Logs. Analytics de
acesso: `@vercel/analytics` já está no layout.

## Problemas conhecidos

| Sintoma | Causa | Correção |
|---|---|---|
| Deploy falha, produção fica no commit anterior | Um `build-*.mjs` saiu com 1 porque a fonte em `originais/` não existe na Vercel | Script precisa tolerar fonte ausente e sair com 0. Reproduza localmente num espelho sem `originais/` e `docs/` |
| Toda rota devolve `500 AUTH_SECRET não configurada` | Variável ausente no ambiente | Cadastrar na Vercel e redeployar |
| Ninguém consegue entrar; log mostra `42501 permission denied for table` | Grants das tabelas `*_claude` perdidos (aconteceu em 2026-08-21 na migração das chaves de API) | Rodar `docs/sql/restaurar-permissoes.sql` no SQL Editor do Supabase. Detalhe em [acesso-com-google.md](./acesso-com-google.md#quando-ninguém-consegue-entrar) |
| Imagem ou CSS some na tela de login, sem erro | `middleware.ts` fecha tudo; o asset não está no `matcher` de exceções | Adicionar o caminho ao `matcher` |
| Aluno desativado ainda entra | Cookie assinado de 10 min ainda válido | Esperar até 10 min. Para corte imediato, trocar `AUTH_SECRET` e redeployar: invalida todos os cookies, alunos ativos são reconferidos no banco sem novo login, o desativado cai na hora |
| `next dev` local sobe, mas nenhuma página compila | `pnpm-lock.yaml` solto em `C:\Users\Jaya` faz o Next eleger o home como workspace | Já corrigido por `outputFileTracingRoot` em `next.config.ts`; não remover |
| Editou aula e nada mudou | Edição em `public/aulas/`, que é regenerado | Editar `originais/` e rodar `npm run aulas` |

## Rollback

Vercel → Deployments → deployment anterior com status Ready → **Promote to
Production**. Instantâneo, sem novo build. Depois reverta o commit em `main` para o
próximo push não republicar o problema.

Rollback de dados não existe: `alunos_claude` usa `ativo = false` em vez de delete
justamente para nada precisar ser restaurado.

## Acesso de alunos

- Liberar / desativar / reativar / remover: `/admin`, só para `papel = 'admin'`.
- Corte de acesso propaga em até 10 min (validade do cookie).
- O e-mail cadastrado tem de ser o mesmo da conta Google que a pessoa vai usar.

## Escalação

Projeto de uma pessoa. Se o site cair fora do horário de trabalho, o rollback acima é
a única ação segura sem contexto; investigação fica para a próxima sessão com o log
da Vercel em mãos.
