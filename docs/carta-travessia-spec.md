# Carta de Travessia — spec de seleção · 1.1

Especificação da escolha do arcano. Substitui o critério atual, em que o modelo recebe os 22
numa lista e pondera texto livre contra ela — arranjo que concentra as escolhas e não deixa
rastro de por quê.

Documento congelado. Nada aqui está implementado; o JSON machine-readable é a próxima etapa e
deve ser tradução literal deste texto, sem decidir nada novo.

## Decisões fechadas

| Decisão | Estado |
|---|---|
| Finalistas | Top 4 + no máximo 1 wildcard textual |
| Perguntas 44 e 45 | Entram no assessment |
| Bloco D | Microbloco de arbitragem, modelo mais barato quando possível |
| Fallback dos 22 embaralhados | Eliminado |
| Score | Normalizado 0–10 |
| 85/15 aritmético | Substituído por hierarquia de evidência |
| Famílias de evidência | Obrigatórias em todo sinal |
| Vetos | Só contradição direta da função prescrita ou pré-requisito ausente |
| Piso de entrada no Top 4 | Duas famílias de evidência distintas |
| A Lua até a pergunta 44 existir | Só por wildcard |

## O princípio que governa tudo

> **Os sinais de um arcano não são características do arcano. São sintomas da ausência da
> função psicológica que ele simboliza.**

A carta é **prescritiva**. Não nomeia o que a pessoa já manifesta com força; nomeia a
capacidade que falta incorporar para atravessar o gap dos próximos 90 dias.

```
estado atual → tensão/gap → recurso necessário → arcano
```

E nunca:

```
estado atual → arcano parecido com a pessoa
```

A consequência prática inverte a intuição em vários casos. Quick Start alto **não** puxa O
Louco: afasta. Quem começa com facilidade não precisa da função "começar" — precisa, quase
sempre, da função oposta, que é O Universo. Do mesmo modo, intuição alta afasta A
Sacerdotisa, e tolerância a risco afasta A Estrela.

Essa é também a fronteira que separa as três camadas do produto e impede que uma repita a
outra com outras palavras:

| Camada | Responde |
|---|---|
| Zona de Genialidade | quem a pessoa é quando opera no seu melhor |
| Plano de 90 dias | o que fazer concretamente |
| **Carta de Travessia** | **o que precisa ser incorporado para conseguir executar o plano** |

## Pipeline

O scoring não pode rodar antes da IA: metade dos sinais nasce da própria análise. Roda entre
os blocos, sobre o que já foi apurado.

```
Bloco A  ──▶ perfil, zonas, talentos, kolbe
Bloco B  ──▶ oferta, wealthProfile, uniqueAbility, hormozi
Bloco C  ──▶ convergência, timeDistribution, recommendation, actionPlan, primary_gap

   │  (código local, sem IA)
   ▼
pontuarArcanos()
   avalia sinais · aplica famílias · aplica contra-sinais e vetos
   normaliza 0–10 · exige duas famílias · monta top 4 + evidências

   ▼
Bloco D  ──▶ arbitra entre os finalistas (saída estruturada curta)
```

A carta migra do bloco C para um bloco D próprio. O motivo é conceitual antes de técnico:
`convergence` e `timeDistribution` são o diagnóstico dos 90 dias, e escolher a carta dentro do
mesmo bloco que os produz cria escolha prematura ou circular.

O bloco D recebe apenas:

- os 4 finalistas com score, evidências e contra-sinais
- `vision_bloqueio`
- `primary_gap` e `transicao_central` do bloco C
- a instrução de arbitrar e justificar

Não recebe as 45 respostas nem o dashboard. Isso também o torna barreira contra alucinação:
ele não pode inventar um arcano fora da lista porque não tem a lista inteira.

## Hierarquia de evidência

Substitui a fórmula `0.85E + 0.15T`, que exigiria alguém calcular a aderência textual de cada
carta — e esse alguém seria o modelo, introduzindo score subjetivo antes da arbitragem.

| Camada | Papel |
|---|---|
| **Estruturado** | Monta o Top 4. Única fonte de score. |
| **Narrativa** | Só duas funções: desempatar candidatos com diferença ≤ 0,5 e introduzir **um** wildcard se apontar fortemente para um arcano fora do Top 4. |

O texto livre nunca altera o ranking base. "85/15" pode permanecer como explicação conceitual
do produto, mas não existe no algoritmo.

`kolbe.seguimento = 3` é evidência estruturada, ainda que tenha nascido de IA. O que define a
camada não é a origem do dado, é a forma: valor comparável contra texto interpretável.

## Mecânica de pontuação

### Pesos brutos

| Elemento | Valor |
|---|---|
| Sinal primário | +3 |
| Sinal secundário | +1 |
| Contra-sinal | −2 |
| Veto | zera a carta |

### Famílias de evidência

Todo sinal declara uma `familia_evidencia`. A regra:

```
primeira evidência da família        → peso integral
segunda fonte independente           → +0,5 de corroboração
demais evidências da mesma família   → ignoradas
```

