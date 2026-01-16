import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SmoothScroll wrapper component using Lenis
 * 
 * Best Practices Applied:
 * - Uses lerp: 0.1 for smooth, buttery feel
 * - Duration: 1.2 for natural deceleration
 * - smoothWheel enabled for mouse wheel smoothing
 * - Resets scroll position on route change
 * - Respects reduced motion preferences via CSS
 */
const SmoothScroll = ({ children }) => {
    const location = useLocation();

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,              // Smoothness intensity (0.1 = very smooth)
                duration: 1.2,          // Scroll duration in seconds
                smoothWheel: true,      // Smooth mouse wheel scrolling
                wheelMultiplier: 1,     // Scroll speed multiplier
                touchMultiplier: 2,     // Touch scroll speed
                infinite: false,        // No infinite scroll
            }}
        >
            <ScrollToTop />
            {children}
        </ReactLenis>
    );
};

/**
 * Component to handle scroll reset on route change
 */
const ScrollToTop = () => {
    const lenis = useLenis();
    const location = useLocation();

    useEffect(() => {
        // Scroll to top immediately on route change
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [location.pathname, lenis]);

    return null;
};

export default SmoothScroll;
export { useLenis };
