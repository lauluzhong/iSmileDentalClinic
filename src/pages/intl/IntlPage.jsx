import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Button from '../../components/Button';
import { enrichEvent } from '../../lib/attribution';
import { FAQ_CSS, SERVICES_LANDING_CSS, LOCATION_CSS } from '../../styles/pageStyles';
import { Reveal, FadeIn } from '../../components/Reveal';
import FaqAccordion from '../../components/FaqAccordion';
import Style from '../../components/Style';
import {
  CONTENT, CLINIC, PAGE_PATHS, HTML_LANG, LANG_LABEL, SITE,
  PHONE_TEXT, TEL, WA, MAPS_URL, WAZE_URL,
} from '../../i18n/intlContent';
import { hreflangLinks, LangSwitch } from '../../i18n/intlRoutes.jsx';

/**
 * Malay and Chinese versions of the location, services and FAQ pages.
 * One component, three layouts, all words from i18n/intlContent.js.
 * Pre-rendered at build time (scripts/prerender-home.js) so the translated
 * text, title, canonical and hreflang are in the HTML itself.
 */

// Headline parts: odd entries are the accent phrase.
const Title = ({ parts, as: Tag = 'h2', className }) => (
  <Tag className={className}>{parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : <React.Fragment key={i}>{p}</React.Fragment>))}</Tag>
);

// Makes the clinic phone number in any sentence a tappable tel: link.
const IntlText = ({ text }) => {
  const bits = text.split(PHONE_TEXT);
  return <>{bits.map((b, i) => (
    <React.Fragment key={i}>{b}{i < bits.length - 1 && <a href={TEL} className="intl-phone">{PHONE_TEXT}</a>}</React.Fragment>
  ))}</>;
};

const clinicSchema = {
  '@type': 'Dentist',
  '@id': SITE + '/#dentist',
  name: CLINIC.name,
  url: SITE + '/',
  telephone: CLINIC.telephone,
  image: SITE + '/logo.png',
  address: { '@type': 'PostalAddress', streetAddress: CLINIC.street, addressLocality: CLINIC.locality, addressRegion: CLINIC.region, postalCode: CLINIC.postcode, addressCountry: CLINIC.country },
  geo: { '@type': 'GeoCoordinates', latitude: CLINIC.lat, longitude: CLINIC.lng },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '17:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:30', closes: '15:30' },
  ],
};

