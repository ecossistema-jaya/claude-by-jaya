# Engenharia reversa — Dashboard "Mapa da Zona de Genialidade"

Fiz a inspeção da página, dos dois scripts que a controlam (`psicometria-upload.js` e `psicometria-renderer.js`), das variáveis CSS do tema e dos payloads salvos em `localStorage`. Abaixo está tudo o que você precisa para reconstruir o sistema.

## 1. Arquitetura observada

O fluxo é bem simples e vale replicar: um dropzone aceita `.pdf`, `.md` ou `.txt`; PDF é extraído no cliente via `pdfjs-dist@3.11.174` carregado sob demanda; o texto é cortado numa constante `MAX_CHARS` e enviado por `POST /api/analyze` com corpo `{ text, fileName }`. O endpoint devolve um único objeto JSON que alimenta todo o dashboard. Há controle de cota no servidor (retorno `429` com `{ quota: { limit, reset } }`, limite padrão de 3 análises). O resultado é persistido em duas chaves por usuário: `psicometria_data_v2_<userId>` (o JSON interpretado) e `psicometria_source_v2_<userId>` (o markdown original do blueprint, guardado para um assistente conversacional posterior). Os gráficos usam Chart.js 4 (UMD) e o render é totalmente idempotente — cada seção roda dentro de seu próprio `try/catch`, então uma seção quebrada não derruba o dashboard.

Detalhe importante que descobri: o backend às vezes devolve campos como **string JSON aninhada** em vez de objeto (vi isso em `kolbe`, `talents`, `wealthProfile` e `actionPlan` num dos registros). Quando isso acontece, a seção simplesmente não renderiza — é exatamente por isso que o "Plano de Ação — Checklist" da tela atual aparece vazio, só com o cabeçalho `QUANDO / AÇÃO`. Coloque um parser recursivo no cliente (item 6) e você elimina essa classe de bug.

## 2. Design tokens

```css
:root{
  --color-bg-primary:#050505; --color-bg-secondary:#0F0F11;
  --color-bg-card:#1C1E19;   --color-bg-card-hover:#252520;
  --color-bg-elevated:#1C1E19;

  --color-accent-primary:#D1FF00;        /* lime — acento principal */
  --color-accent-primary-light:#E0FF4D;
  --color-accent-blue:#0099FF;  --color-accent-blue-light:#33ADFF;
  --color-accent-green:#22C55E; --color-accent-flare:#ED4609;
  --color-accent-gold:var(--color-accent-primary);   /* alias legado */
  --color-accent-purple:var(--color-accent-blue);    /* alias legado */
  --color-accent-teal:#134E4A;

  --color-pink:#EC4899; --color-pink-light:#F9A8D4;
  --color-success:#22C55E; --color-warning:#F59E0B;
  --color-danger:#EF4444;  --color-info:#0099FF; --color-amber:#F59E0B;
  --color-text-muted:#73736B;

  --font-family:'Manrope',-apple-system,sans-serif;
  --font-display:'Space Grotesk','Manrope',sans-serif;
  --font-mono:'IBM Plex Mono',ui-monospace,monospace;

  --radius-sm:.5rem; --radius-md:.75rem; --radius-lg:1rem; --radius-xl:1.25rem;
  --shadow-md:0 4px 12px rgba(0,0,0,.08);
  --shadow-lg:0 10px 25px rgba(0,0,0,.12);
  --shadow-glow:0 0 30px rgba(160,200,0,.15);
}
```

Existem 101 variáveis no total, incluindo escalas alfa pré-computadas (`--color-accent-primary-10/15/20/25/30/40/50`, `--color-accent-blue-10/15/...`) e um bloco de tokens "terminal" (`--terminal-bg`, `--terminal-dot-red/yellow/green`) usado em outras telas. O tema tem versão clara e escura via `html[data-theme]`, com preferência salva em `theme-preference`.

