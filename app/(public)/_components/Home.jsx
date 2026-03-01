"use client";

// Home.jsx
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import PricingPlans from '@/components/home/PricingPlans';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/Footer';
import LazySection from "@/components/LazySection";

// Lazy load below-fold components
const Marquee = lazy(() => import('@/components/home/Marquee'));
const FeatureHighlight = lazy(() => import('@/components/home/FeatureHighlight'));
const BentoGridSection = lazy(() => import('@/components/home/BentoGridSection'));
const StressFreeCTA = lazy(() => import('@/components/home/StressFreeCTA'));
const WhyChooseMarkify = lazy(() => import('@/components/home/WhyChooseMarkify'));
const ReviewsMarquee = lazy(() => import('@/components/home/ReviewsMarquee'));
const FinalCTA = lazy(() => import('@/components/home/FinalCTA'));

const SectionFallback = ({ title, description }) => (
  <section className="w-full bg-background py-12 md:py-14">
    <div className="mx-auto max-w-4xl px-4 md:px-6 space-y-3">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </section>
);

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero stays here - critical for FCP */}
        <Hero />

        <LazySection
          fallback={
            <SectionFallback
              title="Modern technology stack for reliable bookmark management"
              description="Markify runs on a modern stack focused on speed, stability, and long-term maintainability."
            />
          }
        >
          <Suspense
            fallback={
              <SectionFallback
                title="Modern technology stack for reliable bookmark management"
                description="Markify runs on a modern stack focused on speed, stability, and long-term maintainability."
              />
            }
          >
            <Marquee />
          </Suspense>
        </LazySection>

        <LazySection
          fallback={
            <SectionFallback
              title="A bookmark manager designed for real team workflows"
              description="Organize links with structure, keep searchable context, and make collaboration easier across projects."
            />
          }
        >
          <Suspense
            fallback={
              <SectionFallback
                title="A bookmark manager designed for real team workflows"
                description="Organize links with structure, keep searchable context, and make collaboration easier across projects."
              />
            }
          >
            <FeatureHighlight />
          </Suspense>
        </LazySection>

        <LazySection
          fallback={
            <SectionFallback
              title="Built-in capabilities for saving, searching, and sharing links"
              description="Markify helps teams capture resources, group them into collections, and retrieve them quickly with smart filters."
            />
          }
        >
          <Suspense
            fallback={
              <SectionFallback
                title="Built-in capabilities for saving, searching, and sharing links"
                description="Markify helps teams capture resources, group them into collections, and retrieve them quickly with smart filters."
              />
            }
          >
            <BentoGridSection />
          </Suspense>
        </LazySection>


        <LazySection
          fallback={
            <SectionFallback
              title="Save and organize bookmarks without clutter"
              description="Use shared collections, tags, and search shortcuts to keep your bookmark library clean and useful."
            />
          }
        >
          <Suspense
            fallback={
              <SectionFallback
                title="Save and organize bookmarks without clutter"
                description="Use shared collections, tags, and search shortcuts to keep your bookmark library clean and useful."
              />
            }
          >
            <StressFreeCTA />
          </Suspense>
        </LazySection>

        <LazySection
          fallback={
            <SectionFallback
              title="Why teams replace default browser bookmarks with Markify"
              description="Markify combines organization, discoverability, and cross-device workflows in one bookmark platform."
            />
          }
        >
          <Suspense
            fallback={
              <SectionFallback
                title="Why teams replace default browser bookmarks with Markify"
                description="Markify combines organization, discoverability, and cross-device workflows in one bookmark platform."
              />
            }
          >
            <WhyChooseMarkify />
          </Suspense>
        </LazySection>


        {/* Reviews */}
        <LazySection
          fallback={
            <SectionFallback
              title="Teams use Markify to find links faster"
              description="Markify reduces repeated searching and helps teams keep references accessible when deadlines are tight."
            />
          }
        >
          <Suspense
            fallback={
              <SectionFallback
                title="Teams use Markify to find links faster"
                description="Markify reduces repeated searching and helps teams keep references accessible when deadlines are tight."
              />
            }
          >
            <ReviewsMarquee />
          </Suspense>
        </LazySection>

        {/* Pricing */}
        <PricingPlans />

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <LazySection
          fallback={
            <SectionFallback
              title="Start organizing your saved links today"
              description="Create a free Markify account to build a searchable bookmark system for personal or team workflows."
            />
          }
        >
          <Suspense
            fallback={
              <SectionFallback
                title="Start organizing your saved links today"
                description="Create a free Markify account to build a searchable bookmark system for personal or team workflows."
              />
            }
          >
            <FinalCTA />
          </Suspense>
        </LazySection>
      </main>

      <Footer />
    </>
  );
};

export default Home;
