# Library and branded domain — session handoff

Date: 2026-09-15. Jaya approved the final result ("ficou tudo lindo") and explicitly requested commit, push and memory preservation before continuing tomorrow.

## Current public routes

| URL | Purpose |
| --- | --- |
| https://jayaroberta.com/biblioteca | Free library with nine original guides and the approved hybrid design |
| https://jayaroberta.com/claude | Public course presentation and enrollment |
| https://jayaroberta.com/claude-do-zero | Protected student home; anonymous visitors go to login |
| https://jayaroberta.com/zona-de-genialidade | Public assessment with canonical and sharing metadata on the branded domain |

## Approved state

- Hybrid visual direction: Mistral-inspired geometry, dark olive hero and amber accents; Daylight-inspired cream catalog and reading surfaces. Petrona/Jost typography; 680 px maximum article column. The user accepted this result; no alternative theme remains pending.
- Nine guide articles, search without accent/case sensitivity, environment/level filters, empty/reset state, copyable prompts, Markdown downloads, printing and contents navigation are implemented. The original three-mode study remains at `docs/biblioteca-visual-study-v1.html` as a reference.
- Hostinger domain points to Vercel project `claude-by-jaya`, team `betinhapotters-projects`. Existing unrelated DNS records were preserved.
- Supabase project `zflksglibxhbnxndfwxo` allows the exact `https://jayaroberta.com/auth/callback`. Other redirects and its default Site URL were preserved because the project is shared. Real Google sign-in was verified and returns an authorized student to `/claude-do-zero`.
- Offer source is `originais/claude-do-zero.html`, generated into `public/oferta/index.html`, served publicly at `/claude`. The source filename does not define its route. Zona source is `originais/zona-de-genialidade.html`, generated with the audited taxonomy into `public/zona/index.html`.

## Verification and source control

- Production builds passed compilation, lint/types and 29 generated pages. Independent code review passed. Browser checks covered desktop, 320/390 px, search/filter/reset, guide navigation, copying and a real Markdown download. All nine guide/download endpoints, canonicals, OG images, unknown-route 404 and private-route redirects passed. OS print dialog was not exercised.
- Latest directly verified production deployment: `dpl_EipwYxNNUBbiyj2zd9GuZVqED7zP`. Inspector: https://vercel.com/betinhapotters-projects/claude-by-jaya/EipwYxNNUBbiyj2zd9GuZVqED7zP.
- Completed implementation commits: `280c091`, `c6b86ee`, `567cbcb`, `cba1cd6`, `b22758a`. At closure, Jaya authorized pushing these and this handoff to `origin/main`; fetch confirmed no concurrent remote commits. This final synchronization supersedes earlier "GitHub has not been pushed" statements in the chronological release log once the push completes.
- Untracked local assets and configuration folders are unrelated to this delivery and must stay out of the push. Do not add the whole working tree. Preserve original course materials and unrelated local work.

## Resume

Start with `git status --short` and `docs/biblioteca-spec.md`, which contains the detailed scope and release evidence. The approved work is complete. Jaya intends to continue tomorrow but has not selected the next change; do not invent a new redesign, content expansion or scheduled automation. Continue from the existing approved library when she provides the next request.
