import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import BookingModal from './components/BookingModal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Reviews from './pages/Reviews';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Recall from './pages/Recall';

function App() {
  const location = useLocation();

  // Global WhatsApp click tracker — catches ALL wa.me links site-wide
  useEffect(() => {
    const handleWhatsAppClick = (e) => {
      const link = e.target.closest('a[href*="wa.me"]');
      if (!link) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'whatsapp_click',
        whatsapp_page: window.location.pathname,
        whatsapp_url: link.href,
        whatsapp_cta_text: link.textContent.trim().substring(0, 100) || link.innerText.trim().substring(0, 100) || 'unknown',
        whatsapp_type: 'global_wa_link'
      });
    };
    document.addEventListener('click', handleWhatsAppClick);
    return () => document.removeEventListener('click', handleWhatsAppClick);
  }, []);

  return (
    <Layout>
      <BookingModal />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          {/* Apply Page Transition to Service Hub but NOT sub-routes? 
              The problem is /services/* renders <Services/> which renders <ServiceHub/>
              So when switching from /services/protect to /services/straighten, 
              App.jsx sees a KEY change (location.pathname), so it remounts <Services/>.
              Thus <PageTransition> triggers.
          */}
          <Route path="/services/*" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
          <Route path="/recall" element={<PageTransition><Recall /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
