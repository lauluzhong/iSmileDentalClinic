import { useBooking } from '../context/BookingContext';
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Button from '../components/Button';
import RelatedReading from '../components/RelatedReading';
import ResponsiveImage from '../components/ResponsiveImage';
import { Reveal, FadeIn } from '../components/Reveal';
import Style from '../components/Style';
import { servicesData } from '../data/servicesData';
import ServicesLanding from './ServicesLanding';
import { Helmet } from 'react-helmet-async';
import Loader from '../components/Loader';

// Lazy-loaded Specialty Pages
const WisdomToothSurgery = lazy(() => import('./specialties/WisdomToothSurgery'));
const ClearAligners = lazy(() => import('./specialties/ClearAligners'));
const DentalImplants = lazy(() => import('./specialties/DentalImplants'));
const TeethWhitening = lazy(() => import('./specialties/TeethWhitening'));
const RootCanalTreatment = lazy(() => import('./specialties/RootCanalTreatment'));
const MyofunctionalOrthodontics = lazy(() => import('./specialties/MyofunctionalOrthodontics'));
const CosmeticDentistry = lazy(() => import('./specialties/CosmeticDentistry'));
const PediatricDentistry = lazy(() => import('./specialties/PediatricDentistry'));

// Lazy-loaded Location Pages
const DamansaraJaya = lazy(() => import('./locations/DamansaraJaya'));

import ServiceGuide from '../components/ServiceGuide';

// The one serif-italic accent phrase per headline (design contract). The data
// strings stay untouched; the accent is a render-time split so the visible
// words are byte-identical to servicesData.
const HERO_ACCENTS = {
    protect: 'For Life.',
    straighten: 'Every Smile.',
    replace: 'Smile Again.',
    enhance: 'Dream Smile.',
    children: 'Smiles & Airways.'
};
const EXPERIENCE_ACCENTS = {
    protect: 'Long-Term Care',
    straighten: '3D Scanning',
    replace: 'Confidence',
    enhance: 'Unique Face',
    children: 'Airways & Smiles'
};

// Wraps `accent` (a trailing phrase of `text`) in <em>. Falls back to the
// plain string if the phrase is not found, so copy edits can never crash.
const withAccent = (text, accent) => {
    if (!accent || !text.endsWith(accent)) return text;
    const head = text.slice(0, text.length - accent.length);
    return (<>{head}<em>{accent}</em></>);
};

