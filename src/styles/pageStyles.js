/**
 * Page stylesheets shared by an English page and its Malay and Chinese
 * versions (src/pages/intl/IntlPage.jsx), so all three look the same.
 * Moved here verbatim on 19 Nov 2026; the English pages render identically.
 */

export const FAQ_CSS = `
                .faq-page .faq-container { padding-top: 160px; }
                .faq-page .faq-heading { max-width: 800px; margin-bottom: 64px; }
                .faq-page .faq-heading .eyebrow, .faq-page .faq-section > .eyebrow, .faq-page .still-questions .eyebrow { margin-bottom: 16px; }
                .faq-page .faq-lead { max-width: 800px; margin: 20px 0 0; color: var(--color-text-slate); font-size: var(--fs-lead); line-height: 1.6; }
                .faq-page .faq-section { margin-bottom: 64px; }
                .faq-page .faq-section .faq-accordion { max-width: none; margin: 20px 0 0; }
                .faq-page .phone-link { color: var(--color-primary-teal); font-weight: 700; text-decoration: none; }
                .faq-page .still-questions { max-width: 800px; margin-top: 72px; padding-top: 52px; border-top: 1px solid var(--hairline); }
                .faq-page .still-questions .statement { margin-bottom: 16px; }
                .faq-page .still-questions > div > p:not(.eyebrow) { max-width: 520px; margin: 0 0 24px; color: var(--color-text-slate); line-height: 1.6; }
                @media (max-width: 768px) { .faq-page .faq-container { padding-top: 130px; padding-bottom: 64px; } .faq-page .faq-heading { margin-bottom: 42px; } .faq-page .faq-section { margin-bottom: 46px; } .faq-page .still-questions { margin-top: 50px; padding-top: 38px; } }
            `;

