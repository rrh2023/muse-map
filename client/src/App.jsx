import { BrowserRouter, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AnimatedRoutes from './components/AnimatedRoutes';
import SiteFooter from './components/SiteFooter';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import CalendarPage from './pages/CalendarPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import MapPage from './pages/MapPage';
import PricingPage from './pages/PricingPage';
import PrivacyPage from './pages/PrivacyPage';
import SubscribeSuccessPage from './pages/SubscribeSuccessPage';
import SubscriptionGuard from './pages/SubscriptionGuard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/auth" replace />;
}

// Footer is hidden on the map page (full-screen layout)
function FooterSlot() {
  const { pathname } = useLocation();
  return pathname === '/map' ? null : <SiteFooter />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <>
      <Navbar />
      <AnimatedRoutes>
        {/* Public */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/auth"    element={user ? <Navigate to="/events" /> : <AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/subscribe/success" element={<ProtectedRoute><SubscribeSuccessPage /></ProtectedRoute>} />

        {/* App (subscription-gated) */}
        <Route path="/events"         element={<SubscriptionGuard><CalendarPage /></SubscriptionGuard>} />
        <Route path="/map"            element={<SubscriptionGuard><MapPage /></SubscriptionGuard>} />
        <Route path="/events/:id"     element={<SubscriptionGuard><EventDetailPage /></SubscriptionGuard>} />
        <Route path="/create-event"   element={<SubscriptionGuard><CreateEventPage /></SubscriptionGuard>} />
        <Route path="/edit-event/:id" element={<SubscriptionGuard><CreateEventPage edit /></SubscriptionGuard>} />
        <Route path="/my-events"      element={<SubscriptionGuard><MyEventsPage /></SubscriptionGuard>} />

        <Route path="*" element={<Navigate to="/" />} />
      </AnimatedRoutes>
      <FooterSlot />
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