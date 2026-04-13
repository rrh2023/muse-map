import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    const fields = {
      name: form.name,
      email: form.email,
      ...(form.newPassword ? {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      } : {}),
    };

    const result = await updateProfile(fields);
    setLoading(false);

    if (result.ok) {
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <main className="page profile-page">
      <div className="profile-layout">

        {/* ── Sidebar ────────────────────────────── */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-xl">
              {user.name[0].toUpperCase()}
            </div>
            <h2 className="profile-display-name">{user.name}</h2>
            <p className="profile-display-email">{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button className="profile-nav-item active">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Edit Profile
            </button>
            <button className="profile-nav-item danger" onClick={handleLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </nav>
        </aside>

        {/* ── Main form ──────────────────────────── */}
        <div className="profile-main">
          <div className="profile-main-header">
            <h1 className="profile-title">Edit Profile</h1>
            <p className="profile-subtitle">Update your name, email, or password</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {message && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            {/* Account info */}
            <div className="profile-section">
              <h3 className="profile-section-title">Account info</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={60}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="profile-section">
              <h3 className="profile-section-title">
                Change password
                <span className="profile-section-hint">Leave blank to keep your current password</span>
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Current password</label>
                  <input
                    name="currentPassword"
                    type="password"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Required to change password"
                    autoComplete="current-password"
                  />
                </div>
                <div className="form-group">
                  <label>New password</label>
                  <input
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm new password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="profile-form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}