const ServiceHub = () => {
    const { openBooking } = useBooking();
    const { category } = useParams();
    const location = useLocation();

    // Handle hash scrolling from footer link
    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const element = document.getElementById(location.hash.replace('#', ''));
                if (element) {
                    // Clearance for the fixed header only — the old 200 also
                    // padded for the tall dark hero, which is gone.
                    const headerOffset = 140;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }, 500);
        }
    }, [location]);
    const data = servicesData[category];

    if (!data) return <div className="container section-padding">Service not found</div>;

    // Focal point for each category photo (was the hero background-position)
    const getImgPosition = (cat) => {
        const positions = {
            protect: '60% 30%',
            straighten: 'center 25%',
            children: 'center 30%',
            enhance: 'center 30%',
            replace: '70% 30%'
        };
        return positions[cat] || 'center center';
    };

    // SEO data for each service category
    const seoData = {
        protect: { title: "Root Canal & Wisdom Tooth Surgery, PJ | iSmile", desc: "Protect & repair your teeth at iSmile Damansara Jaya, Petaling Jaya — check-ups, root canal treatment & wisdom tooth surgery. WhatsApp us to book.", canonical: "https://ismile.com.my/services/protect" },
        straighten: { title: "Braces & Clear Aligners in Petaling Jaya | iSmile", desc: "Straighten your teeth at our Damansara Jaya clinic — braces & clear aligners for adults and teens. Rated 4.8★ on Google. WhatsApp us to book.", canonical: "https://ismile.com.my/services/straighten" },
        replace: { title: "Dental Implants & Dentures in Petaling Jaya | iSmile", desc: "Replace missing teeth at iSmile Damansara Jaya — implants, bridges & dentures from a family practice serving PJ since 2006. WhatsApp us to book.", canonical: "https://ismile.com.my/services/replace" },
        enhance: { title: "Teeth Whitening & Veneers in Petaling Jaya | iSmile", desc: "Cosmetic dentistry at our Damansara Jaya clinic — teeth whitening, veneers & smile makeovers. Rated 4.8★ from 91 Google reviews. WhatsApp us to book.", canonical: "https://ismile.com.my/services/enhance" },
        children: { title: "Children's Dentistry in Petaling Jaya | iSmile", desc: "Children's dental care in Damansara Jaya, PJ — first visits, check-ups & preventive care from a family practice since 2006. WhatsApp us to book.", canonical: "https://ismile.com.my/services/children" }
    };
    const seo = seoData[category] || { title: "Dental Services in Petaling Jaya | iSmile Dental Clinic", desc: "Comprehensive family dental care in Damansara Jaya, Petaling Jaya — from check-ups to implants. WhatsApp us to book.", canonical: "https://ismile.com.my/services" };

    const benefitsList = data.experience.benefits || null;
    const comparisonList = data.experience.comparison || null;

    return (
        <div className="service-hub">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.desc} />
                <link rel="canonical" href={seo.canonical} />
            </Helmet>

            {/* Hero — light, editorial: label, statement, lead, bare photo */}
            <section className="hub-hero-light">
                <div className="container hub-hero-grid">
                    <div className="hub-hero-copy">
                        <span className="eyebrow">{data.displayTitle}</span>
                        <h1 className="hub-title">{withAccent(data.hero, HERO_ACCENTS[category])}</h1>
                        <p className="hub-lead">{data.description}</p>
                    </div>
                    <div className="hub-hero-photo">
                        <ResponsiveImage
                            src={`/images/service_${category}.png`}
                            alt={data.displayTitle}
                            sizes="(max-width: 1024px) 92vw, 520px"
                            loading="eager"
                            style={{ objectPosition: getImgPosition(category) }}
                        />
                    </div>
                </div>
            </section>

            {/* Key Services — hairline rows — and the Tier 1 spotlight */}
            <div className="container hub-services-section">
                <FadeIn>
                    <h3 className="system-title hub-services-title">Key Services</h3>
                    <ul className="hub-service-list">
                        {data.services.map((item, i) => (
                            <li key={i} className="hub-service-row">
                                <div className="hub-service-main">
                                    {item.path ? (
                                        <Link to={item.path} className="hub-service-name hub-service-name-link">
                                            {item.name}
                                            <ArrowUpRight size={16} className="hub-service-arrow" />
                                        </Link>
                                    ) : (
                                        <span className="hub-service-name">{item.name}</span>
                                    )}
                                    <p className="hub-service-desc">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </FadeIn>

                <FadeIn delay={0.15}>
                    <div className="hub-tier1">
                        <span className="eyebrow">Most asked about</span>
                        <Link to={data.tier1.path} className="hub-tier1-title-link">
                            <h3 className="hub-tier1-title">{data.tier1.title}</h3>
                        </Link>
                        <p className="hub-tier1-desc">{data.tier1.desc}</p>
                        <Link to={data.tier1.path} className="quiet-link">
                            Learn More <ArrowRight size={16} />
                        </Link>
                    </div>
                </FadeIn>
            </div>

            {/* Experience — title + lead on the left, hairline list on the right */}
            <div className="hub-experience">
                <div className="container hub-experience-grid">
                    <div className="hub-experience-copy">
                        <Reveal width="100%">
                            <h2 className="system-title">{withAccent(data.experience.title, EXPERIENCE_ACCENTS[category])}</h2>
                        </Reveal>
                        <Reveal delay={0.15} width="100%">
                            <p className="hub-experience-lead">{data.experience.desc}</p>
                        </Reveal>
                    </div>
                    <div className="hub-experience-list-wrap">
                        {benefitsList && (
                            <ul className="hub-experience-list">
                                {benefitsList.map((feat, i) => (
                                    <li key={i} className="hub-experience-item">{feat}</li>
                                ))}
                            </ul>
                        )}
                        {comparisonList && (
                            <>
                                <h3 className="hub-comparison-title">{data.experience.visualTitle}</h3>
                                <ul className="hub-experience-list">
                                    {comparisonList.map((row, i) => (
                                        <li key={i} className="hub-experience-item">
                                            <strong>{row.label}:</strong> {row.text}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ServiceGuide category={category} />

            {/* CTA */}
            <div className="container hub-cta">
                <FadeIn>
                    <h2 className="statement">Ready for a <em>healthier smile?</em></h2>
                    <div className="hub-cta-action">
                        <Button onClick={() => openBooking(`Interested in ${data.title.split("\n")[0]}`, "services-hub-cta")}>Book Consultation</Button>
                    </div>
                </FadeIn>
            </div>

            <RelatedReading pathKey={`services/${category}`} />

            <Style>{`
                /* ---------- Hero ---------- */
                .hub-hero-light { padding: 170px 0 40px; }
                .hub-hero-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
                    gap: 56px;
                    align-items: center;
                }
                .hub-hero-copy { min-width: 0; }
                .hub-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: var(--fs-statement);
                    line-height: 1.06;
                    letter-spacing: -0.03em;
                    color: var(--color-text-charcoal);
                    margin: 0 0 20px;
                    text-wrap: balance;
                }
                .hub-lead {
                    font-size: var(--fs-lead);
                    color: var(--color-text-slate);
                    line-height: 1.65;
                    margin: 0;
                    max-width: 480px;
                }
                .hub-hero-photo {
                    min-width: 0;
                    border-radius: 26px;
                    overflow: hidden;
                    aspect-ratio: 4 / 3;
                }
                .hub-hero-photo picture,
                .hub-hero-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                /* ---------- Key Services + Tier 1 ---------- */
                .hub-services-section { padding: var(--space-section-lg) 20px 0; }
                .hub-services-title { margin-bottom: 8px; }
                .hub-service-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    border-top: 1px solid var(--hairline);
                }
                .hub-service-row {
                    position: relative;
                    border-bottom: 1px solid var(--hairline);
                    overflow: hidden;
                }
                .hub-service-row::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    background: linear-gradient(90deg, rgba(0,141,176,0.08) 0%, rgba(0,141,176,0.02) 62%, rgba(0,141,176,0) 100%);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.75s var(--ease-slow);
                }
                .hub-service-row:hover::before { transform: scaleX(1); }
                .hub-service-main { position: relative; z-index: 1; padding: 22px 12px; }
                .hub-service-name {
                    font-family: var(--font-heading);
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--color-text-charcoal);
                }
                .hub-service-name-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--color-primary-deep);
                    text-decoration: none;
                }
                .hub-service-name-link:hover { text-decoration: underline; }
                .hub-service-arrow { flex-shrink: 0; opacity: 0.7; }
                .hub-service-desc {
                    margin: 4px 0 0;
                    font-size: 0.95rem;
                    color: var(--color-text-slate);
                    line-height: 1.5;
                }

                .hub-tier1 { padding: 56px 12px 0; max-width: 640px; }
                .hub-tier1-title-link { text-decoration: none; }
                .hub-tier1-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: var(--fs-h3);
                    line-height: 1.2;
                    letter-spacing: -0.01em;
                    color: var(--color-text-charcoal);
                    margin: 0 0 12px;
                    transition: color 0.25s ease;
                }
                .hub-tier1-title-link:hover .hub-tier1-title { color: var(--color-primary-deep); }
                .hub-tier1-desc {
                    font-size: 1.05rem;
                    color: var(--color-text-slate);
                    line-height: 1.6;
                    margin: 0 0 20px;
                }

                /* ---------- Experience ---------- */
                .hub-experience { padding: var(--space-section-lg) 0 0; }
                .hub-experience-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    gap: 60px;
                    align-items: start;
                }
                .hub-experience-lead {
                    font-size: var(--fs-lead);
                    line-height: 1.65;
                    color: var(--color-text-slate);
                    margin: 20px 0 0;
                    max-width: 90%;
                }
                .hub-comparison-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.05rem;
                    letter-spacing: -0.01em;
                    color: var(--color-text-charcoal);
                    margin: 0 0 4px;
                    padding: 0 12px 14px;
                }
                .hub-experience-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    border-top: 1px solid var(--hairline);
                }
                .hub-experience-item {
                    padding: 18px 12px;
                    border-bottom: 1px solid var(--hairline);
                    font-size: 1.05rem;
                    line-height: 1.55;
                    color: var(--color-text-charcoal);
                }
                .hub-experience-item strong { font-weight: 600; }

                /* ---------- CTA ---------- */
                .hub-cta { text-align: center; padding: var(--space-section-lg) 20px; }
                .hub-cta-action { margin-top: 32px; }

                @media (max-width: 1024px) {
                    .hub-hero-light { padding: 120px 0 24px; }
                    .hub-hero-grid { grid-template-columns: 1fr; gap: 28px; }
                    .hub-title { margin-bottom: 14px; }
                    .hub-lead { font-size: 1rem; line-height: 1.55; max-width: 100%; }
                    .hub-hero-photo { border-radius: 20px; }

                    .hub-services-section { padding: 48px 16px 0; }
                    .hub-service-main { padding: 18px 6px; }
                    .hub-service-name { font-size: 1.02rem; }
                    .hub-service-desc { font-size: 0.9rem; }
                    .hub-tier1 { padding: 40px 6px 0; }

                    .hub-experience { padding: 48px 0 0; }
                    .hub-experience-grid { grid-template-columns: 1fr; gap: 28px; }
                    .hub-experience-lead { max-width: 100%; font-size: 1rem; line-height: 1.55; margin-top: 12px; }
                    .hub-comparison-title { padding: 0 6px 10px; }
                    .hub-experience-item { padding: 14px 6px; font-size: 0.98rem; }

                    .hub-cta { padding: 56px 16px; }
                }
            `}</Style>
        </div>
    );
};

const Services = () => {
    return (
        <Routes>
            <Route path="/" element={<ServicesLanding />} />

            {/* Location Pages */}
            <Route path="locations/damansara-jaya" element={(
                <Suspense fallback={<Loader />}>
                    <DamansaraJaya />
                </Suspense>
            )} />

            {/* Main Category Pages */}
            <Route path=":category" element={<ServiceHub />} />

            {/* Specialty Sub-Pages */}
            <Route path="protect/wisdom-tooth" element={(
                <Suspense fallback={<Loader />}>
                    <WisdomToothSurgery />
                </Suspense>
            )} />
            <Route path="protect/root-canal" element={(
                <Suspense fallback={<Loader />}>
                    <RootCanalTreatment />
                </Suspense>
            )} />
            <Route path="straighten/clear-aligners" element={(
                <Suspense fallback={<Loader />}>
                    <ClearAligners />
                </Suspense>
            )} />
            <Route path="replace/dental-implants" element={(
                <Suspense fallback={<Loader />}>
                    <DentalImplants />
                </Suspense>
            )} />
            <Route path="enhance/teeth-whitening" element={(
                <Suspense fallback={<Loader />}>
                    <TeethWhitening />
                </Suspense>
            )} />
            <Route path="children/myofunctional" element={(
                <Suspense fallback={<Loader />}>
                    <MyofunctionalOrthodontics />
                </Suspense>
            )} />
            <Route path="enhance/cosmetic-dentistry" element={(
                <Suspense fallback={<Loader />}>
                    <CosmeticDentistry />
                </Suspense>
            )} />
            <Route path="children/pediatric-dentistry" element={(
                <Suspense fallback={<Loader />}>
                    <PediatricDentistry />
                </Suspense>
            )} />
        </Routes>
    );
};

export default Services;
