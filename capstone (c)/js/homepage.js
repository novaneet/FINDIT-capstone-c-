(function () {
  const app = window.FINDITApp;
  if (!app) return;

  function renderRecentListings() {
    const parent = document.getElementById('recent-listings');
    const activeListings = document.getElementById('active-listings-count');
    const matchCount = document.getElementById('match-count');

    if (!parent) return;

    const items = app.getAllItems().slice(0, 4);
    if (activeListings) activeListings.textContent = String(items.length);
    if (matchCount) matchCount.textContent = String(Math.max(2, items.length - 1));

    parent.innerHTML = items.map((item) => `
      <article class="listing-card">
        <img class="listing-image" src="${item.image_url || 'https://placehold.co/600x400/edf3ff/1e3a8a?text=FINDIT'}" alt="${item.item_name}" />
        <div class="listing-body">
          <div class="tag-row">
            <span class="tag ${item.report_type === 'Found' ? 'found' : 'lost'}">${item.report_type}</span>
            <span class="tag">${item.category}</span>
          </div>
          <h3>${item.item_name}</h3>
          <p class="meta">${item.colour} · ${item.location}</p>
          <p class="meta">Reported ${new Date(item.report_date || item.created_at).toLocaleDateString()}</p>
          <div class="card-actions">
            <span class="meta">${item.status || 'Active'}</span>
            <a class="link-button" href="pages/item-details.html?id=${item.id}">View Details</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  renderRecentListings();
})();
