import { useBooking } from '../context/BookingContext';
import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Sparkles, Smile, Users } from 'lucide-react';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';
import { Reveal } from '../components/Reveal';
import { useReducedMotion } from 'framer-motion';
import reviewStats from '../data/review-stats.json';
import ResponsiveImage from '../components/ResponsiveImage';

// Hero art direction.
// The hero photo is now a full-height panel that bleeds off the right edge on
// desktop and covers the whole viewport on phones — in both cases a TALL box.
// So both breakpoints are served the PORTRAIT master (1024x1536) rather than the
// landscape crop: cover-fitting a 1024x624 landscape into a tall panel scales it
// up ~1.3x, while the portrait master is still being scaled DOWN at 1440px.
// The landscape variants are deliberately no longer referenced.
// `sizes` is overstated on phones on purpose: it describes layout WIDTH only, so
// it under-requests for a cover-cropped portrait box.
const HERO_SIZES = "(max-width: 768px) 150vw, 55vw";
const HERO_BASE = "/images/family_hero_three_generations_portrait";

// Review avatar WebP variants
const AVATAR_MIKE_WEBP = "/images/reviews/mike_ngui.webp";
const AVATAR_KAH_MUN_WEBP = "/images/reviews/kah_mun_hew.webp";
const AVATAR_BENNY_WEBP = "/images/reviews/benny_kong.webp";

// Team image
const TEAM_IMG = "/images/team_group.jpg";

import blogIndex from '../data/blog-index.json';
import Style from '../components/Style';

