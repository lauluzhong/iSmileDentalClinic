import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Sparkles, Smile, Users, MapPin } from 'lucide-react';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';
import { Reveal } from '../components/Reveal';
import reviewStats from '../data/review-stats.json';
import ResponsiveImage from '../components/ResponsiveImage';
import dentists from '../data/dentists.js';

// Review avatar WebP variants
const AVATAR_MIKE_WEBP = "/images/reviews/mike_ngui.webp";
const AVATAR_KAH_MUN_WEBP = "/images/reviews/kah_mun_hew.webp";
const AVATAR_BENNY_WEBP = "/images/reviews/benny_kong.webp";

import blogIndex from '../data/blog-index.json';
import Style from '../components/Style';

// The five areas of care, in the order families actually meet them.
// Row titles are the category names so they match /services and the nav
// (section names describe the content, per the owner's standing rule).
const STAGES = [
    {
        to: '/services/protect',
        num: '01',
        title: 'Protect & repair',
        line: 'Examination and diagnosis, gentle scaling and polishing, fillings and root canal treatment.'
    },
    {
        to: '/services/children',
        num: '02',
        title: 'Children & growth',
        line: "Early intervention and gentle paediatric care while your child's jaw is still growing."
    },
    {
        to: '/services/straighten',
        num: '03',
        title: 'Straighten teeth',
        line: 'Metal and clear brackets, and clear aligners, for teenagers and adults alike.'
    },
    {
        to: '/services/enhance',
        num: '04',
        title: 'Enhance your smile',
        line: 'Ceramic veneers, composite bonding and professional whitening.'
    },
    {
        to: '/services/replace',
        num: '05',
        title: 'Replace teeth',
        line: 'Premium implants, bridges and custom dentures that restore comfort and function.'
    }
];

// Mobile keeps the compact chip grid the owner chose — same five destinations,
// same order as the desktop list so the two views never disagree.
const CHIPS = [
    { to: '/services/protect', label: 'Check-ups & cleaning', Icon: Shield },
    { to: '/services/children', label: 'Children & growing smiles', Icon: Users },
    { to: '/services/straighten', label: 'Braces & aligners', Icon: Sparkles },
    { to: '/services/enhance', label: 'Veneers & whitening', Icon: Star },
    { to: '/services/replace', label: 'Implants & dentures', Icon: Smile }
];

const QUOTES = [
    {
        // One-line pulls, verbatim from each patient's full Google review (full text on /reviews)
        text: "My fear of being in the dentist chair has been completely removed by the gentle care I received.",
        author: "Mike Ngui",
        avatar: AVATAR_MIKE_WEBP
    },
    {
        text: "I've referred multiple family members here since I first came, because I know they will always be in good hands here at iSmile.",
        author: "Kah Mun Hew",
        avatar: AVATAR_KAH_MUN_WEBP
    },
    {
        text: "Above all, I appreciate iSmile's professional care and 'customer first' attitude.",
        author: "Benny Kong",
        avatar: AVATAR_BENNY_WEBP
    }
];

// The slow roll under the proof section. Service vocabulary, not patient
// names — the owner ruled the reviewer roll-call out (7 Sep 2026).
const TICKER = [
    'Check-ups & cleaning',
    "Children's dentistry",
    'Braces & clear aligners',
    'Veneers & whitening',
    'Implants & dentures',
    'Family dentistry since 2006'
];

// The dentists, straight from the same data file that builds /dentists and
// the About grid, so the homepage can never drift from the profiles.
// Portrait filenames contain spaces; they are fine in a src attribute once
// URI-encoded, but must never be put in a srcSet (srcset splits on spaces).
const portraitSrc = (img, ext) => encodeURI(img.replace(/\.jpg$/, ext));

