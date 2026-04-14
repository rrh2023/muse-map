import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE from '../config';
import './PricingPage.css';

const PLAN = {
  id: 'monthly',
  label: 'Organizer',
  price: '$25',
  period: '/ month',
  description: 'Post events on the map and reach the Jersey City arts community. Cancel anytime.',
  badge: 'Organizer',
};

const FEATURES = [
  'Post unlimited events',
  'Events featured on the live map',
  'Manage attendees & registrations',
  'My Events dashboard',
  'Edit or cancel events anytime',
  'Cancel your subscription anytime',
];

export default function PricingPage() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role !== 'organizer') {
      setError('This plan is for organizer accounts only. Create an organizer account to subscribe.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authFetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ plan: 'monthly' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError('Network error — please try again');
      setLoading(false);
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-bg" />

      <div className="pricing-inner">
        <div className="pricing-header">
          <h1 className="pricing-title">Become an Organizer</h1>
          <p className="pricing-subtitle">
            Post your events on the Muse Map and reach the Jersey City arts community.
            Attending events is always free — the organizer plan is for posting.
          </p>
        </div>

        {error && <div className="alert alert-error" style={{ maxWidth: 560, margin: '0 auto 1.5rem' }}>{error}</div>}

        <div className="pricing-cards pricing-cards--single">
          <div className="pricing-card pricing-card--featured">
            <div className="pricing-badge">{PLAN.badge}</div>

            <div className="pricing-card-header">
              <h2 className="pricing-plan-name">{PLAN.label}</h2>
            </div>

            <div className="pricing-amount">
              <span className="pricing-price">{PLAN.price}</span>
              <span className="pricing-period">{PLAN.period}</span>
            </div>

            <p className="pricing-desc">{PLAN.description}</p>

            <button
              className="btn btn-lg btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'Get Started'}
            </button>
          </div>
        </div>

        <div className="pricing-features">
          <p className="pricing-features-label">What's included:</p>
          <ul className="pricing-features-list">
            {FEATURES.map((f) => (
              <li key={f}>
                <span className="pricing-check">✦</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}