Existe porque A, B e C **não são observadores independentes**: recebem partes da mesma
história. `actionPlan.doNot` mandar concluir provavelmente é consequência de o bloco A ter
encontrado `kolbe.seguimento` baixo. Sem esse controle, um fenômeno único contaria três vezes.

As oito famílias, derivadas das fichas:

| Família | Fenômeno |
|---|---|
| `fechamento` | capacidade de concluir ciclos |
| `iniciacao` | capacidade de começar sem garantia |
| `foco` | concentração versus dispersão |
| `precificacao` | equivalência da troca e permissão de querer |
| `visibilidade` | ser visto, nomear-se, ofertar |
| `vinculo` | o que prende e o que sustenta |
| `direcao` | clareza de caminho e escolha entre rotas |
| `integracao` | duas coisas: encerrar, escolher ou fundir |

### Normalização

```
score = (pontos_positivos − penalidades) / máximo_positivo_possível_da_carta × 10
```

Divide-se pelo máximo da própria carta para que cartas com mais sinais catalogados não vençam
por volume. Todas ficam comparáveis em escala 0–10.

### Piso de duas famílias

> **Nenhuma carta entra no Top 4 com evidência de uma única família.**

Esta regra resolve dois problemas de uma vez.

O primeiro é o efeito colateral da normalização: uma carta com um único sinal primário
catalogado atinge 10,0 ao encontrá-lo, e venceria cartas com quatro evidências independentes.
Com o piso, ela fica em 10,0 e não entra — falta a segunda família.

O segundo é a pergunta 44, que sozinha discrimina A Lua, Os Amantes, A Estrela e O Carro. Uma
resposta única decidindo entre quatro cartas recriaria o problema que esta spec existe para
resolver, só que determinístico em vez de eloquente. Com o piso, Os Amantes ainda precisam do
conflito real entre modelos, O Carro ainda precisa da condição externa declarada, A Estrela
ainda precisa da aversão a risco.

Empate ≤ 0,5 ponto vai ao bloco D para desempate.

### Fallback

Os 22 embaralhados foram eliminados. Mandar o baralho inteiro exatamente quando o sistema diz
"não tenho evidência" é o oposto de auditabilidade.

```
nenhum score acima do limiar mínimo (1,5)
↓
selection_mode = "low_evidence"
↓
D recebe primary_gap + transicao_central + roadmap
↓
D pode escolher a carta
↓
confidence = "baixa" (obrigatório)
selection_basis = "diagnostic_fallback"
```

O sistema não finge ter resolvido o que não resolveu.

## Vetos

Duas classes, e o JSON precisa distingui-las — senão uma revisão futura da regra de ouro
derruba vetos que estavam certos por outro motivo.

**`veto_funcao_presente`** — a evidência comprova a presença da própria função prescrita.
`kolbe.inicioRapido ≥ 8` veta O Louco porque prova que a pessoa já começa.

**`veto_pre_requisito`** — não existe o objeto de que a carta trata.
`talent_competencia_genialidade = "Não"` veta A Morte não porque a pessoa saiba encerrar, mas
porque não há nada a encerrar. Idem `ctx_sem_dinheiro` coincidindo com `ctx_oque_faz` no Aeon,
e trajetória única na Arte.

Tudo o que apenas torna a carta menos provável é contra-sinal, não veto:

| Situação | Antes | Agora |
|---|---|---|
| Hierofante já vende conhecimento | veto | **−2** — vender não prova doutrina transmissível |
| Luxúria cobra premium | veto | **−2** — pode cobrar bem e seguir contida |
| Sol tem talento para falar em público | contra-sinal | **−2** — ser bom palestrante não é aparecer |
| Torre com menos de 3 anos de área | veto | **removido** |
| Universo com menos de 1 ano | veto | **removido** |
| Carro com 40h+ semanais | veto | **−2** — é o sinal primário do Enforcado |
| Enforcado com ≤10h semanais | veto | **−2** — é o sinal primário do Carro |

Os dois últimos são pares opostos: o contra-sinal de um é o sinal do outro, e o par já se
resolve sozinho — quem perde 2 pontos de um lado ganha 3 do outro.

## Perguntas 44 e 45

### 44 · `clarity_next_step`

> Pensando nos próximos 30 dias, qual frase descreve melhor sua situação?

| Resposta | Valor |
|---|---|
| Não sei nem qual direção seguir | 0 |
| Tenho algumas possibilidades, mas não sei qual escolher | 2 |
| Sei a direção, mas ainda não sei qual é o próximo passo concreto | 4 |
| Sei qual é o próximo passo, mas ainda não defini quando ou como executá-lo | 7 |
| Sei exatamente o próximo passo, quando vou executá-lo e o que contará como concluído | 10 |

Não pergunta "quão claro está seu próximo passo?" porque as pessoas superestimam clareza. A
escala descreve estados verificáveis.

Discrimina A Lua (0), Os Amantes (2), A Estrela (4) e O Carro (7). Sempre como sinal primário,
**nunca como veto** para essas quatro, e sempre sujeita ao piso de duas famílias.

### 45 · `initiative_stage`

> Pensando apenas nos projetos que você considera ativos hoje, qual cenário mais se aproxima
> da realidade?

