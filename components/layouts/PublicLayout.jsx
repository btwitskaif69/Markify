import React from 'react';
import SmoothScroll from '@/components/SmoothScroll';

/**
 * PublicLayout - Wrapper for public-facing pages
 * 
 * Applies Lenis smooth scrolling to all public pages:
 * - Home, About, Features, Solutions, Pricing, Blog, Contact, etc.
 * 
 * Does NOT apply to:
 * - Dashboard pages (need native scrolling for complex interactions)
 * - Auth pages (simple forms, no need for smooth scroll)
 */
const PublicLayout = ({ children }) => {
    return (
        <SmoothScroll>
            {children}
        </SmoothScroll>
    );
};

export default PublicLayout;
