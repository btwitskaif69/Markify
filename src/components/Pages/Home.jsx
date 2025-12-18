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
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Markify",
      "url": "https://www.markify.tech",
      "logo": "https://www.markify.tech/android-chrome-512x512.png",
      "sameAs": [
        "https://twitter.com/markify",
        "https://github.com/markify"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Markify free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Markify offers a generous free tier with unlimited bookmarks, collections, and search. Premium features like AI-powered tagging and advanced analytics are available with our Pro plan."
          }
        },
        {
          "@type": "Question",
          "name": "Can I import my bookmarks from Chrome or Firefox?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! Markify supports importing bookmarks from Chrome, Firefox, Safari, and Edge. You can import via HTML export file or use our browser extension for seamless sync."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Security is our top priority. All data is encrypted at rest and in transit. We never sell your data or show you ads. Your bookmarks are 100% private."
          }
        },
        {
          "@type": "Question",
          "name": "Can I access my bookmarks on multiple devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Your bookmarks sync across all your devices automatically. Access them from your desktop, laptop, tablet, or phone wherever you go."
          }
        },
        {
          "@type": "Question",
          "name": "How does the AI tagging work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When you save a bookmark, our AI analyzes the page content and suggests relevant tags. You can accept, modify, or add your own tags. The more you use Markify, the smarter it gets!"
          }
        },
        {
          "@type": "Question",
          "name": "Can I share collections with others?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can create public share links for any collection. Perfect for sharing resources with teammates, students, or friends. You control who can access what."
          }
        }
      ]
    }
  ];

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