| Resposta | Código |
|---|---|
| Não tenho nenhum projeto realmente iniciado | `none_started` |
| Tenho uma frente principal em andamento | `one_active` |
| Tenho várias frentes, mas a maioria ainda está no começo | `many_early` |
| Tenho 2 ou mais frentes que já passaram da metade, mas ainda não concluí | `many_mid_late` |
| Tenho pelo menos uma frente praticamente pronta que continuo adiando finalizar | `near_done_abandoned` |

Fecha o par O Louco ↔ O Universo, que era o sinal mais forte do sistema e o único sem campo
próprio. `none_started` favorece O Louco; `near_done_abandoned` favorece O Universo. Também
separa A Imperatriz (`many_early`) de O Eremita e de O Universo (`many_mid_late`).

## Saída auditável

```
Carta: XXI O Universo
Score determinístico: 8.4
Segundo colocado: IX O Eremita (6.9)
Evidências decisivas:
  - kolbe.seguimento ≤ 4                             (família: fechamento)
  - initiative_stage = near_done_abandoned           (família: fechamento, corroboração +0.5)
  - energy_multitask = muitas coisas ao mesmo tempo  (família: foco)
Evidência textual: "..."
Confiança: alta
selection_basis: "scored" | "wildcard" | "diagnostic_fallback"
```

| Confiança | Condição |
|---|---|
| alta | margem > 1,5 |
| média | margem entre 0,5 e 1,5 |
| baixa | margem < 0,5, ou wildcard, ou `diagnostic_fallback` |

---

# As 22 fichas

Cada ficha tem sete componentes. Os campos citados existem hoje, exceto `clarity_next_step` e
`initiative_stage`, que entram com as perguntas 44 e 45. `answers.*` são as perguntas do
assessment; `kolbe.*`, `zones.*`, `talents.*` vêm do bloco A; `wealthProfile`, `uniqueAbility`,
`hormozi` do bloco B; `convergence`, `timeDistribution`, `actionPlan` do bloco C.

---

## 0 · O Louco · Ar

**Função prescrita** — iniciar sem garantia.
**Estado de carência** — tem tudo mapeado e nada iniciado. Reduz incerteza indefinidamente em
vez de testar.

**Sinais primários**
- `initiative_stage` = `none_started` — família `iniciacao`
- `energy_inicio` = "Pesquisar bastante antes de dar o primeiro passo" — família `iniciacao`
- `kolbe.inicioRapido` ≤ 4 — família `iniciacao`

**Sinais secundários**
- `talent_aprendizado` = "Lê tudo sobre o assunto antes de começar" — família `iniciacao`
- `biz_risco` = "Evito ao máximo" — família `vinculo`
- `vision_90dias` descreve preparo, não entrega — família `direcao`

**Contra-sinais**
- `kolbe.inicioRapido` ≥ 8 — **veto_funcao_presente**
- `energy_inicio` = "Começar a executar logo e ajustar no caminho" — **veto_funcao_presente**
- `biz_timing` = "Ser o PRIMEIRO em algo novo" — −2

**Pares** — ↔ **XXI O Universo** (não conseguir começar ↔ não conseguir terminar). Polos do
mesmo eixo; nunca devem pontuar juntos. Se ambos pontuarem, há erro de sinal.

**Eixo exibido** — *Começar sem currículo. Serve a quem tem tudo mapeado e nada iniciado; a
travessia é dar o primeiro passo sem a garantia.*

---

## I · O Mago · Mercúrio

**Função prescrita** — nomear e ofertar o que já sabe fazer.
**Estado de carência** — capacidade real, nenhuma frase que a venda.

**Sinais primários**
- `energy_drena` contém "Vender e prospectar clientes" — família `visibilidade`
- `wealthProfile.name` ∈ {Apoiador, Mecânico} — família `visibilidade`

**Sinais secundários**
- `talent_natural` ∉ {"Falar em público", "Escrever textos claros e persuasivos"} — `visibilidade`
- `uniqueAbility.alignment` alto com `timeInZone` baixo — família `foco`
- `biz_receita` = "Vender serviços especializados" com `biz_preco` inseguro — `precificacao`

**Contra-sinais**
- `wealthProfile.name` = Estrela — **veto_funcao_presente**
- `talent_dominio` = "INFLUENCIADOR" — −2
- `energy_carrega` contém "Negociar e fechar acordos" — −2

**Pares** — ↔ **II A Sacerdotisa** (manifestar ↔ escutar). Desempate: falta *palavra para o
que faz* (Mago) ou *falar antes de ter o que dizer* (Sacerdotisa)? Confunde-se com
**V O Hierofante**: Mago nomeia a própria oferta; Hierofante transmite método a terceiros.

**Eixo exibido** — mantido.

---

## II · A Sacerdotisa · Lua

**Função prescrita** — escutar antes de produzir; suportar o não-saber.
**Estado de carência** — responde rápido demais; produz resposta antes de ter percepção.

**Sinais primários**
- `energy_inicio` = "Começar a executar logo e ajustar no caminho" — família `iniciacao`
- `kolbe.inicioRapido` ≥ 8 **com** `kolbe.investigador` ≤ 4 — família `iniciacao`
- `energy_problemas` = "Agir rápido com a melhor opção disponível" — família `direcao`

