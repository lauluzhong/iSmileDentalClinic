import { Helmet } from 'react-helmet-async';
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Button from '../components/Button';
import { Reveal } from '../components/Reveal';
import Style from '../components/Style';
import reviewStats from '../data/review-stats.json';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';

const GoogleG = () => (
    <svg width="13" height="13" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
    </svg>
);

// Reviewers who have no profile photo get initials on a brand-tinted tile rather
// than a generic silhouette. Deterministic: the same name always picks the same
// tint, so the avatar is stable across renders and reorderings.
// Charcoal on the three lighter brand tints — 6.6:1, 10.5:1 and 13.2:1, so all
// clear WCAG AA. White on these fails (down to 1.5:1), hence the dark text.
const AVATAR_TINTS = [
    'var(--color-sky-blue)',
    'var(--color-pastel-blue)',
    'var(--color-tint-blue)',
];

// First + last initial, so "Sook Yeen Lee" reads SL rather than colliding with
// "Sze Yoong" at SY.
const initialsOf = (name) => {
    const parts = name.split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    const picked = parts.length === 1 ? [parts[0]] : [parts[0], parts[parts.length - 1]];
    return picked.map((w) => w[0].toUpperCase()).join('');
};

const InitialsAvatar = ({ name, size = 50 }) => {
    const tint = AVATAR_TINTS[
        [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TINTS.length
    ];
    return (
        <div
            aria-hidden="true"
            style={{
                width: size, height: size, borderRadius: '50%',
                background: tint, color: 'var(--color-text-charcoal)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 600,
                fontSize: size * 0.38, letterSpacing: '0.02em', lineHeight: 1,
            }}
        >
            {initialsOf(name)}
        </div>
    );
};

const reviewsList = [
    {
        text: (
            <>
                <p>
                    "I have been a patient of iSmile for <strong>over a decade</strong>.
                    The dental professionals there are <strong>truly professional and caring</strong>.
                </p>
                <p>
                    My <strong>fear of being in the dentist chair has been completely removed</strong> by the{" "}
                    <strong>gentle care</strong> I received. I also appreciate their cooperation with my
                    orthodontist, from the time iSmile was still in Uptown.
                </p>
                <p>
                    My family’s dental health is <strong>securely in the hands of iSmile</strong>."
                </p>
            </>
        ),
        author: "Mike Ngui",
        tags: ["family", "nervous", "longtime"],
        rating: 5,
        avatar: "/images/reviews/mike_ngui.png"
    },
    {
        text: (
            <>
                <p>
                    "My regular dental clinic of <strong>over a decade</strong>, with <strong>trustworthy dentists</strong>,
                    assistants and receptionists who work diligently with so much <strong>care and love</strong> for
                    every single one of their patients.
                </p>
                <p>
                    I've referred multiple family members here since I first came, because I know they
                    will <strong>always be in good hands</strong> here at iSmile. The environment is also
                    inviting, clean and calming. <strong>Highly recommended.</strong>"
                </p>
            </>
        ),
        author: "Kah Mun Hew",
        tags: ["family", "longtime"],
        rating: 5,
        avatar: "/images/reviews/kah_mun_hew.png"
    },
    {
        text: (
            <>
                <p>
                    "Have been to my fair share of dentists. Above all, I appreciate iSmile's <strong>professional care</strong>{" "}
                    and <strong>'customer first' attitude</strong>. They would prescribe but also would listen to
                    concerns and also <strong>see the situation holistically</strong>.
                </p>
                <p>
                    It's good they <strong>track records and my dental history</strong> in their system so that
                    whoever attends to you will have a clear picture. Appreciated <strong>Dr Jean and Dr Mah</strong>{" "}
                    very much for their <strong>gentle and thorough care</strong>."
                </p>
            </>
        ),
        author: "Benny Kong",
        tags: ["nervous"],
        rating: 5,
        avatar: "/images/reviews/benny_kong.png"
    },
    {
        text: (
            <>
                <p>
                    "Happy with the service and helpful that there is one reserved parking in front of the clinic.
                    Good location near Atria DJ and the clinic is clean and calm vibes.
                </p>
                <p>
                    Thank you <strong>Dr Jean</strong> and all the friendly staff too! 🙂"
                </p>
            </>
        ),
        author: "Ashley Chin",
        tags: [],
        rating: 5,
        avatar: "/images/reviews/ashley_chin.png"
    },
    {
        text: "Dr Jean is thorough, professional, gentle yet strong. Have been seeing for over 20 years and will continue to do so.",
        author: "Karen Lam",
        tags: ["nervous", "longtime"],
        rating: 5,
        avatar: "/images/reviews/karen_lam.png"
    },
    {
        text: (
            <>
                <p>
                    "The only dental clinic I trust for my family with <strong>2 young kids</strong>.
                    An experienced team of dentists who are <strong>kind and caring</strong>,
                    very <strong>clean and comfortable environment</strong> too."
                </p>
            </>
        ),
        author: "Lydia Ng",
        tags: ["family"],
        rating: 5,
        avatar: "/images/reviews/lydia_ng.jpg",
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "Family visit to iSmile is a must each time we are back here in Malaysia.
                    Saw <strong>Dr. Jean</strong>, <strong>Dr. Ling</strong> and <strong>Dr. Mah</strong>.
                    Love the ambience each time."
                </p>
                <p>
                    "Friendly receptionist and nurses too.{" "}
                    <strong>Trustworthy dentist</strong> you can definitely rely on for healthy dental care :)"
                </p>
            </>
        ),
        author: "Sze Yoong",
        tags: ["family"],
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "My trusted dental clinic all the time for <strong>myself and my family</strong>.
                    I greatly appreciate your care, everything you have done for us. Thank you."
                </p>
            </>
        ),
        author: "Sook Yeen Lee",
        tags: ["family"],
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "They have been my <strong>go-to dentist for me and my kids</strong> for many years.
                </p>
                <p>
                    Dr Mah has been giving me <strong>kind and detailed advice</strong> to help me with my periodontal disease.
                    Thank you, iSmile. 😊"
                </p>
            </>
        ),
        author: "Tan Bee Wah",
        tags: ["family", "longtime", "treatment"],
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "Dr Amy is the <strong>most amazing and gentle dentist</strong>. She has been our{" "}
                    <strong>family dentist for more than 10 years</strong>.
                </p>
                <p>
                    Elaine is a really friendly and efficient front desk staff. Always welcoming every
                    patient with her warm smile 🥰"
                </p>
            </>
        ),
        author: "Christina Phang",
        tags: ["family", "nervous", "longtime"],
        rating: 5,
        avatar: "/images/reviews/christina_phang.jpg",
        type: "Verified Google Review"
    },
    {
        text: "Appreciate reminder of appointments, nice and clean and bright reception area and of course excellent dental services.",
        author: "Wee Min Lee",
        tags: [],
        rating: 5,
        avatar: "/images/reviews/wee_min_lee.png"
    },
    {
        text: (
            <>
                <p>
                    "Best dental clinic ever. Amazing dentist and front desk person who is always ever willing to explain{" "}
                    and accommodate and super prompt.
                </p>
                <p>
                    My family have had <strong>multiple dental treatments</strong> here with <strong>Dr Priscilla</strong> ❤️❤️"
                </p>
            </>
        ),
        author: "Dashaene Mahalingam",
        tags: ["family", "treatment"],
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "Our family has been coming here for <strong>many years</strong>.
                </p>
                <p>
                    We have seen most of the dentists, <strong>Dr Ong</strong> and the team give{" "}
                    <strong>excellent service</strong> and always <strong>caring and reassuring</strong>."
                </p>
            </>
        ),
        author: "Fong Lim",
        tags: ["family", "longtime"],
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "Brilliant doctors in this establishment. Very caring and good with children."
                </p>
            </>
        ),
        author: "Gayatri Raja Mohan",
        tags: ["family"],
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "I've been a regular at iSmile for almost 3 years now. Dr. Jean is very{" "}<strong>professional, warm and caring</strong>.
                </p>
                <p>
                    I used to find scaling quite uncomfortable with previous dentists, but she always makes the experience{" "}<strong>smooth and pain-free</strong>.
                </p>
                <p>
                    I also did teeth whitening here, and the photo shows the progress I made after just one week of the treatment.
                </p>
                <p>
                    Being in the sales line, having a <strong>brighter smile</strong> has definitely helped my confidence when meeting with clients.
                </p>
                <p>
                    The clinic has a nice homey feel and is a <strong>family-friendly environment</strong>. The staff at the front desk are also easy-going and friendly.{" "}<strong>Definitely recommend.</strong>"
                </p>
            </>
        ),
        author: "Max Loh",
        tags: ["family", "nervous", "treatment"],
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "I have been coming to iSmile Dental for <strong>nearly 20 years</strong>, and I can confidently say that{" "}
                    Dr. Ong is still the <strong>best dentist</strong> I have ever known.
                </p>
                <p>
                    Her dedication to her patients is unmatched; she truly gives her absolute best every single time.
                    Most recently, Dr. Ong <strong>helped my wife with her denture</strong>, and the fit and function are perfect.
                </p>
                <p>
                    We also appreciate Elaine at the reception for her consistent kindness and excellent service over the years.
                    We are so grateful for the expertise and kindness of the <strong>entire team</strong>. Thank you, Dr. Ong and her team!"
                </p>
            </>
        ),
        author: "Anson Chow",
        tags: ["longtime", "treatment"],
        rating: 5,
        type: "Verified Google Review"
    }
];