export const SERVICES_LANDING_CSS = `
                .services-landing {
                    min-height: 100vh;
                    /* no opaque background — the shared hero tint shows through */
                }

                /* ---------- Hero ---------- */
                .sl-hero { padding: 180px 0 24px; }
                .sl-hero-inner { max-width: 850px; }
                .sl-title {
                    font-family: var(--font-heading);
                    font-size: var(--fs-statement);
                    font-weight: 700;
                    color: var(--color-text-charcoal);
                    letter-spacing: -0.03em;
                    line-height: 1.06;
                    margin: 0 0 20px;
                    text-wrap: balance;
                }
                .sl-lead {
                    font-size: var(--fs-lead);
                    color: var(--color-text-slate);
                    max-width: 700px;
                    margin: 0;
                    line-height: 1.65;
                }

                /* ---------- Directory rows ---------- */
                .sl-directory-wrap { padding-bottom: 80px; }
                .sl-directory { border-top: 1px solid var(--hairline); margin-top: 40px; }
                .sl-cat { border-bottom: 1px solid var(--hairline); }

                /* One grid, one left edge: the numeral sits in its own column;
                   title, subtitle and the treatment list all share the second
                   column's edge (owner, 8 Sep 2026 — the old four-column row
                   scattered text at three different alignments). */
                .sl-cat-grid {
                    display: grid;
                    grid-template-columns: 72px minmax(0, 1fr);
                    gap: 0 32px;
                    padding: 36px 18px;
                }
                .sl-cat-num {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 0.12em;
                    color: var(--color-primary-teal);
                    padding-top: 10px;
                }
                .sl-cat-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    text-decoration: none;
                    color: inherit;
                }
                .sl-cat-head { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
                .sl-cat-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: clamp(1.45rem, 1.1rem + 1.1vw, 2.1rem);
                    line-height: 1.1;
                    letter-spacing: -0.025em;
                    color: var(--color-text-charcoal);
                    margin: 0;
                    transition: color 0.3s ease;
                }
                .sl-cat-row:hover .sl-cat-title { color: var(--color-primary-deep); }
                .sl-cat-line {
                    font-family: var(--font-heading);
                    font-weight: 600;
                    font-size: 0.72rem;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: var(--color-text-grey);
                }
                .sl-cat-arrow {
                    flex: none;
                    color: var(--color-primary-teal);
                    opacity: 0.35;
                    transition: opacity 0.5s ease, transform 0.7s var(--ease-slow);
                }
                .sl-cat-row:hover .sl-cat-arrow { opacity: 1; transform: translate(4px, -4px) rotate(-45deg); }

                /* Treatments: one tidy dot-separated line that wraps, every item
                   the same size and colour, links underlined on hover. */
                .sl-cat-links {
                    list-style: none;
                    margin: 18px 0 0;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: baseline;
                    row-gap: 8px;
                }
                .sl-cat-links li { display: inline-flex; align-items: baseline; margin: 0; }
                .sl-cat-links li + li::before {
                    content: '·';
                    margin: 0 12px;
                    color: rgba(16,42,51,0.30);
                }
                .sl-treatment,
                .sl-treatment-link {
                    font-size: 0.95rem;
                    color: var(--color-text-slate);
                    line-height: 1.6;
                    text-decoration: none;
                    white-space: nowrap;
                }
                .sl-treatment-link { color: var(--color-primary-deep); transition: color 0.2s ease; }
                .sl-treatment-link:hover { color: var(--color-primary-teal); text-decoration: underline; text-underline-offset: 3px; }
                .sl-treatment-arrow {
                    display: inline-block;
                    vertical-align: baseline;
                    position: relative;
                    top: 2px;
                    opacity: 0.45;
                    margin-left: 2px;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }
                .sl-treatment-link:hover .sl-treatment-arrow { opacity: 1; transform: translate(1px, -1px); }

                /* ---------- FAQ ---------- */
                .sl-faq { margin-top: 96px; }
                .sl-faq-header { max-width: 700px; margin-bottom: 44px; }
                .sl-faq-lead {
                    font-size: var(--fs-lead);
                    color: var(--color-text-slate);
                    margin: 16px 0 0;
                    line-height: 1.65;
                }

                /* ---------- CTA ---------- */
                .sl-cta { text-align: center; margin-top: 96px; padding-bottom: 40px; }
                .sl-cta-action { margin-top: 32px; }

                @media (max-width: 1024px) {
                    .sl-hero { padding: 120px 0 8px; }
                    .sl-title { font-size: 2.2rem; }
                    .sl-lead { font-size: 1rem; }
                    .sl-directory { margin-top: 28px; }
                    /* Mobile: same single left edge — numeral, title, label and
                       links all hang off one line, one item per row for the
                       links so the hierarchy stays crisp on a narrow screen. */
                    .sl-cat-grid { grid-template-columns: 1fr; gap: 0; padding: 24px 4px; }
                    
                    .sl-cat-num { font-size: 0.72rem; padding-top: 8px; }
                    .sl-cat-title { font-size: 1.35rem; }
                    .sl-cat-line { font-size: 0.66rem; letter-spacing: 0.14em; }
                    .sl-cat-arrow { display: none; }
                    .sl-cat-links { margin-top: 12px; flex-direction: column; row-gap: 6px; }
                    .sl-cat-links li + li::before { content: none; }
                    .sl-treatment, .sl-treatment-link { font-size: 0.92rem; white-space: normal; }
                    .sl-faq { margin-top: 56px; }
                    .sl-faq-header { margin-bottom: 28px; }
                    .sl-cta { margin-top: 56px; }
                }
            `;