**Sinais secundários**
- `energy_detalhe` = "Entrega rápido e itera" — família `iniciacao`
- `ctx_estrutura_flex` = "Flexibilidade total" — família `foco`
- `ctx_analitico_intuitivo` = "Intuitivo — decido rápido pelo instinto" — família `direcao`

**Contra-sinais**
- `energy_inicio` = "Pesquisar bastante antes de dar o primeiro passo" — **veto_funcao_presente**
- `kolbe.investigador` ≥ 8 — −2
- `talent_aprendizado` = "Lê tudo sobre o assunto antes de começar" — −2

**Pares** — ↔ **I O Mago**. Compete com **IX O Eremita**: Sacerdotisa é *silêncio para ouvir*,
Eremita é *silêncio para lapidar*. Desempate: falta escuta ou falta foco?

**Eixo exibido** — mantido.

> `inicioRapido` alto **junto de** `investigador` baixo é o que separa ação impulsiva de ação
> informada. Sozinho, "executa rápido" descreveria também quem já escuta e decide bem.

---

## III · A Imperatriz · Vênus

**Função prescrita** — nutrir uma coisa só até dar fruto.
**Estado de carência** — recomeça toda semana; planta muito e colhe pouco.

**Sinais primários**
- `initiative_stage` = `many_early` — família `fechamento`
- `wealthProfile.name` = Criador — família `iniciacao`
- `energy_inovacao_otimizacao` = "Criar algo do ZERO" — família `iniciacao`

**Sinais secundários**
- `energy_multitask` = "Gerenciando muitas coisas ao mesmo tempo" — família `foco`
- `talents` inclui ideação alta — família `iniciacao`
- `biz_timing` = "Ser o PRIMEIRO em algo novo" — família `iniciacao`

**Contra-sinais**
- `energy_inovacao_otimizacao` = "Escalar algo que já funciona" — **veto_funcao_presente**
- `energy_multitask` = "Fazendo uma coisa só com foco total" — −2

**Pares** — ↔ **IV O Imperador** (gerar/expandir ↔ estruturar/limitar). Confunde-se com
**XXI O Universo**, e `initiative_stage` resolve: `many_early` é Imperatriz; `many_mid_late`
ou `near_done_abandoned` é Universo.

**Eixo exibido** — mantido.

---

## IV · O Imperador · Áries

**Função prescrita** — assumir a autoridade que já exerce.
**Estado de carência** — decide por todos e carrega a responsabilidade, mas age como quem
ainda precisa de permissão.

**Sinais primários**
- `energy_delegacao` = "Tenho muita dificuldade — prefiro fazer eu mesmo" — família `vinculo`
- `talent_dominio` = "EXECUTOR" **com** `biz_solo_time` liderando time — família `visibilidade`

**Sinais secundários**
- `talent_frustracao` = "Microgerenciamento e falta de autonomia" — família `vinculo`
- `wealthProfile.name` = Apoiador **com** `vision_receita` alta — família `visibilidade`
- `ctx_experiencia` > 5 anos — família `visibilidade`

**Contra-sinais**
- `energy_delegacao` = "Adoro delegar" — **veto_funcao_presente**
- `wealthProfile.name` = Estrela — −2

**Pares** — ↔ **III A Imperatriz**. Confunde-se com **VII O Carro**: Imperador não assume a
direção; Carro assume mas espera condições melhores para andar.

**Eixo exibido** — mantido.

---

## V · O Hierofante · Touro

**Função prescrita** — converter prática em doutrina transmissível.
**Estado de carência** — acumula método e não transmite.

**Sinais primários**
- `energy_carrega` contém "Ensinar e mentorar pessoas" — família `visibilidade`
- `ctx_experiencia` > 5 anos **com** `biz_receita` ≠ "Vender conhecimento" — família `integracao`

**Sinais secundários**
- `talent_contribuicao` = "Ensinar e capacitar pessoas" — família `visibilidade`
- `energy_agradecem` = "Explicar algo complexo de forma simples" — família `visibilidade`

**Contra-sinais**
- `biz_receita` = "Vender conhecimento (cursos, livros, palestras, mentoria)" — −2
- `ctx_experiencia` < 3 anos — −2

**Pares** — confunde-se com **I O Mago** (nomear a oferta ↔ transmitir método) e com
**XIX O Sol** (transmitir ↔ aparecer).

**Eixo exibido** — mantido.

> Vender conhecimento deixou de vetar: quem vende um curso não necessariamente converteu a
> própria prática em doutrina transmissível.

---

## VI · Os Amantes · Gêmeos

**Função prescrita** — escolher, fechando uma porta.
**Estado de carência** — mantém dois caminhos igualmente vivos e não decide.

**Sinais primários**
- `clarity_next_step` = 2 ("possibilidades, não sei qual escolher") — família `direcao`
- conflito real entre `biz_como_ganha` e `biz_receita` — família `integracao`

**Sinais secundários**
- `energy_multitask` = "Alternando entre 2-3 projetos no mesmo dia" — família `foco`
- `ctx_sem_dinheiro` aponta direção diferente de `ctx_oque_faz` — família `direcao`
- `ctx_estrutura_flex` = "Depende do projeto" — família `foco`

