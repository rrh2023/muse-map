// ── Categories ────────────────────────────────────────────────
export const CATEGORIES = [
  { value: 'poetry',       label: 'Poetry & Literature' },
  { value: 'visual-arts',  label: 'Visual Arts' },
  { value: 'music',        label: 'Music & Performance' },
  { value: 'community',    label: 'Community & Culture' },
  { value: 'experimental', label: 'Special / Experimental' },
];

export const CATEGORY_COLORS = {
  'poetry':       '#5ECFCF',
  'visual-arts':  '#9B7FD4',
  'music':        '#4EAF8C',
  'community':    '#7EB8E8',
  'experimental': '#E05A7A',
};

export const CATEGORY_ICONS = {
  'poetry':       '📖',
  'visual-arts':  '🎨',
  'music':        '🎵',
  'community':    '🌍',
  'experimental': '✦',
};

// ── Neighborhoods / Wards ─────────────────────────────────────
export const NEIGHBORHOODS = [
  {
    value: 'ward-a',
    label: 'Ward A — Greenville',
    short: 'Ward A',
    areas: 'Greenville',
  },
  {
    value: 'ward-b',
    label: 'Ward B — West Side',
    short: 'Ward B',
    areas: 'West Side',
  },
  {
    value: 'ward-c',
    label: 'Ward C — Journal Square / Central',
    short: 'Ward C',
    areas: 'Journal Square, Central',
  },
  {
    value: 'ward-d',
    label: 'Ward D — The Heights',
    short: 'Ward D',
    areas: 'The Heights',
  },
  {
    value: 'ward-e',
    label: 'Ward E — Downtown / Waterfront',
    short: 'Ward E',
    areas: 'Downtown, Exchange Place, Paulus Hook, Powerhouse Arts District, Waterfront',
  },
  {
    value: 'ward-f',
    label: 'Ward F — Bergen-Lafayette',
    short: 'Ward F',
    areas: 'Bergen-Lafayette',
  },
];

export const NEIGHBORHOOD_MAP = Object.fromEntries(
  NEIGHBORHOODS.map(n => [n.value, n])
);