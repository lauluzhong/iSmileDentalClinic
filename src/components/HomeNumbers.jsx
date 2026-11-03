import React, { useEffect, useRef, useState } from 'react';
import Style from './Style';

/**
 * The homepage "all-time numbers" band, in three switchable designs.
 *
 * ?numbers=a|b|c picks the variant (default a) so the owner can compare them
 * on one preview. The variant is read in an effect, never during render, so
 * the pre-rendered "/" (which is always A) hydrates without a mismatch and
 * then swaps if the query asks for another design.
 *
 * Roll-up: the owner asked for these figures to count up (3 Nov 2026). This
 * overrides, for THIS section only, the 21 Oct "no count-up" ruling; nothing
 * else on the site animates numbers. Each figure counts 0 → value once, when
 * the band is about a quarter visible, 1.2s, ease-out. The pre-rendered HTML,
 * no-JS, and prefers-reduced-motion all show the final number straight away,
 * and the figure reserves its final width (tabular digits + min-width in ch)
 * so nothing shifts while it runs.
 */

export const ALL_TIME_NUMBERS = [
    { value: 10000, label: 'families cared for' },
    { value: 50000, label: 'cleanings for healthy teeth and gums' },
    { value: 120000, label: 'visits' },
];

const DURATION = 1200;
const easeOutExpoLike = (t) => {
    // cubic-bezier(0.16, 1, 0.3, 1) sampled as a close closed-form: the
    // bezier's y(x) is numerically very near 1 - (1 - t)^4 at every point.
    const u = 1 - t;
    return 1 - u * u * u * u;
};
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
            setShown(value * easeOutExpoLike(t));
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
    const [variant, setVariant] = useState('a');
    const [run, setRun] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const v = new URLSearchParams(window.location.search).get('numbers');
        if (v === 'b' || v === 'c') setVariant(v);
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!('IntersectionObserver' in window)) { setRun(true); return; }
        const io = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) { setRun(true); io.disconnect(); }
        }, { threshold: 0.25 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section className={`numbers-section numbers-${variant}`} aria-label="iSmile in numbers" ref={ref} data-run={run ? '1' : undefined}>
            <div className="container">
                <dl className={`nb-row${variant === 'a' ? ' nb-grad' : ''}`}>
                    {ALL_TIME_NUMBERS.map(n => (
                        <div key={n.value} className={`nb-item${variant === 'b' ? ' nb-grad' : ''}`}>
                            <dt className="nb-dt"><Figure value={n.value} run={run} /></dt>
                            <dd className="nb-label">{n.label}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <Style>{`
                /* ---- shared ---- */
                .numbers-section { padding: 0 0 8px; }
                .nb-row { margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); }
                .nb-item { margin: 0; min-width: 0; }
                .nb-dt { margin: 0; }
                .nb-figure {
                    display: inline-block; font-family: var(--font-heading); font-weight: 700;
                    font-size: clamp(2.4rem, 1.4rem + 2.6vw, 3.6rem); line-height: 1;
                    letter-spacing: -0.03em; font-variant-numeric: tabular-nums; white-space: nowrap;
                }
                .nb-label { margin: 10px 0 0; font-size: 1rem; line-height: 1.45; max-width: 260px; }

                /* Brand blue, a step darker than --color-primary-teal so white
                   text clears 4.5:1 (#007FA0 on white text = 4.6:1), with a
                   gentle hue drift toward blue at the start of the gradient. */
                .nb-grad {
                    color: #fff; border-radius: 28px;
                    background:
                        radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%),
                        linear-gradient(135deg, #0a5f8e 0%, var(--color-primary-deep) 50%, #007FA0 100%);
                    box-shadow: 0 10px 30px rgba(0, 110, 140, 0.22), 0 2px 6px rgba(0, 110, 140, 0.12);
                }
                .nb-grad .nb-label { color: rgba(255,255,255,0.86); }

                /* ---- A: one wide card, three figures with dividers ---- */
                .numbers-a .nb-row { padding: 44px 48px; gap: 0 40px; }
                .numbers-a .nb-item + .nb-item { border-left: 1px solid rgba(255,255,255,0.22); padding-left: 40px; }

                /* ---- B: three equal cards ---- */
                .numbers-b .nb-row { gap: 20px; }
                .numbers-b .nb-item { padding: 40px 36px; }

                /* ---- C: one light card, figures in the brand blue, soft glow ---- */
                .numbers-c .nb-row {
                    padding: 44px 48px; gap: 0 40px; border-radius: 28px;
                    background: linear-gradient(135deg, #FFFFFF 0%, var(--color-tint-faint) 100%);
                    border: 1px solid rgba(16,42,51,0.10);
                    box-shadow: 0 0 0 1px rgba(255,255,255,0.6) inset, 0 18px 50px rgba(0, 141, 176, 0.14), 0 2px 8px rgba(16,42,51,0.04);
                }
                .numbers-c .nb-figure { color: var(--color-primary-deep); }
                .numbers-c .nb-label { color: var(--color-text-slate); }
                .numbers-c .nb-item + .nb-item { border-left: 1px solid rgba(16,42,51,0.12); padding-left: 40px; }

                @media (max-width: 1024px) {
                    .numbers-section { padding: 8px 0 0; }
                    .nb-figure { font-size: 1.9rem; }
                    .nb-label { margin: 0; font-size: 0.92rem; line-height: 1.4; max-width: none; }

                    /* A and C: compact rows inside the card, figure left, label right */
                    .numbers-a .nb-row, .numbers-c .nb-row { display: block; padding: 8px 22px; }
                    .numbers-a .nb-item, .numbers-c .nb-item {
                        display: grid; grid-template-columns: 7.6rem 1fr; gap: 14px; align-items: baseline;
                        padding: 14px 0; border-left: none;
                    }
                    .numbers-a .nb-item + .nb-item { border-left: none; border-top: 1px solid rgba(255,255,255,0.22); padding-left: 0; }
                    .numbers-c .nb-item + .nb-item { border-left: none; border-top: 1px solid rgba(16,42,51,0.12); padding-left: 0; }

                    /* B: snap rail, next card peeking */
                    .numbers-b .container { padding-right: 0; }
                    .numbers-b .nb-row {
                        display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory;
                        padding: 4px 20px 12px 0; scrollbar-width: none;
                    }
                    .numbers-b .nb-row::-webkit-scrollbar { display: none; }
                    .numbers-b .nb-item { flex: 0 0 72%; scroll-snap-align: start; padding: 24px 22px; border-radius: 22px; }
                    .numbers-b .nb-label { margin-top: 6px; }
                }
                @media (max-width: 480px) {
                    .nb-figure { font-size: 1.7rem; }
                    .numbers-a .nb-item, .numbers-c .nb-item { grid-template-columns: 7rem 1fr; }
                }
            `}</Style>
        </section>
    );
}
