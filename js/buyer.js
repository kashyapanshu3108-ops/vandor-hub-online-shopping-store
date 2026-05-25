// VendorHub — Buyer Pages

function catColor(cat) {
  return { Electronics:'#EBF0FF', Fashion:'#FFF0EB', 'Home & Living':'#E6FAF3', Sports:'#FFFBEB', Books:'#F3F0FF', Food:'#FEF2F2' }[cat] || '#F7F6F3';
}

function productCard(p) {
  const inWish = STATE.wishlist.find(w => w.id === p.id);
  return `
  <div class="product-card" onclick="showProduct(${p.id})">
    <div class="product-img" style="background:${catColor(p.category)}">
      <span style="font-size:56px;">${p.emoji}</span>
      <button class="wishlist-btn ${inWish?'active':''}" onclick="event.stopPropagation();toggleWish(${p.id})">
        ${inWish?'❤️':'🤍'}
      </button>
      ${p.badge ? `<div style="position:absolute;top:8px;left:8px;"><span class="product-badge badge-${p.badge}">${p.badge.toUpperCase()}</span></div>` : ''}
    </div>
    <div class="product-body">
      <div class="product-vendor">${p.vendor}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">₹${p.price.toLocaleString()} ${p.original ? `<span class="original">₹${p.original.toLocaleString()}</span>` : ''}</div>
      <div class="product-footer">
        <div class="stars">★ ${p.rating} <span style="color:var(--text3);font-size:10px;">(${p.reviews.toLocaleString()})</span></div>
        <button class="add-cart-btn" onclick="event.stopPropagation();addToCart(${p.id})">+</button>
      </div>
    </div>
  </div>`;
}

function filterCat(cat) {
  STATE.searchResults = STATE.products.filter(p => p.category === cat);
  navigate('browse');
}

function renderBuyerHome() {
  const trending = STATE.products.slice(0, 6);
  const hotPicks = STATE.products.filter(p => p.badge === 'hot').slice(0, 4);
  return `
  <div class="hero-banner">
    <div class="hero-tag">⚡ HYPERLOCAL DEALS</div>
    <div class="hero-title">Shop Local,<br>Shop Smart.</div>
    <div class="hero-sub">Discover products from verified local vendors near you.</div>
    <div class="hero-actions">
      <button class="btn btn-white btn-lg" onclick="navigate('browse')">Shop Now →</button>
      <button class="btn btn-outline-white btn-lg">📍 Near Me</button>
    </div>
  </div>

  <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
    <div class="stat-card"><div class="stat-label">🏪 Active Vendors</div><div class="stat-value">1,284</div><div class="stat-delta up">↑ 12 this week</div></div>
    <div class="stat-card"><div class="stat-label">📦 Products Listed</div><div class="stat-value">42K+</div><div class="stat-delta up">↑ 340 today</div></div>
    <div class="stat-card"><div class="stat-label">⭐ Avg. Rating</div><div class="stat-value">4.7</div><div class="stat-delta up">↑ quality improving</div></div>
    <div class="stat-card"><div class="stat-label">🚚 Delivered Today</div><div class="stat-value">8,491</div><div class="stat-delta up">↑ 23% vs yesterday</div></div>
  </div>

  <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:24px;">
    ${STATE.categories.map(c => `
      <div style="flex-shrink:0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 20px;text-align:center;cursor:pointer;min-width:110px;transition:all 0.15s;"
           onmouseover="this.style.borderColor='var(--brand)'" onmouseout="this.style.borderColor='var(--border)'"
           onclick="filterCat('${c.name}')">
        <div style="font-size:28px;margin-bottom:6px;">${c.icon}</div>
        <div style="font-size:12px;font-weight:500;">${c.name}</div>
        <div style="font-size:10px;color:var(--text3);">${c.products.toLocaleString()} items</div>
      </div>
    `).join('')}
  </div>

  <div class="section-header">
    <div><div class="section-title">🔥 Trending Now</div><div class="section-sub">Most popular this week</div></div>
    <a class="view-all" onclick="navigate('browse')">View all →</a>
  </div>
  <div class="products-grid">${trending.map(p => productCard(p)).join('')}</div>

  <div style="margin-top:28px;" class="section-header">
    <div><div class="section-title">✨ AI Recommendations <span class="ai-tag" style="font-size:11px;">Personalized</span></div><div class="section-sub">Based on your browsing history</div></div>
  </div>
  <div class="products-grid">${hotPicks.map(p => productCard(p)).join('')}</div>`;
}

