import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import CalendarPage from './pages/CalendarPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import MapPage from './pages/MapPage';
import PricingPage from './pages/PricingPage';
import SubscribeSuccessPage from './pages/SubscribeSuccessPage';
import SubscriptionGuard from './components/SubscriptionGuard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscribe/success" element={<ProtectedRoute><SubscribeSuccessPage /></ProtectedRoute>} />

        <Route path="/" element={<SubscriptionGuard><CalendarPage /></SubscriptionGuard>} />
        <Route path="/map" element={<SubscriptionGuard><MapPage /></SubscriptionGuard>} />
        <Route path="/events/:id" element={<SubscriptionGuard><EventDetailPage /></SubscriptionGuard>} />
        <Route path="/create-event" element={<SubscriptionGuard><CreateEventPage /></SubscriptionGuard>} />
        <Route path="/edit-event/:id" element={<SubscriptionGuard><CreateEventPage edit /></SubscriptionGuard>} />
        <Route path="/my-events" element={<SubscriptionGuard><MyEventsPage /></SubscriptionGuard>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}