import React from 'react';
import { Link } from 'react-router-dom';
import Style from '../components/Style';

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

/**
 * Quiet language switch: real links to the same page in the other languages.
 * Used on the six translated pages and on the English /faq and /services.
 */
export const LangSwitch = ({ page, lang }) => (
  <nav className="lang-switch" aria-label={lang === 'zh' ? '语言' : lang === 'ms' ? 'Bahasa' : 'Language'}>
    {['en', 'ms', 'zh'].map((l, i) => (
      <React.Fragment key={l}>
        {i > 0 && <span aria-hidden="true" className="lang-dot">·</span>}
        {l === lang
          ? <span aria-current="page" lang={HTML_LANG[l]} className="lang-current">{LANG_LABEL[l]}</span>
          : <Link to={PAGE_PATHS[page][l]} hrefLang={HTML_LANG[l]} lang={HTML_LANG[l]}>{LANG_LABEL[l]}</Link>}
      </React.Fragment>
    ))}
    <Style>{`
      .lang-switch { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: 0 0 28px; font-size: .875rem; color: var(--color-text-grey); }
      .lang-switch a { color: var(--color-text-slate); text-decoration: none; padding: 12px 0; transition: color 180ms; }
      .lang-switch a:hover { color: var(--color-primary-teal); }
      .lang-switch .lang-current { color: var(--color-text-charcoal); font-weight: 600; padding: 12px 0; }
      .lang-switch .lang-dot { color: var(--hairline-strong); }
    `}</Style>
  </nav>
);
