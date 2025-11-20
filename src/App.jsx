import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load components
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Home = lazy(() => import('./components/Pages/Home'));
const About = lazy(() => import('./components/Pages/About'));
const PricingPage = lazy(() => import('./components/Pages/Pricing'));
const Contact = lazy(() => import('./components/Pages/Contact'));
const Blog = lazy(() => import('./components/Pages/Blog'));
const BlogPost = lazy(() => import('./components/Pages/BlogPost'));
const BlogEditor = lazy(() => import('./components/Pages/BlogEditor'));
const AdminPanel = lazy(() => import('./components/dashboard/AdminPanel'));
const LoginForm = lazy(() => import('./components/Forms/login-form').then(module => ({ default: module.LoginForm })));
const SignupForm = lazy(() => import('./components/Forms/signup-form').then(module => ({ default: module.SignupForm })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const ForgotPassword = lazy(() => import('./components/Forms/forgot-password'));
const ResetPassword = lazy(() => import('./components/Forms/reset-password'));
const CmdK = lazy(() => import('./components/dashboard/CmdK'));

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/new" element={<BlogEditor />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/:slug/edit" element={<BlogEditor />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/dashboard/:userId/collections/:collectionId" element={<Dashboard />} />
          <Route path="/dashboard/:userId/admin" element={<AdminPanel />} />
          <Route path="/cmd" element={<CmdK />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
