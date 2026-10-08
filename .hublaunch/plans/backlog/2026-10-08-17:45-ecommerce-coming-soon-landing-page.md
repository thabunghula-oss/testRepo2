# Ecommerce "Coming Soon" Landing Page (single static HTML)

## Plan Summary

- **What/why**: Add a single, dependency-free `index.html` at the repo root that serves as a "coming soon" landing page for a not-yet-launched ecommerce store, with a countdown, email signup (front-end only), and social links.
- **Key decision**: One self-contained HTML file with inline `<style>` and `<script>` (no frameworks, no build step, no CDN) so it opens directly in a browser and deploys to any static host as-is.
- **Most important file**: `index.html` (new, repo root).
- **Priority/complexity**: Low priority, Simple complexity.

## Problem Statement

The repository is empty (no commits, no application code). The store is not launched yet and needs a minimal public page that announces it is coming soon, shows time remaining until launch, lets visitors leave an email (UI only for now), and links to social profiles.

### Planning Context

**Key Requirements Discussed:**

- Brand name and tagline are placeholders: brand `ShopName`, tagline `Something great is coming.` — must be trivial to swap later.
- Page includes exactly three interactive/content blocks: countdown timer, email signup form, social links (Instagram, Facebook, X).
- Single `index.html` at the repository root with inline CSS and JS.
- Email form is front-end only: validate, show a thank-you message, store/send nothing.
- Countdown target is a single JS constant `LAUNCH_DATE`, default `2026-12-01T00:00:00` (local time, no timezone suffix).
- When countdown reaches zero: replace the timer with the message `We're live!` and stop the interval.
- Visual style: dark minimal — dark gradient background, white text, one accent color, system font stack.

**Decisions Made:**

- Single file over separate css/js files: zero setup, easiest to preview and host; page is small enough that splitting adds no value.
- No Tailwind/CDN: avoids external network dependency and keeps the page working offline.
- Front-end-only form: no backend exists; a third-party provider can be wired in later by changing the submit handler.
- Root placement: GitHub Pages and Vercel serve `/index.html` with no configuration.

**Out of Scope:**

- Any backend, database, or real email capture/provider integration.
- Analytics, cookies, tracking pixels.
- Product images/teasers, real brand assets, logo files.
- Deployment configuration (Vercel/Netlify/GitHub Pages settings).
- Test frameworks, `package.json`, linters, build tooling.

### Background & Context

**Current Behavior**: Repository has no page or code.

**Desired Behavior**: Opening `index.html` in any modern browser shows a centered, responsive coming-soon page with a live countdown, working client-side email validation with feedback, and social links.

## Proposed Solution

Create one static file, `index.html`, at the repository root containing:

- **Markup**: semantic `<main>` with header (brand + tagline), countdown section, signup form section, social `<nav>`, and footer.
- **Inline `<style>`**: dark gradient theme driven by `:root` CSS custom properties, responsive rules at a single `480px` breakpoint, accessibility utilities.
- **Inline `<script>`** at end of `<body>`: countdown logic driven by one editable `LAUNCH_DATE` constant, client-side email validation with accessible feedback, and footer year.

No other files are added. The page has no network dependencies and works by opening the file directly (`file://`) or from any static host.

## Detailed Requirements

### Functional Requirements

1. **Header / hero**
   - `<h1>` with brand `ShopName`.
   - Tagline paragraph: `Something great is coming.`
   - Short supporting line: `Our online store is launching soon. Be the first to know.`

2. **Countdown timer**
   - Four units: Days, Hours, Minutes, Seconds; each a number + label.
   - Numbers for hours/minutes/seconds zero-padded to 2 digits (`05`); days not padded (`45`, `3`).
   - Computed from `const LAUNCH_DATE = new Date('2026-12-01T00:00:00');` declared as the first line inside the `<script>` with a comment `// Edit launch date here (local time)`.
   - Render immediately on load (no 1-second blank), then update every 1000 ms via `setInterval`.
   - When `LAUNCH_DATE - now <= 0` (including on first load if date already passed): hide the timer container, show element with text `We're live!`, and call `clearInterval`.
   - Edge case: if `LAUNCH_DATE` is invalid (`isNaN(LAUNCH_DATE.getTime())`), hide the countdown section entirely and do not start the interval (no `NaN` shown).

3. **Email signup form**
   - `<form id="signup-form" novalidate>` containing a visible `<label for="email">` (may be visually hidden via `.sr-only` class), `<input type="email" id="email" name="email" required autocomplete="email" placeholder="you@example.com">`, and a `<button type="submit">Notify me</button>`.
   - On submit: `event.preventDefault()`; trim value; validate with `input.checkValidity()` plus non-empty check.
   - Invalid/empty: show error text `Please enter a valid email address.` in a message element with `role="alert"` (or `aria-live="polite"`), set `aria-invalid="true"` on the input, focus the input.
   - Valid: hide the form and show `Thanks! We'll let you know when we launch.` in an `aria-live="polite"` element. Do not send or store the email (no `fetch`, no `localStorage`).
   - Clear the error state (`aria-invalid` removed, error text cleared) when the user types in the input again.

