import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import ResponsiveImage from '../components/ResponsiveImage';
import Style from '../components/Style';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';
import { isFirstPaint } from '../lib/firstPaint';
import { OPEN_JOBS, GENERAL_APPLICATION } from '../data/jobs';

// Careers hub (5 Nov 2026). One page for everyone who wants to work here:
//   top    = who we are (family first), "Working here" as four cards, each
//            with a line icon that draws itself once on reveal
//   bottom = two ways to join, side by side: Dentists (one call to action to
//            /careers/dentists) and Team roles (the open roles as cards, each
//            opening /careers/:slug), with the open door to /careers/general
// Two paths of EQUAL weight (Lau, 5 Nov round 4): same box, same tint, same
// outline button. No ember button on the hub, so the one-primary rule holds
// by having none; the primary lives on each path page.
//
// Hover ruling (Lau, 5 Nov 2026) for the Working here tiles only: a small lift
// and a soft ripple from the cursor point, 220ms, transform/opacity only,
// pointer devices only, off under reduced motion.

const FAMILY_POINTS = [
    {
        title: 'Family is who we are',
        body: 'iSmile started in 2006 as a family practice and still is one. Most of us are parents ourselves, and many of us are mothers. We know what it is to bring a child to the dentist, and we treat every patient the way we would want our own family treated.',
    },
    {
        title: 'The same families, year after year',
        body: 'We have cared for Petaling Jaya families for twenty years, often across three generations. Patients know us by name, and we know them. That only works when the team stays and grows together.',
    },
    {
        title: 'Calm, respectful, professional',
        body: 'Children, teenagers, adults and seniors all walk through the same door. The work is to make every one of them feel looked after, from the first hello to the last goodbye.',
    },
];

