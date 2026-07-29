import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import BookingModal from './components/BookingModal';
import ClarityAnalytics from './components/Analytics/ClarityAnalytics';
import Loader from './components/Loader';
import { initAttribution, enrichEvent } from './lib/attribution';

// Primary pages (synchronous)
import Home from './pages/Home';

// Remaining primary pages (lazy-loaded to reduce initial bundle weight)
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));

// Secondary pages (lazy-loaded)
const Reviews = lazy(() => import('./pages/Reviews'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Recall = lazy(() => import('./pages/Recall'));
const JoinUs = lazy(() => import('./pages/JoinUs'));

function App() {
  const location = useLocation();

  // Initialize attribution tracking
  useEffect(() => {
    initAttribution();
  }, []);

  // Global WhatsApp click tracker — catches ALL wa.me links site-wide
  useEffect(() => {
    const handleWhatsAppClick = (e) => {
      const link = e.target.closest('a[href*="wa.me"]');
      if (!link) return;
      const ctaLocation = link.dataset.analyticsClick || link.getAttribute('data-analytics-click') || 'global_wa_link';
      const eventData = {
        event: 'whatsapp_click',
        whatsapp_page: window.location.pathname,
        whatsapp_url: link.href,
        whatsapp_cta_text: link.textContent.trim().substring(0, 100) || link.innerText.trim().substring(0, 100) || 'unknown',
        whatsapp_type: 'global_wa_link'
      };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(enrichEvent(eventData, ctaLocation));
    };
    document.addEventListener('click', handleWhatsAppClick);
    return () => document.removeEventListener('click', handleWhatsAppClick);
  }, []);

  return (
    <Layout>
      <ClarityAnalytics />
      <BookingModal />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><Suspense fallback={<Loader />}><About /></Suspense></PageTransition>} />
          {/* Apply Page Transition to Service Hub but NOT sub-routes? 
              The problem is /services/* renders <Services/> which renders <ServiceHub/>
              So when switching from /services/protect to /services/straighten, 
              App.jsx sees a KEY change (location.pathname), so it remounts <Services/>.
              Thus <PageTransition> triggers.
          */}
          <Route path="/services/*" element={<PageTransition><Suspense fallback={<Loader />}><Services /></Suspense></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><Suspense fallback={<Loader />}><Reviews /></Suspense></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Suspense fallback={<Loader />}><Blog /></Suspense></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><Suspense fallback={<Loader />}><BlogPost /></Suspense></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Suspense fallback={<Loader />}><Contact /></Suspense></PageTransition>} />
          <Route path="/faq" element={<PageTransition><Suspense fallback={<Loader />}><FAQ /></Suspense></PageTransition>} />
          <Route path="/recall" element={<PageTransition><Suspense fallback={<Loader />}><Recall /></Suspense></PageTransition>} />
          <Route path="/join-us" element={<PageTransition><Suspense fallback={<Loader />}><JoinUs /></Suspense></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
