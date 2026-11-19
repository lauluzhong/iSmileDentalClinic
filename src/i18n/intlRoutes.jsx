import React from 'react';

/**
 * URLs of the Malay and Chinese pages and their English originals. Kept apart
 * from intlContent.js so App.jsx and the English pages can import the routes
 * and hreflang links without pulling every translated word into their bundle.
 */
/** The three language versions of each page. `en` paths are the existing English pages. */
export const PAGE_PATHS = {
  location: { en: '/services/locations/damansara-jaya', ms: '/ms/damansara-jaya', zh: '/zh/damansara-jaya' },
  services: { en: '/services', ms: '/ms/perkhidmatan', zh: '/zh/services' },
  faq: { en: '/faq', ms: '/ms/soalan-lazim', zh: '/zh/faq' },
};

export const HTML_LANG = { en: 'en', ms: 'ms', zh: 'zh-Hans' };
export const LANG_LABEL = { en: 'English', ms: 'Bahasa Malaysia', zh: '中文' };

/** Every new URL, for the router, the build-time render and the sitemap. */
export const INTL_ROUTES = Object.entries(PAGE_PATHS).flatMap(([page, p]) =>
  ['ms', 'zh'].map((lang) => ({ page, lang, path: p[lang] })));


const SITE = 'https://ismile.com.my';

/** hreflang alternates for one page in all three languages plus x-default (English). */
export const hreflangLinks = (page) => [
  ...['en', 'ms', 'zh'].map((l) => <link key={l} rel="alternate" hrefLang={HTML_LANG[l]} href={SITE + PAGE_PATHS[page][l]} />),
  <link key="x" rel="alternate" hrefLang="x-default" href={SITE + PAGE_PATHS[page].en} />,
];
