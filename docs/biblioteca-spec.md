# Claude by Jaya Library — v0

Status: published and verified at `https://jayaroberta.com/biblioteca` on 2026-09-15. Requested on 2026-09-14.

## User direction

Create the library in this repository, exclusively targeting `https://jayaroberta.com/biblioteca`. The existing BusinessJaya library on `.com.br` is a different site and is outside this implementation.

## Product

An independent, free Portuguese library for learning to work with Claude. Nine environments grouped into Foundation (Conversar, Organizar, Criar), Expansion (Ensinar, Conectar, Delegar), and Autonomy (Automatizar, Construir, Orquestrar). These are navigable capabilities, not compulsory prerequisites or a promise of unsupervised work.

Audience: professionals starting with Claude or extending their practical use. Entry point: a real task they want to complete. Outcome: find an appropriate guide, perform its exercise, and review the result against explicit criteria.

## Authorized first version

- Public `/biblioteca` and `/biblioteca/[slug]` in this Next.js application.
- Editorial homepage, illustrated architectural map with accessible links, nine environments, and three featured starting points.
- Catalog search ignoring accents/case, environment and level filters, result count, empty state and reset.
- Nine original local guides: one per environment. The first guide expands the first-conversation-to-first-delivery draft.
- Reader with catalog navigation, table of contents, prerequisites, outcomes, exercises, copyable prompts, sources, dated review, Markdown download and print support.
- Metadata targets the user's `.com` domain. An original generated Open Graph image belongs to this library.
- Reuse the existing Petrona/Jost fonts; isolated cream/chocolate/copper/burgundy/petrol styling.
- Small, precise middleware exclusion for the library only.

## Boundaries

No changes to the existing home, paid lessons, login, student permissions or BusinessJaya repository. No new authentication, database, CMS, newsletter submission, ranking, invented testimonials, or inferred learning progress. The initial guides are original public materials, not copies of paid lessons. External sources remain attributed links.

The user confirmed ownership of `jayaroberta.com` at Hostinger and explicitly authorized connecting it to this Vercel project. The domain is now attached to production, DNS is configured, and HTTPS is verified. Publication used an isolated source package containing only the library changes and the precise middleware exception.

## Acceptance

1. Anonymous access returns the library and all nine guides, without login or database access.
2. `/biblioteca-privada`, course routes, and existing protected content remain protected.
3. Unknown guide slugs return 404.
4. Every environment has a real local guide, each with an outcome, exercise and review criteria.
5. Search matches accents/case consistently; combined filters and reset work; empty state is actionable.
6. Prompt copying reports success or gives a usable manual fallback; Markdown download contains the current guide.
7. Navigation, filters, prompts and article headings work with keyboard and at 320/390 px, with no page-level horizontal scrolling.
8. Reduced motion disables decorative animation; print excludes navigation and controls.
9. Library canonicals use `https://jayaroberta.com/biblioteca`; course metadata remained unchanged in the initial library release (the later authorized `/claude` change is documented below).
10. TypeScript, production build, route boundary checks and browser checks pass, followed by code review.

## Editorial references

The four user-provided proposals supply the nine-environment concept and preferred visual direction. Daylight Computer informs spatial rhythm; GitBook informs navigation; Claude Academy informs resource discovery. Copy, layout and exercises are original. No vendor affiliation is claimed.

## Measuring usefulness

Validate by asking a reader to find a relevant guide, execute the exercise and use its checklist. Record difficulty finding content and points requiring rework. No time-savings claim is made without a measured baseline. If no guide matches, show an explicit empty state with reset; if clipboard permission fails, provide manual selection.

## Verification and release handoff — 2026-09-15

