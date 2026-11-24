(function () {
  const config = window.FINDIT_CONFIG || {};
  const demoItems = config.DEMO_ITEMS || [];

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function getDemoItems() {
    return (config.DEMO_ITEMS || []).slice();
  }

  function getAllItems() {
    const storageValue = localStorage.getItem('findit-demo-items');
    if (!storageValue) return getDemoItems();

    try {
      const parsed = JSON.parse(storageValue);
      return Array.isArray(parsed) && parsed.length ? parsed : getDemoItems();
    } catch (error) {
      console.warn('Could not read saved item data.', error);
      return getDemoItems();
    }
  }

  function saveAllItems(items) {
    localStorage.setItem('findit-demo-items', JSON.stringify(items));
  }

  function showMessage(message, type, elId) {
    const target = document.getElementById(elId || 'app-message');
    if (!target) return;

    target.textContent = message;
    target.className = 'app-message ' + (type || 'info') + ' show';
    window.clearTimeout(target._finditTimer);
    target._finditTimer = window.setTimeout(() => {
      target.classList.remove('show');
    }, 2600);
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Image could not be read.'));
      reader.readAsDataURL(file);
    });
  }

  function matchesFilters(item, filters) {
    const type = normalize(item.report_type);
    const category = normalize(item.category);
    const colour = normalize(item.colour);
    const location = normalize(item.location);
    const description = normalize(item.description);
    const itemName = normalize(item.item_name);

    const filterType = normalize(filters.type);
    const filterCategory = normalize(filters.category);
    const filterColour = normalize(filters.colour);
    const filterLocation = normalize(filters.location);
    const filterItemName = normalize(filters.itemName);
    const keywordText = normalize(filters.keywords);

    if (filterType && type !== filterType) return false;
    if (filterCategory && category !== filterCategory) return false;
    if (filterColour && colour !== filterColour) return false;
    if (filterLocation && !location.includes(filterLocation)) return false;
    if (filterItemName && !itemName.includes(filterItemName)) return false;

    if (keywordText) {
      const keywords = keywordText.split(/[\s,]+/).filter(Boolean);
      const matchesKeyword = keywords.some((keyword) => {
        return description.includes(keyword) || itemName.includes(keyword) || location.includes(keyword);
      });
      if (!matchesKeyword) return false;
    }

    return true;
  }

  function buildItem(type, values) {
    return {
      id: `${type.toLowerCase()}-${Date.now()}`,
      user_id: 'demo-user',
      report_type: type,
      item_name: values.itemName,
      category: values.category,
      colour: values.colour,
      description: values.description,
      location: values.location,
      report_date: values.date,
      image_url: values.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      status: 'Active',
      created_at: new Date().toISOString()
    };
  }

  function getAllClaims() {
    const storageValue = localStorage.getItem('findit-demo-claims');
    if (!storageValue) return [];

    try {
      const parsed = JSON.parse(storageValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Could not read saved claim data.', error);
      return [];
    }
  }

  function saveAllClaims(claims) {
    localStorage.setItem('findit-demo-claims', JSON.stringify(claims));
  }

  function updateItemStatus(itemId, status) {
    const items = getAllItems();
    const updated = items.map((item) => item.id === itemId ? { ...item, status } : item);
    saveAllItems(updated);
    return updated;
  }

  function getDemoUser() {
    try {
      return JSON.parse(localStorage.getItem('findit-demo-user') || 'null') || { full_name: 'Demo User', email: 'demo@findit.local' };
    } catch (error) {
      return { full_name: 'Demo User', email: 'demo@findit.local' };
    }
  }

  window.FINDITApp = {
    config,
    demoItems,
    getDemoItems,
    getAllItems,
    saveAllItems,
    getAllClaims,
    saveAllClaims,
    updateItemStatus,
    getDemoUser,
    showMessage,
    readFileAsDataUrl,
    matchesFilters,
    buildItem,
    normalize
  };
})();
