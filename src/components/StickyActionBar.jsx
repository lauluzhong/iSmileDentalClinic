import React from 'react';
import { Phone } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { enrichEvent } from '../lib/attribution';

const PHONE_NUMBER = '+60163222135';
const WHATSAPP_URL = 'https://wa.me/60163222135';

const WhatsAppIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5 13.9c-.2.6-1.2 1.1-1.7 1.2-.4 0-.9.2-3.1-.7-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.7s.6-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.7 1.8.8 1.9c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3 0 .1 0 .5-.2.9z" />
    </svg>
);

// Sticky bottom action bar — mobile only (<=1024px).
// Three actions per the approved Option A mock: Call / WhatsApp / Book a Visit.
const StickyActionBar = () => {
    const { isBookingOpen, openBooking } = useBooking();

    const track = (eventName, payload = {}) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(enrichEvent({ event: eventName, ...payload }, 'sticky-bar'));
    };

    // Hide the bar while the booking modal is open
    if (isBookingOpen) return null;

    return (
        <div className="sticky-action-bar" role="navigation" aria-label="Quick contact actions">
            <a
                href={`tel:${PHONE_NUMBER}`}
                className="sab-btn sab-call"
                onClick={() => track('phone_click', { phone_number: PHONE_NUMBER, link_url: `tel:${PHONE_NUMBER}` })}
            >
                <Phone size={16} aria-hidden="true" /> Call
            </a>
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="sab-btn sab-wa"
                onClick={() => track('whatsapp_click', { link_url: WHATSAPP_URL })}
            >
                <WhatsAppIcon /> WhatsApp
            </a>
            <button
                type="button"
                className="sab-btn sab-book"
                onClick={() => {
                    track('sticky_bar_book');
                    openBooking('', 'sticky-bar');
                }}
            >
                Book a Visit
            </button>

            <style>{`
                .sticky-action-bar {
                    display: none;
                }
                @media (max-width: 1024px) {
                    .sticky-action-bar {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 1500;
                        display: flex;
                        gap: 8px;
                        padding: 10px 12px;
                        padding-bottom: calc(10px + env(safe-area-inset-bottom));
                        background: rgba(255, 255, 255, 0.94);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border-top: 1px solid rgba(16, 42, 51, 0.08);
                    }
                    .sab-btn {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        font-family: var(--font-heading);
                        font-weight: 600;
                        font-size: 0.9rem;
                        line-height: 1;
                        border-radius: 14px;
                        padding: 13px 0;
                        border: 1.5px solid rgba(16, 42, 51, 0.12);
                        background: #fff;
                        color: var(--color-text-charcoal);
                        cursor: pointer;
                        text-decoration: none;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .sab-wa {
                        color: #128C4B;
                        border-color: #BFE8CF;
                        background: #F0FBF4;
                    }
                    .sab-book {
                        flex: 1.3;
                        background: linear-gradient(135deg, var(--color-primary-deep) 0%, var(--color-primary-teal) 100%);
                        border-color: var(--color-primary-teal);
                        color: #fff;
                        box-shadow: 0 6px 18px rgba(0, 141, 176, 0.28);
                    }
                }
            `}</style>
        </div>
    );
};

export default StickyActionBar;
