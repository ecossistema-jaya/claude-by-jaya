# Formato de uma memória

## Arquivo: `memory/<slug>.md`

Nome do arquivo em kebab-case, descritivo, sem data. Ex.: `abre-com-a-substancia.md`,
`edita-originais-nao-build.md`.

```markdown
---
name: abre-com-a-substancia
description: Jaya corta preâmbulo — a primeira frase da resposta já é a conclusão.
tipo: preferencia
confianca: 2
fonte: sessões de 2026-08-14 e 2026-08-17
atualizado: 2026-08-17
---

Abrir toda resposta pela substância. Nada de "ótima pergunta", "vou verificar",
"espero que ajude" ou recapitulação do pedido antes da resposta.

**Por quê:** a leitura é em terminal, escaneando. Preâmbulo empurra a informação
para baixo da dobra e custa uma rolagem para chegar no que importa.

**Como aplicar:** escrever a resposta, apagar o primeiro parágrafo, verificar se
ainda faz sentido. Quase sempre faz.

Relacionados: [[listas-no-maximo-cinco-itens]]
```

### Campos do frontmatter

| Campo | Regra |
|---|---|
| `name` | Igual ao nome do arquivo sem `.md`. É o alvo dos links `[[name]]`. |
| `description` | Uma linha. É o gancho que decide se a memória é relevante. |
| `tipo` | `preferencia` \| `decisao` \| `correcao` \| `contexto` |
| `confianca` | Inteiro ≥ 1. Sobe a cada confirmação, desce a cada contradição. |
| `fonte` | De onde veio. Fala explícita do Jaya, correção, ou N sessões. |
| `atualizado` | Data ISO `YYYY-MM-DD`. Sempre absoluta, nunca "semana passada". |

### Corpo

O fato em imperativo — a instrução, não a narrativa do que aconteceu.
Depois `**Por quê:**` (o critério, que é o que generaliza) e `**Como aplicar:**`
(o teste concreto na próxima vez). `contexto` pode dispensar o "Como aplicar".

Links `[[slug]]` no fim. Link para memória que ainda não existe é válido — marca
algo que vale escrever depois.

## Linha no `memory/MEMORY.md`

```markdown
- [Abre com a substância](abre-com-a-substancia.md) — corta preâmbulo; a primeira frase já é a conclusão. `preferencia` · c=2
```

Entrar sob a seção correspondente ao `tipo`:

| `tipo` | Seção |
|---|---|
| `preferencia` | `## Preferências` |
| `decisao` | `## Decisões recorrentes` |
| `correcao` | `## Correções` |
| `contexto` | `## Contexto do projeto` |

Dentro da seção, ordenar por `confianca` decrescente — o mais confirmado primeiro,
que é o que sobrevive a uma leitura rápida do índice. Ao incrementar a confiança
de uma memória, reordenar a seção.

O índice guarda **só** a linha. Conteúdo no índice é duplicação: ele é carregado
inteiro em toda sessão pelo hook, e cada palavra a mais custa contexto em todas as
sessões futuras.
