// VendorHub — Core App Logic (routing, cart, wishlist, modals, search)

// ── Init & Routing ──────────────────────────────────────────
function init() { renderNav(); navigate('home'); }

function switchRole(role) {
  STATE.role = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('role-' + role).classList.add('active');
  const meta = ROLE_META[role];
  document.getElementById('user-name').textContent = meta.name;
  document.getElementById('user-role').textContent = meta.role;
  document.getElementById('user-avatar').textContent = meta.avatar;
  document.getElementById('user-avatar').style.background = meta.color;
  document.getElementById('topbar-avatar').textContent = meta.avatar;
  renderNav();
  navigate(NAVS[role][0].id);
}

function renderNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = NAVS[STATE.role].map(item => `
    <button class="nav-item ${item.id === STATE.currentPage ? 'active' : ''}" onclick="navigate('${item.id}')">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </button>`).join('');
}

function navigate(page) {
  STATE.currentPage = page;
  renderNav();
  closeAll();
  const pages = {
    home: renderBuyerHome, browse: renderBrowse, orders: renderOrders,
    tracking: renderTracking, reviews: renderReviews, 'ai-recs': renderAIRecs,
    'seller-home': renderSellerDash, 'my-products': renderMyProducts,
    'seller-orders': renderSellerOrders, earnings: renderEarnings,
    'seller-register': renderSellerRegister,
    'admin-home': renderAdminHome, 'vendor-approval': renderVendorApproval,
    categories: renderCategories, refunds: renderRefunds, commission: renderCommission,
  };
  const fn = pages[page];
  document.getElementById('content').innerHTML = fn
    ? fn()
    : `<div class="empty-state"><div class="empty-icon">🚧</div><div class="empty-title">Coming Soon</div></div>`;
}

// ── Cart ────────────────────────────────────────────────────
function addToCart(id) {
  const p = STATE.products.find(x => x.id === id);
  if (!p) return;
  const existing = STATE.cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else STATE.cart.push({ ...p, qty: 1 });
  updateCartUI();
  showToast(`${p.emoji} ${p.name} added to cart!`, 'success');
}

function updateCartUI() {
  const total = STATE.cart.reduce((a, c) => a + c.price * c.qty, 0);
  const count = STATE.cart.reduce((a, c) => a + c.qty, 0);
  document.getElementById('cart-total').textContent = '₹' + total.toLocaleString();
  document.getElementById('cart-count-label').textContent = `(${count} item${count !== 1 ? 's' : ''})`;
  document.getElementById('cart-dot').style.display = count > 0 ? 'block' : 'none';
  renderCartBody();
}

function renderCartBody() {
  const body = document.getElementById('cart-body');
  if (!STATE.cart.length) {
    body.innerHTML = `<div class="empty-state"><div class="empty-icon">🛒</div><div class="empty-title">Cart is empty</div><div class="empty-sub">Add some products!</div></div>`;
    return;
  }
  body.innerHTML = STATE.cart.map(item => `
    <div class="cart-item">
      <div class="cart-img">${item.emoji}</div>
      <div class="cart-info">
        <div class="cart-name">${item.name}</div>
        <div class="cart-vendor">${item.vendor}</div>
        <div class="cart-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto;color:var(--danger);" onclick="removeFromCart(${item.id})">✕</button>
        </div>
      </div>
    </div>`).join('');
}

