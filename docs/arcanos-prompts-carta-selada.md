# Prompts das 22 cartas — direção B, emblema selado

Segunda direção visual para a arte dos arcanos. A primeira, em `arcanos-prompts.md`, imita as
colagens de `originais/zona-genialidade/`: cena ilustrada, aquarela, figura de costas. Esta
segue o design da própria página — os tokens de `originais/zona-de-genialidade.html` — e leva a
assinatura da marca no rodapé.

As duas são alternativas, não etapas. Escolha uma para produção: os nomes de arquivo finais são
idênticos nos dois documentos, porque só um conjunto vai ao ar.

## De onde vem esta direção

De dois lugares, e os dois já existem no repositório.

O primeiro é a paleta da página, definida em `originais/zona-de-genialidade.html`: papel
`#F4F0E7` como fundo predominante, petróleo `#002F3B` como tinta de maior contraste, âmbar
`#F3B867` e terracota `#B85F3F` como cor de voz. A página é clara, arejada e de traço fino. Uma
carta de fundo escuro seria um bloco pesado no meio dela.

O segundo é o símbolo da logo. `jaya-logo-símbolo-bege.png` é botânica reduzida a linha de
espessura única: pétalas pontudas, volutas que se enrolam, simetria perfeita em torno de um eixo
vertical. Isso é uma gramática completa — dá para desenhar 22 emblemas dentro dela sem repetir
nenhum, e todos vão parecer parentes da marca sem precisar de selo para provar.

A vantagem sobre a direção A não é estética, é de consistência. Cena ilustrada depende de o
modelo acertar composição, luz e figura humana 22 vezes seguidas. Emblema em linha sobre fundo
chapado erra muito menos, e o que erra é fácil de descartar.

## Sobre a assinatura e os direitos

A logo **não vai no prompt**. Modelo de imagem não reproduz marca: devolve algo parecido, com as
volutas erradas, e diferente em cada uma das 22. A assinatura entra depois, composta por
`scripts/assinar-arcanos.mjs`, que sobrepõe o PNG real sempre na mesma posição e no mesmo
tamanho. Por isso a BASE reserva margem limpa no rodapé e o NEGATIVE proíbe explicitamente que o
modelo desenhe qualquer logo.

Sobre fundo claro, a logo entra **tintada em petróleo**. Os arquivos em
`originais/zona-genialidade/` são bege, feitos para fundo escuro; bege sobre papel creme
desaparece. O script faz a tintura a partir do alpha do PNG, sem precisar de um novo arquivo de
logo.

Vale separar duas coisas que costumam ser confundidas. O selo é **marca**: carimba origem,
dificulta reuso silencioso, e quem printar a carta leva a identidade junto. Isso tem valor
concreto e é motivo suficiente para aplicá-lo. Mas selo não converte a imagem em obra protegida
— a Lei 9.610/98 protege criação do espírito humano, e arte gerada por modelo tem proteção
incerta no Brasil, com ou sem logo por cima.

O que é inequivocamente autoral aqui é outra camada, e é a que sustenta o produto: a curadoria
dos 22 eixos, o recorte que transforma cada arcano numa travessia de negócio, a regra que
governa o texto que o modelo escreve, e a página inteira. Nada disso depende da imagem.

## Proporção e fluxo

Gere em **1024 × 1536** (2:3). Salve os brutos, sem selo, em `originais/arcanos-brutos/`, com o
nome da tabela no fim deste arquivo. Depois:

```bash
node scripts/assinar-arcanos.mjs   # aplica a logo → originais/zona-genialidade/arcano-*.png
npm run artes                      # converte para public/zona/arte/*.webp e -sm
```

Manter o bruto separado do assinado é o que permite mudar a posição, o tamanho ou a cor da
assinatura sem gerar imagem nova.

---

## BASE

```
Ornamental emblem plate printed on aged cream paper (#F4F0E7) with visible paper tooth and
soft foxing at the edges. Single-weight fine line drawing in deep petrol blue (#002F3B),
with sparing accents in amber gold (#F3B867) and terracotta (#B85F3F). Engraved like an
alchemical bookplate: slender stems, pointed petal forms, curling volutes and tendrils,
strict bilateral symmetry about a central vertical axis. Sparse and precise — large areas
of untouched cream paper, outline only, no shading, no fill, no gradient, no texture inside
shapes. Faint concentric circles and celestial geometry as a pale underlay. Art nouveau
restraint crossed with an old astronomical chart. Vertical 2:3 composition, generous
negative space. Wide empty margin along the bottom edge, deliberately clear. Quiet,
elegant, emblematic.
```

