import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import Style from '../components/Style';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';
import { OPEN_JOBS, GENERAL_APPLICATION } from '../data/jobs';

// Team roles page (5 Nov 2026): the staff counterpart of /careers/dentists.
// Short intro, the open roles as hairline rows (each opens /careers/:slug),
// and the open door to /careers/general.

const CareersTeam = () => {
    const seo = CORE_PAGES.find((p) => p.path === 'careers/team');

    return (
        <div className="ct-page">
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href="https://ismile.com.my/careers/team" />
            </Helmet>

            <section className="container ct-hero">
                <Link to="/careers" className="ct-back"><ArrowLeft size={18} aria-hidden="true" /> Careers</Link>
                <Reveal width="100%">
                    <h1 className="statement">Team <em>roles</em></h1>
                </Reveal>
                <Reveal delay={0.1} width="100%">
                    <p className="ct-lead">
                        Front desk, Dental Surgery Assistant, marketing and the other roles that keep a family
                        clinic running. Every role has a written description. Read it, then apply with your CV.
                    </p>
                </Reveal>
            </section>

            <div className="container ct-main">
                <section className="ct-section" aria-labelledby="ct-open">
                    <Reveal width="100%">
                        <h2 id="ct-open" className="system-title">Open <em>now</em></h2>
                        <p className="ct-sub">
                            {OPEN_JOBS.length
                                ? 'Tap a role to read the full description and apply.'
                                : 'We have no openings right now. You are still welcome to send us your CV.'}
                        </p>
                    </Reveal>
                    <div className="ct-rows">
                        {OPEN_JOBS.map((job, i) => (
                            <Reveal key={job.slug} delay={0.04 * i} width="100%">
                                <Link to={`/careers/${job.slug}`} className="ct-row" data-analytics-click={`careers-team-${job.slug}`}>
                                    <span className="ct-row-title">{job.title}</span>
                                    <span className="ct-row-meta">{job.type} · {job.location}</span>
                                    <ArrowRight size={20} aria-hidden="true" className="ct-row-arrow" />
                                </Link>
                            </Reveal>
                        ))}
                        <Reveal delay={0.04 * OPEN_JOBS.length} width="100%">
                            <Link to={`/careers/${GENERAL_APPLICATION.slug}`} className="ct-row ct-row-general" data-analytics-click="careers-team-general">
                                <span className="ct-row-title">None of these fit? Send us your CV anyway</span>
                                <span className="ct-row-meta">We keep good applications on file for the next opening</span>
                                <ArrowRight size={20} aria-hidden="true" className="ct-row-arrow" />
                            </Link>
                        </Reveal>
                    </div>
                </section>
            </div>

            <Style>{CSS}</Style>
        </div>
    );
};

const CSS = `
.ct-hero { padding-top: 150px; padding-bottom: 24px; max-width: 820px; }
.ct-back {
    display: inline-flex; align-items: center; gap: 6px; min-height: 44px;
    font-size: 0.9rem; font-weight: 600; color: var(--color-primary-deep); text-decoration: none;
    margin-bottom: 8px; transition: color 0.18s ease;
}
.ct-back:hover { color: var(--color-primary-teal); }
.ct-hero .statement { margin: 0 0 16px; }
.ct-lead { font-size: var(--fs-lead); color: var(--color-text-slate); line-height: 1.6; margin: 0; max-width: 640px; }
.ct-main { max-width: 820px; padding-bottom: var(--space-section); }
.ct-section { padding: 24px 0 0; }
.ct-section .system-title { margin-bottom: 8px; }
.ct-sub { color: var(--color-text-slate); font-size: 0.95rem; margin: 0 0 20px; }
.ct-rows { border-top: 1px solid var(--hairline); }
.ct-row {
    display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 16px 24px; align-items: center;
    min-height: 72px; padding: 22px 0; border-bottom: 1px solid var(--hairline);
    text-decoration: none; color: inherit;
}
.ct-row-title { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--color-text-charcoal); letter-spacing: -0.015em; transition: color 0.18s ease; }
.ct-row-meta { font-size: 0.9rem; color: var(--color-text-slate); }
.ct-row-arrow { color: var(--color-primary-deep); flex: none; }
.ct-row:hover .ct-row-title, .ct-row:focus-visible .ct-row-title { color: var(--color-primary-deep); }
.ct-row:active .ct-row-title { color: var(--color-primary-teal); }
.ct-row:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 4px; border-radius: 8px; }
.ct-row-general .ct-row-title { font-size: 1.05rem; font-weight: 600; }
@media (max-width: 768px) {
    .ct-hero { padding-top: 120px; padding-bottom: 16px; }
    .ct-lead { font-size: 1rem; }
    .ct-row { grid-template-columns: minmax(0, 1fr) auto; gap: 4px 16px; padding: 18px 0; }
    .ct-row-meta { grid-column: 1; }
    .ct-row-arrow { grid-row: 1 / span 2; grid-column: 2; }
    .ct-row-title { font-size: 1.1rem; }
}
`;

export default CareersTeam;
