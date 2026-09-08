import { useBooking } from '../context/BookingContext';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';
import { Reveal } from '../components/Reveal';
import reviewStats from '../data/review-stats.json';
import ResponsiveImage from '../components/ResponsiveImage';
import dentists from '../data/dentists.js';

// Review avatar WebP variants
const AVATAR_MIKE_WEBP = "/images/reviews/mike_ngui.webp";
const AVATAR_KAH_MUN_WEBP = "/images/reviews/kah_mun_hew.webp";
const AVATAR_LYDIA_JPG = "/images/reviews/lydia_ng.jpg";

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
        text: "The only dental clinic I trust for my family with 2 young kids. An experienced team of dentists who are kind and caring, very clean and comfortable environment too.",
        author: "Lydia Ng",
        avatar: AVATAR_LYDIA_JPG
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

// The hero mosaic: two rows drifting in opposite directions, portraits mixed
// with tinted quote tiles so a glance always lands on faces AND words (the
// owner picked this over the arch strip, the spotlight and the gallery wall,
// 7 Sep 2026 — and dropped the caption row, since the words now live in the
// tiles). "Where competency and compassion meet." is his line, carrying the
// removed "Built on Competency & Compassion" section forward.
const MOSAIC_QUOTES = [
    'Caring for your whole family.',
    'Where competency and compassion meet.',
    '20+ years of trusted care.',
    'Growing older with our patients.'
];
const MOSAIC_ROW_A = [
    { d: dentists[0] }, { d: dentists[1] }, { q: MOSAIC_QUOTES[0] },
    { d: dentists[2] }, { d: dentists[3] }, { q: MOSAIC_QUOTES[1], alt: true }
];
const MOSAIC_ROW_B = [
    { q: MOSAIC_QUOTES[2], alt: true }, { d: dentists[4] }, { d: dentists[5] },
    { q: MOSAIC_QUOTES[3] }, { d: dentists[6] }, { d: dentists[7] }
];

