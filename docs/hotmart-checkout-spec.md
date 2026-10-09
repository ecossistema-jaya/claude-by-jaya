# Hotmart checkout and automatic access — spec v0 (DRAFT)

Status: **decisions answered 2026-10-08; phase 1 (page) built on branch `feat/oferta-hotmart`. Phase 2 (webhook) built 2026-10-09: Edge Function `hotmart-webhook` and migration `20261009120000_hotmart_eventos` are live on the Supabase project, tested end to end with Hotmart's sandbox event (payload confirmed: hottok in header `x-hotmart-hottok`, fields under `data.buyer`, `data.purchase`, `data.product`); `/obrigada` and the `/sem-acesso` line are in the code. Pending: site deploy, Hotmart thank-you URL, one real purchase.**
Supersedes the commercial rules of `oferta-spec.md` 1.1 (Pix by WhatsApp, two offers, Sessão, "no guarantee"). That file also still says the offer lives at `/claude-do-zero`; the code (`middleware.ts`, `acesso-com-google.md`) says `/claude` is the public page and `/claude-do-zero` is the student area. Fix the old spec's route when this one is approved.

## Why

Today a purchase takes three manual steps and up to 24 hours: WhatsApp for the Pix data, proof of payment plus email, then Jaya adds the email in `/admin`. Measured on the sales-page copy (Jev, two runs): purchase friction 2.5-2.8 out of 3, the largest remaining gap. The same flow sends no purchase event to Meta, so ads cannot optimize for sales.

## Current state (verified in code, 2026-10-08)

- **Public page:** `/claude`, built from `originais/claude-do-zero.html` by `scripts/build-oferta.mjs` into `public/oferta/`. CTAs are `wa.me` links; Vercel Analytics event `oferta_whatsapp`.
- **Authorization:** one active row in `alunos_claude` (`id, email, nome, papel, ativo, observacao, criado_em, criado_por`; email unique, stored lowercase). Only `papel = 'admin'` can write (RLS). Gate: `middleware.ts` -> `buscarAluno`, cached in a signed cookie for 10 minutes.
- **Sign-in:** Google, or a 6-digit email code (since 2026-10-02, course only). Authorization is by email, not provider, so a buyer's Hotmart email does **not** need to be a Google account.
- **Manual path:** `/admin` -> add student. Stays as the fallback.

## Goals

1. Payment confirmed -> access granted within about a minute, with no action from Jaya.
2. Card installments and Pix handled by Hotmart.
3. Refund, chargeback or cancellation revokes access.
4. Manual `/admin` path keeps working unchanged.
5. A real purchase event exists for Meta Ads (wired in a later story).

## Non-goals

Hotmart members area; other products (Zona, Biblioteca, Atlas keep their own invites); Pixel installation; coupons, bumps, affiliates; any change to the login screens.

## Decisions (answered by Jaya, 2026-10-08)

1. **Go on Hotmart:** yes. Card in up to **6 installments**, plus Pix. Price R$ 297.
2. **Guarantee:** **7 days.** Hotmart sets 7 days as the legal minimum (CDC art. 49). Jaya wrote "sem os bônus": **ambiguous, to confirm.** Reading used in this spec: a refund revokes the whole product, bonuses included (the bonuses are tools inside the same access). If it means the offer has no bonuses, the page and acceptance criteria change.
3. **Fee:** accepted. Third-party sources give 9.9% + R$ 1.00 per approved sale up to R$ 99,999/year, possibly a R$ 2.49 fixed fee from 2026-09-21 (sources disagree), plus 3.49%/month on buyer installments (passed to the buyer or absorbed). On R$ 297 that is about R$ 30-32. **Check the live table in the Hotmart panel**; simulate the 6x line before fixing the price.
4. **Repeat buyer:** yes, a new approved purchase reactivates an inactive row. All current students already paid, so no existing row is touched by a refund unless Hotmart granted it (criterion 6).
5. **WhatsApp:** kept as a support link on the page, not as checkout.

## Where the page lives, and which account

**The page stays at `jayaroberta.com/claude`.** Hotmart's help center documents an "external sales page": in the product, Página do produto > Sua página externa > Configurar página, paste the URL, and put a buy button on the page that points to the Hotmart payment link. The buyer reads the page on our domain and pays on Hotmart's checkout. Nothing moves into Hotmart. One limit to know: a Hotmart checkout link shows one offer at a time, which fits our single R$ 297 offer.

