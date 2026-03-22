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
    label: 'Ward A — Downtown / Waterfront',
    short: 'Ward A',
    areas: 'Downtown, Exchange Place, Paulus Hook, Powerhouse Arts District, Waterfront',
  },
  {
    value: 'ward-b',
    label: 'Ward B — Journal Square / Bergen Hill',
    short: 'Ward B',
    areas: 'Journal Square, Bergen Hill, McGinley Square, parts of The Heights',
  },
  {
    value: 'ward-c',
    label: 'Ward C — Greenville / West Side',
    short: 'Ward C',
    areas: 'Greenville, West Side, Marion Section, parts of Bergen-Lafayette',
  },
  {
    value: 'ward-d',
    label: 'Ward D — The Heights / North End',
    short: 'Ward D',
    areas: 'The Heights, North End, Riverview-Fiskville',
  },
  {
    value: 'ward-e',
    label: 'Ward E — Bergen-Lafayette / Communipaw',
    short: 'Ward E',
    areas: 'Bergen-Lafayette, Communipaw, Jackson Hill, parts of Journal Square',
  },
  {
    value: 'ward-f',
    label: 'Ward F — Lincoln Park / Hackensack Riverfront',
    short: 'Ward F',
    areas: 'Lincoln Park, Hackensack Riverfront, portions of West Side',
  },
];

export const NEIGHBORHOOD_MAP = Object.fromEntries(
  NEIGHBORHOODS.map(n => [n.value, n])
);