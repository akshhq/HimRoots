import { products, getProduct, carouselSlides, clinicalStudies, customerReviews } from './data.js';

const app = document.querySelector('#app');
const cartKey = 'himroots-cart-storage';
let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
let lastOrder = JSON.parse(sessionStorage.getItem('himroots-last-order') || 'null');

// Product Detail page state
let activeSlideIndex = 0;
let selectedPackId = 'pack-1';
let productQuantity = 1;
let openAccordionKey = 'description';
let activeStudyIndex = 0;
let reviewFilter = 'all';

const money = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
const escapeHtml = (str = '') => String(str).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);

const saveCart = () => localStorage.setItem(cartKey, JSON.stringify(cart));
const getCartTotals = () => ({
  count: cart.reduce((n, item) => n + item.quantity, 0),
  subtotal: cart.reduce((n, item) => n + item.price * item.quantity, 0)
});

function addToCart(product, variantId = 'pack-1', quantity = 1) {
  const variant = product.variants ? product.variants.find(v => v.id === variantId) : null;
  const itemId = variant && variant.id !== 'pack-1' ? `${product.id}_${variant.id}` : product.id;
  const name = variant && variant.id !== 'pack-1' ? `${product.name} (${variant.name})` : product.name;
  const price = variant ? variant.price : product.price;
  const volume = variant ? variant.volume : product.volume;

  const existing = cart.find(item => item.id === itemId);
  if (existing) {
    existing.quantity = Math.min(50, existing.quantity + quantity);
  } else {
    cart.push({
      id: itemId,
      productId: product.id,
      name,
      price,
      originalPrice: variant ? variant.originalPrice : product.originalPrice,
      volume,
      image: product.image,
      quantity
    });
  }
  saveCart();
  render();
}

function updateCartQuantity(id, quantity) {
  cart = cart.map(item => item.id === id ? { ...item, quantity } : item).filter(item => item.quantity > 0);
  saveCart();
  render();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  render();
}

// ==========================================================================
// HEADER & FOOTER
// ==========================================================================
function globalHeader() {
  const { count } = getCartTotals();
  const path = location.pathname.replace(/\/$/, '') || '/';
  return `
    <div class="announcement-bar">
      <span>Get 10% OFF on all Himalayan Formulations — Free Shipping Across India</span>
      <strong>Use Code: HIMROOTS10</strong>
    </div>
    <header class="global-header">
      <a href="/" data-route class="brand-link">
        <img src="/assets/images/himroots-logo.png" alt="Himroots Wellness Logo">
        <div>
          <span class="brand-title">HIMROOTS</span>
          <span class="brand-tagline">SIP THE POWER OF HIMALAYAS</span>
        </div>
      </a>
      <button class="menu-toggle" data-menu aria-label="Toggle Navigation">☰</button>
      <nav class="nav-links">
        <a href="/" data-route class="${path === '/' ? 'active' : ''}">Home</a>
        <a href="/shop" data-route class="${path === '/shop' ? 'active' : ''}">Shop</a>
        <a href="/about-sea-buckthorn" data-route class="${path.includes('sea-buckthorn') ? 'active' : ''}">Sea Buckthorn</a>
        <a href="/about" data-route class="${path === '/about' ? 'active' : ''}">Our Story</a>
        <a href="/contact" data-route class="${path === '/contact' ? 'active' : ''}">Contact Us</a>
      </nav>
      <a href="/cart" data-route class="cart-button">
        Bag <b>${count}</b>
      </a>
    </header>
  `;
}

function globalFooter() {
  return `
    <footer class="global-footer">
      <div class="footer-content">
        <div>
          <h3 class="text-gold" style="font-size: 1.6rem; letter-spacing: 0.15em;">HIMROOTS</h3>
          <p style="font-family: var(--font-display); color: var(--gold); letter-spacing: 0.2em; font-size: 0.75rem; text-transform: uppercase;">
            SIP THE POWER OF HIMALAYAS
          </p>
          <p style="max-width: 420px; font-size: 0.85rem; color: var(--text-muted);">
            Pure wild-foraged Himalayan Sea Buckthorn formulations from the high altitudes of Ladakh at ~12,000 ft. Cold-pressed, unfiltered, zero added sugar.
          </p>
        </div>
        <div>
          <h4 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold);">Explore</h4>
          <p style="font-size: 0.85rem; line-height: 2;">
            <a href="/shop" data-route>All Formulations</a><br>
            <a href="/about-sea-buckthorn" data-route>Botanical Monograph</a><br>
            <a href="/about" data-route>Himalayan Story</a><br>
            <a href="/contact" data-route>Customer Care</a>
          </p>
        </div>
        <div>
          <h4 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold);">Pure Standards</h4>
          <p style="font-size: 0.85rem; line-height: 2; color: var(--text-muted);">
            ✓ Wild-Harvested Purity<br>
            ✓ GMP & FSSAI Certified<br>
            ✓ US FDA Registered Facility<br>
            ✓ Heavy Metal Free Verified
          </p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Himroots Wellness. All rights reserved.</span>
        <span>Crafted for daily cellular vitality</span>
      </div>
    </footer>
  `;
}