// Tabs are derived from the reviews above, not hand-picked: a group only
// becomes a tab when at least MIN_PER_TAB reviews carry its tag, so a thin
// group never shows an almost-empty tab. "All" is always first.
const MIN_PER_TAB = 3;
const GROUP_DEFS = [
    { id: 'family', label: 'Families & kids' },
    { id: 'nervous', label: 'Nervous patients' },
    { id: 'longtime', label: 'Long-time patients' },
    { id: 'treatment', label: 'Treatments' },
];

const GROUPS = [
    { id: 'all', label: 'All', reviews: reviewsList },
    ...GROUP_DEFS
        .map((g) => ({ ...g, reviews: reviewsList.filter((r) => r.tags.includes(g.id)) }))
        .filter((g) => g.reviews.length >= MIN_PER_TAB),
];

const SWIPE_PX = 48;

// One review at a time: slide + fade along the direction of travel, 220ms,
// transform and opacity only. Reduced motion collapses to a plain cross-fade.
const slide = {
    enter: (dir) => ({ opacity: 0, x: dir * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -32 }),
};
const fade = {
    enter: { opacity: 0, x: 0 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 0 },
};
const EASE = [0.16, 1, 0.3, 1];

const ReviewQuote = ({ review }) => (
    <figure className="rq">
        <div className="rq-stars" aria-label={`${review.rating} out of 5 stars`}>
            {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="#E0A500" color="#E0A500" aria-hidden="true" />)}
        </div>
        <blockquote className="rq-text">{review.text}</blockquote>
        <figcaption className="rq-author">
            {review.avatar ? (
                <img src={review.avatar} alt="" loading="lazy" width="44" height="44" className="rq-avatar" />
            ) : (
                <InitialsAvatar name={review.author} size={44} />
            )}
            <div className="rq-author-text">
                <strong>{review.author}</strong>
                <span className="rq-type"><GoogleG /> Verified Google review</span>
            </div>
        </figcaption>
    </figure>
);

