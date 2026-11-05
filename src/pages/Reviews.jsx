import { Helmet } from 'react-helmet-async';
import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Button from '../components/Button';
import { Reveal } from '../components/Reveal';
import Style from '../components/Style';
import reviewStats from '../data/review-stats.json';
import googleReviews from '../data/google-reviews.json';
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
        rank: {"all": 1, "family": 3, "nervous": 1, "longtime": 1},
        highlights: {"family": ["My family’s dental health"], "nervous": ["fear of being in the dentist chair has been completely removed", "gentle care"], "longtime": ["over a decade"]},
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
        rank: {"all": 1, "family": 2, "longtime": 1},
        highlights: {"family": ["referred multiple family members"], "longtime": ["over a decade"]},
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
        rank: {"all": 1, "nervous": 2},
        highlights: {"nervous": ["listen to concerns", "gentle and thorough care"]},
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
        rank: {"all": 3},
        tags: [],
        rating: 5,
        avatar: "/images/reviews/ashley_chin.png"
    },
    {
        text: "Dr Jean is thorough, professional, gentle yet strong. Have been seeing for over 20 years and will continue to do so.",
        author: "Karen Lam",
        rank: {"all": 2, "nervous": 1, "longtime": 1},
        highlights: {"nervous": ["gentle yet strong"], "longtime": ["over 20 years"]},
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
        rank: {"all": 1, "family": 1},
        highlights: {"family": ["my family", "2 young kids"]},
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
        rank: {"all": 2, "family": 1},
        highlights: {"family": ["Family visit"]},
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
        rank: {"all": 2, "family": 1},
        highlights: {"family": ["myself and my family"]},
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
        rank: {"all": 2, "family": 1, "longtime": 2, "treatment": 1},
        highlights: {"family": ["me and my kids"], "longtime": ["for many years"], "treatment": ["periodontal disease"]},
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
        rank: {"all": 1, "family": 2, "nervous": 1, "longtime": 1},
        highlights: {"family": ["family dentist"], "nervous": ["most amazing and gentle dentist"], "longtime": ["more than 10 years"]},
        tags: ["family", "nervous", "longtime"],
        rating: 5,
        avatar: "/images/reviews/christina_phang.jpg",
        type: "Verified Google Review"
    },
    {
        text: "Appreciate reminder of appointments, nice and clean and bright reception area and of course excellent dental services.",
        author: "Wee Min Lee",
        rank: {"all": 3},
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
        rank: {"all": 2, "family": 2, "treatment": 2},
        highlights: {"family": ["My family"], "treatment": ["multiple dental treatments"]},
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
        rank: {"all": 2, "family": 1, "longtime": 1},
        highlights: {"family": ["Our family"], "longtime": ["many years"]},
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
        rank: {"all": 3, "family": 1},
        highlights: {"family": ["good with children"]},
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
        rank: {"all": 1, "family": 3, "nervous": 2, "treatment": 1},
        highlights: {"family": ["family-friendly environment"], "nervous": ["warm and caring", "smooth and pain-free"], "treatment": ["scaling", "teeth whitening", "brighter smile"]},
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
        rank: {"all": 1, "longtime": 1, "treatment": 3},
        highlights: {"longtime": ["nearly 20 years"], "treatment": ["helped my wife with her denture"]},
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

// Rank per tag lives on each review (`rank`): 1 = clearly about the topic
// with the phrase inside the visible six lines, 2 = clear but the phrase
// sits later or is less central, 3 = weak or the phrase is clipped. The
// front of the rail is FRONT_SIZE cards picked by rotating through the
// rank 1 and 2 pool, so the first cards change from day to day; rank 3
// never rotates to the front.
const FRONT_SIZE = 4;
const FRONT_POOL_MAX_RANK = 2;
const rankOf = (r, tag) => r.rank?.[tag] ?? 3;

// One seed per calendar day (Malaysia time), fixed for the whole visit.
const daySeed = () => {
    const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
    return Math.floor(d.getTime() / 86400000);
};

const orderForTag = (reviews, tag, seed) => {
    const byRank = [...reviews].sort((a, b) => rankOf(a, tag) - rankOf(b, tag));
    // Rotate among rank 1 alone when there are enough of them; otherwise
    // widen the pool to rank 2 so the front still fills.
    const top = byRank.filter((r) => rankOf(r, tag) === 1);
    const pool = top.length >= FRONT_SIZE ? top : byRank.filter((r) => rankOf(r, tag) <= FRONT_POOL_MAX_RANK);
    const tail = byRank.filter((r) => !pool.includes(r));
    if (!pool.length) return byRank;
    const offset = seed % pool.length;
    const rotated = pool.slice(offset).concat(pool.slice(0, offset));
    const front = rotated.slice(0, FRONT_SIZE);
    const rest = pool.filter((r) => !front.includes(r));
    return [...front, ...rest, ...tail];
};

// Flatten a review's JSX (fragments, <p>, <strong>, strings) into its plain
// paragraphs. The words are the review's own, untouched; only the emphasis
// changes per tab.
const toParagraphs = (node) => {
    if (typeof node === 'string') return [node];
    const out = [];
    let current = '';
    const walkInline = (n) => {
        if (n == null || typeof n === 'boolean') return;
        if (typeof n === 'string' || typeof n === 'number') { current += String(n); return; }
        if (Array.isArray(n)) { n.forEach(walkInline); return; }
        walkInline(n.props?.children);
    };
    const walk = (n) => {
        if (n == null || typeof n === 'boolean') return;
        if (Array.isArray(n)) { n.forEach(walk); return; }
        if (typeof n === 'string' || typeof n === 'number') { current += String(n); return; }
        if (n.type === 'p') {
            if (current.trim()) out.push(current);
            current = '';
            walkInline(n.props.children);
            out.push(current);
            current = '';
            return;
        }
        walk(n.props?.children);
    };
    walk(node);
    if (current.trim()) out.push(current);
    return out;
};

// Wrap every occurrence of the tab's phrases in <strong>; longest phrase first
// so a short phrase never splits a longer one.
const highlightText = (text, phrases) => {
    if (!phrases.length) return text;
    const sorted = [...phrases].sort((a, b) => b.length - a.length);
    const parts = [];
    let rest = text;
    let k = 0;
    while (rest.length) {
        let best = null;
        for (const ph of sorted) {
            const i = rest.indexOf(ph);
            if (i !== -1 && (best === null || i < best.i)) best = { i, ph };
        }
        if (!best) { parts.push(rest); break; }
        if (best.i > 0) parts.push(rest.slice(0, best.i));
        parts.push(<strong key={k++}>{best.ph}</strong>);
        rest = rest.slice(best.i + best.ph.length);
    }
    return parts;
};

// On "All" the review's own general emphasis shows; on a category tab only
// the phrases about that category are bold.
const ReviewText = ({ review, tag }) => {
    if (tag === 'all') return review.text;
    const phrases = review.highlights?.[tag] || [];
    const paragraphs = toParagraphs(review.text);
    return paragraphs.map((p, i) => <p key={i}>{highlightText(p, phrases)}</p>);
};

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
const ReviewModal = ({ review, tag, onClose }) => {
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
                        <blockquote className="rvm-text"><ReviewText review={review} tag={tag} /></blockquote>
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
const ReviewCard = ({ review, tag, onOpen }) => {
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
    }, [tag]);
    return (
        <article className="rv-card" onClick={() => onOpen(review)} style={{ cursor: 'pointer' }}>
            <Stars n={review.rating} />
            <blockquote ref={textRef} className="rv-card-text"><ReviewText review={review} tag={tag} /></blockquote>
            <div className="rv-card-more">
                {clipped && (
                    <button type="button" className="rv-more" onClick={(e) => { e.stopPropagation(); onOpen(review); }} aria-label={`Read the full review by ${review.author}`}>
                        Read more
                    </button>
                )}
            </div>
            <Author review={review} />
        </article>
    );
};

