import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Calendar',
    title: 'Every event, every month',
    body: 'Browse a full calendar grid or switch to a filterable list. Category dots mark what\'s happening at a glance.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    label: 'Map',
    title: 'Find events near you',
    body: 'An interactive dark-mode map plots every venue across the city with colour-coded pins by event type.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    label: 'Wards',
    title: 'All six wards covered',
    body: 'From Downtown Waterfront to The Heights — filter by ward to discover what\'s happening in your neighbourhood.',
  },
];

const CATEGORIES = [
  { label: 'Poetry & Literature', icon: '📖', color: '#5ECFCF' },
  { label: 'Visual Arts',         icon: '🎨', color: '#9B7FD4' },
  { label: 'Music & Performance', icon: '🎵', color: '#4EAF8C' },
  { label: 'Community & Culture', icon: '🌍', color: '#7EB8E8' },
  { label: 'Special / Experimental', icon: '✦', color: '#E05A7A' },
];

function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size:     Math.random() * 2.5 + 0.8,
      x:        Math.random() * 100,
      y:        Math.random() * 100,
      delay:    Math.random() * 10,
      duration: Math.random() * 12 + 14,
      opacity:  Math.random() * 0.35 + 0.08,
    }))
  , []);

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="lp-particle"
          style={{
            width:  p.size + 'px',
            height: p.size + 'px',
            left:   p.x + '%',
            top:    p.y + '%',
            opacity: p.opacity,
            animationDelay:    p.delay + 's',
            animationDuration: p.duration + 's',
          }}
        />
      ))}
    </>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="lp">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-bg" aria-hidden>
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
          <div className="lp-blob lp-blob-3" />
          <Particles />
          <div className="lp-grain" />
        </div>

        <div className="lp-hero-content">
          <span className="lp-eyebrow">Jersey City · Cultural Calendar</span>

          <h1 className="lp-title">
            <span className="lp-title-line">Where Art</span>
            <span className="lp-title-line lp-title-accent">Finds Its Map</span>
          </h1>

          <p className="lp-subtitle">
            Poetry readings, gallery openings, live music, and community gatherings —
            every event across all six wards, in one place.
          </p>

          <div className="lp-cta">
            <Link to="/events" className="btn btn-primary btn-lg lp-btn-primary">
              Explore Events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            {!user && <Link to="/auth" className="btn btn-ghost btn-lg">Sign in</Link>}
          </div>

          <div className="lp-categories">
            {CATEGORIES.map(c => (
              <span key={c.label} className="lp-cat-chip" style={{ '--chip-color': c.color }}>
                <span>{c.icon}</span> {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="lp-scroll-hint" aria-hidden>
          <span>Scroll</span>
          <div className="lp-scroll-line" />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="lp-features">
        <div className="lp-features-inner">
          <p className="lp-section-label">Built for discovery</p>
          <h2 className="lp-section-title">Everything you need to find your next event</h2>

          <div className="lp-feature-grid">
            {FEATURES.map((f, i) => (
              <div key={f.label} className="lp-feature-card" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="lp-feature-icon">{f.icon}</div>
                <span className="lp-feature-label">{f.label}</span>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WARDS STRIP ──────────────────────────────── */}
      <section className="lp-wards">
        <div className="lp-wards-inner">
          <p className="lp-section-label">Six neighbourhoods</p>
          <div className="lp-ward-chips">
            {[
              ['A', 'Greenville'],
              ['B', 'West Side'],
              ['C', 'Journal Square / Central'],
              ['D', 'The Heights'],
              ['E', 'Downtown / Waterfront'],
              ['F', 'Bergen-Lafayette'],
            ].map(([letter, name]) => (
              <div key={letter} className="lp-ward-chip">
                <span className="lp-ward-letter">Ward {letter}</span>
                <span className="lp-ward-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────── */}
      <section className="lp-footer-cta">
        <div className="lp-footer-cta-bg" aria-hidden>
          <div className="lp-blob lp-blob-ft1" />
          <div className="lp-blob lp-blob-ft2" />
        </div>
        <div className="lp-footer-cta-content">
          <h2 className="lp-footer-title">Ready to explore?</h2>
          <p className="lp-footer-sub">Join the community and never miss an event in Jersey City.</p>
          <div className="lp-cta" style={{ justifyContent: 'center' }}>
            <Link to="/events" className="btn btn-primary btn-lg lp-btn-primary">
              Browse Events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            {!user && <Link to="/auth" className="btn btn-ghost btn-lg">Create account</Link>}
          </div>
          <div className="lp-footer-links">
            <Link to="/about" className="lp-footer-link">About Muse Map</Link>
            <span className="lp-footer-dot">·</span>
            <a href="mailto:jcpofest@gmail.com" className="lp-footer-link">Contact Us</a>
            <span className="lp-footer-dot">·</span>
            <span className="lp-footer-dev">Developed by HudsonTech LLC</span>
          </div>
        </div>
      </section>

    </div>
  );
}