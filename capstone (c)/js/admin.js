(function () {
  const app = window.FINDITApp;
  if (!app) return;

  function renderAdmin() {
    const content = document.getElementById('admin-content');
    if (!content) return;

    const items = app.getAllItems();
    const claims = app.getAllClaims();
    const recovered = items.filter((item) => item.status === 'Returned').length;
    const pendingClaims = claims.filter((claim) => claim.status === 'Pending').length;

    content.innerHTML = `
      <div class="stats-grid">
        <article class="stat-card">
          <p class="eyebrow">Lost reports</p>
          <h3>${items.filter((item) => item.report_type === 'Lost').length}</h3>
        </article>
        <article class="stat-card">
          <p class="eyebrow">Found reports</p>
          <h3>${items.filter((item) => item.report_type === 'Found').length}</h3>
        </article>
        <article class="stat-card">
          <p class="eyebrow">Pending claims</p>
          <h3>${pendingClaims}</h3>
        </article>
        <article class="stat-card">
          <p class="eyebrow">Recovered items</p>
          <h3>${recovered}</h3>
        </article>
      </div>

      <div class="section-heading" style="margin-top:2rem;">
        <p class="eyebrow">Recent activity</p>
        <h2>Moderation queue</h2>
      </div>

      <div class="listing-grid">
        ${claims.length ? claims.map((claim) => `
          <article class="listing-card">
            <div class="listing-body">
              <div class="tag-row">
                <span class="tag">Status: ${claim.status}</span>
              </div>
              <h3>Claim review</h3>
              <p class="meta">Claim ID: ${claim.id}</p>
              <p class="meta">Message: ${claim.verification_message}</p>
              <div class="card-actions">
                <button class="btn btn-primary" type="button" data-claim-action="approve" data-claim-id="${claim.id}">Approve</button>
                <button class="btn btn-secondary" type="button" data-claim-action="reject" data-claim-id="${claim.id}">Reject</button>
              </div>
            </div>
          </article>
        `).join('') : '<div class="empty-state">No claim activity to review.</div>'}
      </div>
    `;

    document.querySelectorAll('[data-claim-action]').forEach((button) => {
      button.addEventListener('click', function () {
        const claimId = button.getAttribute('data-claim-id');
        const action = button.getAttribute('data-claim-action');
        const claims = app.getAllClaims().map((claim) => {
          if (claim.id === claimId) {
            return { ...claim, status: action === 'approve' ? 'Approved' : 'Rejected' };
          }
          return claim;
        });

        app.saveAllClaims(claims);
        renderAdmin();
      });
    });
  }

  renderAdmin();
})();
