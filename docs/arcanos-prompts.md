# Prompts das 22 cartas de travessia

Insumo para gerar a arte dos arcanos que acompanham o card `#card-carta` da Zona de
Genialidade. Não é código: é a especificação visual que mantém as 22 imagens na mesma
família das artes que já vivem em `originais/zona-genialidade/`.

## Como usar

Cada geração é **BASE + CENA**: cole o bloco BASE, um espaço, e a cena do arcano. A BASE
carrega estilo, paleta e proibições; a cena carrega o que aquele arcano específico pede.
Prompts em inglês porque é o idioma em que os modelos de imagem foram treinados — misturar
português degrada a aderência.

Depois de gerar, salve os PNG em `originais/zona-genialidade/` com o nome da tabela no fim
deste arquivo. `npm run artes` converte para `public/zona/arte/<slug>.webp` mais a versão
`-sm` de 640px, e é idempotente: rodar de novo não reconverte o que já está em dia.

## Por que não "estilo Thoth"

O que este arquivo toma emprestado do Tarô de Thoth é o vocabulário simbólico — nome do
arcano, atribuição astrológica, numeral romano, eixo de leitura. Isso é tradição hermética
da Golden Dawn, anterior ao baralho e de ninguém em particular; é também exatamente o que o
card já mostra em texto.

O que este arquivo deliberadamente NÃO pede é a pintura de Frieda Harris. Duas razões, e a
segunda pesa mais que a primeira. A obra dela é protegida — morreu em 1962, o que põe a arte
em domínio público no Brasil apenas em 2033. E o traço dela é art déco inglês dos anos 1940:
posto ao lado das artes da página, que são colagem contemporânea sobre papel, a carta
pareceria recortada de outro site.

## Proporção e formato

Gere em **1024 × 1536** (2:3, proporção de carta). Vertical é inegociável: o card é largo, e
a imagem entra à esquerda do texto no desktop e acima dele no mobile — uma arte horizontal
empurraria a travessia para fora da primeira dobra.

Peso não é problema aqui. Cada pessoa recebe **uma** carta, não as 22: o navegador baixa um
`-sm.webp` de ~45KB. As outras 21 nunca são requisitadas.

---

## BASE

```
Symbolic collage on aged cream paper (#F4F0E7), visible paper grain and soft foxing at the
edges. Layered composition: delicate botanical watercolor (leaves, branches, seed pods) in
moss green and terracotta, antique scientific-illustration engravings, and thin hand-drawn
gold linework tracing circles, orbits and constellations across the scene.
A single woman seen from behind, small against the composition: olive skin,
voluminous curly coppery-red hair at shoulder length, athletic build with defined arms.
Intricate geometric black-ink tribal tattoos wrap her left upper arm and shoulder.
Layered thin gold necklaces. She wears a simple dark dress. Face never visible.
Deep petrol blue (#002F3B) for shadow and depth,
warm amber gold (#F3B867) for light, terracotta (#B85F3F) as accent. Muted, restrained,
contemplative. Soft diffuse light, no harsh contrast. Vertical composition, generous
negative space in the upper third. Painterly, hand-made, editorial — not digital gloss.
The artwork bleeds to all four edges. No border, no frame, no caption panel.
```

A figura é a Jaya, reduzida ao que se lê de costas e em aquarela: cabelo ruivo-acobreado
cacheado, pele oliva, braços definidos, tatuagem geométrica no braço esquerdo e os colares
finos de ouro em camadas. Rosto nunca aparece — a carta não é retrato, e rosto pequeno em
aquarela é onde o gerador estraga tudo.

## NEGATIVE

```
no text, no lettering, no numerals, no roman numerals, no calligraphy, no captions,
no cartouche, no label, no title bar, no watermark, no signature, no border, no frame,
no ornate frame, no decorative edging, no card frame, no tarot card layout,
no visible face, no front-facing figure, no photorealism, no 3D render, no neon,
no saturated colors, no fantasy kitsch, no medieval woodcut, no art deco
```

