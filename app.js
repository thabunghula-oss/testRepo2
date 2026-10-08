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

/** Renders all products into the grid. */
function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  grid.replaceChildren(...products.map(createProductCard));
}

/** Loads products on page load and renders cards or an appropriate status message. */
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
