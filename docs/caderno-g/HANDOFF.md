# HANDOFF — Caderno G · Claude do Zero

> Caderno operacional de VENDAS do Claude do Zero, para Caderno Inteligente G, no modelo do
> Kit Operacional da Sessão Estratégica (`d:\Projetos-Jaya\EMERGENCIA\Kit-Operacional-Sessao-IA-Jaya-Caderno-G-200x275mm-capa.docx`).
> Gerado em 2026-09-17. Spec de formato: `PROMPT-CADERNO-G.md`. Fonte dos números: `BusinessJaya/meus-produtos/claude-do-zero/lancamento/OFERTA.md`.

## Árvore

```
docs/caderno-g/
├── PROMPT-CADERNO-G.md                        spec do formato
├── esqueleto-caderno-g.doc                    template genérico (paleta Google)
├── converter-docx.ps1                         fonte .doc -> .docx via COM do Word (SÓ pwsh 7)
├── gerar-html.py                              fonte .doc -> .html de tela
├── HANDOFF.md                                 este arquivo
├── _fonte/
│   ├── claude-do-zero-vendas-caderno-g-fonte.doc   FONTE do caderno de VENDAS (o pedido)
│   └── claude-do-zero-caderno-g-fonte.doc          fonte de um caderno de ESTUDO da aluna (escopo errado da 1ª leitura; ver pendência 1)
├── claude-do-zero-vendas-caderno-g.docx       ENTREGÁVEL · 24 páginas · 4.842 palavras · 200 x 275 mm
├── claude-do-zero-vendas-caderno-g.html       entregável · leitura em tela
├── claude-do-zero-caderno-g.docx              caderno de estudo · 26 páginas (escopo errado)
└── claude-do-zero-caderno-g.html              idem
```

## O que editar onde

| Quero mudar | Edite | Depois rode |
|---|---|---|
| Texto, tabela, mensagem, ficha | `_fonte/claude-do-zero-vendas-caderno-g-fonte.doc` | os dois comandos abaixo |
| Preço, prazo, chave Pix | primeiro `OFERTA.md` no BusinessJaya, depois a fonte (seções 01, 03, 04, 05) | idem |
| Cores | tokens no `<style>`: marsala `#86050C`, cobre `#DF6E36`, areia `#F1DABF`, carvão `#2B2320` | idem |
| Folha / margens | **não mexer** no `@page Section1` | — |
| Aparência só na tela | `SCREEN_CSS` em `gerar-html.py` | só o `.html` |

```
pwsh -File converter-docx.ps1 -Fonte "_fonte\claude-do-zero-vendas-caderno-g-fonte.doc" -Saida "claude-do-zero-vendas-caderno-g.docx"
python gerar-html.py _fonte/claude-do-zero-vendas-caderno-g-fonte.doc claude-do-zero-vendas-caderno-g.html
```

Revisões: script Python `troca(antigo, novo, rótulo)` com âncora exata conferida por grep; âncora em `<td>`, nunca em `<tr>`; `.bak` antes de gravar; guardas: h2 = 9, um `</html>`, zero `—`, zero `!` fora de comentário HTML, 15 blocos `code msg`.

## Estrutura (h2 = 9, espelha o kit da Sessão)