export const LOCATION_CSS = `
      .location-page .loc-section { padding: var(--space-section-lg) 0; } .location-page .loc-intro { padding-top: 170px; } .location-page .loc-narrow { max-width: 860px; } .location-page h1, .location-page .system-title { text-wrap: balance; } .location-page h1 { font-size: var(--fs-h1); line-height: 1.08; letter-spacing: -0.03em; margin: 0 0 20px; } .location-page .loc-intro-copy, .location-page .loc-section-desc { color: var(--color-text-slate); } .location-page .loc-intro-copy { max-width: 760px; margin: 0; font-size: var(--fs-lead); line-height: 1.65; } .location-page .system-title { margin-bottom: 16px; } .location-page .loc-section-desc { max-width: 760px; margin: 0; line-height: 1.7; } .location-page .loc-visit-details h3:first-child { margin-top: 8px; } .location-page .loc-about-grid, .location-page .loc-info-grid { display:grid; grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr); gap:clamp(40px,7vw,96px); align-items:start; } .location-page .loc-row-list { border-top:1px solid var(--hairline); } .location-page .loc-highlight, .location-page .loc-service { display:grid; gap:6px; padding:20px 0; border-bottom:1px solid var(--hairline); } .location-page .loc-service-text { display:grid; gap:6px; min-width:0; } .location-page .loc-highlight strong, .location-page .loc-service strong { font-family:var(--font-heading); font-weight:700; color:var(--color-text-charcoal); } .location-page .loc-highlight span, .location-page .loc-service span span { color:var(--color-text-slate); line-height:1.55; } .location-page .loc-services-list { margin-top:36px; } .location-page .loc-service { grid-template-columns:1fr auto; align-items:center; text-decoration:none; transition:background-color var(--ease-slow),padding var(--ease-slow); } .location-page .loc-service:hover { background:var(--color-tint-faint); padding-left:12px; padding-right:12px; } .location-page .loc-service svg { color:var(--color-primary-teal); } .location-page .loc-proof-quotes { display:grid; grid-template-columns:repeat(2,1fr); margin-top:36px; border-top:1px solid var(--hairline-strong); } .location-page .proof-quote { margin:0; padding:36px 32px 36px 0; border-right:1px solid var(--hairline-strong); } .location-page .proof-quote + .proof-quote { padding-left:32px; padding-right:0; border-right:0; } .location-page .proof-quote p { margin:14px 0 22px; color:var(--color-text-slate); line-height:1.65; } .location-page .proof-author { display:grid; gap:2px; color:var(--color-text-grey); font-size:.85rem; } .location-page .proof-author span:first-child { font-family:var(--font-heading); font-weight:700; color:var(--color-text-charcoal); } .location-page .loc-stars { display:flex; gap:2px; } .location-page .loc-review-link { display:inline-flex; align-items:center; gap:7px; margin-top:30px; } .location-page .loc-visit-details h3 { margin:0 0 14px; font-size:1.15rem; } .location-page .loc-visit-details > p { margin:0 0 22px; color:var(--color-text-slate); line-height:1.65; } .location-page .loc-visit-details h3:not(:first-child) { margin-top:38px; } .location-page .loc-direction-links { display:flex; flex-wrap:wrap; gap:18px; } .location-page .direction-link { display:inline-flex; align-items:center; gap:7px; } .location-page .loc-hours-list,.location-page .loc-parking-list { list-style:none; padding:0; margin:0; } .location-page .loc-hours-list { border-top:1px solid var(--hairline); } .location-page .loc-hours-list li { display:flex; justify-content:space-between; gap:20px; padding:13px 0; border-bottom:1px solid var(--hairline); color:var(--color-text-slate); } .location-page .loc-hours-list li span:first-child { font-family:var(--font-heading); font-weight:700; color:var(--color-text-charcoal); } .location-page .loc-parking-list { display:grid; gap:12px; color:var(--color-text-slate); } .location-page .loc-parking-list li { display:grid; grid-template-columns:15px 1fr; gap:9px; } .location-page .loc-parking-list li::before { content:'✓'; color:var(--color-primary-teal); font-weight:700; } .location-page .loc-map-wrapper { overflow:hidden; border-radius:26px; } .location-page .loc-map-wrapper iframe { display:block; border:0; } .location-page .faq-accordion { margin-top:32px; } .location-page .loc-closing { text-align:center; } .location-page .loc-closing .statement { margin:0 auto 18px; } .location-page .loc-closing p:not(.eyebrow) { max-width:620px; margin:0 auto; color:var(--color-text-slate); line-height:1.7; } .location-page .loc-closing-rule { display:block; width:64px; height:1px; background:var(--hairline-strong); margin:30px auto; } .location-page .loc-final-phone { margin-top:16px !important; font-size:.9375rem; }
      @media (max-width:1024px) { .location-page .loc-intro { padding-top:120px; } .location-page .loc-about-grid,.location-page .loc-info-grid { grid-template-columns:1fr; gap:40px; } } @media (max-width:700px) { .location-page .loc-proof-quotes { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:18px; padding-bottom:8px; } .location-page .proof-quote,.location-page .proof-quote + .proof-quote { flex:0 0 88%; scroll-snap-align:start; padding:26px 0; border-right:0; } .location-page .loc-hours-list li { align-items:flex-start; flex-direction:column; gap:2px; } .location-page .loc-map-wrapper iframe { height:300px; } } @media (max-width:480px) { .location-page .loc-section { padding:56px 0; } .location-page .loc-intro { padding-top:112px; } .location-page .loc-proof-quotes { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:18px; padding-bottom:8px; } .location-page .proof-quote,.location-page .proof-quote + .proof-quote { flex:0 0 88%; scroll-snap-align:start; padding:26px 0; border-right:0; } .location-page .loc-hours-list li { align-items:flex-start; flex-direction:column; gap:2px; } }
    `;
