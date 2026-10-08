# Add simple static ecommerce landing page with products loaded from JSON

## Plan Summary

- **What/why**: Creates a minimal, static ecommerce landing page ("Simple Shop") with a header, hero, product grid, and footer; the product grid is rendered from a local `data/products.json` file so product data can later be swapped for a real API.
- **Key decision**: Plain HTML + CSS + vanilla JavaScript with **zero dependencies and no build step** (no `package.json`, no framework, no Tailwind) — chosen because the requirement is "very simple". The page is served by any static server (`npx serve .` or `python3 -m http.server`) because browsers block `fetch()` of local JSON over `file://`.
- **Most important files**: `app.js` (fetches JSON and renders product cards) and `index.html` (page structure).
- **Priority/complexity**: Medium priority, Simple complexity.

### 2. Problem Statement

The repository `thabunghula-oss/testRepo2` currently contains no application code. An ecommerce landing page is needed as a starting point. It must be as simple as possible and read its product data from a JSON file for now (no backend, no database, no API).

#### Planning Context

> **Note**: This section captures key points from the planning discussion to provide complete context for implementation.

**Key Requirements Discussed:**

- The page must be "very simple" — the simplest option was chosen for every decision.
- Product data must be read from a JSON file at runtime.
- The page has exactly four sections: header, hero, product grid, footer.
- Only products come from JSON. Hero text, header, and footer text are hardcoded in `index.html`.
- Product cards are display-only: no "Add to cart" button, no cart, no product detail pages, no links on cards.
- 4 sample products with generic items, placeholder images from `https://placehold.co`.
- Store name: **Simple Shop**.
- Prices are displayed in US dollars, formatted like `$19.99`.
- Layout is responsive: the product grid collapses to 1 column on phone-width screens.
- If the JSON fails to load, show the inline message `Products could not be loaded.` in place of the grid.
- No automated tests — a manual testing checklist only.
- Local only — no deployment configuration.

**Decisions Made:**

- **Plain HTML/CSS/vanilla JS over Vite/React/Next.js**: no tooling to install or maintain; the page works with any static file server. A framework can be introduced later if the page grows.
- **Runtime `fetch()` of JSON over embedding data in JS**: the requirement is explicitly to "read the data from JSON", and keeping data in a separate `.json` file makes it trivial to replace with an API endpoint later (only the URL in `app.js` changes).
- **Plain CSS over Tailwind**: no build step and no CDN script needed.
- **Inline error message over silently failing**: the most likely failure is someone opening `index.html` directly from disk (`file://`), where `fetch()` fails. A blank grid would be confusing; the message costs ~3 lines.
- **No per-field validation of product objects**: the JSON is hand-authored and lives in the repo, so the code trusts its shape. Only network/parse failure and an empty array are handled.
- **DOM APIs with `textContent` instead of `innerHTML`**: avoids accidental HTML injection if product data ever comes from an external source.

**Out of Scope:**

- Cart, checkout, "Add to cart" buttons, product detail pages, search, filtering, sorting, categories.
- Testimonials, newsletter signup, category tiles.
- Any build tool, package manager setup (`package.json`), framework, CSS framework, or linting setup.
- Automated tests (unit, integration, or end-to-end).
- Deployment (Vercel, GitHub Pages, etc.).
- Real product images or local image assets.
- Dark mode, internationalization, multiple currencies.

#### Background & Context

- **Why is this needed?** To have a basic storefront landing page to build on.
- **Current state**: The repository has no application code. Tracked files on `main` are only `.env` (comments only). Locally there are HubLaunch tooling directories (`.hublaunch/`, `.agents/`, `.claude/`, `.vscode/`) and a `.gitignore` that only lists HubLaunch entries.
- **Who is affected?** Visitors to the landing page; developers who will later extend it.

**Current Behavior**:

- There is no web page in the repository.

**Desired Behavior**:

- Running `npx serve .` (or `python3 -m http.server`) in the repository root and opening the printed URL shows the Simple Shop landing page with a header, a hero section, a grid of 4 products loaded from `data/products.json`, and a footer.