| N. | Seção | Conteúdo |
|---|---|---|
| 01 | Arquitetura da oferta | promessa, tabela de preço (cheio/lançamento, curso/pacote), o que entra, fit/não encaixe, jornada em 8 etapas (Interesse → Prova), peças já publicadas |
| 02 | Prospecção | 6 fontes por temperatura, rotina 2×15 min, 3 perguntas de qualificação, contagem por origem 14–21 |
| 03 | Mensagens de WhatsApp | 15 textos: CTA, sem contexto, 3 objeções, follow-up 24h, e-mail Google, liberado, agendar Sessão, D+2, D+7, depoimento, upsell Sessão, pós-prazo, reembolso |
| 04 | Pagamento e liberação | fluxo comprovante → `/admin` → mensagem 8; tabela de conferência do Pix; passo a passo do `/admin`; problemas de login; pendentes |
| 05 | Controle de vendas | regras do funil, 11 status com próxima ação, painel mínimo diário, meta (10/25/50 alunas) |
| 06 | Validação do curso | oferta × curso × promessa; marcos por aluna (dia 0, D+2, D+7, D+30, prova); 7 hipóteses do lançamento; acompanhamento 20 alunas; definição de validado; registro de objeções |
| 07 | Checklist da vendedora | diário manhã/noite, domingo 21, segunda 22, semanas seguintes |
| 08 | Indicadores e aprendizado | 11 indicadores com meta inicial, registro pós-rodada, próxima camada |
| 09 | Fichas | 3 fichas de lead, registro de vendas 1–50 (2 páginas), diário da rodada, perdidas, depoimentos, próxima rodada |

## Fatos verificados que não devem ser revertidos

1. Preços: R$ 297 / R$ 197 (curso), R$ 697 / R$ 597 (pacote), Sessão avulsa R$ 497. Fonte: OFERTA.md.
2. Prazo: seg 14/09 a dom 21/09 23h59, ou 50 alunas. Depois, preço cheio para sempre. **R$ 197 não volta** (decisão registrada em OFERTA.md).
3. WhatsApp 5561992634557. Página `claude-by-jaya.vercel.app/claude-do-zero` muda de preço sozinha após `FIM_LANCAMENTO` (spec `docs/oferta-spec.md`).
4. Liberação: `/admin` → e-mail Google → `acessos_produtos` (unique produto+email). Mensagem "já está na lista" = e-mail já tinha acesso. Fonte: `app/admin/acoes.ts`, `docs/sql/acessos-produtos.sql`.
5. Mensagens 1 e 8 são a "Resposta padrão" e o "Depois do comprovante" do OFERTA.md, sem alteração de sentido. Mensagem 9 é a frase do bundle do OFERTA.md.
6. E-mails: 14/09 abertura, 17/09 objeção ChatGPT, 21/09 fecha hoje; lista `leads_zng` (Supabase). Fonte: EMAILS.md.
7. Garantia não declarada; CDC 7 dias honrado sem anunciar (OFERTA.md). Mensagem 15 e box de reembolso seguem isso.
8. Metas iniciais (D+2 ≥ 60%, Doc. Mestre D+7 ≥ 50%, mix pacote ≥ 20%, reembolso ≤ 10%, 3 depoimentos) são **propostas minhas**, não números da Jaya. Ajustar antes de imprimir se discordar.
9. Sem travessão, sem exclamação no corpo (único `&mdash;` na linha Formato da capa, herdado do esqueleto).

## Pendências

1. **Caderno de estudo da aluna** (`claude-do-zero-caderno-g.*` e sua fonte) foi gerado por leitura errada do pedido. Descartar, mover para `docs/caderno-g/_arquivo/` ou manter como material da aluna: decisão da Jaya. Não deletei (regra 4).
2. **Chave e titular do Pix** não estão em nenhuma fonte do repo; na mensagem 1 ficam como `[chave]` e `[titular]`. Preencher à mão ou no OFERTA.md.
3. **Revisão impressa**: conferir se a tabela "Registro de vendas" (25 linhas por página) cabe sem quebrar e se a "Contagem por origem" (10 colunas) fica legível a 9pt.
4. **Ficha de lead**: só 3 por caderno. Se o volume passar de 3 leads/dia, fotocopiar a página 9.1 ou levar a ficha para a planilha `Controle-5-Vagas-Sessao-IA-Jaya.xlsx` adaptada.
5. **Landing diz "26 perguntas + 5 opcionais"; ferramenta viva diz 43.** Não afeta este caderno, mas afeta o que a vendedora promete no direct. Alinhar antes do e-mail 3.
6. **Cabeçalho/rodapé com numeração** não definidos (esqueleto não traz). Inserir no Word após conversão se quiser.
