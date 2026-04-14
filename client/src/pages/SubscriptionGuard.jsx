import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Gate for organizer-only actions (posting/editing events).
// Attendees can freely browse — only posting requires an active organizer subscription.
export default function SubscriptionGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'organizer') return <Navigate to="/pricing" replace />;
  if (user.subscriptionStatus !== 'active') return <Navigate to="/pricing" replace />;

  return children;
}
