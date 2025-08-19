import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import Hero from './home/Hero';
import Navbar from './Navbar';
import DashboardPreview from './home/DashboardPreview';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
    <Navbar/>
    <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
      <Hero/>
      <div className="absolute bottom-[-30px] md:bottom-[-675px] left-1/2 transform -translate-x-1/2 z-30">
              <DashboardPreview />
      </div>
      <h1 className='text-4xl font-bold'>Welcome to Markify</h1>
      <p className="text-muted-foreground">Your personal bookmarking solution.</p>
      <Button onClick={handleLoginClick}>Login to Get Started</Button>
    </div>
    </>
  );
};

export default Home;