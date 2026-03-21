// Single source of truth for all Muse Map categories.
// Import this wherever categories are needed.

export const CATEGORIES = [
  { slug: 'poetry',       label: 'Poetry & Literature',      icon: '📖', color: '#7EB8E8' },
  { slug: 'visual-arts',  label: 'Visual Arts',              icon: '🎨', color: '#9B7FD4' },
  { slug: 'music',        label: 'Music & Performance',      icon: '🎵', color: '#5ECFCF' },
  { slug: 'community',    label: 'Community & Culture',      icon: '🌍', color: '#4EAF8C' },
  { slug: 'experimental', label: 'Special / Experimental',   icon: '✦',  color: '#E05A7A' },
];

// Slug array — useful for filter dropdowns
export const CATEGORY_SLUGS = CATEGORIES.map(c => c.slug);

// Lookup maps
export const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.color]));
export const CATEGORY_ICONS  = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.icon]));
export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.label]));

// Default category
export const DEFAULT_CATEGORY = 'poetry';
