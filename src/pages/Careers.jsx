import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import ResponsiveImage from '../components/ResponsiveImage';
import Style from '../components/Style';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';
import { OPEN_JOBS, GENERAL_APPLICATION } from '../data/jobs';

// Careers: non-doctor roles. Dental practitioners have their own door at /join-us.
// Top half = who we are and what working here is like. Bottom half = the open
// roles as hairline rows, each opening its own page with the full description
// and the application form.

const ABOUT_POINTS = [
    {
        title: 'A family clinic since 2006',
        body: 'We have cared for the same Petaling Jaya families for twenty years, often across three generations. Patients know us by name, and we know them.',
    },
    {
        title: 'Calm, respectful, professional',
        body: 'Children, teenagers, adults and seniors all walk through the same door. The job is to make every one of them feel looked after, from the first hello to the last goodbye.',
    },
    {
        title: 'A team that backs each other',
        body: 'Doctors, Dental Surgery Assistants and the front desk work as one team. Nobody is left to figure a busy day out alone.',
    },
];

const WORKING_HERE = [
    ['Training on our systems', 'You will be shown how we work, from the appointment book to the way we talk to patients. No one is expected to know it all on day one.'],
    ['Clear expectations', 'Every role has a written description, so you know what a good week looks like and what we will judge it by.'],
    ['Regular hours', 'Monday to Friday and Saturday until mid afternoon. Sundays and public holidays are yours.'],
    ['Room to grow', 'We promote from within wherever we can. Front desk, chairside and marketing roles all have a next step inside the clinic.'],
];

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
                        A family dental clinic in Damansara Jaya, Petaling Jaya. We are a small team, so every person here matters.
                        Here is who we are, what working with us is like, and the roles we are hiring for now.
                    </p>
                </Reveal>
            </section>

            <div className="container">
                {/* Who we are */}
                <section className="careers-about" aria-labelledby="careers-about-title">
                    <Reveal width="100%">
                        <div className="careers-photo">
                            <ResponsiveImage src="/images/team_group.jpg" alt="The iSmile Dental Clinic team" sizes="(max-width: 900px) 100vw, 50vw" loading="eager" fetchPriority="high" />
                        </div>
                    </Reveal>
                    <div className="careers-about-text">
                        <Reveal width="100%">
                            <h2 id="careers-about-title" className="system-title">Who <em>we are</em></h2>
                        </Reveal>
                        {ABOUT_POINTS.map((p, i) => (
                            <Reveal key={p.title} delay={0.05 * i} width="100%">
                                <div className="careers-point">
                                    <h3>{p.title}</h3>
                                    <p>{p.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Working here */}
                <section className="careers-working" aria-labelledby="careers-working-title">
                    <Reveal width="100%">
                        <h2 id="careers-working-title" className="system-title">Working <em>here</em></h2>
                    </Reveal>
                    <div className="careers-rows">
                        {WORKING_HERE.map(([title, body], i) => (
                            <Reveal key={title} delay={0.04 * i} width="100%">
                                <div className="careers-row">
                                    <h3>{title}</h3>
                                    <p>{body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Open roles */}
                <section className="careers-jobs" aria-labelledby="careers-jobs-title">
                    <Reveal width="100%">
                        <h2 id="careers-jobs-title" className="system-title">Open <em>roles</em></h2>
                        <p className="careers-jobs-sub">
                            {OPEN_JOBS.length
                                ? 'Tap a role to read the full description and apply.'
                                : 'We have no openings right now. You are still welcome to send us your CV.'}
                        </p>
                    </Reveal>
                    <div className="careers-rows">
                        {OPEN_JOBS.map((job, i) => (
                            <Reveal key={job.slug} delay={0.04 * i} width="100%">
                                <Link to={`/careers/${job.slug}`} className="careers-job-row" data-analytics-click={`careers-role-${job.slug}`}>
                                    <span className="careers-job-title">{job.title}</span>
                                    <span className="careers-job-meta">{job.type} · {job.location}</span>
                                    <ArrowRight size={20} aria-hidden="true" className="careers-job-arrow" />
                                </Link>
                            </Reveal>
                        ))}
                        <Reveal delay={0.04 * OPEN_JOBS.length} width="100%">
                            <Link to={`/careers/${GENERAL_APPLICATION.slug}`} className="careers-job-row careers-job-row-general" data-analytics-click="careers-role-general">
                                <span className="careers-job-title">None of these fit? Send us your CV anyway</span>
                                <span className="careers-job-meta">We keep good applications on file for the next opening</span>
                                <ArrowRight size={20} aria-hidden="true" className="careers-job-arrow" />
                            </Link>
                        </Reveal>
                    </div>
                    <p className="careers-doctors">
                        Dental practitioner? Your page is <Link to="/join-us" className="quiet-link">Practise at iSmile</Link>.
                    </p>
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

.careers-working, .careers-jobs { max-width: 1060px; margin: 0 auto; padding: 0 0 var(--space-section); }
.careers-working .system-title, .careers-jobs .system-title { margin-bottom: 20px; }
.careers-rows { border-top: 1px solid var(--hairline); }
.careers-row {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 32px; align-items: start;
    padding: 24px 0; border-bottom: 1px solid var(--hairline);
}
.careers-row h3 { font-family: var(--font-heading); font-size: 1.12rem; font-weight: 700; color: var(--color-text-charcoal); margin: 0; letter-spacing: -0.01em; }
.careers-row p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0; }

.careers-jobs-sub { color: var(--color-text-slate); font-size: 0.95rem; margin: -8px 0 20px; }
.careers-job-row {
    display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 16px 24px; align-items: center;
    min-height: 72px; padding: 22px 0; border-bottom: 1px solid var(--hairline);
    text-decoration: none; color: inherit;
    transition: color 0.18s ease;
}
.careers-job-title { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--color-text-charcoal); letter-spacing: -0.015em; transition: color 0.18s ease; }
.careers-job-meta { font-size: 0.9rem; color: var(--color-text-slate); }
.careers-job-arrow { color: var(--color-primary-deep); flex: none; transition: color 0.18s ease; }
.careers-job-row:hover .careers-job-title, .careers-job-row:focus-visible .careers-job-title { color: var(--color-primary-deep); }
.careers-job-row:active .careers-job-title { color: var(--color-primary-teal); }
.careers-job-row:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 4px; border-radius: 8px; }
.careers-job-row-general .careers-job-title { font-size: 1.05rem; font-weight: 600; }
.careers-doctors { margin: 24px 0 0; font-size: 0.9rem; color: var(--color-text-slate); }
.careers-doctors .quiet-link { color: var(--color-primary-deep); font-weight: 600; text-decoration: none; }
.careers-doctors .quiet-link:hover { color: var(--color-primary-teal); }

@media (max-width: 900px) {
    .careers-about { grid-template-columns: 1fr; gap: 28px; }
    .careers-row { grid-template-columns: 1fr; gap: 6px; padding: 18px 0; }
}
@media (max-width: 768px) {
    .careers-hero { padding-top: 140px; padding-bottom: 40px; }
    .careers-lead { font-size: 1rem; }
    .careers-about { padding-top: 8px; }
    .careers-photo { border-radius: 20px; }
    .careers-job-row { grid-template-columns: minmax(0, 1fr) auto; gap: 4px 16px; padding: 18px 0; }
    .careers-job-meta { grid-column: 1; }
    .careers-job-arrow { grid-row: 1 / span 2; grid-column: 2; }
    .careers-job-title { font-size: 1.1rem; }
}
`;

export default Careers;