function layout(content) {
  app.innerHTML = `${globalHeader()}<main>${content}</main>${globalFooter()}`;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ==========================================================================
// PRODUCT SPECIFIC PAGE (FULL 11-SECTION HIGH-CONVERTING LAYOUT)
// ==========================================================================
function renderInfographicSlide(slide) {
  if (slide.type === 'omega') {
    return `
      <div class="carousel-infographic">
        <div class="carousel-infographic-header">
          <span class="eyebrow" style="margin: 0;">Full Spectrum Profile</span>
          <span style="font-size: 0.7rem; color: var(--gold);">Omega 3, 6, 7 & 9</span>
        </div>
        <div class="carousel-infographic-body">
          <h3 class="carousel-infographic-title">Rare Synergy of 4 Omegas</h3>
          <p style="font-size: 0.75rem; text-align: center; color: var(--text-muted);">One of the only plants on Earth providing the complete omega family naturally:</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem;">
            <div style="background: #000; border: 1px solid var(--border-gold); padding: 0.6rem; border-radius: 8px;">
              <b style="color: var(--gold); font-size: 0.85rem; display: block;">Omega-7</b>
              <small style="font-size: 0.65rem; color: #ccc;">Dermal hydration & mucous membranes</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: var(--gold); font-size: 0.85rem; display: block;">Omega-3</b>
              <small style="font-size: 0.65rem; color: #ccc;">Heart health & healthy inflammation</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: var(--gold); font-size: 0.85rem; display: block;">Omega-6</b>
              <small style="font-size: 0.65rem; color: #ccc;">Reinforces natural skin barrier</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: var(--gold); font-size: 0.85rem; display: block;">Omega-9</b>
              <small style="font-size: 0.65rem; color: #ccc;">Metabolic wellness & digestive harmony</small>
            </div>
          </div>
        </div>
        <div style="text-align: center; font-size: 0.65rem; color: var(--text-muted); border-top: 1px solid var(--border); pt: 0.5rem;">
          Pure Botanical Chemistry • Wild Harvested Ladakh
        </div>
      </div>
    `;
  }

  if (slide.type === 'vitaminc') {
    return `
      <div class="carousel-infographic">
        <div class="carousel-infographic-header">
          <span class="eyebrow" style="margin: 0;">Potency Comparison</span>
          <span style="font-size: 0.7rem; color: var(--gold);">28x Superiority</span>
        </div>
        <div class="carousel-infographic-body" style="text-align: center;">
          <h3 class="carousel-infographic-title">Up to 28x More Vitamin C than Oranges</h3>
          <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin: 1.5rem 0;">
            <div style="background: #000; border: 1px solid var(--border-gold); padding: 1rem 1.5rem; border-radius: 12px;">
              <span style="font-size: 3rem; font-weight: 900; color: var(--gold); display: block; line-height: 1;">28x</span>
              <small style="color: #ffffff; font-weight: bold; font-size: 0.75rem;">Sea Buckthorn</small>
            </div>
            <span style="color: #666; font-size: 1.2rem; font-weight: bold;">vs</span>
            <div style="background: #000; border: 1px solid var(--border); padding: 1rem 1.5rem; border-radius: 12px; opacity: 0.7;">
              <span style="font-size: 2.2rem; font-weight: 900; color: #888; display: block; line-height: 1;">1x</span>
              <small style="color: #888; font-size: 0.75rem;">Fresh Citrus</small>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted);">
            Naturally bonded with bioflavonoids and natural lipids for superior cellular absorption.
          </p>
        </div>
        <div style="text-align: center; font-size: 0.65rem; color: var(--text-muted); border-top: 1px solid var(--border); pt: 0.5rem;">
          Raw, Unheated Vitamin C Complex
        </div>
      </div>
    `;
  }

  if (slide.type === 'bioactives') {
    return `
      <div class="carousel-infographic">
        <div class="carousel-infographic-header">
          <span class="eyebrow" style="margin: 0;">Nutrient Matrix</span>
          <span style="font-size: 0.7rem; color: var(--gold);">190+ Compounds</span>
        </div>
        <div class="carousel-infographic-body">
          <h3 class="carousel-infographic-title">190+ Bioactive Nutrients</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 1rem; text-align: center;">
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: #fff; font-size: 0.75rem; display: block;">Vitamins</b>
              <small style="font-size: 0.6rem; color: var(--gold);">C, E, K, B1, B2</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: #fff; font-size: 0.75rem; display: block;">Flavonoids</b>
              <small style="font-size: 0.6rem; color: var(--gold);">Quercetin, Kaempferol</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: #fff; font-size: 0.75rem; display: block;">Carotenoids</b>
              <small style="font-size: 0.6rem; color: var(--gold);">Beta-Carotene, Lycopene</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: #fff; font-size: 0.75rem; display: block;">Sterols</b>
              <small style="font-size: 0.6rem; color: var(--gold);">Beta-Sitosterol</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: #fff; font-size: 0.75rem; display: block;">Amino Acids</b>
              <small style="font-size: 0.6rem; color: var(--gold);">18 Natural Aminos</small>
            </div>
            <div style="background: #000; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px;">
              <b style="color: #fff; font-size: 0.75rem; display: block;">Curcuminoids</b>
              <small style="font-size: 0.6rem; color: var(--gold);">Synergistic Extract</small>
            </div>
          </div>
        </div>
        <div style="text-align: center; font-size: 0.65rem; color: var(--text-muted); border-top: 1px solid var(--border); pt: 0.5rem;">
          High-Altitude Phytochemical Density
        </div>
      </div>
    `;
  }

  // Fallback / Science / Lab infographic
  return `
    <div class="carousel-infographic">
      <div class="carousel-infographic-header">
        <span class="eyebrow" style="margin: 0;">Clinical Validation</span>
        <span style="font-size: 0.7rem; color: var(--gold);">${slide.badge}</span>
      </div>
      <div class="carousel-infographic-body" style="text-align: center;">
        <h3 class="carousel-infographic-title">${slide.title}</h3>
        <p style="font-size: 0.8rem; color: #cccccc; max-width: 320px; margin: 1rem auto;">
          ${slide.subtitle}
        </p>
        <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem;">
          <span style="font-size: 0.68rem; background: #000; border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 6px;">GMP Certified</span>
          <span style="font-size: 0.68rem; background: #000; border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 6px;">FSSAI Compliant</span>
          <span style="font-size: 0.68rem; background: #000; border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 6px;">US FDA Facility</span>
        </div>
      </div>
      <div style="text-align: center; font-size: 0.65rem; color: var(--text-muted); border-top: 1px solid var(--border); pt: 0.5rem;">
        Third-Party Lab Tested for Zero Heavy Metals & Zero Contaminants
      </div>
    </div>
  `;
}

function productPage(slug) {
  const product = getProduct(slug);
  if (!product) return notFound();

  const variant = product.variants ? product.variants.find(v => v.id === selectedPackId) || product.variants[0] : null;
  const currentPrice = variant ? variant.price : product.price;
  const originalPrice = variant ? variant.originalPrice : product.originalPrice;
  const currentSku = variant ? variant.sku : product.sku;
  const memberPrice = variant ? variant.memberPrice : 854;

  const currentSlide = carouselSlides[activeSlideIndex] || carouselSlides[0];

  const filteredReviews = reviewFilter === 'all'
    ? customerReviews
    : customerReviews.filter(r => r.rating === 5);

  const content = `
    <!-- SECTION 1: PROMO BANNER -->
    <div style="background: #050505; border-bottom: 1px solid var(--border); padding: 0.5rem 1rem; text-align: center; font-size: 0.72rem; color: #ccc;">
      <span style="color: var(--gold); font-weight: bold; margin-right: 0.5rem;">[Special Offer]</span>
      Get 10% OFF on all Himalayan Formulations • Free Express Delivery Across India
    </div>

    <!-- BREADCRUMB -->
    <div style="max-w: 1280px; margin: 0 auto; padding: 1rem clamp(1rem, 4vw, 3rem) 0; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
      <div>
        <a href="/" data-route style="color: #aaa;">Home</a> / 
        <a href="/shop" data-route style="color: #aaa;">Shop</a> / 
        <span style="color: #fff;">${escapeHtml(product.name)}</span>
      </div>
      <a href="/about-sea-buckthorn" data-route style="color: var(--gold); font-weight: 600;">
        Botanical Monograph →
      </a>
    </div>

    <!-- SECTION 3: PRODUCT HERO SECTION -->
    <section class="product-hero-section">
      
      <!-- LEFT: 18-Slide Carousel -->
      <div class="carousel-container">
        <div class="carousel-viewer">
          ${currentSlide.image 
            ? `<img src="${currentSlide.image}" alt="${escapeHtml(currentSlide.title)}">` 
            : renderInfographicSlide(currentSlide)
          }

          <div class="carousel-badge-top">${currentSlide.badge || 'Cold Pressed'}</div>
          <div class="carousel-badge-discount">25% OFF</div>

          <button class="carousel-prev" data-carousel-prev aria-label="Previous image">‹</button>
          <button class="carousel-next" data-carousel-next aria-label="Next image">›</button>

          <div class="carousel-caption-bottom">
            <span style="color: #fff; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 0.5rem;">
              ${escapeHtml(currentSlide.title)}
            </span>
            <span style="color: var(--gold); font-family: monospace; shrink-0;">
              ${activeSlideIndex + 1} / ${carouselSlides.length}
            </span>
          </div>
        </div>

        <!-- Thumbnail Strip -->
        <div class="carousel-thumbnails">
          ${carouselSlides.map((slide, idx) => `
            <button class="thumb-btn ${activeSlideIndex === idx ? 'active' : ''}" data-slide-index="${idx}" title="${escapeHtml(slide.title)}">
              ${slide.image 
                ? `<img src="${slide.image}" alt="Thumb ${idx + 1}">` 
                : `<div class="thumb-card">${escapeHtml(slide.badge)}</div>`
              }
            </button>
          `).join('')}
        </div>
      </div>

      <!-- RIGHT: Buy Block & Metadata -->
      <div class="product-info-box">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="eyebrow" style="margin: 0;">Wild Himalayan Superfood</span>
          <div class="rating-bar">
            <span>★★★★★</span>
            <b style="color: #fff;">${product.rating}</b>
            <span style="color: var(--text-muted);">/ 5 (${product.reviews} reviews)</span>
          </div>
        </div>

        <h1 style="font-size: clamp(1.8rem, 3.2vw, 2.5rem); margin-bottom: 0.4rem;">
          ${escapeHtml(product.name)}
        </h1>

        <p style="color: var(--gold-light); font-size: 0.95rem; margin-bottom: 1rem; font-weight: 500;">
          ${escapeHtml(product.tagline)}
        </p>

        <!-- Inventory Notice -->
        <div class="stock-alert">
          <span class="stock-dot"></span>
          Only 40 left in stock — High Demand
        </div>

        <!-- Variant & Pricing Picker -->
        <div class="variant-picker">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 0.5rem;">
            Select Pack Variant
          </span>
          <div class="variant-grid">
            ${product.variants ? product.variants.map(v => `
              <div class="variant-card ${selectedPackId === v.id ? 'selected' : ''}" data-select-pack="${v.id}">
                ${v.badge ? `<span class="variant-badge-value">${v.badge}</span>` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <b style="color: #ffffff; font-size: 0.85rem;">${v.name}</b>
                  <span style="font-size: 0.7rem; color: var(--gold); font-weight: bold;">${v.discount}</span>
                </div>
                <small style="color: var(--text-muted); font-size: 0.7rem; display: block; margin-bottom: 0.5rem;">${v.label}</small>
                <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                  <span style="font-size: 1.15rem; font-weight: bold; color: #ffffff;">${money(v.price)}</span>
                  <del style="font-size: 0.78rem; color: #666;">${money(v.originalPrice)}</del>
                </div>
                <span style="font-size: 0.65rem; color: #555; font-family: monospace; display: block; margin-top: 0.35rem;">SKU: ${v.sku}</span>
              </div>
            `).join('') : ''}
          </div>

          <!-- Member Price Banner -->
          <div class="member-price-card">
            <div>
              <b style="font-size: 0.82rem; color: #ffffff; display: block;">
                Member Price: ${money(memberPrice)}
              </b>
              <small style="font-size: 0.7rem; color: var(--text-muted);">
                Save 30% via Membership / Subscription
              </small>
            </div>
            <span style="font-size: 0.65rem; color: var(--gold); border: 1px solid var(--border-gold); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; text-transform: uppercase;">
              Subscribe
            </span>
          </div>

          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.75rem;">
            ✓ Free express shipping across India • Inclusive of all taxes
          </div>
        </div>

        <!-- Quantity & Buy Buttons -->
        <div class="qty-cta-row">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="quantity-control">
              <button data-qty-change="-1">−</button>
              <span>${productQuantity}</span>
              <button data-qty-change="1">+</button>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Total: <b style="color: #fff;">${money(currentPrice * productQuantity)}</b>
            </span>
          </div>

          <div class="cta-actions">
            <button class="btn btn-primary" data-add-to-cart="${product.id}">
              Add to Cart
            </button>
            <button class="btn btn-outline" data-buy-now="${product.id}">
              Buy Now
            </button>
          </div>
        </div>

        <!-- Guarantees Strip -->
        <div class="guarantees-strip">
          <div>🛡️ Wild-Harvested Purity</div>
          <div>📦 Gold Foil Sealed</div>
          <div>🚚 Express Dispatched</div>
        </div>

        <!-- Expandable Tabs Accordion -->
        <div class="accordion-wrapper">
          
          <div class="accordion-item">
            <button class="accordion-trigger" data-accordion="description">
              <span>Product Description</span>
              <span>${openAccordionKey === 'description' ? '−' : '+'}</span>
            </button>
            ${openAccordionKey === 'description' ? `
              <div class="accordion-content">
                ${escapeHtml(product.description)}
              </div>
            ` : ''}
          </div>

          <div class="accordion-item">
            <button class="accordion-trigger" data-accordion="ingredients">
              <span>Key Ingredients & Active Compounds</span>
              <span>${openAccordionKey === 'ingredients' ? '−' : '+'}</span>
            </button>
            ${openAccordionKey === 'ingredients' ? `
              <div class="accordion-content">
                <p><strong>Wild Himalayan Sea Buckthorn:</strong> A rare Himalayan superfruit and nature's most concentrated source of Vitamin C, naturally rich in 190+ bioactives and a full-spectrum omega profile of Omega 3, 6, 7 & 9. It helps support skin health, immunity, liver function, gut balance and antioxidant defence.</p>
                <p><strong>Curcumin Extract:</strong> A potent anti-inflammatory and antioxidant compound that helps neutralise oxidative stress and supports the body's natural inflammation response.</p>
                <small style="color: var(--text-muted); display: block; margin-top: 0.5rem;">Zero added sugar • Zero artificial colorants • Zero chemical preservatives</small>
              </div>
            ` : ''}
          </div>

          <div class="accordion-item">
            <button class="accordion-trigger" data-accordion="usage">
              <span>Usage Instructions (How to Take)</span>
              <span>${openAccordionKey === 'usage' ? '−' : '+'}</span>
            </button>
            ${openAccordionKey === 'usage' ? `
              <div class="accordion-content">
                <ul style="padding-left: 1.25rem; margin: 0 0 0.75rem;">
                  <li>Shake the bottle well and mix 10 ml (2 tsp) in 200 ml of water. Take it twice daily, before meals.</li>
                  <li><strong>Important Note:</strong> The black residue in the bottle is completely natural and is due to sea buckthorn seed particles. This is because the product is unfiltered by nature.</li>
                  <li>Colour and taste are subject to natural variation based on harvest conditions.</li>
                  <li>Store in a cool, dry, and dark place. Once opened, refrigerate the bottle and consume within 60 days.</li>
                </ul>
              </div>
            ` : ''}
          </div>

          <div class="accordion-item">
            <button class="accordion-trigger" data-accordion="storage">
              <span>Storage & Shelf Life</span>
              <span>${openAccordionKey === 'storage' ? '−' : '+'}</span>
            </button>
            ${openAccordionKey === 'storage' ? `
              <div class="accordion-content">
                Store in a cool, dry, and dark place away from direct sunlight. Once opened, refrigerate the bottle and consume within 60 days to preserve active enzymes and lipid integrity.
              </div>
            ` : ''}
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 4: PRODUCT FEATURES BANNER (USPs) -->
    <section class="features-banner">
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="eyebrow">Zero Compromise Purity</span>
        <h2 style="font-size: 1.8rem; margin: 0;">Pure Botanical Standards</h2>
      </div>
      <div class="features-banner-grid">
        <div class="feature-pill">
          <div class="feature-pill-icon">💧</div>
          <b>Cold Pressed</b>
          <small>Heat-free extraction</small>
        </div>
        <div class="feature-pill">
          <div class="feature-pill-icon">✨</div>
          <b>Unfiltered</b>
          <small>Retains natural pulp</small>
        </div>
        <div class="feature-pill">
          <div class="feature-pill-icon">🌿</div>
          <b>Zero Added Sugar</b>
          <small>100% natural berry</small>
        </div>
        <div class="feature-pill">
          <div class="feature-pill-icon">📦</div>
          <b>Liquid Pulp</b>
          <small>Concentrate elixir</small>
        </div>
        <div class="feature-pill">
          <div class="feature-pill-icon">🛡️</div>
          <b>Heavy Metal Free</b>
          <small>Clean lab certified</small>
        </div>
        <div class="feature-pill">
          <div class="feature-pill-icon">🏅</div>
          <b>Contaminant Free</b>
          <small>ISO tested safety</small>
        </div>
      </div>
    </section>

    <!-- SECTION 5: CLAIMS & BENEFITS GRID -->
    <section class="claims-section">
      <div style="text-align: center; max-width: 680px; margin: 0 auto 2rem;">
        <span class="eyebrow">Multi-System Efficacy</span>
        <h2 style="font-size: 2.2rem;">Targeted Biological Health Claims</h2>
        <p>Formulated to support the body against chronic environmental and lifestyle oxidative stress.</p>
      </div>
      <div class="claims-grid">
        <div class="claim-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⚡</div>
          <h3>Helps Support Energy & Vitality</h3>
          <p>Naturally rich in B-complex vitamins, amino acids, and iron to combat fatigue and fuel daily mitochondrial energy.</p>
        </div>
        <div class="claim-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔥</div>
          <h3>Helps Reduce Inflammation</h3>
          <p>Synergistic Curcumin Extract pairs with berry lipids for enhanced cellular absorption, curbing systemic inflammation.</p>
        </div>
        <div class="claim-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">✨</div>
          <h3>Helps Promote Skin Health</h3>
          <p>Rare Omega-7 (palmitoleic acid) deeply hydrates dermal layers and reinforces mucosal barriers for a natural glow.</p>
        </div>
        <div class="claim-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🌱</div>
          <h3>Helps Aid Gut & Digestive Health</h3>
          <p>Unfiltered pectin fibers and fatty acids soothe gastric linings and facilitate smooth gastrointestinal motility.</p>
        </div>
        <div class="claim-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🫀</div>
          <h3>Helps Support Liver Function</h3>
          <p>High concentrations of flavonoids (quercetin, isorhamnetin) support hepatic detoxification and lipid balance.</p>
        </div>
        <div class="claim-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🛡️</div>
          <h3>Helps Reduce Oxidative Stress</h3>
          <p>Up to 28x more concentrated Vitamin C than citrus fruit provides extraordinary radical-scavenging protection.</p>
        </div>
      </div>
    </section>

    <!-- SECTION 6: DETAILED BENEFIT COPY -->
    <section class="benefit-deepdive">
      <div class="benefit-deepdive-inner">
        <div>
          <span class="eyebrow">Nutritional Architecture</span>
          <h2 style="font-size: 2.2rem; margin-bottom: 1.25rem;">
            Full-Spectrum Omegas & Nature's Most Concentrated Vitamin C
          </h2>
          <p style="font-size: 0.88rem; line-height: 1.8;">
            Himroots Himalayan Sea Buckthorn delivers a rare full-spectrum omega profile of <strong>Omega 3, 6, 7 & 9</strong>. Omega-7 helps support skin hydration and barrier function, Omega-3 supports heart health and a healthy inflammatory response, Omega-6 helps reinforce the skin barrier, while Omega-9 contributes to metabolic wellness and digestive balance.
          </p>
          <p style="font-size: 0.88rem; line-height: 1.8;">
            Naturally rich in <strong>190+ bioactive compounds</strong>, Sea Buckthorn is one of nature's most concentrated sources of Vitamin C, providing up to <strong>28x more Vitamin C than oranges</strong>. Enhanced with Standardized Curcumin Extract, this unique formulation works in synergy with Sea Buckthorn's naturally occurring phytonutrients.
          </p>
        </div>
        <div class="omega-profile-grid">
          <div class="omega-card featured">
            <b>Omega-7 (Palmitoleic)</b>
            <p>Rare fatty acid dedicated to mucosal hydration (eyes, mouth, gut) and skin elasticity.</p>
          </div>
          <div class="omega-card">
            <b>Omega-3 (ALA)</b>
            <p>Essential fatty acid supporting cardiovascular rhythm and cellular recovery.</p>
          </div>
          <div class="omega-card">
            <b>Omega-6 (Linoleic)</b>
            <p>Reinforces the protective epidermal barrier against environmental dehydration.</p>
          </div>
          <div class="omega-card">
            <b>Omega-9 (Oleic)</b>
            <p>Contributes to metabolic balance, smooth digestion, and arterial wellness.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- LIFESTYLE CARDS & FULL-WIDTH BANNER -->
    <section class="lifestyle-section">
      <div class="lifestyle-cards">
        <div class="lifestyle-card">
          <span class="eyebrow">Card 1 • Heritage</span>
          <h3>Ladakh Wild Harvest at 12,000 ft</h3>
          <p>Hand-foraged berries thriving under extreme high-altitude UV stress, yielding dense botanical protective lipids.</p>
        </div>
        <div class="lifestyle-card">
          <span class="eyebrow">Card 2 • Purity</span>
          <h3>Raw Unfiltered Liquid Pulp</h3>
          <p>Never diluted, never boiled. You can see and taste the natural berry seed particles in every glass.</p>
        </div>
        <div class="lifestyle-card">
          <span class="eyebrow">Card 3 • Synergy</span>
          <h3>Enhanced with Curcumin Extract</h3>
          <p>Curcuminoids require lipid carriers for absorption. Sea buckthorn oils maximize anti-inflammatory bioavailability.</p>
        </div>
      </div>

      <div class="full-lifestyle-banner">
        <span class="eyebrow">Innovation Meets Integrity</span>
        <h2>"Modern Lifestyles create a gap. Sea Buckthorn was built to fill it."</h2>
        <p style="color: #ddd; max-width: 580px; margin: 0 auto; font-size: 0.95rem;">
          Bridging ancient Himalayan medicine and contemporary preventive wellness.
        </p>
      </div>
    </section>

    <!-- SECTION 7: BRAND TRUST BADGES -->
    <section class="trust-metrics-section">
      <div class="trust-metrics-grid">
        <div class="trust-metric-box">
          <b>5 Million</b>
          <span>Satisfied Global Customers</span>
        </div>
        <div class="trust-metric-box">
          <b>20+</b>
          <span>Clinical Studies</span>
        </div>
        <div class="trust-metric-box">
          <b>US FDA</b>
          <span>Registered Manufacturing Facility</span>
        </div>
        <div class="trust-metric-box">
          <b>GMP & FSSAI</b>
          <span>Certified Quality</span>
        </div>
      </div>
    </section>

    <!-- SECTION 8: INGREDIENTS BREAKDOWN -->
    <section class="ingredients-section">
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="eyebrow">Ingredients Profile</span>
        <h2 style="font-size: 2.2rem;">Two Potent Himalayan Botanicals</h2>
      </div>
      <div class="ingredients-grid">
        <div class="ingredient-card highlight">
          <span class="eyebrow" style="margin: 0;">Star Ingredient • 95%</span>
          <h3>Wild Himalayan Sea Buckthorn</h3>
          <p style="font-size: 0.85rem; line-height: 1.8;">
            A rare Himalayan superfruit and nature's most concentrated source of Vitamin C, naturally rich in 190+ bioactives and a full-spectrum omega profile of Omega 3, 6, 7 & 9. It helps support skin health, immunity, liver function, gut balance and antioxidant defence.
          </p>
        </div>
        <div class="ingredient-card">
          <span class="eyebrow" style="margin: 0;">Synergistic Extract • 5%</span>
          <h3>Standardized Curcumin Extract</h3>
          <p style="font-size: 0.85rem; line-height: 1.8;">
            A potent anti-inflammatory and antioxidant compound that helps neutralise oxidative stress and supports the body's natural inflammation response.
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION 9: SCIENTIFIC EVIDENCE SLIDER -->
    <section class="science-section">
      <div class="science-header">
        <div>
          <span class="eyebrow">Peer-Reviewed Evidence</span>
          <h2 style="font-size: 2rem; margin: 0;">Science Behind Our Ingredients</h2>
        </div>
        <div class="science-controls">
          <button data-study-prev aria-label="Previous study">‹</button>
          <button data-study-next aria-label="Next study">›</button>
        </div>
      </div>
      <div class="science-grid">
        ${clinicalStudies.map((study, idx) => `
          <div class="study-card ${activeStudyIndex === idx ? 'active' : ''}">
            <div>
              <div class="study-card-journal">${escapeHtml(study.journal)} (${study.year})</div>
              <small style="color: var(--gold); display: block; font-weight: bold; margin-bottom: 0.35rem;">Focus: ${study.focus}</small>
              <h4>${escapeHtml(study.title)}</h4>
              <p style="font-size: 0.78rem; line-height: 1.6;">${escapeHtml(study.summary)}</p>
            </div>
            <div style="border-top: 1px solid var(--border); pt: 0.5rem; margin-top: 1rem; font-size: 0.7rem; color: #666; display: flex; justify-content: space-between;">
              <span>Study #${study.id} of 6</span>
              <span style="color: var(--gold);">Clinical Study</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SECTION 10: CUSTOMER REVIEWS -->
    <section class="reviews-section">
      <div class="reviews-layout">
        <div class="review-summary-card">
          <span class="eyebrow">Verified Proof</span>
          <h3 style="font-size: 1.4rem;">Customer Reviews</h3>
          <div class="review-score-big">4.73</div>
          <div class="rating-bar" style="margin-top: 0.5rem;">
            <span>★★★★★</span>
            <small style="color: #aaa;">Based on 11 reviews</small>
          </div>

          <div class="score-bars">
            <div class="score-bar-row">
              <span style="width: 45px;">5 Star</span>
              <div class="score-bar-track"><div class="score-bar-fill" style="width: 82%;"></div></div>
              <span style="width: 30px; text-align: right; color: #888;">82%</span>
            </div>
            <div class="score-bar-row">
              <span style="width: 45px;">4 Star</span>
              <div class="score-bar-track"><div class="score-bar-fill" style="width: 18%;"></div></div>
              <span style="width: 30px; text-align: right; color: #888;">18%</span>
            </div>
            <div class="score-bar-row">
              <span style="width: 45px; color: #666;">3 Star</span>
              <div class="score-bar-track"><div class="score-bar-fill" style="width: 0%;"></div></div>
              <span style="width: 30px; text-align: right; color: #666;">0%</span>
            </div>
            <div class="score-bar-row">
              <span style="width: 45px; color: #666;">2 Star</span>
              <div class="score-bar-track"><div class="score-bar-fill" style="width: 0%;"></div></div>
              <span style="width: 30px; text-align: right; color: #666;">0%</span>
            </div>
            <div class="score-bar-row">
              <span style="width: 45px; color: #666;">1 Star</span>
              <div class="score-bar-track"><div class="score-bar-fill" style="width: 0%;"></div></div>
              <span style="width: 30px; text-align: right; color: #666;">0%</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem; border-top: 1px solid var(--border); pt: 1rem;">
            <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.7rem; ${reviewFilter === 'all' ? 'border-color: var(--gold); color: var(--gold);' : ''}" data-review-filter="all">
              All (11)
            </button>
            <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.7rem; ${reviewFilter === '5star' ? 'border-color: var(--gold); color: var(--gold);' : ''}" data-review-filter="5star">
              5 Star (9)
            </button>
          </div>
        </div>

        <div>
          ${filteredReviews.map(rev => `
            <div class="review-card">
              <div class="review-card-header">
                <div>
                  <b style="color: #fff; font-size: 0.9rem;">${escapeHtml(rev.name)}</b>
                  <span style="font-size: 0.7rem; color: #4ade80; margin-left: 0.5rem;">✓ Verified Buyer</span>
                </div>
                <span style="font-size: 0.72rem; color: #666; font-family: monospace;">${rev.date}</span>
              </div>
              <div style="color: var(--gold); font-size: 0.8rem; margin-bottom: 0.35rem;">★★★★★</div>
              <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem; color: #fff;">"${escapeHtml(rev.headline)}"</h4>
              <p style="font-size: 0.82rem; color: #bbb; line-height: 1.6; margin: 0;">
                "${escapeHtml(rev.text)}"
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 11: CERTIFICATIONS & LAB REPORTS -->
    <section class="certifications-section">
      <span class="eyebrow">Trust Marks & Accreditations</span>
      <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Regulatory Safety & Manufacturing Standards</h2>
      <div class="certifications-grid">
        <div class="cert-card">
          <b>GMP</b>
          <small>Good Manufacturing Practice</small>
        </div>
        <div class="cert-card">
          <b>FSSAI</b>
          <small>Food Safety Authority India</small>
        </div>
        <div class="cert-card">
          <b>US FDA</b>
          <small>Registered Facility</small>
        </div>
        <div class="cert-card">
          <b>FSSC 22000</b>
          <small>Food Safety Management</small>
        </div>
      </div>
      <p style="font-size: 0.75rem; color: var(--text-muted); max-width: 650px; margin: 1.5rem auto 0;">
        Independent third-party laboratory verified for zero heavy metals, zero pesticide residues, and verified active omega potency.
      </p>
    </section>
  `;

  layout(content);
}

// ==========================================================================
// HOME, SHOP, ABOUT, BOTANICAL GUIDE, CART, CHECKOUT
// ==========================================================================
function homePage() {
  const content = `
    <section class="hero-section">
      <img src="/assets/images/himalayan-hero-peaks.jpg" alt="Himalayan Peaks" class="hero-bg">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-tagline-quote">SIP THE POWER OF HIMALAYAS</span>
        <h1>Vitality, Harvested at 12,000 ft.</h1>
        <p style="font-size: 1.05rem; color: #e5e5e5; max-width: 600px; margin: 0 auto 2rem;">
          Wild-foraged Himalayan Sea Buckthorn formulations packed with full-spectrum Omegas 3, 6, 7 & 9, and 28x more Vitamin C than oranges.
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem;">
          <a href="/shop" data-route class="btn btn-primary">Explore Formulations</a>
          <a href="/about-sea-buckthorn" data-route class="btn btn-outline">Read Science</a>
        </div>
      </div>
    </section>

    <section class="product-grid-section">
      <div style="text-align: center; margin-bottom: 3rem;">
        <span class="eyebrow">Himalayan Apothecary</span>
        <h2 style="font-size: 2.4rem;">Pure Wild Formulations</h2>
      </div>
      <div class="products-grid">
        ${products.map(p => `
          <div class="product-tile">
            <div class="product-tile-image">
              <img src="${p.image}" alt="${escapeHtml(p.name)}">
            </div>
            <div class="product-tile-body">
              <div>
                <span class="eyebrow" style="margin-bottom: 0.25rem;">${escapeHtml(p.category)}</span>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.35rem;">
                  <a href="/products/${p.slug}" data-route>${escapeHtml(p.name)}</a>
                </h3>
                <p style="font-size: 0.85rem; color: var(--gold); margin-bottom: 0.5rem;">${escapeHtml(p.tagline)}</p>
                <div style="font-size: 1.2rem; font-weight: bold; color: #fff; margin-bottom: 1.25rem;">
                  ${money(p.price)} <del style="font-size: 0.85rem; color: #666; margin-left: 0.5rem;">${money(p.originalPrice)}</del>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <a href="/products/${p.slug}" data-route class="btn btn-outline" style="flex: 1;">Explore</a>
                <button class="btn btn-primary" data-add-to-cart="${p.id}" style="flex: 1;">Add to Bag</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  layout(content);
}

function shopPage() {
  const content = `
    <div style="max-width: 1280px; margin: 0 auto; padding: 3rem clamp(1rem, 4vw, 3rem) 1rem; text-align: center;">
      <span class="eyebrow">Himroots Shop</span>
      <h1 style="font-size: 2.8rem; margin-bottom: 0.5rem;">Wild Himalayan Formulations</h1>
      <p>Cold-pressed liquid pulp and wild berry softgels harvested at 12,000 ft.</p>
    </div>
    <section class="product-grid-section" style="padding-top: 1rem;">
      <div class="products-grid">
        ${products.map(p => `
          <div class="product-tile">
            <div class="product-tile-image">
              <img src="${p.image}" alt="${escapeHtml(p.name)}">
            </div>
            <div class="product-tile-body">
              <div>
                <span class="eyebrow" style="margin-bottom: 0.25rem;">${escapeHtml(p.category)}</span>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.35rem;">
                  <a href="/products/${p.slug}" data-route>${escapeHtml(p.name)}</a>
                </h3>
                <p style="font-size: 0.85rem; color: var(--gold); margin-bottom: 0.5rem;">${escapeHtml(p.tagline)}</p>
                <div style="font-size: 1.2rem; font-weight: bold; color: #fff; margin-bottom: 1.25rem;">
                  ${money(p.price)} <del style="font-size: 0.85rem; color: #666; margin-left: 0.5rem;">${money(p.originalPrice)}</del>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <a href="/products/${p.slug}" data-route class="btn btn-outline" style="flex: 1;">Explore</a>
                <button class="btn btn-primary" data-add-to-cart="${p.id}" style="flex: 1;">Add to Bag</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  layout(content);
}

function aboutPage() {
  const content = `
    <div style="max-width: 880px; margin: 0 auto; padding: 4rem clamp(1rem, 4vw, 2rem);">
      <span class="eyebrow">Our Story</span>
      <h1 style="font-size: 2.8rem; margin-bottom: 1.5rem;">SIP THE POWER OF HIMALAYAS</h1>
      <p style="font-size: 1.05rem; line-height: 1.8; color: #ccc;">
        Himroots was founded with a singular conviction: that the untouched botanical richness of the high Himalayas holds the answers to modern health challenges.
      </p>
      <div style="margin: 2.5rem 0; border: 1px solid var(--border); border-radius: 16px; overflow: hidden;">
        <img src="/assets/images/himalayan-harvest.jpg" alt="Himalayan Harvest" style="width: 100%; height: auto;">
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gold); margin-top: 2rem;">Wild-Harvested at 12,000 ft in Ladakh</h2>
      <p style="font-size: 0.95rem; line-height: 1.8; color: #bbb;">
        Our berries grow in the extreme climate of Ladakh and Spiti, enduring temperatures as low as -40°C. In response to this harsh environment, the berries produce an extraordinary concentration of over 190 bioactives, rare Omega-7 palmitoleic acid, and 28x more Vitamin C than oranges.
      </p>
    </div>
  `;
  layout(content);
}

function seaBuckthornPage() {
  const content = `
    <div style="max-width: 980px; margin: 0 auto; padding: 4rem clamp(1rem, 4vw, 2rem);">
      <span class="eyebrow">Botanical Monograph</span>
      <h1 style="font-size: 2.8rem; margin-bottom: 1rem;">Sea Buckthorn (Hippophae rhamnoides)</h1>
      <p style="font-size: 1.05rem; color: #ccc; margin-bottom: 2.5rem;">
        Revered in ancient Tibetan medicine (Sowa-Rigpa) as the "Holy Fruit" and used in modern aerospace nutrition.
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; margin-bottom: 3rem;">
        <img src="/assets/images/sea-buckthorn-frost-harvest.jpg" alt="Frost Harvest" style="border-radius: 14px; border: 1px solid var(--border);">
        <div>
          <h3 style="font-size: 1.5rem; color: var(--gold);">The Rare Omega-7 Superfruit</h3>
          <p style="font-size: 0.88rem; line-height: 1.8; color: #bbb;">
            Unlike standard plant oils, sea buckthorn contains palmitoleic acid (Omega-7), a critical constituent of healthy human skin and mucosal membranes that declines with age and stress.
          </p>
          <a href="/products/sea-buckthorn-pulp" data-route class="btn btn-primary" style="margin-top: 1rem;">
            Explore Sea Buckthorn Pulp
          </a>
        </div>
      </div>
    </div>
  `;
  layout(content);
}

function cartPage() {
  const { subtotal } = getCartTotals();
  const shipping = cart.length ? (subtotal > 2000 ? 0 : 150) : 0;
  const total = subtotal + shipping;

  const content = `
    <div class="cart-page-container">
      <span class="eyebrow">Shopping Bag</span>
      <h1 style="font-size: 2.4rem; margin-bottom: 2rem;">Your Bag (${cart.reduce((n, i) => n + i.quantity, 0)})</h1>

      ${cart.length === 0 ? `
        <div style="padding: 4rem 2rem; text-align: center; background: #050505; border: 1px solid var(--border); border-radius: 16px;">
          <h2 style="font-size: 1.8rem; margin-bottom: 0.75rem;">Your bag is currently empty.</h2>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">Discover our pure wild Himalayan formulations.</p>
          <a href="/shop" data-route class="btn btn-primary">Shop Now</a>
        </div>
      ` : `
        <div class="cart-grid-layout">
          <div>
            ${cart.map(item => `
              <div class="cart-item-card">
                <img src="${item.image}" alt="${escapeHtml(item.name)}">
                <div>
                  <h3 style="font-size: 1rem; margin-bottom: 0.25rem; color: #fff;">${escapeHtml(item.name)}</h3>
                  <small style="color: var(--gold); display: block; margin-bottom: 0.5rem;">${item.volume}</small>
                  <div class="quantity-control" style="scale: 0.9; transform-origin: left;">
                    <button data-cart-qty="${item.id}" data-change="-1">−</button>
                    <span>${item.quantity}</span>
                    <button data-cart-qty="${item.id}" data-change="1">+</button>
                  </div>
                </div>
                <div style="text-align: right;">
                  <b style="color: #fff; font-size: 1.1rem; display: block;">${money(item.price * item.quantity)}</b>
                  <button data-cart-remove="${item.id}" style="color: #888; font-size: 0.75rem; text-decoration: underline; margin-top: 0.5rem;">Remove</button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="order-summary-panel">
            <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.75rem; color: #ccc;">
              <span>Subtotal</span>
              <b>${money(subtotal)}</b>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 1.25rem; color: #ccc;">
              <span>Shipping Fee</span>
              <b>${shipping === 0 ? '<span style="color: #4ade80;">FREE</span>' : money(shipping)}</b>
            </div>
            <hr style="border: none; border-top: 1px solid var(--border); margin: 1rem 0;">
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; color: #fff; font-weight: bold; margin-bottom: 1.5rem;">
              <span>Total</span>
              <span class="text-gold">${money(total)}</span>
            </div>
            <a href="/checkout" data-route class="btn btn-primary btn-wide" style="height: 48px;">
              Proceed to Checkout
            </a>
          </div>
        </div>
      `}
    </div>
  `;
  layout(content);
}

function checkoutPage() {
  if (cart.length === 0) return navigate('/cart');
  const { subtotal } = getCartTotals();
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  const content = `
    <div class="checkout-page-container">
      <span class="eyebrow">Checkout</span>
      <h1 style="font-size: 2.4rem; margin-bottom: 2rem;">Secure Checkout</h1>

      <div class="checkout-grid-layout">
        <form id="checkout-form" style="background: #050505; border: 1px solid var(--border); border-radius: 16px; padding: 2rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 1.5rem; color: var(--gold);">Shipping & Contact Details</h3>
          
          <div class="form-group">
            <label>Full Name</label>
            <input required name="name" class="form-input" placeholder="e.g. Rahul Sharma">
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input required type="email" name="email" class="form-input" placeholder="e.g. rahul@example.com">
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input required type="tel" name="phone" class="form-input" placeholder="10-digit mobile number">
          </div>

          <div class="form-group">
            <label>Delivery Address</label>
            <textarea required name="address" rows="3" class="form-input" placeholder="Flat, building, street"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label>City</label>
              <input required name="city" class="form-input" placeholder="City">
            </div>
            <div class="form-group">
              <label>State</label>
              <input required name="state" class="form-input" placeholder="State">
            </div>
          </div>

          <div class="form-group">
            <label>PIN Code</label>
            <input required name="pincode" class="form-input" placeholder="PIN code">
          </div>

          <p id="checkout-message" style="font-size: 0.85rem; color: var(--gold); min-height: 1.5rem; margin: 1rem 0;"></p>

          <button type="submit" class="btn btn-primary btn-wide" style="height: 50px;">
            Pay ${money(total)} via Razorpay
          </button>
        </form>

        <div class="order-summary-panel">
          <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">Order Items</h3>
          ${cart.map(i => `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.75rem; color: #ccc;">
              <span>${escapeHtml(i.name)} × ${i.quantity}</span>
              <b>${money(i.price * i.quantity)}</b>
            </div>
          `).join('')}
          <hr style="border: none; border-top: 1px solid var(--border); margin: 1rem 0;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #ccc; margin-bottom: 0.5rem;">
            <span>Subtotal</span>
            <b>${money(subtotal)}</b>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #ccc; margin-bottom: 1rem;">
            <span>Shipping</span>
            <b>${shipping === 0 ? 'FREE' : money(shipping)}</b>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.2rem; color: #fff; font-weight: bold;">
            <span>Total Payable</span>
            <span class="text-gold">${money(total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  layout(content);
}

function orderSuccessPage() {
  const content = `
    <div style="max-width: 680px; margin: 0 auto; padding: 5rem 1.5rem; text-align: center;">
      <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--gold); color: #000; font-size: 2.5rem; display: grid; place-items: center; margin: 0 auto 1.5rem; font-weight: bold;">
        ✓
      </div>
      <span class="eyebrow">Order Confirmed</span>
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Thank you for your order!</h1>
      ${lastOrder ? `
        <p style="color: #ccc; font-size: 1rem; margin-bottom: 2rem;">
          Your order <strong>${escapeHtml(lastOrder.orderNumber)}</strong> has been received and is being prepared for dispatch.
        </p>
        <div style="background: #050505; border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; text-align: left; max-width: 420px; margin: 0 auto 2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Amount Paid</span>
            <b style="color: #fff;">${money(lastOrder.total)}</b>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Status</span>
            <b style="color: #4ade80;">Payment Verified</b>
          </div>
        </div>
      ` : `
        <p style="color: #ccc; margin-bottom: 2rem;">Your payment was verified. An email confirmation has been sent.</p>
      `}
      <a href="/shop" data-route class="btn btn-primary">Continue Shopping</a>
    </div>
  `;
  layout(content);
}

function contactPage() {
  const content = `
    <div style="max-width: 680px; margin: 0 auto; padding: 4rem clamp(1rem, 4vw, 2rem);">
      <span class="eyebrow">Customer Care</span>
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Contact Himroots</h1>
      <p style="color: #ccc; margin-bottom: 2rem;">Have questions about our formulations or your order? We are here to assist you.</p>

      <form id="contact-form" style="background: #050505; border: 1px solid var(--border); border-radius: 16px; padding: 2rem;">
        <div class="form-group">
          <label>Full Name</label>
          <input required name="name" class="form-input" placeholder="Your name">
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input required type="email" name="email" class="form-input" placeholder="Your email">
        </div>
        <div class="form-group">
          <label>Subject</label>
          <select name="category" class="form-input">
            <option>General Enquiry</option>
            <option>Product Dosage / Guidance</option>
            <option>Order Status / Delivery</option>
          </select>
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea required name="message" rows="5" class="form-input" placeholder="How can we help?"></textarea>
        </div>
        <p id="contact-message" style="font-size: 0.85rem; color: var(--gold); min-height: 1.5rem; margin: 1rem 0;"></p>
        <button type="submit" class="btn btn-primary btn-wide">Send Message</button>
      </form>
    </div>
  `;
  layout(content);
}

function notFound() {
  layout(`
    <div style="max-width: 600px; margin: 0 auto; padding: 6rem 1.5rem; text-align: center;">
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">404</h1>
      <p style="color: #aaa; margin-bottom: 2rem;">The formulation or page you are looking for does not exist.</p>
      <a href="/" data-route class="btn btn-primary">Return to Home</a>
    </div>
  `);
}

// ==========================================================================
// ROUTER & NAVIGATION
// ==========================================================================
export function navigate(path) {
  history.pushState({}, '', path);
  render();
}

export function render() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/') homePage();
  else if (path === '/shop' || path === '/products') shopPage();
  else if (path.startsWith('/products/')) productPage(path.split('/').pop());
  else if (path === '/about') aboutPage();
  else if (['/about-sea-buckthorn', '/sea-buckthorn', '/himalayan-seabuckthorn-juice'].includes(path)) seaBuckthornPage();
  else if (path === '/cart') cartPage();
  else if (path === '/checkout') checkoutPage();
  else if (path === '/order-success') orderSuccessPage();
  else if (path === '/contact' || path === '/contact-us') contactPage();
  else notFound();
}

// ==========================================================================
// EVENT LISTENERS (Clicks, Forms, Popstate)
// ==========================================================================
document.addEventListener('click', (event) => {
  // SPA link navigation
  const routeLink = event.target.closest('[data-route]');
  if (routeLink && routeLink.origin === location.origin) {
    event.preventDefault();
    navigate(routeLink.getAttribute('href'));
    return;
  }

  // Mobile menu
  const menuBtn = event.target.closest('[data-menu]');
  if (menuBtn) {
    const nav = document.querySelector('nav.nav-links');
    if (nav) nav.classList.toggle('open');
    return;
  }

  // Carousel controls
  const prevBtn = event.target.closest('[data-carousel-prev]');
  if (prevBtn) {
    activeSlideIndex = (activeSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
    render();
    return;
  }

  const nextBtn = event.target.closest('[data-carousel-next]');
  if (nextBtn) {
    activeSlideIndex = (activeSlideIndex + 1) % carouselSlides.length;
    render();
    return;
  }

  const thumbBtn = event.target.closest('[data-slide-index]');
  if (thumbBtn) {
    activeSlideIndex = Number(thumbBtn.dataset.slideIndex);
    render();
    return;
  }

  // Variant selector
  const packCard = event.target.closest('[data-select-pack]');
  if (packCard) {
    selectedPackId = packCard.dataset.selectPack;
    render();
    return;
  }

  // Quantity controls on Product Detail
  const qtyBtn = event.target.closest('[data-qty-change]');
  if (qtyBtn) {
    const change = Number(qtyBtn.dataset.qtyChange);
    productQuantity = Math.max(1, Math.min(50, productQuantity + change));
    render();
    return;
  }

  // Accordion toggle
  const accordionTrigger = event.target.closest('[data-accordion]');
  if (accordionTrigger) {
    const key = accordionTrigger.dataset.accordion;
    openAccordionKey = openAccordionKey === key ? '' : key;
    render();
    return;
  }

  // Add to cart from Product Detail
  const addToCartBtn = event.target.closest('[data-add-to-cart]');
  if (addToCartBtn) {
    const product = products.find(p => p.id === addToCartBtn.dataset.addToCart);
    if (product) addToCart(product, selectedPackId, productQuantity);
    return;
  }

  // Buy now from Product Detail
  const buyNowBtn = event.target.closest('[data-buy-now]');
  if (buyNowBtn) {
    const product = products.find(p => p.id === buyNowBtn.dataset.buyNow);
    if (product) {
      addToCart(product, selectedPackId, productQuantity);
      navigate('/checkout');
    }
    return;
  }

  // Cart item quantity
  const cartQtyBtn = event.target.closest('[data-cart-qty]');
  if (cartQtyBtn) {
    const id = cartQtyBtn.dataset.cartQty;
    const item = cart.find(i => i.id === id);
    if (item) updateCartQuantity(id, item.quantity + Number(cartQtyBtn.dataset.change));
    return;
  }

  // Cart item remove
  const cartRemoveBtn = event.target.closest('[data-cart-remove]');
  if (cartRemoveBtn) {
    removeFromCart(cartRemoveBtn.dataset.cartRemove);
    return;
  }

  // Study slider controls
  const studyPrev = event.target.closest('[data-study-prev]');
  if (studyPrev) {
    activeStudyIndex = (activeStudyIndex - 1 + clinicalStudies.length) % clinicalStudies.length;
    render();
    return;
  }

  const studyNext = event.target.closest('[data-study-next]');
  if (studyNext) {
    activeStudyIndex = (activeStudyIndex + 1) % clinicalStudies.length;
    render();
    return;
  }

  // Review filter
  const filterBtn = event.target.closest('[data-review-filter]');
  if (filterBtn) {
    reviewFilter = filterBtn.dataset.reviewFilter;
    render();
    return;
  }
});

// Form Submissions
document.addEventListener('submit', async (event) => {
  if (event.target.id === 'contact-form') {
    event.preventDefault();
    const msg = document.querySelector('#contact-message');
    msg.textContent = 'Submitting message…';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(event.target)))
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      msg.textContent = data.message || 'Your inquiry has been received.';
      event.target.reset();
    } catch (err) {
      msg.textContent = err.message || 'Could not send message. Please try again.';
    }
  }

  if (event.target.id === 'checkout-form') {
    event.preventDefault();
    const msg = document.querySelector('#checkout-message');
    msg.textContent = 'Preparing secure order…';
    const form = Object.fromEntries(new FormData(event.target));

    const payload = {
      items: cart.map(i => ({ productId: i.productId || i.id, id: i.id, quantity: i.quantity, name: i.name, price: i.price })),
      customer: { name: form.name, email: form.email, phone: form.phone },
      shipping: { address: form.address, city: form.city, state: form.state, pincode: form.pincode, country: 'India' }
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const completeOrder = async (payId, rzpOrderId, signature = '') => {
        const verifyRes = await fetch('/api/orders/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.order.id,
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: payId,
            razorpaySignature: signature
          })
        });
        const verified = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verified.error);
        lastOrder = data.order;
        sessionStorage.setItem('himroots-last-order', JSON.stringify(lastOrder));
        cart = [];
        saveCart();
        navigate('/order-success');
      };

      if (data.razorpay.isConfigured && window.Razorpay) {
        const rzp = new window.Razorpay({
          key: data.razorpay.keyId,
          amount: data.razorpay.amount,
          currency: 'INR',
          name: 'Himroots Wellness',
          description: `Order ${data.order.orderNumber}`,
          image: '/assets/images/himroots-logo.png',
          order_id: data.razorpay.orderId,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#dfb76c' },
          handler: (resp) => completeOrder(resp.razorpay_payment_id, resp.razorpay_order_id, resp.razorpay_signature),
          modal: { ondismiss: () => { msg.textContent = 'Payment cancelled.'; } }
        });
        rzp.open();
      } else {
        // Development / simulation fallback
        await completeOrder(`pay_sim_${Date.now()}`, data.razorpay.orderId);
      }
    } catch (err) {
      msg.textContent = err.message || 'Could not complete order. Please check your connection.';
    }
  }
});

window.addEventListener('popstate', render);
render();
