# Página de oferta — `/claude-do-zero` · spec 1.1

Decidido em 2026-09-13. Fonte dos números: `BusinessJaya/meus-produtos/claude-do-zero/lancamento/OFERTA.md`.

## Por quê

Até aqui o site só tem porta fechada (`/login`) e a Zona. Quem chega pelo story cai no login
sem saber o que está comprando. A página é a vitrine pública do curso: preço, o que entra,
CTA para o WhatsApp.

## Decisões

| Decisão | Estado |
|---|---|
| Rota | `/claude-do-zero` → `public/oferta/index.html`, rewrite igual à Zona e ao deck |
| Fonte | `originais/claude-do-zero.html`, publicada por `scripts/build-oferta.mjs` |
| Acesso | pública; `middleware.ts` libera `claude-do-zero` e `oferta/` |
| Visual | paleta do curso (`app/globals.css`: areia, marsala, cobre, Petrona/Jost), não a SAND da Zona |
| Imagens | capturas reais da área da aluna, do Mapa de Autoconhecimento e de uma aula prática em `public/oferta/img/` |
| Formato | aulas visuais, slides guiados, exercícios e ferramentas interativas; não é apresentado como curso de videoaulas |
| Mapa | 26 perguntas + 5 opcionais, Zona de Genialidade, gráficos, hipóteses e Carta de Travessia simbólica |
| Preço | constantes no topo do HTML: `PRECO`, `PRECO_LANCAMENTO`, `BUNDLE`, `BUNDLE_LANCAMENTO`, `FIM_LANCAMENTO` |
| Pós-prazo | passado `FIM_LANCAMENTO`, a página mostra o preço cheio e some com o riscado — sem deploy |
| CTA | `wa.me/5561992634557` com texto pré-preenchido, um por oferta |
| Sessão | o pacote inclui link explicativo para `https://jayaroberta.com.br/sessao-estrategica-ia` |
| Pós-Pix | instruções em três passos: pagamento, envio do comprovante + e-mail Google e liberação em até 24 horas |
| Garantia | não declarada |
| Rastreio | script do Vercel Web Analytics no HTML estático; eventos `oferta_whatsapp` com oferta/posição e `oferta_sessao_detalhes`, sem dados pessoais |

## Critérios de aceite

1. `curl -sI https://claude-by-jaya.vercel.app/claude-do-zero` → 200, `text/html`, sem redirect para `/login`.
2. Prévia de link (WhatsApp/Instagram) mostra título, descrição e `og.jpg`.
3. Antes de 21/09 23:59 (America/Sao_Paulo): "R$ 197" em destaque com "R$ 297" riscado. Depois: só "R$ 297".
4. Os dois CTAs abrem o WhatsApp com a mensagem da OFERTA.md.
5. Legível a 390px de largura; nenhum scroll horizontal.
6. `npm run build` passa num espelho sem `originais/` (script sai com 0 mantendo `public/oferta/`).
7. Link "Já sou aluna → entrar" leva a `/login`.
8. A página informa “26 perguntas + 5 opcionais” e apresenta o novo Mapa de Autoconhecimento e Zona de Genialidade.
9. As três imagens reais carregam na rota pública sem exigir login.
10. A página explica o fluxo após o Pix e o prazo de liberação de acesso.
11. O link de detalhes da Sessão Estratégica abre em nova aba.
12. Cada CTA do WhatsApp dispara `oferta_whatsapp` antes de abrir a conversa.
