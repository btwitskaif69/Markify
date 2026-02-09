"use client";

// Home.jsx
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import FeatureHighlight from '@/components/home/FeatureHighlight';
import BentoGridSection from '@/components/home/BentoGridSection';
import WhyChooseMarkify from '@/components/home/WhyChooseMarkify';
import LazySection from "@/components/LazySection";

// Lazy load below-fold components
const StressFreeCTA = lazy(() => import('@/components/home/StressFreeCTA'));
const ReviewsMarquee = lazy(() => import('@/components/home/ReviewsMarquee'));
const PricingPlans = lazy(() => import('@/components/home/PricingPlans'));
const FAQSection = lazy(() => import('@/components/home/FAQSection'));
const FinalCTA = lazy(() => import('@/components/home/FinalCTA'));
const Footer = lazy(() => import('@/components/Footer'));

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

        <WhyChooseMarkify />

        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <StressFreeCTA />
          </Suspense>
        </LazySection>

        {/* Reviews */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <ReviewsMarquee />
          </Suspense>
        </LazySection>

        {/* Pricing */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <PricingPlans />
          </Suspense>
        </LazySection>

        {/* FAQ */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <FAQSection />
          </Suspense>
        </LazySection>

        {/* Final CTA */}
        <LazySection fallback={<BelowFoldPlaceholder />}>
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <FinalCTA />
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
