import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE from '../config';
import './SubscribeSuccessPage.css';

export default function SubscribeSuccessPage() {
  const { token, login, user } = useAuth();
  const navigate = useNavigate();

  // Refresh user data so subscriptionStatus updates immediately
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          login(data.user, token);
        }
      } catch {
        // silent
      }
    };

    if (token) refresh();

    const timer = setTimeout(() => navigate('/my-events'), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="success-page">
      <div className="pricing-bg" />
      <div className="success-card">
        <div className="success-icon">✦</div>
        <h1 className="success-title">You're In</h1>
        <p className="success-subtitle">
          Welcome to the constellation. Redirecting you to the map…
        </p>
        <div className="success-loader">
          <div className="spinner" />
        </div>
      </div>
    </div>
  );
}