import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Global Scroll Restoration and Route Transition Handler
 * - Starts new page navigations at the top (top: 0, left: 0)
 * - Preserves scroll position for browser Back/Forward (POP) actions
 * - Respects deep link anchors and URL hash targets
 * - Avoids resetting scroll during local tab or in-page filter adjustments
 */
export const ScrollToTop = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    const isNewRoute = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    // 1. If user targeted an anchor hash (e.g. #timeline-event-1936), scroll to it
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      } else {
        // Retry shortly in case DOM is mounting
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }

    // 2. If browser back/forward (POP), allow browser natural restoration
    if (navType === 'POP') {
      return;
    }

    // 3. For all explicit page-to-page route changes, ensure fresh start at the top
    if (isNewRoute) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [location.pathname, location.hash, navType]);

  return null;
};
