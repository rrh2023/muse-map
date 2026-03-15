import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './EventDetailPage.css';
import API_BASE from '../config';

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function EventDetailPage() {
  const { id } = useParams();
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/events/${id}`);
      if (!res.ok) { navigate('/'); return; }
      const data = await res.json();
      setEvent(data.event);
    } catch { navigate('/'); }
    finally { setLoading(false); }
  };

  const isOrganizer = user && event?.organizer?._id === user.id;
  const isRegistered = user && event?.attendees?.some((a) => a.user?._id === user.id || a.user === user.id);
  const isFull = event?.capacity && event?.attendees?.length >= event?.capacity;

  const handleRegister = async () => {
    if (!user) { navigate('/auth'); return; }
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await authFetch(`/api/events/${id}/register`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Successfully registered!' });
        fetchEvent();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch { setMessage({ type: 'error', text: 'Something went wrong' }); }
    finally { setActionLoading(false); }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await authFetch(`/api/events/${id}/register`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Registration cancelled' });
        fetchEvent();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch { setMessage({ type: 'error', text: 'Something went wrong' }); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      const res = await authFetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) navigate('/my-events');
    } catch { alert('Failed to delete event'); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!event) return null;

  const spotsLeft = event.capacity ? event.capacity - event.attendees.length : null;

  return (
    <main className="page">
      <Link to="/" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Back to events
      </Link>

      <div className="event-detail-layout">
        <div className="event-detail-main">
          <div className="event-detail-header">
            <div className="flex items-center gap-1" style={{ marginBottom: '0.75rem' }}>
              <span className={`badge cat-${event.category}`}>{event.category}</span>
              {isFull && <span className="badge" style={{ background: 'rgba(224,90,90,0.15)', color: '#f07a7a' }}>Full</span>}
            </div>
            <h1 className="event-detail-title">{event.title}</h1>
            <p className="event-organized-by">
              Organized by <strong>{event.organizer?.name}</strong>
            </p>
          </div>

          <div className="event-detail-meta-grid">
            <div className="meta-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="meta-label">Date & Time</div>
                <div className="meta-value">{formatDateTime(event.date)}</div>
                {event.endDate && (
                  <div className="meta-sub">Ends {formatDateTime(event.endDate)}</div>
                )}
              </div>
            </div>
            <div className="meta-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <div>
                <div className="meta-label">Location</div>
                <div className="meta-value">{event.location}</div>
              </div>
            </div>
            <div className="meta-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 20c0-4 2.686-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 20c0-3.314-2-6-4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="meta-label">Attendees</div>
                <div className="meta-value">{event.attendees.length} registered</div>
                {event.capacity && (
                  <div className="meta-sub">Capacity: {event.capacity} · {spotsLeft} left</div>
                )}
              </div>
            </div>
          </div>

          <div className="event-description">
            <h2>About this event</h2>
            <p>{event.description}</p>
          </div>

          {event.attendees.length > 0 && (
            <div className="attendees-section">
              <h2>Attendees</h2>
              <div className="attendees-list">
                {event.attendees.map((a, i) => (
                  <div key={i} className="attendee-chip">
                    <div className="attendee-avatar">
                      {(a.user?.name || 'U')[0].toUpperCase()}
                    </div>
                    <span>{a.user?.name || 'Unknown'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action sidebar */}
        <div className="event-action-sidebar">
          {message && (
            <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
              {message.text}
            </div>
          )}

          {isOrganizer ? (
            <div className="organizer-actions">
              <div className="organizer-badge">You're organizing this event</div>
              <Link to={`/edit-event/${id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                Edit Event
              </Link>
              <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={handleDelete}>
                Delete Event
              </button>
            </div>
          ) : (
            <>
              {isRegistered ? (
                <>
                  <div className="registered-badge">✓ You're going!</div>
                  <button
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={handleCancel}
                    disabled={actionLoading}
                  >
                    Cancel registration
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleRegister}
                  disabled={actionLoading || isFull}
                >
                  {isFull ? 'Event is full' : actionLoading ? 'Registering...' : user ? 'Register for event' : 'Sign in to register'}
                </button>
              )}
            </>
          )}

          {event.capacity && (
            <div className="capacity-bar">
              <div className="capacity-bar-header">
                <span>{event.attendees.length} / {event.capacity} spots filled</span>
                <span>{Math.round((event.attendees.length / event.capacity) * 100)}%</span>
              </div>
              <div className="capacity-track">
                <div
                  className="capacity-fill"
                  style={{ width: `${Math.min(100, (event.attendees.length / event.capacity) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
