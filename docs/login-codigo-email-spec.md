# Email code sign-in — v1

Status: approved 2026-10-02 (option 1: no pre-check, no secret key; course only). Requested on 2026-10-02.

## User direction

Add a second way to sign in next to Google: a 6-digit code sent by email. **Course only** (`/login` → `/claude-do-zero`). Jaya's correction, 2026-10-02: Zona de Genialidade, Arquitetura da Consciência and the library keep Google-only sign-in. The server actions hard-code the course destination, so a direct call cannot use a code on another door.

## Why

Authorization is already by email (`alunos_claude`, `acessos_produtos`), not by provider. Buyers whose purchase email is not a Google account (Outlook, iCloud, corporate) cannot enter today, even when they are on the allowlist.

A code typed in the same tab was chosen over a magic link: with PKCE, a link opened in the mail app's in-app browser on mobile loses the code verifier and fails. Password was rejected for the extra reset/signup surface.

## Flow

1. Login screen shows the Google button and, below it, "Receber código por e-mail".
2. Student types the email → server action `pedirCodigo` → `auth.signInWithOtp({ email, shouldCreateUser: true })`. No allowlist pre-check: anyone may receive a code, exactly as anyone may sign in with Google today. Authorization happens after the code, never before.
3. Student types the code → server action `verificarCodigo` → `auth.verifyOtp({ email, token, type: 'email' })` → same door authorization the Google callback uses → redirect to destination, or `sem-acesso` + sign-out.
4. Same email in Google and code resolves to the same Supabase user (identities are linked by email).

## Architecture

| Piece | Change |
| --- | --- |
| `app/lib/autorizar-entrada.ts` | **New.** Door authorization extracted from `auth/callback/route.ts` (course allowlist + access log, Zona, Consciência, library). Single source of truth for both methods. |
| `app/auth/callback/route.ts` | Refactor to call `autorizarEntrada`. Behavior unchanged. |
| `app/login/acoes-codigo.ts` | **New.** Server actions `pedirCodigo` and `verificarCodigo`. |
| `app/login/EntrarComCodigo.tsx` | **New.** Client component, two steps (email → code), `inputMode="numeric"`, `autoComplete="one-time-code"`, resend after 60 s, "trocar e-mail". |
| `app/login/page.tsx` | Renders the new component only when the destination is the course; course instruction copy says "e-mail" instead of "conta Google". |
| `middleware.ts` | No change. `/login` and `/biblioteca/*` are already outside the matcher, so the server-action POSTs pass. |
| `docs/acesso-com-google.md` | Section on the code method + manual configuration. |

### Why no allowlist pre-check

Jaya's call, 2026-10-02: keep her workflow identical to today — add the email to the existing table (`alunos_claude` via `/admin`, or `acessos_produtos` for invite products) and nothing else. A pre-check would need a privileged key on the server (RLS limits SELECT to the user's own row) or an `anon` RPC that reveals who is a student. Without it, a non-allowlisted email receives a code and lands on `sem-acesso`, the same outcome as a Google account without an invite.

## Manual configuration (Jaya)

1. **Custom SMTP** (Supabase → Authentication → Emails → SMTP). The default sender caps at ~2 emails/hour — unusable with a class. Suggested: Resend with `jayaroberta.com` verified (SPF/DKIM records at Hostinger).
2. **Magic Link template** must show `{{ .Token }}` in the body. Copy in Jaya's voice; I draft it.
3. **OTP expiry**: 600 s (default is 3600).

### Shared-project impact (checked 2026-10-02)

This Supabase project also serves other apps. `auth.identities`: 37 Google users, 5 `email` users — all 5 with password. So:

- Magic Link template change: **no impact** on the other app (password sign-in sends no magic link).
- Custom SMTP: **does affect** the other app's confirmation and password-reset emails (new sender). Delivery improves; sender name/domain changes.

## Boundaries

No change to RLS, tables, admin panels, `AUTH_SECRET` cookie or middleware. No password sign-in, no self sign-up: entering still requires an active allowlist row. Zona, Consciência, library and Atlas keep their own doors, Google-only.

## Acceptance

1. Allowlisted email (course) receives a code and lands on `/claude-do-zero`; an access row is written to `acessos_claude`.
2. Non-allowlisted email receives a code and, after typing it, is signed out and sent to the door's `sem-acesso` page.
3. `/login?next=` for Zona or Consciência and `/biblioteca/entrar` show no code option; their Google flow is unchanged.
4. Wrong or expired code shows a clear message and allows retry; resend is disabled for 60 s.
5. Google sign-in on all four doors behaves exactly as before (regression; the callback now calls the shared `autorizarEntrada`).
6. A student who entered with Google and later with a code is the same user (same `auth.users.id`).
7. Deactivating a student still cuts access within 10 minutes, regardless of method.
8. Works at 320/390 px, keyboard-only, and with the OS code autofill on iOS/Android.
9. No new secret, table or environment variable.
10. Typecheck and production build pass; `acesso-auditor` review with no high-severity finding before commit.

## Risks

- **Email abuse** (the site sends a code to any address typed). Mitigation: Supabase per-email 60 s throttle and project hourly email limit. Revisit with a pre-check if auth logs show abuse.
- **Orphan auth users** for non-allowlisted emails that requested a code. Harmless (no access); same as Google sign-ins without invite today.
- **Spam folder.** Mitigation: verified domain in SMTP; on-screen hint to check spam after 2 minutes.
