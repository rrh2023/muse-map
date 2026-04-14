// ── Categories ────────────────────────────────────────────────
export const CATEGORIES = [
  { value: 'performing-arts', label: 'Performing Arts' },
  { value: 'visual-arts',     label: 'Visual Arts' },
  { value: 'festivals',       label: 'Festivals & Fairs' },
  { value: 'community',       label: 'Community Celebrations' },
  { value: 'workshops',       label: 'Workshops & Education' },
  { value: 'film',            label: 'Film & Media' },
  { value: 'public-art',      label: 'Public Art & Tours' },
  { value: 'wellness',        label: 'Health & Wellness' },
];

export const CATEGORY_COLORS = {
  'performing-arts': '#E05A7A',
  'visual-arts':     '#9B7FD4',
  'festivals':       '#F2B138',
  'community':       '#7EB8E8',
  'workshops':       '#4EAF8C',
  'film':            '#5ECFCF',
  'public-art':      '#D97FB6',
  'wellness':        '#8FC06A',
};

export const CATEGORY_ICONS = {
  'performing-arts': '🎭',
  'visual-arts':     '🎨',
  'festivals':       '🎉',
  'community':       '🏳️',
  'workshops':       '🎓',
  'film':            '🎬',
  'public-art':      '👩🏼‍🎨',
  'wellness':        '🧘',
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