## NEGATIVE

```
no text, no lettering, no numerals, no roman numerals, no captions, no logo, no monogram,
no watermark, no signature, no emblem in the bottom margin, no decorative border frame,
no photorealism, no 3D render, no shading, no gradients, no painterly texture, no visible
face, no dark background, no saturated color, no colors outside cream petrol amber and
terracotta, no fantasy kitsch, no tarot card layout
```

A proibição de logo e de qualquer emblema no rodapé é o que mantém aquele espaço livre para a
assinatura real.

---

## As 22 cenas

### 0 · O Louco · Ar
> Começar sem currículo. A travessia é dar o primeiro passo sem a garantia.

```
A single slender stem grows to the edge of a ruled line that simply stops, unfinished, and
one small pointed leaf extends past the break into empty paper. Below, an open spiral of
wind uncoils. A lone feather rises in terracotta. This is the only asymmetric plate in the
set: the axis is implied and deliberately broken.
```

### I · O Magus · Mercúrio
> Nomear o que faz. A travessia é converter habilidade em oferta dita em voz alta.

```
A caduceus at the center, its two serpents drawn as symmetrical volutes climbing a straight
stem. Four small emblems mark the cardinal points: blade, cup, coin, wand. From the base a
ribbon unfurls in a widening spiral toward the upper edge, narrow where it starts and open
where it ends, its outer turn picked out in amber.
```

### II · A Sacerdotisa · Lua
> Escutar antes de produzir. A travessia é suportar o não-saber até o material próprio aparecer.

```
Two slender columns of stem rise on either side. Between them a veil rendered as very fine
horizontal rules, dense enough to obscure what lies behind. A waxing crescent crowns the
axis. At the base, a loom drawn as vertical warp threads with nothing woven across them.
```

### III · A Imperatriz · Vênus
> Deixar crescer o que já foi plantado. A travessia é nutrir uma coisa só até dar fruto.

```
One heavy open flower at the center, fully drawn, petals weighted and complete. Around it,
six closed buds rendered only in faint dotted outline, unfinished. The Venus spiral traced
palely behind. A split pomegranate at the root, its seeds as small terracotta circles.
```

### IV · O Imperador · Áries
> Assumir a autoridade que já exerce. A travessia é ocupar a cadeira.

```
An empty seat reduced to pure geometry — straight lines, right angles, no ornament — set on
three shallow steps at the center. Above it, ram's horns drawn as two mirrored volutes. A
set square and a plumb line hang at either side, precise and already used.
```

### V · O Hierofante · Touro
> Ensinar o que já sabe. A travessia é virar prática em doutrina transmissível.

```
An open book at the center, its pages fanning upward and resolving into stylized birds as
they rise. Below, a semicircle of small empty arches, like vacant seats. A single key hangs
on a thread along the central axis, level with the book, unclaimed.
```

### VI · Os Amantes · Gêmeos
> Escolher entre dois caminhos igualmente possíveis. A travessia é a escolha que fecha uma.

```
Two identical stems part from one node at the base and diverge in perfect mirror. The left
opens into flower; the right stays in bud. Behind them, two mirrored arched doorways: one
drawn as open outline, the other filled solid petrol blue, closed.
```

### VII · O Carro · Câncer
> Avançar carregando a própria casa. A travessia é mover-se com o peso que já tem.

```
A spiraled nautilus shell at the center, drawn as a clean logarithmic curve, carried between
two wheels whose spokes are tangled roots. Beneath, a stepped path climbing toward the upper
edge. Two crab claws form mirrored volutes at the base.
```

### VIII · Ajuste · Libra
> Corrigir o preço, o prazo, a troca. A travessia é reequilibrar sem pedir licença.

```
A balance beam clearly off-level, one pan low and heaped, the other high and empty. The
fulcrum itself is drawn displaced from center — the correction is being made to the pivot,
not the pans. A vertical sword forms the central axis. A diamond of fine lines radiates from
the pivot in amber.
```

### IX · O Eremita · Virgem
> Recolher-se para lapidar. A travessia é o período fechado que produz a coisa boa.

```
A lantern at the center, and inside it, in place of a flame, a single seed in amber. One
unbroken circle encloses the lantern completely, with no gap. Wheat sheaves arch
symmetrically from the base. An intact egg rests on the axis below.
```

### X · A Fortuna · Júpiter
> Aceitar o ciclo em vez de forçar a linha reta. A travessia é jogar mais rodadas.