A grade é de duas colunas de cards no desktop, colapsando para uma no mobile. Cada card tem ícone circular + título + subtítulo com a atribuição do autor do framework, depois um bloco "explicador" cinza (texto didático fixo, não gerado pela IA), depois a visualização, e por fim um bloco `SUA LEITURA` com borda esquerda rosa (`#EC4899`) contendo o texto interpretativo em HTML.

## 3. Contrato de dados (a resposta de `/api/analyze`)

Este é o schema exato, com os tipos e cardinalidades que validei:

```ts
type Psicometria = {
  profile: {
    name: string;            // primeiro nome ou nome completo
    initials: string;        // 2 chars, ex. "JR"
    currentZone: string;     // aceita HTML inline
    zoneTransition: string;  // ex. "Excelência → Genialidade"
    tags: string[];          // exatamente 4, uppercase no render
  };

  zones: { genialidade:number; excelencia:number; competencia:number; incompetencia:number }; // % somando 100
  zonesReading: string;      // HTML

  talents: {                 // CliftonStrengths
    labels: string[];        // 5
    scores: number[];        // 5, escala 1–10
    reading: string;         // HTML
  };

  kolbe: {                   // 4 modos conativos, escala 1–10
    investigador:number; seguimento:number; inicioRapido:number; implementador:number;
    reading:string;
  };

  hormozi: {                 // Value Equation, escala 1–10
    resultadoSonhado:number; probabilidade:number; tempoEspera:number; esforco:number;
    score:number;            // composto, exibido com 1 decimal
    reading:string;
  };

  wealthProfile: { name:string; description:string };            // Roger Hamilton
  fascinationProfile: { name:string; archetype:string; description:string }; // Sally Hogshead
  profilesReading: string;   // leitura cruzada dos dois

  uniqueAbility: {           // Dan Sullivan
    description:string;      // 1 frase densa
    alignment:number;        // 0–100 %
    timeInZone:number;       // 0–100 %
    potential:number;        // 0–100 %
    reading:string;
  };

  convergence: {
    labels: string[];        // 6 eixos
    current: number[];       // 6, escala 1–10
    potential: number[];     // 6, escala 1–10
    insights: { color:'pink'|'gold'|'purple'|'green'; text:string }[]; // 4
    reading: string;
  };

  timeDistribution: {
    current: { genialidade:number; excelencia:number; competencia:number; incompetencia:number };
    target:  { genialidade:number; excelencia:number; competencia:number; incompetencia:number };
    reading: string;
  };

  recommendation: string;    // 1 parágrafo, card destacado

  actions: {                 // 5 itens, roadmap 90 dias
    label:string;            // ex. "Grand Slam Offer"
    timeframe:string;        // ex. "Dias 1-30" | "Dias 1-90 (contínuo)"
    frameworks:string;       // ex. "Hormozi + Sullivan (Unique Ability)"
    description:string;      // ~180–220 chars
  }[];

  actionPlan: {
    thisWeek: string[];      // 3
    nextTwoWeeks: string[];  // 3
    nextMonth: string[];     // 3
    doNot: string[];         // 5, ~120–150 chars cada
  };

  recommendedSquad: {
    domain:     { name:string; description:string };
    purpose:    { name:string; description:string };
    targetUser: { name:string; description:string };
    executionMode: 'Burst' | 'Sprint' | 'Marathon';
  };
};
```

Todos os campos `reading` e `description` aceitam HTML restrito (`<strong>`, `<em>`, `<span style="color:var(--color-*)">`) e são injetados com `innerHTML`; os campos curtos passam por `esc()` e `textContent`. Sanitize o HTML no servidor — hoje isso é um vetor de XSS armazenado.

## 4. Mapa de componentes e visualizações

A ordem de render é fixa: `profile → zones → talents → kolbe → hormozi → profiles → sullivan → convergence → time → recommendation → actionPlan → squad`. O dashboard é revelado **antes** dos gráficos serem instanciados, porque os `<canvas>` precisam de dimensões reais para o Chart.js calcular escala.

