// Frontend Badge Configuration & Single Source of Truth (v2)
export const BADGE_COLORS = {
  default: {
    border: '#D4D5D9',
    bg: '#F5F5F6',
    text: '#535766',
    iconColor: '#94969F',
    indicator: '#B4B6BE'
  },
  positive: {
    border: '#FF3F6C',
    bg: '#FFF0F3',
    text: '#FF3F6C',
    iconColor: '#FF3F6C',
    indicator: '#14958F' // green checkmark
  },
  negative: {
    border: '#6D1A36',
    bg: '#FEF0EF',
    text: '#D5284F',
    iconColor: '#6D1A36',
    indicator: '#D5284F' // red X
  },
  neutral: {
    border: '#F5A623',
    bg: '#FFF8E7',
    text: '#D4880F',
    iconColor: '#F5A623',
    indicator: '#F5A623' // amber dash
  }
};

export const BADGE_TYPES = {
  authenticity: {
    key: 'authenticity',
    label: 'Authenticity',
    question: 'How genuine does this product feel in person?',
    dbField: 'badgeAuthenticity',
    icon: 'ShieldCheck',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'feelsGenuine', label: '✓ 100% Genuine & Authentic', type: 'positive' },
      { value: 'feelsOff', label: '✕ Feels Off / Lower Quality', type: 'negative' }
    ]
  },

  overallSatisfaction: {
    key: 'overallSatisfaction',
    label: 'Overall Satisfaction',
    question: 'How satisfied are you with this purchase?',
    dbField: 'badgeOverallSatisfaction',
    icon: 'Heart',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'satisfied', label: '✓ Completely Satisfied', type: 'positive' },
      { value: 'notSatisfied', label: '✕ Not Satisfied', type: 'negative' }
    ]
  },

  fit: {
    key: 'fit',
    label: 'Fit & Sizing',
    question: 'How is the sizing and fit on you?',
    dbField: 'badgeFit',
    icon: 'Ruler',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'fitsAsExpected', label: '✓ True to Size / Perfect Fit', type: 'positive' },
      { value: 'doesntFit', label: '✕ Sizing Runs Tight / Loose', type: 'negative' }
    ]
  },

  photoMatch: {
    key: 'photoMatch',
    label: 'Catalog Photo Accuracy',
    question: 'Does the product match the app photos and color?',
    dbField: 'badgePhotoMatch',
    icon: 'Camera',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'matches', label: '✓ Exact Match to Photos', type: 'positive' },
      { value: 'slightlyDiff', label: '~ Slight Color / Shade Diff', type: 'neutral' },
      { value: 'veryDiff', label: '✕ Very Different from Photos', type: 'negative' }
    ]
  },

  fabricFeel: {
    key: 'fabricFeel',
    label: 'Fabric & Material Texture',
    question: 'How is the fabric feel and thickness?',
    dbField: 'badgeFabricFeel',
    icon: 'Layers',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'asDescribed', label: '✓ Feels as Described & Premium', type: 'positive' },
      { value: 'thinnerRougher', label: '✕ Thinner / Rougher Material', type: 'negative' }
    ]
  },

  comfortFeel: {
    key: 'comfortFeel',
    label: 'Comfort & Insole Cushion',
    question: 'How comfortable is it for all-day wear?',
    dbField: 'badgeComfortFeel',
    icon: 'Footprints',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'comfortable', label: '✓ Highly Comfortable & Soft', type: 'positive' },
      { value: 'stiffUncomfortable', label: '✕ Stiff / Uncomfortable', type: 'negative' }
    ]
  },

  materialFeel: {
    key: 'materialFeel',
    label: 'Material Sturdiness',
    question: 'How is the craftsmanship and build quality?',
    dbField: 'badgeMaterialFeel',
    icon: 'ShoppingBag',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'sturdyPremium', label: '✓ Sturdy & High-End Finish', type: 'positive' },
      { value: 'flimsy', label: '✕ Flimsy / Cheap Feel', type: 'negative' }
    ]
  },

  finishDurability: {
    key: 'finishDurability',
    label: 'Finish & Color Durability',
    question: 'Does the finish and color hold up well?',
    dbField: 'badgeFinishDurability',
    icon: 'Gem',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'holdsShinColor', label: '✓ Holds Shine / Color Intact', type: 'positive' },
      { value: 'tarnishedFaded', label: '✕ Tarnished / Faded Easily', type: 'negative' }
    ]
  },

  shadeMatch: {
    key: 'shadeMatch',
    label: 'Shade / Swatch Accuracy',
    question: 'Does the applied shade match the swatch?',
    dbField: 'badgeShadeMatch',
    icon: 'Palette',
    states: [
      { value: null, label: 'Not sure yet', type: 'default' },
      { value: 'matchesShade', label: '✓ Exact Shade Match', type: 'positive' },
      { value: 'differentShade', label: '✕ Different Than Shown', type: 'negative' }
    ]
  }
};

// v2 taxonomy: Clothing & Footwear get Fit badge, lose Overall Satisfaction
export const CATEGORY_BADGES = {
  clothing: ['authenticity', 'photoMatch', 'fit', 'fabricFeel'],
  footwear: ['authenticity', 'photoMatch', 'fit', 'comfortFeel'],
  bags: ['authenticity', 'photoMatch', 'overallSatisfaction', 'materialFeel'],
  jewelry: ['authenticity', 'photoMatch', 'overallSatisfaction', 'finishDurability'],
  makeup: ['authenticity', 'overallSatisfaction', 'shadeMatch'],
  skincare: ['authenticity', 'overallSatisfaction'],
  haircare: ['authenticity', 'overallSatisfaction'],
  fragrance: ['authenticity', 'overallSatisfaction'],
  appliances: ['authenticity', 'overallSatisfaction']
};

export function getBadgesForCategory(category) {
  const keys = CATEGORY_BADGES[category?.toLowerCase()] || ['authenticity', 'overallSatisfaction'];
  return keys.map((key) => BADGE_TYPES[key]).filter(Boolean);
}

export function formatPrice(num) {
  if (num == null) return '';
  return `₹${Number(num).toLocaleString('en-IN')}`;
}