**Contra-sinais**
- `clarity_next_step` = 10 — **veto_funcao_presente**
- `energy_multitask` = "Fazendo uma coisa só com foco total" — −2

**Pares** — confunde-se com **IX O Eremita** (escolher entre duas ↔ concentrar entre muitas) e
com **XIV A Arte** (A **ou** B ↔ criar C com A **e** B). Desempate: as opções são
conciliáveis? Se sim, Arte; se mutuamente exclusivas, Amantes.

**Eixo exibido** — mantido.

---

## VII · O Carro · Câncer

**Função prescrita** — mover-se com o peso que já tem.
**Estado de carência** — sabe o passo e espera condições melhores para dá-lo.

**Sinais primários**
- `clarity_next_step` = 7 ("sei o passo, não defini quando") — família `direcao`
- `vision_bloqueio` cita falta de condição externa (tempo, dinheiro, equipe) — família `vinculo`

**Sinais secundários**
- `vision_tempo` ≤ 10h **com** `vision_receita` ≥ R$15k — família `vinculo`
- `hormozi.tempoEspera` alto — família `fechamento`
- `actionPlan.thisWeek` vazio ou só preparatório — família `fechamento`

**Contra-sinais**
- `vision_tempo` ≥ 40h — −2 (é o sinal primário do Enforcado)
- `energy_inicio` = "Começar a executar logo e ajustar" — −2

**Pares** — ↔ **XII O Enforcado** (mover com o peso ↔ parar de empurrar). Desempate: parada
esperando (Carro) ou empurrando sem sair do lugar (Enforcado)?

**Eixo exibido** — mantido.

---

## VIII · A Justiça · Libra

**Função prescrita** — reequilibrar a troca.
**Estado de carência** — entrega mais do que recebe e não corrige.

**Sinais primários**
- `biz_preco` = "Tenho dificuldade — sempre acho que deveria cobrar menos" — `precificacao`
- `hormozi.esforco` alto **com** `hormozi.resultadoSonhado` alto — família `fechamento`

**Sinais secundários**
- `biz_escala` = "Atender POUCOS clientes com MUITA profundidade" — família `precificacao`
- `energy_drena` contém "Negociação e confronto direto" — família `visibilidade`
- `talent_comunicacao` = "Diplomático e cuidadoso" — família `visibilidade`

**Contra-sinais**
- `biz_preco` = "Cobro premium" — **veto_funcao_presente**
- `energy_carrega` contém "Negociar e fechar acordos" — −2

**Pares** — ↔ **XI Força/Luxúria**, o desempate mais importante do sistema: o problema é
**equivalência de troca** (Justiça: cobra pouco pelo que entrega) ou **autorização da
potência** (Luxúria: quer pouco perto do que poderia querer)? Preço baixo com meta modesta é
Justiça; preço baixo com meta alta e contenção declarada é Luxúria.

**Eixo exibido** — mantido.

---

## IX · O Eremita · Virgem

**Função prescrita** — recolher-se e concentrar força numa frente.
**Estado de carência** — dispersa em oportunidades; ruído impede profundidade.

**Sinais primários**
- `energy_multitask` = "Gerenciando muitas coisas ao mesmo tempo" — família `foco`
- `zones.genialidade` baixa **com** `zones.competencia` alta — família `foco`

**Sinais secundários**
- `initiative_stage` = `many_early` — família `fechamento`
- `uniqueAbility.timeInZone` baixo — família `foco`
- `biz_timing` = "Ser o PRIMEIRO em algo novo" — família `iniciacao`

**Contra-sinais**
- `energy_multitask` = "Fazendo uma coisa só com foco total" — **veto_funcao_presente**
- `ctx_intro_extro` = "Extrovertido" com rede como gargalo declarado — −2

**Pares** — ↔ **XIX O Sol** (recolher ↔ expor). Confunde-se com **XXI O Universo**: Eremita é
*estratégia de foco*; Universo é *movimento de conclusão*. `initiative_stage` desempata.

**Eixo exibido** — mantido.

---

## X · A Fortuna · Júpiter

**Função prescrita** — aceitar o ciclo em vez de forçar a linha reta.
**Estado de carência** — lê variação como fracasso e muda o plano antes de o ciclo maturar.

**Sinais primários**
- `kolbe.seguimento` baixo **com** `kolbe.inicioRapido` alto — família `fechamento`
- `vision_bloqueio` cita resultado que não veio no prazo esperado — família `direcao`

**Sinais secundários**
- `talent_feedback` = "Fica incomodado mas usa como combustível" — família `direcao`
- `biz_timing` = "Entrar cedo mas com algo já validado" — família `iniciacao`
- `hormozi.probabilidade` baixa — família `fechamento`

**Contra-sinais**
- `kolbe.seguimento` alto — **veto_funcao_presente**
- `biz_risco` = "Amo risco" — −2

**Pares** — confunde-se com **XXI O Universo** (abandona por impaciência ↔ por atração pelo
novo) e com **XX O Aeon** (mudar o plano ↔ mudar a régua).

**Eixo exibido** — mantido.

