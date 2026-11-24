(function () {
  const app = window.FINDITApp;
  if (!app) return;

  function renderFilteredItems(items, containerId, fromHomePage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items.length) {
      container.innerHTML = fromHomePage
        ? '<span class="search-pill">No matches yet</span>'
        : '<div class="empty-state">No matching items found. Try broadening your filters.</div>';
      return;
    }

    if (fromHomePage) {
      container.innerHTML = items.slice(0, 5).map((item) => `<span class="search-pill">${item.item_name}</span>`).join('');
      return;
    }

    container.innerHTML = items.map((item) => `
      <article class="listing-card">
        <img class="listing-image" src="${item.image_url || 'https://placehold.co/600x400/edf3ff/1e3a8a?text=FINDIT'}" alt="${item.item_name}" />
        <div class="listing-body">
          <div class="tag-row">
            <span class="tag ${item.report_type === 'Found' ? 'found' : 'lost'}">${item.report_type}</span>
            <span class="tag">${item.category}</span>
          </div>
          <h3>${item.item_name}</h3>
          <p class="meta">${item.colour} · ${item.location}</p>
          <p class="meta">${item.description}</p>
          <div class="card-actions">
            <span class="meta">${new Date(item.report_date || item.created_at).toLocaleDateString()}</span>
            <a class="link-button" href="item-details.html?id=${item.id}">View report</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  function prepareFiltersFromForm(formId) {
    const result = {};
    const map = {
      itemName: ['search-item-name', 'filter-item-name'],
      type: ['filter-type', 'search-type'],
      category: ['filter-category', 'search-category'],
      colour: ['filter-colour', 'search-colour'],
      location: ['filter-location', 'search-location'],
      keywords: ['filter-keywords', 'search-keywords']
    };

    Object.keys(map).forEach((key) => {
      const idList = map[key];
      for (const id of idList) {
        const field = document.getElementById(id);
        if (field && field.value && field.value.trim()) {
          result[key] = field.value.trim();
          break;
        }
      }
    });

    return result;
  }

  function handleBrowseRender() {
    const filterForm = document.getElementById('browse-filter-form');
    const statusEl = document.getElementById('browse-status');
    if (!filterForm) return;

    function updateResults() {
      const filters = prepareFiltersFromForm('browse-filter-form');
      const items = app.getAllItems().filter((item) => app.matchesFilters(item, filters));
      renderFilteredItems(items, 'browse-results', false);

      if (statusEl) {
        statusEl.textContent = items.length ? `Showing ${items.length} item(s).` : 'No results match the selected filters.';
        statusEl.classList.remove('hidden');
      }
    }

    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      updateResults();
    });

    document.getElementById('clear-filters')?.addEventListener('click', () => {
      filterForm.reset();
      updateResults();
    });

    updateResults();
  }

  function handleHomeSearch() {
    const form = document.getElementById('home-search-form');
    const results = document.getElementById('home-search-results');
    if (!form || !results) return;

    function renderHomeSearch() {
      const filters = prepareFiltersFromForm('home-search-form');
      const items = app.getAllItems().filter((item) => app.matchesFilters(item, filters));
      renderFilteredItems(items, 'home-search-results', true);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      renderHomeSearch();
    });

    document.getElementById('clear-home-search')?.addEventListener('click', function () {
      form.reset();
      renderHomeSearch();
    });

    renderHomeSearch();
  }

  handleBrowseRender();
  handleHomeSearch();
})();