### 3. Detailed Requirements

#### Functional Requirements

1. **Header**
   - Shows the store name `Simple Shop` as a link to `#top` (the top of the page).
   - Shows a `<nav>` with three plain text links: `Home` → `#top`, `Products` → `#products`, `Contact` → `#contact`.

2. **Hero**
   - Heading (`<h1>`): `Everyday essentials, simply priced.`
   - Tagline (`<p>`): `Browse our hand-picked selection of quality products.`
   - A `Shop now` link styled as a button, `href="#products"`, which scrolls to the product grid. Scrolling is smooth via CSS `scroll-behavior: smooth` on `html`.

3. **Product grid**
   - Section with `id="products"` and heading (`<h2>`) `Featured products`.
   - On page load, `app.js` fetches `data/products.json` and renders one card per product, in file order.
   - Each card shows: image (from `image`, with `alt` set to the product `name`), name (`<h3>`), formatted price, and description.
   - Price formatting: `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`, e.g. `24` → `$24.00`, `19.99` → `$19.99`.
   - Edge case — fetch fails, non-2xx response, or invalid JSON: hide the grid and show the status message `Products could not be loaded.`; log the error with `console.error`.
   - Edge case — JSON is a valid but empty array (or not an array): show the status message `No products available.`

4. **Footer**
   - Element with `id="contact"`, text: `© 2026 Simple Shop. All rights reserved.` (year hardcoded).

5. **Responsive layout**
   - Product grid uses CSS Grid `repeat(auto-fill, minmax(220px, 1fr))`, which yields multiple columns on desktop and 1 column at phone widths (e.g. 375px).
   - Page content is constrained to a max width of `1100px`, centered, with `16px` side padding.
   - No horizontal scrolling at 375px width.

#### Technical Requirements

- **Technology/Framework**: HTML5, CSS3, vanilla JavaScript (ES2020+, no modules needed). No dependencies.
- **Location**: All new files live at the repository root, plus `data/products.json`.
- **Dependencies**: None. Placeholder images are loaded from `https://placehold.co` at runtime (requires internet).
- **Constraints**: Must work in current Chrome, Firefox, and Safari. Must be served over HTTP (not `file://`).

#### Non-Functional Requirements

- **Performance**: Single small JSON request; images use `loading="lazy"` and explicit `width`/`height` of `400` to avoid layout shift.
- **Security**: All product text is inserted with `textContent` (never `innerHTML`). Image URLs are set via `img.src`. No user input, no forms, no secrets.
- **Backwards Compatibility**: Not applicable — no existing code.
- **Error Handling**: Load failures show `Products could not be loaded.` in the page and log details via `console.error`.

### 4. Proposed Solution

**High-level approach**: Add four static files at the repository root (`index.html`, `styles.css`, `app.js`, `README.md`) and one data file (`data/products.json`). `index.html` contains all static content and an empty grid container. `app.js` runs after the HTML is parsed (`defer`), fetches the JSON, and builds product cards with DOM APIs.

```
 Browser loads index.html ──▶ styles.css
          │
          ▼ (defer)
       app.js ──fetch──▶ data/products.json
          │
          ├─ ok, non-empty array ──▶ render cards into #product-grid
          ├─ ok, empty / not array ──▶ show "No products available."
          └─ error ──▶ show "Products could not be loaded."
```

#### Key Components

1. **`index.html`** — page structure
   - Static header, hero, products section (with empty grid and hidden status paragraph), footer.
   - Links `styles.css` and loads `app.js` with `defer`.
   - Why: keeps all non-product content static and readable without JS.

2. **`app.js`** — data loading and rendering
   - `loadProducts()` fetches and parses the JSON; `renderProducts(products)` builds cards; `showStatus(message)` shows the status paragraph.
   - Why: smallest possible separation that keeps fetch, render, and error display readable.

3. **`data/products.json`** — product data
   - Array of 4 product objects with `id`, `name`, `price`, `image`, `description`.
   - Why: replaceable data source; later an API endpoint can return the same shape.

4. **`styles.css`** — all styling
   - CSS custom properties for colors, system font stack, header/hero/grid/card/footer styles.

