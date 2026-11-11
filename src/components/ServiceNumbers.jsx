import React from 'react';
import Style from './Style';

/**
 * One (or a few) static all-time figures under a service page's lead.
 *
 * Owner-approved, rounded-up numbers from Marketing-numbers/ALL-TIME-NUMBERS.md.
 * Each line is a full sentence whose first token is the figure, e.g.
 * "600+ people have straightened their teeth with us". The figure is split off
 * at render time and set in the heading face; the words stay byte-identical.
 *
 * Rulings honoured: static (no count-up), no eyebrow, no card, no CTA.
 */
const split = (line) => {
    const i = line.indexOf(' ');
    return i === -1 ? [line, ''] : [line.slice(0, i), line.slice(i)];
};

export default function ServiceNumbers({ lines = [], className = '' }) {
    const list = lines.filter(Boolean);
    if (!list.length) return null;
    return (
        <>
        <ul className={`svc-numbers ${className}`.trim()}>
            {list.map((line) => {
                const [figure, rest] = split(line);
                return (
                    <li key={line} className="svc-number">
                        <span className="svc-number-rule" aria-hidden="true" />
                        <span className="svc-number-text">
                            <strong className="svc-number-figure">{figure}</strong>{rest}
                        </span>
                    </li>
                );
            })}
        </ul>
            <Style>{`
                .svc-numbers { list-style: none; margin: 24px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
                .svc-number { display: flex; align-items: baseline; gap: 14px; margin: 0; }
                .svc-number-rule { width: 34px; height: 1px; background: rgba(16,42,51,0.25); flex: none; align-self: center; }
                .svc-number-text { font-size: 0.98rem; line-height: 1.5; color: var(--color-text-slate); }
                .svc-number-figure { font-family: var(--font-heading); font-weight: 700; font-size: 1.35rem; color: var(--color-text-charcoal); letter-spacing: -0.02em; margin-right: 2px; font-variant-numeric: tabular-nums; }
                @media (max-width: 1024px) {
                    .svc-numbers { margin-top: 18px; gap: 10px; }
                    .svc-number-text { font-size: 0.92rem; }
                    .svc-number-figure { font-size: 1.2rem; }
                }
            `}</Style>
        </>
    );
}
