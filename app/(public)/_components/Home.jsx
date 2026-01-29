"use client";

// Home.jsx
import { lazy, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import DashboardPreview from '@/components/home/DashboardPreview';
import Marquee from '@/components/home/Marquee';
import LazySection from "@/components/LazySection";

// Lazy load below-fold components
const Features = lazy(() => import('@/components/home/Features'));
const HowItWorks = lazy(() => import('@/components/home/HowItWorks'));
const Stats = lazy(() => import('@/components/home/Stats'));

const FAQ = lazy(() => import('@/components/home/FAQ'));
const CTA = lazy(() => import('@/components/home/CTA'));
const ReviewsMarquee = lazy(() => import('@/components/home/ReviewsMarquee'));
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

        {/* Dashboard preview - critical for LCP */}
        <section className="relative z-20 flex justify-center items-center px-4 -mt-25 sm:-mt-30 md:-mt-20 lg:-mt-45 mb-10">
          <DashboardPreview />
        </section>

        <Marquee />

        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Explore Markify
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Dive into product details, compare plans, and learn how to get more value from your
                bookmark library.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <Link href="/features" className="text-primary hover:underline">
                  Features
                </Link>
                <Link href="/use-cases" className="text-primary hover:underline">
                  Use cases
                </Link>
                <Link href="/pricing" className="text-primary hover:underline">
                  Pricing
                </Link>
                <Link href="/about" className="text-primary hover:underline">
                  About
                </Link>
                <Link href="/blog" className="text-primary hover:underline">
                  Blog
                </Link>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Need background on browser bookmarks? See the official resources from
                <a
                  href="https://www.google.com/chrome/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  Google Chrome
                </a>
                <span className="mx-1">and</span>
                <a
                  href="https://support.mozilla.org/en-US/kb/bookmarks-firefox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Mozilla Firefox
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                A modern alternative to browser bookmarks
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Markify keeps your research, inspiration, and documentation in one
                searchable workspace. Instead of scattered folders and endless tabs,
                you get smart collections, consistent tags, and lightning-fast search
                that helps teams find the right link in seconds.
              </p>
              <p className="text-muted-foreground text-base md:text-lg">
                Use Markify to build shared knowledge hubs for product discovery,
                content planning, compliance tracking, and onboarding. Every collection
                stays easy to share, update, and revisit so your team always has the
                latest context at hand.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Centralize links across devices and projects.</li>
                <li>Surface critical resources with tags and favorites.</li>
                <li>Share curated collections with teammates and clients.</li>
              </ul>
            </div>
          </div>
        </section>

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
