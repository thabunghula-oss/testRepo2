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
