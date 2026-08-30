// Badge Configuration — Single Source of Truth
// This file defines the complete badge taxonomy, states, colors, and category mappings.
// Used by: BadgeInput (Part A), BadgeAggregates (Part B), ReengagementCard (Part C), seed script.

export const BADGE_COLORS = {
  default: {
    border: '#D4D5D9',
    bg: '#F5F5F6',
    text: '#94969F',
    icon: '#94969F',
  },
  positive: {
    border: '#FF3F6C',
    bg: '#FFF0F3',
    text: '#FF3F6C',
    icon: '#FF3F6C',
    indicator: '#14958F', // green checkmark
  },
  negative: {
    border: '#6D1A36',
    bg: '#FEF0EF',
    text: '#D5284F',
    icon: '#6D1A36',
    indicator: '#D5284F', // red X
  },
  neutral: {
    // Only used by Photo Match "Slightly Different"
    border: '#F5A623',
    bg: '#FFF8E7',
    text: '#D4880F',
    icon: '#F5A623',
    indicator: '#F5A623', // amber dash
  },
};

// All 9 badge type definitions (v2: added fit)
export const BADGE_TYPES = {
  authenticity: {
    key: 'authenticity',
    label: 'Authenticity',
    dbField: 'badgeAuthenticity',
    icon: 'Shield',         // Lucide icon name
    states: [
      { value: null,           label: 'Not Sure Yet',              type: 'default'  },
      { value: 'feelsGenuine', label: 'Feels Genuine',             type: 'positive' },
      { value: 'feelsOff',     label: 'Feels Off / Lower Quality', type: 'negative' },
    ],
  },

  overallSatisfaction: {
    key: 'overallSatisfaction',
    label: 'Overall Satisfaction',
    dbField: 'badgeOverallSatisfaction',
    icon: 'Heart',
    states: [
      { value: null,           label: 'Not Sure Yet',   type: 'default'  },
      { value: 'satisfied',    label: 'Satisfied',      type: 'positive' },
      { value: 'notSatisfied', label: 'Not Satisfied',  type: 'negative' },
    ],
  },

  fit: {
    key: 'fit',
    label: 'Fit',
    dbField: 'badgeFit',
    icon: 'Ruler',
    states: [
      { value: null,              label: 'Not Sure Yet',              type: 'default'  },
      { value: 'fitsAsExpected',  label: 'Fits as Expected',          type: 'positive' },
      { value: 'doesntFit',      label: "Doesn't Fit as Expected",   type: 'negative' },
    ],
  },

  photoMatch: {
    key: 'photoMatch',
    label: 'Photo Match',
    dbField: 'badgePhotoMatch',
    icon: 'Camera',
    states: [
      { value: null,            label: 'Not Sure Yet',      type: 'default'  },
      { value: 'matches',       label: 'Matches Photos',    type: 'positive' },
      { value: 'slightlyDiff',  label: 'Slightly Different', type: 'neutral'  },
      { value: 'veryDiff',      label: 'Very Different',     type: 'negative' },
    ],
  },

  fabricFeel: {
    key: 'fabricFeel',
    label: 'Fabric Feel',
    dbField: 'badgeFabricFeel',
    icon: 'Layers',       // represents fabric/layers
    states: [
      { value: null,              label: 'Not Sure Yet',                  type: 'default'  },
      { value: 'asDescribed',     label: 'Feels As Described',            type: 'positive' },
      { value: 'thinnerRougher',  label: 'Thinner / Rougher Than Expected', type: 'negative' },
    ],
  },

  comfortFeel: {
    key: 'comfortFeel',
    label: 'Comfort / Sole Feel',
    dbField: 'badgeComfortFeel',
    icon: 'Footprints',
    states: [
      { value: null,                 label: 'Not Sure Yet',          type: 'default'  },
      { value: 'comfortable',       label: 'Comfortable',           type: 'positive' },
      { value: 'stiffUncomfortable', label: 'Stiff / Uncomfortable', type: 'negative' },
    ],
  },

  materialFeel: {
    key: 'materialFeel',
    label: 'Material Feel',
    dbField: 'badgeMaterialFeel',
    icon: 'ShoppingBag',
    states: [
      { value: null,            label: 'Not Sure Yet',            type: 'default'  },
      { value: 'sturdyPremium', label: 'Feels Sturdy / Premium',  type: 'positive' },
      { value: 'flimsy',       label: 'Feels Flimsy',             type: 'negative' },
    ],
  },

  finishDurability: {
    key: 'finishDurability',
    label: 'Finish Durability',
    dbField: 'badgeFinishDurability',
    icon: 'Gem',
    states: [
      { value: null,              label: 'Not Sure Yet',              type: 'default'  },
      { value: 'holdsShinColor',  label: 'Holds Shine / Color',       type: 'positive' },
      { value: 'tarnishedFaded',  label: 'Tarnished / Faded Quickly', type: 'negative' },
    ],
  },

  shadeMatch: {
    key: 'shadeMatch',
    label: 'Shade / Result Match',
    dbField: 'badgeShadeMatch',
    icon: 'Palette',
    states: [
      { value: null,             label: 'Not Sure Yet',         type: 'default'  },
      { value: 'matchesShade',   label: 'Matches Shown Shade',  type: 'positive' },
      { value: 'differentShade', label: 'Different Than Shown',  type: 'negative' },
    ],
  },
};