// "All" tab: a slow, endless strip of every 5-star Google review that has
// words (src/data/google-reviews.json, pulled from the Business Profile API,
// text verbatim). Two rows drift in opposite directions. Motion is a CSS
// transform loop over a doubled track (seamless at -50%); it pauses on
// hover, focus, touch, the visible pause button, and whenever the strip is
// off-screen. Reduced motion gets a plain swipeable row, no loop.
const MQ_REVIEWS = googleReviews.reviews.map((r) => ({ ...r, rating: 5 }));
const MQ_ROWS = [
    MQ_REVIEWS.filter((_, i) => i % 2 === 0),
    MQ_REVIEWS.filter((_, i) => i % 2 === 1),
];
const MQ_PX_PER_SEC = 32;
const MQ_CARD_STEP = 292; // card width + gap, used only to pace the loop

const MarqueeCard = ({ review, onOpen, hidden }) => {
    const body = (
        <>
            <Stars n={5} size={13} />
            <p className="mq-text">{review.text}</p>
            <span className="mq-author">
                {review.avatar ? (
                    <img src={review.avatar} alt="" loading="lazy" width={28} height={28} className="rv-avatar" style={{ width: 28, height: 28 }} />
                ) : (
                    <InitialsAvatar name={review.author} size={28} />
                )}
                <span className="mq-name">{review.author}</span>
                <GoogleG />
            </span>
        </>
    );
    return (
        <button type="button" className="mq-card is-long" onClick={() => onOpen(review)} tabIndex={hidden ? -1 : 0} aria-label={`Read the full review by ${review.author}`}>
            {body}
        </button>
    );
};

