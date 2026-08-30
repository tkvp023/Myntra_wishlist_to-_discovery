// v2: raised from 5 to 50 to protect against small-sample misrepresentation
const BADGE_MIN_THRESHOLD = 50;

// Positive mapping definitions for badges
const POSITIVE_VALUES = {
  authenticity: 'feelsGenuine',
  fit: 'fitsAsExpected',
  overallSatisfaction: 'satisfied',
  photoMatch: 'matches',
  fabricFeel: 'asDescribed',
  comfortFeel: 'comfortable',
  materialFeel: 'sturdyPremium',
  finishDurability: 'holdsShinColor',
  shadeMatch: 'matchesShade'
};

const NEGATIVE_VALUES = {
  authenticity: ['feelsOff'],
  fit: ['doesntFit'],
  overallSatisfaction: ['notSatisfied'],
  photoMatch: ['slightlyDiff', 'veryDiff'],
  fabricFeel: ['thinnerRougher'],
  comfortFeel: ['stiffUncomfortable'],
  materialFeel: ['flimsy'],
  finishDurability: ['tarnishedFaded'],
  shadeMatch: ['differentShade']
};

const DISPLAY_LABELS = {
  authenticity: { positive: 'Feels Genuine', short: 'Genuine' },
  fit: { positive: 'Fits as Expected', short: 'Fit' },
  photoMatch: { positive: 'Matches Photos', short: 'Photo Match' },
  fabricFeel: { positive: 'Fabric As Described', short: 'Fabric' },
  comfortFeel: { positive: 'Comfortable', short: 'Comfort' },
  materialFeel: { positive: 'Sturdy / Premium', short: 'Material' },
  finishDurability: { positive: 'Holds Shine', short: 'Finish' },
  shadeMatch: { positive: 'Matches Shade', short: 'Shade' },
  overallSatisfaction: { positive: 'Satisfied', short: 'Satisfied' }
};

/**
 * Computes structured badge aggregates from a list of reviews for a product
 */
function computeBadgeAggregates(reviews, applicableBadges = []) {
  const result = {};

  const badgeFields = [
    { key: 'authenticity', field: 'badgeAuthenticity' },
    { key: 'fit', field: 'badgeFit' },
    { key: 'photoMatch', field: 'badgePhotoMatch' },
    { key: 'fabricFeel', field: 'badgeFabricFeel' },
    { key: 'comfortFeel', field: 'badgeComfortFeel' },
    { key: 'materialFeel', field: 'badgeMaterialFeel' },
    { key: 'finishDurability', field: 'badgeFinishDurability' },
    { key: 'shadeMatch', field: 'badgeShadeMatch' },
    { key: 'overallSatisfaction', field: 'badgeOverallSatisfaction' }
  ];

  for (const { key, field } of badgeFields) {
    if (applicableBadges.length > 0 && !applicableBadges.includes(key)) {
      continue;
    }

    const counts = {};
    let total = 0;

    for (const r of reviews) {
      const val = r[field];
      if (val) {
        counts[val] = (counts[val] || 0) + 1;
        total += 1;
      }
    }

    if (total > 0) {
      const positiveVal = POSITIVE_VALUES[key];
      const positiveCount = counts[positiveVal] || 0;
      const percentPositive = Math.round((positiveCount / total) * 100);

      result[key] = {
        total,
        counts,
        positiveVal,
        positiveCount,
        percentPositive,
        belowThreshold: total < BADGE_MIN_THRESHOLD,
        displayLabel: DISPLAY_LABELS[key]?.positive || key,
        shortLabel: DISPLAY_LABELS[key]?.short || key
      };
    }
  }

  return result;
}

function safeJsonParse(val, fallback = []) {
  if (typeof val !== 'string') return val || fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

/**
 * Formats a product model instance from DB by parsing JSON fields safely
 */
function formatProduct(p, badgeAggregates = null) {
  if (!p) return null;
  return {
    ...p,
    images: safeJsonParse(p.images, []),
    sizes: safeJsonParse(p.sizes, []),
    aiTags: safeJsonParse(p.aiTags, []),
    applicableBadges: safeJsonParse(p.applicableBadges, []),
    badgeAggregates: badgeAggregates || undefined
  };
}

module.exports = {
  BADGE_MIN_THRESHOLD,
  POSITIVE_VALUES,
  NEGATIVE_VALUES,
  DISPLAY_LABELS,
  computeBadgeAggregates,
  formatProduct,
  safeJsonParse
};
