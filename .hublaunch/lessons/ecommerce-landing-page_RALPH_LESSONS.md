# HubLaunch Lessons Learned

This file persists context across agent sessions. Update it as you work.

## Current Status
- Phase: COMPLETE (elegant editorial restyle)
- Last action: Applied warm editorial restyle per 2026-10-08-22:00 plan; all CLI verification passed; ready to commit.
- Blockers: None

## Key Discoveries
- Restyle plan is fully self-contained with exact file contents (styles.css full rewrite, index.html head+hero edits, app.js createProductCard wrappers, products.json image URLs).
- No build/lint/test tooling in repo. Verification = `node --check app.js`, `python3 -m json.tool`, grep checks, HTTP server curl (all 200), Google Fonts CSS curl.
- No browser available in container; visual checklist (section 8) not performed — reviewer should do visual pass.

## Solutions That Worked
- `node --check app.js` PASS; JSON valid; no innerHTML; `[hidden] { display: none !important; }` preserved (line 25).
- Google Fonts css2 URL returns 5 @font-face rules (Cormorant Garamond 500/600 + Inter 400/500/600).
- index.html diff = only head font links + eyebrow line + hero-tagline class (all IDs/copy unchanged).
- products.json diff = only the 4 image URLs changed.

## Things to Avoid
- Do NOT add package.json, frameworks, or use innerHTML.
- Do NOT use font-style: italic (no italic files loaded).
- Do NOT put overflow:hidden+zoom on .product-card itself (use .product-media wrapper).
- Do NOT make header sticky; no dark mode.

## Files Modified (restyle)
- styles.css (full rewrite — new tokens, editorial typography, hover motion, reduced-motion block)
- index.html (Google Fonts links, hero eyebrow, hero-tagline class)
- app.js (createProductCard: product-media + product-info wrappers, img 600x750)
- data/products.json (4 image URLs → tinted 600x750 portrait placeholders)

## Open Questions
- None.

## Next Steps
- Commit new work on top of branch ecommerce-landing-page. All 8 ACs met.
