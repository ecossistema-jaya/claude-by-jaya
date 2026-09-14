# Página de oferta — `/claude-do-zero` · spec 1.0

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
| Imagem | só `img/login.webp` e `img/og.jpg`, que já são públicas. Nenhuma arte de aula sai do login |
| Preço | constantes no topo do HTML: `PRECO`, `PRECO_LANCAMENTO`, `BUNDLE`, `BUNDLE_LANCAMENTO`, `FIM_LANCAMENTO` |
| Pós-prazo | passado `FIM_LANCAMENTO`, a página mostra o preço cheio e some com o riscado — sem deploy |
| CTA | `wa.me/5561992634557` com texto pré-preenchido, um por oferta |
| Garantia | não declarada |
| Rastreio | `@vercel/analytics` não roda em HTML estático; sem tracking nesta versão |

## Critérios de aceite

1. `curl -sI https://claude-by-jaya.vercel.app/claude-do-zero` → 200, `text/html`, sem redirect para `/login`.
2. Prévia de link (WhatsApp/Instagram) mostra título, descrição e `og.jpg`.
3. Antes de 21/09 23:59 (America/Sao_Paulo): "R$ 197" em destaque com "R$ 297" riscado. Depois: só "R$ 297".
4. Os dois CTAs abrem o WhatsApp com a mensagem da OFERTA.md.
5. Legível a 390px de largura; nenhum scroll horizontal.
6. `npm run build` passa num espelho sem `originais/` (script sai com 0 mantendo `public/oferta/`).
7. Link "Já sou aluna → entrar" leva a `/login`.
