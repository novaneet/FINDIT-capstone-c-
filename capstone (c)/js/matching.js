(function () {
  function normalize(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).join(' ');
  }

  function similarityScore(a, b) {
    const left = normalize(a).split(' ');
    const right = normalize(b).split(' ');
    const intersection = left.filter((word) => right.includes(word));
    const base = Math.max(left.length, right.length);
    if (!base) return 0;
    return Math.round((intersection.length / base) * 100);
  }

  function calculateDateScore(dateA, dateB) {
    if (!dateA || !dateB) return 0;
    const first = new Date(dateA).getTime();
    const second = new Date(dateB).getTime();
    if (Number.isNaN(first) || Number.isNaN(second)) return 0;
    const diff = Math.abs(first - second) / (1000 * 60 * 60 * 24);
    if (diff <= 1) return 10;
    if (diff <= 3) return 7;
    if (diff <= 7) return 4;
    return 1;
  }

  function computeMatchScore(lostItem, foundItem) {
    let total = 0;
    const reasons = [];

    if (lostItem.category === foundItem.category) {
      total += 25;
      reasons.push('Same category');
    }

    if (lostItem.item_name && foundItem.item_name) {
      const nameScore = similarityScore(lostItem.item_name, foundItem.item_name);
      total += Math.round((nameScore / 100) * 20);
      if (nameScore > 0) reasons.push('Name overlap');
    }

    if (lostItem.colour && foundItem.colour) {
      const colourMatch = lostItem.colour.toLowerCase() === foundItem.colour.toLowerCase();
      if (colourMatch) {
        total += 15;
        reasons.push('Colour match');
      }
    }

    const descriptionScore = similarityScore(lostItem.description, foundItem.description);
    total += Math.round((descriptionScore / 100) * 20);
    if (descriptionScore > 0) reasons.push('Description similarity');

    if (lostItem.location && foundItem.location) {
      const locationText = normalize(lostItem.location);
      const foundLocation = normalize(foundItem.location);
      if (locationText === foundLocation || locationText.includes(foundLocation) || foundLocation.includes(locationText)) {
        total += 10;
        reasons.push('Location match');
      }
    }

    total += calculateDateScore(lostItem.report_date, foundItem.report_date);
    if (calculateDateScore(lostItem.report_date, foundItem.report_date) > 0) reasons.push('Date proximity');

    return {
      score: Math.min(total, 100),
      reasons: reasons.slice(0, 4)
    };
  }

  window.FINDIT = window.FINDIT || {};
  window.FINDIT.matching = {
    computeMatchScore: computeMatchScore,
    getPotentialMatches: function (lostItem, items) {
      return items
        .filter((item) => item.id !== lostItem.id && item.report_type === 'Found' && item.status !== 'Returned')
        .map((item) => ({
          item: item,
          result: computeMatchScore(lostItem, item)
        }))
        .filter((entry) => entry.result.score >= 35)
        .sort((a, b) => b.result.score - a.result.score)
        .slice(0, 5);
    }
  };
})();
