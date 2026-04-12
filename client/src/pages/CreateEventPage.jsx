import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, NEIGHBORHOODS } from '../constants';
import { detectWard } from '../utils/wardDetect';
import './CreateEventPage.css';

function toLocalDatetimeString(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d - offset).toISOString().slice(0, 16);
}

export default function CreateEventPage({ edit }) {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', date: '', endDate: '',
    location: '', category: 'community',
    neighborhood: '', venueSubarea: '',
    isFree: true, ticketPrice: '',
    capacity: '', imageUrl: '', rsvpUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(edit);
  const [error, setError] = useState('');
  const [wardStatus, setWardStatus] = useState(null); // 'detecting' | 'detected' | 'manual' | 'none'
  const locationBlurTimer = useRef(null);

  useEffect(() => {
    if (edit && id) {
      fetch(`/api/events/${id}`)
        .then((r) => r.json())
        .then((data) => {
          const ev = data.event;
          setForm({
            title: ev.title || '',
            description: ev.description || '',
            date: toLocalDatetimeString(ev.date),
            endDate: toLocalDatetimeString(ev.endDate),
            location: ev.location || '',
            category: ev.category || 'community',
            neighborhood: ev.neighborhood || '',
            venueSubarea: ev.venueSubarea || '',
            isFree: ev.isFree !== false,
            ticketPrice: ev.ticketPrice ?? '',
            capacity: ev.capacity || '',
            imageUrl: ev.imageUrl || '',
            rsvpUrl:  ev.rsvpUrl  || '',
          });
        })
        .finally(() => setFetching(false));
    }
  }, [edit, id]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleNeighborhoodChange = (e) => {
    setForm((f) => ({ ...f, neighborhood: e.target.value }));
    setWardStatus(e.target.value ? 'manual' : null);
    setError('');
  };

  // Auto-detect ward when location field loses focus
  const handleLocationBlur = async (e) => {
    const address = e.target.value.trim();
    if (!address || form.neighborhood) return; // skip if already set
    clearTimeout(locationBlurTimer.current);
    locationBlurTimer.current = setTimeout(async () => {
      setWardStatus('detecting');
      const ward = await detectWard(address);
      if (ward) {
        setForm((f) => ({ ...f, neighborhood: ward }));
        setWardStatus('detected');
      } else {
        setWardStatus('none');
      }
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      ...form,
      capacity: form.capacity ? Number(form.capacity) : null,
      endDate: form.endDate || undefined,
      isFree: form.isFree,
      ticketPrice: form.isFree ? null : (form.ticketPrice !== '' ? Number(form.ticketPrice) : null),
    };

    try {
      const url = edit ? `/api/events/${id}` : '/api/events';
      const method = edit ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(body) });
      const data = await res.json();

      if (!res.ok) { setError(data.message); return; }
      navigate(`/events/${data.event._id}`);
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <main className="page">
      <div className="create-event-layout">
        <div className="page-header">
          <h1>{edit ? 'Edit Event' : 'Create Event'}</h1>
          <p>{edit ? 'Update your event details' : 'Share something amazing with the community'}</p>
        </div>

        <form onSubmit={handleSubmit} className="create-event-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-section">
            <h2 className="form-section-title">Basic Info</h2>
            <div className="form-group">
              <label>Event title *</label>
              <input
                name="title"
                type="text"
                placeholder="What's happening?"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Tell people what to expect, what to bring, and why they should come..."
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                maxLength={2000}
                style={{ resize: 'vertical' }}
              />
              <span className="char-count">{form.description.length}/2000</span>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Date & Location</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Start date & time *</label>
                <input
                  name="date"
                  type="datetime-local"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End date & time</label>
                <input
                  name="endDate"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.date}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                name="location"
                type="text"
                placeholder="Address or venue name"
                value={form.location}
                onChange={handleChange}
                onBlur={handleLocationBlur}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Ward / Neighborhood *
                  {wardStatus === 'detecting' && (
                    <span className="ward-status ward-status--detecting">
                      <span className="ward-spinner" /> Detecting…
                    </span>
                  )}
                  {wardStatus === 'detected' && (
                    <span className="ward-status ward-status--detected">✓ Auto-detected</span>
                  )}
                  {wardStatus === 'none' && (
                    <span className="ward-status ward-status--none">Not in JC — select manually</span>
                  )}
                  {wardStatus === 'manual' && (
                    <span className="ward-status ward-status--manual">Set manually</span>
                  )}
                </label>
                <select
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleNeighborhoodChange}
                  className={wardStatus === 'detected' ? 'select-detected' : ''}
                  required
                >
                  <option value="">— Select ward —</option>
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
                {form.neighborhood && (
                  <span className="field-hint">
                    {NEIGHBORHOODS.find(n => n.value === form.neighborhood)?.areas}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Specific area <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
                <input
                  name="venueSubarea"
                  type="text"
                  placeholder="e.g. Paulus Hook, McGinley Square…"
                  value={form.venueSubarea}
                  onChange={handleChange}
                  maxLength={80}
                />
                <span className="field-hint">Help attendees find the area quickly</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Pricing *</h2>
            <div className="pricing-toggle">
              <button
                type="button"
                className={`pricing-option ${form.isFree ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, isFree: true, ticketPrice: '' }))}
              >
                <span className="pricing-icon">🎟</span>
                <span className="pricing-label">Free</span>
                <span className="pricing-sub">No ticket required</span>
              </button>
              <button
                type="button"
                className={`pricing-option ${!form.isFree ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, isFree: false }))}
              >
                <span className="pricing-icon">💳</span>
                <span className="pricing-label">Paid</span>
                <span className="pricing-sub">Ticket / entry fee</span>
              </button>
            </div>
            {!form.isFree && (
              <div className="form-group">
                <label>Ticket price *</label>
                <div className="price-input-wrap">
                  <span className="price-symbol">$</span>
                  <input
                    name="ticketPrice"
                    type="number"
                    placeholder="0.00"
                    value={form.ticketPrice}
                    onChange={handleChange}
                    min={0}
                    max={9999}
                    step={0.01}
                    required={!form.isFree}
                  />
                </div>
                <span className="field-hint">Enter the price per person in USD</span>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Capacity & Media</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Max capacity</label>
                <input
                  name="capacity"
                  type="number"
                  placeholder="Unlimited"
                  value={form.capacity}
                  onChange={handleChange}
                  min={1}
                />
                <span className="field-hint">Leave blank for unlimited</span>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>
                RSVP link
                <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: '0.4rem' }}>(optional)</span>
              </label>
              <input
                name="rsvpUrl"
                type="url"
                placeholder="https://eventbrite.com/... or any external registration link"
                value={form.rsvpUrl}
                onChange={handleChange}
              />
              <span className="field-hint">Overrides the built-in registration button — use for Eventbrite, Google Forms, etc.</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (edit ? 'Saving...' : 'Creating...') : (edit ? 'Save Changes' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}