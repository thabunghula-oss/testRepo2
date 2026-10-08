# HubLaunch Lessons Learned

This file persists context across agent sessions. Update it as you work.

## Current Status
- Phase: COMPLETE
- Last action: Created all 5 files, verified via HTTP server + node checks, committed (8bdf4cb).
- Blockers: None

## Key Discoveries
- Plan is fully self-contained with exact file contents. No existing app code.
- No build/lint/test tooling in repo (per CLAUDE.md / ralph.effective.md). Verification = `node --check app.js`, JSON validation, HTTP server curl checks.
- No browser available in container; used curl + node to verify serving and price formatting.

## Solutions That Worked
- `python3 -m http.server 8000` serves all files (/, styles.css, app.js, data/products.json) with HTTP 200.
- Price formatting via Intl.NumberFormat confirmed: $19.99 / $24.00 / $12.50 / $49.99 (AC3).
- `[hidden] { display: none !important; }` needed so showStatus() can hide grid.

## Things to Avoid
- Do NOT add package.json, frameworks, or use innerHTML (anti-patterns in plan).
- Do NOT modify .hublaunch/.agents/.claude/.vscode/.gitignore.

## Files Modified
- data/products.json (new)
- index.html (new)
- app.js (new)
- styles.css (new)
- README.md (new)

## Open Questions
- None.

## Next Steps
- Done. All 8 ACs met.
