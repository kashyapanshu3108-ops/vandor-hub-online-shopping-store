// VendorHub — Seller Pages

function renderSellerDash() {
  const totalRev = STATE.vendorProducts.reduce((a,p) => a + p.revenue, 0);
  const totalOrders = STATE.vendorProducts.reduce((a,p) => a + p.orders, 0);
  return `
  <div class="section-header">
    <div class="section-title">📊 Seller Dashboard</div>
    <button class="btn btn-primary" onclick="openModal('add-product-modal')">+ Add Product</button>
  </div>
  <div class="alert-bar">⚠️ <strong>Low Stock Alert:</strong> Laptop Stand Aluminium has only 3 units left. Restock now!</div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-label">💰 Total Revenue</div><div class="stat-value">₹${(totalRev/100000).toFixed(1)}L</div><div class="stat-delta up">↑ 18% this month</div></div>
    <div class="stat-card"><div class="stat-label">📦 Total Orders</div><div class="stat-value">${totalOrders}</div><div class="stat-delta up">↑ 12 this week</div></div>
    <div class="stat-card"><div class="stat-label">⭐ Store Rating</div><div class="stat-value">4.7</div><div class="stat-delta up">↑ from 4.5</div></div>
    <div class="stat-card"><div class="stat-label">📤 Net Payout</div><div class="stat-value">₹${((totalRev*0.9)/100000).toFixed(1)}L</div><div class="stat-delta" style="color:var(--text3);">after 10% commission</div></div>
  </div>
  <div class="grid-2" style="align-items:start;">
    <div class="card">
      <div class="card-header"><div class="card-title">📈 Revenue This Week</div><span class="ai-tag">AI Forecast</span></div>
      <div class="chart-bars">
        ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => {
          const vals = [42,67,55,89,78,95,61];
          return `<div class="chart-bar-wrap"><div class="chart-bar" style="height:${vals[i]}%;background:${i===5?'var(--brand)':'var(--brand-light)'};" title="₹${vals[i]*1200}"></div><div class="chart-bar-label">${d}</div></div>`;
        }).join('')}
      </div>
      <div style="font-size:11px;color:var(--text3);margin-top:8px;">✦ AI predicts +12% next week based on trends</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🏆 Top Products</div></div>
      ${STATE.vendorProducts.slice(0,4).map((p,i) => `
        <div class="earning-row">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="font-size:20px;">${p.emoji}</div>
            <div><div style="font-size:13px;font-weight:500;">${p.name}</div><div style="font-size:11px;color:var(--text3);">${p.orders} orders</div></div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-display);font-weight:700;font-size:14px;">₹${(p.revenue/1000).toFixed(0)}K</div>
            <div class="mini-bar" style="width:80px;"><div class="mini-bar-fill" style="width:${[100,85,72,60][i]}%"></div></div>
          </div>
        </div>`).join('')}
    </div>
  </div>
  <div class="card" style="margin-top:16px;">
    <div class="card-header"><div class="card-title">🆕 Recent Orders</div><a class="view-all" onclick="navigate('seller-orders')">View all →</a></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${STATE.vendorOrders.slice(0,4).map(o => `<tr>
            <td style="font-size:12px;font-weight:700;font-family:var(--font-display);">${o.id}</td>
            <td style="font-size:13px;">${o.product}</td>
            <td style="font-size:12px;color:var(--text3);">${o.buyer}</td>
            <td style="font-weight:700;">₹${o.amount.toLocaleString()}</td>
            <td><span class="pill pill-${o.status.toLowerCase()}"><span class="pill-dot"></span>${o.status}</span></td>
            <td>
              ${o.status==='Confirmed'?`<button class="btn btn-sm" style="background:var(--accent-light);color:var(--accent);" onclick="updateOrderStatus('${o.id}')">Mark Shipped</button>`:''}
              ${o.status==='Placed'?`<button class="btn btn-success btn-sm" onclick="updateOrderStatus('${o.id}')">Confirm</button>`:''}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderMyProducts() {
  return `
  <div class="section-header">
    <div class="section-title">📦 My Products</div>
    <button class="btn btn-primary" onclick="openModal('add-product-modal')">+ Add Product</button>
  </div>
  ${STATE.vendorProducts.some(p => p.stock < 5) ? `<div class="alert-bar">⚠️ <strong>Low Stock:</strong> ${STATE.vendorProducts.filter(p=>p.stock<5).map(p=>p.name).join(', ')} — restock soon!</div>` : ''}
  <div class="card" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Orders</th><th>Revenue</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${STATE.vendorProducts.map(p => `<tr>
            <td><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:24px;">${p.emoji}</span><div><div style="font-size:13px;font-weight:500;">${p.name}</div>${p.badge?`<span class="product-badge badge-${p.badge}">${p.badge.toUpperCase()}</span>`:''}</div></div></td>
            <td style="font-size:12px;color:var(--text3);">${p.category}</td>
            <td style="font-weight:700;">₹${p.price.toLocaleString()}</td>
            <td><span class="pill ${p.stock<5?'pill-low':'pill-active'}">${p.stock} units</span></td>
            <td style="font-size:13px;">${p.orders}</td>
            <td style="font-family:var(--font-display);font-weight:700;">₹${(p.revenue/1000).toFixed(0)}K</td>
            <td><span class="pill pill-approved">Active</span></td>
            <td><div style="display:flex;gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Del</button>
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderSellerOrders() {
  return `
  <div class="section-header"><div class="section-title">🛒 Incoming Orders</div></div>
  <div class="tabs">
    <div class="tab active">All (${STATE.vendorOrders.length})</div>
    <div class="tab">Placed (2)</div><div class="tab">Processing (1)</div><div class="tab">Completed (2)</div>
  </div>
  <div class="card" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order ID</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th><th>Date</th><th>Update Status</th></tr></thead>
        <tbody>
          ${STATE.vendorOrders.map(o => `<tr>
            <td style="font-family:var(--font-display);font-size:12px;font-weight:700;">${o.id}</td>
            <td style="font-size:13px;">${o.product}</td>
            <td style="font-size:12px;">${o.buyer}</td>
            <td style="font-weight:700;">₹${o.amount.toLocaleString()}</td>
            <td><span class="pill pill-${o.status.toLowerCase()}"><span class="pill-dot"></span>${o.status}</span></td>
            <td style="font-size:12px;color:var(--text3);">${o.date}</td>
            <td>
              <select class="form-input form-select" style="font-size:11px;padding:5px 24px 5px 8px;width:auto;" onchange="showToast('Status updated to '+this.value,'success')">
                <option ${o.status==='Placed'?'selected':''}>Placed</option>
                <option ${o.status==='Confirmed'?'selected':''}>Confirmed</option>
                <option ${o.status==='Shipped'?'selected':''}>Shipped</option>
                <option ${o.status==='Delivered'?'selected':''}>Delivered</option>
              </select>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderEarnings() {
  const months = ['Jan','Feb','Mar','Apr','May'];
  const vals = [45,62,55,78,92];
  return `
  <div class="section-header"><div class="section-title">💰 Earnings Dashboard</div></div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-label">💰 Total Revenue</div><div class="stat-value">₹16.7L</div><div class="stat-delta up">↑ 18% vs last month</div></div>
    <div class="stat-card"><div class="stat-label">💸 Commission (10%)</div><div class="stat-value" style="color:var(--danger);">₹1.67L</div><div class="stat-delta" style="color:var(--text3);">deducted</div></div>
    <div class="stat-card"><div class="stat-label">✅ Net Earnings</div><div class="stat-value" style="color:var(--success);">₹15.0L</div><div class="stat-delta up">After commission</div></div>
    <div class="stat-card"><div class="stat-label">🏦 Pending Payout</div><div class="stat-value">₹2.3L</div><div class="stat-delta" style="color:var(--text3);">Next: 25 May</div></div>
  </div>
  <div class="grid-2" style="align-items:start;">
    <div class="card">
      <div class="card-title" style="margin-bottom:16px;">📊 Monthly Revenue</div>
      <div class="chart-bars" style="height:120px;">
        ${months.map((m,i) => `<div class="chart-bar-wrap"><div class="chart-bar" style="height:${vals[i]}%;background:${i===4?'var(--brand)':'var(--brand-light)'}"></div><div class="chart-bar-label">${m}</div></div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px;">🏦 Payout History</div>
      ${[
        {date:'25 Apr 2026',amount:'₹3,24,500',status:'Paid',ref:'PAY-001'},
        {date:'25 Mar 2026',amount:'₹2,87,000',status:'Paid',ref:'PAY-002'},
        {date:'25 Feb 2026',amount:'₹2,41,000',status:'Paid',ref:'PAY-003'},
        {date:'25 May 2026',amount:'₹2,30,000',status:'Pending',ref:'—'},
      ].map(p => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
          <div><div style="font-size:13px;font-weight:500;">${p.date}</div><div style="font-size:11px;color:var(--text3);">Ref: ${p.ref}</div></div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-display);font-weight:700;font-size:14px;">${p.amount}</div>
            <span class="pill ${p.status==='Paid'?'pill-approved':'pill-pending'}">${p.status}</span>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderSellerRegister() {
  return `
  <div class="section-header"><div class="section-title">✅ Vendor Registration</div></div>
  <div class="grid-2" style="align-items:start;">
    <div class="card">
      <div style="background:var(--success-light);border:1px solid #BBF7D0;border-radius:var(--radius-sm);padding:12px;margin-bottom:20px;display:flex;gap:10px;align-items:center;">
        <span style="font-size:20px;">✅</span>
        <div><div style="font-size:13px;font-weight:600;color:var(--success);">TechZone Store — Approved Vendor</div><div style="font-size:11px;color:var(--success);">Your vendor account is active since Jan 2026</div></div>
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;">
        <div style="font-size:14px;font-weight:600;margin-bottom:12px;">Store Details</div>
        <div class="form-group"><label class="form-label">Store Name</label><input class="form-input" value="TechZone Store"></div>
        <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" rows="2">Premium electronics accessories and gadgets at best prices.</textarea></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Category</label><select class="form-input form-select"><option>Electronics</option></select></div>
          <div class="form-group"><label class="form-label">City</label><input class="form-input" value="Noida, UP"></div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Store updated!','success')">Update Store</button>
      </div>
    </div>
    <div>
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title" style="margin-bottom:14px;">📋 Registration Steps</div>
        ${[
          {step:'Submit Application',done:true,note:'Store details + KYC docs'},
          {step:'Admin Review',done:true,note:'Reviewed within 24hrs'},
          {step:'Account Approved',done:true,note:'Email sent 15 Jan 2026'},
          {step:'Add Products',done:true,note:'5 products listed'},
          {step:'First Sale',done:true,note:'Completed 18 Jan 2026'},
        ].map(s => `
          <div style="display:flex;gap:10px;align-items:center;padding:8px 0;">
            <div style="width:24px;height:24px;border-radius:50%;background:${s.done?'var(--success)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:11px;color:white;flex-shrink:0;">${s.done?'✓':'○'}</div>
            <div><div style="font-size:13px;font-weight:500;">${s.step}</div><div style="font-size:11px;color:var(--text3);">${s.note}</div></div>
          </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:12px;">📄 KYC Documents</div>
        ${[['GST Certificate','Verified ✓'],['PAN Card','Verified ✓'],['Bank Account','Verified ✓'],['Address Proof','Verified ✓']].map(([d,s]) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;">
            <span>${d}</span><span style="color:var(--success);font-size:12px;font-weight:600;">${s}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}