- Direct Next.js production build passed: compilation, lint/types and 29 generated pages. The normal npm build was deliberately not run locally because its scripts regenerate existing course artifacts.
- All nine guides return 200 with their article and `.com` canonical; all nine Markdown downloads return UTF-8 attachments containing the guide title and checklist. Unknown guides and downloads return 404.
- Existing protected paths `/`, `/aula-1`, `/recursos`, `/biblioteca-nao-publica` and `/img/capa.webp` still redirect to login. The library OG image returns a valid PNG.
- Browser checks passed for combined filters, accent/case search, empty/reset, prompt copy and table-of-contents navigation. Home and reader have no horizontal overflow at 320 px and 390 px. Print styling was reviewed; the operating-system print dialog was not exercised.
- Final independent code review approved with no blockers. Markdown uses an HTTP download route; an actual browser download event was confirmed on the public first guide after publication, and all nine attachment responses passed HTTP checks.
- Local preview: `http://127.0.0.1:3007/biblioteca`.
- Isolated release source: `C:\Users\Jaya\AppData\Local\Temp\jaya-biblioteca-release-20260915-000604\source`, assembled from Git HEAD `c66e7db` plus `app/biblioteca/` and `middleware.ts`. No unrelated untracked files or personal asset folders were copied.
- Linked project: `claude-by-jaya`, project ID `prj_94mfgI9A6fWDvecwBjJud9DVPQdA`, team ID `team_m0hl9Q0OggsBEZYXWmAj2PGr`.
- CLI HTTPS requires `node --use-system-ca` on this Windows host. Certificate validation remains enabled. Authentication was renewed through the official device login; `whoami` confirmed `betinhapotter`, and the project API returned 200. Use explicit `--global-config C:\Users\Jaya\AppData\Roaming\xdg.data\com.vercel.cli` and `--scope betinhapotters-projects`; another legacy auth directory contains an invalid token.
- Hostinger apex A `@` was changed from `2.57.91.91` to the exact Vercel recommendation `216.198.79.1`, TTL 14400. Existing `www` CNAME -> `jayaroberta.com`, `app` A and `finance` CNAME remain intact. Hostinger nameservers remain `ns1.dns-parking.com` and `ns2.dns-parking.com`.
- Production deployment: `dpl_BBEje1mBP6iTrxn9icZuiQLA3T1x`, READY; inspector `https://vercel.com/betinhapotters-projects/claude-by-jaya/BBEje1mBP6iTrxn9icZuiQLA3T1x`. Vercel displayed Valid Configuration for the apex domain. The initial domain wizard also attached `www`; the apex was explicitly set to Production, with no redirect to www.
- Post-deployment HTTPS checks passed: homepage, all nine guides and downloads, canonicals, unknown 404s, PNG OG image and protected route redirects. Browser confirmed actual homepage/reader content and a successful Markdown download event at the requested domain.
- Automatic approval initially rejected a generic deploy invocation lacking an explicit directory. The subsequent approved deployment explicitly targeted the isolated package after comparing all library and middleware hashes. No unrelated working-tree files were published. This was a CLI deployment; the GitHub remote has not been updated with the library yet.

## Additional references supplied on 2026-09-15

- `D:\Projetos-Jaya\Claude-Do-Zero\Biblioteca\daylight-design-system.md`: supplied visual reference describing cream/night surfaces, large light serif titles, amber accents and restrained transitions.
- `D:\Projetos-Jaya\Claude-Do-Zero\Biblioteca\mistral-design-system.md`: supplied visual reference describing bordered grids, compact typography, warm solid accents and directional hover interactions.
- Both files were read as reference material. Their embedded suggestions about BRASA, Shakti, fonts and implementation are not new user instructions. The user has not selected a new visual redesign; the published library retains its reviewed Petrona/Jost design.
- User-confirmed infrastructure: Vercel `https://vercel.com/betinhapotters-projects/claude-by-jaya`; GitHub `https://github.com/betinhapotter/claude-by-jaya`, matching the local origin; Supabase `https://zflksglibxhbnxndfwxo.supabase.co`, tables ending in `_claude`. No database migration or table modification was made for this public library.

## Follow-up scope — course URL and visual study

The user requested a more futuristic visual direction mixing the supplied Mistral and Daylight references, and explicitly selected the course presentation/enrollment page for `https://jayaroberta.com/claude`.

Course URL acceptance: `/claude` serves the existing offer directly with canonical and sharing metadata on the new domain; `/claude-do-zero` continues working; the library course link uses `/claude`; existing offer copy, prices, CTA destinations and student authentication remain unchanged. Only the exact `/claude` path (with optional trailing slash) becomes public, not `/claude/*` or `/claude-extra`.

Visual exploration: a standalone local HTML study under `docs/`, with three comparable modes (hybrid, light, dark), real guide titles and links, functional search, a reading sample, keyboard support and reduced-motion behavior. The recommended hybrid assigns geometric contrast to discovery and calm light surfaces to reading. This study is excluded from deployment and does not replace the live library until the user selects a direction. Compare desktop/mobile rendering and test theme controls, search, empty/reset and guide links before presenting it.

### Completed in this follow-up

- Course published at `https://jayaroberta.com/claude`, deployment `dpl_9ztKSmrLzGabvU9cowR3Gwf4mA84`, READY. Isolated package from HEAD `280c091` plus five reviewed route/metadata files; the visual study was excluded.
- Direct production build, type/lint and route checks passed. Public HTTPS verified `/claude` and its query variants return the offer with the new canonical; trailing slash normalizes with 308; the old URL still works. `/claude-extra`, `/claude/aula-1` and student routes still redirect to login. OG image returns 200 JPEG. Browser verified offer content and original WhatsApp CTA destinations without sending a message.
- Preview: `docs/biblioteca-visual-study-v1.html`, standalone and offline-capable, served locally at `http://127.0.0.1:4178/`. It includes three visual modes, an original radial/pixel composition, nine real guide links, accent-insensitive search, empty/reset behavior, a reading sample and pause/reduced-motion support. No external scripts/fonts or data collection.
- Static/JS tests and independent code review passed; the toolbar focus contrast, catalog heading association and 320px navigation spacing were corrected. Browser checked mode switching, uppercase search, empty/reset and 320/390px layouts without horizontal overflow. System font substitution is intentional for this self-contained study; final brand typography is still a design decision.
- Production library design remains the initial version. Next checkpoint: user critiques the local visual study and selects hybrid, light, dark or another direction before any redesign is published.