A proibição de moldura e de texto é o ponto que mais escapa. Sem ela o gerador desenha por
conta própria uma borda ornamentada com numeral e nome no rodapé — bonito, mas fora do
projeto: numeral e nome já estão no card da página, em HTML, e sairiam diferentes em cada uma
das 22, com acento quebrado em `Luxúria` e `O Éon`. A moldura também disputa o canto inferior
esquerdo, que é onde a assinatura entra depois.

---

## As 22 cenas

### 0 · O Louco · Ar
> Começar sem currículo. A travessia é dar o primeiro passo sem a garantia.

```
The figure stands at the torn edge of a cliff made of layered paper, one foot already lifted
over the drop. Below her the abyss is not dark but filled with pale luminous cloud. No
bridge, no rope, no rail. A single white feather drifts upward past her. An empty satchel
hangs open at her side. Thin gold lines sketch air currents spiraling around her ankles.
```

### I · O Magus · Mercúrio
> Nomear o que faz. A travessia é converter habilidade em oferta dita em voz alta.

```
The figure stands at a worktable strewn with four instruments — a blade, a cup, a coin, a
wand — all rendered as antique engravings. From the table a ribbon of gold light unfurls
upward and outward in a widening spiral, as if a sentence were leaving the room. A caduceus
grows from the table's center like a plant. A single bead of liquid mercury catches the
light.
```

### II · A Sacerdotisa · Lua
> Escutar antes de produzir. A travessia é suportar o não-saber até o material próprio aparecer.

```
The figure sits from behind between two pale paper columns, veiled by a translucent gauze
that softens everything beyond it. Before her a still pool reflects a waxing crescent moon.
A loom stands empty, warp threads strung in gold but nothing woven. Nothing has been made
yet. Moths rest on the columns. Deep quiet.
```

### III · A Imperatriz · Vênus
> Deixar crescer o que já foi plantado. A travessia é nutrir uma coisa só até dar fruto.

```
The figure kneels watering one single heavy-laden fruit tree, lush and specific. Around her,
half-buried in the paper, six or seven other seedlings sit dry and abandoned in their pots.
The Venus spiral is drawn in gold over the sky. A split pomegranate rests at the tree's
root, seeds glowing. Only the watered thing is in color; the abandoned ones are pencil ghosts.
```

### IV · O Imperador · Áries
> Assumir a autoridade que já exerce. A travessia é ocupar a cadeira.

```
An empty throne drawn entirely in fine gold line stands on a stone terrace, facing a wide
mountain horizon at dawn. The figure approaches it from behind, mid-step, not yet seated.
Architectural blueprints and survey drawings lie scattered and weighted down by stones —
already hers, already used. A ram's head engraving watches from the upper left.
```

### V · O Hierofante · Touro
> Ensinar o que já sabe. A travessia é virar prática em doutrina transmissível.

```
The figure stands before a circle of empty seats arranged in a shallow amphitheatre of
paper. In her hands an open book whose pages detach and lift away as pale birds, flying
toward the empty seats. A bull engraving rests in the lower botanical margin. A single key
hangs on a gold thread from above, at eye level, unclaimed.
```

### VI · Os Amantes · Gêmeos
> Escolher entre dois caminhos igualmente possíveis. A travessia é a escolha que fecha uma.

```
Two paths diverge from a single point in perfect mirrored symmetry — the left in amber gold
and ripe wheat, the right in moss green and cool shade, equally beautiful, equally open. The
figure stands exactly at the vertex, turned slightly toward one. Behind her, two doorways:
one wide open, one swinging closed. Twin silhouettes appear as faint mirrored engravings in
the upper corners.
```

### VII · O Carro · Câncer
> Avançar carregando a própria casa. A travessia é mover-se com o peso que já tem.

```
The figure walks uphill along a rising road, a great spiraled nautilus shell carried on her
back like a house — heavy, but carried, not abandoned. A chariot drawn in gold line
accompanies her, its wheels formed of tangled root systems. A crab engraving sits in the
lower margin among the botanicals. The summit is visible and not far.
```

### VIII · Ajuste · Libra
> Corrigir o preço, o prazo, a troca. A travessia é reequilibrar sem pedir licença.

```
A large balance scale drawn in fine gold line dominates the center, its two pans visibly
unequal — one heaped, one nearly empty. The figure reaches up with one steady hand and moves
the fulcrum itself, not the pans. A vertical sword bisects the composition behind the scale.
Sharp diamond geometry in pale gold radiates from the pivot point.
```