4. **Social links**
   - Three links: Instagram (`https://instagram.com/`), Facebook (`https://facebook.com/`), X (`https://x.com/`) as placeholder URLs.
   - Each `<a>` has `target="_blank" rel="noopener noreferrer"` and an `aria-label` (`ShopName on Instagram`, etc.).
   - Icons as inline SVG (simple paths, `aria-hidden="true"`, `fill="currentColor"`); no icon font or external image.

5. **Footer**
   - `© <span id="year"></span> ShopName. All rights reserved.` with year filled by JS (`new Date().getFullYear()`).

### Technical Requirements

- **Technology**: HTML5, CSS3, vanilla ES2015+ JavaScript. No external resources of any kind (no fonts, CDNs, images).
- **Document head**: `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, `<title>ShopName — Coming Soon</title>`, `<meta name="description" content="ShopName is launching soon. Sign up to be notified.">`.
- **CSS custom properties** on `:root` so colors are editable in one place:
  ```css
  :root {
    --bg-start: #0f172a;
    --bg-end: #1e1b4b;
    --text: #ffffff;
    --text-muted: #cbd5e1;
    --accent: #f472b6;
    --error: #fca5a5;
  }
  ```
- **Layout**: `body` uses `min-height: 100vh`, `background: linear-gradient(135deg, var(--bg-start), var(--bg-end))`, flex column centered; content `max-width: 640px`, padding `1.5rem`.
- **Font**: `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- **Responsive**: countdown units in a 4-column row on wide screens, wrap to 2×2 below `480px`. Form input + button inline on wide screens, stacked full-width below `480px`. No horizontal scroll at 320px width.
- **Accessibility**: visible `:focus-visible` outline using `--accent`; text contrast ≥ 4.5:1 against background; `prefers-reduced-motion` disables any transition/animation; `.sr-only` utility class for the label.
- **Script placement**: single `<script>` at end of `<body>` (no `defer` needed); wrap in an IIFE or use `'use strict'` with `const`/`let` to avoid globals.

### Non-Functional Requirements

- **Performance**: single HTML file under 20 KB; no external requests; first paint immediate.
- **Browser support**: current Chrome, Firefox, Safari, Edge (desktop + mobile). `String.prototype.padStart`, arrow functions, `const`/`let` are acceptable; no transpilation.
- **Maintainability**: all customizable values (brand text, `LAUNCH_DATE`, colors, social URLs) changeable without touching logic.
- **Accessibility**: WCAG 2.1 AA contrast; fully keyboard operable; status messages announced to screen readers.

### Reference Script Skeleton

`LAUNCH_DATE` is intentionally declared at the very top of the script, outside the IIFE, so it is the first thing an editor sees. All other code lives inside the IIFE. `#live-message` is placed inside `#countdown-section` (sibling of `#countdown`) so hiding the section for an invalid date hides both.

```html
<script>
  // Edit launch date here (local time)
  const LAUNCH_DATE = new Date('2026-12-01T00:00:00');

  (function () {
    'use strict';

    const pad = (n) => String(n).padStart(2, '0');
    const timerEl = document.getElementById('countdown');
    const liveEl = document.getElementById('live-message');
    const els = {
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
    };

    let intervalId = null;

    function tick() {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) {
        timerEl.hidden = true;
        liveEl.hidden = false;
        if (intervalId) clearInterval(intervalId);
        return;
      }
      const s = Math.floor(diff / 1000);
      els.days.textContent = Math.floor(s / 86400);
      els.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      els.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      els.seconds.textContent = pad(s % 60);
    }

    if (isNaN(LAUNCH_DATE.getTime())) {
      document.getElementById('countdown-section').hidden = true;
    } else {
      tick();
      if (LAUNCH_DATE.getTime() > Date.now()) intervalId = setInterval(tick, 1000);
    }

    // Signup form (front-end only — nothing is sent or stored)
    const form = document.getElementById('signup-form');
    const input = document.getElementById('email');
    const errorEl = document.getElementById('form-error');
    const successEl = document.getElementById('form-success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      input.value = input.value.trim();
      if (!input.value || !input.checkValidity()) {
        errorEl.textContent = 'Please enter a valid email address.';
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      form.hidden = true;
      successEl.hidden = false;
    });

    input.addEventListener('input', () => {
      errorEl.textContent = '';
      input.removeAttribute('aria-invalid');
    });

    document.getElementById('year').textContent = new Date().getFullYear();
  })();
</script>
```

