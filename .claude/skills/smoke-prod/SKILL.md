---
name: smoke-prod
description: Smoke test de produção do claude-by-jaya em ~5s — as checagens do RUNBOOK (middleware vivo, superfície pública, APIs protegidas) via HTTP, sem login. Rodar depois de todo push em main ou quando "o site caiu?".
version: 1.0.0
disable-model-invocation: true
---

# smoke-prod

Roda `scripts/smoke-prod.mjs` desta skill e interpreta o resultado.

```bash
node .claude/skills/smoke-prod/scripts/smoke-prod.mjs
```

Aceita URL alternativa (preview da Vercel): `node ... https://claude-by-jaya-git-xyz.vercel.app`.

## O que verifica

| Rota | Esperado | Se falhar |
|---|---|---|
| `GET /aula-1` | `307` → `/login` | `500` = `AUTH_SECRET` faltando na Vercel. `200` = middleware morto, aula exposta |
| `GET /zona-de-genialidade` | `200` `text/html` | Página pública caiu; ver build log |
| `GET /claude` | `200` `text/html` | Página de vendas (vitrine pública) caiu |
| `GET /claude-do-zero` | `307` → `/login` | Entrada do aluno; `200` sem login = exposta |
| `POST /api/zona/analyze` (sem cookie) | `401` JSON | `500` = Gemini/Supabase env; `200` = API aberta |
| `GET /admin` | `307` → `/login` | `200` sem login = **incidente de acesso** |

## Depois do script

1. Todas verdes → relate em uma linha e pare.
2. Alguma vermelha → abra `docs/RUNBOOK.md` seção "Problemas conhecidos", case o sintoma,
   proponha a correção. Não mexa em env da Vercel sem o Jaya confirmar.
3. Banco (`42501`) não é coberto aqui — exige login na conta admin e abrir `/admin`.