**Delivery stays external.** Hotmart supports an external members area (third-party guides place the switch under Produtos > Gestão do curso). Access is released by our system when Hotmart's webhook arrives (phase 2), or by hand in `/admin` (phase 1).

**Account: reuse the existing producer account** (the one that sells the planners). One Hotmart account can sell many products. No official rule was found about two producer accounts for the same CPF, so do not create a second one without asking Hotmart support. Trade-offs of sharing: refund and chargeback rates are per account, and revenue from both products sits in one panel (filter by product). A new account only makes sense if the course must be billed under a different legal entity or bank account; that is a question for the accountant and for Hotmart support.

**Product review:** after registration Hotmart reviews the product, typically ~15 minutes up to one business day. The webhook can be configured per product, and the function also filters by `HOTMART_PRODUCT_ID`, so planners sales never touch this flow.

**Existing code:** a search of `Ayla-AI` and `Jaya_Hub_Page` found no Hotmart webhook handler, so there is nothing to reuse. The real payload comes from a test event (see below).

Sources are the Hotmart help center and third-party guides; confirm each screen in the panel during H-1.

## Webhook facts still unconfirmed

A search found no public page with the v2 payload or the hottok header. Hotmart's webhook screen has a History tab showing each payload and the response, and a test-event button: use it to capture the real payload before writing the parser.

## Approaches

| | Approach | Pros | Cons |
|---|---|---|---|
| **A (recommended)** | Supabase **Edge Function** receives the Hotmart webhook and writes `alunos_claude` | The privileged key stays inside Supabase, not in Vercel; Next.js app untouched; independent deploy | New runtime (Deno), new deploy path, new table to audit |
| B | Next.js route `/api/hotmart` with a service key in Vercel env | One codebase, one deploy | Highest-privilege key of a **shared** Supabase project (also serves other apps) lives in Vercel env |
| C | Hotmart checkout only; Jaya adds the email in `/admin` when Hotmart's sale email arrives | Live in a day, no new code beyond the page | Access still waits on Jaya; no revoke on refund |

**Rollout:** C first as phase 1 (page + Hotmart product, release by hand), A as phase 2. Phase 1 already removes the payment friction. Phase 2 removes the wait.

## Design (approach A)

```text
Buyer -> Hotmart checkout -> payment approved
Hotmart -> POST https://<project>.supabase.co/functions/v1/hotmart-webhook   (header X-HOTMART-HOTTOK)
Edge Function: validate token -> validate product id -> dedupe -> upsert alunos_claude -> log
Buyer lands on /obrigada -> signs in with the purchase email (Google or code) -> /claude-do-zero
```

**Webhook contract.** Hotmart webhook v2: event name, buyer email and name, transaction id, purchase status, product id, and the `X-HOTMART-HOTTOK` header. Field paths below follow the v2 payload as I know it. **Confirm against the current Hotmart docs and a test event from the panel before coding.**

| Hotmart event | Action |
|---|---|
| `PURCHASE_APPROVED` | Grant access |
| `PURCHASE_COMPLETE` | Log only |
| `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_CANCELED` | Revoke **only** if this transaction granted the access (see `hotmart_eventos`) |
| anything else | Log only, respond 200 |

**Grant rule** (email lowercased with the same normalizer as `normalizarEmail`):
- no row -> insert `papel = 'aluno'`, `ativo = true`, `criado_por = 'hotmart'`, `observacao = 'hotmart:<transaction>'`;
- row exists, `papel = 'admin'` -> change nothing;
- row exists, `papel = 'aluno'` -> `ativo = true`, keep `nome`, append the transaction to `observacao`.

**New table `hotmart_eventos`** (RLS on, no policies, service role only): `id uuid pk`, `transacao text`, `evento text`, `email text`, `produto_id text`, `resultado text`, `recebido_em timestamptz default now()`, `unique (transacao, evento)`. It gives idempotency (Hotmart retries), an audit trail, and the link needed to revoke only what Hotmart granted. No full payloads stored.