---

## XI · Força/Luxúria · Leão

**Função prescrita** — autorizar-se a querer, em público e sem disfarce.
**Estado de carência** — encolhe o próprio desejo; pede desculpa pela ambição.

**Sinais primários**
- `vision_receita` ≥ R$50k **com** `biz_preco` inseguro — família `precificacao`
- `vision_bloqueio` com marcador de contenção (parecer ganancioso, "não é para mim") — `visibilidade`

**Sinais secundários**
- `ctx_intro_extro` introvertido **com** `vision_receita` alta — família `visibilidade`
- `energy_drena` contém "Vender e prospectar clientes" — família `visibilidade`
- `biz_escala` = "Não atender ninguém diretamente" — família `vinculo`

**Contra-sinais**
- `biz_preco` = "Cobro premium" — −2
- `vision_receita` = "Até R$5.000/mês" — −2
- `wealthProfile.name` = Estrela — −2

**Pares** — ↔ **VIII A Justiça** (ver lá). Compete com **XIX O Sol**: Luxúria é *permitir-se
querer*; Sol é *permitir-se ser visto*.

**Eixo exibido** — mantido.

> Cobrar premium deixou de vetar: pode-se cobrar R$5 mil, desejar construir R$5 milhões e
> seguir contida.

---

## XII · O Enforcado · Água

**Função prescrita** — inverter a posição; render-se para mudar o ângulo.
**Estado de carência** — tenta mais do mesmo com mais esforço.

**Sinais primários**
- `vision_tempo` ≥ 40h **com** `vision_receita` ≤ R$15k — família `vinculo`
- `hormozi.esforco` alto **com** `hormozi.probabilidade` baixa — família `fechamento`

**Sinais secundários**
- `energy_ritmo` = "Começo devagar e vou acelerando até o deadline" — família `fechamento`
- `zones.incompetencia` alta — família `foco`
- `talent_frustracao` = "Pessoas que não cumprem prazos" — família `vinculo`

**Contra-sinais**
- `vision_tempo` ≤ 10h — −2 (é o sinal primário do Carro)
- `energy_inovacao_otimizacao` = "Conectar coisas existentes de formas novas" — −2

**Pares** — ↔ **VII O Carro**. Confunde-se com **XVI A Torre**: Enforcado muda o ângulo, Torre
derruba a estrutura. Desempate: o método está errado ou a estrutura inteira está?

**Eixo exibido** — mantido.

---

## XIII · A Morte · Escorpião

**Função prescrita** — encerrar o que ainda funciona mal.
**Estado de carência** — carrega cliente, produto ou papel vencido.

**Sinais primários**
- `talent_competencia_genialidade.choice` = "Sim" **com** `detail` indicando desejo de largar — `integracao`
- `zones.excelencia` alta **com** `zones.genialidade` baixa — família `foco`

**Sinais secundários**
- `energy_drena` com 4 ou mais itens — família `vinculo`
- `ctx_sem_dinheiro` diverge de `ctx_oque_faz` — família `direcao`
- `actionPlan.doNot` cita manter algo — família `fechamento`

**Contra-sinais**
- `talent_competencia_genialidade.choice` = "Não" — **veto_pre_requisito**
- `zones.genialidade` ≥ 40 — −2

**Pares** — ↔ **XIV A Arte**: algo precisa **terminar** (Morte) ou duas partes precisam ser
**integradas** (Arte)? Compete com **XVI A Torre**: Morte encerra uma parte, Torre derruba o
todo.

**Eixo exibido** — mantido.

---

## XIV · A Arte · Sagitário

**Função prescrita** — fundir os dois lados numa terceira coisa.
**Estado de carência** — divide-se entre duas identidades e trata como escolha o que é
matéria-prima de integração.

**Sinais primários**
- `ctx_oque_faz` ou `ctx_area` evidencia duas trajetórias distintas — família `integracao`
- `uniqueAbility.description` cita combinação de campos **com** `timeInZone` baixo — `integracao`

**Sinais secundários**
- `energy_flow` aponta atividade de área diferente de `ctx_area` — família `direcao`
- `energy_inovacao_otimizacao` = "Conectar coisas existentes de formas novas" — `integracao`
- `convergence` com dois eixos altos e desconectados — família `foco`

**Contra-sinais**
- trajetória única e linear — **veto_pre_requisito**
- `uniqueAbility.timeInZone` alto — −2

**Pares** — ↔ **XIII A Morte** e ↔ **VI Os Amantes**. O trio cobre três respostas à mesma
situação de "duas coisas": encerrar uma, escolher uma, fundir as duas.

**Eixo exibido** — mantido.

> **Cautela.** Arte descreve bem uma genialidade integradora e por isso tende a pontuar em
> quem já integra — o espelho que o princípio proíbe. O contra-sinal de `timeInZone` alto
> existe para isso: se a integração já é a prática, a travessia é outra.

---

## XV · O Diabo · Capricórnio

**Função prescrita** — nomear o vínculo que limita a escolha desejada.
**Estado de carência** — chama de escolha o que é vínculo com uma estrutura que recompensa de
verdade.

