// Home.jsx
import React from 'react';
import Navbar from './Navbar';
import Hero from './home/Hero';
import DashboardPreview from './home/DashboardPreview';
import PowerBy from './home/PowerBy';

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero stays here */}
      <Hero />

      {/* Dashboard preview placed AFTER hero and pulled up to overlap */}
      <div className="relative z-20 flex justify-center items-center px-4 -mt-25 sm:-mt-30 md:-mt-20 lg:-mt-30 mb-10">
          <DashboardPreview />
      </div>

      <PowerBy />
    </>
  );
};

export default Home;
