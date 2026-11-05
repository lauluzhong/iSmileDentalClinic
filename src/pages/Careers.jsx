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
// One primary button on the page (Dentists). Role cards are links.

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
                                <div className="wh-card">
                                    <DrawnIcon name={c.icon} />
                                    <h3>{c.title}</h3>
                                    <p>{c.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Two ways to join, side by side */}
                <section className="careers-paths" aria-labelledby="careers-paths-title">
                    <Reveal width="100%">
                        <h2 id="careers-paths-title" className="system-title">Two ways <em>to join us</em></h2>
                    </Reveal>
                    <div className="paths-grid">
                        <Reveal width="100%">
                            <div className="path-block path-dentists">
                                <h3>Dentists</h3>
                                <p>
                                    Practise at iSmile. An established family patient base, a broad case mix
                                    and a safe environment to practise. Tell us about yourself and send your CV.
                                </p>
                                <Link to="/careers/dentists" className="btn btn-primary path-cta" data-analytics-click="careers-path-dentists">
                                    Practise at iSmile <ArrowRight size={18} aria-hidden="true" />
                                </Link>
                            </div>
                        </Reveal>
                        <Reveal delay={0.06} width="100%">
                            <div className="path-block path-team">
                                <h3>Team roles</h3>
                                <p>
                                    {OPEN_JOBS.length
                                        ? 'Front desk, Dental Surgery Assistant, marketing and other clinic roles. Open now:'
                                        : 'Front desk, Dental Surgery Assistant, marketing and other clinic roles. Nothing is open right now, but you are welcome to send your CV.'}
                                </p>
                                <div className="role-cards">
                                    {OPEN_JOBS.map((job) => (
                                        <Link key={job.slug} to={`/careers/${job.slug}`} className="role-card" data-analytics-click={`careers-role-${job.slug}`}>
                                            <span className="role-card-title">{job.title}</span>
                                            <span className="role-card-meta">{job.type} · {job.location}</span>
                                            <ArrowRight size={20} aria-hidden="true" className="role-card-arrow" />
                                        </Link>
                                    ))}
                                </div>
                                <Link to={`/careers/${GENERAL_APPLICATION.slug}`} className="role-general" data-analytics-click="careers-role-general">
                                    None of these fit? Send us your CV anyway
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

/* Four equal cards, e0 (1px hairline), no hover lift. */
.wh-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
.wh-grid > div { height: 100%; }
.wh-card {
    height: 100%; display: flex; flex-direction: column; gap: 12px;
    padding: 28px 24px; border: 1px solid var(--hairline); border-radius: 20px; background: #fff;
}
.wh-icon { color: var(--color-primary-teal); flex: none; margin-bottom: 4px; }
.wh-card h3 { font-family: var(--font-heading); font-size: 1.12rem; font-weight: 700; color: var(--color-text-charcoal); margin: 0; letter-spacing: -0.01em; }
.wh-card p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0; }

/* Two paths side by side. Left: one call to action. Right: the open roles. */
.paths-grid { display: grid; grid-template-columns: 1fr 1.25fr; gap: 16px; align-items: stretch; }
.paths-grid > div { height: 100%; }
.path-block {
    height: 100%; display: flex; flex-direction: column;
    padding: 32px 28px; border: 1px solid var(--hairline); border-radius: 20px; background: #fff;
}
.path-block h3 { font-family: var(--font-heading); font-size: var(--fs-h3); font-weight: 700; color: var(--color-text-charcoal); margin: 0 0 10px; letter-spacing: -0.02em; }
.path-block p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0 0 20px; }
.path-dentists { background: var(--color-tint-faint); }
.path-dentists p { flex: 1; }
.path-cta { align-self: flex-start; min-height: 56px; padding: 14px 28px; text-decoration: none; }
.path-cta:hover { transform: none; }

.role-cards { display: grid; gap: 12px; margin-bottom: 14px; }
.role-card {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 16px; align-items: center;
    min-height: 72px; padding: 16px 18px; border: 1px solid var(--hairline); border-radius: 16px; background: #fff;
    text-decoration: none; color: inherit; transition: border-color 0.18s ease;
}
.role-card:hover, .role-card:focus-visible { border-color: var(--color-primary-teal); }
.role-card:active { border-color: var(--color-primary-deep); }
.role-card:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.role-card-title { font-family: var(--font-heading); font-size: 1.08rem; font-weight: 700; color: var(--color-text-charcoal); letter-spacing: -0.01em; }
.role-card-meta { font-size: 0.85rem; color: var(--color-text-slate); grid-column: 1; }
.role-card-arrow { color: var(--color-primary-deep); grid-row: 1 / span 2; grid-column: 2; }
.role-general { display: inline-block; min-height: 44px; line-height: 44px; font-size: 0.9rem; font-weight: 600; color: var(--color-primary-deep); text-decoration: none; margin-top: auto; transition: color 0.18s ease; }
.role-general:hover { color: var(--color-primary-teal); }

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
