# Restyle Simple Shop landing page with an elegant warm editorial look

## Plan Summary

- **What/why**: Restyles the existing static "Simple Shop" landing page (added in PR #2) from a generic blue/gray look to an elegant, warm editorial design: ivory palette, serif display typography, borderless image-first product cards, and subtle hover motion.
- **Key decisions**: Warm editorial direction (light mode only); Google Fonts (Cormorant Garamond + Inter) loaded via `<link>` — still zero npm dependencies and no build step; light markup changes only (all IDs, copy, and behavior unchanged); tinted portrait placehold.co images instead of gray squares; header stays non-sticky.
- **Most important files**: `styles.css` (full rewrite) and `app.js` (`createProductCard()` gains two wrapper elements).
- **Priority/complexity**: Medium priority, Simple complexity.

## Source

Pull request #2 — https://github.com/thabunghula-oss/testRepo2/pull/2 (branch `ecommerce-landing-page` → `main`)

This plan describes only **new** work on top of PR #2. The PR's existing commits stay as they are; new commits go on top of the `ecommerce-landing-page` branch.

### 2. Problem Statement

PR #2 added a working static ecommerce landing page ("Simple Shop": `index.html`, `styles.css`, `app.js`, `data/products.json`, `README.md`). It works, but it looks generic: Tailwind-style grays, a bright `#2563eb` blue accent, the system font stack, bordered cards with 8px radii, and flat gray `placehold.co` square images. The page should look **more elegant**.

#### Planning Context

> **Note**: This section captures key points from the planning discussion to provide complete context for implementation.

**Key Requirements Discussed:**

- "Elegant" means a **warm editorial** aesthetic: ivory background, charcoal text, a muted bronze accent, serif display headings with a clean sans-serif body, hairline dividers, borderless image-first cards, small letter-spaced uppercase navigation, generous whitespace.
- Fonts come from **Google Fonts**: **Cormorant Garamond** (weights 500, 600) for headings, logo, and prices; **Inter** (weights 400, 500, 600) for body text. System serif/sans fallbacks are declared.
- Scope is **CSS + light markup**: `styles.css` is rewritten; `index.html` gets the font `<link>` tags, a hero eyebrow line, and a class on the hero tagline; `app.js` `createProductCard()` gets a `div.product-media` wrapper around the image and a `div.product-info` wrapper around the text. All element IDs, all existing visible copy, and all behavior stay unchanged.
- Product images: keep `placehold.co`, but change the 4 `image` URLs in `data/products.json` to **tinted portrait (4:5) placeholders** in the page palette with a serif font. Product names, prices, descriptions, and IDs in the JSON stay unchanged.
- Motion: **subtle hover only** — slight image zoom on card hover, animated underline on nav links, button fill on hover. Transitions 200–400ms. All motion disabled under `prefers-reduced-motion: reduce`. CSS only — no new JS for animation.
- Header stays **non-sticky** (same as the original PR #2 plan).
- **Light mode only** — no dark mode.
- Hero stays **centered, text-only**: new small uppercase eyebrow `The Everyday Collection`, large serif `<h1>`, muted tagline, outline bronze `Shop now` button that fills on hover.
- All text/background color pairs must meet WCAG AA (≥ 4.5:1) for normal text. Contrast was computed during planning (see the Palette table below).

**Decisions Made:**

- **Google Fonts over system fonts**: an elegant look depends on a good display serif; system serif stacks render very differently across macOS (Iowan/Palatino) and Windows (Georgia). The cost is one extra external stylesheet request — acceptable because the page already depends on an external host (`placehold.co`), and there is still no npm dependency or build step.
- **Cormorant Garamond for headings + Inter for body**: Cormorant is a refined, high-contrast Garamond suited to large editorial headlines; Inter keeps small body text and uppercase labels crisp and legible.
- **Muted `#6B635B` and bronze `#7A5F3B` (not lighter variants)**: the lighter candidates `#78716C` (muted) and `#8B6F47` (bronze) fail WCAG AA on the hero surface `#F3EEE7` (4.16:1 and 4.08:1). The chosen values pass on both backgrounds (`#6B635B`: 5.56:1 on bg, 5.11:1 on surface; `#7A5F3B`: 5.62:1 on bg, 5.16:1 on surface). Do not lighten them.
- **`div.product-media` wrapper around the image**: a `transform: scale()` hover zoom on an image that is a direct child of the card would visually overflow onto the text below it (transformed elements paint above their non-positioned siblings). Clipping the zoom requires an `overflow: hidden` wrapper around just the image.
- **`div.product-info` wrapper around the text**: lets the card be image-first and full-bleed (no card padding) while the text block gets its own spacing, and lets name + price sit on one row via CSS grid with the description spanning below.
- **Header stacks vertically below 520px**: with uppercase letter-spaced nav links, logo + nav on one row would be ~350px wide at a 375px viewport (343px content width), risking horizontal overflow. Stacking (centered logo above centered nav) is safe and looks intentional.
- **No italic styles**: no italic font files are loaded, so `font-style: italic` would produce faux-italic. Do not use italics.
- **Placeholder font `playfair-display`**: placehold.co does not offer Cormorant; `playfair-display` is the closest serif it supports. The placeholder text is temporary, so the slight mismatch is acceptable.

**Out of Scope:**

- Dark mode, sticky header, scroll-reveal / entrance animations, new JavaScript for animation.
- Real product photography or local image assets.
- Changing any visible copy other than adding the hero eyebrow line (hero heading, tagline, button text, section heading, nav labels, footer text all stay byte-identical in the HTML; CSS `text-transform: uppercase` on some of them is fine).
- Changing product data other than the `image` URLs.
- Adding `package.json`, any npm dependency, a bundler, a framework, or a CSS framework.
- Self-hosting fonts.
- Editing `README.md`, the original page plan `.hublaunch/plans/backlog/2026-10-08-21:37-ecommerce-landing-page.md`, or anything under `.agents/`, `.claude/`, `.vscode/`, `.gitignore`. (Exception: HubLaunch's own tracking artifacts — this plan file, `ralph.md`, and `.hublaunch/lessons/*_RALPH_LESSONS.md` — may be written or updated by the HubLaunch launch/implementation process as it normally does. This plan requires no product changes in them.)
- Automated tests (none exist in the repo; none are added).

#### Background & Context

- **Why is this needed?** The page from PR #2 is functional but looks like an unstyled template. A more elegant presentation is wanted before the PR is merged.
- **Current state** (on branch `ecommerce-landing-page`):
  - `styles.css` (155 lines): `:root` tokens `--color-bg #ffffff`, `--color-text #1f2937`, `--color-muted #6b7280`, `--color-accent #2563eb`, `--color-accent-text #ffffff`, `--color-surface #f3f4f6`, `--color-border #e5e7eb`; system font stack; `[hidden] { display: none !important; }`; `.container` max-width 1100px with 16px side padding; bordered `.product-card` with 16px padding; solid blue `.button`.
  - `index.html` (46 lines): header (`.logo` + `nav.nav` with 3 links), `section.hero` (h1, p, `a.button`), `section#products` (h2, `p#products-status.status[hidden]`, `div#product-grid.product-grid`), `footer#contact.site-footer`. Script `app.js` loaded with `defer`.
  - `app.js` (73 lines): `createProductCard()` (lines 25–50) builds `article.product-card` > `img` + `h3` + `p.product-price` + `p.product-description`, using `textContent`; image `width`/`height` attributes are `400`/`400`.
  - `data/products.json`: 4 products with `image` URLs like `https://placehold.co/400x400?text=T-Shirt` (gray squares).
- **Who is affected?** Visitors to the landing page.

**Current Behavior**:

- Plain white/gray page with a blue accent, system fonts, bordered square cards, gray placeholder images.

**Desired Behavior**:

- Warm ivory page with serif headings, a centered editorial hero with an eyebrow line and outline button, borderless portrait product cards with tinted placeholder images, name and bronze price on one line, subtle hover motion, and refined header/footer — all functionality (fetch, error/empty states, anchors, responsiveness) unchanged.

### 3. Detailed Requirements

#### Functional Requirements

1. **Design tokens** (`styles.css` `:root`) — exact values:

   | Token | Value | Use | Contrast (on `#FAF8F5` bg / on `#F3EEE7` surface) |
   |---|---|---|---|
   | `--color-bg` | `#faf8f5` | page background (ivory) | — |
   | `--color-surface` | `#f3eee7` | hero background | — |
   | `--color-text` | `#1c1917` | primary text (charcoal) | 16.5:1 / 15.15:1 |
   | `--color-muted` | `#6b635b` | secondary text, nav links, footer | 5.56:1 / 5.11:1 |
   | `--color-accent` | `#7a5f3b` | bronze: eyebrow, price, button, focus ring | 5.62:1 / 5.16:1 |
   | `--color-accent-text` | `#faf8f5` | text on filled accent button | 5.62:1 on accent |
   | `--color-border` | `#e7e2da` | hairline dividers | decorative |
   | `--color-image-bg` | `#efe9e1` | image wrapper background while loading | decorative |

2. **Typography**
   - Headings (`h1`, `h2`, `h3`), `.logo`, `.product-price`: `--font-display` = `"Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`.
   - Everything else: `--font-body` = `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
   - Fonts loaded from Google Fonts with `display=swap` so text renders immediately with fallbacks.
   - No italics anywhere.

3. **Header** (non-sticky)
   - Hairline bottom border, 24px vertical padding.
   - `.logo`: Cormorant Garamond 600, 1.5rem, slight letter-spacing, charcoal, no underline.
   - Nav links: Inter 500, 0.75rem, uppercase, letter-spacing 0.14em, muted color; on hover/focus color becomes charcoal and a 1px underline animates in from left (`transform: scaleX(0 → 1)`).
   - At viewport ≤ 520px: header stacks vertically (logo centered above nav, 12px gap).

4. **Hero** (centered, text-only)
   - Surface background, tall vertical padding (96px top / 112px bottom; 64px / 72px at ≤ 520px).
   - New eyebrow line above the `<h1>`: `<p class="eyebrow">The Everyday Collection</p>` — Inter 500, 0.75rem, uppercase, letter-spacing 0.24em, bronze.
   - `<h1>` text unchanged (`Everyday essentials, simply priced.`): Cormorant Garamond 500, `font-size: clamp(2.5rem, 6vw, 4.5rem)`, line-height 1.05, `max-width: 720px` centered, `text-wrap: balance`.
   - Tagline text unchanged, gets class `hero-tagline`: 1.125rem, muted, max-width 36rem centered, 40px bottom margin.
   - `Shop now` button (text unchanged in HTML): outline style — transparent background, 1px bronze border, bronze text, square corners, Inter 600 0.75rem uppercase letter-spacing 0.2em, padding 14px 36px; on hover/focus fills bronze with ivory text (300ms transition).

5. **Products section**
   - Section padding 96px vertical (64px at ≤ 520px).
   - `<h2>` (`Featured products`, text unchanged): centered, Cormorant Garamond 500, `clamp(2rem, 4vw, 2.75rem)`, 48px bottom margin.
   - Grid unchanged in principle: `repeat(auto-fill, minmax(220px, 1fr))`, gap `48px 32px` (row/column). Single column at 375px; 4 columns at 1100px+.
   - Card: no border, no padding, no radius, no shadow.
   - `div.product-media`: `aspect-ratio: 4 / 5`, `overflow: hidden`, background `--color-image-bg`. Image fills it (`width: 100%; height: 100%; object-fit: cover`). On card hover the image scales to `1.04` over 400ms.
   - `div.product-info`: CSS grid `1fr auto`, column-gap 16px, `align-items: baseline`, 20px top padding. Row 1: name (`h3`, Cormorant 500, 1.375rem) left, price (Cormorant 600, 1.25rem, bronze, `font-variant-numeric: lining-nums tabular-nums`) right. Row 2: description spanning both columns, 0.9375rem, muted, 8px top margin.
   - `.status` message (`Products could not be loaded.` / `No products available.`): centered, Cormorant Garamond 1.25rem, muted. Logic unchanged.

6. **Footer**
   - Hairline top border, 40px vertical padding, centered.
   - Text (unchanged in HTML) displayed via CSS as Inter 0.75rem uppercase, letter-spacing 0.12em, muted.

7. **Interaction & accessibility**
   - Global `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }`.
   - All transitions between 200ms and 400ms using `cubic-bezier(0.22, 1, 0.36, 1)`.
   - `@media (prefers-reduced-motion: reduce)`: `scroll-behavior: auto`, transitions disabled, no hover zoom.

8. **Product images** (`data/products.json`, only `image` field changes):
   - `https://placehold.co/600x750/EFE9E1/8C8073?text=Classic+T-Shirt&font=playfair-display`
   - `https://placehold.co/600x750/EFE9E1/8C8073?text=Canvas+Tote+Bag&font=playfair-display`
   - `https://placehold.co/600x750/EFE9E1/8C8073?text=Ceramic+Mug&font=playfair-display`
   - `https://placehold.co/600x750/EFE9E1/8C8073?text=Wireless+Earbuds&font=playfair-display`
   - Format: `/{width}x{height}/{bgHex}/{fgHex}?text=…&font=…` (hex without `#`). placehold.co returns SVG by default, which `<img>` renders fine.

#### Technical Requirements

- **Technology/Framework**: HTML5, CSS3, vanilla JS (unchanged stack). No dependencies, no build step.
- **Location**: Repository root files `styles.css`, `index.html`, `app.js`, and `data/products.json` on branch `ecommerce-landing-page`.
- **Dependencies**: Google Fonts CSS (`fonts.googleapis.com`) and font files (`fonts.gstatic.com`) at runtime; `placehold.co` images at runtime (already a runtime dependency).
- **Constraints**: Must work in current Chrome, Firefox, Safari. `text-wrap: balance` is progressive enhancement (ignored by browsers that lack it — acceptable).

#### Non-Functional Requirements

- **Performance**: `preconnect` to both Google Fonts origins; `display=swap`; only 5 font weights requested. Images keep `loading="lazy"` with explicit `width="600" height="750"` to reserve space.
- **Security**: `textContent` only — no `innerHTML`. No new user input. The only new external origins are Google Fonts.
- **Backwards Compatibility**: All IDs (`top`, `products`, `products-status`, `product-grid`, `contact`), classes used by JS, status messages, and the `[hidden] { display: none !important; }` rule are preserved.
- **Accessibility**: WCAG AA contrast for all text (see token table); visible focus ring; reduced-motion support; image `alt` still the product name.
- **Error Handling**: Unchanged. If Google Fonts fails, fallback fonts render. If placehold.co fails, the `--color-image-bg` wrapper shows with the `alt` text.

### 4. Proposed Solution

**High-level approach**: Replace `styles.css` with a new token-based stylesheet (complete reference content below), add Google Fonts links and the hero eyebrow/tagline class to `index.html`, add two wrapper `div`s in `app.js` `createProductCard()`, and update the four image URLs in `data/products.json`. No logic changes.

#### Key Components

1. **`styles.css`** — full rewrite
   - New `:root` tokens (colors, fonts, easing), editorial typography, header/hero/button/products/card/footer styles, a ≤ 520px media query, and a `prefers-reduced-motion` block.
   - Why: all visual change lives here; tokens make future palette tweaks one-line edits.
   - Must keep the `[hidden]` rule and the `.container` rule.

2. **`index.html`** — three small edits in `<head>` and the hero
   - Google Fonts `preconnect` + stylesheet `<link>`s before `styles.css`.
   - New `<p class="eyebrow">The Everyday Collection</p>` as the first child of the hero `.container`.
   - Add `class="hero-tagline"` to the existing hero tagline `<p>`.
   - Why: the eyebrow is a core editorial device; the tagline class prevents `.hero p` from also styling the eyebrow.

3. **`app.js`** — `createProductCard()` only
   - Wrap `img` in `div.product-media`; wrap name/price/description in `div.product-info`; image `width`/`height` → `600`/`750`.
   - Why: clipped hover zoom (see Decisions) and the name/price row layout.

4. **`data/products.json`** — four `image` values
   - Why: gray square placeholders clash with the warm palette and the 4:5 card shape.

#### Files Likely to Change

- `styles.css` — full rewrite (reference content below).
- `index.html` — font links, hero eyebrow, tagline class.
- `app.js` — `createProductCard()` (lines 25–50 on the PR branch) only.
- `data/products.json` — `image` values only.

No other files change.

#### Code Patterns to Follow

**Pattern References:**

- **DOM building with `textContent`**: Follow the existing `createProductCard()` in [`app.js`](app.js) lines 25–50 — `document.createElement` + `className` + `textContent` + `append`. Keep the same style for the new wrappers.
- **Design tokens**: Follow the existing `:root` custom-property approach in [`styles.css`](styles.css) lines 1–9, extended with font and easing tokens.
- **`[hidden]` override**: Keep [`styles.css`](styles.css) lines 15–17 verbatim (comment + rule). `showStatus()` in [`app.js`](app.js) lines 18–23 depends on it.

**`index.html` — `<head>` (replace the single `styles.css` link line with these four lines, in this order):**

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap" />
  <link rel="stylesheet" href="styles.css" />
```

**`index.html` — hero (target markup):**

```html
    <section class="hero">
      <div class="container">
        <p class="eyebrow">The Everyday Collection</p>
        <h1>Everyday essentials, simply priced.</h1>
        <p class="hero-tagline">Browse our hand-picked selection of quality products.</p>
        <a class="button" href="#products">Shop now</a>
      </div>
    </section>
```

Everything else in `index.html` stays exactly as it is.

**`app.js` — replace `createProductCard()` with:**

```js
/** Builds one product card element. Uses textContent so product data is never parsed as HTML. */
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const media = document.createElement('div');
  media.className = 'product-media';

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  img.width = 600;
  img.height = 750;
  img.loading = 'lazy';
  media.append(img);

  const info = document.createElement('div');
  info.className = 'product-info';

  const name = document.createElement('h3');
  name.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = priceFormatter.format(product.price);

  const description = document.createElement('p');
  description.className = 'product-description';
  description.textContent = product.description;

  info.append(name, price, description);
  card.append(media, info);
  return card;
}
```

All other functions in `app.js` (`loadProducts`, `showStatus`, `renderProducts`, `init`) and constants stay unchanged.

**`data/products.json` — target content (only `image` values differ from the current file):**

```json
[
  {
    "id": 1,
    "name": "Classic T-Shirt",
    "price": 19.99,
    "image": "https://placehold.co/600x750/EFE9E1/8C8073?text=Classic+T-Shirt&font=playfair-display",
    "description": "Soft cotton tee for everyday wear."
  },
  {
    "id": 2,
    "name": "Canvas Tote Bag",
    "price": 24,
    "image": "https://placehold.co/600x750/EFE9E1/8C8073?text=Canvas+Tote+Bag&font=playfair-display",
    "description": "Sturdy tote with plenty of room for the essentials."
  },
  {
    "id": 3,
    "name": "Ceramic Mug",
    "price": 12.5,
    "image": "https://placehold.co/600x750/EFE9E1/8C8073?text=Ceramic+Mug&font=playfair-display",
    "description": "12 oz mug, dishwasher and microwave safe."
  },
  {
    "id": 4,
    "name": "Wireless Earbuds",
    "price": 49.99,
    "image": "https://placehold.co/600x750/EFE9E1/8C8073?text=Wireless+Earbuds&font=playfair-display",
    "description": "Compact earbuds with a 20-hour battery case."
  }
]
```

**`styles.css` — complete reference content (replace the whole file):**

```css
:root {
  --color-bg: #faf8f5;
  --color-surface: #f3eee7;
  --color-text: #1c1917;
  --color-muted: #6b635b;
  --color-accent: #7a5f3b;
  --color-accent-text: #faf8f5;
  --color-border: #e7e2da;
  --color-image-bg: #efe9e1;

  --font-display: "Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --duration: 300ms;
  --duration-slow: 400ms;
}

html { scroll-behavior: smooth; }

*, *::before, *::after { box-sizing: border-box; }

/* Required: author rules like `.product-grid { display: grid }` otherwise override
   the `hidden` attribute, so showStatus() could not hide the grid. */
[hidden] { display: none !important; }

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

a { color: inherit; }

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

.container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }

/* Header */
.site-header {
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  padding-bottom: 24px;
}

.logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-text);
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 28px;
}

.nav a {
  position: relative;
  padding: 4px 0;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-muted);
  transition: color var(--duration) var(--ease);
}

.nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--duration) var(--ease);
}

.nav a:hover,
.nav a:focus-visible {
  color: var(--color-text);
}

.nav a:hover::after,
.nav a:focus-visible::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Hero */
.hero {
  background: var(--color-surface);
  padding: 96px 0 112px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 20px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.hero h1 {
  max-width: 720px;
  margin: 0 auto 20px;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.05;
  text-wrap: balance;
}

.hero-tagline {
  max-width: 36rem;
  margin: 0 auto 40px;
  font-size: 1.125rem;
  color: var(--color-muted);
}

/* Button */
.button {
  display: inline-block;
  padding: 14px 36px;
  border: 1px solid var(--color-accent);
  background: transparent;
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    background-color var(--duration) var(--ease),
    color var(--duration) var(--ease);
}

.button:hover,
.button:focus-visible {
  background: var(--color-accent);
  color: var(--color-accent-text);
}

/* Products */
.products {
  padding: 96px 0;
}

.products h2 {
  margin: 0 0 48px;
  font-size: clamp(2rem, 4vw, 2.75rem);
  text-align: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 48px 32px;
}

.product-media {
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--color-image-bg);
}

