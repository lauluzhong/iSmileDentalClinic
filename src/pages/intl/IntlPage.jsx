import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
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

const ContactLinks = ({ t, waHref = WA }) => (
  <div className="intl-contact">
    <a className="btn btn-primary intl-wa" href={waHref} target="_blank" rel="noopener noreferrer" data-analytics-click="intl_whatsapp">{t.cta}</a>
    <a className="quiet-link intl-tel" href={TEL}><Phone size={16} aria-hidden="true" /> {t.call} {PHONE_TEXT}</a>
  </div>
);

function Hours({ rows }) {
  return <ul className="intl-hours">{rows.map(([d, h]) => <li key={d}><span>{d}</span><span>{h}</span></li>)}</ul>;
}

function Location({ lang, L }) {
  const t = L.location;
  const waHref = WA + '?text=' + encodeURIComponent(t.waText);
  return <>
    <section className="intl-section intl-intro"><div className="container intl-narrow"><Reveal>
      <LangSwitch page="location" lang={lang} />
      <Title as="h1" parts={t.h1} />
      <p className="intl-lead">{t.intro}</p>
    </Reveal></div></section>

    <section className="intl-section"><div className="container"><FadeIn><div className="intl-split">
      <div><Title className="system-title" parts={t.aboutTitle} /><p className="intl-desc">{t.about}</p></div>
      <div className="intl-rows">{t.highlights.map(([h, p]) => <div key={h} className="intl-row"><strong>{h}</strong><span>{p}</span></div>)}</div>
    </div></FadeIn></div></section>

    <section className="intl-section"><div className="container"><Reveal>
      <Title className="system-title" parts={t.servicesTitle} />
      <p className="intl-desc">{t.servicesDesc}</p>
      <div className="intl-rows intl-gap">{t.services.map(([to, h, p]) => (
        <Link key={to} to={to} className="intl-row intl-link-row"><span className="intl-row-text"><strong>{h}</strong><span>{p}</span></span><ArrowRight size={17} aria-hidden="true" /></Link>
      ))}</div>
      <Link to={PAGE_PATHS.services[lang]} className="quiet-link intl-more">{t.allServices} <ArrowRight size={16} aria-hidden="true" /></Link>
    </Reveal></div></section>

    <section className="intl-section"><div className="container"><FadeIn>
      <Title className="system-title" parts={t.visitTitle} />
      <div className="intl-split intl-gap">
        <div className="intl-visit">
          <h3>{t.addressH}</h3>
          <p>{L.addressLines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</p>
          <div className="intl-directions">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="quiet-link">Google Maps</a>
            <a href={WAZE_URL} target="_blank" rel="noopener noreferrer" className="quiet-link">Waze</a>
          </div>
          <h3>{t.hoursH}</h3>
          <Hours rows={L.hours} />
          <h3>{L.contact.phoneLine}</h3>
          <p><a href={TEL} className="intl-phone">{PHONE_TEXT}</a> · <a href={waHref} target="_blank" rel="noopener noreferrer" className="intl-phone">WhatsApp</a></p>
          <h3>{t.parkingH}</h3>
          <ul className="intl-ticks">{t.parking.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div className="intl-map"><iframe title={t.mapTitle} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.584482197798!2d101.606!3d3.1258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4936fefe2c33%3A0x381bee2fa94d3505!2siSmile%20Dental%20Clinic%2C%2075%20%26%2075A%20Jalan%20SS%2022%2F23%2C%20Damansara%20Jaya!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy" width="100%" height="420" loading="lazy" /></div>
      </div>
    </FadeIn></div></section>

    <section className="intl-section"><div className="container intl-narrow"><FadeIn>
      <Title className="system-title" parts={t.faqTitle} />
      <FaqAccordion items={t.faq.map((f) => ({ q: f.q, a: <IntlText text={f.a} /> }))} idPrefix={'intl-loc-' + lang} analyticsLabel={'location-dj-' + lang} />
    </FadeIn></div></section>

    <section className="intl-section intl-closing"><div className="container intl-narrow"><Reveal>
      <Title className="statement" parts={t.closingTitle} />
      <p>{t.closing}</p>
      <ContactLinks t={{ cta: t.cta, call: L.contact.call }} waHref={waHref} />
    </Reveal></div></section>
  </>;
}

function Services({ lang, L }) {
  const t = L.services;
  return <>
    <section className="intl-section intl-intro"><div className="container intl-narrow"><Reveal>
      <LangSwitch page="services" lang={lang} />
      <Title as="h1" parts={t.h1} />
      <p className="intl-lead">{t.intro}</p>
    </Reveal></div></section>
    {t.groups.map((g) => (
      <section key={g.to} className="intl-section intl-tight"><div className="container"><FadeIn>
        <h2 className="intl-group-title"><Link to={g.to}>{g.title}</Link></h2>
        <div className="intl-rows">{g.items.map((it) => (
          <Link key={it.name} to={it.to} className="intl-row intl-link-row">
            <span className="intl-row-text"><strong lang={HTML_LANG[lang]}>{it.name}</strong><span lang={HTML_LANG[lang]}>{it.desc}</span></span>
            <ArrowRight size={17} aria-label={t.note} />
          </Link>
        ))}</div>
      </FadeIn></div></section>
    ))}
    <section className="intl-section intl-closing"><div className="container intl-narrow"><Reveal>
      <Title className="statement" parts={t.closingTitle} />
      <p>{t.closing}</p>
      <ContactLinks t={{ cta: t.cta, call: L.contact.call }} />
    </Reveal></div></section>
  </>;
}

function Faq({ lang, L }) {
  const t = L.faq;
  return <>
    <section className="intl-section intl-intro"><div className="container intl-narrow"><Reveal>
      <LangSwitch page="faq" lang={lang} />
      <Title as="h1" parts={t.h1} />
      <p className="intl-lead">{t.intro}</p>
    </Reveal></div></section>
    <section className="intl-section intl-tight"><div className="container intl-narrow">
      {t.sections.map((s, i) => (
        <div key={s.category} className="intl-faq-group"><FadeIn>
          <h2 className="intl-group-title">{s.category}</h2>
          <FaqAccordion items={s.questions.map((f) => ({ q: f.q, a: <IntlText text={f.a} /> }))} idPrefix={'intl-faq-' + lang + '-' + i} analyticsLabel={'faq-page-' + lang} />
        </FadeIn></div>
      ))}
    </div></section>
    <section className="intl-section intl-closing"><div className="container intl-narrow"><Reveal>
      <Title className="statement" parts={t.closingTitle} />
      <p>{t.closing}</p>
      <ContactLinks t={{ cta: t.cta, call: L.contact.call }} />
    </Reveal></div></section>
  </>;
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
        .intl-page .intl-section { padding: var(--space-section-lg) 0; }
        .intl-page .intl-tight { padding: 0 0 48px; }
        .intl-page .intl-intro { padding-top: 160px; }
        .intl-page .intl-narrow { max-width: 860px; }
        .intl-page h1 { font-size: var(--fs-h1); line-height: 1.12; letter-spacing: -0.02em; margin: 0 0 20px; text-wrap: balance; overflow-wrap: anywhere; }
        .intl-zh h1, .intl-zh .system-title, .intl-zh .statement { letter-spacing: 0; line-height: 1.3; }
        .intl-page .system-title { margin-bottom: 16px; text-wrap: balance; }
        .intl-page .intl-lead { max-width: 760px; margin: 0; font-size: var(--fs-lead); line-height: 1.65; color: var(--color-text-slate); }
        .intl-page .intl-desc { max-width: 760px; margin: 0; line-height: 1.7; color: var(--color-text-slate); }
        .intl-page .intl-split { display: grid; grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr); gap: clamp(40px,7vw,96px); align-items: start; }
        .intl-page .intl-gap { margin-top: 32px; }
        .intl-page .intl-rows { border-top: 1px solid var(--hairline); }
        .intl-page .intl-row { display: grid; gap: 6px; padding: 20px 0; border-bottom: 1px solid var(--hairline); }
        .intl-page .intl-row strong { font-family: var(--font-heading); font-weight: 700; color: var(--color-text-charcoal); }
        .intl-page .intl-row span, .intl-page .intl-row-text span { color: var(--color-text-slate); line-height: 1.55; }
        .intl-page .intl-row-text { display: grid; gap: 6px; min-width: 0; }
        .intl-page .intl-link-row { grid-template-columns: 1fr auto; align-items: center; gap: 16px; text-decoration: none; transition: background-color 180ms; }
        .intl-page .intl-link-row:hover { background: var(--color-tint-faint); }
        .intl-page .intl-link-row svg { color: var(--color-primary-teal); flex: none; }
        .intl-page .intl-more { display: inline-flex; align-items: center; gap: 7px; margin-top: 28px; min-height: 44px; }
        .intl-page .intl-group-title { font-size: 1.35rem; margin: 0 0 16px; }
        .intl-page .intl-group-title a { color: inherit; text-decoration: none; }
        .intl-page .intl-faq-group { margin-bottom: 56px; }
        .intl-page .intl-faq-group .faq-accordion { max-width: none; margin: 0; }
        .intl-page .faq-accordion { margin-top: 24px; }
        .intl-page .intl-visit h3 { margin: 36px 0 14px; font-size: 1.15rem; }
        .intl-page .intl-visit h3:first-child { margin-top: 0; }
        .intl-page .intl-visit > p { margin: 0 0 16px; color: var(--color-text-slate); line-height: 1.65; }
        .intl-page .intl-directions { display: flex; flex-wrap: wrap; gap: 20px; }
        .intl-page .intl-directions a { min-height: 44px; display: inline-flex; align-items: center; }
        .intl-page .intl-hours { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--hairline); }
        .intl-page .intl-hours li { display: flex; justify-content: space-between; gap: 20px; padding: 13px 0; border-bottom: 1px solid var(--hairline); color: var(--color-text-slate); }
        .intl-page .intl-hours li span:first-child { font-family: var(--font-heading); font-weight: 700; color: var(--color-text-charcoal); }
        .intl-page .intl-ticks { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; color: var(--color-text-slate); }
        .intl-page .intl-ticks li { display: grid; grid-template-columns: 15px 1fr; gap: 9px; }
        .intl-page .intl-ticks li::before { content: '✓'; color: var(--color-primary-teal); font-weight: 700; }
        .intl-page .intl-phone { color: var(--color-primary-teal); font-weight: 700; text-decoration: none; display: inline-block; padding: 10px 0; }
        .intl-page .intl-map { overflow: hidden; border-radius: 26px; }
        .intl-page .intl-map iframe { display: block; border: 0; }
        .intl-page .intl-closing { text-align: center; }
        .intl-page .intl-closing .statement { margin: 0 auto 18px; }
        .intl-page .intl-closing p { max-width: 620px; margin: 0 auto; color: var(--color-text-slate); line-height: 1.7; }
        .intl-page .intl-contact { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 28px; }
        .intl-page .intl-wa { text-decoration: none; }
        .intl-page .intl-tel { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; }
        @media (max-width: 1024px) { .intl-page .intl-intro { padding-top: 120px; } .intl-page .intl-split { grid-template-columns: 1fr; gap: 40px; } }
        @media (max-width: 700px) { .intl-page .intl-hours li { flex-direction: column; align-items: flex-start; gap: 2px; } .intl-page .intl-map iframe { height: 300px; } }
        @media (max-width: 480px) { .intl-page .intl-section { padding: 56px 0; } .intl-page .intl-tight { padding: 0 0 32px; } .intl-page .intl-intro { padding-top: 112px; } .intl-page .intl-wa { width: 100%; min-height: 48px; } }
      `}</Style>
    </div>
  );
}
