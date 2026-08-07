import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { isFirstPaint } from "../lib/firstPaint";

// Scroll-reveal helpers.
// Tamed per mobile redesign: short durations (<=0.4s), small y-offsets,
// trigger once, and fully respect prefers-reduced-motion (render visible
// immediately, no opacity-0 start).
//
// Both helpers render ONE DOM shape whatever the motion settings are, and only
// vary the motion props. Branching on useReducedMotion to return a different
// element tree would mismatch during hydration for reduced-motion users, since
// the build-time render can't know their setting.

const SHOWN = { opacity: 1, y: 0 };
const REVEAL_HIDDEN = { opacity: 0, y: 24 };
const FADE_HIDDEN = { opacity: 0, y: 16 };
const INSTANT = { duration: 0 };

export const Reveal = ({ children, width = "100%", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const prefersReducedMotion = useReducedMotion();
  // Frozen per instance: pre-rendered content must never play its entrance.
  const [wasPrerendered] = useState(() => isFirstPaint());
  const skip = wasPrerendered || prefersReducedMotion;

  return (
    <div ref={ref} style={{ position: "relative", width }}>
      <motion.div
        initial={skip ? false : REVEAL_HIDDEN}
        animate={skip || isInView ? SHOWN : REVEAL_HIDDEN}
        transition={skip ? INSTANT : { duration: 0.4, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const FadeIn = ({ children, delay = 0, duration = 0.35, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  const [wasPrerendered] = useState(() => isFirstPaint());
  const skip = wasPrerendered || prefersReducedMotion;

  return (
    <motion.div
      className={className}
      initial={skip ? false : FADE_HIDDEN}
      animate={skip ? SHOWN : undefined}
      whileInView={skip ? undefined : SHOWN}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={skip ? INSTANT : { duration: Math.min(duration, 0.4), delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
