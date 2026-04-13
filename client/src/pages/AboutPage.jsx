import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="page about-page">

      {/* ── Header ───────────────────────────────────── */}
      <div className="about-header">
        <span className="about-eyebrow">Jersey City · Cultural Calendar</span>
        <h1 className="about-title">About Muse Map</h1>
        <div className="about-rule" />
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="about-body">
        <section className="about-section">
          <p className="about-lead">
            Muse Map gathers poetry readings, art exhibitions, music performances,
            community gatherings, and experimental cultural events into one shared space.
          </p>
          <p>
            More than a schedule, Muse Map is a living atlas of inspiration. It charts
            where artists, writers, musicians, and cultural organizers bring their work
            into the public sphere — libraries, galleries, cafés, studios, parks, and
            unexpected corners of the city.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">A City of Crossings</h2>
          <p>
            Jersey City is widely recognized as one of the most diverse cities in the
            United States, home to communities and cultures from across the world. As
            the second-most populous city in New Jersey, it sits directly across the
            river from New York City, making it both a crossroads and a gateway for
            artistic exchange.
          </p>
          <p>
            For generations, people arriving through Ellis Island and passing the Statue
            of Liberty first encountered this waterfront landscape. Jersey City's historic
            rail terminals, ferry routes, and immigration history made it a place where
            travelers, workers, and dreamers continually arrived and reshaped the cultural
            life of the region. Today its trains, ferries, and transit lines still connect
            it closely with New York while nurturing its own vibrant cultural identity.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">A Living Atlas</h2>
          <p>
            Muse Map reflects this layered history. A poetry reading might lead to a
            gallery opening; a jazz performance might connect to a community workshop;
            a small pop-up might spark a new collaboration between artists from different
            traditions.
          </p>
          <p>
            By weaving together voices across disciplines, Muse Map helps residents and
            visitors discover the creative landscape of Jersey City in real time.
          </p>
        </section>

        {/* ── Creator ────────────────────────────────── */}
        <section className="about-section about-creator">
          <div className="about-creator-card">
            <span className="about-creator-label">Created by</span>
            <h2 className="about-creator-name">The Poet Laureate of Jersey City, Melida Rodas</h2>
            <p className="about-creator-bio">
              Muse Map was conceived and created by the Melida as an initiative to make the city's rich, diverse cultural life visible and
              accessible to all who live, work, and create here.
            </p>
            <a
              href="mailto:jcpofest@gmail.com"
              className="btn btn-primary btn-sm about-contact-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Contact Us
            </a>
          </div>
        </section>

        {/* ── Back link ──────────────────────────────── */}
        <div className="about-back">
          <Link to="/events" className="btn btn-ghost btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Browse events
          </Link>
          <Link to="/" className="btn btn-ghost btn-sm">Home</Link>
        </div>
      </div>

    </main>
  );
}