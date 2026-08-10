import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { enrichEvent } from '../lib/attribution';
import { resolvePrompt, isSuppressedPath, whatsappUrl } from '../data/ctaPrompts';
import Style from './Style';

/**
 * Contextual CTA prompt.
 *
 * Two different things wear the same clothes here, because the two devices
 * behave differently and Google treats them differently:
 *
 *  - DESKTOP is a true exit intent modal (cursor leaves through the top of the
 *    viewport). Google has confirmed exit triggered dialogs are outside the
 *    intrusive interstitial rules, and the mobile interstitial penalty does not
 *    apply to desktop results at all.
 *
 *  - MOBILE has no cursor, so there is no honest exit signal. Back button
 *    hijacking is unreliable and feels hostile, so we do not attempt it.
 *    Instead the mobile variant is engagement triggered (scrolled past half the
 *    page AND dwelled), and it is a compact bottom sheet, not an overlay: no
 *    backdrop, no scroll lock, and it stays inside the 25 percent of screen that
 *    Google's guidance treats as a reasonable amount of space. It can never
 *    appear on the initial view of a page arrived at from search.
 *
 * The offer is a WhatsApp conversation rather than a discount. WhatsApp is where
 * Malaysian patients are already willing to talk, and the existing booking form
 * loses roughly 43 percent of the people who open it.
 */

const SEEN_KEY = 'ismile_cta_prompt_seen';
const SNOOZE_KEY = 'ismile_cta_prompt_snooze';

const DAY_MS = 24 * 60 * 60 * 1000;
const SNOOZE_AFTER_DISMISS_DAYS = 30;
const SNOOZE_AFTER_ENGAGE_DAYS = 90;

/*
 * Timings, and where they come from (2025 popup benchmark data — Wisepops 1B
 * displays, Popupsmart 10k campaigns):
 *
 *  - Time-triggered popups convert best in the 6–15s window (~6%+) and fall
 *    off a cliff past 20s (21–30s ≈ 1.5%) — mostly because visitors leave
 *    before the popup ever fires. Our desktop trigger is exit intent, so the
 *    dwell here is only an arming guard against accidental top-edge exits
 *    seconds after landing; 8s sits at the top of the sweet spot.
 *  - The reviews page arms at 12s (owner decision): visitors there are doing
 *    quiet due-diligence, so the prompt holds back a little longer — but stays
 *    inside the 6-15s window the benchmark data favours.
 *  - Mobile fires on engagement, not exit. Scroll-triggered popups convert
 *    ~5.4% with the recommended firing band at 50–70% depth — we gate at 50%.
 *    The dwell floor is 12s, not 20s: past-20s triggers underperform for the
 *    same leave-before-it-fires reason, and the scroll gate already filters
 *    out skimmers, so a long dwell adds little and costs fires.
 */
const DESKTOP_MIN_DWELL_MS = 8000;
const REVIEWS_MIN_DWELL_MS = 12000;
const MOBILE_MIN_DWELL_MS = 12000;
const MOBILE_MIN_SCROLL_FRACTION = 0.5;
const ENGAGEMENT_POLL_MS = 800;
const ROUTE_SETTLE_MS = 3000;

const MOBILE_QUERY = '(max-width: 1024px)';

const WhatsAppIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5 13.9c-.2.6-1.2 1.1-1.7 1.2-.4 0-.9.2-3.1-.7-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.7s.6-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.7 1.8.8 1.9c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3 0 .1 0 .5-.2.9z" />
    </svg>
);

/** localStorage/sessionStorage are unavailable in some privacy modes. */
const safeGet = (store, key) => {
    try {
        return store.getItem(key);
    } catch {
        return null;
    }
};
const safeSet = (store, key, value) => {
    try {
        store.setItem(key, value);
    } catch {
        /* quota or blocked storage; the prompt simply repeats next session */
    }
};

/** ?cta=preview forces the prompt open and leaves no trace in storage. */
const isPreviewMode = () =>
    new URLSearchParams(window.location.search).get('cta') === 'preview';

const isSnoozed = () => {
    const until = Number(safeGet(window.localStorage, SNOOZE_KEY) || 0);
    return Number.isFinite(until) && until > Date.now();
};

