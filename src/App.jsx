import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import { ThemeProvider } from "@/components/theme-provider";
import Home from './components/Pages/Home';
import { LoginForm } from './components/Forms/login-form';
import { SignupForm } from './components/Forms/signup-form';
import NotFoundPage from './components/NotFoundPage';
import ForgotPassword from './components/Forms/forgot-password';
import ResetPassword from './components/Forms/reset-password';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard/:userId" element={<Dashboard/>} />
        <Route path="/dashboard/:userId/collections/:collectionId" element={<Dashboard />} />
        <Route path="/cmd" element={<cmdK/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;