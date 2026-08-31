import React from 'react';
import FaqAccordion from './FaqAccordion';
import { serviceContentFor } from '../data/serviceContent/index.js';

/**
 * The long-form body copy for a /services/* hub page.
 *
 * This copy already existed in src/data/serviceContent/ and was already being
 * written into the crawlable #ssg-content block by vite-plugin-blog-ssg.js.
 * What it was not doing was rendering for an actual visitor: the inline script
 * in the prerendered shell removes #ssg-content the moment React mounts, and
 * nothing in the app rendered the copy in its place. Crawlers saw ~2,300 words,
 * a person saw ~390.
 *
 * Blog posts use the same #ssg-content mechanism without that problem, because
 * BlogPost renders the same post body after the static block goes. This
 * component is the equivalent for the service hubs, so what a visitor reads and
 * what a crawler reads are the same text.
 *
 * `body` is plain text by contract (see serviceContent/index.js) — it is split
 * on blank lines into paragraphs and never interpreted as markup.
 */
export default function ServiceGuide({ category }) {
    const { sections, faqs } = serviceContentFor(`services/${category}`);

    if (!sections.length && !faqs.length) return null;

    return (
        <section className="service-guide section-padding" aria-labelledby="service-guide-heading">
            <div className="container">
                <div className="service-guide-inner">
                    <h2 id="service-guide-heading" className="sr-only">
                        About this treatment
                    </h2>

                    {sections.map((section, i) => (
                        <div key={i} className="service-guide-section">
                            {section.heading && <h3 className="service-guide-heading">{section.heading}</h3>}
                            {section.body
                                .split(/\n\s*\n/)
                                .map((para) => para.trim())
                                .filter(Boolean)
                                .map((para, j) => (
                                    <p key={j} className="service-guide-para">{para}</p>
                                ))}
                        </div>
                    ))}

                    {faqs.length > 0 && (
                        <div className="service-guide-faqs">
                            <h3 className="service-guide-heading">Common questions</h3>
                            <FaqAccordion
                                items={faqs}
                                idPrefix={`service-${category}`}
                                analyticsLabel={`service-hub-${category}`}
                            />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .service-guide {
                    background: var(--color-background, #fff);
                }

                .service-guide-inner {
                    max-width: 760px;
                    margin: 0 auto;
                }

                .service-guide-section {
                    margin-bottom: 48px;
                }

                .service-guide-section:last-child {
                    margin-bottom: 0;
                }

                .service-guide-heading {
                    font-size: 1.5rem;
                    line-height: 1.3;
                    margin: 0 0 16px 0;
                    letter-spacing: -0.01em;
                }

                .service-guide-para {
                    font-size: 1.0625rem;
                    line-height: 1.75;
                    margin: 0 0 18px 0;
                    color: var(--color-text-secondary, #444);
                }

                .service-guide-para:last-child {
                    margin-bottom: 0;
                }

                .service-guide-faqs {
                    margin-top: 64px;
                }

                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }

                @media (max-width: 768px) {
                    .service-guide-heading {
                        font-size: 1.3125rem;
                    }

                    .service-guide-para {
                        font-size: 1rem;
                        line-height: 1.7;
                    }

                    .service-guide-section {
                        margin-bottom: 40px;
                    }

                    .service-guide-faqs {
                        margin-top: 48px;
                    }
                }
            `}</style>
        </section>
    );
}
