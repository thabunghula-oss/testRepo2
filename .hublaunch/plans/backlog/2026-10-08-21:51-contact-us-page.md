# Add simple static Contact Us page with thank-you modal

## Plan Summary

- **What/why**: Adds a standalone static `contact.html` page with a two-field form (Name, Message). On a valid submit the form is cleared and a native `<dialog>` thank-you modal is shown. Nothing is sent anywhere.
- **Key decisions**: Front-end only, with no backend, `mailto:` or form service. Validation is limited to the HTML `required` attribute. The modal is the native `<dialog>` element (no library). The page is standalone on `main`, with its own CSS/JS files, so it does not depend on the unmerged Simple Shop PR #2.
- **Most important files**: `contact.html` (markup and modal) and `contact.js` (submit handler, about 10 lines).
- **Priority/complexity**: Medium priority, Simple complexity.

## Source

Issue #3 — https://github.com/thabunghula-oss/testRepo2/issues/3

### 2. Problem Statement

Issue #3 asks for a simple Contact Us page that accepts **name and message only** and, once submitted, displays a **thank-you modal**. The repository has no contact page today. The requirement is to keep the implementation as simple as possible.

#### Planning Context

> **Note**: This section captures key points from the planning discussion to provide complete context for implementation.

**Key Requirements Discussed:**

- Keep it simple. Choose the simplest option at every decision point.
- The form has exactly two fields: **Name** (single-line text) and **Message** (multi-line text). No email, phone, subject, or other fields.
- Both fields are required, enforced only by the HTML `required` attribute. The browser shows its own native validation message. No custom validation, no trimming, no length limits.
- On a valid submit: prevent the default submit (no page reload), send nothing anywhere (data is discarded), reset the form, and open the thank-you modal.
- Modal text is generic: title `Thank you!`, body `Your message has been received.`, and a `Close` button.
- The modal closes on the `Close` button or the `Esc` key. After it closes, keyboard focus returns to the Name field.
- The page is **standalone**: its own `contact.html`, `contact.css`, and `contact.js` at the repository root, with no dependency on the Simple Shop files.
- No automated tests. Manual testing checklist only.

**Decisions Made:**

