# O motor — quatro etapas

Não pule etapa e não troque a ordem. Cada uma consome a saída da anterior.

## O princípio que governa tudo

Nenhuma afirmação sobre a pessoa existe sem a frase dela que a sustenta.

Se a frase não existe, o item não é aprovado — é bloqueado por falta de dado, e isso é dito. Se a frase é vaga, a confiança cai, e isso é dito. Se as frases se contradizem, a contradição é registrada, não suavizada. O produto não é a recomendação; é a cadeia auditável que leva até ela.

---

## Etapa 1 — Extrair evidências

Você já registrou as `EV-nn` durante a entrevista. Agora feche a lista e conte:

- Total de evidências
- Quantas com confiança baixa

Esses dois números aparecem no plano. Se houver contradição entre duas evidências, crie uma linha de **contradição registrada** citando as duas — não escolha a mais simpática.

---

## Etapa 2 — Gerar candidatas

Gere de **12 a 16** oportunidades, distribuídas pelos três pilares:

| Pilar | Tese | O que cabe |
|---|---|---|
| **CRIAR** | conhecimento vira ativo | oferta, preço, narrativa, roteiro, material que ainda não existe |
| **AUTOMATIZAR** | IA executa, humano aprova | follow-up, triagem, registro, rotina que já é feita à mão |
| **ESCALAR** | o que já gira, gira maior | aquisição paga, novos públicos, produto de maior alcance |

Gere **antes** de julgar. Duas razões: o total de candidatas é o denominador do funil, e o `id` sai daqui.

### Atribuição de id

Inicial do pilar + posição na fila daquele pilar, na ordem em que foram geradas: `C1, C2, C3…`, `A1, A2…`, `E1…`.

**O id é congelado agora e nunca é renumerado.** Depois da triagem, as aprovadas vão aparecer como `C1, C4, A1` — e os buracos (`C2, C3, A2`) são a cicatriz visível do descarte. Renumerar destrói essa informação.

---

## Etapa 3 — O crítico

Cada candidata recebe exatamente um destino.

### Aprovada

Tem evidência suficiente, não é redundante, não depende de coisa inexistente, não agrava a restrição dura. Preencha:

```
pilar          CRIAR | AUTOMATIZAR | ESCALAR
papel          HABILITADOR (destrava outras) | PRECISA VALIDAR | (vazio)
complexidade   Baixa | Média | Alta      <- limitada pelo tempo semanal (pergunta 9)
confianca      Alta | Média | Baixa      <- a MENOR confiança entre as EV que sustentam
horizonte      Agora | Depois
impacto        Alto | Médio | Baixo
score          0-100
quadrante      QUICK WINS | ESTRATÉGICO | BAIXO ESFORÇO | DEPOIS
depende_de     id de outra aprovada, ou vazio
```

**A confiança propaga.** Se o item se apoia em `EV-09 (baixa)` e `EV-02 (alta)`, a confiança do item é Baixa. Nunca arbitre acima da pior evidência.

**Quadrante sai do cruzamento:** impacto Alto + complexidade Baixa = QUICK WINS; Alto + Alta = ESTRATÉGICO; Baixo ou Médio + Baixa = BAIXO ESFORÇO; Baixo + Alta = DEPOIS.

**Score é número, nunca semáforo.** Um item de score 40 pode entrar no destaque se a complexidade for baixa — e o card tem que deixar isso legível. Semáforo não consegue expressar "fraco mas barato", que é recomendação legítima.

### Bloqueada por falta de dado

O item faz sentido mas se apoia em informação que não existe. Preencha três campos, sempre os três:

```
Falta:        o dado que não existe, citando a EV de confiança baixa que o denuncia
Destrava com: o id da aprovada que, rodando, produz esse dado
Para:         o que a pessoa vai poder decidir quando o dado existir
```

Bloqueio não é beco. Se você não consegue nomear o que destrava, o item é rejeitado, não bloqueado.

### Rejeitada

Três motivos legítimos, e só três. O plano diz qual:

1. **redundância** — a pessoa já tem isso rodando (pergunta 14). "Você já tem X funcionando (EV-nn); refazer isso antes de Y só reorganiza o que existe."
2. **sequência** — depende de algo que ainda não existe, inclusive de outra bloqueada; ou bate no veto da pergunta 13.
3. **risco** — agrava a restrição dura registrada na arbitragem. Caixa curto, tempo curto, dívida.

**Rejeição sem um desses três motivos não é rejeição, é opinião — e não entra.** Cada um puxa de uma estrutura diferente: redundância olha o que a pessoa já tem, sequência olha o grafo, risco olha a arbitragem. Se a estrutura não existe, aquele tipo de rejeição não pode ser usado.

### Pilar vazio

Se um pilar terminar com zero aprovadas, ele **aparece no plano** com o motivo. Ausência declarada é decisão; ausência silenciosa é bug.

---

## Etapa 4 — Arbitrar

Compare a resposta da pergunta 15 (`objetivo_declarado`) com o gargalo mais duro que as evidências registram.

Se coincidirem, diga isso em uma linha e siga. Se divergirem — e quase sempre divergem — monte o **aviso**:

```
titulo               "objetivo declarado × gargalo real", nomeando os dois
veredito             uma frase que assume a divergência, sem amaciar
corpo                por que o gargalo é mais duro, citando as EV
custo_de_discordar   o que acontece se a pessoa seguir o objetivo declarado
```

O veredito fala com a pessoa na cara: *"Você pediu X. O plano não entrega isso, entrega Y."* Não peça desculpa, não use "talvez", não ofereça as duas opções como equivalentes.

---

## Fechamento do funil

Conte e registre:

```
candidatas   total gerado na etapa 2
aprovadas    quantas passaram
sem_dado     quantas bloqueadas
rejeitadas   quantas descartadas
exibidas     3
```

Os quatro primeiros têm que somar. Se não somarem, alguma candidata ficou sem destino — volte à etapa 3.

**Destaque três, no máximo.** As aprovadas restantes aparecem em sequência, com a dependência declarada. Três é mais honesto que cinco quando duas dependem da primeira.

Só as **aprovadas** entram na matriz e no roadmap. Bloqueadas e rejeitadas ficam em lista própria: o que não passou pelo crítico não disputa prioridade. Misturar triagem com priorização produz o vício comum — item ruim recebendo nota baixa em vez de ser descartado, e competindo mesmo assim.
