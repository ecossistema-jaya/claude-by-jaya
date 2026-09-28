# Plano Diretor — spec de recomendação · 1.1

Especificação do bloco de recomendação do dashboard da Zona de Genialidade. Substitui o
arranjo atual, em que cada framework devolve seu card no seu formato e as recomendações
aparecem afirmadas, sem citação da resposta que as originou e sem registro do que foi
descartado.

Documento de trabalho. Nada aqui está implementado. Referência de engenharia reversa:
`docs/Engenharia reversa.md` e os artefatos coletados do tutorial guiado da Tatá (fluxo
diagnóstico → plano diretor).

Compartilha espinha com `carta-travessia-spec.md`: hierarquia de evidência, famílias de
evidência obrigatórias, microbloco de arbitragem. Onde os dois divergirem, a carta manda no
arcano e esta spec manda no plano — não há herança automática.

## Decisões fechadas

| Decisão | Estado |
|---|---|
| Unidade de verdade | Evidência `EV-nn`, com fonte, texto e confiança |
| Origem das EV citáveis | Só perguntas abertas e `sim_nao_detalhe` |
| Múltipla escolha | Vira `sinal`, nunca `EV` citável |
| Propagação de incerteza | Confiança do card herda da menor confiança das EV que o sustentam |
| Funil | Aprovadas · sem dado · rejeitadas, todos com contagem visível |
| Teto de aprovadas exibidas | 3, com as demais em sequência declarada |
| Eixos do card | Pilar, complexidade, confiança, horizonte, impacto, papel |
| Score | 0–100, exibido; nunca semáforo |
| Bloco de arbitragem | Obrigatório — objetivo declarado × gargalo real |
| Primeira ação | Sempre analógica, nunca exige ferramenta |
| Human-in-the-loop | Declarado no texto de toda transformação proposta |
| Números inventados | Proibidos; ausência declarada no rodapé |
| Triagem × priorização | Etapas separadas; só aprovada disputa lugar na matriz |
| Views do mapa | Portfólio por pilar · matriz impacto×complexidade · roadmap 0–30 dias |
| Bloqueadas | Declaram o que falta e qual item aprovado as destrava |
| Rejeitadas | Atribuídas ao crítico, com motivo e EV |
| IDs | Atribuídos na geração, antes da triagem; buracos ficam visíveis |
| Fecho | Uma frase em primeira pessoa, reafirmando a arbitragem |

## O princípio que governa tudo

Nenhuma afirmação sobre a pessoa existe sem a frase dela que a sustenta.

Disso decorre o resto: se a frase não existe, o item não é aprovado — é bloqueado por falta
de dado, e isso é dito. Se a frase é vaga, a confiança cai, e isso é dito. Se as frases se
contradizem, a contradição é registrada, não suavizada. O produto não é a recomendação; é a
cadeia auditável que leva até ela.

## A cadeia de incerteza

    resposta aberta  →  EV-nn (confiança alta|média|baixa)
                     →  oportunidade candidata
                     →  aprovada | sem dado | rejeitada
                     →  card (confiança = mínima das EV)
                     →  contagem exibida no funil e na tela de espera

A tela de espera narra esta cadeia, com os números reais. Uma etapa que não produziu
artefato não aparece na tela.

## Schema

Bloco novo no retorno dos CHUNKS. Nomes em português para casar com o restante do payload.