**Security.**
- Compare the hottok in constant time; wrong token -> 401.
- Accept only the configured `HOTMART_PRODUCT_ID`; other products -> 200 and ignored.
- Return 200 for handled and ignored events, 5xx only for transient failures so Hotmart retries.
- `verify_jwt = false` on this one function (Hotmart cannot send a Supabase JWT); the hottok is the only gate, so keep the function minimal.
- Secrets: `HOTMART_HOTTOK`, `HOTMART_PRODUCT_ID`, and a server key. The project migrated from legacy JWT keys to `sb_publishable_` / secret keys (see `acesso-com-google.md`); **verify which server key the function receives** and that `service_role` still has table privileges on `alunos_claude` and `hotmart_eventos` (the 2026-08-21 incident lost grants).
- Never log the email list or full payload.

**Buyer experience.**
- Hotmart post-purchase redirect -> new public page `/obrigada`: "Sua entrada está sendo liberada. Entre com o e-mail da compra, pelo Google ou por código." Add it outside the middleware matcher.
- `/sem-acesso` gets one extra line: "Comprou agora há pouco? Aguarde um minuto e tente de novo."
- Hotmart confirmation email gets the same instruction and the `/login` link.

**Sales page** (`originais/claude-do-zero.html`, separate story): CTAs point to the Hotmart checkout URL; the "Depois do Pix" three-step block is replaced by "Depois da compra"; the R$ 697 plan, the Sessão link and the "Quero com a Sessão" button are removed; guarantee section added; copy from `analise-pv/pv-claude-reescrita.md`; analytics event `oferta_whatsapp` becomes `oferta_checkout`, WhatsApp keeps `oferta_whatsapp` for the support link.

## Stories

| # | Story | Owner | Estimate |
|---|---|---|---|
| H-1 | Create the Hotmart product: price, installments, guarantee, webhook URL and hottok, thank-you URL, send a test event, note the product id | Jaya | ~30 min |
| H-2 | Migration `hotmart_eventos`, Edge Function, secrets, unit tests with fixture payloads | @dev + @data-engineer | ~2 h |
| H-3 | `/obrigada` page and `/sem-acesso` copy | @dev | ~30 min |
| H-4 | Sales page rewrite and CTA swap | @dev | ~2 h |
| H-5 | End-to-end check: approved, duplicate event, refund, wrong token, other product | @qa | ~1 h |

Phase 1 = H-1 + H-4. Phase 2 = H-2 + H-3 + H-5. Deploy of `claude-by-jaya` follows `RUNBOOK.md` (push by @devops).

## Acceptance criteria

1. A `PURCHASE_APPROVED` test event for a new email creates one active `alunos_claude` row, and signing in with that email by code reaches `/claude-do-zero`.
2. The same event sent twice creates one row and one `hotmart_eventos` record.
3. Wrong hottok -> 401 and no write.
4. An event for another product id -> 200 and no write.
5. `PURCHASE_REFUNDED` for a transaction that granted access sets `ativo = false`; access ends within 10 minutes (cookie TTL).
6. Refund for an email Jaya added manually (no Hotmart grant) changes nothing.
7. An existing `admin` row is never downgraded or deactivated.
8. `/obrigada` loads without a session; `/sem-acesso` shows the new line.
9. The page has no Sessão, no R$ 697, no Pix-by-WhatsApp steps; the CTA opens the Hotmart checkout; the support link opens WhatsApp.
10. Manual `/admin` add, deactivate and reactivate behave exactly as before. `npm run build` passes on a mirror without `originais/`.

## Risks

- **Webhook field names or hottok scheme differ from my notes.** Mitigation: fixture from a real test event before writing the parser.
- **Server key or grants wrong after the API-key migration.** Mitigation: first test is a write from the function to both tables.
- **Buyer arrives before the webhook.** Mitigation: `/obrigada` copy and the `/sem-acesso` line; typically seconds.
- **Typo in the checkout email.** The buyer cannot sign in. Mitigation: support link; Jaya fixes the email in `/admin`.
- **Fee and reduced personal contact.** Accepted trade-off, decision 3.

## Rollback

Point the CTAs back to WhatsApp and rebuild; disable the webhook in the Hotmart panel; students already granted keep access. `/admin` keeps working throughout.
