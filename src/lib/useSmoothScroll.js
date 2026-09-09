import { useEffect, useRef } from 'react';

/**
 * Lenis smooth scrolling.
 *
 * This is the single change that most alters how the whole site *feels* under a
 * wheel or a trackpad: scroll gains inertia and weight, so the reveal
 * animations land on a beat instead of snapping into place mid-flick.
 *
 * Deliberately narrow:
 *  - Pointer devices only. Touch scrolling on iOS/Android already has native
 *    momentum that is better tuned than anything we can ship, and hijacking it
 *    is the fastest way to make a phone feel broken. `smoothWheel` alone leaves
 *    touch entirely alone.
 *  - Off under `prefers-reduced-motion`. Smooth scrolling is exactly the class
 *    of motion that setting exists to disable.
 *  - Off during SSR/prerender — Lenis touches `window` on construction.
 *
 * Returns a ref holding the instance so callers can jump without animating
 * (route changes must not "scroll" a whole page's worth of inertia).
 */
export function useSmoothScroll() {
    const lenisRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarse = window.matchMedia('(pointer: coarse)').matches;
        if (reduced || coarse) return;

        let raf = null;
        let lenis = null;
        let cancelled = false;

        // Code-split: no phone or reduced-motion visitor ever downloads it.
        import('lenis').then(({ default: Lenis }) => {
            if (cancelled) return;

            lenis = new Lenis({
                // ~1.05s to settle. Slower than the default 1.2 "feels" luxurious
                // but starts to read as laggy when clicking through nav links.
                duration: 1.05,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 1,
                wheelMultiplier: 1,
            });
            lenisRef.current = lenis;

            const loop = (time) => {
                lenis.raf(time);
                raf = window.requestAnimationFrame(loop);
            };
            raf = window.requestAnimationFrame(loop);
        });

        return () => {
            cancelled = true;
            if (raf !== null) window.cancelAnimationFrame(raf);
            if (lenis) lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return lenisRef;
}
