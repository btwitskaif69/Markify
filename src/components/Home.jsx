import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
      <h1 className='text-4xl font-bold'>Welcome to Markify</h1>
      <p className="text-muted-foreground">Your personal bookmarking solution.</p>
      <Button onClick={handleLoginClick}>Login to Get Started</Button>
    </div>
  );
};

export default Home;