// Category → applicable badge keys (v2 taxonomy)
// Order matters: this is the display order in the review modal
// v2 change: Clothing & Footwear get Fit badge, lose Overall Satisfaction
export const CATEGORY_BADGES = {
  clothing:   ['authenticity', 'photoMatch', 'fit', 'fabricFeel'],
  footwear:   ['authenticity', 'photoMatch', 'fit', 'comfortFeel'],
  bags:       ['authenticity', 'photoMatch', 'overallSatisfaction', 'materialFeel'],
  jewelry:    ['authenticity', 'photoMatch', 'overallSatisfaction', 'finishDurability'],
  makeup:     ['authenticity', 'overallSatisfaction', 'shadeMatch'],
  skincare:   ['authenticity', 'overallSatisfaction'],
  haircare:   ['authenticity', 'overallSatisfaction'],
  fragrance:  ['authenticity', 'overallSatisfaction'],
  appliances: ['authenticity', 'overallSatisfaction'],
};

// Minimum number of badge submissions before showing percentage
// Below this, show "X reviewers so far" instead
// v2 change: raised from 5 to 50 to protect against small-sample misrepresentation
export const BADGE_MIN_THRESHOLD = 50;

// Helper: get badge config for a category
export function getBadgesForCategory(category) {
  const keys = CATEGORY_BADGES[category] || ['authenticity', 'overallSatisfaction'];
  return keys.map(key => BADGE_TYPES[key]);
}

// Helper: get the positive state value for a badge type
export function getPositiveValue(badgeKey) {
  const badge = BADGE_TYPES[badgeKey];
  if (!badge) return null;
  const positive = badge.states.find(s => s.type === 'positive');
  return positive ? positive.value : null;
}

// Helper: get all negative values for a badge type (for "Disagree Only" filter)
export function getNegativeValues(badgeKey) {
  const badge = BADGE_TYPES[badgeKey];
  if (!badge) return [];
  return badge.states
    .filter(s => s.type === 'negative' || s.type === 'neutral')
    .map(s => s.value);
}

// Helper: get display label for a badge value
export function getBadgeLabel(badgeKey, value) {
  const badge = BADGE_TYPES[badgeKey];
  if (!badge || !value) return null;
  const state = badge.states.find(s => s.value === value);
  return state ? state.label : null;
}

// Helper: get state type (positive/negative/neutral) for a badge value
export function getBadgeStateType(badgeKey, value) {
  const badge = BADGE_TYPES[badgeKey];
  if (!badge || !value) return 'default';
  const state = badge.states.find(s => s.value === value);
  return state ? state.type : 'default';
}

// Aggregate display config for Part B cards
export const AGGREGATE_DISPLAY = {
  authenticity:        { icon: 'Shield',      positiveLabel: 'Feels Genuine',       shortLabel: 'Genuine'     },
  photoMatch:          { icon: 'Camera',      positiveLabel: 'Matches Photos',      shortLabel: 'Photo Match' },
  fit:                 { icon: 'Ruler',       positiveLabel: 'Fits as Expected',    shortLabel: 'Fit'         },
  fabricFeel:          { icon: 'Layers',      positiveLabel: 'Fabric As Described', shortLabel: 'Fabric'      },
  comfortFeel:         { icon: 'Footprints',  positiveLabel: 'Comfortable',         shortLabel: 'Comfort'     },
  materialFeel:        { icon: 'ShoppingBag', positiveLabel: 'Sturdy / Premium',    shortLabel: 'Material'    },
  finishDurability:    { icon: 'Gem',         positiveLabel: 'Holds Shine',         shortLabel: 'Finish'      },
  shadeMatch:          { icon: 'Palette',     positiveLabel: 'Matches Shade',       shortLabel: 'Shade'       },
  overallSatisfaction: { icon: 'Heart',       positiveLabel: 'Satisfied',           shortLabel: 'Satisfied'   },
};
