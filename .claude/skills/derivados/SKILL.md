---
name: derivados
description: Mapa fonte → script → derivado do claude-by-jaya. Carregar sempre que a tarefa tocar em originais/, public/, protected/, scripts/build-*.mjs, ou quando o hook block-derivados bloquear uma edição. Responde "qual arquivo eu edito e qual npm script eu rodo".
version: 1.0.0
user-invocable: false
---

# derivados

Regra única: **`public/` e `protected/` são saída, nunca entrada.** A fonte vive em
`originais/`, `app/lib/*-schema.mjs` e `docs/carta-travessia-1.1.json`. Editar o
derivado é trabalho perdido no próximo `npm run dev` — o hook
`.claude/hooks/block-derivados.mjs` bloqueia, e esta skill diz o que fazer em vez disso.

## Mapa

| Quero mudar | Edito | Rodo | Derivado |
|---|---|---|---|
| Aula 1–5 (iframe) | `originais/aula-0N-*.html` | `npm run aulas` | `public/aulas/` |
| Arte das cartas | `originais/zona-genialidade/*.png` (fora do git) | `npm run artes` | `public/zona/arte/*.webp` |
| Zona de Genialidade (perguntas, texto) | `originais/zona-de-genialidade.html` | `npm run zona` | `protected/zona/index.html` + redirect em `public/zona/index.html` |
| Taxonomia da Carta de Travessia | `docs/carta-travessia-1.1.json` | `npm run audit:taxonomia` depois `npm run zona` | idem |
| Arquitetura da Consciência (app) | `originais/arquitetura-da-consciencia.html`, `consciencia-app.js`, `consciencia-reading.js`, `consciencia.css` | `npm run consciencia` | `protected/consciencia/index.html` + redirect em `public/consciencia/` |
| Perguntas da Consciência / Mapa | `app/lib/consciencia-schema.mjs`, `app/lib/mapa-schema.mjs` | `node scripts/test-consciencia.mjs` depois `npm run consciencia` | idem |
| Manual 8 recursos | `originais/manual-8-recursos/` | `npm run manual` | `public/manual/` |
| Página de vendas `/claude-do-zero` | `originais/claude-do-zero.html` | `npm run oferta` | `public/oferta/index.html` |
| Deck da palestra | `originais/arquitetura-da-consciencia/` (fora do git) | `npm run deck` | `public/deck/index.html` |
| Skill `.skill` para download | `originais/skill-<nome>/` | `npm run skill` **à mão** e commitar o artefato | `public/skill/<nome>.skill` |

`npm run dev` e `npm run build` rodam toda a cadeia exceto `skill`.

## Armadilhas

- **Vercel não recebe `originais/` nem `docs/`** (`.vercelignore`). Cada `build-*.mjs`
  precisa sair com 0 quando a fonte não existe — é o caminho normal do deploy. Ao
  criar script novo, copie o guard de `scripts/build-consciencia.mjs` (linhas 14–20).
- Fontes fora do git (`zona-genialidade/`, `arquitetura-da-consciencia/`): se a pasta
  não está na máquina, o derivado versionado é a verdade. Não regenere sem a fonte.
- Marcadores de template (`<!--__STYLE__-->`, `/*__QUESTIONS__*/`): o build falha se
  sumirem do HTML/JS fonte. Erro "Missing ... template markers" = alguém apagou o marcador.
- Depois de regenerar, `git status` deve mostrar **fonte e derivado** juntos no commit.

## Referências

- `docs/CONTRIBUTING.md` — tabela oficial de scripts
- `docs/RUNBOOK.md` — deploy e problemas conhecidos
