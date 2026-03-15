import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreateEventPage.css';
import API_BASE from '../config';

const CATEGORIES = ['conference','workshop','social','sports','music','arts','tech','other'];

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
    location: '', category: 'other', capacity: '', imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(edit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (edit && id) {
      fetch(`${API_BASE}/api/events/${id}`)
        .then((r) => r.json())
        .then((data) => {
          const ev = data.event;
          setForm({
            title: ev.title || '',
            description: ev.description || '',
            date: toLocalDatetimeString(ev.date),
            endDate: toLocalDatetimeString(ev.endDate),
            location: ev.location || '',
            category: ev.category || 'other',
            capacity: ev.capacity || '',
            imageUrl: ev.imageUrl || '',
          });
        })
        .finally(() => setFetching(false));
    }
  }, [edit, id]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      ...form,
      capacity: form.capacity ? Number(form.capacity) : null,
      endDate: form.endDate || undefined,
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
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
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
                required
              />
            </div>
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