5. **`README.md`** — how to run the page locally.

#### Files Likely to Change

- `index.html` (new) — page markup.
- `styles.css` (new) — all styles.
- `app.js` (new) — fetch + render logic.
- `data/products.json` (new) — sample product data.
- `README.md` (new) — run instructions.

No existing files are modified. Do **not** create `package.json` or modify anything under `.hublaunch/`, `.agents/`, `.claude/`, `.vscode/`, or `.gitignore`.

#### Code Patterns to Follow

> **Note**: The repository contains no existing application code, so there are no in-repo patterns to reference. Follow the code below.

**`data/products.json`** (use exactly this content):

```json
[
  {
    "id": 1,
    "name": "Classic T-Shirt",
    "price": 19.99,
    "image": "https://placehold.co/400x400?text=T-Shirt",
    "description": "Soft cotton tee for everyday wear."
  },
  {
    "id": 2,
    "name": "Canvas Tote Bag",
    "price": 24,
    "image": "https://placehold.co/400x400?text=Tote+Bag",
    "description": "Sturdy tote with plenty of room for the essentials."
  },
  {
    "id": 3,
    "name": "Ceramic Mug",
    "price": 12.5,
    "image": "https://placehold.co/400x400?text=Mug",
    "description": "12 oz mug, dishwasher and microwave safe."
  },
  {
    "id": 4,
    "name": "Wireless Earbuds",
    "price": 49.99,
    "image": "https://placehold.co/400x400?text=Earbuds",
    "description": "Compact earbuds with a 20-hour battery case."
  }
]
```

**`index.html` structure** (content and IDs are required; exact whitespace is not):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Simple Shop</title>
  <link rel="stylesheet" href="styles.css" />
  <script src="app.js" defer></script>
</head>
<body id="top">
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="#top">Simple Shop</a>
      <nav class="nav">
        <a href="#top">Home</a>
        <a href="#products">Products</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h1>Everyday essentials, simply priced.</h1>
        <p>Browse our hand-picked selection of quality products.</p>
        <a class="button" href="#products">Shop now</a>
      </div>
    </section>

    <section id="products" class="products">
      <div class="container">
        <h2>Featured products</h2>
        <p id="products-status" class="status" hidden></p>
        <div id="product-grid" class="product-grid"></div>
      </div>
    </section>
  </main>

  <footer id="contact" class="site-footer">
    <div class="container">
      <p>© 2026 Simple Shop. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
```

**`app.js`** (reference implementation):

```js
const PRODUCTS_URL = 'data/products.json';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Fetches the product list from the JSON file. Throws on network, HTTP, or parse errors. */
async function loadProducts() {
  const response = await fetch(PRODUCTS_URL);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} loading ${PRODUCTS_URL}`);
  }
  return response.json();
}

/** Shows a message in place of the product grid. */
function showStatus(message) {
  const status = document.getElementById('products-status');
  status.textContent = message;
  status.hidden = false;
  document.getElementById('product-grid').hidden = true;
}

/** Builds one product card element. Uses textContent so product data is never parsed as HTML. */
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  img.width = 400;
  img.height = 400;
  img.loading = 'lazy';

  const name = document.createElement('h3');
  name.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = priceFormatter.format(product.price);

  const description = document.createElement('p');
  description.className = 'product-description';
  description.textContent = product.description;

  card.append(img, name, price, description);
  return card;
}

/** Renders all products into the grid. */
function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  grid.replaceChildren(...products.map(createProductCard));
}

async function init() {
  try {
    const products = await loadProducts();
    if (!Array.isArray(products) || products.length === 0) {
      showStatus('No products available.');
      return;
    }
    renderProducts(products);
  } catch (error) {
    console.error('Failed to load products:', error);
    showStatus('Products could not be loaded.');
  }
}

init();
```

Because the script is loaded with `defer`, the DOM is fully parsed before `init()` runs — no `DOMContentLoaded` listener is needed.