const ReviewMarquee = ({ onOpen }) => {
    const prefersReducedMotion = useReducedMotion();
    const wrapRef = useRef(null);
    const [inView, setInView] = useState(false);
    const [touchHold, setTouchHold] = useState(false);
    const touchTimer = useRef(0);
    useEffect(() => {
        const el = wrapRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    useEffect(() => () => clearTimeout(touchTimer.current), []);
    const onTouchStart = () => { clearTimeout(touchTimer.current); setTouchHold(true); };
    const onTouchEnd = () => { clearTimeout(touchTimer.current); touchTimer.current = setTimeout(() => setTouchHold(false), 2500); };
    const running = !prefersReducedMotion && inView && !touchHold;
    return (
        <div className="mq-wrap">
            <div
                ref={wrapRef}
                className={`mq${prefersReducedMotion ? ' is-static' : ''}${running ? '' : ' is-paused'}`}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
                aria-label={`${MQ_REVIEWS.length} five-star Google reviews`}
                role="region"
            >
                {MQ_ROWS.map((row, ri) => (
                    <div className="mq-row" key={ri}>
                        <div
                            className={`mq-track${ri % 2 ? ' is-reverse' : ''}`}
                            style={{ '--mq-dur': `${Math.round((row.length * MQ_CARD_STEP) / MQ_PX_PER_SEC)}s` }}
                        >
                            {row.map((r, i) => <MarqueeCard key={`a${i}`} review={r} onOpen={onOpen} />)}
                            {!prefersReducedMotion && (
                                <div className="mq-dup" aria-hidden="true" inert="">
                                    {row.map((r, i) => <MarqueeCard key={`b${i}`} review={r} onOpen={onOpen} hidden />)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Topic tabs: the curated cards drift slowly in one endless row (owner,
// 5 Nov), driven like the homepage dentist strip: one rAF clock moves an
// offset, the hand can drag it, and a small scrubber underneath shows where
// the loop is and can be dragged (or arrow-keyed) to move faster, slower or
// back. Hover, keyboard focus, touch and holding the scrubber all stop it.
// Off-screen it spends no frames. Reduced motion: a plain swipeable row.
const CS_PX_PER_SEC = 16;

const CuratedStrip = ({ reviews, tag, onOpen }) => {
    const prefersReducedMotion = useReducedMotion();
    const rootRef = useRef(null);
    const trackRef = useRef(null);
    const scrubRef = useRef(null);
    // Enough copies that half the track is wider than any screen, so the loop never shows a gap.
    const copies = Math.max(1, Math.ceil(8 / reviews.length));
    useEffect(() => {
        if (prefersReducedMotion) return;
        const root = rootRef.current, row = trackRef.current, track = scrubRef.current;
        if (!root || !row || !track) return;
        const thumb = track.querySelector('.mosaic-scrub-thumb');
        let x = 0, raf = null, last = null, lastPct = -1;
        let hover = false, focus = false, dragging = false, visible = true, touchUntil = 0;
        const paint = (now) => {
            raf = requestAnimationFrame(paint);
            if (last === null) last = now;
            const dt = Math.min(64, now - last) / 1000;
            last = now;
            if (!hover && !focus && !dragging && visible && now > touchUntil) x += CS_PX_PER_SEC * dt;
            const w = row.scrollWidth / 2;
            if (!w) return;
            const m = ((x % w) + w) % w;
            row.style.transform = `translate3d(${(-m).toFixed(2)}px,0,0)`;
            const tw = track.clientWidth - thumb.clientWidth;
            if (tw > 0) thumb.style.transform = `translate3d(${((m / w) * tw).toFixed(2)}px,0,0)`;
            const p = Math.round((m / w) * 100);
            if (p !== lastPct) { lastPct = p; track.setAttribute('aria-valuenow', String(p)); }
        };
        const io = typeof IntersectionObserver !== 'undefined'
            ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }) : null;
        if (io) io.observe(root);

        let startX = 0, startVal = 0, moved = 0, pid = null;
        const onDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            dragging = true; moved = 0; startX = e.clientX; startVal = x; pid = e.pointerId;
        };
        const onMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            if (moved <= 6 && Math.abs(dx) > 6 && root.setPointerCapture && pid !== null) {
                try { root.setPointerCapture(pid); } catch { /* no-op */ }
            }
            moved = Math.max(moved, Math.abs(dx));
            x = startVal - dx;
        };
        const onUp = (e) => {
            dragging = false;
            if (e && e.pointerType === 'touch') touchUntil = performance.now() + 2500;
        };
        const onClick = (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
        const onFocusIn = () => { focus = true; root.scrollLeft = 0; };
        const onFocusOut = (e) => { if (!root.contains(e.relatedTarget)) focus = false; };
        const onEnter = (e) => { if (e.pointerType === 'mouse') hover = true; };
        const onLeave = (e) => { hover = false; if (e.pointerType === 'mouse') dragging = false; };
        root.addEventListener('pointerdown', onDown);
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerup', onUp);
        root.addEventListener('pointercancel', onUp);
        root.addEventListener('click', onClick, true);
        root.addEventListener('focusin', onFocusIn);
        root.addEventListener('focusout', onFocusOut);
        root.addEventListener('pointerenter', onEnter);
        root.addEventListener('pointerleave', onLeave);

        // Scrubber: press/drag to move through the loop; arrow keys step a
        // card; while it has focus the strip stays still.
        const scrubTo = (clientX) => {
            const rect = track.getBoundingClientRect();
            const tw = track.clientWidth - thumb.clientWidth;
            const w = row.scrollWidth / 2;
            if (tw <= 0 || !w) return;
            x = Math.min(1, Math.max(0, (clientX - rect.left - thumb.clientWidth / 2) / tw)) * w;
        };
        const sDown = (e) => {
            dragging = true; e.preventDefault(); scrubTo(e.clientX);
            const mv = (ev) => scrubTo(ev.clientX);
            const upf = (ev) => {
                dragging = false; window.removeEventListener('pointermove', mv);
                if (ev.pointerType === 'touch') touchUntil = performance.now() + 2500;
            };
            window.addEventListener('pointermove', mv);
            window.addEventListener('pointerup', upf, { once: true });
        };
        const sKey = (e) => {
            const card = row.querySelector('.rv-card');
            const step = card ? card.offsetWidth + 16 : 300;
            const w = row.scrollWidth / 2;
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') x += step;
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') x -= step;
            else if (e.key === 'Home') x = 0;
            else if (e.key === 'End') x = w - step;
            else return;
            e.preventDefault();
        };
        const sFocus = () => { focus = true; };
        const sBlur = () => { focus = false; };
        track.addEventListener('pointerdown', sDown);
        track.addEventListener('keydown', sKey);
        track.addEventListener('focus', sFocus);
        track.addEventListener('blur', sBlur);
        track.addEventListener('pointerenter', onEnter);
        track.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hover = false; });

        raf = requestAnimationFrame(paint);
        return () => { if (raf !== null) cancelAnimationFrame(raf); if (io) io.disconnect(); };
    }, [prefersReducedMotion]);
    return (
        <div className="cs-wrap">
            <div ref={rootRef} className={`rv-rail cs${prefersReducedMotion ? ' is-static' : ''}`} data-tag={tag}>
                <div ref={trackRef} className="cs-track">
                    {Array.from({ length: prefersReducedMotion ? 1 : copies * 2 }, (_, c) => (
                        c === 0
                            ? reviews.map((review) => <ReviewCard key={review.author} review={review} tag={tag} onOpen={onOpen} />)
                            : (
                                <div key={c} className="cs-ghost" aria-hidden="true" inert="">
                                    {reviews.map((review) => <ReviewCard key={review.author} review={review} tag={tag} onOpen={onOpen} />)}
                                </div>
                            )
                    ))}
                </div>
            </div>
            {!prefersReducedMotion && (
                <div
                    ref={scrubRef}
                    className="mosaic-scrub"
                    role="slider"
                    tabIndex={0}
                    aria-label="Move through the reviews. Holding or focusing this stops the motion."
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={0}
                    aria-valuetext="Position in the reviews"
                >
                    <span className="mosaic-scrub-thumb" />
                </div>
            )}
        </div>
    );
};

const Reviews = () => {
    // Meta comes from src/data/corePagesSeo.js, the same source the build
    // uses to prerender this page — so the two cannot drift.
    const seo = CORE_PAGES.find(p => p.path === 'reviews');
    const uid = useId();

    const [groupId, setGroupId] = useState(GROUPS[0].id);
    const [openReview, setOpenReview] = useState(null);
    const closeReview = useCallback(() => setOpenReview(null), []);

    const [seed] = useState(daySeed);
    const group = useMemo(() => {
        const g = GROUPS.find((x) => x.id === groupId) || GROUPS[0];
        return { ...g, reviews: orderForTag(g.reviews, g.id, seed) };
    }, [groupId, seed]);
    const pickGroup = (id) => {
        if (id === groupId) return;
        setGroupId(id);
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
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rv-panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${groupId}`}>
                    {groupId === 'all' ? (
                        <ReviewMarquee onOpen={setOpenReview} />
                    ) : (
                        <CuratedStrip key={groupId} reviews={group.reviews} tag={groupId} onOpen={setOpenReview} />
                    )}
                </div>

                <div className="reviews-closing">
                    <Reveal width="100%"><h2 className="statement">Have a <em>story</em> to share?</h2></Reveal>
                    <a href="https://g.page/r/CQU1Takv7hs4EAE/review" target="_blank" rel="noopener noreferrer"><Button>Share Your Experience</Button></a>
                </div>
            </div>

            <ReviewModal review={openReview} tag={groupId} onClose={closeReview} />

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
                .reviews-page .rv-rail[data-tag]:not([data-tag="all"]) .rv-card-text strong { color: var(--color-primary-deep); font-weight: 700; }
                /* One light sweep across the accent phrases when the rail mounts
                   (first view and every tab change), ~700ms, then solid colour.
                   The rail is keyed by tab so the mount animation runs once per
                   selection and never loops. */
                .reviews-page .rv-rail .rv-card-text strong {
                    --rv-accent: var(--color-text-charcoal); --rv-glint: #6B7C86;
                    background-image: linear-gradient(100deg, var(--rv-accent) 0 35%, var(--rv-glint) 50%, var(--rv-accent) 65% 100%);
                    background-size: 300% 100%; background-position: 100% 0;
                    -webkit-background-clip: text; background-clip: text; color: transparent;
                    animation: rv-shimmer 700ms var(--ease-slow) 1 both;
                }
                .reviews-page .rv-rail[data-tag]:not([data-tag="all"]) .rv-card-text strong { --rv-accent: var(--color-primary-deep); --rv-glint: #5FC2DE; }
                @keyframes rv-shimmer { from { background-position: 0% 0; } to { background-position: 100% 0; } }
                @media (prefers-reduced-motion: reduce) {
                    .reviews-page .rv-rail .rv-card-text strong { animation: none; background-image: none; -webkit-background-clip: initial; background-clip: initial; color: var(--rv-accent); }
                }
                .reviews-page .rv-card-more { flex: 1; display: flex; align-items: flex-start; min-height: 44px; margin-top: 4px; }
                .reviews-page .rv-more { min-height: 44px; padding: 0 2px; background: none; border: none; cursor: pointer; font-family: var(--font-heading); font-weight: 600; font-size: .9rem; color: var(--color-primary-deep); transition: color 180ms var(--ease-slow); }
                .reviews-page .rv-more:hover { color: var(--color-primary-teal); }
                .reviews-page .rv-more:active { transform: scale(.97); }
                .reviews-page .rv-author { display: flex; align-items: center; gap: 12px; margin-top: auto; }
                .reviews-page .rv-avatar { border-radius: 50%; object-fit: cover; flex: none; }
                .reviews-page .rv-author-text { display: flex; flex-direction: column; min-width: 0; }
                .reviews-page .rv-author-text strong { color: var(--color-text-charcoal); font-family: var(--font-heading); font-size: .94rem; }
                .reviews-page .rv-type { display: inline-flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--color-text-grey); font-size: .78rem; }

                .reviews-page .rv-summary { justify-content: flex-end; }
                /* "All": the marquee strip. Compact hairline cards, transform-only loop. */
                .reviews-page .mq-card:focus-visible { outline: 2px solid var(--color-primary-teal); outline-offset: 2px; }
                .reviews-page .mq { margin: 0 -20px; display: flex; flex-direction: column; gap: 14px; overflow: hidden;
                    -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
                .reviews-page .mq-row { overflow: hidden; padding: 3px 0; }
                .reviews-page .mq-track, .reviews-page .mq-dup { display: flex; gap: 14px; width: max-content; }
                /* trailing gap on the track so -50% lands exactly on the copy's first card */
                .reviews-page .mq-track { padding-right: 14px; }
                .reviews-page .mq-track { animation: mq-left var(--mq-dur, 300s) linear infinite; will-change: transform; }
                .reviews-page .mq-track.is-reverse { animation-name: mq-right; }
                .reviews-page .mq.is-paused .mq-track,
                .reviews-page .mq:hover .mq-track,
                .reviews-page .mq:focus-within .mq-track { animation-play-state: paused; }
                @keyframes mq-left { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
                @keyframes mq-right { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }
                .reviews-page .mq.is-static { -webkit-mask-image: none; mask-image: none; }
                .reviews-page .mq.is-static .mq-row { overflow-x: auto; scrollbar-width: none; padding: 3px 20px; }
                .reviews-page .mq.is-static .mq-track { animation: none; }
                .reviews-page .mq-card {
                    flex: 0 0 278px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;
                    height: 168px; padding: 16px 18px; text-align: left; font: inherit;
                    background: var(--color-bg-white); border: 1px solid var(--hairline); border-radius: 18px; color: inherit;
                }
                .reviews-page .mq-card.is-long { cursor: pointer; transition: border-color 180ms var(--ease-slow); }
                .reviews-page .mq-card.is-long:hover { border-color: var(--color-primary-teal); }
                .reviews-page .mq-text { margin: 0; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;
                    color: var(--color-text-slate); font-size: .9rem; line-height: 1.5; }
                .reviews-page .mq-author { display: flex; align-items: center; gap: 9px; margin-top: auto; min-width: 0; }
                .reviews-page .mq-name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                    color: var(--color-text-charcoal); font-family: var(--font-heading); font-weight: 600; font-size: .86rem; }
                @media (max-width: 1024px) { .reviews-page .mq { margin: 0 -16px; } .reviews-page .mq.is-static .mq-row { padding: 3px 16px; } }
                @media (max-width: 760px) { .reviews-page .mq-card { flex-basis: 248px; height: 160px; padding: 14px 16px; } }
                /* Hover a card: the rest fade back, that one takes the accent. Colour/opacity only. */
                .reviews-page .mq-card, .reviews-page .cs .rv-card { transition: opacity 180ms var(--ease-slow), border-color 180ms var(--ease-slow); }
                .reviews-page .mq:hover .mq-card:not(:hover),
                .reviews-page .cs:hover .rv-card:not(:hover) { opacity: .4; }
                .reviews-page .mq-card:hover, .reviews-page .cs .rv-card:hover { border-color: var(--color-primary-teal); }
                .reviews-page .mq-card:hover .mq-name, .reviews-page .cs .rv-card:hover .rv-author-text strong { color: var(--color-primary-deep); }
                /* Topic strip */
                .reviews-page .cs-wrap { margin-top: 32px; }
                .reviews-page .rv-rail.cs { display: block; height: auto; padding: 3px 0; overflow: hidden; scroll-snap-type: none; touch-action: pan-y; cursor: grab;
                    -webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent); mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent); }
                .reviews-page .cs-ghost { display: contents; }
                .reviews-page .cs-track { display: flex; gap: var(--rv-gap); width: max-content; }
                .reviews-page .cs-track { padding-right: var(--rv-gap); will-change: transform; }
                .reviews-page .cs .rv-card { flex: 0 0 340px; }
                .reviews-page .rv-rail.cs.is-static { overflow-x: auto; cursor: auto; padding: 3px 20px; -webkit-mask-image: none; mask-image: none; }
                .reviews-page .cs-wrap .mosaic-scrub { position: relative; margin: 22px auto 0; width: 140px; height: 14px; cursor: pointer; touch-action: none; border-radius: 99px; }
                .reviews-page .cs-wrap .mosaic-scrub::before { content: ''; position: absolute; left: 0; right: 0; top: 6px; height: 3px; border-radius: 99px; background: rgba(16,42,51,0.10); }
                .reviews-page .cs-wrap .mosaic-scrub::after { content: ''; position: absolute; inset: -15px 0; } /* 44px tap target */
                .reviews-page .cs-wrap .mosaic-scrub-thumb { position: absolute; top: 5px; left: 0; width: 34px; height: 5px; border-radius: 99px; background: rgba(0,110,140,0.45); transition: background .25s ease; }
                .reviews-page .cs-wrap .mosaic-scrub:hover .mosaic-scrub-thumb, .reviews-page .cs-wrap .mosaic-scrub:focus-visible .mosaic-scrub-thumb { background: var(--color-primary-deep); }
                .reviews-page .cs-wrap .mosaic-scrub:focus-visible { outline: 2px solid var(--color-primary-teal); outline-offset: 6px; }
                @media (max-width: 1024px) { .reviews-page .rv-rail.cs { margin: 0 -16px; } .reviews-page .rv-rail.cs.is-static { padding: 3px 16px; } }
                @media (max-width: 760px) { .reviews-page .cs-wrap { margin-top: 24px; } .reviews-page .cs .rv-card { flex-basis: 290px; padding: 22px 20px; border-radius: 18px; } }
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