const Reviews = () => {
    // Meta comes from src/data/corePagesSeo.js, the same source the build
    // uses to prerender this page — so the two cannot drift.
    const seo = CORE_PAGES.find(p => p.path === 'reviews');
    const uid = useId();
    const prefersReducedMotion = useReducedMotion();

    const [groupId, setGroupId] = useState(GROUPS[0].id);
    const [index, setIndex] = useState(0);
    const [dir, setDir] = useState(1);
    // Drag-to-swipe only on touch screens; on a mouse it would steal text selection.
    const [coarse, setCoarse] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(pointer: coarse)');
        const sync = () => setCoarse(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    const group = useMemo(() => GROUPS.find((g) => g.id === groupId) || GROUPS[0], [groupId]);
    const total = group.reviews.length;
    const review = group.reviews[index];

    const go = (step) => {
        setDir(step);
        setIndex((i) => (i + step + total) % total);
    };
    const pickGroup = (id) => {
        if (id === groupId) return;
        setDir(1);
        setGroupId(id);
        setIndex(0);
    };

    // Left/right arrow keys move between tabs when the tablist has focus
    // (WAI-ARIA tabs pattern) and between reviews when the quote has focus.
    const tabRefs = useRef([]);
    const onTabKey = (e, i) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + GROUPS.length) % GROUPS.length;
        pickGroup(GROUPS[next].id);
        tabRefs.current[next]?.focus();
    };
    const onStageKey = (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    const onDragEnd = (_, info) => {
        if (info.offset.x < -SWIPE_PX) go(1);
        else if (info.offset.x > SWIPE_PX) go(-1);
    };

    const variants = prefersReducedMotion ? fade : slide;
    const transition = prefersReducedMotion
        ? { duration: 0.15 }
        : { duration: 0.22, ease: EASE };

    return (
        <div className="reviews-page">
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href="https://ismile.com.my/reviews" />
            </Helmet>
            <div className="reviews-hero-gradient">
                <div className="container">
                    <Reveal width="100%">
                        <h1 className="reviews-hero-title">
                            Stories from <em>our community</em>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2} width="100%">
                        <p className="reviews-hero-subtitle">
                            Real families, real stories. Some have trusted us for over two decades—here's what they have to say.
                        </p>
                    </Reveal>

                    <Reveal delay={0.3} width="100%">
                        <div className="reviews-stats">
                            <span className="reviews-trust-rule" aria-hidden="true" />
                            <div className="reviews-trust-item">
                                <div className="reviews-trust-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#E0A500" color="#E0A500" />)}
                                </div>
                                <span><strong>{reviewStats.rating}</strong> on Google · {reviewStats.count} reviews</span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="container reviews-content">
                <div className="rv-tabs-wrap">
                    <div className="rv-tabs" role="tablist" aria-label="Reviews by topic">
                        {GROUPS.map((g, i) => {
                            const active = g.id === groupId;
                            return (
                                <button
                                    key={g.id}
                                    ref={(el) => { tabRefs.current[i] = el; }}
                                    type="button"
                                    role="tab"
                                    id={`${uid}-tab-${g.id}`}
                                    aria-selected={active}
                                    aria-controls={`${uid}-panel`}
                                    tabIndex={active ? 0 : -1}
                                    className={`rv-tab${active ? ' is-active' : ''}`}
                                    onClick={() => pickGroup(g.id)}
                                    onKeyDown={(e) => onTabKey(e, i)}
                                >
                                    {g.label}
                                    <span className="rv-tab-count">{g.reviews.length}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="rv-stage"
                    role="tabpanel"
                    id={`${uid}-panel`}
                    aria-labelledby={`${uid}-tab-${groupId}`}
                >
                    <button type="button" className="rv-arrow rv-arrow-prev" onClick={() => go(-1)} aria-label="Previous review">
                        <ChevronLeft size={22} strokeWidth={1.75} aria-hidden="true" />
                    </button>

                    <div className="rv-viewport" tabIndex={0} onKeyDown={onStageKey} aria-live="polite" aria-atomic="true">
                        <AnimatePresence mode="wait" custom={dir} initial={false}>
                            <motion.div
                                key={`${groupId}-${index}`}
                                className="rv-slide"
                                custom={dir}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={transition}
                                drag={coarse ? 'x' : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.12}
                                dragMomentum={false}
                                onDragEnd={onDragEnd}
                            >
                                <ReviewQuote review={review} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button type="button" className="rv-arrow rv-arrow-next" onClick={() => go(1)} aria-label="Next review">
                        <ChevronRight size={22} strokeWidth={1.75} aria-hidden="true" />
                    </button>

                    <p className="rv-counter">
                        <span className="rv-counter-now">{index + 1}</span>
                        <span className="rv-counter-sep" aria-hidden="true">/</span>
                        <span>{total}</span>
                    </p>
                </div>

                <div className="reviews-closing">
                    <Reveal width="100%"><h2 className="statement">Have a <em>story</em> to share?</h2></Reveal>
                    <a href="https://g.page/r/CQU1Takv7hs4EAE/review" target="_blank" rel="noopener noreferrer"><Button>Share Your Experience</Button></a>
                </div>
            </div>

            <Style>{`
                /* no opaque page background — the shared hero tint (index.css) shows through */
                .reviews-page .reviews-hero-gradient { padding: 160px 0 56px; text-align: center; }
                .reviews-page .reviews-hero-title { max-width: 780px; margin: 0 auto 20px; font-size: clamp(2.4rem, 1.6rem + 3.4vw, 4rem); font-weight: 700; line-height: 1.05; letter-spacing: -.03em; text-wrap: balance; }
                .reviews-page .reviews-hero-subtitle { max-width: 640px; margin: 0 auto; color: var(--color-text-slate); font-size: var(--fs-lead); line-height: 1.6; }
                .reviews-page .reviews-stats { display: inline-flex; align-items: center; gap: 14px; margin-top: 40px; color: var(--color-text-slate); font-size: .92rem; }
                .reviews-page .reviews-trust-rule { width: 34px; height: 1px; background: var(--hairline-strong); flex: none; }
                .reviews-page .reviews-trust-item, .reviews-page .reviews-trust-stars { display: flex; align-items: center; gap: 8px; }
                .reviews-page .reviews-trust-stars { gap: 2px; }
                .reviews-page .reviews-trust-item strong { color: var(--color-text-charcoal); }
                .reviews-page .reviews-content { padding-top: 8px; }

                /* Tabs: a pill rail. Centred when it fits, edge-bleed scroll on phones. */
                .reviews-page .rv-tabs-wrap { overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; margin: 0 -20px; padding: 4px 20px; }
                .reviews-page .rv-tabs-wrap::-webkit-scrollbar { display: none; }
                .reviews-page .rv-tabs { display: flex; gap: 8px; width: max-content; max-width: 100%; margin: 0 auto; }
                .reviews-page .rv-tab {
                    display: inline-flex; align-items: center; gap: 8px; flex: none;
                    min-height: 44px; padding: 10px 18px; border-radius: 50px;
                    border: 1px solid var(--hairline-strong); background: transparent;
                    font-family: var(--font-heading); font-weight: 600; font-size: .92rem; white-space: nowrap;
                    color: var(--color-text-slate); cursor: pointer;
                    transition: background 180ms var(--ease-slow), color 180ms var(--ease-slow), border-color 180ms var(--ease-slow), transform 100ms ease-out;
                }
                .reviews-page .rv-tab:hover { color: var(--color-primary-deep); border-color: var(--color-primary-teal); }
                .reviews-page .rv-tab:active { transform: scale(.97); }
                .reviews-page .rv-tab.is-active { background: var(--color-primary-deep); border-color: var(--color-primary-deep); color: #fff; }
                .reviews-page .rv-tab-count { font-size: .76rem; font-weight: 600; opacity: .72; }
                .reviews-page .rv-tab:focus-visible, .reviews-page .rv-arrow:focus-visible, .reviews-page .rv-viewport:focus-visible { outline: 2px solid var(--color-primary-teal); outline-offset: 2px; }

                /* Stage: one quote, arrows either side on desktop, counter beneath. */
                .reviews-page .rv-stage {
                    display: grid; grid-template-columns: 48px minmax(0, 1fr) 48px; grid-template-rows: auto auto;
                    column-gap: 24px; align-items: center;
                    max-width: 960px; margin: 40px auto 0;
                }
                .reviews-page .rv-viewport { grid-column: 2; grid-row: 1; min-height: 320px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 16px; }
                .reviews-page .rv-slide { width: 100%; touch-action: pan-y; }
                .reviews-page .rv-arrow-prev { grid-column: 1; grid-row: 1; }
                .reviews-page .rv-arrow-next { grid-column: 3; grid-row: 1; }
                .reviews-page .rv-arrow {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 48px; height: 48px; border-radius: 50%;
                    border: 1px solid var(--hairline-strong); background: var(--color-bg-white); color: var(--color-text-charcoal);
                    cursor: pointer;
                    transition: color 180ms var(--ease-slow), border-color 180ms var(--ease-slow), transform 100ms ease-out;
                }
                .reviews-page .rv-arrow:hover { color: var(--color-primary-deep); border-color: var(--color-primary-teal); }
                .reviews-page .rv-arrow:active { transform: scale(.97); }
                .reviews-page .rv-counter { grid-column: 2; grid-row: 2; margin: 20px 0 0; text-align: center; font-family: var(--font-heading); font-size: .82rem; letter-spacing: .08em; color: var(--color-text-grey); display: flex; justify-content: center; gap: 6px; }
                .reviews-page .rv-counter-now { color: var(--color-text-charcoal); font-weight: 600; }

                /* The quote itself */
                .reviews-page .rq { margin: 0; padding: 8px 0; text-align: center; max-width: 720px; margin-inline: auto; }
                .reviews-page .rq-stars { display: flex; justify-content: center; gap: 4px; margin-bottom: 22px; }
                .reviews-page .rq-text { margin: 0; font-family: var(--font-heading); font-weight: 500; font-size: clamp(1.2rem, 1.02rem + .8vw, 1.65rem); line-height: 1.45; letter-spacing: -.01em; color: var(--color-text-charcoal); text-wrap: pretty; }
                .reviews-page .rq-text p { margin: 0 0 14px; }
                .reviews-page .rq-text p:last-child { margin-bottom: 0; }
                .reviews-page .rq-text strong { font-weight: 700; color: var(--color-primary-deep); }
                .reviews-page .rq-author { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 28px; }
                .reviews-page .rq-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex: none; }
                .reviews-page .rq-author-text { display: flex; flex-direction: column; text-align: left; }
                .reviews-page .rq-author-text strong { color: var(--color-text-charcoal); font-family: var(--font-heading); font-size: .96rem; }
                .reviews-page .rq-type { display: inline-flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--color-text-grey); font-size: .78rem; }

                .reviews-page .reviews-closing { padding: var(--space-section-lg) 0 80px; text-align: center; }
                .reviews-page .reviews-closing .statement { max-width: 680px; margin: 0 auto 30px; }
                .reviews-page .reviews-closing a { display: inline-block; }

                @media (max-width: 760px) {
                    .reviews-page .reviews-hero-gradient { padding: 118px 0 40px; }
                    .reviews-page .reviews-trust-rule { width: 24px; }
                    .reviews-page .rv-tabs-wrap { margin: 0 -16px; padding: 4px 16px; }
                    .reviews-page .rv-tabs { margin: 0; }
                    /* Phones: quote on top, then one row of prev / counter / next in thumb reach. */
                    .reviews-page .rv-stage { grid-template-columns: 48px 1fr 48px; grid-template-rows: auto auto; column-gap: 16px; margin-top: 28px; }
                    .reviews-page .rv-viewport { grid-column: 1 / -1; grid-row: 1; min-height: 0; }
                    .reviews-page .rv-arrow-prev { grid-column: 1; grid-row: 2; }
                    .reviews-page .rv-arrow-next { grid-column: 3; grid-row: 2; }
                    .reviews-page .rv-counter { grid-column: 2; grid-row: 2; margin: 0; align-self: center; }
                    .reviews-page .rv-stage > .rv-arrow { margin-top: 24px; }
                    .reviews-page .rv-counter { margin-top: 24px; }
                    .reviews-page .rq-text { font-size: 1.15rem; line-height: 1.5; }
                }
            `}</Style>
        </div>
    );
};

export default Reviews;
