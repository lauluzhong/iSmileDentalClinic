import React, { useEffect, useState } from 'react';
import Style from './Style';

/**
 * Route loading state: a hairline progress line along the very top edge of
 * the viewport, above the fixed header.
 *
 * Why not the old centred spinner: the header is fixed and ~80px tall, and a
 * 200px-tall centred spinner put the ring right under the nav text. A line
 * on the top edge is the one place on the page that can never collide with
 * anything, and it is where visitors already expect progress (browsers,
 * YouTube, GitHub).
 *
 * Delayed 300ms: with chunk prefetching (lib/routeChunks.js) most route
 * changes resolve well inside that, so nothing flashes for fast loads.
 *
 * The fallback also keeps the content column tall: .main-content already
 * reserves 100vh, so the footer does not jump up and back down while the
 * chunk arrives.
 *
 * Reduced motion: the line is still shown, but held still at 60% instead of
 * sweeping (the site-wide reduced-motion rule kills the keyframes anyway).
 */
const Loader = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="route-loading" aria-busy="true">
      {show && (
        <div className="route-loading-line" role="progressbar" aria-label="Loading page">
          <span />
        </div>
      )}
      <Style>{`
        .route-loading { min-height: 100vh; width: 100%; }
        .route-loading-line {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          z-index: 1001; /* above .header (1000) */
          background: rgba(0, 141, 176, 0.12);
          overflow: hidden;
          pointer-events: none;
        }
        .route-loading-line span {
          position: absolute;
          top: 0; bottom: 0; left: 0;
          width: 40%;
          background: var(--color-primary-teal);
          transform-origin: left;
          animation: route-loading-sweep 1.1s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @keyframes route-loading-sweep {
          0%   { transform: translateX(-100%) scaleX(0.6); }
          60%  { transform: translateX(120%) scaleX(1); }
          100% { transform: translateX(260%) scaleX(0.6); }
        }
        @media (prefers-reduced-motion: reduce) {
          .route-loading-line span { animation: none; width: 60%; transform: none; }
        }
      `}</Style>
    </div>
  );
};

export default Loader;
