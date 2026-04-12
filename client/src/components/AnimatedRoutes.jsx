import { useLocation, Routes } from 'react-router-dom';

/**
 * Wraps React Router's <Routes> in a div keyed on location.key.
 * Every navigation causes the incoming page to mount fresh,
 * picking up the .page-transition-wrapper enter animation.
 */
export default function AnimatedRoutes({ children }) {
  const location = useLocation();

  return (
    <div key={location.key} className="page-transition-wrapper">
      <Routes location={location}>
        {children}
      </Routes>
    </div>
  );
}