**`styles.css` requirements** (exact values below; additional cosmetic rules are fine as long as they stay plain CSS):

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-muted: #6b7280;
  --color-accent: #2563eb;
  --color-accent-text: #ffffff;
  --color-surface: #f3f4f6;
  --color-border: #e5e7eb;
}

html { scroll-behavior: smooth; }

*, *::before, *::after { box-sizing: border-box; }

/* Required: author rules like `.product-grid { display: grid }` otherwise override
   the `hidden` attribute, so showStatus() could not hide the grid. */
[hidden] { display: none !important; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.5;
}

.container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.product-card img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
```

Also style: `.site-header` (flex row, logo left, nav right, bottom border), `.hero` (surface background, vertical padding 64px, centered text), `.button` (accent background, white text, padding, rounded corners, no underline), `.product-card` (border, rounded corners, padding, `overflow: hidden`), `.product-price` (bold), `.product-description` and `.status` (muted color), `.site-footer` (top border, muted small text, vertical padding).

**`README.md`** content (minimum):

```markdown
# Simple Shop

A minimal static ecommerce landing page. Products are loaded from `data/products.json`.

## Run locally

The page must be served over HTTP — opening `index.html` directly (`file://`) blocks loading the JSON.

From the repository root, run either:

    npx serve .

or:

    python3 -m http.server 8000

