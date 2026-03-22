import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import './MyEventsPage.css';

export default function MyEventsPage() {
  const { authFetch, user } = useAuth();
  const [tab, setTab] = useState('organizing');
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mine, registered] = await Promise.all([
        authFetch('/api/events/user/my-events').then((r) => r.json()),
        authFetch('/api/events/user/registered').then((r) => r.json()),
      ]);
      setMyEvents(mine.events || []);
      setRegisteredEvents(registered.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await authFetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Could not open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const displayedEvents = tab === 'organizing' ? myEvents : registeredEvents;

  return (
    <main className="page">
      <div className="my-events-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>My Events</h1>
          <p>Events you're organizing or attending</p>
        </div>
        <div className="my-events-actions">
          <Link to="/create-event" className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Event
          </Link>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleManageBilling}
            disabled={portalLoading}
          >
            {portalLoading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === 'organizing' ? 'active' : ''}`}
          onClick={() => setTab('organizing')}
        >
          Organizing
          <span className="tab-count">{myEvents.length}</span>
        </button>
        <button
          className={`tab ${tab === 'attending' ? 'active' : ''}`}
          onClick={() => setTab('attending')}
        >
          Attending
          <span className="tab-count">{registeredEvents.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : displayedEvents.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h3>
            {tab === 'organizing'
              ? "You haven't created any events yet"
              : "You haven't registered for any events"}
          </h3>
          <p>
            {tab === 'organizing'
              ? 'Share something with the community'
              : 'Explore the calendar to find events'}
          </p>
          {tab === 'organizing' ? (
            <Link to="/create-event" className="btn btn-primary mt-2">Create your first event</Link>
          ) : (
            <Link to="/" className="btn btn-outline mt-2">Browse events</Link>
          )}
        </div>
      ) : (
        <div className="my-events-grid">
          {displayedEvents.map((ev) => (
            <div key={ev._id} className="my-event-item">
              <EventCard event={ev} />
              {tab === 'organizing' && (
                <div className="event-quick-actions">
                  <Link to={`/edit-event/${ev._id}`} className="btn btn-ghost btn-sm">Edit</Link>
                  <span className="attendee-stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 20c0-4 2.686-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {ev.attendees?.length || 0}
                    {ev.capacity ? ` / ${ev.capacity}` : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}