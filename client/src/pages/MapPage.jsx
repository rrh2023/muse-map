import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API_BASE from '../config';
import './MapPage.css';

const CATEGORY_COLORS = {
  'poetry':       '#5ECFCF',
  'visual-arts':  '#9B7FD4',
  'music':        '#4EAF8C',
  'community':    '#7EB8E8',
  'experimental': '#E05A7A',
};

const CATEGORY_LABELS = {
  'poetry':       'Poetry & Literature',
  'visual-arts':  'Visual Arts',
  'music':        'Music & Performance',
  'community':    'Community & Culture',
  'experimental': 'Special / Experimental',
};

const CATEGORIES = ['all', 'poetry', 'visual-arts', 'music', 'community', 'experimental'];

const geocodeCache = {};

async function geocode(locationStr) {
  if (geocodeCache[locationStr]) return geocodeCache[locationStr];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationStr)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache[locationStr] = result;
      return result;
    }
  } catch { /* silent */ }
  return null;
}

function createPinSvg(color) {
  const id = color.replace('#', '');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="34" viewBox="0 0 26 34">
    <defs>
      <filter id="g${id}">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path filter="url(#g${id})" fill="${color}" stroke="rgba(0,0,0,0.5)" stroke-width="1"
      d="M13 1C6.925 1 2 5.925 2 12c0 7.5 11 21 11 21S24 19.5 24 12C24 5.925 19.075 1 13 1z"/>
    <circle cx="13" cy="12" r="4.5" fill="rgba(0,0,0,0.35)"/>
  </svg>`;
}

export default function MapPage() {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [category, setCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [failedCount, setFailedCount] = useState(0);

  // Init map once on mount
  useEffect(() => {
    if (leafletMap.current || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [40.7178, -74.0431], // Jersey City
      zoom: 13,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Fetch events when category changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ category });
        const res = await fetch(`${API_BASE}/api/events?${params}`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [category]);

  // Geocode and place pins when events change
  useEffect(() => {
    if (!leafletMap.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    setFailedCount(0);

    if (!events.length) return;

    const placeMarkers = async () => {
      setGeocoding(true);
      let failed = 0;

      for (const event of events) {
        const coords = await geocode(event.location);
        if (!coords) { failed++; continue; }

        const color = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other;

        const icon = L.divIcon({
          html: createPinSvg(color),
          className: 'map-pin-icon',
          iconSize: [26, 34],
          iconAnchor: [13, 34],
          popupAnchor: [0, -36],
        });

        const date = new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric',
        });

        const marker = L.marker([coords.lat, coords.lng], { icon })
          .addTo(leafletMap.current)
          .bindPopup(`
            <div class="map-popup">
              <span class="map-popup-cat">${event.category}</span>
              <div class="map-popup-title">${event.title}</div>
              <div class="map-popup-date">${date}</div>
              <div class="map-popup-loc">📍 ${event.location}</div>
              <a href="/events/${event._id}" class="map-popup-link">View Event →</a>
            </div>
          `, { maxWidth: 240, className: 'map-popup-wrapper' });

        marker.on('click', () => setSelectedEvent(event));
        markersRef.current.push(marker);

        // Nominatim rate limit: 1 req/sec
        await new Promise(r => setTimeout(r, 1100));
      }

      setFailedCount(failed);
      setGeocoding(false);
    };

    placeMarkers();
  }, [events]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });

  return (
    <div className="map-page">
      <div className="map-controls">
        <div className="map-controls-left">
          <h1 className="map-heading">Event Map</h1>
          {geocoding && (
            <span className="map-status">
              <span className="map-pulse" />
              Locating events…
            </span>
          )}
          {!geocoding && failedCount > 0 && (
            <span className="map-status map-status--warn">
              {failedCount} location{failedCount > 1 ? 's' : ''} not found
            </span>
          )}
        </div>
        <div className="map-controls-right">
          <select
            className="category-filter"
            value={category}
            onChange={e => { setCategory(e.target.value); setSelectedEvent(null); }}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : (CATEGORY_LABELS[c] || c)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="map-legend">
        {Object.entries(CATEGORY_COLORS)
          .filter(([k]) => k !== 'other')
          .map(([cat, color]) => (
            <button
              key={cat}
              className={`map-legend-item ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(category === cat ? 'all' : cat)}
            >
              <span className="map-legend-dot" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
              <span>{cat}</span>
            </button>
          ))}
      </div>

      <div className="map-body">
        <div className="map-wrap">
          {loading && (
            <div className="map-loader"><div className="spinner" /></div>
          )}
          <div ref={mapRef} className="map-container" />
        </div>

        {selectedEvent && (
          <div className="map-sidebar">
            <button className="map-sidebar-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <span className={`badge cat-${selectedEvent.category}`}>{selectedEvent.category}</span>
            <h2 className="map-sidebar-title">{selectedEvent.title}</h2>
            <p className="map-sidebar-date">{formatDate(selectedEvent.date)}</p>
            <p className="map-sidebar-loc">📍 {selectedEvent.location}</p>
            {selectedEvent.description && (
              <p className="map-sidebar-desc">
                {selectedEvent.description.length > 140
                  ? selectedEvent.description.slice(0, 140) + '…'
                  : selectedEvent.description}
              </p>
            )}
            <Link
              to={`/events/${selectedEvent._id}`}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem', justifyContent: 'center' }}
            >
              View Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}