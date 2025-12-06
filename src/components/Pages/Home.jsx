// Home.jsx
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '../home/Hero';
import { WaitlistHero } from '../waitlist-hero';
import DashboardPreview from '../home/DashboardPreview';
import PowerBy from '../home/PowerBy';
import Features from '../home/Features';
import Footer from '@/components/Footer'
import Pricing from '../home/Pricing';

import SEO from '../SEO/SEO';

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
        {/* Hero stays here */}
        <Hero />

        {/* Dashboard preview placed AFTER hero and pulled up to overlap */}
        <section className="relative z-20 flex justify-center items-center px-4 -mt-25 sm:-mt-30 md:-mt-20 lg:-mt-45 mb-10">
          <DashboardPreview />
        </section>

        <PowerBy />
        <Features />

        {/* Waitlist Hero placed here */}
        <WaitlistHero />

        <Pricing />
      </main>
      <Footer />
    </>
  );
};

export default Home;