### IX · O Eremita · Virgem
> Recolher-se para lapidar. A travessia é o período fechado que produz a coisa boa.

```
The figure sits alone inside a luminous oval of warm light, the surrounding paper deepening
to near-black petrol blue at the edges. She holds a lantern, and inside the lantern is not a
flame but a single seed, glowing. Wheat sheaves in dry gold frame the lower composition. An
egg rests intact beside her. Nothing enters, nothing leaves.
```

### X · A Fortuna · Júpiter
> Aceitar o ciclo em vez de forçar a linha reta. A travessia é jogar mais rodadas.

```
A great wheel of concentric gold orbits fills the upper composition, small dark figures
distributed around its rim — some rising, some falling, none at rest. The figure below
watches it turn, unhurried. Two dice rest in the botanical margin, mid-roll. A spiral galaxy
engraving overlays the wheel. Beneath it, a straight ruled line ends abruptly, unfinished.
```

### XI · Luxúria · Leão
> Querer em público. A travessia é sustentar o apetite sem disfarce.

```
The figure stands upright and unveiled beside a great golden lion, one hand resting openly
in its mane, in full frontal daylight — nothing hidden, nothing softened. A cup overflows at
her feet, spilling amber light across the paper. Sunflowers and ripe fruit crowd the lower
margin. A leonine sun blazes behind her without haze. Her posture is tall, deliberate,
unapologetic.
```

### XII · O Enforcado · Água
> Inverter a posição. A travessia é a rendição que muda o ângulo.

```
The composition is split by a still waterline across the middle. Above, the world hangs
inverted and confused; below, its reflection is upright, ordered and clear — the reflection
is the true one. The figure is suspended upside down by a single gold thread at one ankle,
serene, arms loose. An ankh and a green branch float in the water. Nothing struggles.
```

### XIII · A Morte · Escorpião
> Encerrar o que ainda funciona mal. A travessia é o corte.

```
A scythe of fine gold line cuts cleanly through a still-green stalk at the center — the
plant is alive, not withered, and it is being cut anyway. Above the cut, blossoms fall away
and dissolve into paper. Below it, in the same motion, new shoots break the soil. A scorpion
engraving rests in the lower margin. A skeleton leaf, veins intact, is pressed into the
paper like a specimen.
```

### XIV · A Arte · Sagitário
> Fundir os dois lados que parecem incompatíveis. A travessia é a liga.

```
Two streams pour simultaneously into a single wide-mouthed alembic — one molten amber gold,
one deep petrol blue — and where they meet inside the glass a third color blooms that is
neither. The figure tends the vessel from behind with both hands. A drawn bow and arrow arc
across the upper composition. A lion and an eagle are engraved overlapping, sharing one
body.
```

### XV · O Diabo · Capricórnio
> Olhar para o que prende. A travessia é nomear a corrente.

```
The figure holds up her own wrist and looks at the gold chain around it — the chain is
visibly slack, the loop wide enough to slip off, and she is examining it rather than pulling
against it. A shaft of light falls precisely on the open link. Roots at the lower edge
thicken and interlace into a lattice resembling bars. A goat engraving with a fish's tail
watches from the upper right.
```

### XVI · A Torre · Marte
> Derrubar a estrutura que já não sustenta. A travessia é a demolição escolhida antes da forçada.

```
A tall tower of stacked stone and layered paper splits open along its length, struck by a
single clean bolt of gold light. The figure stands at a distance with her back to us,
perfectly still, watching it come down — not fleeing, not reaching to save it. The falling
stones become seeds and acorns as they descend, already sprouting where they land. A Mars
sigil is drawn faintly over the sky.
```

### XVII · A Estrela · Aquário
> Confiar no que ainda não tem prova. A travessia é apostar na direção com evidência parcial.

```
The figure pours water from a vessel onto visibly dry cracked earth, under a great
seven-pointed star. Above her a constellation is only half-drawn: some stars connected by
gold lines, the rest still loose points waiting. The horizon holds the pale blue of the hour
before sunrise — light is coming but has not arrived. Nothing has bloomed yet. She pours
anyway.
```