```json
{
  "evidencias": [
    {
      "id": "EV-03",
      "fonte": "vision_bloqueio",
      "texto": "citação literal da resposta, sem paráfrase",
      "confianca": "alta|media|baixa",
      "motivo_confianca": "obrigatório quando media ou baixa"
    }
  ],

  "sinais": [
    { "fonte": "talent_dominio", "opcao": "PENSADOR ESTRATÉGICO", "leitura": "..." }
  ],

  "funil": {
    "candidatas": 14,
    "aprovadas": 5,
    "sem_dado": 3,
    "rejeitadas": 6,
    "exibidas": 3
  },

  "arbitragem": {
    "objetivo_declarado": "o que a pessoa pediu, nas palavras dela",
    "gargalo_real": "o que os dados mostram como restrição dura",
    "veredito": "uma frase que assume a divergência",
    "custo_de_discordar": "o que acontece se seguir o objetivo declarado",
    "evidencias": ["EV-04", "EV-13", "EV-15"]
  },

  "oportunidades": [
    {
      "id": "C1",
      "ordem": 1,
      "titulo": "...",
      "pilar": "CRIAR|AUTOMATIZAR|ESCALAR",
      "papel": "HABILITADOR|PRECISA VALIDAR",
      "complexidade": "Baixa|Média|Alta",
      "confianca": "Alta|Média|Baixa",
      "horizonte": "Agora|Depois",
      "impacto": "Alto|Médio|Baixo",
      "score": 100,
      "problema": "o que está quebrado, com EV entre parênteses",
      "transformacao": "IA faz X, humano aprova Y antes de Z",
      "resultado": "estado final, hedgeado como hipótese",
      "primeira_acao": "um passo analógico, executável hoje",
      "depende_de": null,
      "motivo_dependencia": null,
      "evidencias": ["EV-03", "EV-04", "EV-05"]
    }
  ],

  "rejeitadas": [
    { "titulo": "...", "motivo": "...", "evidencias": ["EV-07"] }
  ],

  "sem_dado": [
    { "titulo": "...", "pergunta_que_falta": "...", "por_que_bloqueia": "..." }
  ],

  "pilares_vazios": [
    { "pilar": "ESCALAR", "motivo": "..." }
  ],

  "onde_ia_nao_resolve": [
    { "titulo": "...", "porque": "...", "evidencias": ["EV-13"] }
  ]
}
```

### Regras do `id`

Inicial do pilar + posição na fila daquele pilar: `C1`, `C2`, `A1`, `E1`. Curto o bastante
para citar em `depende_de` e em conversa; único o bastante para rastrear.

### Regras de `score`

Número exibido, 0–100. Item de score baixo pode entrar no top 3 se a complexidade for baixa —
e o card precisa deixar isso legível. Semáforo é proibido: não consegue expressar
"fraco mas barato", que é uma recomendação legítima.

## Anatomia do card

Dois renders do mesmo objeto. O compacto já existe como padrão no dashboard
(`card-carta` alterna `carta-fechada` / `carta-aberta`) — reaproveitar.

**Compacto:** `#ordem · título · pilar · complexidade · papel · score` + `problema` em uma linha.

**Expandido:** grade dos 6 eixos, depois quatro blocos na ordem fixa —

    Problema identificado    o que está quebrado, com EV
    Transformação proposta   quem faz o quê (IA + humano)
    Resultado esperado       estado final, hedgeado
    Primeira ação            um passo, hoje, sem ferramenta

Quando houver `depende_de`, linha própria antes da primeira ação:
`Dependência: C1 · <título> (<motivo_dependencia>)`.

Fecha com `POR QUE ISSO FOI RECOMENDADO?` — as EV citadas entre aspas, literais, e o rodapé:
"Impacto financeiro precisa ser validado. Nenhum número acima foi inventado."

## Regras editoriais

1. **Primeira ação analógica.** Papel, nota no celular, três frases à mão. Nunca abre
   ferramenta. Um produto de IA cuja primeira instrução dispensa IA compra confiança que
   argumento nenhum compra.
2. **Human-in-the-loop no texto.** Toda `transformacao` nomeia o par: o que a IA faz, o que o
   humano aprova, e antes de quê. Repetido em todo card, vira contrato.
3. **Resultado hedgeado.** "Como hipótese a validar", "como base para decisão, não como
   solução". O resultado é uma aposta declarada.
4. **Contradição registrada.** Respostas incompatíveis viram item explícito, com as duas EV
   lado a lado. Não se escolhe a mais simpática.
5. **Segunda pessoa, fato específico.** "Você já testou uma sessão a R$ 497 e está sem
   clientes pagantes" — nunca "pessoas no seu perfil costumam".

## Plano de EV para o questionário atual

Das 43 perguntas, 6 rendem citação literal: `ctx_nome`, `ctx_oque_faz`, `ctx_sem_dinheiro`,
`vision_90dias`, `vision_bloqueio`, `talent_competencia_genialidade` (o detalhe do
`sim_nao_detalhe`). É pouco para sustentar 3 cards com 2–3 EV cada.

Ação: promover a abertas, ou acrescentar campo de detalhe opcional, as três que mais
carregam o plano —

| Pergunta | Hoje | Passa a |
|---|---|---|
| `biz_preco` | múltipla escolha | + detalhe aberto ("o que você cobra hoje, e por quê") |
| `initiative_stage` | múltipla escolha | + detalhe aberto ("qual frente, e o que falta nela") |
| `biz_como_ganha` | múltipla escolha | + detalhe aberto ("descreva a oferta como ela existe hoje") |