function changeQty(id, delta) {
  const item = STATE.cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function removeFromCart(id) {
  STATE.cart = STATE.cart.filter(c => c.id !== id);
  updateCartUI();
}

// ── Wishlist ────────────────────────────────────────────────
function toggleWish(id) {
  const p = STATE.products.find(x => x.id === id);
  if (!p) return;
  const idx = STATE.wishlist.findIndex(w => w.id === id);
  if (idx >= 0) { STATE.wishlist.splice(idx, 1); showToast('Removed from wishlist', ''); }
  else { STATE.wishlist.push(p); showToast(`❤️ ${p.name} wishlisted!`, 'success'); }
  renderWishBody();
}

function renderWishBody() {
  const body = document.getElementById('wish-body');
  if (!STATE.wishlist.length) {
    body.innerHTML = `<div class="empty-state"><div class="empty-icon">💝</div><div class="empty-title">No items yet</div><div class="empty-sub">Save products you love!</div></div>`;
    return;
  }
  const catColor = (cat) => ({ Electronics:'#EBF0FF', Fashion:'#FFF0EB', 'Home & Living':'#E6FAF3', Sports:'#FFFBEB', Books:'#F3F0FF', Food:'#FEF2F2' }[cat] || '#F7F6F3');
  body.innerHTML = STATE.wishlist.map(p => `
    <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);align-items:center;">
      <div style="width:50px;height:50px;background:${catColor(p.category)};border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:26px;">${p.emoji}</div>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:500;">${p.name}</div>
        <div style="font-family:var(--font-display);font-weight:700;color:var(--brand);">₹${p.price.toLocaleString()}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">+ Cart</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger);" onclick="toggleWish(${p.id})">✕</button>
      </div>
    </div>`).join('');
}

// ── Checkout & Payment ──────────────────────────────────────
function goToCheckout() {
  closeAll();
  if (!STATE.cart.length) { showToast('Cart is empty!', ''); return; }
  const total = STATE.cart.reduce((a, c) => a + c.price * c.qty, 0);
  document.getElementById('content').innerHTML = `
    <div class="section-header">
      <div class="section-title">💳 Checkout</div>
      <button class="btn btn-ghost" onclick="navigate('browse')">← Continue Shopping</button>
    </div>
    <div class="checkout-grid">
      <div>
        <div class="card" style="margin-bottom:16px;">
          <div class="card-title" style="margin-bottom:14px;">📍 Delivery Address</div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" value="Rahul Sharma"></div>
            <div class="form-group"><label class="form-label">Phone</label><input class="form-input" value="+91 98765 43210"></div>
          </div>
          <div class="form-group"><label class="form-label">Address Line 1</label><input class="form-input" value="D-42, Sector 5"></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">City</label><input class="form-input" value="Noida"></div>
            <div class="form-group"><label class="form-label">PIN Code</label><input class="form-input" value="201301"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:14px;">💳 Payment Method</div>
          <div class="payment-methods">
            <div class="payment-method selected" onclick="selectPayment(this)"><div style="font-size:20px;">💳</div><div>Card</div></div>
            <div class="payment-method" onclick="selectPayment(this)"><div style="font-size:20px;">📱</div><div>UPI</div></div>
            <div class="payment-method" onclick="selectPayment(this)"><div style="font-size:20px;">🏦</div><div>Net Banking</div></div>
            <div class="payment-method" onclick="selectPayment(this)"><div style="font-size:20px;">💵</div><div>COD</div></div>
          </div>
          <div style="background:var(--bg);border-radius:var(--radius-sm);padding:10px 12px;font-size:12px;color:var(--text3);">
            🔒 All payments secured by Razorpay Sandbox. Test mode active.
          </div>
        </div>
      </div>
      <div class="checkout-summary" style="position:sticky;top:80px;">
        <div style="font-family:var(--font-display);font-weight:700;font-size:16px;margin-bottom:14px;">Order Summary</div>
        ${STATE.cart.map(item => `
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid var(--border);">
            <span style="display:flex;align-items:center;gap:6px;">${item.emoji} <span style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.name} ×${item.qty}</span></span>
            <span style="font-weight:500;white-space:nowrap;">₹${(item.price*item.qty).toLocaleString()}</span>
          </div>`).join('')}
        <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;"><span style="color:var(--text3);">Subtotal</span><span>₹${total.toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;"><span style="color:var(--text3);">Delivery</span><span style="color:var(--success);">Free</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:15px;border-top:1px solid var(--border);margin-top:4px;">
          <span style="font-weight:600;">Total</span>
          <span style="font-family:var(--font-display);font-weight:800;font-size:20px;color:var(--brand);">₹${total.toLocaleString()}</span>
        </div>
        <button class="btn btn-primary btn-lg" style="width:100%;margin-top:8px;" onclick="openPaymentModal(${total})">Proceed to Pay ₹${total.toLocaleString()}</button>
        <div style="text-align:center;margin-top:10px;font-size:11px;color:var(--text3);">By placing the order, you agree to our T&C</div>
      </div>
    </div>`;
}