**Sinais primários**
- `vision_receita` alta **com** `vision_tempo` ≤ 10h e causa externa declarada — `vinculo`
- `biz_risco` = "Evito ao máximo" **com** `ctx_sem_dinheiro` divergindo de `ctx_oque_faz` — `vinculo`

**Sinais secundários**
- `biz_como_ganha` incompatível com `vision_tempo` — família `direcao`
- `vision_bloqueio` cita segurança, estabilidade ou dependência — família `vinculo`
- `energy_drena` alto na atividade que sustenta a renda — família `foco`

**Contra-sinais**
- `ctx_sem_dinheiro` coincide com `ctx_oque_faz` — **veto_pre_requisito**
- `biz_risco` = "Amo risco" — −2

**Pares** — confunde-se com **XII O Enforcado** (vínculo ↔ método) e **VII O Carro** (o que
prende ↔ o que falta).

**Eixo exibido** — mantido.

> A palavra é **vínculo**, não prisão. Emprego é cárcere para uma pessoa e estrutura
> estratégica para outra; o sinal exige a tensão declarada entre a recompensa real e a escolha
> desejada, nunca a mera existência de um emprego.

---

## XVI · A Torre · Marte

**Função prescrita** — demolir por escolha antes da demolição forçada.
**Estado de carência** — remenda o que precisa cair.

**Sinais primários**
- `convergence` com gap alto em três ou mais eixos — família `integracao`
- `ctx_experiencia` > 10 anos **com** `zones.genialidade` baixa — família `foco`

**Sinais secundários**
- `energy_drena` com 5 ou mais itens — família `vinculo`
- `vision_bloqueio` cita estrutura, modelo ou formato — família `direcao`
- `talent_frustracao` = "Processos lentos e burocráticos" — família `vinculo`

**Contra-sinais**
- `zones.genialidade` ≥ 40 — −2

**Pares** — ↔ **XIII A Morte** e ↔ **XII O Enforcado**. Torre é a mais radical das três: nem
método, nem parte — o todo.

**Eixo exibido** — mantido.

> O veto por tempo de área foi removido: quem tem dois anos de estrada pode estar dentro de
> uma estrutura que precisa cair. O gap múltiplo de convergência é o que tira a regra da
> genericidade — tempo de estrada mais irritação com burocracia descreve meio mercado.

---

## XVII · A Estrela · Aquário

**Função prescrita** — apostar na direção com evidência parcial.
**Estado de carência** — exige certeza completa antes de investir; a visão fica comprimida
pela necessidade de prova.

**Sinais primários**
- `clarity_next_step` = 4 ("sei a direção, não sei o passo") — família `direcao`
- `biz_risco` = "Evito ao máximo — preciso de previsibilidade e segurança" — família `vinculo`

**Sinais secundários**
- `ctx_analitico_intuitivo` = "Analítico — preciso de dados" — família `direcao`
- `energy_problemas` = "Parar e analisar todas as opções antes de agir" — família `direcao`
- `vision_receita` alta **com** `biz_risco` avesso — família `precificacao`

**Contra-sinais**
- `biz_risco` ∈ {"Tomo riscos moderados", "Amo risco"} — **veto_funcao_presente**
- `ctx_analitico_intuitivo` = "Intuitivo — decido rápido pelo instinto" — −2

**Pares** — ↔ **XVIII A Lua** (falta fé na direção ↔ falta a direção). Desempate: sabe para
onde ir e não se autoriza (Estrela) ou não sabe para onde ir (Lua)?

**Eixo exibido** — mantido.

> **Divergência resolvida.** Ativar por "visão alta + desejo forte" descreveria a
> fenomenologia da Estrela — luz, esperança, circulação. Pelo princípio prescritivo ela vai a
> quem *carece* dessa função. A leitura do Thoth está certa sobre o símbolo; o público dele é
> o oposto.

---

## XVIII · A Lua · Peixes

**Função prescrita** — atravessar o trecho sem visibilidade.
**Estado de carência** — o caminho sumiu; medo e imaginação ocupam a lacuna.

**Sinais primários**
- `clarity_next_step` = 0 ("não sei nem qual direção") — família `direcao`
- `vision_bloqueio` com marcadores de desorientação — família `direcao`

**Sinais secundários**
- `convergence` sem eixo dominante — família `foco`
- `energy_problemas` = "Consultar alguém de confiança antes de decidir" — família `direcao`
- `talent_feedback` = "Precisa de um tempo para processar" — família `direcao`

**Contra-sinais**
- `clarity_next_step` ≥ 7 — **veto_funcao_presente**
- `vision_90dias` com alvo e métrica claros — −2

**Pares** — ↔ **XVII A Estrela**.

**Eixo exibido** — mantido.

> **Status transitório.** Enquanto `clarity_next_step` não existir no assessment, A Lua não
> pode entrar no Top 4 por evidência estruturada — seu único sinal primário seria textual, e
> texto não monta finalistas. Até lá, só por wildcard. Com a pergunta 44 o status desaparece:
> `clarity_next_step` = 0 mais o eixo de convergência dão as duas famílias exigidas.

---

## XIX · O Sol · Sol

**Função prescrita** — mostrar-se inteiro.
**Estado de carência** — trabalha bem e escondido; o que já está pronto não é visto.

