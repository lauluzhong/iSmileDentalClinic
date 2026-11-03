import React, { useEffect, useRef, useState } from 'react';
import Style from './Style';

/**
 * The homepage "all-time numbers" card: one wide brand-blue gradient card
 * holding three figures (the owner's pick, 3 Nov 2026, from three options).
 *
 * Roll-up: the owner asked for these figures to count up. This overrides,
 * for THIS section only, the 21 Oct "no count-up" ruling; nothing else on
 * the site animates numbers. Each figure counts 0 → value once, as soon as
 * the card starts entering view (10% visible), 1.2s, ease-out. The
 * pre-rendered HTML, no-JS, and prefers-reduced-motion all show the final
 * number straight away, and the figure reserves its final width (tabular
 * digits + min-width in ch) so nothing shifts while it runs.
 *
 * Phones: the same card, the three numbers stacked top to bottom, figure
 * above its label, so every label stays on one line from 360px up.
 */

export const ALL_TIME_NUMBERS = [
    { value: 10000, label: 'families cared for' },
    { value: 50000, label: 'check-ups & cleanings' },
    { value: 120000, label: 'visits and counting' },
];

const DURATION = 1200;
// cubic-bezier(0.16, 1, 0.3, 1) sampled: y(x) sits numerically on 1 - (1 - t)^4.
const easeOut = (t) => { const u = 1 - t; return 1 - u * u * u * u; };
const fmt = (n) => Math.round(n).toLocaleString('en-US') + '+';

function Figure({ value, run }) {
    const [shown, setShown] = useState(value); // SSR + first client paint = final number
    const started = useRef(false);

    useEffect(() => {
        if (!run || started.current) return;
        started.current = true;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let frame;
        const t0 = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - t0) / DURATION);
            setShown(value * easeOut(t));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        setShown(0);
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [run, value]);

    return (
        <span className="nb-figure" style={{ minWidth: `${fmt(value).length}ch` }}>
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
                /* Brand blue, a step darker than --color-primary-teal so white
                   text clears 4.5:1 (white on #007FA0 = 4.6:1), with a gentle
                   hue drift toward blue at the start of the gradient. */
                .nb-card {
                    margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 40px;
                    padding: 44px 48px; color: #fff; border-radius: 28px;
                    background:
                        radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%),
                        linear-gradient(135deg, #0a5f8e 0%, var(--color-primary-deep) 50%, #007FA0 100%);
                    box-shadow: 0 10px 30px rgba(0, 110, 140, 0.22), 0 2px 6px rgba(0, 110, 140, 0.12);
                }
                .nb-item { margin: 0; min-width: 0; }
                .nb-item + .nb-item { border-left: 1px solid rgba(255,255,255,0.22); padding-left: 40px; }
                .nb-dt { margin: 0; }
                .nb-figure {
                    display: inline-block; font-family: var(--font-heading); font-weight: 700;
                    font-size: clamp(2.4rem, 1.4rem + 2.6vw, 3.6rem); line-height: 1;
                    letter-spacing: -0.03em; font-variant-numeric: tabular-nums; white-space: nowrap;
                }
                .nb-label {
                    margin: 12px 0 0; font-size: 1.1rem; font-weight: 500; line-height: 1.4;
                    color: rgba(255,255,255,0.9); white-space: nowrap;
                }

                @media (max-width: 1024px) {
                    .numbers-section { padding: 8px 0 0; }
                    .nb-card { display: block; padding: 6px 24px; }
                    .nb-item { padding: 18px 0; }
                    .nb-item + .nb-item { border-left: none; border-top: 1px solid rgba(255,255,255,0.22); padding-left: 0; }
                    .nb-figure { font-size: 2.2rem; }
                    .nb-label { margin-top: 6px; font-size: 1.0625rem; }
                }
            `}</Style>
        </section>
    );
}
