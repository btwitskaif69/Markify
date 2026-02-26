"use client";

// Home.jsx
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import FeatureHighlight from '@/components/home/FeatureHighlight';
import BentoGridSection from '@/components/home/BentoGridSection';
import WhyChooseMarkify from '@/components/home/WhyChooseMarkify';
import ReviewsMarquee from '@/components/home/ReviewsMarquee';
import PricingPlans from '@/components/home/PricingPlans';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/Footer';
import LazySection from "@/components/LazySection";

// Lazy load below-fold components
const StressFreeCTA = lazy(() => import('@/components/home/StressFreeCTA'));
const FinalCTA = lazy(() => import('@/components/home/FinalCTA'));

// Minimal loading placeholder for below-fold content
const BelowFoldPlaceholder = () => <div className="min-h-[200px]" />;

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero stays here - critical for FCP */}
        <Hero />

        <Marquee />

        <FeatureHighlight />

        <BentoGridSection />


        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <StressFreeCTA />
          </Suspense>
        </LazySection>

        <WhyChooseMarkify />


        {/* Reviews */}
        <ReviewsMarquee />

        {/* Pricing */}
        <PricingPlans />

        <section className="w-full bg-background py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 md:px-6 space-y-5">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
              Why teams choose Markify as their bookmark manager
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Markify helps teams turn scattered links into a searchable knowledge system. Instead of
              losing research across browser tabs, chat threads, and docs, you can capture sources once,
              organize them into clear collections, and find them again instantly from any device.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              For content teams, that means faster campaign planning and easier handoffs. For product and
              growth teams, it means less duplicate research and better competitive visibility. For support
              and operations teams, it means a single source of truth that stays easy to maintain.
            </p>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground">
              Core workflow benefits
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Save links in one click with browser extensions and keep metadata intact.</li>
              <li>Group bookmarks by project, team, customer segment, or campaign stage.</li>
              <li>Tag and search by keyword, URL, title, and context to retrieve results faster.</li>
              <li>Share collections with teammates without rebuilding links manually.</li>
              <li>Keep your library clean with reusable structures that scale as your team grows.</li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <FinalCTA />
          </Suspense>
        </LazySection>
      </main>

      <Footer />
    </>
  );
};

export default Home;