- **Standalone page over reusing Simple Shop (PR #2)**: PR #2 (branch `ecommerce-landing-page`, adds `index.html`, `styles.css`, `app.js`, `data/products.json`, `README.md`) is open but **not merged**, and this work branches from `main`, which only tracks `.env`. Building on PR #2 would block this issue on that merge. Using distinct filenames (`contact.*`) means neither PR conflicts with the other, in whichever order they merge.
- **Front-end only submit over `mailto:` / Formspree / backend**: there is no backend in this repo and the issue only asks for the thank-you modal. Real delivery is a tracked follow-up.
- **Native `<dialog>` + `showModal()` over a custom modal**: zero dependencies; the browser handles the backdrop, focus trapping, inert background, and `Esc`-to-close. Supported in all current Chrome, Firefox, and Safari.
- **`<form method="dialog">` for the Close button**: closes the dialog natively with no JavaScript click handler.
- **`required` attribute only**: the browser blocks the `submit` event until both fields are non-empty, so `contact.js` needs no validation code.
- **Same color tokens as PR #2's `styles.css`, but in a separate `contact.css`**: the page is visually consistent with Simple Shop without linking to a file that does not exist on `main` yet.
- **Do not touch `README.md`**: PR #2 creates `README.md`. Creating it here too would cause an add/add merge conflict.

**Out of Scope:**

- Sending or storing submissions (email, `mailto:`, form service, backend, `localStorage`). Tracked as a backlog follow-up.
- Email or any field besides Name and Message.
- Custom validation, whitespace trimming, max lengths, custom error messages.
- Linking to `contact.html` from the Simple Shop nav (PR #2's `index.html` has a `Contact` link pointing at `#contact`). Tracked as a backlog follow-up after PR #2 merges.
- Shared header/footer, site navigation, or reuse of `styles.css`.
- `README.md` changes, `package.json`, build tools, frameworks, CSS frameworks, linters.
- Automated tests (unit, integration, end-to-end).
- Deployment.

#### Background & Context

- **Why is this needed?** The site needs a way for visitors to leave a message (issue #3).
- **Current state**: `main` tracks only `.env` (comments only). Local untracked HubLaunch tooling directories exist (`.hublaunch/`, `.agents/`, `.claude/`, `.vscode/`, `.gitignore`). A separate open PR #2 adds the Simple Shop landing page in plain HTML/CSS/vanilla JS.
- **Who is affected?** Site visitors, and developers who will later wire submissions to a real destination.

**Current Behavior**:

- There is no contact page.

**Desired Behavior**:

- Opening `contact.html` (directly from disk or via any static server) shows a `Contact Us` heading, a short intro line, and a form with Name and Message fields and a `Send message` button.
- Submitting with an empty field shows the browser's native "fill out this field" message and nothing else happens.
- Submitting with both fields filled clears the form and shows a modal reading `Thank you!` / `Your message has been received.` with a `Close` button. Closing it (button or `Esc`) returns focus to the Name field.

### 3. Detailed Requirements

#### Functional Requirements

1. **Page content**
   - `<title>`: `Contact Us`.
   - `<h1>`: `Contact Us`.
   - Intro paragraph: `Have a question? Send us a message.`

2. **Form**
   - `<form id="contact-form">`, no `action`, no `method`, no `novalidate`.
   - Name: `<label for="contact-name">Name</label>` + `<input id="contact-name" name="name" type="text" autocomplete="name" required>`.
   - Message: `<label for="contact-message">Message</label>` + `<textarea id="contact-message" name="message" rows="6" required></textarea>`.
   - Submit: `<button type="submit" class="button">Send message</button>`.
   - Edge case: either field empty, so the browser blocks submission and shows its native message. The `submit` event does not fire and the modal does not open.
   - Edge case: whitespace-only input satisfies `required` and is accepted. This is intentional (no custom validation).

3. **Submit behavior** (`contact.js`)
   - On `submit`: `event.preventDefault()`, then `form.reset()`, then `dialog.showModal()`.
   - No `fetch`, no `console.log` of the data, no storage. Values are discarded.

4. **Thank-you modal**
   - `<dialog id="thank-you-dialog" class="modal" aria-labelledby="thank-you-title">`.
   - `<h2 id="thank-you-title">Thank you!</h2>`.
   - `<p>Your message has been received.</p>`.
   - A `<form method="dialog">` containing `<button type="submit" class="button">Close</button>`. Clicking it closes the dialog natively.
   - `Esc` closes the dialog (native `<dialog>` behavior).
   - Clicking the backdrop does **not** close it (native default; do not add a handler).
   - On the dialog's `close` event, focus `#contact-name`.

5. **Layout**
   - Content centered, max width `560px`, `16px` side padding.
   - Inputs full width of the content column.
   - No horizontal scrolling at 375px viewport width. The modal fits within a 375px viewport.

#### Technical Requirements

- **Technology/Framework**: HTML5, CSS3, vanilla JavaScript (plain deferred script, no ES modules). No dependencies.
- **Location**: three new files at the repository root: `contact.html`, `contact.css`, `contact.js`.
- **Dependencies**: none.
- **Constraints**: must work in current Chrome, Firefox, and Safari. Must also work when opened via `file://`, because it makes no network requests.

#### Non-Functional Requirements

- **Performance**: trivial; one small HTML, CSS, and JS file.
- **Security**: user input is never read, rendered, sent, or stored, so there is no injection or data-handling surface. Do not use `innerHTML`.
- **Backwards Compatibility**: not applicable. Only new files; no existing file is modified.
- **Error Handling**: none needed. There is no network or async work. Invalid input is handled by native browser validation.

### 4. Proposed Solution

**High-level approach**: one static HTML page containing the form and a native `<dialog>`, one CSS file, and one tiny deferred script that intercepts the form's `submit` event, resets the form, and opens the dialog.

#### Key Components

1. **`contact.html`**: markup for the heading, intro, form, and `<dialog>`. Loads `contact.css` and `contact.js` (`defer`).
2. **`contact.js`**: two event listeners: form `submit` (prevent default, reset, `showModal()`) and dialog `close` (focus Name).
3. **`contact.css`**: minimal styling with color tokens matching PR #2's `styles.css` values.

#### Files Likely to Change

- `contact.html` (new): page markup and modal.
- `contact.css` (new): page styles.
- `contact.js` (new): submit and close behavior.

No existing files are modified. Do **not** create or modify `README.md`, `index.html`, `styles.css`, `app.js`, `package.json`, `.env`, `.gitignore`, or anything under `.hublaunch/`, `.agents/`, `.claude/`, or `.vscode/`.

#### Code Patterns to Follow

> **Note**: `main` contains no application code. The conventions below mirror the open Simple Shop PR #2 (branch `ecommerce-landing-page`): plain HTML/CSS/vanilla JS, `<script ... defer>` in `<head>` (PR #2 `index.html` line 8), one-line JSDoc-style comments on functions/handlers (PR #2 `app.js` lines 8, 17, 25), and the color tokens in PR #2 `styles.css` lines 1–9. Those files are **not** on `main`; use the code below directly.

**`contact.html`** (use this content; exact whitespace is not required):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Contact Us</title>
  <link rel="stylesheet" href="contact.css" />
  <script src="contact.js" defer></script>
</head>
<body>
  <main class="contact">
    <h1>Contact Us</h1>
    <p class="intro">Have a question? Send us a message.</p>

    <form id="contact-form" class="contact-form">
      <label for="contact-name">Name</label>
      <input id="contact-name" name="name" type="text" autocomplete="name" required />

      <label for="contact-message">Message</label>
      <textarea id="contact-message" name="message" rows="6" required></textarea>

      <button type="submit" class="button">Send message</button>
    </form>
  </main>

  <dialog id="thank-you-dialog" class="modal" aria-labelledby="thank-you-title">
    <h2 id="thank-you-title">Thank you!</h2>
    <p>Your message has been received.</p>
    <form method="dialog">
      <button type="submit" class="button">Close</button>
    </form>
  </dialog>
</body>
</html>
```

**`contact.js`** (use this content):

```js
const form = document.getElementById('contact-form');
const dialog = document.getElementById('thank-you-dialog');
const nameInput = document.getElementById('contact-name');

/** Valid submit only (the `required` attributes block empty fields). Nothing is sent anywhere: clear the form and show the thank-you modal. */
form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  dialog.showModal();
});

/** Fires when the modal closes via the Close button or Esc; return focus to the first field. */
dialog.addEventListener('close', () => {
  nameInput.focus();
});
```

Because the script is loaded with `defer`, the DOM is parsed before it runs, so no `DOMContentLoaded` listener is needed.

**`contact.css`** (use this content; small cosmetic tweaks are fine as long as it stays plain CSS and meets the layout requirements):

```css
/* Color values match the Simple Shop styles.css tokens so the pages look consistent. */
:root {
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-muted: #6b7280;
  --color-accent: #2563eb;
  --color-accent-text: #ffffff;
  --color-border: #e5e7eb;
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.5;
}

.contact {
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 16px;
}

.contact h1 {
  margin: 0 0 8px;
}

.intro {
  margin: 0 0 24px;
  color: var(--color-muted);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-form label {
  font-weight: 600;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font: inherit;
}

.contact-form textarea {
  resize: vertical;
}

.button {
  align-self: flex-start;
  background: var(--color-accent);
  color: var(--color-accent-text);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:hover {
  opacity: 0.9;
}

/* Thank-you modal (native <dialog>) */
.modal {
  max-width: min(400px, calc(100% - 32px));
  padding: 24px;
  border: none;
  border-radius: 12px;
  text-align: center;
}

.modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.modal h2 {
  margin: 0 0 8px;
}

.modal p {
  margin: 0 0 16px;
  color: var(--color-muted);
}
```

**Anti-Patterns to Avoid:**

- Don't build a custom modal (div overlay, manual focus trap, manual `Esc` handling). Use `<dialog>` + `showModal()`.
- Don't use `dialog.show()`. It opens a non-modal dialog with no backdrop and no `Esc` handling. Use `showModal()`.
- Don't add `novalidate` to the form or write JS validation. The `required` attribute is the whole validation.
- Don't send, log, or store the submitted values (no `fetch`, `console.log(formData)`, `localStorage`).
- Don't use `innerHTML`. The modal text is static in the HTML.
- Don't add a click handler on the backdrop, a close "×" icon, or auto-close timers. Close button + `Esc` only.
- Don't add `package.json`, a bundler, a framework, or a CSS framework.

### 5. Implementation Steps

#### Phase 1: Markup

- [ ] Create `contact.html` with the content shown in section 4.

#### Phase 2: Behavior

- [ ] Create `contact.js` with the content shown in section 4.

#### Phase 3: Styling

- [ ] Create `contact.css` with the content shown in section 4.

#### Phase 4: Verification

- [ ] Run `node --check contact.js` and confirm it exits with no error.
- [ ] Confirm `contact.js` contains no `innerHTML`, `fetch`, `localStorage`, or `console.log` (e.g. `grep -nE 'innerHTML|fetch|localStorage|console\.log' contact.js` prints nothing).
- [ ] Confirm `git status` shows only the three new files `contact.html`, `contact.css`, `contact.js` (plus any HubLaunch-generated tracking files) and no modified files.
- [ ] If a browser is available, run through the Manual Testing Checklist (section 8).

Phases 1–3 can be done in any order. Phase 4 comes last.

<details>
<summary><b>Implementation Detail</b></summary>

### 6. Edge Cases & Considerations

#### Edge Cases to Handle

1. **Empty Name or Message**: the browser blocks submission and shows its native validation bubble on the first empty field. The `submit` event does not fire and the modal does not open.
2. **Whitespace-only input**: passes `required` and is accepted, so the modal opens. Intentional (no custom validation).
3. **Pressing Enter in the Name field**: submits the form (native behavior). If Message is empty, the native validation message appears on Message.
4. **Closing the modal with `Esc`**: closes natively. The `close` event fires and focus moves to Name.
5. **Clicking the backdrop**: nothing happens (native default). The modal stays open.
6. **Submitting again after closing**: works the same way. The form was already reset, so both fields must be filled again.
7. **JavaScript disabled**: the form would perform a native GET submit to `contact.html?name=…&message=…` (reloading the page, no modal). Acceptable; no `<noscript>` handling required.
8. **Opened via `file://`**: works fully. There are no network requests.

#### Potential Challenges

- ⚠️ **Focus after close**: browsers restore focus to the element that had it before `showModal()` (the `Send message` button). The `close` listener in `contact.js` overrides this by focusing Name. Keep that listener.
- ⚠️ **`.button` inside the modal**: `.button` has `align-self: flex-start`, which only matters inside the flex `.contact-form`. Inside the modal (not a flex container) it has no effect, and `text-align: center` on `.modal` centers the inline-block-like button. No extra rule needed.

#### Security Considerations

- Submitted values are never read, displayed, transmitted, or stored, so there is no XSS, injection, or data-privacy surface.
- No secrets, cookies, or third-party requests.

### 7. Technical Considerations

#### Dependencies

- None. No `package.json` is created.

#### Configuration Changes

- None.

#### Environment Variables

- None.

#### API Rate Limiting

- Not applicable (no network requests).

#### Error Handling Strategies

- Not applicable. There is no async or network code. Input validation is native (`required`).

### 8. Testing Requirements

#### Unit Tests

- None. Out of scope by decision; the repo has no test tooling.

#### Integration Tests

- None. Out of scope by decision.

#### Manual Testing Checklist

1. **Setup**: open `contact.html` directly in a browser (double-click, or `open contact.html` on macOS), or serve the repo root with `python3 -m http.server 8000` and open `http://localhost:8000/contact.html`.
2. **Initial render**:
   - Expected: tab title `Contact Us`; heading `Contact Us`; intro `Have a question? Send us a message.`; labeled `Name` input and `Message` textarea; `Send message` button; no modal visible; no console errors.
3. **Empty submit**: click `Send message` with both fields empty.
   - Expected: native validation message on Name; no modal.
4. **Partial submit**: fill Name only, click `Send message`.
   - Expected: native validation message on Message; no modal; Name value kept.
5. **Valid submit**: fill Name `Jane` and Message `Hello`, click `Send message`.
   - Expected: page does not reload (URL unchanged, no `?name=` query); both fields are now empty; modal shows `Thank you!` / `Your message has been received.` / `Close` over a dimmed backdrop; the page behind is not clickable.
6. **Close via button**: click `Close`.
   - Expected: modal disappears; cursor/focus is in the Name field.
7. **Close via Esc**: submit again with both fields filled, press `Esc`.
   - Expected: modal disappears; focus is in the Name field.
8. **Backdrop click**: submit again, click the dimmed area outside the modal.
   - Expected: modal stays open.
9. **Responsive**: in devtools set width to 375px.
   - Expected: form fits the width with no horizontal scrollbar; modal fits within the screen with margins.

#### Test Data Requirements

- None.

### 9. Documentation Updates

#### User-Facing Documentation

- None. `README.md` is intentionally not created or modified (PR #2 creates it; editing it here would cause a merge conflict).

#### Code Documentation

- [ ] One-line comment above each event listener in `contact.js`, as in the reference implementation.
- [ ] One-line comment at the top of `contact.css` noting the color values match Simple Shop's `styles.css`.

#### Examples to Include

```bash
# Open directly (macOS)
open contact.html

# Or serve the repo root
python3 -m http.server 8000
# then open http://localhost:8000/contact.html
```

### 10. Acceptance Criteria

- [ ] **AC1**: The repository root contains new files `contact.html`, `contact.css`, `contact.js`. No other application files were added or modified (`README.md`, `index.html`, `styles.css`, `app.js`, `package.json` untouched or absent).
- [ ] **AC2**: `contact.html` shows a form with exactly two fields, Name (text input) and Message (textarea), both with the `required` attribute, plus a `Send message` button.
- [ ] **AC3**: Submitting with either field empty shows the browser's native validation message and does not open the modal.
- [ ] **AC4**: Submitting with both fields filled does not reload the page, clears both fields, and opens a modal `<dialog>` (via `showModal()`) reading `Thank you!` and `Your message has been received.` with a `Close` button.
- [ ] **AC5**: The modal closes via the `Close` button and via `Esc`; after closing, focus is in the Name field.
- [ ] **AC6**: `contact.js` sends, logs, and stores nothing: no `fetch`, `XMLHttpRequest`, `console.log`, `localStorage`, or `innerHTML`.
- [ ] **AC7**: At 375px viewport width there is no horizontal scrolling and the modal fits on screen.
- [ ] **AC8**: `node --check contact.js` passes.

#### Definition of Done

- All acceptance criteria met
- Manual testing checklist completed (or the Phase 4 non-browser checks, if no browser is available)
- Code reviewed and approved
- No files outside the three listed were added or modified

### 11. Dependencies & Related Work

#### Dependencies

- [ ] Depends on: nothing. Intentionally independent of PR #2.
- [ ] Required external setup: none.

#### Blockers

- [ ] None.

#### Related Issues/PRs

- Fixes #3
- Related: issue #1 / PR #2 (Simple Shop landing page). Follow-up after PR #2 merges: point its nav `Contact` link to `contact.html` and optionally share styles.

</details>
