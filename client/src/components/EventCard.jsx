import { Link } from 'react-router-dom';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../categories';
import { NEIGHBORHOOD_MAP } from '../constants';
import './EventCard.css';

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function EventCard({ event, compact = false }) {
  const icon = CATEGORY_ICONS[event.category] || '✦';
  const label = CATEGORY_LABELS[event.category] || event.category;
  const spotsLeft = event.capacity ? event.capacity - (event.attendees?.length || 0) : null;

  return (
    <Link to={`/events/${event._id}`} className={`event-card card ${compact ? 'compact' : ''}`}>
      <div className="event-card-header">
        <div className="event-icon">{icon}</div>
        <span className={`badge cat-${event.category}`}>{label}</span>
      </div>
      <div className="event-card-body">
        <h3 className="event-title">{event.title}</h3>
        {!compact && (
          <p className="event-desc">{event.description}</p>
        )}
        <div className="event-meta">
          <span className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {formatDate(event.date)} · {formatTime(event.date)}
          </span>
          <span className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {event.location}
          </span>
          {event.neighborhood && NEIGHBORHOOD_MAP[event.neighborhood] && (
            <span className="meta-item neighborhood-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {NEIGHBORHOOD_MAP[event.neighborhood].short}
              {event.venueSubarea ? ` · ${event.venueSubarea}` : ''}
            </span>
          )}
        </div>
        <div className="event-footer">
          <span className="attendee-count">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 20c0-4 2.686-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M21 20c0-3.314-2-6-4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {event.attendees?.length || 0} going
          </span>
          <span className={`price-badge ${event.isFree !== false ? 'price-free' : 'price-paid'}`}>
            {event.isFree !== false
              ? 'Free'
              : event.ticketPrice != null
                ? `$${Number(event.ticketPrice).toFixed(2)}`
                : 'Paid'}
          </span>
          {spotsLeft !== null && (
            <span className={`spots ${spotsLeft <= 5 ? 'low' : ''}`}>
              {spotsLeft === 0 ? 'Full' : `${spotsLeft} spots left`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}