function openPaymentModal(total) {
  document.getElementById('payment-summary').innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>Items (${STATE.cart.length})</span><span>₹${total.toLocaleString()}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>Delivery</span><span style="color:var(--success);">Free</span></div>
    <div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;margin-top:8px;border-top:1px solid var(--border);padding-top:8px;"><span>Total</span><span style="color:var(--brand);">₹${total.toLocaleString()}</span></div>`;
  openModal('payment-modal');
}

function processPayment() {
  closeModal('payment-modal');
  STATE.cart = [];
  updateCartUI();
  document.getElementById('content').innerHTML = `
    <div style="text-align:center;padding:64px 24px;max-width:480px;margin:0 auto;">
      <div style="font-size:72px;margin-bottom:20px;animation:bounce 0.6s ease;">🎉</div>
      <div style="font-family:var(--font-display);font-size:28px;font-weight:800;margin-bottom:8px;">Order Placed!</div>
      <div style="font-size:15px;color:var(--text2);margin-bottom:24px;">Your order has been successfully placed and is being confirmed by the sellers.</div>
      <div style="background:var(--bg);border-radius:var(--radius);padding:20px;margin-bottom:24px;text-align:left;">
        <div style="font-size:12px;color:var(--text3);margin-bottom:4px;">ORDER ID</div>
        <div style="font-family:var(--font-display);font-size:20px;font-weight:800;">#VH${Date.now().toString().slice(-4)}</div>
        <div style="font-size:12px;color:var(--text3);margin-top:12px;">Estimated Delivery: 20–22 May 2026</div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;">
        <button class="btn btn-primary btn-lg" onclick="navigate('orders')">Track Order</button>
        <button class="btn btn-secondary btn-lg" onclick="navigate('home')">Continue Shopping</button>
      </div>
    </div>`;
}

// ── AI Search ───────────────────────────────────────────────
function handleSearch(val) {
  if (!val.trim()) return;
  const lower = val.toLowerCase();
  const synonyms = {
    'laptop bag': ['bag','case','sleeve','carry'],
    'notebook':   ['laptop','macbook'],
    'earphones':  ['headphones','earbuds','audio'],
    'jogger':     ['shoes','sneakers','running'],
    'phone':      ['mobile','iphone','samsung'],
  };
  let terms = [lower];
  for (const [key, syns] of Object.entries(synonyms)) {
    if (lower.includes(key)) terms = [...terms, ...syns];
  }
  STATE.searchResults = STATE.products.filter(p =>
    terms.some(t =>
      p.name.toLowerCase().includes(t) ||
      p.category.toLowerCase().includes(t) ||
      p.vendor.toLowerCase().includes(t) ||
      p.desc.toLowerCase().includes(t)
    )
  );
  if (!STATE.searchResults.length) STATE.searchResults = STATE.products.slice(0, 6);
  navigate('browse');
}

// ── Panels & Modals ─────────────────────────────────────────
function togglePanel(id) {
  const panel = document.getElementById(id);
  const isOpen = panel.classList.contains('open');
  closeAll();
  if (!isOpen) {
    panel.classList.add('open');
    document.getElementById('overlay').classList.add('active');
  }
}

function closeAll() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
  document.getElementById('overlay').classList.remove('active');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.getElementById('overlay').classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

