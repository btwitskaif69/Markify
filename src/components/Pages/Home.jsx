// Home.jsx
import React, { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '../home/Hero';
import DashboardPreview from '../home/DashboardPreview';
import PowerBy from '../home/PowerBy';
import SEO from '../SEO/SEO';

// Lazy load below-fold components
const Features = lazy(() => import('../home/Features'));
const HowItWorks = lazy(() => import('../home/HowItWorks'));
const Stats = lazy(() => import('../home/Stats'));
const WaitlistHero = lazy(() => import('../waitlist-hero').then(m => ({ default: m.WaitlistHero })));
const FAQ = lazy(() => import('../home/FAQ'));
const CTA = lazy(() => import('../home/CTA'));
const ReviewsMarquee = lazy(() => import('../home/ReviewsMarquee'));
const Footer = lazy(() => import('@/components/Footer'));

// Minimal loading placeholder for below-fold content
const BelowFoldPlaceholder = () => <div className="min-h-[200px]" />;

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Markify",
    "url": "https://www.markify.tech",
    "logo": "https://www.markify.tech/logo.svg",
    "sameAs": [
      "https://twitter.com/markify",
      "https://github.com/markify"
    ]
  };

  return (
    <>
      <SEO
        title="Home"
        description="Markify - Smart Collections, Lightning-Fast Global Search, and Privacy-First Bookmarking Manager."
        canonical="https://www.markify.tech/"
        structuredData={structuredData}
      />
      <Navbar />

      <main>
        {/* Hero stays here - critical for FCP */}
        <Hero />

        {/* Dashboard preview - critical for LCP */}
        <section className="relative z-20 flex justify-center items-center px-4 -mt-25 sm:-mt-30 md:-mt-20 lg:-mt-45 mb-10">
          <DashboardPreview />
        </section>

        <PowerBy />

        {/* Features Section */}
        <Suspense fallback={<BelowFoldPlaceholder />}>
          <Features />
        </Suspense>

        {/* How It Works */}
        <Suspense fallback={<BelowFoldPlaceholder />}>
          <HowItWorks />
        </Suspense>

        {/* Stats */}
        <Suspense fallback={<BelowFoldPlaceholder />}>
          <Stats />
        </Suspense>

        {/* Waitlist/Email Section */}
        <Suspense fallback={<BelowFoldPlaceholder />}>
          <WaitlistHero />
        </Suspense>

        {/* FAQ */}
        <Suspense fallback={<BelowFoldPlaceholder />}>
          <FAQ />
        </Suspense>

        {/* Reviews */}
        <Suspense fallback={<BelowFoldPlaceholder />}>
          <ReviewsMarquee />
        </Suspense>

        {/* Final CTA */}
        <Suspense fallback={<BelowFoldPlaceholder />}>
          <CTA />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

export default Home;
