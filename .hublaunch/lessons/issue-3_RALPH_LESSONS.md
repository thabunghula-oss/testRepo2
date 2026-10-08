# HubLaunch Lessons Learned

This file persists context across agent sessions. Update it as you work.

## Current Status
- Phase: COMPLETE
- Last action: Created contact.html/.css/.js, ran Phase 4 non-browser verification, committed.
- Blockers: None

## Key Discoveries
- Repo is static HTML/CSS/JS only. No package manager, linter, type-checker, or test runner.
- No browser binary available in container (only npx). No cached playwright/puppeteer and no reliable network to fetch one. Plan explicitly allows "Phase 4 non-browser checks" in this case.
- main branch tracks only .env; the three contact.* files are brand new, no existing files modified.

## Solutions That Worked
- Implemented all three files verbatim from the plan's reference content (section 4).
- Verification: `node --check contact.js` passes; `grep -nE 'innerHTML|fetch|XMLHttpRequest|localStorage|console.log' contact.js` prints nothing; `git status` shows only the 3 new files + HubLaunch tracking.
- Native <dialog> + showModal(); <dialog> is a sibling of <main> (not nested in #contact-form).

## Things to Avoid
- Don't nest the dialog inside the form; don't use dialog.show(); don't add innerHTML/fetch/storage; don't touch README.md/index.html/styles.css/app.js.

## Files Modified
- contact.html (new)
- contact.css (new)
- contact.js (new)

## Open Questions
- None.

## Next Steps
- Done. Follow-ups (tracked separately, out of scope): wire submissions to a real destination; link contact.html from Simple Shop nav after PR #2 merges.
