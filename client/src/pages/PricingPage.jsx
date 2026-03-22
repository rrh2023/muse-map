import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE from '../config';
import './PricingPage.css';

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$5',
    period: '/ month',
    annual: null,
    description: 'Billed every month. Cancel anytime.',
    badge: null,
  },
  {
    id: 'annual',
    label: 'Annual',
    price: '$50',
    period: '/ year',
    annual: 'Save $10 — 2 months free',
    description: 'Billed once per year.',
    badge: 'Best Value',
  },
];

const FEATURES = [
  'Full access to all events',
  'Create & manage your own events',
  'Calendar & list views',
  'Event registration & attendee tracking',
  'My Events dashboard',
  'Cancel anytime',
];

export default function PricingPage() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null); // 'monthly' | 'annual' | null
  const [error, setError] = useState('');

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(plan);
    setError('');

    try {
      const res = await authFetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(null);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError('Network error — please try again');
      setLoading(null);
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-bg" />

      <div className="pricing-inner">
        <div className="pricing-header">
          <h1 className="pricing-title">Join the Constellation</h1>
          <p className="pricing-subtitle">
            Full access to every event, venue, and cultural moment across Jersey City.
          </p>
        </div>

        {error && <div className="alert alert-error" style={{ maxWidth: 560, margin: '0 auto 1.5rem' }}>{error}</div>}

        <div className="pricing-cards">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.badge ? 'pricing-card--featured' : ''}`}>
              {plan.badge && <div className="pricing-badge">{plan.badge}</div>}

              <div className="pricing-card-header">
                <h2 className="pricing-plan-name">{plan.label}</h2>
                {plan.annual && <p className="pricing-savings">{plan.annual}</p>}
              </div>

              <div className="pricing-amount">
                <span className="pricing-price">{plan.price}</span>
                <span className="pricing-period">{plan.period}</span>
              </div>

              <p className="pricing-desc">{plan.description}</p>

              <button
                className={`btn btn-lg ${plan.badge ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
              >
                {loading === plan.id ? 'Redirecting...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-features">
          <p className="pricing-features-label">Everything included in both plans:</p>
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