```
A great wheel of concentric rings and radiating spokes fills the plate, small marks
distributed unevenly around its rim. A die rests at the base, mid-tumble. A spiral coils
through the rings. Along the lower margin, one perfectly straight ruled line stops short,
unfinished.
```

### XI · Luxúria · Leão
> Querer em público. A travessia é sustentar o apetite sem disfarce.

```
A lion's head face-on at the center, its mane drawn entirely as symmetrical volutes and
pointed petal forms. Below, a cup overflowing, the spill rendered as clean parallel lines. A
radiant sun crowns the axis in amber, every ray fully extended, nothing veiled or shortened.
```

### XII · O Enforcado · Água
> Inverter a posição. A travessia é a rendição que muda o ângulo.

```
The plate is mirrored across a horizontal waterline at mid-height. The upper half is drawn
inverted and tangled; the lower half is the same composition, upright and resolved. A single
thread descends along the axis. An ankh and one branch rest at the waterline.
```

### XIII · A Morte · Escorpião
> Encerrar o que ainda funciona mal. A travessia é o corte.

```
A scythe blade cuts cleanly across a stem that still carries full leaves — the plant is
alive, and cut regardless. Above the cut, loose petals fall. Below it, new shoots break
upward in the same motion. A scorpion forms a symmetrical arch at the base, tail curled into
a voluta.
```

### XIV · A Arte · Sagitário
> Fundir os dois lados que parecem incompatíveis. A travessia é a liga.

```
Two vessels at the upper corners pour simultaneously into a single wide vessel at the
center; where the two streams meet, the line turns amber. A drawn bow arcs across the upper
edge. At the base, a lion and an eagle rendered as one symmetrical body sharing a single
spine.
```

### XV · O Diabo · Capricórnio
> Olhar para o que prende. A travessia é nomear a corrente.

```
A chain of oval links hangs in a slack arc across the plate — visibly loose, not taut. One
link at the center is drawn open, its gap wide and unmistakable, picked out in terracotta.
Below, goat's horns curl into volutes and end in a fish's tail. Roots at the base interlace
into a lattice that reads as bars.
```

### XVI · A Torre · Marte
> Derrubar a estrutura que já não sustenta. A travessia é a demolição escolhida antes da forçada.

```
A tall narrow tower on the central axis, split open along its full height by a single zigzag
bolt in amber. The falling blocks are drawn as seeds, each already sprouting a small paired
leaf where it lands. The base of the tower stays rooted and intact.
```

### XVII · A Estrela · Aquário
> Confiar no que ainda não tem prova. A travessia é apostar na direção com evidência parcial.

```
A seven-pointed star crowns the axis. Below it a constellation is only half drawn — some
points joined by fine lines, the rest left as loose unconnected dots. A vessel pours a thin
stream onto ground rendered as cracked lines. Nothing has sprouted yet.
```

### XVIII · A Lua · Peixes
> Atravessar o trecho sem visibilidade. A travessia é seguir no escuro sem desistir.

```
Two towers flank a narrow path that runs up the central axis and dissolves into dotted line,
then into blank paper, before reaching the top. A veiled crescent above, half its outline
missing. Two fish mirror each other at the base, curled into a closed circle.
```

### XIX · O Sol · Sol
> Mostrar-se inteiro. A travessia é a exposição do que já está pronto.

```
A full radiant sun at the center in amber, every ray drawn to its full length. Below, a low
wall in shallow arc with one clear opening on the axis. Sunflowers on tall stems turn
symmetrically toward the opening. Nothing overlaps the sun, nothing is cropped.
```

### XX · O Éon · Fogo
> Julgar-se por outro critério. A travessia é adotar o próprio padrão de sucesso.

```
A rigid graduated ruler lies broken in two across the lower plate, its measurement marks
still visible on both halves. From the break, a new spiral rises freehand along the axis,
curving where the ruler was straight. At the center, an egg enclosed in stylized flame drawn
as pointed petal forms in terracotta.
```

### XXI · O Universo · Saturno
> Fechar o ciclo e entregar. A travessia é terminar.

```
An oval wreath of leaves closes on itself, the two ends meeting exactly on the axis with no
gap. Inside, a single spiral completes its full turn and returns to its own origin. Saturn
with its ring floats at the crown. A concentric mandala of fine geometry fills the ground
within the wreath.
```

---

## Nomes de arquivo

Salve os **brutos, sem selo**, em `originais/arcanos-brutos/`. O script de assinatura grava a
versão selada em `originais/zona-genialidade/` com o mesmo nome, e é de lá que `npm run artes`
converte.

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
