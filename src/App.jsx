import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from "@/components/theme-provider";
import Home from './components/Home';
import { LoginForm } from './components/login-form';
import { SignupForm } from './components/signup-form';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/dashboard/:userId" element={<Dashboard/>} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;