// Line icons: one path group each, drawn once on reveal (pathLength 0 to 1).
// 24-unit grid, stroke 1.75, no fills, so they sit with the lucide icons.
const ICONS = {
    heart: ['M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z'],
    family: ['M9 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'M17 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M3.5 20v-5a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v5', 'M14.5 13.5a3 3 0 0 1 6 0V20'],
    spark: ['M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4', 'M5.6 5.6l2.8 2.8', 'M15.6 15.6l2.8 2.8', 'M5.6 18.4l2.8-2.8', 'M15.6 8.4l2.8-2.8', 'M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'],
    home: ['M4 11.5L12 4l8 7.5', 'M6 10v10h12V10', 'M10 20v-5h4v5'],
};

const WORKING_HERE = [
    {
        icon: 'heart',
        title: 'Family values',
        body: 'We are family people, and we back each other. A hard day is shared, a good one is celebrated, and nobody is left to manage a full waiting room alone.',
    },
    {
        icon: 'family',
        title: 'By families, for families',
        body: 'A family built this clinic, and families fill it. Children, parents and grandparents sit in the same chairs. We care for them the way we care for our own.',
    },
    {
        icon: 'spark',
        title: 'Constantly innovating',
        body: 'Digital workflows, 3D scanning and modern systems behind the desk and beside the chair. We keep improving how we work, and you are part of that.',
    },
    {
        icon: 'home',
        title: 'A place for your long term',
        body: 'Many of us have been here for years. It is a place to learn, to grow and to call home, not a stop on the way somewhere else.',
    },
];

// Draws the icon's strokes once when the card scrolls into view. Static
// (fully drawn) for reduced motion and for the pre-rendered first paint.
const DrawnIcon = ({ name }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
    const reduced = useReducedMotion();
    const [wasPrerendered] = useState(() => isFirstPaint());
    const skip = reduced || wasPrerendered;
    const paths = ICONS[name];
    return (
        <svg ref={ref} className="wh-icon" viewBox="0 0 24 24" width="40" height="40" fill="none"
            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths.map((d, i) => (
                <motion.path
                    key={d}
                    d={d}
                    initial={skip ? false : { pathLength: 0, opacity: 0 }}
                    animate={skip || inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={skip ? { duration: 0 } : { duration: 0.4, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                />
            ))}
        </svg>
    );
};

// Working-here tile: records the cursor point so the ripple starts where the
// pointer entered. CSS does the lift and the fade; this only sets two vars.
const Tile = ({ icon, title, body }) => {
    const onEnter = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--rx', `${((e.clientX - r.left) / r.width) * 100}%`);
        e.currentTarget.style.setProperty('--ry', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    return (
        <div className="wh-card" onPointerEnter={onEnter}>
            <span className="wh-ripple" aria-hidden="true" />
            <DrawnIcon name={icon} />
            <h3>{title}</h3>
            <p>{body}</p>
        </div>
    );
};

const Careers = () => {
    const seo = CORE_PAGES.find((p) => p.path === 'careers');

    return (
        <div className="careers-page">
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href="https://ismile.com.my/careers" />
            </Helmet>

            <section className="container careers-hero">
                <Reveal width="100%">
                    <h1 className="statement">Work at <em>iSmile</em></h1>
                </Reveal>
                <Reveal delay={0.1} width="100%">
                    <p className="careers-lead">
                        A family dental clinic in Damansara Jaya, Petaling Jaya, run by family people.
                        Here is who we are, what working with us is like, and the two ways to join us.
                    </p>
                </Reveal>
            </section>

            <div className="container">
                {/* Who we are: family first */}
                <section className="careers-about" aria-labelledby="careers-about-title">
                    <Reveal width="100%">
                        <div className="careers-photo">
                            <ResponsiveImage src="/images/team_group.jpg" alt="The iSmile Dental Clinic team" sizes="(max-width: 900px) 100vw, 50vw" loading="eager" fetchPriority="high" />
                        </div>
                    </Reveal>
                    <div className="careers-about-text">
                        <Reveal width="100%">
                            <h2 id="careers-about-title" className="system-title">A clinic of <em>family people</em></h2>
                        </Reveal>
                        {FAMILY_POINTS.map((p, i) => (
                            <Reveal key={p.title} delay={0.05 * i} width="100%">
                                <div className="careers-point">
                                    <h3>{p.title}</h3>
                                    <p>{p.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Working here: four cards */}
                <section className="careers-working" aria-labelledby="careers-working-title">
                    <Reveal width="100%">
                        <h2 id="careers-working-title" className="system-title">Working <em>here</em></h2>
                    </Reveal>
                    <div className="wh-grid">
                        {WORKING_HERE.map((c, i) => (
                            <Reveal key={c.title} delay={0.06 * i} width="100%">
                                <Tile icon={c.icon} title={c.title} body={c.body} />
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Two ways to join, side by side */}
                <section className="careers-paths" aria-labelledby="careers-paths-title">
                    <Reveal width="100%">
                        <h2 id="careers-paths-title" className="system-title">Join us <em>today</em></h2>
                    </Reveal>
                    <div className="paths-grid">
                        <Reveal width="100%">
                            <div className="path-block">
                                <h3>Dentists</h3>
                                <p>
                                    Practise at iSmile. An established family patient base, a broad case mix
                                    and a safe environment to practise. Tell us about yourself and send your CV.
                                </p>
                                <Link to="/careers/dentists" className="btn btn-outline path-cta" data-analytics-click="careers-path-dentists">
                                    Practise at iSmile <ArrowRight size={18} aria-hidden="true" />
                                </Link>
                            </div>
                        </Reveal>
                        <Reveal delay={0.06} width="100%">
                            <div className="path-block">
                                <h3>Team roles</h3>
                                <p>
                                    Front desk, Dental Surgery Assistant, marketing and other clinic roles.
                                    {OPEN_JOBS.length ? ' Open now:' : ' Nothing is open right now, but you are welcome to send your CV.'}
                                </p>
                                {OPEN_JOBS.length > 0 && (
                                    <ul className="path-roles">
                                        {OPEN_JOBS.map((job) => (
                                            <li key={job.slug}>
                                                <Link to={`/careers/${job.slug}`} data-analytics-click={`careers-role-${job.slug}`}>{job.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Link to="/careers/team" className="btn btn-outline path-cta" data-analytics-click="careers-path-team">
                                    See team roles <ArrowRight size={18} aria-hidden="true" />
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </div>

            <Style>{CSS}</Style>
        </div>
    );
};

const CSS = `
.careers-hero { padding-top: 180px; padding-bottom: 56px; text-align: center; }
.careers-hero .statement { margin: 0 0 20px; }
.careers-lead { font-size: var(--fs-lead); color: var(--color-text-slate); line-height: 1.6; max-width: 640px; margin: 0 auto; }

.careers-about {
    display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;
    max-width: 1060px; margin: 0 auto; padding: 24px 0 var(--space-section);
}
.careers-photo { border-radius: 26px; overflow: hidden; aspect-ratio: 3 / 2; }
.careers-photo picture, .careers-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.careers-about-text .system-title { margin-bottom: 8px; }
.careers-point { border-top: 1px solid var(--hairline); padding: 20px 0; }
.careers-point h3 { font-family: var(--font-heading); font-size: 1.12rem; font-weight: 700; color: var(--color-text-charcoal); margin: 0 0 6px; letter-spacing: -0.01em; }
.careers-point p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0; }

.careers-working, .careers-paths { max-width: 1060px; margin: 0 auto; padding: 0 0 var(--space-section); }
.careers-working .system-title, .careers-paths .system-title { margin-bottom: 24px; }

/* Four identical tiles: same height, same heading block height (two lines),
   same soft brand tint. Lift + ripple on pointer hover only (Lau, 5 Nov 2026). */
.wh-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
/* Reveal wraps each tile in two divs; both must stretch or the tiles differ in height. */
.wh-grid > div, .wh-grid > div > div { height: 100%; }
.wh-card {
    position: relative; overflow: hidden; isolation: isolate;
    height: 100%; display: flex; flex-direction: column; gap: 10px;
    padding: 28px 24px;
    border: 1px solid rgba(0, 141, 176, 0.32); border-radius: 20px;
    /* Raised card (Lau, 5 Nov round 5): plain white surface, layered shadow so
       it clearly sits above the page. No tint band (Lau, same day). */
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 40, 60, 0.06), 0 8px 24px rgba(15, 40, 60, 0.10);
    transition: transform 220ms var(--ease-slow);
    will-change: transform;
}
.wh-ripple {
    position: absolute; inset: 0; z-index: -1; pointer-events: none;
    background: radial-gradient(circle at var(--rx, 50%) var(--ry, 50%), rgba(0, 141, 176, 0.18) 0%, rgba(0, 141, 176, 0.06) 35%, rgba(0, 141, 176, 0) 70%);
    opacity: 0; transform: scale(0.6); transform-origin: var(--rx, 50%) var(--ry, 50%);
    transition: opacity 250ms ease-out, transform 250ms var(--ease-slow);
}
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .wh-card:hover { transform: translateY(-3px) scale(1.025); }
    .wh-card:hover .wh-ripple { opacity: 1; transform: scale(1); }
}
.wh-icon { color: var(--color-primary-teal); flex: none; margin-bottom: 6px; }
.wh-card h3 {
    font-family: var(--font-heading); font-size: 1.12rem; font-weight: 700; line-height: 1.3;
    color: var(--color-text-charcoal); margin: 0; letter-spacing: -0.01em;
    min-height: calc(1.12rem * 1.3 * 2); /* two lines, so a wrapping title never shifts the copy */
}
.wh-card p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0; }

/* Join us today: two boxes, same size, same treatment, same outline button. */
.paths-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch; }
.paths-grid > div, .paths-grid > div > div { height: 100%; }
.path-block {
    height: 100%; display: flex; flex-direction: column;
    padding: 32px 28px;
    border: 1px solid rgba(0, 141, 176, 0.32); border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 40, 60, 0.06), 0 8px 24px rgba(15, 40, 60, 0.10);
}
.path-block h3 { font-family: var(--font-heading); font-size: var(--fs-h3); font-weight: 700; color: var(--color-text-charcoal); margin: 0 0 10px; letter-spacing: -0.02em; }
.path-block p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0 0 16px; }
.path-roles { list-style: none; padding: 0; margin: -4px 0 16px; display: flex; flex-wrap: wrap; gap: 8px 18px; }
.path-roles a { display: inline-block; min-height: 32px; line-height: 32px; font-size: 0.92rem; font-weight: 600; color: var(--color-primary-deep); text-decoration: none; transition: color 0.18s ease; }
.path-roles a:hover { color: var(--color-primary-teal); }
.path-cta { align-self: flex-start; margin-top: auto; min-height: 56px; padding: 14px 28px; text-decoration: none; background: #fff; }
.path-cta:hover { transform: none; box-shadow: none; }

@media (max-width: 1024px) {
    .wh-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
    .careers-about { grid-template-columns: 1fr; gap: 28px; }
    .paths-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
    .careers-hero { padding-top: 140px; padding-bottom: 40px; }
    .careers-lead { font-size: 1rem; }
    .careers-about { padding-top: 8px; }
    .careers-photo { border-radius: 20px; }
    .wh-grid { grid-template-columns: 1fr; gap: 12px; }
    .wh-card { padding: 22px 20px; }
    .path-block { padding: 24px 20px; }
    .path-cta { width: 100%; justify-content: center; }
}
`;

export default Careers;
