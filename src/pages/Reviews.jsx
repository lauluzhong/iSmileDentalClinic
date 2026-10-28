import { Helmet } from 'react-helmet-async';
import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Button from '../components/Button';
import { Reveal } from '../components/Reveal';
import Style from '../components/Style';
import reviewStats from '../data/review-stats.json';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import { useBooking } from '../context/BookingContext';

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

const Stars = ({ n, size = 16 }) => (
    <div className="rv-stars" aria-label={`${n} out of 5 stars`}>
        {[...Array(n)].map((_, i) => <Star key={i} size={size} fill="#E0A500" color="#E0A500" aria-hidden="true" />)}
    </div>
);

const Author = ({ review, size = 40 }) => (
    <div className="rv-author">
        {review.avatar ? (
            <img src={review.avatar} alt="" loading="lazy" width={size} height={size} className="rv-avatar" style={{ width: size, height: size }} />
        ) : (
            <InitialsAvatar name={review.author} size={size} />
        )}
        <div className="rv-author-text">
            <strong>{review.author}</strong>
            <span className="rv-type"><GoogleG /> Verified Google review</span>
        </div>
    </div>
);

// Full review in the site's modal pattern (BookingModal): fixed overlay,
// centred card, spring with no bounce, Escape / X / backdrop close, body
// pinned behind. Rendered through a portal so no ancestor filter traps it.
const ReviewModal = ({ review, onClose }) => {
    const prefersReducedMotion = useReducedMotion();
    const closeRef = useRef(null);
    const open = !!review;
    const { setDialogOpen } = useBooking();

    // Tell the CTA prompt a dialog is up so it never stacks on top of this one.
    useEffect(() => {
        setDialogOpen(open);
        return () => setDialogOpen(false);
    }, [open, setDialogOpen]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKeyDown);
        const body = document.body;
        const root = document.documentElement;
        const scrollY = window.scrollY;
        const prev = { rootOverflow: root.style.overflow, bodyOverflow: body.style.overflow, position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, width: body.style.width };
        root.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        closeRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            root.style.overflow = prev.rootOverflow;
            body.style.overflow = prev.bodyOverflow;
            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.left = prev.left;
            body.style.right = prev.right;
            body.style.width = prev.width;
            root.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollY);
            root.style.scrollBehavior = '';
        };
    }, [open, onClose]);

    if (typeof document === 'undefined') return null;

    const cardMotion = prefersReducedMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
        : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 }, transition: { type: 'spring', bounce: 0, duration: 0.35 } };

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="rvm-overlay"
                    data-lenis-prevent
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="rvm-content"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Review by ${review.author}`}
                        onClick={(e) => e.stopPropagation()}
                        {...cardMotion}
                    >
                        <button ref={closeRef} type="button" className="rvm-close" onClick={onClose} aria-label="Close review">
                            <X size={22} aria-hidden="true" />
                        </button>
                        <Stars n={review.rating} size={18} />
                        <blockquote className="rvm-text">{review.text}</blockquote>
                        <Author review={review} size={44} />
                    </motion.div>
                    <Style>{`
                        .rvm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 16px; overscroll-behavior: contain; }
                        .rvm-content { position: relative; width: 100%; max-width: 560px; max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px); overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; background: #fff; padding: 28px 32px 28px; border: 1px solid var(--hairline); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,.15); }
                        .rvm-close { position: absolute; top: 10px; right: 10px; width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; background: none; border: none; border-radius: 50%; color: var(--color-text-grey); cursor: pointer; transition: color 180ms var(--ease-slow), background 180ms var(--ease-slow); }
                        .rvm-close:hover { color: var(--color-primary-deep); background: rgba(0,0,0,.05); }
                        .rvm-close:active { transform: scale(.97); }
                        .rvm-close:focus-visible { outline: 2px solid var(--color-primary-teal); outline-offset: 2px; }
                        .rvm-content .rv-stars { display: flex; gap: 4px; margin: 4px 0 18px; }
                        .rvm-text { margin: 0 0 22px; font-size: 1.05rem; line-height: 1.6; color: var(--color-text-charcoal); }
                        .rvm-text p { margin: 0 0 12px; }
                        .rvm-text p:last-child { margin-bottom: 0; }
                        .rvm-text strong { font-weight: 600; color: var(--color-primary-deep); }
                        .rvm-content .rv-author { display: flex; align-items: center; gap: 12px; }
                        .rvm-content .rv-avatar { border-radius: 50%; object-fit: cover; flex: none; }
                        .rvm-content .rv-author-text { display: flex; flex-direction: column; }
                        .rvm-content .rv-author-text strong { color: var(--color-text-charcoal); font-family: var(--font-heading); font-size: .96rem; }
                        .rvm-content .rv-type { display: inline-flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--color-text-grey); font-size: .78rem; }
                        @media (max-width: 640px) { .rvm-overlay { padding: 12px; } .rvm-content { padding: 22px 18px 22px; border-radius: 22px; } }
                    `}</Style>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

// One equal-height card. The quote clamps to CLAMP_LINES; "Read more" appears
// only when the text really overflows (measured, not guessed).
const ReviewCard = ({ review, onOpen }) => {
    const textRef = useRef(null);
    const [clipped, setClipped] = useState(false);
    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;
        const check = () => setClipped(el.scrollHeight > el.clientHeight + 1);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return (
        <article className="rv-card">
            <Stars n={review.rating} />
            <blockquote ref={textRef} className="rv-card-text">{review.text}</blockquote>
            <div className="rv-card-more">
                {clipped && (
                    <button type="button" className="rv-more" onClick={() => onOpen(review)} aria-label={`Read the full review by ${review.author}`}>
                        Read more
                    </button>
                )}
            </div>
            <Author review={review} />
        </article>
    );
};

const Reviews = () => {
    // Meta comes from src/data/corePagesSeo.js, the same source the build
    // uses to prerender this page — so the two cannot drift.
    const seo = CORE_PAGES.find(p => p.path === 'reviews');
    const uid = useId();
    const prefersReducedMotion = useReducedMotion();

    const [groupId, setGroupId] = useState(GROUPS[0].id);
    const [openReview, setOpenReview] = useState(null);
    const closeReview = useCallback(() => setOpenReview(null), []);

    const group = useMemo(() => GROUPS.find((g) => g.id === groupId) || GROUPS[0], [groupId]);
    const total = group.reviews.length;

    // Rail position -> "first–last of total", read from the real scroll offset.
    const railRef = useRef(null);
    const [range, setRange] = useState({ first: 1, last: 1 });
    const measure = useCallback(() => {
        const rail = railRef.current;
        if (!rail) return;
        const cards = rail.querySelectorAll('.rv-card');
        if (!cards.length) return;
        const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
        const first = Math.min(cards.length - 1, Math.max(0, Math.round(rail.scrollLeft / step)));
        const perView = Math.max(1, Math.floor((rail.clientWidth + (step - cards[0].offsetWidth)) / step));
        const last = Math.min(cards.length, first + perView);
        setRange((r) => (r.first === first + 1 && r.last === last) ? r : { first: first + 1, last });
    }, []);

    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;
        let raf = 0;
        const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
        rail.addEventListener('scroll', onScroll, { passive: true });
        const ro = new ResizeObserver(measure);
        ro.observe(rail);
        measure();
        return () => { rail.removeEventListener('scroll', onScroll); ro.disconnect(); cancelAnimationFrame(raf); };
    }, [measure, groupId]);

    const pickGroup = (id) => {
        if (id === groupId) return;
        setGroupId(id);
        const rail = railRef.current;
        if (rail) rail.scrollTo({ left: 0, behavior: 'auto' });
    };

    const scrollByCards = (dirStep) => {
        const rail = railRef.current;
        if (!rail) return;
        const cards = rail.querySelectorAll('.rv-card');
        const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth;
        const perView = Math.max(1, Math.round(rail.clientWidth / step));
        rail.scrollBy({ left: dirStep * step * perView, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };

    // Left/right arrow keys move between tabs when the tablist has focus.
    const tabRefs = useRef([]);
    const onTabKey = (e, i) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + GROUPS.length) % GROUPS.length;
        pickGroup(GROUPS[next].id);
        tabRefs.current[next]?.focus();
    };

    const atStart = range.first <= 1;
    const atEnd = range.last >= total;

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

                <div className="rv-panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${groupId}`}>
                    <div className="rv-summary">
                        <p className="rv-summary-rating">
                            <Stars n={5} size={14} />
                            <span><strong>{reviewStats.rating}</strong> on Google · {reviewStats.count} reviews</span>
                        </p>
                        <div className="rv-summary-nav">
                            <p className="rv-range" aria-live="polite">
                                <span className="rv-range-now">{range.first}{range.last > range.first ? `–${range.last}` : ''}</span> of {total}
                            </p>
                            <button type="button" className="rv-arrow" onClick={() => scrollByCards(-1)} aria-label="Previous reviews" disabled={atStart}>
                                <ChevronLeft size={22} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                            <button type="button" className="rv-arrow" onClick={() => scrollByCards(1)} aria-label="Next reviews" disabled={atEnd}>
                                <ChevronRight size={22} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="rv-rail-wrap">
                        <div ref={railRef} className="rv-rail" key={groupId}>
                            {group.reviews.map((review) => (
                                <ReviewCard key={review.author} review={review} onOpen={setOpenReview} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="reviews-closing">
                    <Reveal width="100%"><h2 className="statement">Have a <em>story</em> to share?</h2></Reveal>
                    <a href="https://g.page/r/CQU1Takv7hs4EAE/review" target="_blank" rel="noopener noreferrer"><Button>Share Your Experience</Button></a>
                </div>
            </div>

            <ReviewModal review={openReview} onClose={closeReview} />

            <Style>{`
                /* no opaque page background — the shared hero tint (index.css) shows through */
                .reviews-page { --rv-card-h: 352px; --rv-gap: 16px; }
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
                .reviews-page .rv-tab:focus-visible, .reviews-page .rv-arrow:focus-visible, .reviews-page .rv-more:focus-visible { outline: 2px solid var(--color-primary-teal); outline-offset: 2px; }

                /* Summary line: rating left, range + arrows right. Fixed height so it never shifts. */
                .reviews-page .rv-summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 48px; margin: 32px 0 16px; }
                .reviews-page .rv-summary-rating { display: flex; align-items: center; gap: 10px; margin: 0; color: var(--color-text-slate); font-size: .92rem; }
                .reviews-page .rv-summary-rating strong { color: var(--color-text-charcoal); }
                .reviews-page .rv-stars { display: flex; gap: 3px; }
                .reviews-page .rv-summary-nav { display: flex; align-items: center; gap: 8px; }
                .reviews-page .rv-range { margin: 0 8px 0 0; font-family: var(--font-heading); font-size: .82rem; letter-spacing: .04em; color: var(--color-text-grey); white-space: nowrap; }
                .reviews-page .rv-range-now { color: var(--color-text-charcoal); font-weight: 600; }
                .reviews-page .rv-arrow {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 48px; height: 48px; border-radius: 50%;
                    border: 1px solid var(--hairline-strong); background: var(--color-bg-white); color: var(--color-text-charcoal);
                    cursor: pointer;
                    transition: color 180ms var(--ease-slow), border-color 180ms var(--ease-slow), opacity 180ms var(--ease-slow), transform 100ms ease-out;
                }
                .reviews-page .rv-arrow:hover:not(:disabled) { color: var(--color-primary-deep); border-color: var(--color-primary-teal); }
                .reviews-page .rv-arrow:active:not(:disabled) { transform: scale(.97); }
                .reviews-page .rv-arrow:disabled { opacity: .35; cursor: default; }

                /* The rail: equal-height white cards, ~3 up with the next one peeking. */
                .reviews-page .rv-rail-wrap { margin: 0 -20px; }
                .reviews-page .rv-rail { display: flex; gap: var(--rv-gap); height: var(--rv-card-h); padding: 0 20px; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scroll-padding-left: 20px; scrollbar-width: none; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; }
                .reviews-page .rv-rail::-webkit-scrollbar { display: none; }
                .reviews-page .rv-card {
                    flex: 0 0 calc((100% - 2 * var(--rv-gap)) / 3.25); scroll-snap-align: start;
                    display: flex; flex-direction: column; height: var(--rv-card-h); box-sizing: border-box;
                    padding: 24px; background: var(--color-bg-white); border: 1px solid var(--hairline); border-radius: 22px;
                }
                .reviews-page .rv-card .rv-stars { margin-bottom: 14px; }
                .reviews-page .rv-card-text { margin: 0; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 6; overflow: hidden; color: var(--color-text-slate); font-size: .96rem; line-height: 1.6; }
                .reviews-page .rv-card-text p { margin: 0 0 10px; }
                .reviews-page .rv-card-text p:last-child { margin-bottom: 0; }
                .reviews-page .rv-card-text strong { color: var(--color-text-charcoal); font-weight: 600; }
                .reviews-page .rv-card-more { flex: 1; display: flex; align-items: flex-start; min-height: 44px; margin-top: 4px; }
                .reviews-page .rv-more { min-height: 44px; padding: 0 2px; background: none; border: none; cursor: pointer; font-family: var(--font-heading); font-weight: 600; font-size: .9rem; color: var(--color-primary-deep); transition: color 180ms var(--ease-slow); }
                .reviews-page .rv-more:hover { color: var(--color-primary-teal); }
                .reviews-page .rv-more:active { transform: scale(.97); }
                .reviews-page .rv-author { display: flex; align-items: center; gap: 12px; margin-top: auto; }
                .reviews-page .rv-avatar { border-radius: 50%; object-fit: cover; flex: none; }
                .reviews-page .rv-author-text { display: flex; flex-direction: column; min-width: 0; }
                .reviews-page .rv-author-text strong { color: var(--color-text-charcoal); font-family: var(--font-heading); font-size: .94rem; }
                .reviews-page .rv-type { display: inline-flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--color-text-grey); font-size: .78rem; }

                .reviews-page .reviews-closing { padding: var(--space-section-lg) 0 80px; text-align: center; }
                .reviews-page .reviews-closing .statement { max-width: 680px; margin: 0 auto 30px; }
                .reviews-page .reviews-closing a { display: inline-block; }

                @media (max-width: 1024px) {
                    .reviews-page .rv-rail-wrap, .reviews-page .rv-tabs-wrap { margin-left: -16px; margin-right: -16px; }
                    .reviews-page .rv-rail { padding: 0 16px; scroll-padding-left: 16px; }
                    .reviews-page .rv-tabs-wrap { padding: 4px 16px; }
                    .reviews-page .rv-card { flex-basis: calc((100% - var(--rv-gap)) / 2.15); }
                }
                @media (max-width: 760px) {
                    .reviews-page { --rv-card-h: 372px; }
                    .reviews-page .reviews-hero-gradient { padding: 118px 0 40px; }
                    .reviews-page .reviews-trust-rule { width: 24px; }
                    .reviews-page .rv-tabs { margin: 0; }
                    /* Phones: one card with the next peeking; swipe instead of arrows. */
                    .reviews-page .rv-summary { margin: 24px 0 14px; }
                    .reviews-page .rv-arrow { display: none; }
                    .reviews-page .rv-range { margin-right: 0; }
                    .reviews-page .rv-card { flex-basis: calc(100% - 36px); padding: 22px 20px; border-radius: 18px; }
                }
            `}</Style>
        </div>
    );
};

export default Reviews;
