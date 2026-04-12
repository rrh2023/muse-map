import { useState } from 'react';
import { NEIGHBORHOODS } from '../constants';
import './FilterBar.css';

const DATE_OPTIONS = [
  { value: 'all',       label: 'Any date' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'this-week', label: 'This week' },
  { value: 'weekend',   label: 'Weekend' },
];

const TYPE_OPTIONS = [
  { value: 'all',          label: 'All',         icon: null },
  { value: 'poetry',       label: 'Poetry',       icon: '📖' },
  { value: 'visual-arts',  label: 'Visual Arts',  icon: '🎨' },
  { value: 'music',        label: 'Music',        icon: '🎵' },
  { value: 'community',    label: 'Community',    icon: '🌍' },
  { value: 'experimental', label: 'Experimental', icon: '✦' },
];

const PRICE_OPTIONS = [
  { value: 'all',  label: 'Any price' },
  { value: 'free', label: '🎟 Free' },
  { value: 'paid', label: '💳 Paid' },
];

export default function FilterBar({ filters, onChange, onClear, resultCount }) {
  const [open, setOpen] = useState(false);

  const activeCount = [
    filters.dateRange    !== 'all',
    filters.category     !== 'all',
    filters.neighborhood !== 'all',
    filters.price        !== 'all',
  ].filter(Boolean).length;

  const filterGroups = (
    <div className="filter-bar-inner">

      {/* Date */}
      <div className="filter-group">
        <span className="filter-label">Date</span>
        <div className="filter-pills">
          {DATE_OPTIONS.map(o => (
            <button
              key={o.value}
              className={`filter-pill ${filters.dateRange === o.value ? 'active' : ''}`}
              onClick={() => onChange('dateRange', o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      {/* Type */}
      <div className="filter-group">
        <span className="filter-label">Type</span>
        <div className="filter-pills">
          {TYPE_OPTIONS.map(o => (
            <button
              key={o.value}
              className={`filter-pill ${filters.category === o.value ? 'active' : ''}`}
              onClick={() => onChange('category', o.value)}
            >
              {o.icon && <span className="pill-icon">{o.icon}</span>}
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      {/* Neighborhood */}
      <div className="filter-group">
        <span className="filter-label">Neighborhood</span>
        <select
          className="filter-select"
          value={filters.neighborhood}
          onChange={e => onChange('neighborhood', e.target.value)}
        >
          <option value="all">All wards</option>
          {NEIGHBORHOODS.map(n => (
            <option key={n.value} value={n.value}>
              {n.short} — {n.label.split('—')[1]?.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-divider" />

      {/* Price */}
      <div className="filter-group">
        <span className="filter-label">Price</span>
        <div className="filter-pills">
          {PRICE_OPTIONS.map(o => (
            <button
              key={o.value}
              className={`filter-pill ${filters.price === o.value ? 'active' : ''}`}
              onClick={() => onChange('price', o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div className="filter-bar">

      {/* ── Mobile toggle row ──────────────────────── */}
      <div className="filter-mobile-header">
        <button
          className={`filter-toggle-btn ${activeCount > 0 ? 'has-active' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="filter-active-badge">{activeCount}</span>
          )}
          <svg
            className={`filter-chevron ${open ? 'open' : ''}`}
            width="13" height="13" viewBox="0 0 24 24" fill="none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="filter-mobile-meta">
          {resultCount !== undefined && (
            <span className="filter-result-count">{resultCount} event{resultCount !== 1 ? 's' : ''}</span>
          )}
          {activeCount > 0 && (
            <button className="filter-clear-btn" onClick={onClear}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop: always visible ────────────────── */}
      <div className="filter-desktop-body">
        {filterGroups}
        <div className="filter-meta">
          {resultCount !== undefined && (
            <span className="filter-result-count">{resultCount} event{resultCount !== 1 ? 's' : ''}</span>
          )}
          {activeCount > 0 && (
            <button className="filter-clear-btn" onClick={onClear}>
              ✕ Clear {activeCount} filter{activeCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile: collapsible panel ──────────────── */}
      <div className={`filter-mobile-body ${open ? 'open' : ''}`}>
        {filterGroups}
        {activeCount > 0 && (
          <button className="filter-clear-full" onClick={() => { onClear(); setOpen(false); }}>
            Clear all filters
          </button>
        )}
      </div>

    </div>
  );
}

// ── Utility ───────────────────────────────────────────────────────────────
export function applyClientFilters(events, filters) {
  let out = events;
  const now = new Date();

  if (filters.dateRange === 'upcoming') {
    out = out.filter(e => new Date(e.date) >= now);
  } else if (filters.dateRange === 'this-week') {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    out = out.filter(e => { const d = new Date(e.date); return d >= now && d <= weekEnd; });
  } else if (filters.dateRange === 'weekend') {
    out = out.filter(e => { const day = new Date(e.date).getDay(); return day === 0 || day === 6; });
  }

  if (filters.price === 'free') {
    out = out.filter(e => e.isFree !== false);
  } else if (filters.price === 'paid') {
    out = out.filter(e => e.isFree === false);
  }

  return out;
}