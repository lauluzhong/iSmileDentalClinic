import React from 'react';
import { useBooking } from '../context/BookingContext';
import Button from './Button';
import FaqAccordion from './FaqAccordion';
import RelatedReading from './RelatedReading';
import Style from './Style';

/**
 * Shared template for the 8 specialty pages.
 *
 * Before this, every specialty page carried the same dark tech-hero,
 * boxed sidebar and ~35 duplicated CSS rules. This renders the one
 * committed design (see _design-sweep/DESIGN-CONTRACT.md): light hero on the
 * page background, hairline feature rows, a full-width numbered workflow list
 * in the homepage .stage-row spirit, the shared FaqAccordion, one CTA, and
 * RelatedReading at the end.
 *
 * Copy is clinically signed off — every visible string arrives via props
 * verbatim from the page. The pages keep their own Helmet + JSON-LD effects
 * and pass the Helmet in via the `helmet` prop.
 */

/** Wrap one existing phrase of `text` in <em> without changing the words. */
const accent = (text, phrase) => {
    if (!phrase) return text;
    const i = text.indexOf(phrase);
    if (i === -1) return text;
    return (
        <>
            {text.slice(0, i)}
            <em>{phrase}</em>
            {text.slice(i + phrase.length)}
        </>
    );
};

export default function SpecialtyLayout({
    helmet,
    eyebrow,
    title,
    titleAccent,
    subline,
    lead,
    scienceTitle,
    scienceIntro,
    features = [],
    workflowTitle,
    workflow = [],
    faqs = [],
    faqIdPrefix,
    faqAnalyticsLabel,
    ctaTitle,
    ctaAccent,
    ctaText,
    ctaButtonLabel = 'Book Consultation',
    bookingLabel,
    bookingSource,
    relatedKey,
    children,
}) {
    const { openBooking } = useBooking();

    return (
        <div className="specialty-page">
            {helmet}

            <header className="sp-hero">
                <div className="container">
                    <h1 className="sp-title">{accent(title, titleAccent)}</h1>
                    <p className="sp-lead">{lead}</p>
                    {subline && <p className="sp-meta">{subline}</p>}
                </div>
            </header>

            <section className="sp-science">
                <div className="container">
                    <h2 className="system-title">{scienceTitle}</h2>
                    {scienceIntro && <p className="sp-intro">{scienceIntro}</p>}
                    <div className="sp-feature-list">
                        {features.map((f, i) => (
                            <div className="sp-feature" key={i}>
                                <h4>{f.h4}</h4>
                                <p>{f.p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="sp-workflow">
                <div className="container">
                    <h2 className="system-title">{workflowTitle}</h2>
                    <ol className="sp-steps">
                        {workflow.map((step, i) => (
                            <li key={i}>
                                <span className="sp-step-num">{String(i + 1).padStart(2, '0')}</span>
                                <div className="sp-step-body">
                                    <span className="sp-step-text">{step.text}</span>
                                    {step.note && <span className="sp-step-note">{step.note}</span>}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {children}

            <section className="sp-faq">
                <div className="container">
                    <span className="eyebrow">Before you book</span>
                    <h2 className="system-title">Common Questions</h2>
                    <FaqAccordion items={faqs} idPrefix={faqIdPrefix} analyticsLabel={faqAnalyticsLabel} />
                </div>
            </section>

            <section className="sp-cta">
                <div className="container">
                    <span className="eyebrow">Next step</span>
                    <h2 className="statement">{accent(ctaTitle, ctaAccent)}</h2>
                    <p className="sp-cta-text">{ctaText}</p>
                    <Button onClick={() => openBooking(bookingLabel, bookingSource)}>{ctaButtonLabel}</Button>
                </div>
            </section>

            <RelatedReading pathKey={relatedKey} />

            <Style>{`
                .specialty-page { padding-top: 100px; }

                /* ---------- hero: light, on the page background ---------- */
                .sp-hero { padding: var(--space-section-lg) 0 0; }
                .sp-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: var(--fs-statement);
                    line-height: 1.06;
                    letter-spacing: -0.03em;
                    margin: 0 0 24px;
                    color: var(--color-text-charcoal);
                    text-wrap: balance;
                }
                .sp-lead {
                    font-size: var(--fs-lead);
                    line-height: 1.65;
                    color: var(--color-text-slate);
                    max-width: 760px;
                    margin: 0;
                }
                .sp-meta {
                    margin: 18px 0 0;
                    font-family: var(--font-heading);
                    font-weight: 600;
                    font-size: 0.8rem;
                    letter-spacing: 0.06em;
                    color: var(--color-text-grey);
                }

                /* ---------- features: hairline rows, no icons ---------- */
                .sp-science { padding: var(--space-section-lg) 0 0; }
                .sp-intro {
                    font-size: 1.05rem;
                    line-height: 1.65;
                    color: var(--color-text-slate);
                    max-width: 720px;
                    margin: 18px 0 0;
                }
                .sp-feature-list { margin-top: 40px; border-top: 1px solid var(--hairline); }
                .sp-feature { padding: 34px 0; border-bottom: 1px solid var(--hairline); }
                .sp-feature h4 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.2rem;
                    letter-spacing: -0.015em;
                    color: var(--color-text-charcoal);
                    margin: 0 0 8px;
                }
                .sp-feature p {
                    font-size: 1rem;
                    line-height: 1.65;
                    color: var(--color-text-slate);
                    max-width: 720px;
                    margin: 0;
                }

                /* ---------- workflow: full-width numbered hairline list ---------- */
                .sp-workflow { padding: var(--space-section-lg) 0 0; }
                .sp-steps { list-style: none; padding: 0; margin: 40px 0 0; border-top: 1px solid var(--hairline); }
                .sp-steps li {
                    display: grid;
                    grid-template-columns: 72px minmax(0, 1fr);
                    align-items: baseline;
                    gap: 24px;
                    padding: 26px 0;
                    border-bottom: 1px solid var(--hairline);
                }
                .sp-step-num {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 0.12em;
                    color: var(--color-primary-teal);
                }
                .sp-step-text {
                    display: block;
                    font-family: var(--font-heading);
                    font-weight: 600;
                    font-size: 1.08rem;
                    line-height: 1.45;
                    letter-spacing: -0.01em;
                    color: var(--color-text-charcoal);
                }
                .sp-step-note {
                    display: block;
                    margin-top: 6px;
                    font-size: 0.92rem;
                    line-height: 1.55;
                    color: var(--color-text-slate);
                }

                /* ---------- Myofunctional extras (passed as children) ---------- */
                .sp-stories, .sp-fits { padding: var(--space-section-lg) 0 0; }
                .sp-story-rail {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    column-gap: 64px;
                    margin-top: 40px;
                    border-top: 1px solid var(--hairline);
                }
                .sp-story { padding: 36px 0; border-bottom: 1px solid var(--hairline); }
                .sp-story-num {
                    display: block;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 0.12em;
                    color: var(--color-primary-teal);
                    margin-bottom: 12px;
                }
                .sp-story h4 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.2rem;
                    letter-spacing: -0.015em;
                    color: var(--color-text-charcoal);
                    margin: 0 0 10px;
                }
                .sp-story p {
                    font-size: 1rem;
                    line-height: 1.65;
                    color: var(--color-text-slate);
                    margin: 0 0 14px;
                }
                .sp-story p:last-child { margin-bottom: 0; }
                .sp-pull em {
                    font-family: var(--font-accent);
                    font-style: italic;
                    font-weight: 500;
                    letter-spacing: -0.01em;
                    color: var(--color-primary-deep);
                }
                .sp-story-footer {
                    max-width: 700px;
                    margin: 40px 0 0;
                    font-size: 1.05rem;
                    line-height: 1.6;
                    color: var(--color-text-slate);
                }
                .sp-fit-list { margin-top: 40px; border-top: 1px solid var(--hairline); }
                .sp-fit { padding: 34px 0; border-bottom: 1px solid var(--hairline); }
                .sp-fit h4 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.2rem;
                    letter-spacing: -0.015em;
                    color: var(--color-text-charcoal);
                    margin: 0 0 8px;
                }
                .sp-fit p {
                    font-size: 1rem;
                    line-height: 1.65;
                    color: var(--color-text-slate);
                    max-width: 760px;
                    margin: 0;
                }

                /* ---------- FAQ + CTA ---------- */
                .sp-faq { padding: var(--space-section-lg) 0 0; }
                .sp-faq .system-title { margin-bottom: 32px; }
                .sp-cta { padding: var(--space-section-lg) 0; text-align: center; }
                .sp-cta .statement { margin-bottom: 18px; }
                .sp-cta-text {
                    font-size: 1.05rem;
                    line-height: 1.6;
                    color: var(--color-text-slate);
                    max-width: 560px;
                    margin: 0 auto 30px;
                }

                @media (max-width: 1024px) {
                    .sp-hero { padding-top: 28px; }
                    .specialty-page { padding-top: 80px; }
                    .sp-feature { padding: 26px 0; }
                    .sp-feature h4 { font-size: 1.1rem; margin-bottom: 6px; }
                    .sp-feature p { font-size: 0.95rem; line-height: 1.55; }
                    .sp-steps li { grid-template-columns: 1fr; gap: 6px; }
                    .sp-step-text { font-size: 1rem; }
                }

                @media (max-width: 768px) {
                    /* story blocks become the owner-standard snap rail */
                    .sp-story-rail {
                        display: flex;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        gap: 16px;
                        border-top: none;
                        margin-top: 32px;
                        padding-bottom: 8px;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }
                    .sp-story-rail::-webkit-scrollbar { display: none; }
                    .sp-story-rail > * { scroll-snap-align: start; flex: none; }
                    .sp-story {
                        width: 82vw;
                        max-width: 340px;
                        padding: 20px 0 4px;
                        border-bottom: none;
                        border-top: 1px solid var(--hairline);
                    }
                    .sp-fit { padding: 24px 0; }
                }
            `}</Style>
        </div>
    );
}
