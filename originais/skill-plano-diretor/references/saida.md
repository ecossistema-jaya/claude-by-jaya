# A saída — dois arquivos

Gere os dois. O `.md` é para ler e editar; o `.html` é para navegar e mostrar para alguém.

---

## 1. `plano-diretor.md`

Ordem fixa das seções. Não invente seção, não reordene, não corte.

```markdown
# Plano Diretor — {nome}

## Três prioridades aprovadas. Só três, de propósito.

A partir das suas {n} evidências, o motor aprovou {a} oportunidades, bloqueou
{b} por falta de dado e rejeitou {r}. As aprovadas estão organizadas por
viabilidade e dependência.

| Candidatas | Aprovadas | Sem dado | Rejeitadas |
|---|---|---|---|
| {c} | {a} | {b} | {r} |

## O aviso · {objetivo declarado} × {gargalo real}

> {veredito}

{corpo, citando EV}

{custo_de_discordar}

## Os três primeiros

### 1 · {id} — {título}

| Pilar | Papel | Complexidade | Confiança | Impacto | Score |
|---|---|---|---|---|---|
| {pilar} | {papel} | {cx} | {conf} | {imp} | {score}/100 |

**Problema identificado.** {problema, com EV}

**Transformação proposta.** {IA faz X, humano aprova Y antes de Z}

**Resultado esperado.** {estado final, como hipótese}

**Primeira ação.** {um passo analógico, hoje}

**Dependência.** {id} · {título} ({motivo})   <- só quando houver

**Por que isso foi recomendado?** Porque durante seu diagnóstico você informou:

> **EV-nn** — "{texto literal}"
> *(confiança baixa · {motivo})*   <- só quando não for alta

*Impacto financeiro precisa ser validado. Nenhum número acima foi inventado.*

### 2 · … (mesma estrutura)
### 3 · … (mesma estrutura)

## Entram em sequência

- **{id}** {título} — depende de {id} · {motivo}

## Seu portfólio

### Criar · {n} — conhecimento vira ativo
- {id} {título} · {score}/100

### Automatizar · {n} — IA executa, humano aprova
### Escalar · {n} — o que já gira, gira maior

> O pilar de ESCALAR ficou vazio de propósito: {motivo}   <- pilar vazio nunca some

## Bloqueadas por falta de dado

### {título}
- **Falta:** {dado que não existe, com EV}
- **Destrava com:** {id} · {título}
- **Para:** {o que será possível decidir}

*Estas não são promessas. São hipóteses que só existem quando o dado existir.*

## Rejeitadas pelo crítico

### {título} · {redundância|sequência|risco}
{motivo, citando EV}

## Onde a IA não é a resposta para você

### {título}
{porque, citando EV}

## Se esse negócio fosse meu

{uma frase em primeira pessoa, reafirmando a arbitragem}
```

---

## 2. `plano-diretor.html`

Copie `references/render.html` para o diretório da pessoa com o nome `plano-diretor.html` e substitua o marcador pelo JSON do plano.

O arquivo tem esta linha:

```js
/*__PLANO__*/const PLANO = null;/*__/PLANO__*/
```

Troque o miolo entre os marcadores por `const PLANO = { … };` com o objeto completo. Mantenha os marcadores — eles permitem regerar o painel depois sem refazer o arquivo.

### Estrutura do objeto

```js
const PLANO = {
  pessoa: "",
  funil: { candidatas:0, aprovadas:0, sem_dado:0, rejeitadas:0, exibidas:3 },
  arbitragem: { titulo:"", veredito:"", corpo:"", custo_de_discordar:"", evidencias:[] },
  pilares: [ { pilar:"CRIAR", tese:"conhecimento vira ativo", total:0 } ],
  pilares_vazios: [ { pilar:"ESCALAR", motivo:"" } ],
  evidencias: [ { id:"EV-01", fonte:"", confianca:"alta", motivo_confianca:"", texto:"" } ],
  oportunidades: [ {
    id:"C1", ordem:1, titulo:"", pilar:"CRIAR", papel:"HABILITADOR",
    complexidade:"Baixa", confianca:"Alta", horizonte:"Agora", impacto:"Alto",
    score:100, quadrante:"QUICK WINS", janela:"0-30",
    problema:"", transformacao:"", resultado:"", primeira_acao:"",
    depende_de:null, motivo_dependencia:null, evidencias:["EV-01"]
  } ],
  sem_dado: [ { titulo:"", falta:"", destrava_com:["C1"], para:"" } ],
  rejeitadas: [ { titulo:"", motivo_tipo:"redundância", motivo:"", evidencias:[] } ],
  onde_ia_nao_resolve: [ { titulo:"", porque:"", evidencias:[] } ],
  fecho: { texto:"", reafirma:"arbitragem.veredito" }
};
```

Regras que o render depende:

- `complexidade` só aceita `Baixa` · `Média` · `Alta`; `impacto` só aceita `Baixo` · `Médio` · `Alto`. Fora disso o ponto some da matriz.
- Todo `id` citado em `depende_de` e em `destrava_com` precisa existir em `oportunidades`.
- Toda `EV-nn` citada em `evidencias` precisa existir na lista `evidencias`.
- `ordem` controla o roadmap; `score` controla a ordem dentro do pilar.

O arquivo é autocontido: abre com duplo clique, sem servidor, sem internet.

---

## Ao entregar

1. Envie os dois arquivos com a ferramenta de envio de arquivo.
2. Diga onde eles estão no computador da pessoa.
3. Feche com uma frase só: qual é a primeira ação do item nº 1.

Não resuma o plano no chat. O plano é o arquivo — repetir no chat ensina a pessoa a não abrir.