Then open the URL that is printed (e.g. http://localhost:3000 for `serve`, http://localhost:8000 for Python).

## Editing products

Edit `data/products.json`. Each product needs `id`, `name`, `price` (number, USD), `image` (URL), and `description`.
```

**Anti-Patterns to Avoid:**

- Don't use `innerHTML` (or template strings inserted as HTML) for product data — use `textContent` and DOM APIs as shown.
- Don't add `package.json`, `node_modules`, a bundler, a framework, or a CSS framework — the decision is zero dependencies.
- Don't embed product data in `app.js` or `index.html` — it must be read from `data/products.json` at runtime.
- Don't use `type="module"` or ES `import` of the JSON — keep a plain deferred script with `fetch()`.

### 5. Implementation Steps

#### Phase 1: Data and markup

- [ ] Create `data/products.json` with exactly the 4 products shown above.
- [ ] Create `index.html` with the structure, text, IDs, and classes shown above.

#### Phase 2: Behavior

- [ ] Create `app.js` implementing `loadProducts()`, `showStatus()`, `createProductCard()`, `renderProducts()`, and `init()` as shown above.

#### Phase 3: Styling

- [ ] Create `styles.css` with the required rules above plus the listed component styles.
- [ ] Verify at 375px width that the grid is 1 column and there is no horizontal scroll.

#### Phase 4: Documentation and verification

- [ ] Create `README.md` with run and editing instructions.
- [ ] Run through the Manual Testing Checklist (section 8) with `npx serve .` or `python3 -m http.server 8000`. If no browser is available in the implementation environment, at minimum: start the server, confirm `curl -s http://localhost:8000/data/products.json` returns the JSON and `curl -s http://localhost:8000/` returns `index.html`, validate the JSON with `python3 -m json.tool data/products.json`, run `node --check app.js`, and confirm by reading the code that `app.js` contains no `innerHTML`.

Phases 1–3 can be done in any order; Phase 4 comes last.

<details>
<summary><b>Implementation Detail</b></summary>

### 6. Edge Cases & Considerations

#### Edge Cases to Handle

1. **Page opened via `file://`**: `fetch()` fails → status shows `Products could not be loaded.`; error is logged to the console. Header, hero, and footer still render.
2. **`data/products.json` missing (404)**: `response.ok` is false → same as above.
3. **Invalid JSON**: `response.json()` throws → same as above.
4. **Empty array `[]` or non-array JSON**: status shows `No products available.`
5. **Placeholder image fails to load (offline)**: browser shows the `alt` text (product name); no special handling.
6. **JavaScript disabled**: header, hero, and footer render; the product grid stays empty. Acceptable — no `<noscript>` handling required.

#### Potential Challenges

- ⚠️ **`npx serve` first run**: downloads the `serve` package, which requires internet and Node/npm. `python3 -m http.server` is documented as the alternative.
- ⚠️ **Hash links and sticky headers**: the header is **not** sticky, so anchor scrolling needs no offset handling. Do not make the header sticky.

#### Security Considerations

- Product strings are written with `textContent`, preventing HTML injection.
- No user input, forms, cookies, storage, or secrets are involved.
- Only external resource is `https://placehold.co` images.

### 7. Technical Considerations

#### Dependencies

- None. No `package.json` is created.

#### Configuration Changes

- None.

#### Environment Variables

- None.

#### API Rate Limiting

- Not applicable (single static JSON file).

#### Error Handling Strategies

- One `try/catch` in `init()` covers fetch, HTTP status, and JSON parse failures.
- User-facing message: `Products could not be loaded.`
- Developer detail: `console.error('Failed to load products:', error)`.

### 8. Testing Requirements

#### Unit Tests

- None — out of scope by decision (no test tooling is added).

#### Integration Tests

- None — out of scope by decision.

#### Manual Testing Checklist

1. **Setup**: From the repository root, run `npx serve .` (or `python3 -m http.server 8000`) and open the printed URL.
2. **Happy path**:
   - Expected: header shows `Simple Shop` and links `Home`, `Products`, `Contact`; hero shows the heading, tagline, and `Shop now` button; 4 product cards appear in this order: Classic T-Shirt `$19.99`, Canvas Tote Bag `$24.00`, Ceramic Mug `$12.50`, Wireless Earbuds `$49.99`, each with an image and description; footer shows `© 2026 Simple Shop. All rights reserved.`; browser console has no errors.
3. **Navigation**: Click `Shop now` → page smoothly scrolls to `Featured products`. Click `Contact` → scrolls to footer. Click `Home` or the logo → scrolls to top.
4. **Responsive**: In browser devtools, set width to 375px → products show in 1 column, no horizontal scrollbar. At 1280px → multiple columns.
5. **Error state**: Open `index.html` directly from disk (`file://…/index.html`) → `Products could not be loaded.` is shown in the products section; console shows `Failed to load products:` with an error.
6. **Empty state**: Temporarily change `data/products.json` to `[]`, reload → `No products available.` is shown. Restore the file afterwards.

#### Test Data Requirements

- `data/products.json` as specified in section 4.

### 9. Documentation Updates

#### User-Facing Documentation

- [ ] Create `README.md` with the content specified in section 4 (run locally, editing products).

#### Code Documentation

- [ ] One-line JSDoc comment on each function in `app.js`, as in the reference implementation.

#### Examples to Include

```bash
# Serve the page locally
npx serve .

# Or, with Python
python3 -m http.server 8000
```

### 10. Acceptance Criteria

- [ ] **AC1**: The repository root contains `index.html`, `styles.css`, `app.js`, `README.md`, and `data/products.json`; no `package.json` or other dependency/config files were added.
- [ ] **AC2**: Serving the repository root over HTTP and opening it shows the header, hero, 4 product cards (data from `data/products.json`), and footer, with no console errors.
- [ ] **AC3**: Prices render as `$19.99`, `$24.00`, `$12.50`, `$49.99`.
- [ ] **AC4**: Product text is inserted with `textContent`; `app.js` contains no use of `innerHTML`.
- [ ] **AC5**: At 375px viewport width the grid is a single column and there is no horizontal scrolling.
- [ ] **AC6**: Opening `index.html` via `file://` shows `Products could not be loaded.`; an empty JSON array shows `No products available.`
- [ ] **AC7**: `Shop now` scrolls to the products section; nav links scroll to their targets.
- [ ] **AC8**: `README.md` explains how to run the page with `npx serve .` or `python3 -m http.server 8000` and how to edit products.

#### Definition of Done

- All acceptance criteria met
- Manual testing checklist completed
- Code reviewed and approved
- README added
- No files outside the five listed above were added or modified

### 11. Dependencies & Related Work

#### Dependencies

- [ ] Depends on: nothing.
- [ ] Required external setup: none (internet access for placeholder images; Node/npm or Python 3 to serve locally).

#### Blockers

- [ ] None.

#### Related Issues/PRs

- None.

</details>
