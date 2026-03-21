import { useState, useEffect, useCallback } from 'react';
import EventCard from '../components/EventCard';
import './CalendarPage.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];
const CATEGORIES = ['all', 'poetry', 'visual-arts', 'music', 'community', 'experimental'];

const CATEGORY_LABELS = {
  'all':          'All Categories',
  'poetry':       'Poetry & Literature',
  'visual-arts':  'Visual Arts',
  'music':        'Music & Performance',
  'community':    'Community & Culture',
  'experimental': 'Special / Experimental',
};

const CATEGORY_COLORS = {
  'poetry':       '#5ECFCF',
  'visual-arts':  '#9B7FD4',
  'music':        '#4EAF8C',
  'community':    '#7EB8E8',
  'experimental': '#E05A7A',
};

export default function CalendarPage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [view, setView] = useState('calendar'); // 'calendar' | 'list'

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month: month + 1, year, category });
      const res = await fetch(`/api/events?${params}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [month, year, category]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = {};
  events.forEach((ev) => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push(ev);
    }
  });

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const allListEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <main className="page">
      <div className="calendar-page-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Events</h1>
          <p>Discover what's happening near you</p>
        </div>
        <div className="calendar-controls">
          <div className="view-toggle">
            <button className={`btn btn-ghost btn-sm ${view === 'calendar' ? 'active-view' : ''}`} onClick={() => setView('calendar')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Calendar
            </button>
            <button className={`btn btn-ghost btn-sm ${view === 'list' ? 'active-view' : ''}`} onClick={() => setView('list')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              List
            </button>
          </div>
          <select className="category-filter" value={category} onChange={(e) => { setCategory(e.target.value); setSelectedDate(null); }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="calendar-layout">
          <div className="calendar-main">
            {/* Month navigation */}
            <div className="month-nav">
              <button className="btn btn-ghost btn-sm" onClick={prevMonth}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <h2 className="month-title">{MONTHS[month]} {year}</h2>
              <button className="btn btn-ghost btn-sm" onClick={nextMonth}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="cal-grid">
              {DAYS.map((d) => <div key={d} className="cal-day-header">{d}</div>)}
              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="cal-cell empty" />)}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = eventsByDate[day] || [];
                return (
                  <div
                    key={day}
                    className={`cal-cell ${isToday(day) ? 'today' : ''} ${selectedDate === day ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                    onClick={() => setSelectedDate(selectedDate === day ? null : day)}
                  >
                    <span className="cal-day-num">{day}</span>
                    <div className="cal-dots">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span key={ev._id} className="cal-dot" style={{ background: CATEGORY_COLORS[ev.category] || '#888' }} title={ev.title} />
                      ))}
                      {dayEvents.length > 3 && <span className="cal-more">+{dayEvents.length - 3}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <div className="calendar-sidebar">
            {selectedDate ? (
              <>
                <h3 className="sidebar-title">
                  {MONTHS[month]} {selectedDate}
                  <span className="sidebar-count">{selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}</span>
                </h3>
                {selectedEvents.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                    <p style={{ fontSize: '0.9rem' }}>No events on this day</p>
                  </div>
                ) : (
                  <div className="sidebar-events">
                    {selectedEvents.map((ev) => <EventCard key={ev._id} event={ev} compact />)}
                  </div>
                )}
              </>
            ) : (
              <div className="sidebar-upcoming">
                <h3 className="sidebar-title">Upcoming <span className="sidebar-count">{events.length}</span></h3>
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <div className="spinner" />
                  </div>
                ) : events.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                    <p style={{ fontSize: '0.9rem' }}>No events this month</p>
                  </div>
                ) : (
                  <div className="sidebar-events">
                    {events.slice(0, 8).map((ev) => <EventCard key={ev._id} event={ev} compact />)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // List view
        <div className="list-view">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : allListEvents.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <h3>No events found</h3>
              <p>Try changing the category filter or month</p>
            </div>
          ) : (
            <div className="events-grid">
              {allListEvents.map((ev) => <EventCard key={ev._id} event={ev} />)}
            </div>
          )}
        </div>
      )}
    </main>
  );
}