const snoozeFor = (days) =>
    safeSet(window.localStorage, SNOOZE_KEY, String(Date.now() + days * DAY_MS));

const CtaPrompt = () => {
    const { pathname } = useLocation();
    const { isBookingOpen, openBooking, setPromptOpen } = useBooking();

    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [copy, setCopy] = useState(null);

    const firedRef = useRef(false);
    const panelRef = useRef(null);
    const restoreFocusRef = useRef(null);
    const shownPathRef = useRef(null);

    const track = useCallback((event, payload = {}) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(
            enrichEvent(
                {
                    event,
                    cta_prompt_page: window.location.pathname,
                    cta_prompt_variant: copy?.id || 'unknown',
                    cta_prompt_device: isMobile ? 'mobile' : 'desktop',
                    ...payload
                },
                'cta-prompt'
            )
        );
    }, [copy, isMobile]);

    /* Track the viewport tier so the same component can render either variant. */
    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const sync = () => setIsMobile(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    const show = useCallback(() => {
        if (firedRef.current) return;
        firedRef.current = true;
        restoreFocusRef.current = document.activeElement;
        shownPathRef.current = window.location.pathname;
        setCopy(resolvePrompt(window.location.pathname));
        setVisible(true);
        if (!isPreviewMode()) safeSet(window.sessionStorage, SEEN_KEY, '1');
    }, []);

    const close = useCallback((reason) => {
        setVisible(false);
        setPromptOpen(false);
        if (!isPreviewMode()) {
            if (reason === 'dismissed') snoozeFor(SNOOZE_AFTER_DISMISS_DAYS);
            if (reason === 'engaged') snoozeFor(SNOOZE_AFTER_ENGAGE_DAYS);
        }
        const el = restoreFocusRef.current;
        if (el && el.isConnected && typeof el.focus === 'function') el.focus();
    }, [setPromptOpen]);

    /* The mobile sheet does not block the page, so a visitor can navigate while
       it is open. The copy belongs to the page it opened on, so retire it rather
       than let it sit there talking about the previous page. Not a dismissal:
       it earns no snooze, and the once per session rule still holds. */
    useEffect(() => {
        if (!visible) return;
        if (shownPathRef.current && shownPathRef.current !== pathname) close('route-change');
    }, [pathname, visible, close]);

    /* Arm the triggers. Re-runs on route change so a suppressed page disarms. */
    useEffect(() => {
        if (visible) return undefined;
        // Checked ahead of the preview hatch on purpose: previewing a suppressed
        // page should show nothing, because that is what a visitor gets.
        if (isSuppressedPath(pathname)) return undefined;

        const params = new URLSearchParams(window.location.search);

        // ?cta=preview shows this page's prompt straight away and skips the
        // timing and frequency rules, so the copy can be reviewed page by page.
        // It has to be checked before firedRef so it still works after a route
        // change, and it deliberately writes nothing to storage.
        if (params.get('cta') === 'preview') {
            firedRef.current = false;
            const t = setTimeout(show, 400);
            return () => clearTimeout(t);
        }

        if (firedRef.current) return undefined;
        if (isBookingOpen) return undefined;
        if (safeGet(window.sessionStorage, SEEN_KEY)) return undefined;
        if (isSnoozed()) return undefined;
        // Escape hatch for the owner, staff and QA.
        if (params.has('nocta')) return undefined;

        const timers = [];
        let disposed = false;
        const cleanups = [];

        const scrollFraction = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            // A page with nothing to scroll counts as fully read, so dwell alone
            // decides. Otherwise short pages could never reach the threshold.
            if (scrollable <= 0) return 1;
            return window.scrollY / scrollable;
        };

        // Never fire in the moments right after a navigation.
        timers.push(setTimeout(() => {
            if (disposed) return;

            if (isMobile) {
                // Polled rather than driven by the scroll event, for two reasons.
                // A high water mark means someone who reads to the bottom and
                // scrolls back up still counts as engaged, and firing between
                // gestures rather than in the middle of one is far less jarring
                // than a sheet appearing under a moving thumb.
                const startedAt = Date.now();
                let deepest = 0;

                const tick = () => {
                    deepest = Math.max(deepest, scrollFraction());
                    if (Date.now() - startedAt < MOBILE_MIN_DWELL_MS) return;
                    if (deepest < MOBILE_MIN_SCROLL_FRACTION) return;
                    clearInterval(poll);
                    show();
                };

                const poll = setInterval(tick, ENGAGEMENT_POLL_MS);
                cleanups.push(() => clearInterval(poll));
            } else {
                const armDelay = pathname === '/reviews'
                    ? REVIEWS_MIN_DWELL_MS
                    : DESKTOP_MIN_DWELL_MS;
                timers.push(setTimeout(() => {
                    if (disposed) return;
                    const onMouseOut = (e) => {
                        // Cursor left through the top edge, towards the tabs and
                        // the address bar, and not into a child element.
                        if (e.clientY > 0 || e.relatedTarget) return;
                        show();
                    };
                    document.addEventListener('mouseout', onMouseOut);
                    cleanups.push(() => document.removeEventListener('mouseout', onMouseOut));
                }, armDelay));
            }
        }, ROUTE_SETTLE_MS));

        return () => {
            disposed = true;
            timers.forEach(clearTimeout);
            cleanups.forEach((fn) => fn());
        };
    }, [pathname, isMobile, isBookingOpen, visible, show]);

    /* Fire the impression once the copy is settled, and mark the overlay open. */
    useEffect(() => {
        if (!visible || !copy) return;
        setPromptOpen(true);
        track('cta_prompt_shown');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, copy]);

    /* Escape closes both variants; the desktop variant also traps focus. */
    useEffect(() => {
        if (!visible) return undefined;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                track('cta_prompt_dismissed', { cta_prompt_dismiss_method: 'escape' });
                close('dismissed');
                return;
            }
            if (e.key !== 'Tab' || isMobile || !panelRef.current) return;
            const focusable = panelRef.current.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        const focusTimer = setTimeout(() => panelRef.current?.focus(), 60);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            clearTimeout(focusTimer);
        };
    }, [visible, isMobile, close, track]);

    /* If the booking modal opens from anywhere, get out of its way. */
    useEffect(() => {
        if (isBookingOpen && visible) close('engaged');
    }, [isBookingOpen, visible, close]);

    if (!visible || !copy) return null;

    const onWhatsApp = () => {
        // The global wa.me listener in App.jsx records the whatsapp_click; this
        // is the prompt specific companion event so the two are not conflated.
        track('cta_prompt_engaged', { cta_prompt_action: 'whatsapp' });
        close('engaged');
    };

    const onCallback = () => {
        track('cta_prompt_engaged', { cta_prompt_action: 'callback_form' });
        close('engaged');
        openBooking('', 'cta-prompt');
    };

    const onDismiss = (method) => {
        track('cta_prompt_dismissed', { cta_prompt_dismiss_method: method });
        close('dismissed');
    };

    const panel = (
        <div
            className={`cta-prompt-panel ${isMobile ? 'is-sheet' : 'is-card'}`}
            role="dialog"
            aria-modal={isMobile ? undefined : 'true'}
            aria-labelledby="cta-prompt-title"
            tabIndex={-1}
            ref={panelRef}
        >
            <button
                type="button"
                className="cta-prompt-close"
                aria-label="Close"
                onClick={() => onDismiss('close_button')}
            >
                <X size={18} aria-hidden="true" />
            </button>

            <h2 className="cta-prompt-title" id="cta-prompt-title">{copy.title}</h2>
            <p className="cta-prompt-body">{copy.body}</p>

            <a
                className="cta-prompt-action"
                href={whatsappUrl(copy.message)}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-click="cta-prompt"
                onClick={onWhatsApp}
            >
                <WhatsAppIcon /> {copy.action}
            </a>

            <button type="button" className="cta-prompt-secondary" onClick={onCallback}>
                Prefer we call you back? Leave your details
            </button>
        </div>
    );

    return (
        <div className={`cta-prompt ${isMobile ? 'cta-prompt-mobile' : 'cta-prompt-desktop'}`}>
            {/* Desktop only. The mobile variant never dims or blocks the page,
                which is what keeps it clear of the intrusive interstitial rules. */}
            {!isMobile && (
                <div
                    className="cta-prompt-backdrop"
                    onClick={() => onDismiss('backdrop')}
                    aria-hidden="true"
                />
            )}
            {panel}

            <Style>{`
                .cta-prompt-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 2000;
                    background: rgba(16, 42, 51, 0.42);
                    backdrop-filter: blur(2px);
                    -webkit-backdrop-filter: blur(2px);
                    animation: ctaPromptFade 220ms ease-out both;
                }

                .cta-prompt-panel {
                    position: fixed;
                    z-index: 2001;
                    background: #fff;
                    border: 1px solid rgba(16, 42, 51, 0.08);
                    box-shadow: 0 18px 48px rgba(16, 42, 51, 0.22);
                    outline: none;
                }

                .cta-prompt-panel.is-card {
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: min(460px, calc(100vw - 48px));
                    padding: 34px 34px 28px;
                    border-radius: 22px;
                    text-align: center;
                    animation: ctaPromptCardIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                /* Bottom sheet. Sized to stay inside roughly a quarter of a
                   phone screen so it reads as a banner, not an interstitial. */
                .cta-prompt-panel.is-sheet {
                    left: 8px;
                    right: 8px;
                    bottom: calc(8px + env(safe-area-inset-bottom));
                    padding: 14px 16px 10px;
                    border-radius: 22px;
                    max-height: 30vh;
                    overflow-y: auto;
                    animation: ctaPromptSheetIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .cta-prompt-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 34px;
                    height: 34px;
                    border: none;
                    border-radius: 50%;
                    background: transparent;
                    color: var(--color-text-grey);
                    cursor: pointer;
                    -webkit-tap-highlight-color: transparent;
                }
                .cta-prompt-close:hover {
                    background: rgba(16, 42, 51, 0.06);
                    color: var(--color-text-charcoal);
                }

                .cta-prompt-title {
                    font-family: var(--font-heading);
                    font-weight: 600;
                    color: var(--color-text-charcoal);
                    margin: 0 0 8px;
                }
                .is-card .cta-prompt-title {
                    font-size: 1.5rem;
                    line-height: 1.25;
                    padding: 0 12px;
                }
                .is-sheet .cta-prompt-title {
                    font-size: 1.0625rem;
                    line-height: 1.28;
                    margin-bottom: 5px;
                    padding-right: 34px;
                }

                .cta-prompt-body {
                    font-family: var(--font-body);
                    color: var(--color-text-slate);
                    margin: 0 0 18px;
                }
                .is-card .cta-prompt-body {
                    font-size: 1rem;
                    line-height: 1.55;
                }
                /* 15px rather than the site's 16px mobile floor: this is a
                   compact banner and the extra pixel costs a whole line of
                   height, which matters more here than anywhere else. */
                .is-sheet .cta-prompt-body {
                    font-size: 0.9375rem;
                    line-height: 1.4;
                    margin-bottom: 10px;
                    padding-right: 34px;
                }

                .cta-prompt-action {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    width: 100%;
                    font-family: var(--font-heading);
                    font-weight: 600;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 999px;
                    background: linear-gradient(135deg, var(--color-primary-deep) 0%, var(--color-primary-teal) 100%);
                    box-shadow: 0 8px 22px rgba(0, 141, 176, 0.3);
                    -webkit-tap-highlight-color: transparent;
                }
                .is-card .cta-prompt-action {
                    font-size: 1.0625rem;
                    padding: 15px 20px;
                }
                .is-sheet .cta-prompt-action {
                    font-size: 1rem;
                    padding: 12px 20px;
                }

                .cta-prompt-secondary {
                    display: block;
                    width: 100%;
                    margin-top: 12px;
                    padding: 4px 0;
                    border: none;
                    background: none;
                    font-family: var(--font-body);
                    font-size: 0.8125rem;
                    color: var(--color-text-grey);
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    cursor: pointer;
                }
                .cta-prompt-secondary:hover {
                    color: var(--color-primary-teal);
                }
                .is-sheet .cta-prompt-secondary {
                    margin-top: 6px;
                    padding: 2px 0;
                }

                @keyframes ctaPromptFade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ctaPromptCardIn {
                    from { opacity: 0; transform: translate(-50%, -46%) scale(0.97); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes ctaPromptSheetIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .cta-prompt-backdrop,
                    .cta-prompt-panel.is-card,
                    .cta-prompt-panel.is-sheet {
                        animation: none;
                    }
                }
            `}</Style>
        </div>
    );
};

export default CtaPrompt;
