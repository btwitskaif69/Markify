// Home.jsx
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '../home/Hero';
import DashboardPreview from '../home/DashboardPreview';
import Marquee from '../home/Marquee';
import SEO from '../SEO/SEO';
import LazySection from "@/components/LazySection";
import {
  buildFaqSchema,
  buildWebApplicationSchema,
  getCanonicalUrl,
} from "@/lib/seo";

// Lazy load below-fold components
const Features = lazy(() => import('../home/Features'));
const HowItWorks = lazy(() => import('../home/HowItWorks'));
const Stats = lazy(() => import('../home/Stats'));

const FAQ = lazy(() => import('../home/FAQ'));
const CTA = lazy(() => import('../home/CTA'));
const ReviewsMarquee = lazy(() => import('../home/ReviewsMarquee'));
const Footer = lazy(() => import('@/components/Footer'));

// Minimal loading placeholder for below-fold content
const BelowFoldPlaceholder = () => <div className="min-h-[200px]" />;

const Home = () => {
  const faqSchema = buildFaqSchema([
    {
      question: "Is Markify free to use?",
      answer:
        "Yes! Markify offers a generous free tier with unlimited bookmarks, collections, and search. Premium features like AI-powered tagging and advanced analytics are available with our Pro plan.",
    },
    {
      question: "Can I import my bookmarks from Chrome or Firefox?",
      answer:
        "Absolutely! Markify supports importing bookmarks from Chrome, Firefox, Safari, and Edge. You can import via HTML export file or use our browser extension for seamless sync.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Security is our top priority. All data is encrypted at rest and in transit. We never sell your data or show you ads. Your bookmarks are 100% private.",
    },
    {
      question: "Can I access my bookmarks on multiple devices?",
      answer:
        "Yes! Your bookmarks sync across all your devices automatically. Access them from your desktop, laptop, tablet, or phone wherever you go.",
    },
    {
      question: "How does the AI tagging work?",
      answer:
        "When you save a bookmark, our AI analyzes the page content and suggests relevant tags. You can accept, modify, or add your own tags. The more you use Markify, the smarter it gets!",
    },
    {
      question: "Can I share collections with others?",
      answer:
        "Yes! You can create public share links for any collection. Perfect for sharing resources with teammates, students, or friends. You control who can access what.",
    },
  ]);

  const pageDescription =
    "Markify is a Bookmark Manager that helps you save, organize, and search links fast with smart collections.";
  const webAppSchema = buildWebApplicationSchema({
    description: pageDescription,
    url: getCanonicalUrl("/"),
  });
  const structuredData = [faqSchema, webAppSchema].filter(Boolean);

  return (
    <>
      <SEO
        title="Bookmark Manager for Fast Search"
        description={pageDescription}
        canonical={getCanonicalUrl("/")}
        structuredData={structuredData}
        keywords={[
          "bookmark manager",
          "save bookmarks",
          "organize links",
          "search bookmarks",
        ]}
      />
      <Navbar />

      <main>
        {/* Hero stays here - critical for FCP */}
        <Hero />

        {/* Dashboard preview - critical for LCP */}
        <section className="relative z-20 flex justify-center items-center px-4 -mt-25 sm:-mt-30 md:-mt-20 lg:-mt-45 mb-10">
          <DashboardPreview />
        </section>

        <Marquee />

        {/* Features Section */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <Features />
          </Suspense>
        </LazySection>

        {/* How It Works */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <HowItWorks />
          </Suspense>
        </LazySection>

        {/* Stats */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <Stats />
          </Suspense>
        </LazySection>


        {/* FAQ */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <FAQ />
          </Suspense>
        </LazySection>

        {/* Reviews */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <ReviewsMarquee />
          </Suspense>
        </LazySection>

        {/* Final CTA */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <CTA />
          </Suspense>
        </LazySection>
      </main >

      <LazySection>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazySection>
    </>
  );
};

export default Home;