Required element IDs (the script depends on them): `countdown-section`, `countdown`, `days`, `hours`, `minutes`, `seconds`, `live-message`, `signup-form`, `email`, `form-error`, `form-success`, `year`. `live-message` and `form-success` start with the `hidden` attribute. `[hidden] { display: none !important; }` must be in the CSS so flex/grid display rules don't override it.

## Implementation Steps

### Phase 1: Page structure
1. Create `index.html` at repository root with the head metadata listed above.
2. Add semantic body: `<main>` containing `<header>` (h1 + tagline + supporting line), `<section id="countdown-section" aria-label="Time until launch">` (with `#countdown` grid of four units and hidden `#live-message`), `<section aria-label="Get notified">` (form + `#form-error` + hidden `#form-success`), `<nav aria-label="Social media">` (three links), and `<footer>`.

### Phase 2: Styling
3. Add inline `<style>` with the `:root` variables, reset (`*, *::before, *::after { box-sizing: border-box; }`, `body { margin: 0; }`), layout, countdown unit cards (semi-transparent background `rgba(255,255,255,0.06)`, rounded corners, large tabular numbers via `font-variant-numeric: tabular-nums`), form, button (accent background, dark text), social icon links (muted color, accent on hover/focus), `.sr-only`, `[hidden]` rule, `@media (max-width: 480px)` rules, `@media (prefers-reduced-motion: reduce)` rule.

### Phase 3: Behavior
4. Add the `<script>` per the skeleton above at the end of `<body>`.

### Phase 4: Verify
5. Run the manual checks in the Testing Strategy.

## Technical Considerations

- **No dependencies**: nothing to install; no `package.json` is added.
- **Security**: no user data leaves the browser; external links use `rel="noopener noreferrer"`. No `innerHTML` with user input (use `textContent` only).
- **Timezone**: `new Date('2026-12-01T00:00:00')` (no `Z`) parses as the visitor's local time — intentional, documented in the constant's comment.
- **Future email provider**: to wire up later, replace the success branch of the submit handler with a `fetch` POST; this is out of scope now.
- Do not modify anything in `.hublaunch/`, `.agents/`, `.claude/`, `.vscode/`, `.env`, or `.gitignore`.

## Testing Strategy

No automated test framework (out of scope). Manual verification by opening `index.html` directly in a browser (`open index.html` on macOS):

1. Page renders centered with brand, tagline, countdown, form, social links, footer with current year; no console errors.
2. Countdown shows non-zero values immediately and seconds decrement each second.
3. Temporarily set `LAUNCH_DATE` to a past date → `We're live!` shown, timer hidden, no interval running. Set to ~10 seconds in future → watch it switch to `We're live!` at zero. Revert to `2026-12-01T00:00:00`.
4. Temporarily set `LAUNCH_DATE = new Date('invalid')` → countdown section hidden, no `NaN`. Revert.
5. Submit empty form → error message, input focused, `aria-invalid="true"`. Type → error clears.
6. Submit `abc` → error. Submit `  test@example.com  ` → form hidden, thank-you message shown. Network tab shows no request.
7. Resize to 320px wide → no horizontal scroll; countdown wraps 2×2; form stacks.
8. Tab through page → visible focus ring on input, button, each social link.
9. Social links open in new tab.
10. Validate markup at https://validator.w3.org/#validate_by_input (paste file) → no errors.

## Documentation Updates

- None required. Editable values (`LAUNCH_DATE`, CSS color variables, brand text, social URLs) are self-documented by inline comments in `index.html`; add a short HTML comment at the top of the file listing them:
  ```html
  <!-- Coming-soon page. To customize: brand text (search "ShopName"), LAUNCH_DATE in <script>, colors in :root, social URLs in <nav>. -->
  ```

## Acceptance Criteria

- [ ] `index.html` exists at repo root; it is the only new file.
- [ ] No external resources referenced (no `http` in `src`/`href` except the three social links).
- [ ] Brand `ShopName`, tagline `Something great is coming.` displayed.
- [ ] Countdown to `LAUNCH_DATE` (default `2026-12-01T00:00:00` local) renders immediately and updates every second; hours/minutes/seconds zero-padded.
- [ ] At/after launch date, timer replaced by `We're live!` and interval cleared; invalid date hides countdown section.
- [ ] Email form validates client-side, shows `Please enter a valid email address.` on invalid input and `Thanks! We'll let you know when we launch.` on success; no network request or storage.
- [ ] Instagram, Facebook, X links with inline SVG icons, `aria-label`, `target="_blank" rel="noopener noreferrer"`.
- [ ] Footer shows current year.
- [ ] Dark gradient theme driven by `:root` CSS variables; responsive down to 320px; visible focus states; reduced-motion respected.
- [ ] No console errors; W3C validator reports no errors.
