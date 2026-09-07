import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { isFirstPaint } from '../lib/firstPaint';

const PageTransition = ({ children }) => {
  // Check if we are going to a dark page
  // No dark pages remain after the 8 Sep 2026 design sweep — every route
  // opens light, so the transition ground is always the page ground.
  // A pre-rendered page is already on screen — fading it in from opacity:0
  // would be the browser un-painting the design it just showed. Route changes
  // after hydration still animate.
  const [wasPrerendered] = useState(() => isFirstPaint());

  return (
    <motion.div
      initial={wasPrerendered ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} /* Simple fade out for exit to avoid clutter */
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
          gridArea: "content", 
          width: "100%", 
          zIndex: 1,
          backgroundColor: 'var(--color-background)' 
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