// The five areas of care, in the order families actually meet them: the
// check-up that brings almost everyone through the door first, then the rest.
// Presented as an editorial list rather than a card grid — see the note on
// .stage-list below.
const STAGES = [
    {
        to: '/services/protect',
        eyebrow: 'Protect & repair',
        title: 'Healthy teeth for life',
        line: 'Examination and diagnosis, gentle scaling and polishing, fillings and root canal treatment.'
    },
    {
        to: '/services/children',
        eyebrow: 'Children & growth',
        title: 'Developing healthy smiles',
        line: "Early intervention and gentle paediatric care while your child's jaw is still growing."
    },
    {
        to: '/services/straighten',
        eyebrow: 'Straighten teeth',
        title: 'Confidence in every smile',
        line: 'Metal and clear brackets, and clear aligners, for teenagers and adults alike.'
    },
    {
        to: '/services/enhance',
        eyebrow: 'Enhance smile',
        title: 'Design your dream smile',
        line: 'Ceramic veneers, composite bonding and professional whitening.'
    },
    {
        to: '/services/replace',
        eyebrow: 'Replace teeth',
        title: 'Speak and smile confidently again',
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

// Real reviewer names, exactly as they are already published on /reviews.
// Nothing here is invented; the marquee is a quiet roll-call, not a claim.
const REVIEWER_NAMES = [
    'Mike Ngui', 'Kah Mun Hew', 'Benny Kong', 'Ashley Chin', 'Karen Lam',
    'Lydia Ng', 'Sze Yoong', 'Sook Yeen Lee', 'Tan Bee Wah', 'Christina Phang',
    'Wee Min Lee', 'Dashaene Mahalingam', 'Fong Lim', 'Gayatri Raja Mohan',
    'Max Loh', 'Anson Chow'
];

const Home = () => {
    const { openBooking } = useBooking();
    const navigate = useNavigate();
    const prefersReducedMotion = useReducedMotion();

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

    const heroRef = useRef(null);
    const heroMediaRef = useRef(null);

    // Hero parallax.
    //
    // This listener used to compute a `scrollProgress` state on every frame that
    // nothing on the page consumed — the leftovers of a scroll effect that had
    // been removed. It now drives the one thing it was always meant to: the hero
    // photo drifting slower than the page.
    //
    // Written straight to the style property rather than through state, so the
    // scroll path never triggers a React render.
    useEffect(() => {
        if (prefersReducedMotion) return;

        const section = heroRef.current;
        const media = heroMediaRef.current;
        if (!section || !media) return;

        let frame = null;
        let running = true;

        const measure = () => {
            frame = null;
            if (!running) return;

            const rect = section.getBoundingClientRect();
            // Past the hero there is nothing to see, so stop writing transforms.
            if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

            const travelled = Math.min(1, Math.max(0, -rect.top / rect.height));
            media.style.transform = `translate3d(0, ${(travelled * 84).toFixed(2)}px, 0)`;
        };

        const onScroll = () => {
            if (frame === null) frame = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        return () => {
            running = false;
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame !== null) window.cancelAnimationFrame(frame);
        };
    }, [prefersReducedMotion]);

    return (
        <div className="home-page">
            <Helmet>
                <title>Family Dental Clinic in Damansara Jaya, Petaling Jaya | iSmile</title>
                <meta name="description" content="Family dental clinic in Damansara Jaya, Petaling Jaya since 2006. Check-ups, braces, implants & kids' dentistry. Rated 4.8★ from 91 Google reviews. WhatsApp us to book." />
                <link rel="canonical" href="https://ismile.com.my/" />
            </Helmet>

            {/* ============ 1. HERO — the photo bleeds off the page, no frame ============ */}
            <section className="hero-section" ref={heroRef}>
                <div className="hero-visual">
                    <div className="hero-card">
                        <div className="hero-media" ref={heroMediaRef}>
                            <picture>
                                <source type="image/avif" srcSet={`${HERO_BASE}-480w.avif 480w, ${HERO_BASE}-768w.avif 768w, ${HERO_BASE}.avif 1024w`} sizes={HERO_SIZES} />
                                <source type="image/webp" srcSet={`${HERO_BASE}-480w.webp 480w, ${HERO_BASE}-768w.webp 768w, ${HERO_BASE}.webp 1024w`} sizes={HERO_SIZES} />
                                <source type="image/jpeg" srcSet={`${HERO_BASE}-480w.jpg 480w, ${HERO_BASE}-768w.jpg 768w, ${HERO_BASE}.jpg 1024w`} sizes={HERO_SIZES} />
                                <img src={`${HERO_BASE}.jpg`} srcSet={`${HERO_BASE}-480w.jpg 480w, ${HERO_BASE}-768w.jpg 768w, ${HERO_BASE}.jpg 1024w`} sizes={HERO_SIZES} alt="Three generations of a family smiling together at iSmile Dental Clinic" width="1024" height="1536" fetchpriority="high" loading="eager" decoding="async" />
                            </picture>
                        </div>
                    </div>
                </div>

                <div className="container hero-container">
                    {/* Hero content renders statically — above-the-fold copy must never start at opacity 0 */}
                    <div className="hero-content">
                        <span className="hero-eyebrow">
                            <span className="hero-eyebrow-mark"><Heart size={13} /></span>
                            <span className="hero-eyebrow-text">A family dental clinic in Petaling Jaya</span>
                            <span className="hero-eyebrow-year">Est. 2006</span>
                        </span>
                        <h1 className="hero-title">
                            Dental care for <span className="text-gradient">every generation</span>
                        </h1>
                        <p className="hero-subtitle hero-subtitle-desktop">
                            From a child's first visit to a grandparent's new smile, iSmile is the dentist whole families stay with. Honest advice, gentle hands, and care that's looked after Petaling Jaya households for nearly two decades.
                        </p>
                        <p className="hero-subtitle hero-subtitle-mobile">
                            The family dentist Petaling Jaya households have stayed with since 2006.
                        </p>
                        <div className="hero-actions">
                            <Button onClick={() => openBooking('', 'hero-cta')}>Book a Visit <ArrowRight size={18} /></Button>
                            <Link to="/about" className="hero-secondary-link">Meet our team <ArrowRight size={16} /></Link>
                        </div>
                        <div className="hero-trust">
                            <div className="hero-trust-item">
                                <div className="hero-trust-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#E0A500" color="#E0A500" />)}
                                </div>
                                <span><strong>{reviewStats.rating}</strong> on Google · {reviewStats.count} reviews</span>
                            </div>
                            <span className="hero-trust-divider" />
                            <div className="hero-trust-item"><strong>20+</strong> years of trusted care</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ 2. TRUST RAIL — the page changes register for the first time ============ */}
            <section className="trust-rail">
                <div className="container trust-rail-inner">
                    <div className="trust-stat">
                        <strong>{reviewStats.rating}<span className="trust-star">★</span></strong>
                        <span>{reviewStats.count} Google reviews</span>
                    </div>
                    <span className="trust-divider" aria-hidden="true" />
                    <div className="trust-stat">
                        <strong>2006</strong>
                        <span>In Damansara Jaya since</span>
                    </div>
                    <span className="trust-divider" aria-hidden="true" />
                    <div className="trust-stat">
                        <strong>6 days</strong>
                        <span>Open Monday to Saturday</span>
                    </div>
                    <span className="trust-divider" aria-hidden="true" />
                    <div className="trust-stat">
                        <strong>5</strong>
                        <span>Areas of care, one roof</span>
                    </div>
                </div>
            </section>

            {/* ============ 3. SERVICES — an editorial list, not a card grid ============ */}
            <section className="section-padding services-section">
                <div className="container">
                    <div className="section-header services-header">
                        <Reveal width="100%"><h2 className="section-title">Comprehensive care for <span className="stage-accent">every stage of life</span></h2></Reveal>
                        <Reveal width="100%"><p className="section-lead">A child's first check-up. Braces in the teenage years. A grandparent's new smile. One team that knows your family and grows with it.</p></Reveal>
                    </div>

                    <div className="stage-list">
                        {STAGES.map(stage => (
                            <Link key={stage.to} to={stage.to} className="stage-row">
                                <div className="stage-head">
                                    <span className="stage-eyebrow">{stage.eyebrow}</span>
                                    <h3 className="stage-title">{stage.title}</h3>
                                </div>
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

            {/* ============ 4. THE TEAM — photo runs off the right edge of the page ============ */}
            <section className="section-padding welcome-section">
                <div className="container">
                    <div className="welcome-container">
                        <div className="welcome-content-split">
                            <h2 className="welcome-headline">Built on <br /><span className="text-blue">Competency &amp; <br className="desktop-only" />Compassion</span></h2>
                            <p className="welcome-description">
                                At iSmile, we combine <strong>family-run warmth</strong> with <strong>advanced, high-quality dentistry</strong> to deliver care that is both personal and precise.
                                With over 20 years of experience, we strive to make every patient feel comfortable, supported, and genuinely cared for.
                            </p>
                            <div className="welcome-actions">
                                <Button variant="primary" onClick={() => navigate('/about')}>Meet Our Team</Button>
                            </div>
                        </div>
                        <div className="welcome-image-split">
                            <picture>
                              <source type="image/avif" srcSet={`/images/team_group-480w.avif 480w, /images/team_group-768w.avif 768w, /images/team_group-1024w.avif 1024w`} sizes="(max-width: 1024px) 100vw, 50vw" />
                              <source type="image/webp" srcSet={`/images/team_group-480w.webp 480w, /images/team_group-768w.webp 768w, /images/team_group-1024w.webp 1024w`} sizes="(max-width: 1024px) 100vw, 50vw" />
                              <source type="image/jpeg" srcSet={`/images/team_group-480w.jpg 480w, /images/team_group-768w.jpg 768w, /images/team_group-1024w.jpg 1024w`} sizes="(max-width: 1024px) 100vw, 50vw" />
                              <img src={TEAM_IMG} srcSet={`/images/team_group-480w.jpg 480w, /images/team_group-768w.jpg 768w, /images/team_group-1024w.jpg 1024w`} sizes="(max-width: 1024px) 100vw, 50vw" alt="iSmile Dental Clinic team" width="1024" height="682" loading="lazy" decoding="async" />
                            </picture>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ 5. PROOF — the one dark act on the page ============ */}
            <section className="proof-section">
                <div className="container">
                    <p className="proof-eyebrow">What families say</p>
                    <h2 className="proof-statement">Every generation.<br /><em>Same chair.</em></h2>

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
                        {[...REVIEWER_NAMES, ...REVIEWER_NAMES].map((name, i) => (
                            <span key={i} className="name-marquee-item">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ 6. DENTAL EDUCATION ============ */}
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

            {/* ============ 7. CLOSING — the page used to end into the footer ============ */}
            <section className="closing-cta">
                <div className="container">
                    <h2 className="closing-title">Come and meet us</h2>
                    <p className="closing-line">
                        We are on Jalan SS 22/23 in Damansara Jaya, open Monday to Saturday. Tell us who is coming in and we will find a time that suits the family.
                    </p>
                    <Button onClick={() => openBooking('', 'home-closing-cta')}>Book a Visit <ArrowRight size={18} /></Button>
                </div>
            </section>

            <Style>{`
        /* ==========================================================
           HOMEPAGE
           The page is composed as alternating bands rather than one
           continuous field of cards: light hero -> dark trust rail ->
           light services -> light team -> DARK proof -> light reading ->
           light close. The register change is what stops a 5,000px page
           reading as one long scroll of the same object.
           ========================================================== */

        .home-page { background: linear-gradient(180deg, #FFFFFF 0%, #F4F9FC 62%, #eff6ff 100%); min-height: 100vh; }
        .mobile-break { display: none; }

        /* ---------- 1. HERO ---------- */
        /* The photo is no longer a rotated, outlined card floating in a column.
           It is a full-height panel pinned to the right edge of the viewport
           that dissolves into the page on its left side. */
        .hero-section {
            position: relative;
            min-height: 92vh;
            display: flex;
            align-items: center;
            overflow: hidden;
            padding: 150px 0 96px;
        }
        .hero-container { position: relative; z-index: 2; }
        .hero-content { text-align: left; max-width: min(560px, 46%); }

        .hero-visual { position: absolute; top: 0; right: 0; bottom: 0; width: 54%; z-index: 1; }
        .hero-card { position: absolute; inset: 0; overflow: hidden; }
        /* Parallax wrapper — over-sized top and bottom so the drift never
           exposes an edge. Transform is written by the scroll effect.
           The left-edge dissolve is a MASK, not a white gradient painted over
           the photo. Painting white only matches where the page happens to be
           pure white; the page background is a gradient, so an opaque white
           overlay left a faint vertical seam down the join. Masking fades the
           photo itself to transparent, so it dissolves into whatever colour is
           actually behind it. */
        .hero-media {
            position: absolute; inset: -7% 0; will-change: transform;
            -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.10) 12%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.92) 48%, #000 62%);
            mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.10) 12%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.92) 48%, #000 62%);
        }
        .hero-card picture, .hero-card img { display: block; width: 100%; height: 100%; }
        .hero-card img { object-fit: cover; object-position: center 26%; filter: saturate(0.98) contrast(1.02); }

        /* Empty on desktop — the mask above does the blending. The mobile block
           gives this the vertical shade the full-bleed phone hero needs. */
        .hero-card::before {
            content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none;
            background: none;
        }
        /* No grain overlay. It used to sit on .hero-card to make a stock photo
           read as art-directed, but an unmasked blend layer over a masked photo
           draws its own rectangle: the overlay blend stepped the tone exactly at
           the panel's left edge and put back the vertical seam the mask removes.
           The bleed does the art direction now. */

        .hero-eyebrow { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 26px; padding: 0; background: none; }
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

        .hero-title { font-size: var(--fs-display); line-height: 1.03; margin-bottom: 22px; font-weight: 700; letter-spacing: -0.035em; }
        .hero-subtitle { font-size: var(--fs-lead); color: var(--color-text-slate); margin-bottom: 32px; max-width: 520px; line-height: 1.6; }
        .hero-subtitle-mobile { display: none; }
        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .hero-secondary-link { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-heading); font-weight: 600; color: var(--color-primary-deep); font-size: 1rem; transition: gap 0.25s ease; }
        .hero-secondary-link:hover { gap: 10px; color: var(--color-primary-teal); }
        .hero-trust { display: flex; align-items: center; gap: 20px; margin-top: 36px; flex-wrap: wrap; color: var(--color-text-slate); font-size: 0.95rem; }
        .hero-trust-item { display: flex; align-items: center; gap: 8px; }
        .hero-trust-item strong { color: var(--color-text-charcoal); }
        .hero-trust-stars { display: inline-flex; gap: 2px; }
        .hero-trust-divider { width: 1px; height: 22px; background: rgba(16,42,51,0.12); }

        /* ---------- 2. TRUST RAIL ---------- */
        .trust-rail { background: #0D2A3A; color: rgba(234,243,247,0.92); position: relative; z-index: 3; }
        .trust-rail-inner { display: flex; align-items: stretch; justify-content: space-between; gap: 28px; padding: 34px 20px; }
        .trust-stat { display: flex; flex-direction: column; justify-content: center; gap: 8px; min-width: 0; }
        .trust-stat strong {
            font-family: var(--font-heading); font-weight: 700;
            font-size: clamp(1.5rem, 1.2rem + 0.9vw, 2rem);
            line-height: 1; letter-spacing: -0.025em; color: #fff;
        }
        .trust-star { color: var(--color-gold); font-size: 0.7em; margin-left: 3px; }
        .trust-stat span { font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(234,243,247,0.58); line-height: 1.4; }
        .trust-divider { width: 1px; background: rgba(234,243,247,0.14); flex: none; }

        /* ---------- 3. SERVICES ---------- */
        /* Deliberately NOT cards. Five hairline-separated rows, each one a wide
           hit area with a slow teal wash on hover. The section reads as an index
           rather than a grid, which is the whole point of it being here. */
        .section-header { margin-bottom: 48px; }
        .services-header { max-width: 720px; }
        .section-title { margin: 0; font-size: var(--fs-h2); font-weight: 700; line-height: 1.08; letter-spacing: -0.03em; }
        .stage-accent { color: var(--color-primary-deep); }
        .section-lead { font-size: var(--fs-lead); color: var(--color-text-slate); max-width: 620px; margin: 18px 0 0; line-height: 1.6; }

        .stage-list { border-top: 1px solid rgba(16,42,51,0.10); }
        .stage-row {
            position: relative;
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) 26px;
            align-items: center;
            gap: 48px;
            padding: 34px 24px;
            border-bottom: 1px solid rgba(16,42,51,0.10);
            text-decoration: none; color: inherit; overflow: hidden;
        }
        .stage-row::before {
            content: ''; position: absolute; inset: 0; z-index: 0;
            background: linear-gradient(90deg, rgba(0,141,176,0.09) 0%, rgba(0,141,176,0.02) 62%, rgba(0,141,176,0) 100%);
            transform: scaleX(0); transform-origin: left;
            transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stage-row:hover::before, .stage-row:focus-visible::before { transform: scaleX(1); }
        .stage-head, .stage-line, .stage-arrow { position: relative; z-index: 1; }
        .stage-eyebrow { display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-primary-teal); margin-bottom: 12px; }
        .stage-title {
            font-family: var(--font-heading); font-weight: 700;
            font-size: clamp(1.4rem, 1.05rem + 1.1vw, 2.05rem);
            line-height: 1.1; letter-spacing: -0.025em; color: var(--color-text-charcoal); margin: 0;
            transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stage-row:hover .stage-title { transform: translateX(10px); }
        .stage-line { color: var(--color-text-slate); font-size: 1rem; line-height: 1.6; margin: 0; }
        .stage-arrow { color: var(--color-primary-teal); opacity: 0.3; transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .stage-row:hover .stage-arrow { opacity: 1; transform: translateX(8px); }

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

        /* ---------- 4. THE TEAM ---------- */
        /* The photo leaves the container and runs to the right edge of the
           viewport. Nothing on this page is allowed to sit in a rounded white
           box on a near-white background any more. */
        .welcome-section .container { max-width: none; padding: 0; }
        .welcome-container { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 0; }
        .welcome-content-split {
            padding-right: 64px;
            padding-left: max(20px, calc((100vw - 1200px) / 2 + 20px));
        }
        .welcome-headline { font-size: var(--fs-h2); font-weight: 700; line-height: 1.05; margin-bottom: 24px; color: var(--color-text-charcoal); letter-spacing: -0.03em; }
        .welcome-description { font-size: var(--fs-lead); color: var(--color-text-slate); margin-bottom: 36px; max-width: 500px; line-height: 1.65; }
        .welcome-image-split { position: relative; height: 560px; overflow: hidden; border-radius: 28px 0 0 28px; }
        .welcome-image-split picture, .welcome-image-split img { display: block; width: 100%; height: 100%; }
        .welcome-image-split img { object-fit: cover; object-position: center 20%; }

        /* ---------- 5. PROOF (the dark act) ---------- */
        .proof-section { background: #0D2A3A; color: #EAF3F7; padding: 116px 0 0; overflow: hidden; }
        .proof-eyebrow { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-sky-blue); margin: 0 0 26px; }
        .proof-statement {
            font-family: var(--font-heading); font-weight: 700; color: #fff;
            font-size: clamp(2.6rem, 1.2rem + 5.6vw, 5.4rem);
            line-height: 0.97; letter-spacing: -0.04em; margin: 0 0 72px;
        }
        /* One accent phrase per headline. That is the whole accent budget here. */
        .proof-statement em { font-style: normal; color: var(--color-sky-blue); }

        .proof-quotes { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(234,243,247,0.14); }
        .proof-quote { margin: 0; padding: 40px 40px 40px 0; border-right: 1px solid rgba(234,243,247,0.14); }
        .proof-quote:last-child { border-right: none; }
        .proof-quote:not(:first-child) { padding-left: 40px; }
        .proof-quote p { font-size: 1.05rem; line-height: 1.62; color: rgba(234,243,247,0.9); margin: 0 0 26px; }
        .proof-author { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; letter-spacing: 0.04em; color: rgba(234,243,247,0.55); }
        .proof-author img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex: none; }

        .proof-actions { padding: 44px 0 0; }
        .proof-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-heading); font-weight: 600; color: var(--color-sky-blue); transition: gap 0.25s ease; }
        .proof-link:hover { gap: 12px; color: #fff; }

        /* A quiet roll-call of the people who actually left the reviews.
           Slow on purpose — 64s for one pass. */
        .name-marquee { margin-top: 84px; border-top: 1px solid rgba(234,243,247,0.12); padding: 26px 0; overflow: hidden; }
        .name-marquee-track { display: flex; width: max-content; animation: name-marquee 64s linear infinite; }
        .name-marquee-item {
            font-family: var(--font-heading); font-size: 0.78rem; font-weight: 600;
            letter-spacing: 0.2em; text-transform: uppercase;
            color: rgba(234,243,247,0.34); white-space: nowrap; padding-right: 26px;
        }
        .name-marquee-item::after { content: '·'; margin-left: 26px; color: rgba(234,243,247,0.18); }
        @keyframes name-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        @media (prefers-reduced-motion: reduce) { .name-marquee-track { animation: none; } }

        /* ---------- 6. DENTAL EDUCATION ---------- */
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

        /* ---------- 7. CLOSING ---------- */
        .closing-cta { padding: 96px 0 120px; text-align: center; }
        .closing-title { font-family: var(--font-heading); font-weight: 700; font-size: clamp(1.9rem, 1.3rem + 2.4vw, 3rem); line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 20px; color: var(--color-text-charcoal); }
        .closing-line { font-size: var(--fs-lead); color: var(--color-text-slate); max-width: 560px; margin: 0 auto 34px; line-height: 1.6; }

        /* ============================
           RESPONSIVE — TABLET (481-1024px)
           ============================ */
        @media (max-width: 1024px) {
            .desktop-only { display: none; }
            .mobile-break { display: inline; }

            .section-padding { padding: 32px 0; }
            .home-page .section-title { font-size: 2rem; margin-bottom: 0.75rem; line-height: 1.1; }

            /* ---- Hero — immersive full-bleed (photo as background) ---- */
            .hero-section { position: relative; padding: 0; min-height: 100vh; min-height: 100svh; display: block; text-align: left; overflow: hidden; }
            .hero-container { display: block; padding: 0; max-width: none; }
            .hero-visual { position: absolute; inset: 0; width: auto; max-width: none; margin: 0; z-index: 1; }
            .home-page .hero-card { position: absolute; inset: 0; height: 100%; max-width: none; }
            /* Full-bleed on phones: the photo has no left edge to dissolve. */
            .hero-media { -webkit-mask-image: none; mask-image: none; }
            .home-page .hero-card img { object-position: center 30%; filter: none; }
            /* Shade — light at the top, dark at the bottom for text contrast. The
               portrait crop shows the whole frame vertically, which puts the
               family's bare feet across the bottom ~20%; the shade reaches full
               opacity by 78% so the legs dissolve into the brand navy around shin
               height instead of ending in toes. */
            .home-page .hero-card::before {
                background: linear-gradient(180deg, rgba(15,35,50,0.30) 0%, rgba(15,35,50,0.05) 32%, rgba(13,42,58,0.42) 56%, rgba(13,42,58,0.88) 70%, rgba(13,42,58,1) 78%);
            }
            .hero-content {
                position: relative; z-index: 2; display: flex; flex-direction: column;
                align-items: flex-start; justify-content: flex-end;
                min-height: 100vh; min-height: 100svh; max-width: none;
                padding: 110px 22px calc(76px + env(safe-area-inset-bottom));
                text-align: left;
            }
            .hero-eyebrow { display: none; }
            .hero-subtitle-desktop { display: none; }
            .hero-subtitle-mobile { display: block; }
            .hero-trust { display: flex; order: -1; margin: 0 0 12px; gap: 10px; color: rgba(255,255,255,0.95); font-size: 0.85rem; }
            .hero-trust-item strong { color: #fff; }
            .hero-trust-divider { display: none; }
            .hero-trust .hero-trust-item:last-of-type { display: none; }
            .hero-title { font-size: 2.35rem; line-height: 1.12; margin-bottom: 10px; color: #fff; }
            .hero-title .text-gradient { background: none; -webkit-background-clip: initial; background-clip: initial; -webkit-text-fill-color: #fff; color: #fff; }
            .hero-subtitle { font-size: 1rem; color: rgba(255,255,255,0.92); margin: 0 0 18px; max-width: 420px; line-height: 1.55; }
            .hero-actions { gap: 14px; }
            .hero-actions .btn { background: #fff; color: var(--color-primary-deep); box-shadow: 0 12px 30px rgba(10,35,50,0.35); }
            .hero-secondary-link { display: none; }

            /* Trust rail — 2x2, still the first change of register */
            .trust-rail-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 18px; padding: 26px 16px; }
            .trust-divider { display: none; }
            .trust-stat strong { font-size: 1.4rem; }
            .trust-stat span { font-size: 0.64rem; letter-spacing: 0.13em; }

            .section-header { margin-bottom: 22px; }
            .section-lead { font-size: 1rem; margin-top: 10px; }

            /* Services — rows tighten to two lines, arrow drops away */
            .stage-row { grid-template-columns: 1fr; gap: 10px; padding: 22px 12px; }
            .stage-arrow { display: none; }
            .stage-eyebrow { margin-bottom: 8px; font-size: 0.66rem; }
            .stage-title { font-size: 1.35rem; }
            .stage-row:hover .stage-title { transform: none; }
            .stage-line { font-size: 0.92rem; }

            /* Team — back inside the container, photo above the copy */
            .welcome-section .container { max-width: 1200px; padding: 0 16px; }
            .welcome-container { grid-template-columns: 1fr; }
            .welcome-content-split { padding: 0; text-align: center; }
            .welcome-headline { font-size: 2rem; margin-bottom: 12px; }
            .welcome-description { font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5; margin-left: auto; margin-right: auto; }
            .welcome-image-split { height: 320px; width: 100%; border-radius: 24px; margin-top: 24px; }

            /* Proof — quotes become a snap carousel, matching the reading rail */
            .proof-section { padding: 56px 0 0; }
            .proof-statement { margin-bottom: 32px; }
            .proof-quotes {
                display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
                gap: 16px; padding: 8px 0 12px; scrollbar-width: none;
                border-top: 1px solid rgba(234,243,247,0.14);
            }
            .proof-quotes::-webkit-scrollbar { display: none; }
            .proof-quote {
                flex: 0 0 82%; scroll-snap-align: start;
                padding: 26px 0 26px 0; border-right: none;
            }
            .proof-quote:not(:first-child) { padding-left: 0; }
            .proof-quote p { font-size: 0.98rem; margin-bottom: 18px; }
            .proof-actions { padding-top: 20px; }
            .name-marquee { margin-top: 40px; padding: 20px 0; }

            /* Dental Education — header centered for consistency */
            .dental-edu-header { margin-bottom: 12px; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
            .horizontal-scroll-mask { padding: 8px 0 12px; }
            .horizontal-track-simple { gap: 20px; padding: 0 16px; }
            .insight-card-large { width: 320px; border-radius: 20px; }
            .insight-image-large { height: 200px; }
            .insight-content { padding: 20px; }
            .insight-content h3 { font-size: 1rem; line-height: 1.3; margin-bottom: 6px; }
            .read-more-link { font-size: 0.9rem; }

            .closing-cta { padding: 44px 0 56px; }
            .closing-line { font-size: 1rem; margin-bottom: 26px; }
        }

        /* ============================
           RESPONSIVE — PHONE (<=480px)
           ============================ */
        @media (max-width: 480px) {
            .section-padding { padding: 24px 0; }
            .home-page .section-title { font-size: 1.6rem; margin-bottom: 0.5rem; line-height: 1.1; }
            .section-header { margin-bottom: 18px; }

            .hero-title { font-size: 2.1rem; line-height: 1.12; margin-bottom: 10px; }
            .hero-subtitle { font-size: 1rem; max-width: 340px; }
            .hero-content { padding-left: 18px; padding-right: 18px; }
            .hero-actions .btn { width: auto; padding: 14px 24px; }

            /* Services — chip grid replaces the list on phones */
            .stage-list { display: none; }
            .chip-grid { display: grid; }

            .welcome-headline { font-size: 1.6rem; margin-bottom: 10px; }
            .welcome-description { font-size: 0.88rem; margin-bottom: 16px; }
            .welcome-image-split { height: 260px; border-radius: 20px; margin-top: 20px; }

            .proof-quote { flex: 0 0 88%; }

            .dental-edu-header { flex-direction: column; align-items: center; gap: 6px; text-align: center; }
            .horizontal-track-simple { gap: 12px; padding: 0 16px; }
            .insight-card-large { width: 240px; border-radius: 16px; }
            .insight-image-large { height: 140px; }
            .insight-content { padding: 14px; }
            .insight-content h3 { font-size: 0.95rem; line-height: 1.3; margin-bottom: 4px; }
            .read-more-link { font-size: 0.85rem; }
        }
      `}</Style>
        </div>
    );
};

export default Home;
