import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Subscription gating is disabled — requires login only.
// Re-enable by adding: if (user.subscriptionStatus !== 'active') return <Navigate to="/pricing" replace />;
export default function SubscriptionGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}