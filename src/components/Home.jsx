import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import Hero from './home/Hero';
import Navbar from './Navbar';

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
      <h1 className='text-4xl font-bold'>Welcome to Markify</h1>
      <p className="text-muted-foreground">Your personal bookmarking solution.</p>
      <Button onClick={handleLoginClick}>Login to Get Started</Button>
      <Hero/>
      <Hero/>
      <Hero/>
    </div>
    </>
  );
};

export default Home;