const Home = () => {
    const { openBooking } = useBooking();

    // Get the specific blog posts in the requested order
    // Updated 2026-03-28: Feature newest posts covering priority topics
    const orderedBlogSlugs = [
        'child-candidate-myofunctional-orthodontics',      // P2: Myofunctional Orthodontics
        'mouth-breathing-thumb-sucking-crowded-teeth',     // P2: Myofunctional + Kids
        'signs-child-early-orthodontic-assessment',        // P2: Orthodontics
        'lm-activator-vs-invisalign',                      // P2: Myofunctional vs Clear Aligners
        'dental-implants-malaysia-explained'               // P3: Implants
    ];

    const featuredBlogs = orderedBlogSlugs
        .map(slug => blogIndex.find(post => post.slug === slug))
        .filter(Boolean);

    return (
        <div className="home-page">
            <Helmet>
                <title>Family Dental Clinic in Damansara Jaya, Petaling Jaya | iSmile</title>
                <meta name="description" content="Family dental clinic in Damansara Jaya, Petaling Jaya since 2006. Check-ups, braces, implants & kids' dentistry. Rated 4.8★ from 91 Google reviews. WhatsApp us to book." />
                <link rel="canonical" href="https://ismile.com.my/" />
            </Helmet>

            {/* ============ 1. HERO — the people who will actually treat you ============ */}
            <section className="hero-section">
                <div className="container hero-container">
                    {/* Hero content renders statically — above-the-fold copy must never start at opacity 0 */}
                    <div className="hero-content">
                        <span className="hero-eyebrow">
                            <span className="hero-eyebrow-mark"><Heart size={13} /></span>
                            <span className="hero-eyebrow-text">A family dental clinic in Petaling Jaya</span>
                            <span className="hero-eyebrow-year">Est. 2006</span>
                        </span>
                        <h1 className="hero-title">
                            Dental care for <span className="text-accent">every generation</span>
                        </h1>
                        <p className="hero-subtitle hero-subtitle-desktop">
                            From a child's first visit to a grandparent's new smile, iSmile is the dentist whole families stay with. Honest advice, gentle hands, and care that's looked after Petaling Jaya households for nearly two decades.
                        </p>
                        <p className="hero-subtitle hero-subtitle-mobile">
                            The family dentist Petaling Jaya households have stayed with since 2006.
                        </p>
                        <div className="hero-actions">
                            <Button onClick={() => openBooking('', 'hero-cta')}>Book a Visit <ArrowRight size={18} /></Button>
                        </div>
                        <div className="hero-trust">
                            <span className="hero-trust-rule" aria-hidden="true" />
                            <div className="hero-trust-item">
                                <div className="hero-trust-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#E0A500" color="#E0A500" />)}
                                </div>
                                <span><strong>{reviewStats.rating}</strong> on Google · {reviewStats.count} reviews</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        {/* All eight dentists, drifting slowly. Pause on hover; each
                            portrait opens that dentist's profile. */}
                        <div className="hero-ensemble">
                            <div className="hero-ensemble-track">
                                {[...dentists, ...dentists].map((d, i) => (
                                    <Link
                                        to={`/dentists/${d.slug}`}
                                        key={`${d.slug}-${i}`}
                                        className="portrait-card"
                                        tabIndex={i < dentists.length ? 0 : -1}
                                        aria-hidden={i >= dentists.length ? true : undefined}
                                    >
                                        <picture>
                                            <source type="image/avif" srcSet={portraitSrc(d.img, '.avif')} />
                                            <source type="image/webp" srcSet={portraitSrc(d.img, '.webp')} />
                                            <img src={encodeURI(d.img)} alt={i < dentists.length ? d.knownAs || d.name : ''} width="682" height="1024" loading="eager" decoding="async" />
                                        </picture>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="hero-ensemble-caption">
                            <span>Real people. Familiar faces.</span>
                            <Link to="/dentists">Meet your dentists <ArrowRight size={14} /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ 2. SERVICES — a wide, numbered index on a tinted band ============ */}
            <section className="services-section">
                <div className="container services-container">
                    <div className="section-header services-header">
                        <Reveal width="100%"><span className="section-eyebrow">Care, through every chapter</span></Reveal>
                        <Reveal width="100%"><h2 className="section-title">Comprehensive care for <span className="text-accent">every stage of life</span></h2></Reveal>
                        <Reveal width="100%"><p className="section-lead">A child's first check-up. Braces in the teenage years. A grandparent's new smile. One team that knows your family and grows with it.</p></Reveal>
                    </div>

                    <div className="stage-list">
                        {STAGES.map(stage => (
                            <Link key={stage.to} to={stage.to} className="stage-row">
                                <span className="stage-num">{stage.num}</span>
                                <h3 className="stage-title">{stage.title}</h3>
                                <p className="stage-line">{stage.line}</p>
                                <ArrowRight size={22} className="stage-arrow" />
                            </Link>
                        ))}
                    </div>

                    {/* Mobile chip grid — replaces the list on phones */}
                    <div className="chip-grid">
                        {CHIPS.map(({ to, label, Icon }) => (
                            <Link key={to} to={to} className="service-chip">
                                <span className="service-chip-icon"><Icon size={18} /></span>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ 3. PROOF — a teal band, not a black one ============ */}
            <section className="proof-section">
                <div className="container">
                    <p className="proof-eyebrow">What families say</p>
                    <h2 className="proof-statement">Trusted by <em>families.</em></h2>

                    <div className="proof-quotes">
                        {QUOTES.map((quote) => (
                            <blockquote key={quote.author} className="proof-quote">
                                <p>“{quote.text}”</p>
                                <footer className="proof-author">
                                    <img src={quote.avatar} alt="" aria-hidden="true" loading="lazy" width="36" height="36" />
                                    <span>{quote.author}</span>
                                </footer>
                            </blockquote>
                        ))}
                    </div>

                    <div className="proof-actions">
                        <Link to="/reviews" className="proof-link">Read all {reviewStats.count} reviews <ArrowRight size={16} /></Link>
                    </div>
                </div>

                <div className="name-marquee" aria-hidden="true">
                    <div className="name-marquee-track">
                        {[...TICKER, ...TICKER, ...TICKER].map((item, i) => (
                            <span key={i} className="name-marquee-item">{item}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ 4. DENTAL EDUCATION ============ */}
            <section className="section-padding dental-education-section">
                <div className="container">
                    <div className="section-header flex-between w-full dental-edu-header">
                        <h2 className="section-title dental-edu-title">Dental Education</h2>
                        <Link to="/blog" className="btn-link">Visit Learning Centre <ArrowRight size={16} /></Link>
                    </div>

                    <div className="horizontal-scroll-mask">
                        <div className="horizontal-track-simple">
                            {featuredBlogs.map((post, i) => (
                                <Link to={`/blog/${post.slug}`} key={i} className="glass-panel insight-card-large" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="insight-image-large">
                                        <ResponsiveImage src={post.img} alt={post.title} loading="lazy" sizes="(max-width: 768px) 85vw, 500px" />
                                    </div>
                                    <div className="insight-content">
                                        <h3>{post.title}</h3>
                                        <span className="read-more-link">Read More</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ 5. CLOSING — where we are, when we're open ============ */}
            <section className="closing-cta">
                <div className="container closing-grid">
                    <div className="closing-copy">
                        <span className="section-eyebrow">We're in Damansara Jaya</span>
                        <h2 className="closing-title">Come and <em>meet us.</em></h2>
                        <p className="closing-line">
                            Tell us who is coming in and we will find a time that suits the family.
                        </p>
                        <Button onClick={() => openBooking('', 'home-closing-cta')}>Book a Visit <ArrowRight size={18} /></Button>
                    </div>
                    <div className="closing-facts">
                        <span className="closing-pin"><MapPin size={20} /></span>
                        <p className="closing-address">
                            75 &amp; 75A, Jalan SS 22/23<br />
                            Damansara Jaya, 47400 Petaling Jaya<br />
                            Selangor, Malaysia
                        </p>
                        <dl className="closing-hours">
                            <div><dt>Monday – Friday</dt><dd>9:30 am – 5:30 pm</dd></div>
                            <div><dt>Saturday</dt><dd>9:30 am – 3:30 pm</dd></div>
                            <div><dt>Sunday &amp; public holidays</dt><dd>Closed</dd></div>
                        </dl>
                        <a className="closing-directions" href="https://maps.app.goo.gl/yt8MxXDpDxXgXqre6" target="_blank" rel="noopener noreferrer">Get directions <ArrowRight size={14} /></a>
                    </div>
                </div>
            </section>

            <Style>{`
        /* ==========================================================
           HOMEPAGE
           Composed as bands with room to breathe: light hero (the real
           team) -> tinted services index -> teal proof band -> reading ->
           split closing. No cards on white, no near-black sections.
           ========================================================== */

        .home-page { background: linear-gradient(180deg, #FFFFFF 0%, #F4F9FC 62%, #eff6ff 100%); min-height: 100vh; }
        .mobile-break { display: none; }

        /* One accent phrase per headline, flat house teal — no gradient text. */
        .text-accent { color: var(--color-primary-deep); -webkit-text-fill-color: currentColor; }
        /* The reference study's signature: a single word set in an italic serif.
           System Georgia, so no font download and the house fonts stay. */
        .serif-accent, .proof-statement em, .closing-title em {
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-weight: 500;
            letter-spacing: -0.01em;
        }

        .section-eyebrow {
            display: block;
            font-family: var(--font-heading); font-weight: 700;
            font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--color-primary-teal);
            margin-bottom: 18px;
        }

        /* ---------- 1. HERO ---------- */
        .hero-section {
            position: relative;
            min-height: 88vh;
            display: flex;
            align-items: center;
            overflow: hidden;
            padding: 170px 0 110px;
        }
        .hero-container {
            display: grid;
            grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
            gap: 72px;
            align-items: center;
        }
        /* min-width:0 on both grid children: the ensemble track is
           width:max-content (~2300px for sixteen portraits), and without an
           explicit minimum the grid's automatic min-size lets that intrinsic
           width blow the column out to the track's full width — the h1 then
           sits on a 2300px line and the phone shows a cropped headline. */
        .hero-content { text-align: left; min-width: 0; }
        .hero-visual { min-width: 0; max-width: 100%; }

        .hero-eyebrow { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 28px; padding: 0; background: none; }
        .hero-eyebrow-mark {
            display: inline-flex; align-items: center; justify-content: center;
            width: 26px; height: 26px; border-radius: 50%;
            background: var(--color-primary-deep); color: #fff; flex-shrink: 0;
        }
        .hero-eyebrow-text { font-family: var(--font-heading); font-weight: 600; font-size: 0.82rem; letter-spacing: 0.04em; color: var(--color-text-charcoal); }
        .hero-eyebrow-year {
            position: relative; padding-left: 14px;
            font-family: var(--font-heading); font-weight: 600;
            font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--color-primary-deep);
        }
        .hero-eyebrow-year::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 1px; height: 14px; background: rgba(16,42,51,0.18); }

        .hero-title { font-size: var(--fs-display); line-height: 1.04; margin-bottom: 24px; font-weight: 700; letter-spacing: -0.035em; }
        .hero-subtitle { font-size: var(--fs-lead); color: var(--color-text-slate); margin-bottom: 36px; max-width: 480px; line-height: 1.65; }
        .hero-subtitle-mobile { display: none; }
        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }

        /* Quiet footnote under the CTA, reference-style: short rule + one fact. */
        .hero-trust { display: flex; align-items: center; gap: 14px; margin-top: 44px; color: var(--color-text-slate); font-size: 0.92rem; }
        .hero-trust-rule { width: 34px; height: 1px; background: rgba(16,42,51,0.25); flex: none; }
        .hero-trust-item { display: flex; align-items: center; gap: 8px; }
        .hero-trust-item strong { color: var(--color-text-charcoal); }
        .hero-trust-stars { display: inline-flex; gap: 2px; }

        /* The ensemble: every dentist, arch-topped portraits drifting slowly.
           A mask fades the strip out at both edges so it never hard-cuts. */
        .hero-ensemble {
            overflow: hidden;
            padding: 10px 0 34px;
            -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
            mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
        }
        .hero-ensemble-track {
            display: flex; gap: 20px; width: max-content;
            animation: ensemble-drift 48s linear infinite;
        }
        .hero-ensemble:hover .hero-ensemble-track { animation-play-state: paused; }
        @keyframes ensemble-drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        @media (prefers-reduced-motion: reduce) { .hero-ensemble-track { animation: none; } }

        .portrait-card {
            display: block; flex: none; width: 228px;
            transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        /* Alternating baseline so the row reads as an ensemble, not a grid */
        .portrait-card:nth-child(even) { transform: translateY(22px); }
        .portrait-card:hover { transform: translateY(-6px); }
        .portrait-card:nth-child(even):hover { transform: translateY(16px); }
        .portrait-card img {
            display: block; width: 100%; height: 330px; object-fit: cover; object-position: center 12%;
            border-radius: 140px 140px 20px 20px;
            background: #f2f0ec;
            box-shadow: 0 14px 34px rgba(13,42,58,0.12);
        }

        .hero-ensemble-caption {
            display: flex; align-items: center; justify-content: space-between; gap: 16px;
            padding: 0 6px;
        }
        .hero-ensemble-caption > span {
            font-family: var(--font-heading); font-weight: 700;
            font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--color-text-grey);
        }
        .hero-ensemble-caption a {
            display: inline-flex; align-items: center; gap: 6px;
            font-family: var(--font-heading); font-weight: 600; font-size: 0.92rem;
            color: var(--color-primary-deep); transition: gap 0.25s ease;
        }
        .hero-ensemble-caption a:hover { gap: 10px; color: var(--color-primary-teal); }

        /* ---------- 2. SERVICES ---------- */
        .services-section { background: var(--color-tint-faint); padding: 110px 0 120px; }
        /* The owner asked for this index wider than the house 1200px column. */
        .services-container { max-width: 1360px; }
        .section-header { margin-bottom: 64px; }
        .services-header { max-width: 760px; }
        .section-title { margin: 0; font-size: var(--fs-h2); font-weight: 700; line-height: 1.08; letter-spacing: -0.03em; }
        .section-lead { font-size: var(--fs-lead); color: var(--color-text-slate); max-width: 620px; margin: 20px 0 0; line-height: 1.65; }

        .stage-list { border-top: 1px solid rgba(16,42,51,0.12); }
        .stage-row {
            position: relative;
            display: grid;
            grid-template-columns: 72px minmax(0, 0.85fr) minmax(0, 1.15fr) 40px;
            align-items: center;
            gap: 32px;
            padding: 42px 18px;
            border-bottom: 1px solid rgba(16,42,51,0.12);
            text-decoration: none; color: inherit; overflow: hidden;
        }
        .stage-row::before {
            content: ''; position: absolute; inset: 0; z-index: 0;
            background: linear-gradient(90deg, rgba(0,141,176,0.08) 0%, rgba(0,141,176,0.02) 62%, rgba(0,141,176,0) 100%);
            transform: scaleX(0); transform-origin: left;
            transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stage-row:hover::before, .stage-row:focus-visible::before { transform: scaleX(1); }
        .stage-num, .stage-title, .stage-line, .stage-arrow { position: relative; z-index: 1; }
        .stage-num {
            font-family: var(--font-heading); font-weight: 700; font-size: 0.8rem;
            letter-spacing: 0.12em; color: var(--color-primary-teal);
        }
        .stage-title {
            font-family: var(--font-heading); font-weight: 700;
            font-size: clamp(1.45rem, 1.1rem + 1.1vw, 2.1rem);
            line-height: 1.1; letter-spacing: -0.025em; color: var(--color-text-charcoal); margin: 0;
            transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stage-row:hover .stage-title { transform: translateX(10px); }
        .stage-line { color: var(--color-text-slate); font-size: 1rem; line-height: 1.6; margin: 0; }
        .stage-arrow { color: var(--color-primary-teal); opacity: 0.3; transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .stage-row:hover .stage-arrow { opacity: 1; transform: translate(6px, -4px) rotate(-45deg); }

        .chip-grid { display: none; grid-template-columns: 1fr 1fr; gap: 10px; }
        .service-chip {
            display: flex; align-items: center; gap: 10px;
            background: #fff; border: 1px solid rgba(16,42,51,0.08);
            border-radius: 16px; padding: 13px 12px;
            font-family: var(--font-heading); font-weight: 600;
            font-size: 0.9rem; line-height: 1.2;
            color: var(--color-text-charcoal);
            box-shadow: var(--shadow-sm);
        }
        .service-chip:last-child { grid-column: 1 / -1; }
        .service-chip-icon {
            flex: none; width: 34px; height: 34px; border-radius: 10px;
            background: var(--color-tint-light); color: var(--color-primary-deep);
            display: flex; align-items: center; justify-content: center;
        }

        /* ---------- 3. PROOF (teal band) ---------- */
        .proof-section { background: var(--color-primary-deep); color: #F0F7FA; padding: 120px 0 0; overflow: hidden; }
        .proof-eyebrow {
            font-family: var(--font-heading); font-weight: 700;
            font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--color-pastel-blue); margin: 0 0 26px;
        }
        .proof-statement {
            font-family: var(--font-heading); font-weight: 700; color: #fff;
            font-size: clamp(2.6rem, 1.2rem + 5.2vw, 5rem);
            line-height: 1.02; letter-spacing: -0.035em; margin: 0 0 76px;
        }
        .proof-statement em { color: var(--color-pastel-blue); }

        .proof-quotes { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(255,255,255,0.22); }
        .proof-quote { margin: 0; padding: 44px 40px 44px 0; border-right: 1px solid rgba(255,255,255,0.22); }
        .proof-quote:last-child { border-right: none; }
        .proof-quote:not(:first-child) { padding-left: 40px; }
        .proof-quote p { font-size: 1.05rem; line-height: 1.65; color: rgba(255,255,255,0.92); margin: 0 0 26px; }
        .proof-author { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; letter-spacing: 0.04em; color: rgba(255,255,255,0.66); }
        .proof-author img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex: none; }

        .proof-actions { padding: 48px 0 0; }
        .proof-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-heading); font-weight: 600; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.4); padding-bottom: 4px; transition: gap 0.25s ease, border-color 0.25s ease; }
        .proof-link:hover { gap: 12px; border-color: #fff; color: #fff; }

        /* The slow roll: what we do, not who reviewed us. 64s per pass. */
        .name-marquee { margin-top: 88px; border-top: 1px solid rgba(255,255,255,0.18); padding: 28px 0; overflow: hidden; }
        .name-marquee-track { display: flex; width: max-content; animation: name-marquee 64s linear infinite; }
        .name-marquee-item {
            font-family: var(--font-heading); font-size: 0.78rem; font-weight: 600;
            letter-spacing: 0.2em; text-transform: uppercase;
            color: rgba(255,255,255,0.5); white-space: nowrap; padding-right: 28px;
        }
        .name-marquee-item::after { content: '·'; margin-left: 28px; color: rgba(255,255,255,0.28); }
        @keyframes name-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-33.333%,0,0); } }
        @media (prefers-reduced-motion: reduce) { .name-marquee-track { animation: none; } }

        /* ---------- 4. DENTAL EDUCATION ---------- */
        .dental-education-section { padding: 110px 0 40px; }
        .dental-edu-header { margin-bottom: 30px; }
        .btn-link { color: var(--color-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }
        .horizontal-scroll-mask { width: 100%; overflow-x: auto; padding: 20px 0 40px; scrollbar-width: none; -ms-overflow-style: none; }
        .horizontal-scroll-mask::-webkit-scrollbar { display: none; }
        .horizontal-track-simple { display: flex; gap: 30px; width: max-content; padding: 0 10px; }
        .insight-card-large {
            width: 70vw; max-width: 500px; flex-shrink: 0; padding: 0; overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
            box-shadow: var(--shadow-sm);
            transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease;
        }
        .insight-image-large { height: 300px; width: 100%; }
        .insight-image-large picture, .insight-image-large img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .insight-content { padding: 25px; }
        .insight-card-large:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
        .insight-card-large .insight-image-large img { transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .insight-card-large:hover .insight-image-large img { transform: scale(1.05); }
        .insight-content h3 { margin-bottom: 12px; font-size: 1.15rem; line-height: 1.3; }
        .read-more-link { font-size: 0.95rem; color: var(--color-primary-deep); font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
        .read-more-link::after { content: '→'; transition: transform 0.25s ease; }
        .insight-card-large:hover .read-more-link::after { transform: translateX(4px); }

        /* ---------- 5. CLOSING (split: invitation | facts) ---------- */
        .closing-cta { padding: 110px 0 130px; }
        .closing-grid {
            display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
            gap: 80px; align-items: start;
        }
        .closing-title {
            font-family: var(--font-heading); font-weight: 700;
            font-size: clamp(2.2rem, 1.4rem + 3vw, 3.6rem);
            line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 22px;
            color: var(--color-text-charcoal);
        }
        .closing-title em { color: var(--color-primary-deep); }
        .closing-line { font-size: var(--fs-lead); color: var(--color-text-slate); max-width: 460px; margin: 0 0 36px; line-height: 1.65; }

        .closing-pin {
            display: inline-flex; align-items: center; justify-content: center;
            width: 40px; height: 40px; border-radius: 50%;
            background: var(--color-tint-light); color: var(--color-primary-deep);
            margin-bottom: 20px;
        }
        .closing-address { font-size: 1.02rem; line-height: 1.7; color: var(--color-text-slate); margin: 0 0 28px; }
        .closing-hours { margin: 0 0 28px; }
        .closing-hours > div {
            display: flex; align-items: baseline; justify-content: space-between; gap: 24px;
            padding: 13px 0; border-top: 1px solid rgba(16,42,51,0.10);
        }
        .closing-hours > div:last-child { border-bottom: 1px solid rgba(16,42,51,0.10); }
        .closing-hours dt { font-size: 0.95rem; color: var(--color-text-slate); }
        .closing-hours dd { margin: 0; font-family: var(--font-heading); font-weight: 600; font-size: 0.95rem; color: var(--color-text-charcoal); }
        .closing-directions {
            display: inline-flex; align-items: center; gap: 6px;
            font-family: var(--font-heading); font-weight: 600; font-size: 0.95rem;
            color: var(--color-primary-deep);
            border-bottom: 1px solid rgba(0,110,140,0.35); padding-bottom: 4px;
            transition: gap 0.25s ease, border-color 0.25s ease;
        }
        .closing-directions:hover { gap: 10px; border-color: var(--color-primary-deep); }

        /* ============================
           RESPONSIVE — TABLET (481-1024px)
           ============================ */
        @media (max-width: 1024px) {
            .desktop-only { display: none; }
            .mobile-break { display: inline; }

            .section-padding { padding: 32px 0; }
            .home-page .section-title { font-size: 2rem; margin-bottom: 0.75rem; line-height: 1.1; }

            /* ---- Hero — stacked: copy, then the team drifting below ---- */
            .hero-section { min-height: 0; padding: 130px 0 40px; display: block; }
            .hero-container { grid-template-columns: 1fr; gap: 40px; }
            .hero-eyebrow { margin-bottom: 18px; }
            .hero-eyebrow-text { font-size: 0.76rem; }
            .hero-title { font-size: 2.35rem; line-height: 1.1; margin-bottom: 12px; }
            .hero-subtitle-desktop { display: none; }
            .hero-subtitle-mobile { display: block; }
            .hero-subtitle { font-size: 1rem; margin-bottom: 22px; max-width: 420px; line-height: 1.55; }
            .hero-trust { margin-top: 24px; font-size: 0.88rem; }

            .hero-ensemble { padding: 6px 0 24px; }
            .hero-ensemble-track { gap: 14px; }
            .portrait-card { width: 158px; }
            .portrait-card:nth-child(even) { transform: translateY(14px); }
            .portrait-card img { height: 230px; border-radius: 100px 100px 16px 16px; }
            .hero-ensemble-caption > span { font-size: 0.62rem; letter-spacing: 0.16em; }
            .hero-ensemble-caption a { font-size: 0.88rem; }

            .section-header { margin-bottom: 28px; }
            .section-eyebrow { margin-bottom: 12px; }
            .section-lead { font-size: 1rem; margin-top: 10px; }

            /* Services — tighter rows, arrow drops away */
            .services-section { padding: 48px 0 56px; }
            .stage-row { grid-template-columns: 34px 1fr; gap: 8px 14px; padding: 22px 6px; }
            .stage-num { font-size: 0.72rem; }
            .stage-line { grid-column: 2; font-size: 0.92rem; }
            .stage-arrow { display: none; }
            .stage-title { font-size: 1.35rem; }
            .stage-row:hover .stage-title { transform: none; }

            /* Proof — quotes become a snap carousel, matching the reading rail */
            .proof-section { padding: 60px 0 0; }
            .proof-statement { margin-bottom: 36px; }
            .proof-quotes {
                display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
                gap: 16px; padding: 8px 0 12px; scrollbar-width: none;
                border-top: 1px solid rgba(255,255,255,0.22);
            }
            .proof-quotes::-webkit-scrollbar { display: none; }
            .proof-quote {
                flex: 0 0 82%; scroll-snap-align: start;
                padding: 26px 0; border-right: none;
            }
            .proof-quote:not(:first-child) { padding-left: 0; }
            .proof-quote p { font-size: 0.98rem; margin-bottom: 18px; }
            .proof-actions { padding-top: 20px; }
            .name-marquee { margin-top: 44px; padding: 20px 0; }

            /* Dental Education — header centered for consistency */
            .dental-education-section { padding: 40px 0 10px; }
            .dental-edu-header { margin-bottom: 12px; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
            .horizontal-scroll-mask { padding: 8px 0 12px; }
            .horizontal-track-simple { gap: 20px; padding: 0 16px; }
            .insight-card-large { width: 320px; border-radius: 20px; }
            .insight-image-large { height: 200px; }
            .insight-content { padding: 20px; }
            .insight-content h3 { font-size: 1rem; line-height: 1.3; margin-bottom: 6px; }
            .read-more-link { font-size: 0.9rem; }

            /* Closing — stacked */
            .closing-cta { padding: 48px 0 64px; }
            .closing-grid { grid-template-columns: 1fr; gap: 40px; }
            .closing-line { font-size: 1rem; margin-bottom: 24px; }
        }

        /* ============================
           RESPONSIVE — PHONE (<=480px)
           ============================ */
        @media (max-width: 480px) {
            .section-padding { padding: 24px 0; }
            .home-page .section-title { font-size: 1.6rem; margin-bottom: 0.5rem; line-height: 1.1; }
            .section-header { margin-bottom: 18px; }

            .hero-section { padding: 116px 0 32px; }
            .hero-title { font-size: 2.05rem; }
            .hero-subtitle { max-width: 340px; }

            .portrait-card { width: 132px; }
            .portrait-card img { height: 194px; border-radius: 84px 84px 14px 14px; }

            /* Services — chip grid replaces the list on phones */
            .stage-list { display: none; }
            .chip-grid { display: grid; }
            .services-section { padding: 36px 0 44px; }

            .proof-quote { flex: 0 0 88%; }

            .dental-edu-header { flex-direction: column; align-items: center; gap: 6px; text-align: center; }
            .horizontal-track-simple { gap: 12px; padding: 0 16px; }
            .insight-card-large { width: 240px; border-radius: 16px; }
            .insight-image-large { height: 140px; }
            .insight-content { padding: 14px; }
            .insight-content h3 { font-size: 0.95rem; line-height: 1.3; margin-bottom: 4px; }
            .read-more-link { font-size: 0.85rem; }

            .closing-title { font-size: 1.9rem; }
        }
      `}</Style>
        </div>
    );
};

export default Home;