As três visualizações são:

**Radar de talentos** (`chart-talentos`) — 5 eixos, `max: 10`, `beginAtZero`, ticks ocultos com `stepSize: 2`, grid e angleLines em `rgba(255,255,255,.06)`, pointLabels em `#A3A3A3` 11px Inter, fill `rgba(236,72,153,0.15)` com borda `#EC4899` 2px e `pointRadius: 4`, legenda desativada.

**Radar de convergência** (`chart-convergencia`) — mesmos eixos radiais com legenda ativa. Dataset "Atual" em `#EC4899` (fill `.12`, border 2px, pointRadius 3) e dataset "Potencial" em `#D1FF00` (fill `.08`, border 1.5px, `borderDash: [4,4]`, pointRadius 3). A linha tracejada lime é o recurso visual que comunica o gap.

**Barra de tempo** (`chart-tempo`) — barra horizontal empilhada (`indexAxis:'y'`, `stacked:true`, `max:100`, tick callback `v => v+'%'`), duas linhas rotuladas `['Atual','Meta 90 dias']`, séries Genialidade `#EC4899`, Excelência `#D1FF00`, Competência `#0099FF`, Incompetência `#6B7280`.

As barras de progresso são renderizadas por um helper `setBar(id, pct, cssVar, suffix)` que anima `width` e escreve o valor formatado. O mapeamento de cor é semântico e vale copiar tal e qual:

| Barra | Token | Escala |
|---|---|---|
| Genialidade | `--color-pink` | % |
| Excelência | `--color-accent-gold` | % |
| Competência | `--color-accent-purple` | % |
| Incompetência | `--color-text-muted` | % |
| Kolbe · Investigador | `--color-pink` | `val*10`, sufixo `/10` |
| Kolbe · Seguimento | `--color-accent-purple-light` | `/10` |
| Kolbe · Início Rápido | `--color-accent-gold` | `/10` |
| Kolbe · Implementador | `--color-accent-green` | `/10` |
| Hormozi · Resultado Sonhado | `--color-accent-green` | `/10` |
| Hormozi · Probabilidade | `--color-accent-gold` | `/10` |
| Hormozi · Tempo de Espera | `--color-danger` | `/10` |
| Hormozi · Esforço | `--color-warning` | `/10` |

O checklist do plano de ação agrupa em três blocos com classe de cor por prazo: `Esta semana` → `pink`, `Próximas 2 semanas` → `gold`, `Próximo mês` → `purple`. O bloco `O que NÃO fazer` é uma `<ul>` separada com borda vermelha. O squad usa IDs planos (`psico-squad-domain-name`, `psico-squad-domain-desc`, `psico-squad-purpose-name`, `psico-squad-purpose-desc`, `psico-squad-target-name`, `psico-squad-target-desc`, `psico-squad-mode`) e o modo de execução vira um chip verde.

## 5. Regras de derivação (o prompt de `/api/analyze`)

O prompt real está no servidor, mas o comportamento é inteiramente inferível a partir dos outputs. Esta é a especificação que reproduz o resultado:

> Você é um analista psicométrico. Receberá um documento de autoconhecimento/blueprint de negócio em texto livre. Extraia evidências textuais e produza **exclusivamente** um objeto JSON válido no schema fornecido, sem markdown, sem cercas de código, sem campos serializados como string.
>
> Aplique sete frameworks convergentes: Zonas de Gay Hendricks (*O Grande Salto*), CliftonStrengths de Don Clifton, Índice Kolbe A de Kathy Kolbe, Value Equation de Alex Hormozi, Wealth Dynamics de Roger Hamilton, Fascination Advantage de Sally Hogshead e Unique Ability de Dan Sullivan.
>
> Regras de consistência: `zones` soma 100; `timeDistribution.current` espelha `zones`; `timeDistribution.target` sempre desloca massa para Genialidade (tipicamente 55–65%) e reduz Incompetência a ≤5%; `uniqueAbility.timeInZone` é igual a `zones.genialidade`; `alignment` ≥ 85 quando o documento demonstra IP proprietário; `potential` ≥ `alignment`; `hormozi.score` é a média ponderada dos quatro fatores arredondada a um decimal; o eixo de `convergence` com maior gap `potential − current` deve ser o gargalo citado em `recommendation`; o item de `actions` cujo `timeframe` é contínuo deve tratar delegação.
>
> Regras de voz: cada `reading` tem 600–1000 caracteres, cita o nome da pessoa, ancora cada afirmação numa evidência literal do documento (nomes de produtos, preços, terminologia própria), usa `<strong>` para o veredicto e `<em>` para nomes de talentos, e termina com um movimento estratégico acionável. Nunca elogie de forma genérica: toda nota numérica precisa de justificativa rastreável ao texto. `doNot` deve nomear a armadilha comportamental por trás de cada proibição.

A "assinatura" do output — o que torna a interpretação boa — é que cada nota vem amarrada a uma citação do documento e que o sistema sempre converge para um único gargalo e uma única recomendação. É isso que faz parecer diagnóstico e não horóscopo.

## 6. Normalização e validação no cliente

Três guardas resolvem tudo o que vi quebrar:

```js
// 1. Parser recursivo — corrige campos vindos como string JSON
const deep = v => {
  if (typeof v === 'string') {
    const s = v.trim();
    if (/^[{[]/.test(s) && /[}\]]$/.test(s)) { try { return deep(JSON.parse(s)); } catch {} }
    return v;
  }
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k,x]) => [k, deep(x)]));
  return v;
};

// 2. Normalização de percentuais
const norm = z => { const t = Object.values(z).reduce((a,b)=>a+b,0) || 1;
  return Object.fromEntries(Object.entries(z).map(([k,v]) => [k, Math.round(v*100/t)])); };

// 3. Clamp de escalas + fallback de seção
const clamp10  = n => Math.max(0, Math.min(10, Number(n) || 0));
const clamp100 = n => Math.max(0, Math.min(100, Number(n) || 0));
```

Valide com Zod ou JSON Schema antes de persistir, e se uma seção falhar, esconda o card em vez de renderizar um cabeçalho vazio. Vale também versionar o schema (`schemaVersion: 2`) dentro do próprio payload, já que as chaves de `localStorage` já carregam `_v2` mas o objeto não.

## 7. Questionário para gerar o blueprint

O input hoje é um documento livre de ~44 mil caracteres. Para tornar o resultado reprodutível sem depender de um documento pré-existente, este questionário cobre exatamente os campos que cada framework precisa. Sugiro entregá-lo em 7 etapas com barra de progresso, salvando respostas parciais, e concatenar tudo num markdown que vai para o mesmo `/api/analyze`.

**Etapa 1 — Identidade e posicionamento** (alimenta `profile`)
1. Nome completo e como você quer ser chamada no relatório.
2. Em uma frase, o que você faz e para quem.
3. Quais 3 a 5 expressões, metáforas ou termos você criou e usa que ninguém mais no seu mercado usa?
4. Se alguém descrevesse seu trabalho em 4 rótulos curtos, quais seriam?
5. Qual categoria de mercado você diria que ocupa — e ela já existia antes de você?

**Etapa 2 — Zonas de energia** (alimenta `zones`, `zonesReading`, `timeDistribution`)
6. Liste as tarefas da sua última semana típica e estime as horas de cada uma.
7. Quais dessas tarefas você faz de um modo que quase ninguém consegue replicar, e que te dão energia em vez de consumir?
8. Quais você faz muito bem, com reconhecimento, mas que te esvaziam ao final do dia?
9. Quais você faz razoavelmente e que outra pessoa faria igual ou melhor?
10. Quais você faz mal, evita ou postergou nos últimos 30 dias?
11. Se em 90 dias você pudesse redesenhar a semana livremente, quantos por cento iriam para cada um desses quatro grupos?

