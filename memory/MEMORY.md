# MEMORY — índice

Índice da memória persistente do Jaya neste projeto. Carregado no início de toda
sessão pelo hook `SessionStart` (`.claude/hooks/load-memory.mjs`).

Uma linha por memória. O conteúdo vive no arquivo, nunca aqui.
Formato da linha: `- [Título](arquivo.md) — gancho de uma linha. \`tipo\` · c=N`

- `tipo`: `preferencia` | `decisao` | `correcao` | `contexto`
- `c=N`: confiança — quantas vezes o padrão foi confirmado. Sobe com repetição,
  cai quando é contrariado. `c=1` é hipótese; `c>=3` é regra.

Escrito e mantido por `/improve-system`. Formato completo em
`.claude/skills/improve-system/references/formato-memoria.md`.

---

## Preferências

_(vazio — rode `/improve-system` ao fim de uma sessão de trabalho real)_

## Decisões recorrentes

_(vazio)_

## Correções

_(vazio)_

## Contexto do projeto

_(vazio)_
