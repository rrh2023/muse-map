import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps any route that requires an active subscription.
// Unauthenticated users → /auth
// Authenticated but unsubscribed → /pricing
export default function SubscriptionGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.subscriptionStatus !== 'active') return <Navigate to="/pricing" replace />;

  return children;
}