const faqSchema = (items, inLanguage) => ({
  '@type': 'FAQPage',
  inLanguage,
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

function Head({ page, lang, c }) {
  const url = SITE + PAGE_PATHS[page][lang];
  const inLanguage = HTML_LANG[lang];
  const graph = [
    { '@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage, about: { '@id': SITE + '/#dentist' }, isPartOf: { '@type': 'WebSite', url: SITE + '/', name: CLINIC.name } },
    clinicSchema,
  ];
  if (page === 'location') graph.push(faqSchema(c.faq, inLanguage));
  if (page === 'faq') graph.push(faqSchema(c.sections.flatMap((s) => s.questions), inLanguage));
  return (
    <Helmet htmlAttributes={{ lang: inLanguage }}>
      <title>{c.title}</title>
      <meta name="description" content={c.description} />
      <link rel="canonical" href={url} />
      {hreflangLinks(page)}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={c.title} />
      <meta property="og:description" content={c.description} />
      <meta property="og:image" content={SITE + '/og-image.png'} />
      <meta property="og:locale" content={lang === 'ms' ? 'ms_MY' : 'zh_CN'} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={c.title} />
      <meta property="twitter:description" content={c.description} />
      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
    </Helmet>
  );
}

const openWa = (href, label) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(enrichEvent({ event: 'whatsapp_click', whatsapp_page: window.location.pathname, whatsapp_cta_text: label, whatsapp_type: 'intl_page_cta' }, 'intl_page_cta'));
  window.open(href, '_blank');
};

const DirIcon = ({ src }) => <img src={src} alt="" loading="lazy" width="16" height="16" />;

// Mirrors src/pages/locations/DamansaraJaya.jsx (same classes, same CSS).
function Location({ lang, L }) {
  const t = L.location;
  const e = t.eyebrows;
  const waHref = WA + '?text=' + encodeURIComponent(t.waText);
  return <div className="location-page">
    <section className="loc-section loc-intro"><div className="container loc-narrow"><Reveal>
      <LangSwitch page="location" lang={lang} />
      <Title as="h1" parts={t.h1} />
      <p className="loc-intro-copy">{t.intro}</p>
    </Reveal></div></section>
    <section className="loc-section"><div className="container"><FadeIn><div className="loc-about-grid">
      <div><Title className="system-title" parts={t.aboutTitle} /><p className="loc-section-desc">{t.about}</p></div>
      <div className="loc-row-list">{t.highlights.map(([h, p]) => <div key={h} className="hairline-row loc-highlight"><strong>{h}</strong><span>{p}</span></div>)}</div>
    </div></FadeIn></div></section>
    <section className="loc-section"><div className="container"><Reveal>
      <p className="eyebrow">{e.services}</p>
      <Title className="system-title" parts={t.servicesTitle} />
      <p className="loc-section-desc">{t.servicesDesc}</p>
      <div className="loc-row-list loc-services-list">{t.services.map(([to, h, p]) => (
        <Link key={to} to={to} className="hairline-row loc-service"><span className="loc-service-text"><strong>{h}</strong><span>{p}</span></span><ArrowRight size={17} /></Link>
      ))}</div>
      <Link to={PAGE_PATHS.services[lang]} className="quiet-link loc-review-link">{t.allServices} <ArrowRight size={16} /></Link>
    </Reveal></div></section>
    <section className="loc-section"><div className="container"><FadeIn>
      <p className="eyebrow">{e.visit}</p>
      <Title className="system-title" parts={t.visitTitle} />
      <div className="loc-info-grid"><div className="loc-visit-details">
        <h3>{t.addressH}</h3>
        <p>{L.addressLines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</p>
        <div className="loc-direction-links">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="quiet-link direction-link"><DirIcon src="/images/google-maps.png" /> Google Maps</a>
          <a href={WAZE_URL} target="_blank" rel="noopener noreferrer" className="quiet-link direction-link"><DirIcon src="/images/waze.png" /> Waze</a>
        </div>
        <h3>{t.hoursH}</h3>
        <ul className="loc-hours-list">{L.hours.map(([d, h]) => <li key={d}><span>{d}</span><span>{h}</span></li>)}</ul>
        <h3>{L.contact.phoneLine}</h3>
        <p><a href={TEL} className="quiet-link">{PHONE_TEXT}</a> · <a href={waHref} target="_blank" rel="noopener noreferrer" className="quiet-link">WhatsApp</a></p>
        <h3>{t.parkingH}</h3>
        <ul className="loc-parking-list">{t.parking.map((p) => <li key={p}>{p}</li>)}</ul>
      </div>
      <div className="loc-map-wrapper"><iframe title={t.mapTitle} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.584482197798!2d101.606!3d3.1258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4936fefe2c33%3A0x381bee2fa94d3505!2siSmile%20Dental%20Clinic%2C%2075%20%26%2075A%20Jalan%20SS%2022%2F23%2C%20Damansara%20Jaya!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy" width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" /></div>
      </div>
    </FadeIn></div></section>
    <section className="loc-section"><div className="container loc-narrow"><FadeIn>
      <p className="eyebrow">{e.faq}</p>
      <Title className="system-title" parts={t.faqTitle} />
      <FaqAccordion items={t.faq.map((f) => ({ q: f.q, a: <IntlText text={f.a} /> }))} idPrefix={'loc-dj-' + lang} analyticsLabel={'location-dj-' + lang} />
    </FadeIn></div></section>
    <section className="loc-section loc-closing"><div className="container loc-narrow"><Reveal>
      <p className="eyebrow">{e.closing}</p>
      <Title className="statement" parts={t.closingTitle} />
      <p>{t.closing}</p>
      <span className="loc-closing-rule" aria-hidden="true" />
      <Button onClick={() => openWa(waHref, t.cta)}>{t.cta}</Button>
      <p className="loc-final-phone">{L.contact.orCall} <a href={TEL} className="intl-phone"><strong>{PHONE_TEXT}</strong></a></p>
    </Reveal></div></section>
    <Style>{LOCATION_CSS}</Style>
  </div>;
}

// Mirrors src/pages/ServicesLanding.jsx: numbered hairline rows per category.
function Services({ lang, L }) {
  const t = L.services;
  return <div className="services-landing">
    <section className="sl-hero"><div className="container"><div className="sl-hero-inner">
      <LangSwitch page="services" lang={lang} />
      <Reveal width="100%"><span className="eyebrow">{t.eyebrows.hero}</span></Reveal>
      <Reveal width="100%"><Title as="h1" className="sl-title" parts={t.h1} /></Reveal>
      <Reveal delay={0.2} width="100%"><p className="sl-lead">{t.intro}</p></Reveal>
    </div></div></section>
    <div className="container sl-directory-wrap">
      <div className="sl-directory">
        {t.groups.map((g, index) => (
          <FadeIn key={g.to} delay={index * 0.08} className="sl-cat">
            <div className="sl-cat-grid">
              <span className="sl-cat-num">{String(index + 1).padStart(2, '0')}</span>
              <div className="sl-cat-body">
                <Link to={g.to} className="sl-cat-row">
                  <span className="sl-cat-head"><h3 className="sl-cat-title">{g.title}</h3><span className="sl-cat-line">{g.line}</span></span>
                  <ArrowRight size={22} className="sl-cat-arrow" />
                </Link>
                <ul className="sl-cat-links">{g.items.map((it) => (
                  <li key={it.name}>{it.to !== g.to
                    ? <Link to={it.to} className="sl-treatment-link">{it.name}<ArrowUpRight size={13} className="sl-treatment-arrow" /></Link>
                    : <span className="sl-treatment">{it.name}</span>}</li>
                ))}</ul>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className="sl-cta"><FadeIn>
        <span className="eyebrow">{t.eyebrows.closing}</span>
        <Title className="statement" parts={t.closingTitle} />
        <p className="intl-cta-copy">{t.closing}</p>
        <div className="sl-cta-action"><Button onClick={() => openWa(WA, t.cta)}>{t.cta}</Button></div>
      </FadeIn></div>
    </div>
    <Style>{SERVICES_LANDING_CSS}</Style>
  </div>;
}

// Mirrors src/pages/FAQ.jsx.
function Faq({ lang, L }) {
  const t = L.faq;
  return <div className="page-container faq-page">
    <main className="container section-padding faq-container">
      <header className="faq-heading">
        <LangSwitch page="faq" lang={lang} />
        <Reveal><p className="eyebrow">{t.eyebrows.hero}</p><Title as="h1" className="statement" parts={t.h1} /></Reveal>
        <Reveal delay={0.1}><p className="faq-lead">{t.intro}</p></Reveal>
      </header>
      <div className="faq-content">
        {t.sections.map((s, i) => (
          <section key={s.category} className="faq-section">
            <FadeIn delay={i * 0.1}><p className="eyebrow">{s.category}</p><FaqAccordion items={s.questions.map((f) => ({ q: f.q, a: <IntlText text={f.a} /> }))} idPrefix={'faq-' + lang + '-' + i} analyticsLabel={'faq-page-' + lang} /></FadeIn>
          </section>
        ))}
      </div>
      <section className="still-questions">
        <FadeIn><p className="eyebrow">{t.eyebrows.closing}</p><Title className="statement" parts={t.closingTitle} /><p>{t.closing}</p><Button onClick={() => openWa(WA, t.cta)}>{t.cta}</Button></FadeIn>
      </section>
    </main>
    <Style>{FAQ_CSS}</Style>
  </div>;
}

const LAYOUTS = { location: Location, services: Services, faq: Faq };

export default function IntlPage({ page, lang }) {
  const L = CONTENT[lang];
  const Body = LAYOUTS[page];
  useEffect(() => { window.scrollTo(0, 0); }, [page, lang]);
  return (
    <div className={'intl-page intl-' + lang} lang={HTML_LANG[lang]}>
      <Head page={page} lang={lang} c={L[page]} />
      <Body lang={lang} L={L} />
      <Style>{`
        .intl-page .intl-phone { color: var(--color-primary-teal); text-decoration: none; }
        .intl-page .faq-page .intl-phone { font-weight: 700; }
        .intl-page .intl-cta-copy { max-width: 560px; margin: 0 auto 8px; color: var(--color-text-slate); line-height: 1.7; }
        .intl-zh h1, .intl-zh .system-title, .intl-zh .statement, .intl-zh .sl-title { letter-spacing: 0; }
      `}</Style>
    </div>
  );
}