**Etapa 3 — Talentos dominantes** (alimenta `talents`)
12. Descreva três situações em que você resolveu algo com facilidade que surpreendeu as pessoas ao redor.
13. O que colegas ou clientes elogiam em você de forma repetida, mesmo quando você não considera mérito?
14. Quando você entra num problema novo, qual é seu primeiro movimento instintivo?
15. Já fez CliftonStrengths, MBTI, Eneagrama, DISC ou similar? Cole os resultados.
16. Qual tipo de conversa faz você perder a noção do tempo?

**Etapa 4 — Instintos conativos** (alimenta `kolbe`)
17. Antes de começar algo importante, você pesquisa a fundo ou reúne o mínimo e parte? Dê um exemplo recente.
18. Você trabalha melhor com processo definido e checklist ou com estrutura solta? O que acontece quando é forçada ao contrário?
19. Quantos projetos você começou nos últimos 12 meses e quantos entregou até o fim?
20. Você prefere produzir a coisa tangível com as próprias mãos ou desenhar e delegar a construção?
21. O que especificamente te faz travar num projeto perto da entrega?

**Etapa 5 — Oferta e valor** (alimenta `hormozi`, `wealthProfile`)
22. Liste todos os seus produtos ou serviços atuais, com preço e formato de entrega.
23. Qual é a transformação concreta que o cliente vive — antes e depois, em termos observáveis?
24. Quanto tempo passa entre a compra e o primeiro resultado percebido?
25. Quanto esforço, disciplina ou sacrifício o cliente precisa investir para o método funcionar?
26. Que provas você tem de que funciona: números, casos, depoimentos, taxa de recompra?
27. Qual a maior objeção que você ouve, e o que você responde hoje?
28. Você ganha dinheiro criando, vendendo, operando, otimizando ou conectando pessoas? Onde a receita realmente aparece?

**Etapa 6 — Percepção e habilidade única** (alimenta `fascinationProfile`, `uniqueAbility`, `profilesReading`)
29. Qual é a primeira reação das pessoas ao te conhecer profissionalmente?
30. Você é lembrada mais pela autoridade, pela criatividade, pela confiança que gera, pela precisão ou pelo cuidado?
31. Complete: "só eu consigo ______ do jeito que eu faço, porque ______".
32. Qual atividade você faria de graça pelo resto da vida sem se cansar?
33. Que problema as pessoas te trazem que elas não conseguem nem formular direito antes de falar com você?
34. Que percentual do seu tempo atual é gasto exatamente nessa capacidade?

**Etapa 7 — Gargalos, metas e time** (alimenta `convergence`, `recommendation`, `actions`, `actionPlan`, `recommendedSquad`)
35. Qual é hoje o maior gargalo entre o que você criou e o que está no mercado gerando receita?
36. O que já está pronto e não foi lançado, ativado ou vendido?
37. Nomeie a habilidade que falta no seu time e que hoje trava a execução.
38. Que padrão você repete e sabe que sabota o resultado?
39. Quais são suas metas de 30, 60 e 90 dias, com número quando houver?
40. Quem já trabalha com você e em quê? Qual orçamento existe para contratar?
41. Você trabalha melhor em rajadas intensas curtas, em sprints regulares ou em ritmo contínuo longo?
42. Qual seria o resultado, em 12 meses, que provaria que a virada aconteceu?

Se quiser, o próximo passo natural é eu montar o markdown de saída desse questionário (o template que vira o `text` enviado ao endpoint) e o prompt completo do `/api/analyze` já com as regras de consistência e o JSON Schema para *structured output* — assim você elimina de vez o problema de campos vindo serializados como string.