import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Scroll-reveal helpers.
// Tamed per mobile redesign: short durations (<=0.4s), small y-offsets,
// trigger once, and fully respect prefers-reduced-motion (render visible
// immediately, no opacity-0 start).
export const Reveal = ({ children, width = "100%", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div style={{ width }}>{children}</div>;
  }

  return (
    <div ref={ref} style={{ position: "relative", width }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const FadeIn = ({ children, delay = 0, duration = 0.35, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: Math.min(duration, 0.4), delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
