import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import BookingModal from './components/BookingModal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Conditions from './pages/Conditions';
import ConditionDetail from './pages/ConditionDetail';
import Reviews from './pages/Reviews';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

function App() {
  const location = useLocation();

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
          <Route path="/concerns" element={<PageTransition><Conditions /></PageTransition>} />
          <Route path="/concerns/:slug" element={<PageTransition><ConditionDetail /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
