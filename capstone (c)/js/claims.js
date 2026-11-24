(function () {
  const app = window.FINDITApp;
  if (!app) return;

  const queryParams = new URLSearchParams(window.location.search);
  const itemId = queryParams.get('id') || 'lost-1';

  function getCurrentItem() {
    return app.getAllItems().find((item) => item.id === itemId) || app.getAllItems()[0];
  }

  function showMessage(message, type) {
    const el = document.getElementById('app-message');
    if (!el) return;
    el.textContent = message;
    el.className = 'app-message ' + (type || 'info') + ' show';
    setTimeout(() => el.classList.remove('show'), 2600);
  }

  function renderClaimStatus() {
    const item = getCurrentItem();
    const claims = app.getAllClaims().filter((claim) => claim.item_id === item.id);
    const panel = document.getElementById('claim-status-panel');
    if (!panel) return;

    if (!claims.length) {
      panel.innerHTML = '<p class="meta">No claim requests for this item yet.</p>';
      return;
    }

    panel.innerHTML = claims.map((claim) => `
      <div class="match-card">
        <p><strong>Claim status:</strong> ${claim.status}</p>
        <p class="meta">Message: ${claim.verification_message}</p>
      </div>
    `).join('');
  }

  function renderItemDetails() {
    const container = document.getElementById('item-detail-content');
    if (!container) return;

    const item = getCurrentItem();
    container.innerHTML = `
      <div class="detail-image">
        <img src="${item.image_url || 'https://placehold.co/600x400/edf3ff/1e3a8a?text=FINDIT'}" alt="${item.item_name}" />
      </div>
      <div style="padding:1.5rem;">
        <div class="tag-row">
          <span class="tag ${item.report_type === 'Found' ? 'found' : 'lost'}">${item.report_type}</span>
          <span class="tag">${item.category}</span>
        </div>
        <h1>${item.item_name}</h1>
        <div class="report-meta">
          <span class="meta">Colour: ${item.colour}</span>
          <span class="meta">Location: ${item.location}</span>
          <span class="meta">Reported: ${new Date(item.report_date || item.created_at).toLocaleDateString()}</span>
        </div>
        <p>${item.description}</p>
        <div class="report-meta">
          <span class="tag">Status: ${item.status}</span>
        </div>
        <div id="claim-status-panel"></div>
      </div>
    `;

    const lostItems = app.getAllItems().filter((entry) => entry.report_type === 'Lost' && entry.status !== 'Returned' && entry.id !== item.id);
    const foundItems = app.getAllItems().filter((entry) => entry.report_type === 'Found' && entry.status !== 'Returned' && entry.id !== item.id);

    const potentialMatches = item.report_type === 'Found'
      ? lostItems.map((lostItem) => {
          const match = window.FINDIT && window.FINDIT.matching ? window.FINDIT.matching.computeMatchScore(lostItem, item) : { score: 50, reasons: ['Likely match'] };
          return { item: lostItem, match };
        }).sort((a, b) => b.match.score - a.match.score).slice(0, 3)
      : item.report_type === 'Lost'
        ? foundItems.map((foundItem) => {
            const match = window.FINDIT && window.FINDIT.matching ? window.FINDIT.matching.computeMatchScore(item, foundItem) : { score: 50, reasons: ['Likely match'] };
            return { item: foundItem, match };
          }).sort((a, b) => b.match.score - a.match.score).slice(0, 3)
        : [];

    if (potentialMatches.length) {
      const matchesHtml = potentialMatches.map(({ item: matchItem, match }) => `
        <div class="match-card">
          <p><strong>${matchItem.item_name}</strong></p>
          <p class="match-score">${match.score}% match</p>
          <p>${match.reasons.join(', ')}</p>
          <a class="link-button" href="item-details.html?id=${matchItem.id}">View report</a>
        </div>
      `).join('');

      container.insertAdjacentHTML('beforeend', `<div class="match-card"><h3>Potential matches</h3>${matchesHtml}</div>`);
    }

    renderClaimStatus();
  }

  const claimForm = document.getElementById('claim-form');
  if (claimForm) {
    claimForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const message = document.getElementById('claim-verification').value.trim();
      if (!message) {
        showMessage('Please provide a brief verification message before submitting.', 'error');
        return;
      }

      const claims = app.getAllClaims();
      claims.push({
        id: `claim-${Date.now()}`,
        item_id: itemId,
        claimant_id: 'demo-claimant',
        verification_message: message,
        status: 'Pending',
        created_at: new Date().toISOString()
      });
      app.saveAllClaims(claims);
      showMessage('Claim submitted successfully. Status is now Pending.', 'success');
      claimForm.reset();
      renderClaimStatus();
    });
  }

  const returnButton = document.getElementById('mark-returned');
  if (returnButton) {
    returnButton.addEventListener('click', function () {
      app.updateItemStatus(itemId, 'Returned');
      const claims = app.getAllClaims().map((claim) => claim.item_id === itemId ? { ...claim, status: 'Approved' } : claim);
      app.saveAllClaims(claims);
      showMessage('Recovery confirmed. Item marked as returned.', 'success');
      renderItemDetails();
    });
  }

  renderItemDetails();
})();