.product-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease);
}

.product-card:hover .product-media img {
  transform: scale(1.04);
}

.product-info {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 16px;
  align-items: baseline;
  padding-top: 20px;
}

.product-card h3 {
  margin: 0;
  font-size: 1.375rem;
}

.product-price {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--color-accent);
}

.product-description {
  grid-column: 1 / -1;
  margin: 8px 0 0;
  font-size: 0.9375rem;
  color: var(--color-muted);
}

.status {
  margin: 0;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-muted);
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--color-border);
  padding: 40px 0;
  text-align: center;
}

.site-footer p {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* Small screens: stack header, tighten section spacing */
@media (max-width: 520px) {
  .header-inner {
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .nav {
    gap: 24px;
  }

  .hero {
    padding: 64px 0 72px;
  }

  .products {
    padding: 64px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }

  *, *::before, *::after {
    transition: none !important;
  }

  .product-card:hover .product-media img {
    transform: none;
  }
}
```

The values above are the target. Small cosmetic adjustments are acceptable **only** if they keep: the token values, the `[hidden]` rule, the 220px grid minimum, WCAG AA contrast, the ≤ 520px header stacking, and the reduced-motion block.

**Anti-Patterns to Avoid:**

- Don't use `innerHTML` or template strings inserted as HTML for the new wrappers — use `document.createElement` as shown.
- Don't put `overflow: hidden` + zoom on `.product-card` itself instead of `.product-media` — the scaled image would overlap the text below.
- Don't add `package.json`, npm fonts (e.g. `@fontsource/*`), a bundler, Tailwind, or any framework.
- Don't use `font-style: italic` (no italic font files are loaded → faux italics).
- Don't change any IDs, the status message strings, or the existing visible copy in `index.html`.
- Don't make the header `position: sticky`/`fixed`.
- Don't remove or weaken `[hidden] { display: none !important; }`.
- Don't use `@import` for Google Fonts inside `styles.css` — it delays font loading; use the `<link>` tags in `<head>`.

### 5. Implementation Steps

All work happens on the existing PR #2 branch `ecommerce-landing-page`, as new commits on top of the existing ones.

#### Phase 1: Markup and data

- [ ] In `index.html` `<head>`, replace the `styles.css` `<link>` line with the four `<link>` lines shown in section 4 (two `preconnect`, Google Fonts stylesheet, then `styles.css`).
- [ ] In `index.html` hero, add `<p class="eyebrow">The Everyday Collection</p>` as the first child of `.hero .container`, and add `class="hero-tagline"` to the existing tagline `<p>`.
- [ ] In `data/products.json`, replace the four `image` values with the URLs in section 4. Leave every other field unchanged.

#### Phase 2: Card structure

- [ ] In `app.js`, replace `createProductCard()` with the version in section 4 (adds `div.product-media` and `div.product-info`, image size `600`×`750`). Do not change other functions.

#### Phase 3: Styling

- [ ] Replace the contents of `styles.css` with the complete reference stylesheet in section 4.

#### Phase 4: Verification

- [ ] `node --check app.js` passes.
- [ ] `python3 -m json.tool data/products.json` passes, and the file differs from the previous version only in the four `image` lines (`git diff data/products.json`).
- [ ] `grep -n innerHTML app.js` returns nothing.
- [ ] `grep -nF '[hidden] { display: none !important; }' styles.css` finds the rule.
- [ ] `git diff index.html` shows only the head-link change, the eyebrow line, and the `hero-tagline` class — all IDs and existing copy unchanged.
- [ ] Start `python3 -m http.server 8000` and confirm `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/` and `.../styles.css`, `.../app.js`, `.../data/products.json` all return `200`.
- [ ] Optionally confirm the Google Fonts URL returns CSS: `curl -s -m 20 -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap" | grep -c font-face` prints a number > 0. **placehold.co can be slow, time out, or return Cloudflare 5xx errors (e.g. 520/525)** intermittently; a timeout or 5xx when curling a placehold.co URL is not a failure of this task — the URL format was verified (HTTP 200, SVG) during planning.
- [ ] If a browser is available, run the Manual Testing Checklist in section 8. If not, state in the PR/lessons that browser-based visual checks were not performed.

Phases 1–3 can be done in any order; Phase 4 comes last.

<details>
<summary><b>Implementation Detail</b></summary>

### 6. Edge Cases & Considerations

#### Edge Cases to Handle

1. **Google Fonts blocked/offline**: `display=swap` means fallback fonts (`Iowan Old Style`/`Palatino`/`Georgia` for display; `system-ui` for body) render immediately; layout stays intact. No special handling.
2. **placehold.co slow or offline**: `.product-media` keeps its 4:5 shape with the `#efe9e1` background, and the browser shows the `alt` text. No special handling.
3. **Products fail to load / empty JSON**: unchanged logic; `.status` is styled centered serif muted. `#product-grid` is hidden by the preserved `[hidden]` rule.
4. **375px viewport**: header stacks (logo above nav); grid is one column; hero `h1` uses the `2.5rem` clamp floor; no horizontal scroll.
5. **Long product name**: name sits in the `1fr` column and wraps; price stays right-aligned in the `auto` column on the first baseline.
6. **Keyboard navigation**: `:focus-visible` shows a bronze 2px outline; nav underline and button fill also appear on `:focus-visible`.
7. **`prefers-reduced-motion: reduce`**: no transitions, no zoom, no smooth scroll.
8. **Browsers without `text-wrap: balance`**: heading wraps normally; acceptable.

#### Potential Challenges

- ⚠️ **Header width at mid-small widths (521–600px)**: logo + nav on one row must still fit. At 521px the content width is 489px; logo (~120px) + 16px gap + nav (~240px) ≈ 376px — fits. Do not raise the nav font size or letter-spacing beyond the given values without re-checking.
- ⚠️ **Cormorant numerals**: Cormorant Garamond defaults to old-style figures; `font-variant-numeric: lining-nums tabular-nums` on `.product-price` keeps prices even. If the Google Fonts subset drops the feature, prices still render correctly (just old-style) — acceptable.
- ⚠️ **No browser in the implementation environment**: visual verification may be impossible there; CLI checks in Phase 4 are the minimum. Note this in the PR so a reviewer does the visual pass.

#### Security Considerations

- New external origins: `fonts.googleapis.com` and `fonts.gstatic.com` (stylesheet + font files). No scripts are loaded from them.
- Product data still written only via `textContent`.
- No user input, forms, cookies, or storage.

### 7. Technical Considerations

#### Dependencies

- None added to the repo. Runtime-only external resources: Google Fonts (new), placehold.co (existing).

#### Configuration Changes

- None.

#### Environment Variables

- None.

#### API Rate Limiting

- Not applicable.

#### Error Handling Strategies

- Unchanged: one `try/catch` in `init()`; user-facing messages `Products could not be loaded.` / `No products available.`; `console.error('Failed to load products:', error)`.

### 8. Testing Requirements

#### Unit Tests

- None — the repository has no test tooling and none is added (consistent with PR #2).

#### Integration Tests

- None.

#### Manual Testing Checklist

1. **Setup**: From the repository root on branch `ecommerce-landing-page`, run `python3 -m http.server 8000` (or `npx serve .`) and open the printed URL.
2. **Look & feel (≥ 1100px wide)**:
   - Expected: ivory background; serif `Simple Shop` logo left; small uppercase muted nav right; hairline below header.
   - Hero on a light beige surface: bronze uppercase `THE EVERYDAY COLLECTION`, large serif heading over ~2 balanced lines, muted tagline, bronze outline `SHOP NOW` button.
   - `Featured products` centered serif heading; 4 borderless portrait cards in one row, tinted beige placeholders with serif text; under each image the name on the left and bronze price on the right (`$19.99`, `$24.00`, `$12.50`, `$49.99`), description below in muted text.
   - Footer centered small uppercase muted `© 2026 SIMPLE SHOP. ALL RIGHTS RESERVED.` above a hairline.
   - DevTools Network: Cormorant Garamond and Inter font files loaded; Console: no errors.
3. **Hover/focus**: Hover a nav link → color darkens and a 1px underline slides in from the left. Hover `Shop now` → fills bronze with ivory text. Hover a card → image zooms slightly, stays clipped inside its frame, does not overlap the text. Tab through links → bronze focus outline visible.
4. **Navigation**: `Shop now` smoothly scrolls to `Featured products`; `Contact` → footer; `Home`/logo → top.
5. **Responsive**: At 375px → header stacked and centered, 1-column grid, no horizontal scrollbar. At ~768px → 3 columns. At 1280px → 4 columns.
6. **Reduced motion**: Enable "Emulate CSS prefers-reduced-motion: reduce" in DevTools → no transitions, no zoom, anchors jump instead of smooth-scrolling.
7. **Error state**: Open `index.html` via `file://` → centered muted serif `Products could not be loaded.`; grid hidden.
8. **Empty state**: Temporarily set `data/products.json` to `[]` → `No products available.`; restore afterwards.
9. **Fonts blocked**: Block `fonts.googleapis.com` in DevTools → page still readable with fallback serif/sans.

#### Test Data Requirements

- `data/products.json` as specified in section 4.

### 9. Documentation Updates

#### User-Facing Documentation

- None. `README.md` run/edit instructions remain accurate and are not changed.

#### Code Documentation

- Keep the existing one-line JSDoc on `createProductCard()` (shown in section 4).
- Keep the existing comment above the `[hidden]` rule; the section comments in the reference `styles.css` (`/* Header */`, etc.) are sufficient.

#### Examples to Include

```bash
# Serve the page locally
python3 -m http.server 8000
# or
npx serve .
```

### 10. Acceptance Criteria

- [ ] **AC1**: `styles.css` defines exactly the token values in section 3 (`--color-bg #faf8f5`, `--color-surface #f3eee7`, `--color-text #1c1917`, `--color-muted #6b635b`, `--color-accent #7a5f3b`, `--color-accent-text #faf8f5`, `--color-border #e7e2da`, `--color-image-bg #efe9e1`) and still contains `[hidden] { display: none !important; }`.
- [ ] **AC2**: `index.html` loads Cormorant Garamond (500, 600) and Inter (400, 500, 600) from Google Fonts via `<link>` with two `preconnect` hints, before `styles.css`; headings, logo, and prices use Cormorant Garamond; body text uses Inter.
- [ ] **AC3**: Hero shows the eyebrow `The Everyday Collection`, the unchanged heading and tagline, and an outline bronze `Shop now` button that fills on hover/focus.
- [ ] **AC4**: Product cards are borderless with a 4:5 image frame; images use the four tinted `placehold.co/600x750/EFE9E1/8C8073…&font=playfair-display` URLs; name and price share a row, description below; prices still render `$19.99`, `$24.00`, `$12.50`, `$49.99`.
- [ ] **AC5**: Hover effects work as specified (nav underline, button fill, clipped image zoom ≤ 1.04) and are all disabled under `prefers-reduced-motion: reduce`.
- [ ] **AC6**: At 375px the header stacks, the grid is one column, and there is no horizontal scroll; at ≥ 1100px the grid shows 4 columns.
- [ ] **AC7**: All IDs, existing visible copy, status messages, and error/empty-state behavior are unchanged; `app.js` contains no `innerHTML`; `node --check app.js` passes.
- [ ] **AC8**: Of the application files, only `styles.css`, `index.html`, `app.js`, and `data/products.json` are modified (HubLaunch tracking artifacts — this plan file, `ralph.md`, `.hublaunch/lessons/*` — are excluded from this check); no `package.json` or other new application files are added; the header is not sticky; no dark-mode rules are added.

#### Definition of Done

- All acceptance criteria met
- Phase 4 verification steps completed (browser checklist if a browser is available)
- New commits pushed on top of PR #2's branch `ecommerce-landing-page`
- No application files outside the four listed above modified (HubLaunch tracking artifacts excluded)

### 11. Dependencies & Related Work

#### Dependencies

- [ ] Depends on: PR #2 (branch `ecommerce-landing-page`) — this work builds directly on its files.
- [ ] Required external setup: none (internet access for Google Fonts and placehold.co at runtime).

#### Blockers

- [ ] None.

#### Related Issues/PRs

- Builds on PR #2: https://github.com/thabunghula-oss/testRepo2/pull/2 (which closes #1).
- Original page plan: `.hublaunch/plans/backlog/2026-10-08-21:37-ecommerce-landing-page.md` (on the PR branch). Its `styles.css` color values and "system font stack" are superseded by this plan; its structural constraints (IDs, `[hidden]` rule, `textContent`, zero npm dependencies, non-sticky header) still apply.

</details>
