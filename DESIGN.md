# Design

Sistema visual da **Zona de Genialidade** (`/zona-de-genialidade`), a superfície
pública do projeto. As rotas de aula (`/aula-*`) seguem no sistema marsala/cobre de
`app/globals.css` e não são tocadas por este documento.

Todo número de contraste abaixo foi calculado, não estimado.

## Theme

Luz de papel com mergulhos de profundidade. O corpo da página é marfim mineral,
sempre. O azul-petróleo entra em **blocos inteiros e raros**, ocupando a largura
total, como quem prende a respiração entre dois trechos de leitura. Nunca aparece
como detalhe espalhado, borda ou sombra colorida.

Tema único, claro. Sem alternância dark/light: as artes têm um ponto branco fixo e
inverter o fundo brigaria com todas elas.

A textura não é decorativa. Quase toda superfície da página encosta em papel ou em
terra, porque a tese da peça é enraizamento.

## Color

Estratégia: **full palette**, quatro papéis nomeados. Não é restrained (o petróleo
toma seções inteiras) nem drenched (o papel domina em área).

### Tokens

| Token | Hex | Contraste s/ marfim | Papel |
|---|---|---|---|
| `--zg-papel` | `#F4F0E7` | — | fundo predominante |
| `--zg-papel-alto` | `#FBF9F4` | 1,08:1 | superfície elevada, apenas perceptível |
| `--zg-petroleo` | `#002F3B` | 12,56:1 | títulos e blocos mergulhados |
| `--zg-petroleo-alto` | `#0A4453` | — | superfície elevada dentro do mergulho |
| `--zg-ambar` | `#F3B867` | 1,56:1 | **forma apenas** |
| `--zg-terracota` | `#B85F3F` | 3,89:1 | título grande e forma |
| `--zg-terracota-ink` | `#A35337` | 4,80:1 | texto e link sobre papel |
| `--zg-musgo` | `#53624B` | 5,74:1 | texto, rótulo e forma |
| `--zg-grafite` | `#292929` | 12,79:1 | corpo de texto |
| `--zg-grafite-suave` | `#6B6259` | 5,25:1 | texto secundário |
| `--zg-fio-ui` | `#8C8474` | 3,26:1 | borda de campo e botão |
| `--zg-fio` | `#D9D2C2` | 1,32:1 | separador decorativo |

Sobre `--zg-petroleo`: `--zg-musgo-claro` `#899484` (4,50:1) e
`--zg-terracota-clara` `#C67F65` (4,50:1). Musgo e grafite puros **morrem** ali
(2,19:1 e 1,02:1) e estão proibidos dentro de bloco mergulhado.

### Regras duras

1. **Âmbar não carrega palavra sobre papel.** 1,56:1. É preenchimento de barra,
   traço de gráfico, halo, arco. Sem exceção.
2. **Âmbar carrega palavra sobre petróleo.** 8,07:1. É a cor de voz dos blocos
   mergulhados. A consequência de composição importa: o âmbar só fala quando a
   seção mergulha, o que dá significado à alternância em vez de decorá-la.
3. **Terracota pura não faz corpo de texto.** 3,89:1 serve título ≥24px e rótulo.
   Para texto corrido e link, `--zg-terracota-ink`.
4. **Nunca cor sozinha.** Toda série de gráfico tem rótulo e número visíveis.

### Referência nomeada

Science and Nonduality: papel mineral, mergulhos escuros de página inteira,
fotografia documental com colagem simbólica por cima. Não é "wellness"; é editorial
sóbrio que trata o simbólico com seriedade científica.

## Typography

Três famílias, no teto. Nenhuma está na lista de reflexo do register brand.

- **Display — Marcellus** (400, única). Serifa de inscrição romana. Escolhida porque
  o título estampado na arte da capa é uma serifa display em caixa alta: Marcellus é
  o parente tipográfico dela, então o HTML e a imagem falam a mesma língua. Peso
  único força hierarquia por escala, o que é mais sóbrio que empilhar pesos.
- **Corpo e UI — Jost** (300/400/500/600). Geométrica, ar de Futura, contraste real
  com a serifa. Corpo em 400, rótulo em 500.
- **Dado — JetBrains Mono** (400/500). Só para número de resultado, porcentagem e
  eixo de gráfico, onde o alinhamento tabular importa. Nunca para texto de leitura;
  mono como fantasia de "técnico" está banido.

Petrona sai desta superfície. Continua no curso.