**Sinais primários**
- `energy_drena` contém "Vender e prospectar clientes" — família `visibilidade`
- `uniqueAbility.alignment` alto **com** `vision_receita` não realizada — família `precificacao`

**Sinais secundários**
- `biz_escala` = "Atender POUCOS clientes com MUITA profundidade" — família `precificacao`
- `ctx_intro_extro` introvertido — família `visibilidade`
- `energy_drena` contém "Gerenciar pessoas e dar feedback" — família `visibilidade`

**Contra-sinais**
- `wealthProfile.name` = Estrela — **veto_funcao_presente**
- `talent_natural` = "Falar em público e apresentar ideias" — −2
- `energy_flow` = "Liderando reuniões, facilitando discussões" — −2

**Pares** — ↔ **IX O Eremita** (expor ↔ recolher). Compete com **I O Mago**: Sol tem a oferta
pronta e não aparece; Mago não tem a frase.

**Eixo exibido** — mantido.

> Introversão saiu de requisito para sinal secundário. E talento para falar em público virou
> contra-sinal, não veto: ser bom palestrante não é o mesmo que estar visível.

---

## XX · O Aeon · Fogo

**Função prescrita** — adotar o próprio padrão de sucesso.
**Estado de carência** — mede-se por régua herdada; a identidade antiga já não explica a
próxima vida.

**Sinais primários**
- `ctx_sem_dinheiro` diverge fortemente de `ctx_oque_faz` — família `direcao`
- `vision_bloqueio` com marcador de critério externo ("deveria", "esperam", "sempre fui") — `vinculo`

**Sinais secundários**
- `ctx_experiencia` > 10 anos **com** `ctx_area` divergente de `energy_flow` — família `integracao`
- `talent_feedback` = "Questiona e desafia se o feedback faz sentido" — família `direcao`
- `vision_receita` desalinhada de `biz_como_ganha` — família `precificacao`

**Contra-sinais**
- `ctx_sem_dinheiro` coincide com `ctx_oque_faz` — **veto_pre_requisito**
- `ctx_experiencia` < 3 anos — −2

**Pares** — confunde-se com **XIII A Morte** (mudar a régua ↔ encerrar a prática) e com
**X A Fortuna** (mudar o critério ↔ mudar o plano).

**Eixo exibido** — mantido.

---

## XXI · O Universo · Saturno

**Função prescrita** — fechar o ciclo e entregar.
**Estado de carência** — está a um passo do fim e abre outra frente.

**Sinais primários**
- `initiative_stage` ∈ {`near_done_abandoned`, `many_mid_late`} — família `fechamento`
- `kolbe.seguimento` ≤ 4 **com** `kolbe.inicioRapido` ≥ 7 — família `fechamento`
- `energy_multitask` = "Gerenciando muitas coisas ao mesmo tempo" — família `foco`

**Sinais secundários**
- `actionPlan.doNot` ou `recommendation` cita concluir antes de iniciar — família `fechamento`
- `wealthProfile.name` = Criador — família `iniciacao`
- `zones.genialidade` alta **com** `uniqueAbility.timeInZone` baixo — família `foco`

**Contra-sinais**
- `kolbe.seguimento` ≥ 7 — **veto_funcao_presente**
- `initiative_stage` = `none_started` — **veto_pre_requisito**

**Pares** — ↔ **0 O Louco**, polo oposto do mesmo eixo. Compete com **IX O Eremita**
(concluir ↔ concentrar) e **III A Imperatriz** (terminar as avançadas ↔ nutrir a primeira).

**Eixo exibido** — mantido.

> **A ficha mais bem sustentada do conjunto.** `kolbe.seguimento`, `inicioRapido` e
> `initiative_stage` medem a carência diretamente, sem inferência. Repare que `actionPlan` e
> `recommendation` estão na mesma família `fechamento` que `kolbe.seguimento` — provavelmente
> foram gerados *por causa* dele, e por isso valem corroboração de +0,5, não peso integral.
> O veto por tempo de experiência foi removido: alguém pode construir quase todo um produto em
> seis meses e abandonar no fim.

---

# Lacunas aceitas

**Persistência não tem campo direto.** Continua aproximada por `kolbe.seguimento`, timing e
narrativa. Não acrescentamos uma terceira pergunta agora — primeiro se testa o sistema.

**Algumas condições exigem avaliação semântica leve no bloco D** — o conflito real entre
`biz_como_ganha` e `biz_receita` nos Amantes, a divergência entre `ctx_sem_dinheiro` e
`ctx_oque_faz` no Aeon, as duas trajetórias na Arte. Aceitável: D já é árbitro, e essas
condições entram como pergunta fechada, não como score.

# Próximo passo

Esta spec está congelada. O JSON machine-readable 1.1 traduz, sem decidir nada novo:

- DSL de condição para cada sinal
- `familia_evidencia` e `fonte` (assessment · A · B · C · texto_livre) em todo sinal
- as duas classes de veto
- normalização e piso de duas famílias
- status transitório da Lua
- perguntas 44 e 45 como campos canônicos

A inteligência fica na taxonomia; o código continua chato.
