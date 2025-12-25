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
const VerifyEmail = lazy(() => import('./components/Forms/verify-email'));
const CmdK = lazy(() => import('./components/dashboard/CmdK'));
const PrivacyPolicy = lazy(() => import('./components/Pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/Pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./components/Pages/CookiePolicy'));
const RefundPolicy = lazy(() => import('./components/Pages/RefundPolicy'));
const CookieSettings = lazy(() => import('./components/Pages/CookieSettings'));
const WhatIsMarkify = lazy(() => import('./components/Pages/WhatIsMarkify'));
const SharedBookmark = lazy(() => import('./components/Pages/SharedBookmark'));
const SharedCollection = lazy(() => import('./components/Pages/SharedCollection'));
const Solutions = lazy(() => import('./components/Pages/Solutions'));
const Solution = lazy(() => import('./components/Pages/Solution'));
const FeaturesPage = lazy(() => import('./components/Pages/Features'));
const Feature = lazy(() => import('./components/Pages/Feature'));
const SearchPage = lazy(() => import('./components/Pages/Search'));

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
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/dashboard/:userId/shared" element={<Dashboard />} />
          <Route path="/dashboard/:userId/collections/:collectionId" element={<Dashboard />} />
          <Route path="/dashboard/:userId/admin" element={<AdminPanel />} />
          <Route path="/cmd" element={<CmdK />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cookie-settings" element={<CookieSettings />} />
          <Route path="/what-is-markify" element={<WhatIsMarkify />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<Solution />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/features/:slug" element={<Feature />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/shared/bookmark/:shareId" element={<SharedBookmark />} />
          <Route path="/shared/collection/:shareId" element={<SharedCollection />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