// ── Toasts ──────────────────────────────────────────────────
function showToast(msg, type = '') {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'} ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Misc Interactions ────────────────────────────────────────
function showNotifications() {
  showToast('📦 Order #VH2389 has been shipped!', 'success');
  setTimeout(() => showToast('🆕 New product from AudioZone!', ''), 500);
}

function selectPayment(el) {
  document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
}

let selectedStars = 0;
function setStars(n) { selectedStars = n; renderStars(n); }
function hoverStars(n) { renderStars(n); }
function resetStars() { renderStars(selectedStars); }
function renderStars(n) {
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById('star-' + i);
    if (!el) continue;
    el.textContent = i <= n ? '★' : '☆';
    el.style.color = i <= n ? '#F59E0B' : 'var(--text3)';
  }
}
function submitReview() {
  if (!selectedStars) { showToast('Please select a rating!', 'warning'); return; }
  showToast('⭐ Review submitted! Thank you.', 'success');
}

// ── Vendor Approval ──────────────────────────────────────────
function approveVendor(id) {
  const card = document.getElementById('vendor-card-' + id);
  if (card) { card.style.opacity = '0.5'; card.style.pointerEvents = 'none'; }
  const v = STATE.pendingVendors.find(x => x.id === id);
  showToast(`✅ ${v?.name} approved as vendor!`, 'success');
  STATE.pendingVendors = STATE.pendingVendors.filter(x => x.id !== id);
}

function rejectVendor(id) {
  const card = document.getElementById('vendor-card-' + id);
  if (card) { card.style.opacity = '0.5'; card.style.pointerEvents = 'none'; }
  const v = STATE.pendingVendors.find(x => x.id === id);
  showToast(`❌ ${v?.name} application rejected.`, '');
  STATE.pendingVendors = STATE.pendingVendors.filter(x => x.id !== id);
}

function resolveRefund(id, status) {
  const r = STATE.refunds.find(x => x.id === id);
  if (r) r.status = status;
  showToast(`Refund ${status === 'Approved' ? '✅ approved' : '❌ rejected'} for ${r?.product}`, status === 'Approved' ? 'success' : '');
  navigate('refunds');
}

// ── Product Management (Seller) ──────────────────────────────
function selectEmoji(el, emoji) {
  document.querySelectorAll('#add-product-modal .thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  STATE.selectedEmoji = emoji;
}

function saveProduct() {
  const name  = document.getElementById('p-name').value;
  const price = parseInt(document.getElementById('p-price').value);
  const stock = parseInt(document.getElementById('p-stock').value);
  const cat   = document.getElementById('p-cat').value;
  const desc  = document.getElementById('p-desc').value;
  if (!name || !price || !stock) { showToast('Please fill all required fields!', 'warning'); return; }
  const newP = { id: Date.now(), emoji: STATE.selectedEmoji, name, vendor:'TechZone', price, original:null, rating:0, reviews:0, category:cat, stock, badge:'new', desc: desc || 'New product.' };
  STATE.vendorProducts.push({ id:newP.id, emoji:newP.emoji, name, price, stock, orders:0, revenue:0, category:cat, badge:'new' });
  STATE.products.push(newP);
  closeModal('add-product-modal');
  ['p-name','p-price','p-stock','p-desc'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  showToast(`📦 ${name} listed successfully!`, 'success');
  if (STATE.currentPage === 'my-products') navigate('my-products');
}

function editProduct(id) {
  openModal('add-product-modal');
  document.getElementById('product-modal-title').textContent = 'Edit Product';
  const p = STATE.vendorProducts.find(x => x.id === id);
  if (p) {
    document.getElementById('p-name').value  = p.name;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-stock').value = p.stock;
  }
}

function deleteProduct(id) {
  STATE.vendorProducts = STATE.vendorProducts.filter(p => p.id !== id);
  showToast('Product deleted.', '');
  navigate('my-products');
}

function updateOrderStatus(id) {
  const o = STATE.vendorOrders.find(x => x.id === id);
  if (!o) return;
  if (o.status === 'Placed')     o.status = 'Confirmed';
  else if (o.status === 'Confirmed') o.status = 'Shipped';
  showToast(`Order ${id} updated to ${o.status}!`, 'success');
  navigate(STATE.currentPage);
}