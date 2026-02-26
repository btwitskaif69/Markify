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
