import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { BookingProvider } from './context/BookingContext';
import App from './App.jsx';

/**
 * Build-time render of a route into the exact markup the client will hydrate.
 * Mirrors main.jsx's provider stack — any difference between the two shows up
 * as a hydration mismatch, which makes React throw the pre-rendered DOM away
 * and re-render from scratch (i.e. the flash comes back).
 *
 * index.css is deliberately NOT imported here: the client build already emits
 * the stylesheet and links it in <head>. Component-level <style> tags render
 * into the markup on their own, so the pre-rendered HTML is styled with or
 * without the external sheet.
 */
export function render(url = '/') {
  return renderToString(
    <HelmetProvider context={{}}>
      <StaticRouter location={url}>
        <BookingProvider>
          <App />
        </BookingProvider>
      </StaticRouter>
    </HelmetProvider>
  );
}
