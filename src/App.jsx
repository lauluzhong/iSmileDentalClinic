import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import BookingModal from './components/BookingModal';
import CtaPrompt from './components/CtaPrompt';
import ClarityAnalytics from './components/Analytics/ClarityAnalytics';
import Loader from './components/Loader';
import { initAttribution, enrichEvent } from './lib/attribution';
import { endFirstPaint } from './lib/firstPaint';
import { pageLoaders, installRoutePrefetch } from './lib/routeChunks';

// Primary pages (synchronous)
import Home from './pages/Home';

// Every other page is lazy-loaded to keep the initial bundle light. The
// loaders live in lib/routeChunks.js so link hover/idle prefetch warms the
// exact same chunks.
const About = lazy(pageLoaders.about);
const Services = lazy(pageLoaders.services);
const Reviews = lazy(pageLoaders.reviews);
const Blog = lazy(pageLoaders.blog);
const BlogPost = lazy(pageLoaders.blogPost);
const Contact = lazy(pageLoaders.contact);
const FAQ = lazy(pageLoaders.faq);
const Recall = lazy(pageLoaders.recall);
const Careers = lazy(pageLoaders.careers);
const CareersDentists = lazy(pageLoaders.careersDentists);
const CareersTeam = lazy(pageLoaders.careersTeam);
const CareersJob = lazy(pageLoaders.careersJob);
const Dentists = lazy(pageLoaders.dentists);
const Privacy = lazy(pageLoaders.privacy);
const DataDeletion = lazy(pageLoaders.dataDeletion);
const NotFound = lazy(pageLoaders.notFound);

function App() {
  const location = useLocation();

  // The pre-rendered markup is on screen and hydrated by the time this runs,
  // so anything mounting from here on is a genuine client render and animates.
  useEffect(() => {
    endFirstPaint();
  }, []);

  // Initialize attribution tracking
  useEffect(() => {
    initAttribution();
  }, []);

  // Warm lazy page chunks on link intent and on idle, so the route loading
  // line (Loader.jsx) rarely has to appear.
  useEffect(() => installRoutePrefetch(), []);

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
      <CtaPrompt />
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
          <Route path="/dentists/*" element={<PageTransition><Suspense fallback={<Loader />}><Dentists /></Suspense></PageTransition>} />
          <Route path="/services/*" element={<PageTransition><Suspense fallback={<Loader />}><Services /></Suspense></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><Suspense fallback={<Loader />}><Reviews /></Suspense></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Suspense fallback={<Loader />}><Blog /></Suspense></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><Suspense fallback={<Loader />}><BlogPost /></Suspense></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Suspense fallback={<Loader />}><Contact /></Suspense></PageTransition>} />
          <Route path="/faq" element={<PageTransition><Suspense fallback={<Loader />}><FAQ /></Suspense></PageTransition>} />
          <Route path="/recall" element={<PageTransition><Suspense fallback={<Loader />}><Recall /></Suspense></PageTransition>} />
          {/* /join-us moved into the Careers hub (5 Nov 2026); vercel.json 301s it too. */}
          <Route path="/join-us" element={<Navigate to="/careers/dentists" replace />} />
          <Route path="/careers" element={<PageTransition><Suspense fallback={<Loader />}><Careers /></Suspense></PageTransition>} />
          <Route path="/careers/dentists" element={<PageTransition><Suspense fallback={<Loader />}><CareersDentists /></Suspense></PageTransition>} />
          <Route path="/careers/team" element={<PageTransition><Suspense fallback={<Loader />}><CareersTeam /></Suspense></PageTransition>} />
          <Route path="/careers/:slug" element={<PageTransition><Suspense fallback={<Loader />}><CareersJob /></Suspense></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Suspense fallback={<Loader />}><Privacy /></Suspense></PageTransition>} />
          <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/data-deletion" element={<PageTransition><Suspense fallback={<Loader />}><DataDeletion /></Suspense></PageTransition>} />
          <Route path="*" element={<PageTransition><Suspense fallback={<Loader />}><NotFound /></Suspense></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
