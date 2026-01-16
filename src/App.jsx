import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import LoadingSpinner from './components/ui/LoadingSpinner';
import PublicLayout from './components/layouts/PublicLayout';

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
const UseCases = lazy(() => import('./components/Pages/UseCases'));
const UseCaseIntent = lazy(() => import('./components/Pages/UseCaseIntent'));
const UseCaseDetail = lazy(() => import('./components/Pages/UseCaseDetail'));

import { Error404 } from './components/pixeleted-404-not-found';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public pages with Lenis smooth scroll */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
          <Route path="/solutions" element={<PublicLayout><Solutions /></PublicLayout>} />
          <Route path="/solutions/:slug" element={<PublicLayout><Solution /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
          <Route path="/features/:slug" element={<PublicLayout><Feature /></PublicLayout>} />
          <Route path="/use-cases" element={<PublicLayout><UseCases /></PublicLayout>} />
          <Route path="/use-cases/:intent" element={<PublicLayout><UseCaseIntent /></PublicLayout>} />
          <Route path="/use-cases/:intent/:industry" element={<PublicLayout><UseCaseDetail /></PublicLayout>} />
          <Route path="/what-is-markify" element={<PublicLayout><WhatIsMarkify /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />
          <Route path="/cookies" element={<PublicLayout><CookiePolicy /></PublicLayout>} />
          <Route path="/refund-policy" element={<PublicLayout><RefundPolicy /></PublicLayout>} />
          <Route path="/cookie-settings" element={<PublicLayout><CookieSettings /></PublicLayout>} />
          <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
          <Route path="/shared/bookmark/:shareId" element={<PublicLayout><SharedBookmark /></PublicLayout>} />
          <Route path="/shared/collection/:shareId" element={<PublicLayout><SharedCollection /></PublicLayout>} />

          {/* Auth pages - no smooth scroll needed */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Dashboard/Admin pages - native scroll for complex interactions */}
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/dashboard/:userId/shared" element={<Dashboard />} />
          <Route path="/dashboard/:userId/collections/:collectionId" element={<Dashboard />} />
          <Route path="/dashboard/:userId/admin" element={<AdminPanel />} />
          <Route path="/cmd" element={<CmdK />} />

          {/* Blog editor - needs native scroll for editing */}
          <Route path="/blog/new" element={<BlogEditor />} />
          <Route path="/blog/:slug/edit" element={<BlogEditor />} />

          {/* 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