Múltipla escolha continua alimentando `sinais`, que sustentam leitura mas não viram aspas.

## Triagem e priorização são etapas distintas

O crítico decide **quem compete**. A matriz decide **em que ordem**. Nunca a mesma passagem.

    candidatas  →  [crítico]  →  aprovada        →  [matriz]  →  quadrante + ordem
                              →  sem dado                        (fora da matriz)
                              →  rejeitada                       (fora da matriz)

Bloqueada e rejeitada não aparecem na matriz nem no roadmap — aparecem em lista própria, com
motivo. Misturar as duas etapas produz o vício comum: item ruim recebendo nota baixa em vez
de ser descartado, e depois competindo mesmo assim.

## IDs com buraco

`id` é atribuído na geração das candidatas, antes da triagem. Aprovadas exibidas ficam
`C1, C4, C2, A1, A5` — os números ausentes são os descartes. O buraco é cicatriz visível,
sem texto explicando. Renumerar depois da triagem destrói essa informação: proibido.

## As três views do mapa

Mesmo conjunto de objetos, três leituras. Nenhuma introduz dado novo.

**1. Portfólio por pilar.** Filtro `Todas · criar · automatizar · escalar`, contagem por pilar,
e uma tese de uma linha para cada — "conhecimento vira ativo", "IA executa, humano aprova".
Pilar vazio aparece com o motivo, não some.

**2. Matriz impacto × complexidade.** Quatro quadrantes: `QUICK WINS`, `ESTRATÉGICO`,
`BAIXO ESFORÇO`, `DEPOIS`. Só aprovadas. Ponto clicável abre o card expandido.

**3. Roadmap `Agora · 0–30 dias`.** Ordem de execução, com a dependência inline sob o item:
`↳ depende de C1 · <título> (<motivo>)`.

## Bloqueadas carregam o desbloqueador

Bloqueio não é beco. Todo item em `sem_dado` declara três coisas:

    Falta:        o dado que não existe, com a EV de confiança baixa que o denuncia
    Destrava com: o item aprovado que, rodando, produz esse dado
    Para:         o que a pessoa vai poder decidir quando o dado existir

Fecha a lista com: "Estas não são promessas. São hipóteses que só existem quando o dado
existir."

## O crítico

A rejeição é atribuída — "rejeitadas pelo crítico", não "não recomendado". Agente nomeado
assume a decisão. Três motivos legítimos, e o card diz qual:

1. **Redundância** — a pessoa já tem isso rodando. "Você já tem uma equipe de agentes
   organizando marketing (EV-011); revisar esse fluxo antes da oferta só reorganiza o que já
   existe."
2. **Sequência** — faz sentido, mas depende de algo que ainda não existe, inclusive de outra
   bloqueada.
3. **Risco** — agrava a restrição dura já registrada na arbitragem. "Tráfego pago com runway
   praticamente zero (EV-013, EV-015)."

Rejeição sem um desses três motivos não é rejeição, é opinião — e não entra.

## Fecho

Uma frase, em primeira pessoa, uma vez só, no fim de tudo:

> "Se esse negócio fosse meu eu primeiro consolidaria a oferta e a precificação, depois
> automatizaria o follow-up e a qualificação. Este plano não resolve a urgência de caixa
> desta semana; entrega a máquina que vai gerar a primeira venda."

O motor sustenta a arbitragem até a última linha, sem amaciar. Só depois disso vem a chamada
para o próximo passo comercial.

## Acréscimos de schema (1.1)

```json
{
  "pilares": [
    { "pilar": "CRIAR", "tese": "conhecimento vira ativo", "total": 3 }
  ],
  "oportunidades": [
    { "quadrante": "QUICK WINS|ESTRATÉGICO|BAIXO ESFORÇO|DEPOIS", "janela": "0-30" }
  ],
  "sem_dado": [
    { "destrava_com": ["C1"], "para": "..." }
  ],
  "rejeitadas": [
    { "motivo_tipo": "redundancia|sequencia|risco" }
  ],
  "fecho": { "texto": "...", "reafirma": "arbitragem.veredito" }
}
```

## Não decidido

- Se o `funil` sai do scorer que hoje roda em modo sombra ou de um bloco próprio. Depende de
  ler o scorer — decisão adiada até lá.
- Se a arbitragem cabe no Bloco D da carta ou pede microbloco separado.
- Redação final do rodapé de não-invenção.
