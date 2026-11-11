import React, { useEffect, useRef, useState } from 'react';
import Style from './Style';

/**
 * The homepage "all-time numbers" card: one wide, very light blue-tinted
 * card holding three figures in the brand's deep blue (owner, 3 Nov 2026:
 * the only dark-blue filled thing on screen should be the Book a Visit CTA).
 *
 * Roll-up: the owner asked for these figures to count up. This overrides,
 * for THIS section only, the 21 Oct "no count-up" ruling; nothing else on
 * the site animates numbers. Each figure counts 0 → value once, as soon as
 * the card starts entering view (10% visible), 1.8s, cubic ease-out. The
 * pre-rendered HTML, no-JS, and prefers-reduced-motion all show the final
 * number straight away, and the figure reserves its final width (tabular
 * digits + min-width in ch) so nothing shifts while it runs.
 *
 * Phones: the same card, the three numbers stacked top to bottom, figure
 * above its label, so every label stays on one line from 360px up.
 */

export const ALL_TIME_NUMBERS = [
    { value: 10000, label: 'families cared for' },
    { value: 50000, label: 'mouths cleaned' },
    { value: 120000, label: 'visits and counting' },
];

// Same curve and feel as the owner's locum calculator (tool/v2.html countUp):
// cubic ease-out, so the figure visibly rolls rather than landing early.
const DURATION = 1800;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const fmt = (n) => Math.round(n).toLocaleString('en-US') + '+';

function Figure({ value, run }) {
    const [shown, setShown] = useState(value); // SSR + first client paint = final number
    const [lockedWidth, setLockedWidth] = useState(null);
    const started = useRef(false);
    const spanRef = useRef(null);

    useEffect(() => {
        if (!run || started.current) return;
        started.current = true;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let frame, cancelled = false;
        const start = () => {
            if (cancelled) return;
            // Belt and braces beside tabular-nums: measure the box at its final
            // string (what is on screen right now, in the loaded heading face)
            // and lock it for the roll-up.
            if (spanRef.current) setLockedWidth(Math.ceil(spanRef.current.getBoundingClientRect().width));
            const t0 = performance.now();
            const tick = (now) => {
                const t = Math.min(1, (now - t0) / DURATION);
                setShown(value * easeOut(t));
                if (t < 1) frame = requestAnimationFrame(tick);
            };
            setShown(0);
            frame = requestAnimationFrame(tick);
        };
        // Force the heading web font in before measuring, so the locked width
        // is the real one and not the fallback face's (the card can be in
        // view before Outfit arrives; fonts.status alone reads "loaded" then).
        if (document.fonts && document.fonts.load && spanRef.current) {
            const cs = getComputedStyle(spanRef.current);
            document.fonts.load(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`).then(start, start);
        } else start();
        return () => { cancelled = true; cancelAnimationFrame(frame); };
    }, [run, value]);

    return (
        <span
            ref={spanRef}
            className="nb-figure"
            style={lockedWidth ? { width: lockedWidth } : { minWidth: `${fmt(value).length}ch` }}
        >
            {fmt(shown)}
        </span>
    );
}

export default function HomeNumbers() {
    const [run, setRun] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!('IntersectionObserver' in window)) { setRun(true); return; }
        const io = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) { setRun(true); io.disconnect(); }
        }, { threshold: 0.1 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section className="numbers-section" aria-label="iSmile in numbers" ref={ref} data-run={run ? '1' : undefined}>
            <div className="container">
                <dl className="nb-card">
                    {ALL_TIME_NUMBERS.map(n => (
                        <div key={n.value} className="nb-item">
                            <dt className="nb-dt"><Figure value={n.value} run={run} /></dt>
                            <dd className="nb-label">{n.label}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <Style>{`
                .numbers-section { padding: 0 0 8px; }
                /* Near-white, clearly blue: --color-tint-faint drifting to a
                   faint cyan-blue. Figures in the deep brand blue (6.0:1 on the
                   tint), labels in slate (7.5:1). No outline: a soft, diffuse teal shadow defines the card. */
                .nb-card {
                    margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 32px;
                    padding: 44px 48px; border-radius: 28px;
                    background: linear-gradient(135deg, var(--color-tint-faint) 0%, #E9F6FB 100%);
                    box-shadow: 0 12px 40px rgba(0, 110, 140, 0.10), 0 2px 8px rgba(0, 110, 140, 0.05);
                }
                .nb-item { margin: 0; min-width: 0; }
                .nb-item + .nb-item { border-left: 1px solid rgba(0, 141, 176, 0.12); padding-left: 32px; }
                .nb-dt { margin: 0; }
                .nb-figure {
                    display: inline-block; font-family: var(--font-heading); font-weight: 700;
                    font-size: clamp(2.4rem, 1.4rem + 2.6vw, 3.6rem); line-height: 1;
                    letter-spacing: -0.03em; font-variant-numeric: tabular-nums; white-space: nowrap;
                    color: var(--color-primary-deep);
                }
                /* Labels in the site's accent serif italic (the headline-accent face). */
                .nb-label {
                    margin: 12px 0 0; font-family: var(--font-accent); font-style: italic; font-weight: 400;
                    font-size: 1.2rem; line-height: 1.4; color: var(--color-text-slate); white-space: nowrap;
                }

                @media (max-width: 1024px) {
                    /* 32px hero bottom padding + 24 here = the 56px section rhythm */
                    .numbers-section { padding: 24px 0 0; }
                    .nb-card { display: block; padding: 8px 24px; }
                    .nb-item { padding: 16px 0; }
                    .nb-item + .nb-item { border-left: none; border-top: 1px solid rgba(0, 141, 176, 0.12); padding-left: 0; }
                    .nb-figure { font-size: 2.2rem; }
                    .nb-label { margin-top: 6px; font-size: 1.15rem; }
                }
            `}</Style>
        </section>
    );
}
