// Single source of truth for all Muse Map categories.
// Import this wherever categories are needed.

export const CATEGORIES = [
  { slug: 'performing-arts', label: 'Performing Arts',        icon: '🎭',   color: '#E05A7A', description: 'Theater, Dance, Music' },
  { slug: 'visual-arts',     label: 'Visual Arts',             icon: '🎨',   color: '#9B7FD4', description: 'Exhibitions, Galleries, Murals' },
  { slug: 'festivals',       label: 'Festivals & Fairs',       icon: '🎉',   color: '#F2B138', description: 'Street Fairs, Cultural Festivals' },
  { slug: 'community',       label: 'Community Celebrations',  icon: '🏳️',   color: '#7EB8E8', description: 'Flag Raisings, Commemorations' },
  { slug: 'workshops',       label: 'Workshops & Education',   icon: '🎓',   color: '#4EAF8C', description: 'Classes, Seminars, Masterclasses' },
  { slug: 'film',            label: 'Film & Media',            icon: '🎬',   color: '#5ECFCF', description: 'Screenings, Documentaries' },
  { slug: 'public-art',      label: 'Public Art & Tours',      icon: '👩🏼‍🎨', color: '#D97FB6', description: 'Walking Tours, Art Installs' },
  { slug: 'wellness',        label: 'Health & Wellness',       icon: '🧘',   color: '#8FC06A', description: 'Fitness, Yoga, Wellness Initiatives' },
  { slug: 'kid-friendly',    label: 'Kid Friendly',            icon: '🪁',   color: '#FF9F68', description: 'Family-friendly events for all ages' },
  { slug: 'parks',           label: 'Parks Event',             icon: '🍃',   color: '#6FBF73', description: 'Outdoor events in local parks' },
];

// Slug array — useful for filter dropdowns
export const CATEGORY_SLUGS = CATEGORIES.map(c => c.slug);

// Lookup maps
export const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.color]));
export const CATEGORY_ICONS  = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.icon]));
export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.label]));

// Default category
export const DEFAULT_CATEGORY = 'community';
