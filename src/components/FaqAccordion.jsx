import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Style from './Style';

/**
 * Collapsible question list, collapsed by default.
 *
 * The specialty pages and /services rendered their FAQs as a grid of always-open
 * cards, which buried the page's own content under a wall of answers nobody had
 * asked for yet. /faq, the blog posts and the location page were already
 * accordions; this is the shared version so the fourth pattern doesn't appear.
 *
 * Items open independently — reading one answer should not close another, which
 * matches how the existing accordions behave.
 *
 * The expand/collapse uses grid-template-rows 0fr -> 1fr rather than a
 * max-height cap: a capped height silently clips any answer taller than the
 * guess, and some of these run long.
 */
export default function FaqAccordion({ items = [], idPrefix = 'faq', analyticsLabel = 'faq' }) {
    const [open, setOpen] = useState(() => new Set());

    if (!items.length) return null;

    const toggle = (i) => {
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    return (
        <div className="faq-accordion">
            {items.map((item, i) => {
                const isOpen = open.has(i);
                const answerId = `${idPrefix}-answer-${i}`;
                const buttonId = `${idPrefix}-question-${i}`;
                return (
                    <div key={i} className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
                        <h3 className="faq-accordion-heading">
                            <button
                                type="button"
                                id={buttonId}
                                className="faq-accordion-trigger"
                                onClick={() => toggle(i)}
                                aria-expanded={isOpen}
                                aria-controls={answerId}
                                data-analytics-click="faq-toggle"
                                data-analytics-label={analyticsLabel}
                            >
                                <span>{item.q}</span>
                                <ChevronDown size={20} aria-hidden="true" className="faq-accordion-chevron" />
                            </button>
                        </h3>
                        <div
                            id={answerId}
                            role="region"
                            aria-labelledby={buttonId}
                            className="faq-accordion-panel"
                        >
                            <div className="faq-accordion-panel-inner">
                                <p>{item.a}</p>
                            </div>
                        </div>
                    </div>
                );
            })}

            <Style>{`
                .faq-accordion {
                    max-width: 820px;
                    margin: 40px auto 0;
                    text-align: left;
                }

                /* Hairline rows, not cards (design-system rollout, 7 Sep 2026):
                   no background, border-radius or shadow — a 1px rule under each
                   question, matching the homepage's row language. */
                .faq-accordion-item {
                    border-bottom: 1px solid var(--hairline);
                }
                .faq-accordion-item:first-child {
                    border-top: 1px solid var(--hairline);
                }

                .faq-accordion-heading {
                    margin: 0;
                    font-size: inherit;
                    font-weight: inherit;
                }

                .faq-accordion-trigger {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    width: 100%;
                    padding: 22px 4px;
                    background: none;
                    border: none;
                    font: inherit;
                    text-align: left;
                    cursor: pointer;
                    color: var(--color-text-charcoal);
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.05rem;
                    line-height: 1.4;
                }

                .faq-accordion-trigger:hover { color: var(--color-primary-deep); }

                .faq-accordion-trigger:focus-visible {
                    outline: 2px solid var(--color-primary);
                    outline-offset: 2px;
                    border-radius: 6px;
                }

                .faq-accordion-chevron {
                    flex-shrink: 0;
                    color: var(--color-primary-teal);
                    transition: transform 0.25s ease;
                }

                .faq-accordion-item.is-open .faq-accordion-chevron {
                    transform: rotate(180deg);
                }

                .faq-accordion-panel {
                    display: grid;
                    grid-template-rows: 0fr;
                    transition: grid-template-rows 0.4s var(--ease-slow);
                }

                .faq-accordion-item.is-open .faq-accordion-panel {
                    grid-template-rows: 1fr;
                }

                .faq-accordion-panel-inner {
                    overflow: hidden;
                }

                .faq-accordion-panel-inner p {
                    margin: 0;
                    padding: 0 4px 24px;
                    color: var(--color-text-slate);
                    line-height: 1.7;
                    font-size: 1rem;
                }

                @media (max-width: 1024px) {
                    .faq-accordion { margin-top: 28px; }
                    .faq-accordion-trigger { padding: 18px 2px; font-size: 1rem; }
                    .faq-accordion-panel-inner p { padding: 0 2px 18px; font-size: 0.95rem; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .faq-accordion-panel,
                    .faq-accordion-chevron,
                    .faq-accordion-item { transition: none; }
                }
            `}</Style>
        </div>
    );
}
