import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import Style from '../components/Style';
import CareersApplyForm from '../components/CareersApplyForm';
import NotFound from './NotFound';
import { findJob, GENERAL_APPLICATION } from '../data/jobs';

// One role, in full, with the application form at the end. /careers/general is
// the open door for people no listed role fits.

const CareersJob = () => {
    const { slug } = useParams();
    const isGeneral = slug === GENERAL_APPLICATION.slug;
    const job = isGeneral ? null : findJob(slug);
    if (!isGeneral && !job) return <NotFound />;

    const title = isGeneral ? GENERAL_APPLICATION.title : job.title;
    const roleSlug = isGeneral ? GENERAL_APPLICATION.slug : job.slug;
    const meta = isGeneral
        ? [['Role', 'Any role at the clinic'], ['Location', GENERAL_APPLICATION.location]]
        : [
            ['Position', job.type],
            ['Location', job.location],
            job.hours ? ['Working hours', job.hours] : null,
            job.experience ? ['Experience', job.experience] : null,
        ].filter(Boolean);

    const pageTitle = isGeneral
        ? 'Send us your CV | Careers at iSmile Dental Clinic'
        : `${job.title} | Careers at iSmile Dental Clinic, Petaling Jaya`;
    const pageDesc = isGeneral
        ? 'No listed role fits? Send iSmile Dental Clinic in Damansara Jaya, Petaling Jaya your CV and we will keep it on file for the next opening.'
        : `${job.title} at iSmile Dental Clinic, a family dental clinic in Damansara Jaya, Petaling Jaya. ${job.summary}`;

    return (
        <div className="careers-job-page">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                <link rel="canonical" href={`https://ismile.com.my/careers/${roleSlug}`} />
                {!isGeneral && (
                    <script type="application/ld+json">{JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'JobPosting',
                        title: job.title,
                        description: job.summary,
                        employmentType: 'FULL_TIME',
                        hiringOrganization: { '@type': 'Organization', name: 'iSmile Dental Clinic', sameAs: 'https://ismile.com.my' },
                        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: '75 & 75A, Jalan SS 22/23, Damansara Jaya', addressLocality: 'Petaling Jaya', addressRegion: 'Selangor', postalCode: '47400', addressCountry: 'MY' } },
                        directApply: true,
                    })}</script>
                )}
            </Helmet>

            <section className="container cj-hero">
                <Link to="/careers" className="cj-back"><ArrowLeft size={18} aria-hidden="true" /> All roles</Link>
                <Reveal width="100%">
                    <h1 className="statement">{isGeneral ? <>Send us <em>your CV</em></> : <>{job.title}</>}</h1>
                </Reveal>
                <Reveal delay={0.1} width="100%">
                    <p className="cj-lead">
                        {isGeneral
                            ? 'Tell us a little about yourself and attach your CV. We read every application personally and keep good ones on file for the next opening.'
                            : job.summary}
                    </p>
                </Reveal>
                <Reveal delay={0.15} width="100%">
                    <dl className="cj-meta">
                        {meta.map(([k, v]) => (
                            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                        ))}
                    </dl>
                </Reveal>
            </section>

            <div className="container cj-main">
                {!isGeneral && (
                    <>
                        <section className="cj-section" aria-labelledby="cj-do">
                            <Reveal width="100%"><h2 id="cj-do" className="system-title">What you <em>will do</em></h2></Reveal>
                            <div className="cj-rows">
                                {job.responsibilities.map(([lead, body], i) => (
                                    <Reveal key={lead} delay={0.03 * i} width="100%">
                                        <div className="cj-row"><h3>{lead}</h3><p>{body}</p></div>
                                    </Reveal>
                                ))}
                            </div>
                        </section>

                        <section className="cj-section" aria-labelledby="cj-need">
                            <Reveal width="100%"><h2 id="cj-need" className="system-title">What we are <em>looking for</em></h2></Reveal>
                            <ul className="cj-list">
                                {job.requirements.map((r) => <li key={r}>{r}</li>)}
                            </ul>
                        </section>

                        <section className="cj-section" aria-labelledby="cj-expect">
                            <Reveal width="100%"><h2 id="cj-expect" className="system-title">What you can <em>expect</em></h2></Reveal>
                            <ul className="cj-list">
                                {job.offer.map((r) => <li key={r}>{r}</li>)}
                            </ul>
                        </section>
                    </>
                )}

                <section className="cj-section cj-apply" aria-labelledby="cj-apply-title" id="apply">
                    <Reveal width="100%">
                        <h2 id="cj-apply-title" className="system-title">{isGeneral ? <>Your <em>details</em></> : <>Apply for <em>this role</em></>}</h2>
                        <p className="cj-apply-sub">Every application is read personally and treated in confidence.</p>
                    </Reveal>
                    <CareersApplyForm role={title} roleSlug={roleSlug} />
                </section>
            </div>

            <Style>{CSS}</Style>
        </div>
    );
};

const CSS = `
.cj-hero { padding-top: 150px; padding-bottom: 32px; max-width: 820px; }
.cj-back {
    display: inline-flex; align-items: center; gap: 6px; min-height: 44px;
    font-size: 0.9rem; font-weight: 600; color: var(--color-primary-deep); text-decoration: none;
    margin-bottom: 8px; transition: color 0.18s ease;
}
.cj-back:hover { color: var(--color-primary-teal); }
.cj-hero .statement { margin: 0 0 16px; }
.cj-lead { font-size: var(--fs-lead); color: var(--color-text-slate); line-height: 1.6; margin: 0 0 28px; max-width: 640px; }
.cj-meta {
    display: flex; flex-wrap: wrap; gap: 0 40px; margin: 0; padding: 18px 0 0; border-top: 1px solid var(--hairline);
}
.cj-meta div { padding: 0 0 12px; }
.cj-meta dt { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-grey); margin: 0 0 2px; }
.cj-meta dd { margin: 0; font-size: 0.95rem; color: var(--color-text-charcoal); font-weight: 500; line-height: 1.45; }

.cj-main { max-width: 820px; padding-bottom: var(--space-section); }
.cj-section { padding: 36px 0 0; }
.cj-section .system-title { margin-bottom: 16px; }
.cj-rows { border-top: 1px solid var(--hairline); }
.cj-row {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 24px; align-items: start;
    padding: 18px 0; border-bottom: 1px solid var(--hairline);
}
.cj-row h3 { font-family: var(--font-heading); font-size: 1.02rem; font-weight: 700; color: var(--color-text-charcoal); margin: 0; }
.cj-row p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0; }
.cj-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--hairline); }
.cj-list li {
    position: relative; padding: 14px 0 14px 26px; border-bottom: 1px solid var(--hairline);
    font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6;
}
.cj-list li::before { content: ''; position: absolute; left: 4px; top: 24px; width: 7px; height: 7px; border-radius: 50%; background: var(--color-primary-teal); }

.cj-apply { padding-top: 48px; }
.cj-apply-sub { color: var(--color-text-slate); font-size: 0.95rem; margin: -6px 0 24px; }

@media (max-width: 768px) {
    .cj-hero { padding-top: 120px; padding-bottom: 24px; }
    .cj-lead { font-size: 1rem; margin-bottom: 20px; }
    .cj-meta { gap: 0 24px; }
    .cj-row { grid-template-columns: 1fr; gap: 4px; padding: 14px 0; }
    .cj-section { padding-top: 28px; }
    .cj-apply { padding-top: 36px; }
}
`;

export default CareersJob;