### XVIII · A Lua · Peixes
> Atravessar o trecho sem visibilidade. A travessia é seguir no escuro sem desistir.

```
A narrow path runs between two dark towers and dissolves into heavy mist a short distance
ahead — the way forward is genuinely not visible. A veiled moon gives almost no light. The
figure walks into the mist. Behind her, gold footprints glow on the path she has already
crossed, appearing only after each step. Two fish swim in the water at the path's edge. A
scarab engraving sits low in the margin.
```

### XIX · O Sol · Sol
> Mostrar-se inteiro. A travessia é a exposição do que já está pronto.

```
The figure steps through a gap in a high garden wall into open, unshaded daylight. Behind
the wall, the enclosed garden is full and finished — everything already grown. Before her,
nothing but light and a long, sharply defined shadow. A great sun fills the upper
composition without haze. Sunflowers turn toward the opening. Nothing remains covered.
```

### XX · O Éon · Fogo
> Julgar-se por outro critério. A travessia é adotar o próprio padrão de sucesso.

```
The figure snaps a rigid inherited measuring rule across her knee; its broken halves fall
away as brittle engraving. With her free hand she draws a new line in gold, freehand,
curving where the old rule was straight. A child stands wrapped in calm flame at the center
of a rising spiral. A trumpet engraving lies discarded in the lower margin, no longer needed.
```

### XXI · O Universo · Saturno
> Fechar o ciclo e entregar. A travessia é terminar.

```
A great oval wreath of botanical growth closes upon itself, the two ends meeting exactly.
The figure stands within the completed circle taking the final step of a spiral path drawn
in gold across the floor — the last stitch, the last stone. Saturn with its ring floats
above. A finished mandala of concentric geometry fills the ground beneath her. Nothing is
left open, nothing waits.
```

---

## Nomes de arquivo

O slug é derivado do nome do arcano em `ARCANOS` — mesma normalização que `build-artes.mjs`
aplica (sem acento, minúsculo, hífen). Salve os PNG em `originais/zona-genialidade/`:

| # | Arcano | Arquivo |
|---|--------|---------|
| 0 | O Louco | `arcano-o-louco.png` |
| I | O Magus | `arcano-o-magus.png` |
| II | A Sacerdotisa | `arcano-a-sacerdotisa.png` |
| III | A Imperatriz | `arcano-a-imperatriz.png` |
| IV | O Imperador | `arcano-o-imperador.png` |
| V | O Hierofante | `arcano-o-hierofante.png` |
| VI | Os Amantes | `arcano-os-amantes.png` |
| VII | O Carro | `arcano-o-carro.png` |
| VIII | Ajuste | `arcano-ajuste.png` |
| IX | O Eremita | `arcano-o-eremita.png` |
| X | A Fortuna | `arcano-a-fortuna.png` |
| XI | Luxúria | `arcano-luxuria.png` |
| XII | O Enforcado | `arcano-o-enforcado.png` |
| XIII | A Morte | `arcano-a-morte.png` |
| XIV | A Arte | `arcano-a-arte.png` |
| XV | O Diabo | `arcano-o-diabo.png` |
| XVI | A Torre | `arcano-a-torre.png` |
| XVII | A Estrela | `arcano-a-estrela.png` |
| XVIII | A Lua | `arcano-a-lua.png` |
| XIX | O Sol | `arcano-o-sol.png` |
| XX | O Éon | `arcano-o-eon.png` |
| XXI | O Universo | `arcano-o-universo.png` |

## O que ainda falta no código

Gerar as imagens não as coloca na tela. Depois que os PNG existirem, o card precisa de três
mudanças, nenhuma delas feita ainda:

1. `ARCANOS` ganha um campo `img` com o slug, para o render não ter que reconstruir o nome
   do arquivo a partir do nome do arcano em tempo de execução.
2. `S('card-carta', ...)` passa a montar um `<img>` com `srcset` apontando para
   `zona/arte/<slug>.webp` e `<slug>-sm.webp`.
3. `buildExportHTML()` precisa decidir o que fazer com a imagem no arquivo baixado — o HTML
   exportado hoje é autocontido, e um `<img>` relativo apontaria para o nada. Ou embute em
   base64, ou o download perde a carta.
