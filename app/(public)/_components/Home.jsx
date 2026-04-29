"use client";

// Home.jsx
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import PricingPlans from '@/components/home/PricingPlans';
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

const SectionFallback = () => null;

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

        <div className="sr-only">
          <h2>The Ultimate Bookmark Manager for Teams and Individuals</h2>
          <p>
            Welcome to Markify, the most reliable and efficient bookmark manager available today. 
            If you are tired of losing track of important websites, tools, and articles, our platform 
            offers a seamless solution to save, organize, and discover your bookmarks. 
            Unlike traditional browser bookmarks that become cluttered over time, Markify introduces 
            smart collections, auto-tagging, and nested folders to keep your digital workspace pristine.
          </p>
          <p>
            For professionals and teams, sharing resources has never been easier. Our shared collections 
            allow you to collaborate in real-time, ensuring everyone has access to the same curated links. 
            Whether you are a developer looking for code snippets, a designer collecting UI inspiration, 
            or a student researching for a project, Markify is the perfect companion.
          </p>
          <p>
            Performance and security are our top priorities. With real-time global sync, your bookmarks 
            are instantly available across all your devices—from your desktop browser to your mobile phone. 
            Our advanced search functionality, powered by artificial intelligence, ensures you can find exactly 
            what you are looking for in seconds. Plus, our robust import and export tools make switching to 
            Markify a breeze.
          </p>
          <p>
            Start transforming the way you navigate the web. Join thousands of users who have already 
            optimized their workflow with our intuitive, fast, and secure bookmarking platform. 
            Sign up today and experience the future of digital organization.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;
