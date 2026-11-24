(function () {
  const app = window.FINDITApp;
  if (!app) return;

  function renderDashboard() {
    const content = document.getElementById('dashboard-content');
    if (!content) return;

    const allItems = app.getAllItems();
    const lostItems = allItems.filter((item) => item.report_type === 'Lost');
    const foundItems = allItems.filter((item) => item.report_type === 'Found');
    const claims = app.getAllClaims();
    const myClaims = claims.filter((claim) => claim.claimant_id === 'demo-claimant');

    content.innerHTML = `
      <div class="stats-grid">
        <article class="stat-card">
          <p class="eyebrow">Lost reports</p>
          <h3>${lostItems.length}</h3>
        </article>
        <article class="stat-card">
          <p class="eyebrow">Found reports</p>
          <h3>${foundItems.length}</h3>
        </article>
        <article class="stat-card">
          <p class="eyebrow">Claims</p>
          <h3>${myClaims.length}</h3>
        </article>
        <article class="stat-card">
          <p class="eyebrow">Returned</p>
          <h3>${allItems.filter((item) => item.status === 'Returned').length}</h3>
        </article>
      </div>

      <div class="section-heading" style="margin-top:2rem;">
        <p class="eyebrow">My claims</p>
        <h2>Current requests</h2>
      </div>

      <div class="listing-grid">
        ${myClaims.length ? myClaims.map((claim) => `
          <article class="listing-card">
            <div class="listing-body">
              <div class="tag-row">
                <span class="tag">${claim.status}</span>
              </div>
              <h3>Claim request</h3>
              <p class="meta">Item ID: ${claim.item_id}</p>
              <p class="meta">${claim.verification_message}</p>
            </div>
          </article>
        `).join('') : '<div class="empty-state">No claim requests submitted yet.</div>'}
      </div>

      <div class="section-heading" style="margin-top:2rem;">
        <p class="eyebrow">My reports</p>
        <h2>Recent listings</h2>
      </div>
      <div class="listing-grid">
        ${allItems.map((item) => `
          <article class="listing-card">
            <img class="listing-image" src="${item.image_url}" alt="${item.item_name}" />
            <div class="listing-body">
              <div class="tag-row">
                <span class="tag ${item.report_type === 'Found' ? 'found' : 'lost'}">${item.report_type}</span>
                <span class="tag">${item.category}</span>
              </div>
              <h3>${item.item_name}</h3>
              <p class="meta">${item.location}</p>
              <p class="meta">Status: ${item.status}</p>
              <div class="card-actions">
                <a class="link-button" href="item-details.html?id=${item.id}">View</a>
                <button class="btn btn-secondary" type="button" data-delete-item="${item.id}">Delete</button>
              </div>
            </div>
          </article>
        `).join('') || '<div class="empty-state">No report activity yet.</div>'}
      </div>
    `;

    document.querySelectorAll('[data-delete-item]').forEach((button) => {
      button.addEventListener('click', function () {
        const itemId = button.getAttribute('data-delete-item');
        const updatedItems = app.getAllItems().filter((item) => item.id !== itemId);
        app.saveAllItems(updatedItems);
        renderDashboard();
      });
    });
  }

  renderDashboard();
})();