function renderBrowse() {
  const products = STATE.searchResults || STATE.products;
  STATE.searchResults = null;
  const cats = ['All', ...new Set(STATE.products.map(p => p.category))];
  return `
  <div class="section-header">
    <div><div class="section-title">Browse Products</div><div class="section-sub">${products.length} products available</div></div>
    <select class="form-input form-select" style="width:auto;font-size:12px;padding:6px 28px 6px 10px;" onchange="showToast('Sorted by: '+this.value,'')">
      <option>Sort: Featured</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Top Rated</option>
    </select>
  </div>
  <div style="display:grid;grid-template-columns:220px 1fr;gap:20px;align-items:start;">
    <div class="card card-sm" style="position:sticky;top:80px;">
      <div style="font-weight:600;font-size:13px;margin-bottom:14px;">🎛️ Filters</div>
      <div style="margin-bottom:16px;">
        <div class="form-label">Category</div>
        ${cats.map((c,i) => `<div style="padding:5px 0;cursor:pointer;font-size:13px;"><label style="cursor:pointer;display:flex;align-items:center;gap:8px;"><input type="checkbox" ${i<3?'checked':''}> ${c}</label></div>`).join('')}
      </div>
      <div style="margin-bottom:16px;">
        <div class="form-label">Price Range</div>
        <div style="display:flex;gap:6px;align-items:center;">
          <input class="form-input" style="padding:6px 8px;font-size:12px;" placeholder="₹0" type="number">
          <span style="color:var(--text3);">–</span>
          <input class="form-input" style="padding:6px 8px;font-size:12px;" placeholder="₹50000" type="number">
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <div class="form-label">Min Rating</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${[4,3,2,1].map(r => `<button class="filter-chip" style="padding:4px 8px;font-size:11px;" onclick="showToast('Filtered ★ ${r}+','')">★ ${r}+</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="form-label">Vendor Location</div>
        <select class="form-input form-select" style="font-size:12px;padding:7px 28px 7px 8px;">
          <option>All Cities</option><option>Delhi</option><option>Mumbai</option><option>Bangalore</option><option>Noida</option>
        </select>
      </div>
    </div>
    <div class="products-grid">${products.map(p => productCard(p)).join('')}</div>
  </div>`;
}

function renderOrders() {
  const statusMap = { Placed:'placed', Confirmed:'confirmed', Shipped:'shipped', Delivered:'delivered' };
  return `
  <div class="section-header"><div class="section-title">📦 My Orders</div></div>
  <div class="tabs">
    <div class="tab active">All Orders</div><div class="tab">Active</div><div class="tab">Delivered</div><div class="tab">Cancelled</div>
  </div>
  <div class="card" style="padding:0">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order ID</th><th>Product</th><th>Vendor</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${STATE.orders.map(o => `<tr>
            <td><span style="font-family:var(--font-display);font-weight:700;font-size:12px;">${o.id}</span></td>
            <td><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;">${o.emoji}</span><span style="font-size:13px;">${o.product}</span></div></td>
            <td><span style="font-size:12px;color:var(--text3);">${o.vendor}</span></td>
            <td><span style="font-family:var(--font-display);font-weight:700;">₹${o.amount.toLocaleString()}</span></td>
            <td><span class="pill pill-${statusMap[o.status]}"><span class="pill-dot"></span>${o.status}</span></td>
            <td><span style="font-size:12px;color:var(--text3);">${o.date}</span></td>
            <td><div style="display:flex;gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="navigate('tracking')">Track</button>
              ${o.status==='Delivered'?`<button class="btn btn-ghost btn-sm" onclick="navigate('reviews')">Review</button>`:''}
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderTracking() {
  const order = STATE.orders[1];
  const steps = ['Placed','Confirmed','Shipped','Delivered'];
  const currIdx = steps.indexOf(order.status);
  return `
  <div class="section-header"><div class="section-title">🚚 Order Tracking</div></div>
  <div class="grid-2" style="align-items:start;">
    <div>
      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <span style="font-size:40px;">${order.emoji}</span>
          <div>
            <div style="font-family:var(--font-display);font-weight:700;">${order.product}</div>
            <div style="font-size:12px;color:var(--text3);">Order ${order.id} · ${order.vendor}</div>
          </div>
          <span class="pill pill-shipped" style="margin-left:auto;"><span class="pill-dot"></span>${order.status}</span>
        </div>
        <div class="track-steps">
          ${steps.map((s,i) => `
            <div class="track-step ${i < currIdx ? 'done' : i === currIdx ? 'active' : ''}">
              <div class="step-dot">${i < currIdx ? '✓' : i+1}</div>
              <div class="step-label">${s}</div>
            </div>`).join('')}
        </div>
        <div style="background:var(--bg);border-radius:var(--radius-sm);padding:12px;margin-top:8px;">
          <div style="font-size:12px;font-weight:600;margin-bottom:4px;">📍 Current Status</div>
          <div style="font-size:13px;color:var(--text2);">Package picked up by Blue Dart — en route to your city hub.</div>
          <div style="font-size:11px;color:var(--text3);margin-top:4px;">Updated 2 hrs ago · Tracking ID: BD-92847361</div>
        </div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:14px;">📅 Timeline</div>
        ${[
          {icon:'✅',text:'Order Placed',detail:'Payment confirmed via Razorpay',time:'15 May, 10:32 AM',done:true},
          {icon:'🏭',text:'Order Confirmed',detail:'Seller confirmed & packed',time:'15 May, 2:10 PM',done:true},
          {icon:'🚚',text:'Shipped',detail:'Picked up by Blue Dart from SneakerHub, Mumbai',time:'16 May, 11:45 AM',done:true},
          {icon:'🏙️',text:'In Transit',detail:'Arrived at Delhi hub',time:'17 May, 9:20 AM',done:false},
          {icon:'🏠',text:'Out for Delivery',detail:'Estimated tomorrow 10AM–2PM',time:'Expected 19 May',done:false},
        ].map(t => `
          <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);">
            <div style="width:28px;height:28px;border-radius:50%;background:${t.done?'var(--success-light)':'var(--bg)'};display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">${t.icon}</div>
            <div style="flex:1;">
              <div style="font-size:13px;font-weight:500;${t.done?'':'color:var(--text3);'}">${t.text}</div>
              <div style="font-size:11px;color:var(--text3);">${t.detail}</div>
            </div>
            <div style="font-size:11px;color:var(--text3);white-space:nowrap;">${t.time}</div>
          </div>`).join('')}
      </div>
    </div>
    <div>
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title" style="margin-bottom:14px;">📋 Order Details</div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;"><span style="color:var(--text3);">Product</span><span>${order.product}</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;"><span style="color:var(--text3);">Quantity</span><span>1</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;"><span style="color:var(--text3);">Price</span><span style="font-weight:600;">₹${order.amount.toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;"><span style="color:var(--text3);">Delivery</span><span style="color:var(--success);">Free</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;"><span style="font-weight:600;">Total</span><span style="font-family:var(--font-display);font-weight:800;color:var(--brand);">₹${order.amount.toLocaleString()}</span></div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:14px;">📍 Delivery Address</div>
        <div style="font-size:13px;line-height:1.8;"><strong>Rahul Sharma</strong><br>D-42, Sector 5, Noida<br>Uttar Pradesh 201301<br>📞 +91 98765 43210</div>
      </div>
    </div>
  </div>`;
}

function renderReviews() {
  return `
  <div class="section-header"><div class="section-title">⭐ Rate & Review</div></div>
  <div class="grid-2" style="align-items:start;">
    <div class="card">
      <div class="card-title" style="margin-bottom:4px;">Sony WH-1000XM5</div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:16px;">From AudioZone · Order #VH2401</div>
      <div style="margin-bottom:16px;">
        <div class="form-label">Your Rating</div>
        <div style="display:flex;gap:6px;" id="star-row">
          ${[1,2,3,4,5].map(i => `<span style="font-size:32px;cursor:pointer;transition:transform 0.1s;color:var(--text3);" onclick="setStars(${i})" onmouseover="hoverStars(${i})" onmouseout="resetStars()" id="star-${i}">☆</span>`).join('')}
        </div>
      </div>
      <div class="form-group"><label class="form-label">Review Title</label><input class="form-input" placeholder="e.g. Amazing noise cancellation!" id="review-title"></div>
      <div class="form-group"><label class="form-label">Your Review</label><textarea class="form-input" rows="4" placeholder="Share your experience…" id="review-text"></textarea></div>
      <div class="form-group">
        <label class="form-label">Upload Photos (optional)</label>
        <div style="border:2px dashed var(--border);border-radius:var(--radius-sm);padding:20px;text-align:center;color:var(--text3);font-size:13px;cursor:pointer;">📸 Click to upload or drag photos here</div>
      </div>
      <button class="btn btn-primary" onclick="submitReview()">Submit Review ⭐</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px;">Product Ratings</div>
      <div style="display:flex;gap:20px;align-items:center;margin-bottom:20px;">
        <div style="text-align:center;">
          <div style="font-family:var(--font-display);font-size:56px;font-weight:800;color:var(--brand);line-height:1;">4.8</div>
          <div style="color:#F59E0B;font-size:18px;">★★★★★</div>
          <div style="font-size:11px;color:var(--text3);">1,243 reviews</div>
        </div>
        <div style="flex:1;">
          ${[[5,78],[4,14],[3,5],[2,2],[1,1]].map(([s,p]) => `
            <div class="review-bar">
              <span style="font-size:12px;width:16px;">${s}</span>
              <div class="bar-bg"><div class="bar-fill" style="width:${p}%"></div></div>
              <span style="font-size:11px;color:var(--text3);width:28px;">${p}%</span>
            </div>`).join('')}
        </div>
      </div>
      ${[
        {name:'Priya M.',rating:5,text:'Absolutely fantastic headphones. Noise cancellation is top-notch!',time:'3 days ago'},
        {name:'Amit K.',rating:4,text:'Great sound quality. The carrying case could be better.',time:'1 week ago'},
        {name:'Sneha R.',rating:5,text:'Best purchase of 2026. Highly recommend!',time:'2 weeks ago'},
      ].map(r => `
        <div style="padding:12px 0;border-top:1px solid var(--border);">
          <div style="display:flex;gap:10px;align-items:flex-start;">
            <div class="avatar" style="background:var(--accent);width:32px;height:32px;font-size:12px;flex-shrink:0;">${r.name[0]}</div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;"><div style="font-size:13px;font-weight:500;">${r.name}</div><div style="font-size:11px;color:var(--text3);">${r.time}</div></div>
              <div style="color:#F59E0B;font-size:12px;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
              <div style="font-size:13px;color:var(--text2);margin-top:4px;">${r.text}</div>
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderAIRecs() {
  return `
  <div class="section-header">
    <div><div class="section-title">✨ AI Recommendations <span class="ai-tag">Powered by Claude</span></div>
    <div class="section-sub">Personalized picks based on your browsing history & past orders</div></div>
  </div>
  <div class="card" style="margin-bottom:24px;background:linear-gradient(135deg,#F3F0FF,#EBF0FF);">
    <div style="display:flex;gap:16px;align-items:center;">
      <div style="font-size:40px;">🤖</div>
      <div style="flex:1;">
        <div style="font-family:var(--font-display);font-weight:700;font-size:16px;margin-bottom:4px;">AI Search is Active</div>
        <div style="font-size:13px;color:var(--text2);">Try: "laptop bag" → also shows "notebook carry case", "MacBook sleeve"<br>"running shoes" → also shows "jogging footwear", "athletic sneakers"</div>
      </div>
      <div style="background:white;border-radius:var(--radius-sm);padding:8px 12px;display:flex;align-items:center;gap:6px;font-size:12px;">
        <span style="width:8px;height:8px;background:var(--success);border-radius:50%;animation:pulse 2s infinite;display:inline-block;"></span>
        Fuzzy match ON
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom:24px;">
    <div style="font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:12px;">Based on you viewed Sony WH-1000XM5…</div>
    <div class="products-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));">
      ${STATE.products.filter(p => p.category === 'Electronics').slice(0,4).map(p => productCard(p)).join('')}
    </div>
  </div>
  <div class="card" style="margin-bottom:24px;">
    <div style="font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:12px;">Fashion picks for you</div>
    <div class="products-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));">
      ${STATE.products.filter(p => p.category === 'Fashion').slice(0,4).map(p => productCard(p)).join('')}
    </div>
  </div>
  <div class="card">
    <div style="font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:12px;">Reorder? You bought these before</div>
    ${STATE.orders.slice(0,3).map(o => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:var(--radius-sm);cursor:pointer;" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background='none'">
        <span style="font-size:28px;">${o.emoji}</span>
        <div style="flex:1;"><div style="font-size:13px;font-weight:500;">${o.product}</div><div style="font-size:11px;color:var(--text3);">Last ordered ${o.date}</div></div>
        <button class="btn btn-primary btn-sm" onclick="addToCart(1)">Reorder</button>
      </div>`).join('')}
  </div>`;
}

function showProduct(id) {
  const p = STATE.products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('product-modal-box').innerHTML = `
    <div style="position:relative;">
      <button class="btn btn-ghost btn-sm" style="position:absolute;top:0;right:0;" onclick="closeModal('product-modal')">✕</button>
      <div class="product-detail">
        <div>
          <div class="product-images" style="background:${catColor(p.category)};font-size:80px;">${p.emoji}</div>
          <div class="product-thumbs">
            ${[p.emoji,'📸','🖼️','🔍'].map((e,i) => `<div class="thumb ${i===0?'active':''}">${e}</div>`).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px;">${p.vendor} · ${p.category}</div>
          <div class="product-detail-name">${p.name}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <div style="color:#F59E0B;">★★★★${p.rating>=4.8?'★':'½'}</div>
            <div style="font-size:12px;color:var(--text3);">${p.rating} (${p.reviews.toLocaleString()} reviews)</div>
            <span class="ai-tag">AI verified</span>
          </div>
          <div class="product-detail-price">₹${p.price.toLocaleString()}</div>
          ${p.original ? `<div class="product-detail-original">MRP ₹${p.original.toLocaleString()} <span style="color:var(--success);font-size:13px;">Save ₹${(p.original-p.price).toLocaleString()}</span></div>` : ''}
          <div style="margin:16px 0;padding:12px;background:var(--bg);border-radius:var(--radius-sm);font-size:13px;color:var(--text2);">${p.desc}</div>
          <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">
            <span style="background:var(--success-light);color:var(--success);font-size:11px;padding:3px 8px;border-radius:4px;">🚚 Free Delivery</span>
            <span style="background:var(--accent-light);color:var(--accent);font-size:11px;padding:3px 8px;border-radius:4px;">↩️ 7-day return</span>
            <span style="background:var(--brand-light);color:var(--brand);font-size:11px;padding:3px 8px;border-radius:4px;">✅ Verified Seller</span>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-primary btn-lg" style="flex:1;" onclick="addToCart(${p.id});closeModal('product-modal');">🛒 Add to Cart</button>
            <button class="btn btn-secondary btn-lg" onclick="toggleWish(${p.id});closeModal('product-modal');">❤️</button>
          </div>
        </div>
      </div>
    </div>`;
  openModal('product-modal');
}