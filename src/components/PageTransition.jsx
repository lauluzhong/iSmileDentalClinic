import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { isFirstPaint } from '../lib/firstPaint';

const PageTransition = ({ children }) => {
  const location = useLocation();
  // Check if we are going to a dark page
  const isDarkPage = location.pathname.startsWith('/services') && ! location.pathname.startsWith('/services/locations');
  // A pre-rendered page is already on screen — fading it in from opacity:0
  // would be the browser un-painting the design it just showed. Route changes
  // after hydration still animate.
  const [wasPrerendered] = useState(() => isFirstPaint());

  return (
    <motion.div
      initial={wasPrerendered ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} /* Simple fade out for exit to avoid clutter */
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ 
          gridArea: "content", 
          width: "100%", 
          zIndex: 1,
          backgroundColor: isDarkPage ? '#000' : 'var(--color-background)' 
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
