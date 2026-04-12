import { Link } from 'react-router-dom';
import './SiteFooter.css';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-left">
          <span className="site-footer-brand">Muse Map</span>
          <span className="site-footer-sep">·</span>
          <span className="site-footer-tagline">Jersey City Cultural Calendar</span>
        </div>

        <div className="site-footer-links">
          <Link to="/about" className="site-footer-link">About</Link>
          <a href="mailto:jcpofest@gmail.com" className="site-footer-link">Contact</a>
        </div>

        <div className="site-footer-right">
          <span className="site-footer-credit">
            Developed by{' '}
            <span className="site-footer-hudsontech">HudsonTech LLC</span>
          </span>
        </div>
      </div>
    </footer>
  );
}