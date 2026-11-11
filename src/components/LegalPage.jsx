import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Style from './Style';

// Plain policy page: title, lead, then sections of headed paragraphs/lists.
// Used by /privacy and /data-deletion (Meta app review needs both URLs).
const LegalPage = ({ title, metaTitle, description, path, updated, lead, sections }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="legal-page">
            <Helmet>
                <title>{metaTitle}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`https://ismile.com.my${path}`} />
            </Helmet>
            <section className="section-padding">
                <div className="container legal-wrap">
                    <h1>{title}</h1>
                    <p className="legal-updated">Last updated: {updated}</p>
                    <p className="legal-lead">{lead}</p>
                    {sections.map((s) => (
                        <section key={s.heading} className="legal-section">
                            <h2>{s.heading}</h2>
                            {s.body.map((b, i) => (Array.isArray(b)
                                ? <ul key={i}>{b.map((li) => <li key={li}>{li}</li>)}</ul>
                                : <p key={i}>{b}</p>))}
                        </section>
                    ))}
                </div>
            </section>
            <Style>{`
                .legal-page .section-padding { padding-top: 170px; padding-bottom: var(--space-section-lg); }
                .legal-page .legal-wrap { max-width: 760px; }
                .legal-page h1 { font-size: var(--fs-h1); line-height: 1.08; letter-spacing: -0.03em; margin: 0 0 12px; }
                .legal-page h1 em { font-family: var(--font-accent); font-weight: 400; color: var(--color-primary-deep); }
                .legal-page .legal-updated { font-size: 0.9rem; color: var(--color-text-slate); margin: 0 0 24px; }
                .legal-page .legal-lead { font-size: var(--fs-lead); line-height: 1.65; color: var(--color-text-slate); margin: 0 0 16px; }
                .legal-page .legal-section { border-top: 1px solid var(--color-tint-blue); padding-top: 28px; margin-top: 32px; }
                .legal-page h2 { font-size: 1.35rem; line-height: 1.3; margin: 0 0 12px; }
                .legal-page p, .legal-page li { font-size: 1rem; line-height: 1.7; color: var(--color-text-slate); }
                .legal-page p { margin: 0 0 12px; }
                .legal-page ul { margin: 0 0 12px; padding-left: 20px; }
                .legal-page li { margin-bottom: 6px; }
                @media (max-width: 1024px) { .legal-page .section-padding { padding-top: 120px; } }
            `}</Style>
        </div>
    );
};

export default LegalPage;