// Each row is rendered twice for the seamless -50% loop; the second copy is
// decoration only (aria-hidden, untabbable).
const MosaicRow = ({ tiles, className }) => (
    <div className={`mosaic-row ${className}`}>
        {[0, 1].map(copy => tiles.map((tile, i) => {
            const hidden = copy === 1;
            if (tile.q) {
                return (
                    <div key={`${copy}-${i}`} className={`mosaic-tile mosaic-quote${tile.alt ? ' alt' : ''}`} aria-hidden={hidden || undefined}>
                        {tile.q}
                    </div>
                );
            }
            const d = tile.d;
            return (
                <Link
                    to={`/dentists/${d.slug}`}
                    key={`${copy}-${i}`}
                    className="mosaic-tile mosaic-portrait"
                    tabIndex={hidden ? -1 : 0}
                    aria-hidden={hidden || undefined}
                >
                    <picture>
                        <source type="image/avif" srcSet={portraitSrc(d.img, '.avif')} />
                        <source type="image/webp" srcSet={portraitSrc(d.img, '.webp')} />
                        <img src={encodeURI(d.img)} alt={hidden ? '' : (d.knownAs || d.name)} width="682" height="1024" loading="eager" decoding="async" />
                    </picture>
                </Link>
            );
        }))}
    </div>
);

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

    // The ambient layer: three soft colour fields behind the whole page whose
    // positions are a pure function of scroll progress. Scroll down and they
    // drift; scroll back and they return — scrubbed, not played. This is what
    // ties the bands together into one surface instead of stacked stripes.
    // Written to a CSS custom property so the styling stays in CSS, and
    // rAF-coalesced so the scroll path never does layout work twice a frame.
    // ---- The mosaic engine ----
    // The drift used to be a CSS keyframe animation, but the owner wants to
    // drag the strip to find a particular dentist, and a keyframe cannot be
    // grabbed. One master offset now drives both rows from a rAF clock:
    //   x = auto-drift (24px/s, paused on hover/drag/reduced-motion)
    //     + whatever the hand has added.
    // Row A shows -x, row B shows +x (opposite directions preserved), each
    // wrapped modulo its own half-width. The scrubber thumb mirrors row A's
    // phase and can be dragged to jump anywhere in the loop.
    const mosaicRef = useRef(null);
    const scrubRef = useRef(null);
    useEffect(() => {
        const root = mosaicRef.current;
        const track = scrubRef.current;
        if (!root || !track) return;
        const rowA = root.querySelector('.mosaic-row-a');
        const rowB = root.querySelector('.mosaic-row-b');
        const thumb = track.querySelector('.mosaic-scrub-thumb');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let x = 0, raf = null, last = null;
        let hover = false, dragging = false, visible = true;

        const paint = (now) => {
            raf = window.requestAnimationFrame(paint);
            if (last === null) last = now;
            const dt = Math.min(64, now - last) / 1000;
            last = now;
            if (!reduced && !hover && !dragging && visible) x += 24 * dt;

            const wa = rowA.scrollWidth / 2;
            const wb = rowB.scrollWidth / 2;
            if (!wa || !wb) return;
            const ma = ((x % wa) + wa) % wa;
            const mb = ((x % wb) + wb) % wb;
            rowA.style.transform = `translate3d(${(-ma).toFixed(2)}px,0,0)`;
            rowB.style.transform = `translate3d(${(mb - wb).toFixed(2)}px,0,0)`;
            const tw = track.clientWidth - thumb.clientWidth;
            if (tw > 0) thumb.style.transform = `translate3d(${((ma / wa) * tw).toFixed(2)}px,0,0)`;
        };

        // Only spend frames while the hero is on screen.
        const io = typeof IntersectionObserver !== 'undefined'
            ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; })
            : null;
        if (io) io.observe(root);

        // Hand-drag on the strip itself. touch-action: pan-y (CSS) keeps
        // vertical page scrolling native; horizontal movement is ours.
        let startX = 0, startVal = 0, moved = 0;
        const onDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            dragging = true; moved = 0; startX = e.clientX; startVal = x;
            if (root.setPointerCapture && e.pointerId !== undefined) {
                try { root.setPointerCapture(e.pointerId); } catch { /* no-op */ }
            }
        };
        const onMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            moved = Math.max(moved, Math.abs(dx));
            x = startVal - dx;
        };
        const onUp = () => { dragging = false; };
        // A real drag must not fire the portrait's link on release.
        const onClick = (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
        // Keyboard focus on a tile makes the browser scroll the clipped box;
        // that fights the transforms, so undo it and let the loop position.
        const onFocusIn = () => { root.scrollLeft = 0; };

        root.addEventListener('pointerdown', onDown);
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerup', onUp);
        root.addEventListener('pointercancel', onUp);
        root.addEventListener('click', onClick, true);
        root.addEventListener('focusin', onFocusIn);
        root.addEventListener('pointerenter', () => { hover = true; });
        root.addEventListener('pointerleave', () => { hover = false; onUp(); });

        // The scrubber: press or drag anywhere on the little track to jump.
        const scrubTo = (clientX) => {
            const rect = track.getBoundingClientRect();
            const tw = track.clientWidth - thumb.clientWidth;
            const wa = rowA.scrollWidth / 2;
            if (tw <= 0 || !wa) return;
            const frac = Math.min(1, Math.max(0, (clientX - rect.left - thumb.clientWidth / 2) / tw));
            x = frac * wa;
        };
        const sDown = (e) => {
            dragging = true; e.preventDefault(); scrubTo(e.clientX);
            const mv = (ev) => scrubTo(ev.clientX);
            const upf = () => { dragging = false; window.removeEventListener('pointermove', mv); };
            window.addEventListener('pointermove', mv);
            window.addEventListener('pointerup', upf, { once: true });
        };
        track.addEventListener('pointerdown', sDown);

        raf = window.requestAnimationFrame(paint);
        return () => {
            if (raf !== null) window.cancelAnimationFrame(raf);
            if (io) io.disconnect();
        };
        // Listeners on root/track die with the nodes; no manual teardown needed
        // beyond the frame loop and the observer.
    }, []);

    const ambientRef = useRef(null);
    const proofRef = useRef(null);
    useEffect(() => {
        const el = ambientRef.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frame = null;
        const paint = () => {
            frame = null;
            // The wash: the whole page cools as the proof section
            // approaches the middle of the viewport and warms back as it
            // leaves — a bell curve over the section's distance from centre,
            // so it is fully scrubbed by scroll in both directions.
            const proof = proofRef.current;
            if (proof) {
                const r = proof.getBoundingClientRect();
                const vh = window.innerHeight;
                const dist = Math.abs((r.top + r.height / 2) - vh / 2);
                const reach = vh * 0.85 + r.height / 2;
                const wash = Math.max(0, 1 - dist / reach);
                el.style.setProperty('--wash', (wash * wash).toFixed(4));
            }
        };
        const onScroll = () => {
            if (frame === null) frame = window.requestAnimationFrame(paint);
        };
        paint();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame !== null) window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div className="home-page">
            <Helmet>
                <title>Family Dental Clinic in Damansara Jaya, Petaling Jaya | iSmile</title>
                <meta name="description" content="Family dental clinic in Damansara Jaya, Petaling Jaya since 2006. Check-ups, braces, implants & kids' dentistry. Rated 4.8★ from 91 Google reviews. WhatsApp us to book." />
                <link rel="canonical" href="https://ismile.com.my/" />
            </Helmet>

            {/* Scroll-scrubbed background: one uniform wash, no local shapes */}
            <div className="home-ambient" ref={ambientRef} aria-hidden="true">
                <span className="ambient-wash" />
            </div>

            {/* ============ 1. HERO — the people who will actually treat you ============ */}
            <section className="hero-section">
                <div className="container hero-container">
                    {/* Hero content renders statically — above-the-fold copy must never start at opacity 0 */}
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Dental care for <em>every generation.</em>
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
                        {/* The moving mosaic: every dentist plus the words, drifting in
                            opposite directions. Pauses on hover, drags by hand (mouse or
                            touch), and the small scrubber underneath jumps anywhere in
                            the loop. Each portrait opens that dentist's profile. */}
                        <div className="hero-mosaic" ref={mosaicRef}>
                            <MosaicRow tiles={MOSAIC_ROW_A} className="mosaic-row-a" />
                            <MosaicRow tiles={MOSAIC_ROW_B} className="mosaic-row-b" />
                        </div>
                        <div className="mosaic-scrub" ref={scrubRef} aria-hidden="true">
                            <span className="mosaic-scrub-thumb" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ 2. SERVICES — a wide, numbered index on an inset band ============ */}
            <section className="services-section">
                <div className="container">
                    <div className="section-header services-header">
                        <Reveal width="100%"><h2 className="section-title">Comprehensive care for <em>every stage of life.</em></h2></Reveal>
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

                </div>
            </section>

            {/* ============ 3. PROOF — the teal band ============ */}
            <section className="proof-section" ref={proofRef}>
                <div className="container">
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

            {/* ============ 4. DENTAL EDUCATION — bare images, no card chrome ============ */}
            <section className="dental-education-section">
                <div className="container">
                    <div className="section-header dental-edu-header">
                        <h2 className="section-title">Dental <em>education.</em></h2>
                        <Link to="/blog" className="btn-link">Visit Learning Centre <ArrowRight size={16} /></Link>
                    </div>

                    <div className="horizontal-scroll-mask">
                        <div className="horizontal-track-simple">
                            {featuredBlogs.map((post, i) => (
                                <Link to={`/blog/${post.slug}`} key={i} className="edu-item">
                                    <div className="edu-image">
                                        <ResponsiveImage src={post.img} alt={post.title} loading="lazy" sizes="(max-width: 768px) 85vw, 420px" />
                                    </div>
                                    <h3 className="edu-title">{post.title}</h3>
                                    <span className="read-more-link">Read More</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ 5. CLOSING — just the invitation; the footer holds the facts ============ */}
            <section className="closing-cta">
                <div className="container closing-inner">
                    <h2 className="closing-title">Come and <em>meet us.</em></h2>
                    <p className="closing-line">
                        Tell us who is coming in and we will find a time that suits the family.
                    </p>
                    <Button onClick={() => openBooking('', 'home-closing-cta')}>Book a Visit <ArrowRight size={18} /></Button>
                </div>
            </section>

            <Style>{`
        /* ==========================================================
           HOMEPAGE
           One typographic system, committed:
             - eyebrow: 0.72rem uppercase, 0.2em tracking, teal
             - section title: --fs-h2, Outfit 700, tight
             - statement title (proof/closing): one shared larger scale
             - accent: ONE serif-italic phrase per headline (system
               Georgia — no font download), teal on light, pastel on teal
           And one surface: a scroll-scrubbed ambient background behind
           everything, with the two colour bands INSET and rounded so they
           read as shapes floating on the page, not full-width stripes.
           ========================================================== */

        .home-page { background: linear-gradient(180deg, #FFFFFF 0%, #F4F9FC 62%, #eff6ff 100%); min-height: 100vh; position: relative; }
        .home-page > section { position: relative; z-index: 1; }
        .mobile-break { display: none; }

        /* ---------- ambient layer ---------- */
        /* No blur filter: the radial gradients already fall off to transparent,
           and filter:blur on viewport-sized elements is what janks phones. */
        /* One UNIFORM wash, edge to edge — the earlier drifting colour blobs
           read as stains on the screen (owner, 7 Sep) and are gone. A full-
           surface tint cannot stain: it is the page itself changing colour. */
        .home-ambient { position: fixed; inset: 0; z-index: 0; pointer-events: none; --wash: 0; overflow: hidden; }
        .ambient-wash {
            position: absolute; inset: 0; border-radius: 0 !important;
            /* Kept deliberately pale (owner, 7 Sep: the saturated teal made the
               content hard to focus on). At full wash this reads as "the page
               turned a lighter blue", nothing more. */
            background: linear-gradient(180deg, rgba(224,242,254,0.5) 0%, rgba(216,238,245,0.8) 50%, rgba(224,242,254,0.5) 100%);
            opacity: var(--wash);
        }
        .home-ambient span { position: absolute; border-radius: 50%; will-change: transform; }

        /* ---------- the committed type system ---------- */
        .home-page h1 em, .home-page h2 em {
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-weight: 500;
            letter-spacing: -0.01em;
            color: var(--color-primary-deep);
        }
        .hero-title, .section-title, .proof-statement, .closing-title { text-wrap: balance; }

        .section-eyebrow {
            display: block;
            font-family: var(--font-heading); font-weight: 700;
            font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--color-primary-teal);
            margin-bottom: 18px;
        }
        .section-title { margin: 0; font-size: var(--fs-h2); font-weight: 700; line-height: 1.12; letter-spacing: -0.03em; }
        /* Proof and closing share ONE statement scale — no more one section
           shouting louder than the next. */
        .proof-statement, .closing-title {
            font-family: var(--font-heading); font-weight: 700;
            font-size: clamp(2.2rem, 1.5rem + 2.8vw, 3.4rem);
            line-height: 1.06; letter-spacing: -0.03em; margin: 0;
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
            grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
            gap: 56px;
            align-items: center;
        }
        /* min-width:0 on both grid children: the ensemble track is
           width:max-content (~2300px for sixteen portraits), and without an
           explicit minimum the grid's automatic min-size lets that intrinsic
           width blow the column out to the track's full width — the h1 then
           sits on a 2300px line and the phone shows a cropped headline. */
        .hero-content { text-align: left; min-width: 0; }
        .hero-visual { min-width: 0; max-width: 100%; }

        /* Sized so "Dental care for" / "every generation." sit on TWO lines at
           desktop widths, like the live site — the previous 0.92fr column plus
           the 4.5rem cap forced a third line. */
        .hero-title { font-size: clamp(2.5rem, 1.5rem + 3.4vw, 4rem); line-height: 1.06; margin-bottom: 24px; font-weight: 700; letter-spacing: -0.035em; }
        @media (min-width: 1025px) { .hero-title em { white-space: nowrap; } }
        .hero-subtitle { font-size: var(--fs-lead); color: var(--color-text-slate); margin-bottom: 36px; max-width: 480px; line-height: 1.65; }
        .hero-subtitle-mobile { display: none; }
        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }

        /* Quiet footnote under the CTA: short rule + one fact. */
        .hero-trust { display: flex; align-items: center; gap: 14px; margin-top: 44px; color: var(--color-text-slate); font-size: 0.92rem; }
        .hero-trust-rule { width: 34px; height: 1px; background: rgba(16,42,51,0.25); flex: none; }
        .hero-trust-item { display: flex; align-items: center; gap: 8px; }
        .hero-trust-item strong { color: var(--color-text-charcoal); }
        .hero-trust-stars { display: inline-flex; gap: 2px; }

        /* The moving mosaic: two counter-drifting rows of square tiles —
           portraits and tinted quote tiles — masked so the edges fade rather
           than hard-cut. A glance always lands on faces and words together. */
        .hero-mosaic {
            overflow: hidden;
            display: flex; flex-direction: column; gap: 16px;
            padding: 6px 0;
            -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
            mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
        }
        .mosaic-row { display: flex; gap: 16px; width: max-content; will-change: transform; }
        /* Motion comes from the JS clock (drag + scrub need a graspable
           offset, which a CSS keyframe cannot give). pan-y keeps vertical
           page scrolling native on touch while horizontal drags are ours. */
        .hero-mosaic { touch-action: pan-y; cursor: grab; }
        .hero-mosaic:active { cursor: grabbing; }
        .hero-mosaic a { -webkit-user-drag: none; user-select: none; }

        /* The scrubber: a whisper of UI. A short hairline with a soft thumb —
           no arrows, no labels; it moves with the strip and can be dragged. */
        .mosaic-scrub {
            position: relative; margin: 18px auto 0;
            width: 140px; height: 14px; cursor: pointer;
            touch-action: none;
        }
        .mosaic-scrub::before {
            content: ''; position: absolute; left: 0; right: 0; top: 6px; height: 3px;
            border-radius: 99px; background: rgba(16,42,51,0.10);
        }
        .mosaic-scrub-thumb {
            position: absolute; top: 5px; left: 0; width: 34px; height: 5px;
            border-radius: 99px; background: rgba(0,110,140,0.45);
            transition: background 0.25s ease;
        }
        .mosaic-scrub:hover .mosaic-scrub-thumb { background: var(--color-primary-deep); }

        .mosaic-tile { flex: none; width: 192px; height: 192px; border-radius: 20px; overflow: hidden; }
        .mosaic-portrait { display: block; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .mosaic-portrait:hover { transform: translateY(-5px); }
        .mosaic-portrait picture, .mosaic-portrait img { width: 100%; height: 100%; }
        .mosaic-portrait img { display: block; object-fit: cover; object-position: center 14%; background: #f2f0ec; }
        .mosaic-quote {
            background: var(--color-tint-blue);
            display: flex; align-items: center; padding: 24px;
            font-family: Georgia, 'Times New Roman', serif; font-style: italic;
            font-size: 1.05rem; line-height: 1.45; color: var(--color-primary-deep);
        }
        .mosaic-quote.alt { background: var(--color-tint-light); }

        /* ---------- 2. SERVICES ---------- */
        /* No filled band: the owner read the inset boxes as two giant cards.
           The section sits straight on the evolving background. */
        .services-section { padding: 96px 0 108px; }
        /* Same 1200px column as every other section — the wider 1360px run
           made this one section misalign with the header and its neighbours
           (owner, 7 Sep). */
        .section-header { margin-bottom: 64px; }
        .services-header { max-width: 880px; }
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


        /* ---------- 3. PROOF ---------- */
        /* No filled band here either: the register change is the background
           itself cooling toward teal (the .ambient-wash above) as this section
           reaches the middle of the screen, and warming back on the way out. */
        .proof-section { padding: 110px 0 0; overflow: hidden; }
        .proof-eyebrow {
            font-family: var(--font-heading); font-weight: 700;
            font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--color-primary-teal); margin: 0 0 18px;
        }
        .proof-statement { color: var(--color-text-charcoal); margin-bottom: 64px; }

        .proof-quotes { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(16,42,51,0.14); }
        .proof-quote { margin: 0; padding: 44px 40px 44px 0; border-right: 1px solid rgba(16,42,51,0.14); }
        .proof-quote:last-child { border-right: none; }
        .proof-quote:not(:first-child) { padding-left: 40px; }
        .proof-quote p { font-size: 1.05rem; line-height: 1.65; color: var(--color-text-slate); margin: 0 0 26px; }
        .proof-author { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; letter-spacing: 0.04em; color: var(--color-text-grey); }
        .proof-author img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex: none; }

        .proof-actions { padding: 48px 0 0; }
        .proof-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-heading); font-weight: 600; color: var(--color-primary-deep); transition: gap 0.25s ease, color 0.25s ease; }
        .proof-link:hover { gap: 12px; color: var(--color-primary-teal); }

        /* The slow roll: what we do, not who reviewed us. 64s per pass. */
        .name-marquee { margin-top: 72px; border-top: 1px solid rgba(16,42,51,0.12); padding: 28px 0; overflow: hidden; }
        .name-marquee-track { display: flex; width: max-content; animation: name-marquee 64s linear infinite; }
        .name-marquee-item {
            font-family: var(--font-heading); font-size: 0.78rem; font-weight: 600;
            letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--color-text-grey); white-space: nowrap; padding-right: 28px;
        }
        .name-marquee-item::after { content: '·'; margin-left: 28px; color: rgba(16,42,51,0.25); }
        @keyframes name-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-33.333%,0,0); } }
        @media (prefers-reduced-motion: reduce) { .name-marquee-track { animation: none; } }

        /* ---------- 4. DENTAL EDUCATION (no card chrome) ---------- */
        .dental-education-section { padding: 110px 0 30px; }
        .dental-edu-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 36px; }
        .btn-link { color: var(--color-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; padding-bottom: 6px; }
        .horizontal-scroll-mask { width: 100%; overflow-x: auto; padding: 12px 0 32px; scrollbar-width: none; -ms-overflow-style: none; }
        .horizontal-scroll-mask::-webkit-scrollbar { display: none; }
        .horizontal-track-simple { display: flex; gap: 36px; width: max-content; padding: 0 4px; }

        /* Bare editorial items: a rounded image, a title, a quiet link.
           No white box, no border, no shadow — the chrome was the last of the
           card language left on this page. */
        .edu-item { display: block; width: 400px; flex: none; text-decoration: none; color: inherit; }
        .edu-image { border-radius: 26px; overflow: hidden; aspect-ratio: 3 / 2; margin-bottom: 20px; }
        .edu-image picture, .edu-image img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .edu-item:hover .edu-image img { transform: scale(1.05); }
        .edu-title { font-family: var(--font-heading); font-weight: 700; font-size: 1.12rem; line-height: 1.35; letter-spacing: -0.01em; margin: 0 0 10px; color: var(--color-text-charcoal); }
        .read-more-link { font-size: 0.92rem; color: var(--color-primary-deep); font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
        .read-more-link::after { content: '→'; transition: transform 0.25s ease; }
        .edu-item:hover .read-more-link::after { transform: translateX(4px); }

        /* ---------- 5. CLOSING (invitation only — the footer holds the facts) ---------- */
        .closing-cta { padding: 100px 0 120px; }
        .closing-inner { text-align: center; max-width: 640px; }
        .closing-title { color: var(--color-text-charcoal); margin-bottom: 22px; }
        .closing-line { font-size: var(--fs-lead); color: var(--color-text-slate); margin: 0 auto 36px; line-height: 1.65; max-width: 460px; }

        /* ============================
           RESPONSIVE — TABLET (481-1024px)
           ============================ */
        @media (max-width: 1024px) {
            .desktop-only { display: none; }
            .mobile-break { display: inline; }

            .home-page .section-title { font-size: 2rem; line-height: 1.12; }

            /* ---- Hero — the owner's mobile order: eyebrow line first, then
               the mosaic, then the headline and the rest of the copy. The
               copy wrapper dissolves (display:contents) so its children and
               the mosaic can be ordered as siblings without touching the
               desktop markup. ---- */
            .hero-section { min-height: 0; padding: 130px 0 40px; display: block; }
            /* align-items must be reset: the desktop grid centres its two
               columns vertically, and that value carried into this flex column
               and centred the CTA and trust row under left-aligned copy. */
            .hero-container { display: flex; flex-direction: column; gap: 0; align-items: flex-start; }
            .hero-visual { width: 100%; }
            .hero-content { display: contents; }
            .hero-title { order: 2; }
            .hero-visual { order: 3; margin-bottom: 26px; }
            .hero-subtitle { order: 4; }
            .hero-actions { order: 5; }
            .hero-trust { order: 6; }
            .hero-title { font-size: 2.8rem; line-height: 1.08; margin-bottom: 24px; }
            .hero-subtitle-desktop { display: none; }
            .hero-subtitle-mobile { display: block; }
            .hero-subtitle { font-size: 1rem; margin-bottom: 22px; max-width: 420px; line-height: 1.55; }
            .hero-trust { margin-top: 24px; font-size: 0.88rem; }

            .hero-mosaic { gap: 12px; padding: 4px 0 8px; }
            .mosaic-row { gap: 12px; }
            .mosaic-tile { width: 150px; height: 150px; border-radius: 16px; }
            .mosaic-quote { padding: 16px; font-size: 0.9rem; line-height: 1.4; }

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
            .proof-section { padding: 56px 0 0; }
            .proof-statement { margin-bottom: 32px; }
            .proof-quotes {
                display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
                gap: 16px; padding: 8px 0 12px; scrollbar-width: none;
                border-top: 1px solid rgba(16,42,51,0.14);
            }
            .proof-quotes::-webkit-scrollbar { display: none; }
            .proof-quote {
                flex: 0 0 82%; scroll-snap-align: start;
                padding: 26px 0; border-right: none;
            }
            .proof-quote:not(:first-child) { padding-left: 0; }
            .proof-quote p { font-size: 0.98rem; margin-bottom: 18px; }
            .proof-actions { padding-top: 20px; }
            .name-marquee { margin-top: 40px; padding: 20px 0; }

            /* Dental Education */
            .dental-education-section { padding: 48px 0 10px; }
            .dental-edu-header { flex-direction: column; align-items: flex-start; gap: 10px; margin-bottom: 16px; }
            .btn-link { padding-bottom: 0; }
            .horizontal-scroll-mask { padding: 8px 0 12px; }
            .horizontal-track-simple { gap: 20px; padding: 0 2px; }
            .edu-item { width: 300px; }
            .edu-image { border-radius: 20px; margin-bottom: 14px; }
            .edu-title { font-size: 1rem; margin-bottom: 6px; }
            .read-more-link { font-size: 0.88rem; }

            .closing-cta { padding: 48px 0 64px; }
            .closing-line { font-size: 1rem; margin-bottom: 26px; }
        }

        /* ============================
           RESPONSIVE — PHONE (<=480px)
           ============================ */
        @media (max-width: 480px) {
            .home-page .section-title { font-size: 1.6rem; line-height: 1.12; }
            .section-header { margin-bottom: 18px; }

            .hero-section { padding: 116px 0 32px; }
            .hero-title { font-size: 2.45rem; }
            .hero-subtitle { max-width: 340px; }

            .mosaic-tile { width: 126px; height: 126px; border-radius: 14px; }
            .mosaic-quote { padding: 12px; font-size: 0.8rem; }

            /* Services — the rows stay on phones too (chips retired, owner
               7 Sep: the white chip cards were the card language creeping back) */
            .services-section { padding: 36px 0 44px; }
            .stage-row { padding: 18px 2px; }
            .stage-title { font-size: 1.2rem; }
            .stage-line { font-size: 0.88rem; }

            .proof-quote { flex: 0 0 88%; }

            .horizontal-track-simple { gap: 14px; }
            .edu-item { width: 240px; }
            .edu-image { border-radius: 16px; margin-bottom: 12px; }
            .edu-title { font-size: 0.95rem; }

            .closing-title { font-size: 1.9rem; }
        }
      `}</Style>
        </div>
    );
};

export default Home;
