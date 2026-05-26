// VendorHub — Admin Pages

function renderAdminHome() {
  return `
  <div class="section-header"><div class="section-title">📊 Platform Analytics</div><div style="font-size:12px;color:var(--text3);">Last updated: just now</div></div>
  <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="stat-card"><div class="stat-label">💰 Total GMV</div><div class="stat-value">₹2.4Cr</div><div class="stat-delta up">↑ 22% MoM</div></div>
    <div class="stat-card"><div class="stat-label">🏪 Active Vendors</div><div class="stat-value">1,284</div><div class="stat-delta up">↑ 47 new</div></div>
    <div class="stat-card"><div class="stat-label">👥 Total Buyers</div><div class="stat-value">38,491</div><div class="stat-delta up">↑ 1,230 this week</div></div>
    <div class="stat-card"><div class="stat-label">📦 Orders Today</div><div class="stat-value">8,491</div><div class="stat-delta up">↑ 23% vs yesterday</div></div>
  </div>
  <div class="grid-2" style="align-items:start;">
    <div class="card">
      <div class="card-header"><div class="card-title">🏆 Top Vendors</div></div>
      ${[
        {name:'AudioZone',rev:'₹48.2L',orders:1243,rating:4.9},
        {name:'TechZone',rev:'₹41.7L',orders:1056,rating:4.7},
        {name:'SneakerHub',rev:'₹38.1L',orders:892,rating:4.6},
        {name:'DroneWorld',rev:'₹29.4L',orders:451,rating:4.9},
        {name:'BookNest',rev:'₹22.3L',orders:2103,rating:4.8},
      ].map((v,i) => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="width:24px;height:24px;border-radius:50%;background:${['#FFD700','#C0C0C0','#CD7F32','var(--bg)','var(--bg)'][i]};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${i+1}</div>
          <div class="avatar" style="background:var(--brand);width:32px;height:32px;font-size:11px;">${v.name[0]}</div>
          <div style="flex:1;"><div style="font-size:13px;font-weight:500;">${v.name}</div><div style="font-size:11px;color:var(--text3);">★ ${v.rating} · ${v.orders} orders</div></div>
          <div style="font-family:var(--font-display);font-size:14px;font-weight:700;">${v.rev}</div>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📂 Top Categories</div></div>
      ${[
        {cat:'Electronics',share:34,rev:'₹82.4L'},
        {cat:'Fashion',share:28,rev:'₹67.8L'},
        {cat:'Home & Living',share:16,rev:'₹38.7L'},
        {cat:'Books',share:12,rev:'₹29.1L'},
        {cat:'Sports',share:7,rev:'₹16.9L'},
        {cat:'Food',share:3,rev:'₹7.2L'},
      ].map(c => `
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span style="font-weight:500;">${c.cat}</span>
            <span style="color:var(--text3);">${c.share}% · ${c.rev}</span>
          </div>
          <div class="progress"><div class="progress-fill" style="width:${c.share*2.5}%;background:var(--brand);"></div></div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderVendorApproval() {
  return `
  <div class="section-header"><div class="section-title">✅ Vendor Approvals <span style="font-size:13px;color:var(--text3);">(${STATE.pendingVendors.length} pending)</span></div></div>
  <div class="tabs"><div class="tab active">Pending (${STATE.pendingVendors.length})</div><div class="tab">Approved</div><div class="tab">Rejected</div></div>
  ${STATE.pendingVendors.map(v => `
    <div class="card" style="margin-bottom:12px;" id="vendor-card-${v.id}">
      <div style="display:flex;gap:16px;align-items:flex-start;">
        <div class="vendor-avatar">${v.emoji}</div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-family:var(--font-display);font-size:16px;font-weight:700;">${v.name}</div>
              <div style="font-size:12px;color:var(--text3);margin-top:2px;">by ${v.owner} · ${v.location}</div>
            </div>
            <span class="pill pill-pending"><span class="pill-dot"></span>Pending Review</span>
          </div>
          <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;">
            <div style="font-size:12px;"><span style="color:var(--text3);">Category:</span> <strong>${v.category}</strong></div>
            <div style="font-size:12px;"><span style="color:var(--text3);">Products ready:</span> <strong>${v.products}</strong></div>
            <div style="font-size:12px;"><span style="color:var(--text3);">Applied:</span> <strong>${v.applied} May</strong></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:14px;">
            <button class="btn btn-primary" onclick="approveVendor('${v.id}')">✅ Approve</button>
            <button class="btn btn-danger" onclick="rejectVendor('${v.id}')">❌ Reject</button>
            <button class="btn btn-secondary" onclick="showToast('Loading KYC docs…','')">📄 View Docs</button>
          </div>
        </div>
      </div>
    </div>`).join('')}`;
}

function renderCategories() {
  return `
  <div class="section-header">
    <div class="section-title">🏷️ Categories</div>
    <button class="btn btn-primary" onclick="showToast('Category added!','success')">+ Add Category</button>
  </div>
  <div class="grid-2">
    ${STATE.categories.map(c => `
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:44px;height:44px;border-radius:12px;background:var(--brand-light);display:flex;align-items:center;justify-content:center;font-size:24px;">${c.icon}</div>
            <div><div style="font-weight:600;">${c.name}</div><div style="font-size:11px;color:var(--text3);">${c.products.toLocaleString()} products</div></div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Editing ${c.name}','')">Edit</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${c.sub.map(s => `<span style="background:var(--surface2);font-size:11px;padding:3px 8px;border-radius:4px;color:var(--text2);">${s}</span>`).join('')}
          <span style="background:var(--brand-light);color:var(--brand);font-size:11px;padding:3px 8px;border-radius:4px;cursor:pointer;" onclick="showToast('Add subcategory','')">+ Add</span>
        </div>
      </div>`).join('')}
  </div>`;
}

function renderRefunds() {
  return `
  <div class="section-header"><div class="section-title">↩️ Refund Requests</div></div>
  <div class="card" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Refund ID</th><th>Order</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${STATE.refunds.map(r => `<tr>
            <td style="font-family:var(--font-display);font-size:12px;font-weight:700;">${r.id}</td>
            <td style="font-size:12px;color:var(--text3);">${r.order}</td>
            <td style="font-size:13px;">${r.product}</td>
            <td style="font-size:12px;">${r.buyer}</td>
            <td style="font-weight:700;">₹${r.amount}</td>
            <td style="font-size:12px;max-width:160px;">${r.reason}</td>
            <td><span class="pill pill-${r.status.toLowerCase()}"><span class="pill-dot"></span>${r.status}</span></td>
            <td>
              ${r.status==='Pending'?`<div style="display:flex;gap:4px;">
                <button class="btn btn-success btn-sm" onclick="resolveRefund('${r.id}','Approved')">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="resolveRefund('${r.id}','Rejected')">Reject</button>
              </div>`:`<span style="font-size:11px;color:var(--text3);">Resolved</span>`}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderCommission() {
  const commRates = ['10','8','12','10','7','5'];
  return `
  <div class="section-header"><div class="section-title">💸 Commission Settings</div></div>
  <div class="grid-2" style="align-items:start;">
    <div class="card">
      <div class="card-title" style="margin-bottom:16px;">Platform Commission</div>
      ${STATE.categories.map((c,i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">${c.icon}</span><span style="font-size:13px;">${c.name}</span></div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="number" class="form-input" style="width:70px;padding:5px 8px;font-size:13px;" value="${commRates[i]}">
            <span style="font-size:13px;color:var(--text3);">%</span>
          </div>
        </div>`).join('')}
      <button class="btn btn-primary" style="margin-top:16px;" onclick="showToast('Commission rates saved!','success')">Save Changes</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px;">📊 Commission Revenue</div>
      <div style="font-family:var(--font-display);font-size:40px;font-weight:800;color:var(--brand);">₹24.1L</div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:16px;">Total commission earned this month</div>
      ${[['Electronics (10%)','₹8.24L'],['Fashion (8%)','₹5.42L'],['Home & Living (12%)','₹4.65L'],['Books (7%)','₹2.04L'],['Sports (10%)','₹1.69L']].map(([c,r]) => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;">
          <span style="color:var(--text2);">${c}</span><span style="font-weight:600;">${r}</span>
        </div>`).join('')}
    </div>
  </div>`;
}