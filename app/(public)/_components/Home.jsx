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

        <section className="w-full bg-background py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 md:px-6 space-y-5">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
              How to build a scalable bookmark workflow
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A strong bookmark workflow starts with consistency. Teams that save links in different
              apps usually lose context, duplicate research, and waste time trying to reconstruct decisions.
              Markify solves this by giving every team a shared structure for capture, organization, and retrieval.
              When links are saved with tags, collection context, and clear naming, your knowledge base becomes a reusable asset.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The first step is creating collection standards that match how your team already works.
              Most teams organize by function, project, and lifecycle stage. For example, marketing teams
              can keep separate collections for campaign research, messaging references, and competitive examples.
              Product teams can separate user insights, technical references, and launch checklists.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Tagging improves search quality when tags are predictable and limited. Instead of creating
              dozens of one-off labels, define a short set for intent, audience, and priority. This makes
              it easier to filter results quickly and keeps your library clean as it grows over time.
              Shared naming rules reduce ambiguity and help new teammates onboard faster.
            </p>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground">
              Practical checklist for teams
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Define collection naming rules before adding large volumes of links.</li>
              <li>Use tags for intent and audience, not for temporary notes.</li>
              <li>Capture a short description so each saved resource keeps context.</li>
              <li>Review and merge duplicate collections at least once per month.</li>
              <li>Share curated collections for handoffs across teams and stakeholders.</li>
              <li>Archive outdated links to keep active search results relevant.</li>
              <li>Track high-value references in dedicated strategy collections.</li>
              <li>Use one source of truth for links to avoid scattered documentation.</li>
            </ul>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Teams that follow this process spend less time searching and more time shipping.
              Whether you are planning campaigns, running competitive research, or building product strategy,
              a searchable bookmark system improves speed, clarity, and collaboration quality.
            </p>
          </div>
        </section>

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