### Escala

Razão 1,25. Fluida via `clamp()`.

| Papel | Tamanho |
|---|---|
| display | `clamp(2.6rem, 6vw, 4.25rem)` — teto 68px |
| h2 | `clamp(1.75rem, 3.4vw, 2.5rem)` |
| h3 | `clamp(1.25rem, 2.2vw, 1.55rem)` |
| corpo | `clamp(1rem, 1.6vw, 1.125rem)` |
| apoio | `0.9375rem` |
| rótulo mono | `0.75rem`, tracking `0.18em` |

- Medida de leitura travada em 68ch.
- `text-wrap: balance` em h1–h3; `pretty` na prosa longa.
- Letter-spacing de display: `-0.02em`, nunca abaixo de `-0.04em`.
- Caixa-alta só em rótulo de até 4 palavras.

## Components

- **Capa.** A arte `02` já traz título, subtítulo e logo estampados. O HTML **não**
  repete nenhum deles em texto por cima. O `<h1>` existe para leitor de tela e SEO,
  visualmente oculto. Mesmo padrão de `app/globals.css` `.capa`, onde a arte carrega
  a marca e o HTML só posiciona o que ela não diz.
- **Faixa de arte.** Imagem 16:9 sangrando na largura total, separando movimentos da
  página. Carrega significado (a arte escolhida comenta a seção seguinte), nunca é
  respiro decorativo. `loading="lazy"` em todas exceto a capa.
- **Bloco mergulhado.** Seção full-bleed em petróleo, texto em marfim, ênfase em
  âmbar. Usado no máximo três vezes na página inteira.
- **Pergunta.** Superfície de papel elevado, borda em `--zg-fio-ui`, opção
  selecionada marcada por preenchimento **e** por marca, não só por cor.
- **Cartão de framework** (dashboard). Existe porque cada framework é uma unidade de
  leitura independente com autor próprio, não porque cartão é o reflexo. Grade
  variada, nunca doze cartões idênticos.
- **Leitura interpretativa.** Bloco marcado que separa o que foi medido do que foi
  interpretado. Sem tarja lateral colorida (banida); a distinção vem de fundo,
  tipografia e de um rótulo explícito.

## Layout

- Coluna de leitura 68ch, centralizada, dentro de um invólucro de 1080px.
- Faixas de arte e blocos mergulhados sangram até a borda da janela.
- Grade responsiva sem breakpoint: `repeat(auto-fit, minmax(300px, 1fr))`.
- Ritmo vertical variado: agrupamento apertado dentro de um movimento
  (`clamp(1rem, 2vw, 1.5rem)`), separação generosa entre movimentos
  (`clamp(4rem, 9vw, 7rem)`).
- Escala z semântica: `--z-fixo: 10`, `--z-modal: 40`, `--z-aviso: 60`. Sem 9999.

## Motion

Discreta e contada. A página trata de enraizamento, então nada salta.

- Barra de progresso e transição entre perguntas: 240ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Barras e gráficos do dashboard crescem uma vez, escalonadas em 60ms, ao entrarem
  em viewport. Conteúdo **já visível** por padrão: a animação parte de um estado
  legível e nunca é o que revela o texto.
- Sem bounce, sem elástico, sem fade em toda seção.
- `prefers-reduced-motion: reduce` corta tudo, inclusive o crescimento das barras
  (que passam ao valor final direto).

## Iconography

Lucide em traço, herdado do HTML atual da aula 4, em `--zg-musgo` ou
`--zg-petroleo`. Nada de ícone dentro de círculo colorido acima de cada título.
O símbolo pesado da página vem das artes, não de pictograma de interface.

## Imagery

18 arquivos em `public/zona/arte/`, derivados de `originais/zona-genialidade/` por
`scripts/build-artes.mjs` (WebP q80, duas larguras, `-sm` em 640px).

Direção de uso:

| Arte | Onde | Por quê |
|---|---|---|
| `02` | capa | única com título estampado |
| `11` | as 4 Zonas | quatro círculos, um por zona |
| `12` | o que a análise enxerga | ruído virando ordem |
| `10` | blueprint | linguagem virando estrutura |
| `09` | tela de análise | espera com corpo, não spinner vazio |
| `03` / `04` | gate de e-mail | par que não fixa gênero |
| `14` | topo do dashboard | convergência de perspectivas |
| `06` | roadmap de 90 dias | plantio e colheita |

Alt text descreve a cena, nunca o arquivo.
