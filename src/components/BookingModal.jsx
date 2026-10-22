import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import Button from './Button';
import { insertLead } from '../lib/supabase';
import { enrichEvent } from '../lib/attribution';
import Style from './Style';

const BookingModal = () => {
    const { isBookingOpen, closeBooking, prefillData } = useBooking();
    const hasOpenedRef = useRef(false);

    const initialFormState = {
        name: '',
        email: '',
        contact: '',
        experience: '',
        forSelf: false,
        forChild: false,
        childAge: '',
        forOther: false,
        additionalNotes: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const prefersReducedMotion = useReducedMotion();

    // Escape closes the modal; the page behind must not scroll while it's open.
    useEffect(() => {
        if (!isBookingOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeBooking();
        };
        document.addEventListener('keydown', onKeyDown);
        // Lock the page behind. overflow:hidden alone was not enough: Lenis
        // (smooth wheel scrolling, see useSmoothScroll) intercepts the wheel and
        // scrolls the window programmatically, so the page moved while the form
        // never did. The overlay carries data-lenis-prevent so Lenis ignores
        // wheel events over the modal, and the body is pinned with
        // position:fixed (the only lock iOS Safari respects), restoring the
        // exact scroll position on close.
        const body = document.body;
        const root = document.documentElement;
        const scrollY = window.scrollY;
        const prev = {
            bodyOverflow: body.style.overflow,
            rootOverflow: root.style.overflow,
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
        };
        root.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            root.style.overflow = prev.rootOverflow;
            body.style.overflow = prev.bodyOverflow;
            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.left = prev.left;
            body.style.right = prev.right;
            body.style.width = prev.width;
            // Instant jump back: the html scroll-behavior must not animate it.
            root.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollY);
            root.style.scrollBehavior = '';
        };
    }, [isBookingOpen, closeBooking]);

    const pushBookingEvent = useCallback((eventName, payload = {}, ctaLocation = prefillData?.sourceButton || 'unknown') => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(enrichEvent({
            event: eventName,
            booking_page: window.location.pathname,
            booking_source_button: prefillData?.sourceButton || 'direct',
            booking_cta_text: prefillData?.sourceButton || 'unknown',
            ...payload
        }, ctaLocation));
    }, [prefillData]);

    useEffect(() => {
        if (isBookingOpen && !hasOpenedRef.current) {
            hasOpenedRef.current = true;
            const ctaLocation = prefillData?.sourceButton || 'unknown';
            pushBookingEvent('booking_modal_open', {}, ctaLocation);
            pushBookingEvent('booking_modal_open_schedule', {}, ctaLocation);
        }
        if (!isBookingOpen) {
            hasOpenedRef.current = false;
        }
    }, [isBookingOpen, prefillData, pushBookingEvent]);

    useEffect(() => {
        if (isBookingOpen) {
            setFormData(prev => ({
                ...initialFormState,
                experience: prefillData?.experience || prev.experience || ''
            }));
        }
        if (!isBookingOpen) {
            setFormData(initialFormState);
            setTouched({});
            setSubmitError('');
            setIsSubmitting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBookingOpen, prefillData]);

    // Inline, per-field validation. `touched` was already being recorded but
    // never read, so the only feedback was one lumped error string on submit.
    // Deliberately lenient on the phone number — patients type it every which
    // way, and a rejected valid number costs a booking.
    const fieldError = (field, data = formData) => {
        if (field === 'name' && !data.name.trim()) return 'Please tell us your name';
        if (field === 'contact') {
            if (!data.contact.trim()) return 'We need a number to confirm your appointment';
            if (data.contact.replace(/\D/g, '').length < 7) return 'That number looks too short';
        }
        if (field === 'email' && data.email.trim() && !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
            return 'That email address looks incomplete';
        }
        return '';
    };

    const errorFor = (field) => (touched[field] ? fieldError(field) : '');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
        const ctaLocation = prefillData?.sourceButton || 'unknown';
        const eventData = {
            event: 'form_start',
            form_page: window.location.pathname,
            form_field: e.target.name
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(enrichEvent(eventData, ctaLocation));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setIsSubmitting(true);

        const blockingFields = ['name', 'contact', 'email'].filter(f => fieldError(f));
        if (blockingFields.length > 0) {
            // Reveal every inline message at once rather than one at a time.
            setTouched(prev => ({ ...prev, name: true, contact: true, email: true }));
            setSubmitError('Please check the highlighted fields above');
            setIsSubmitting(false);
            const firstInvalid = document.querySelector(`.booking-form [name="${blockingFields[0]}"]`);
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const currentPage = window.location.pathname;
        const sourceButton = prefillData?.sourceButton || 'unknown';
        const selectedFor = [];
        if (formData.forSelf) selectedFor.push('For myself');
        if (formData.forChild) selectedFor.push(`For my child${formData.childAge ? ` (${formData.childAge})` : ''}`);
        if (formData.forOther) selectedFor.push('For someone else');

        const familySection = selectedFor.length > 0
            ? `\n\nPatient details:\n${selectedFor.map(x => `- ${x}`).join('\n')}`
            : '';
        const notesSection = formData.additionalNotes.trim()
            ? `\n\nAdditional notes:\n${formData.additionalNotes.trim()}`
            : '';

        const emailLine = formData.email ? `\nEmail: ${formData.email}` : '';
        const message = `Hi iSmile Dental Clinic, I'd like to schedule a visit.

Name: ${formData.name}
Contact: ${formData.contact}${emailLine}

${formData.experience}${familySection}${notesSection}`;

        const ctaLocation = sourceButton;
        const safeEventPayload = {
            whatsapp_page: currentPage,
            whatsapp_cta_text: sourceButton,
            form_has_experience: Boolean(formData.experience),
            form_has_email: Boolean(formData.email),
            form_has_contact: Boolean(formData.contact),
            for_self: formData.forSelf,
            for_child: formData.forChild,
            child_age: formData.childAge || null,
            for_other: formData.forOther
        };

        pushBookingEvent('booking_modal_form_filled', safeEventPayload, ctaLocation);
        pushBookingEvent('whatsapp_submit_click', safeEventPayload, ctaLocation);

        // A lead-capture failure must never block the WhatsApp handoff — the
        // patient completing the form is the outcome that matters.
        let leadStorage = 'supabase';
        try {
            const { error: leadError, skipped } = await insertLead({
                name: formData.name,
                email: formData.email || '',
                contact: formData.contact,
                experience: formData.experience,
                for_self: formData.forSelf,
                for_child: formData.forChild,
                child_age: formData.forChild && formData.childAge ? parseInt(formData.childAge, 10) : null,
                for_other: formData.forOther,
                additional_notes: formData.additionalNotes || null,
                source_button: sourceButton,
                source_page: currentPage,
                whatsapp_sent: true,
                timestamp: new Date().toISOString()
            });
            if (skipped) leadStorage = 'skipped';
            else if (leadError) leadStorage = 'error';
        } catch (err) {
            console.error('Lead capture failed:', err);
            leadStorage = 'error';
        }

        // The completion counterpart to form_start — without this, GA4 can only
        // see forms being started, never finished.
        pushBookingEvent('form_submit', {
            form_page: currentPage,
            form_has_experience: Boolean(formData.experience),
            form_has_email: Boolean(formData.email),
            for_self: formData.forSelf,
            for_child: formData.forChild,
            for_other: formData.forOther,
            lead_storage: leadStorage
        }, ctaLocation);

        pushBookingEvent('booking_confirmed', {
            ...safeEventPayload,
            lead_storage: leadStorage,
            whatsapp_sent: true
        }, ctaLocation);

        fetch('/api/booking-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email || '',
                contact: formData.contact,
                experience: formData.experience,
                sourceButton,
                sourcePage: currentPage,
                timestamp: new Date().toISOString()
            })
        }).catch(err => {
            console.error('Booking notification API error:', err);
        });

        const phoneNumber = '60163222135';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        pushBookingEvent('whatsapp_conversation_started', safeEventPayload, ctaLocation);
        closeBooking();
    };

    // Enter and exit mirror each other (fade scrim, card rises in / sinks out)
    // on an interruptible spring — closing mid-open reverses smoothly instead
    // of hard-cutting. Reduced-motion users get a plain quick fade.
    const cardMotion = prefersReducedMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
        : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 }, transition: { type: 'spring', bounce: 0, duration: 0.35 } };

    return (
        <AnimatePresence>
        {isBookingOpen && (
        <motion.div
            className="modal-overlay"
            data-lenis-prevent
            onClick={closeBooking}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div className="modal-content" onClick={e => e.stopPropagation()} {...cardMotion}>
                <button className="close-btn" onClick={closeBooking} aria-label="Close booking modal"><X size={24} /></button>

                <h2 className="modal-title">Schedule a visit with us today</h2>

                <form data-analytics-form="booking-submission" onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <div className={`fl${formData.name.trim() ? ' filled' : ''}${errorFor('name') ? ' fl-error' : ''}`}>
                            <input
                                data-analytics-focus="booking-field"
                                id="booking-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Your Name"
                                aria-invalid={errorFor('name') ? 'true' : undefined}
                                aria-describedby={errorFor('name') ? 'booking-name-error' : undefined}
                                className={errorFor('name') ? 'has-error' : ''}
                                required
                            />
                            <label htmlFor="booking-name">Name *</label>
                        </div>
                        {errorFor('name') && <p className="field-error" id="booking-name-error">{errorFor('name')}</p>}
                    </div>

                    <div className="form-group">
                        <div className={`fl${formData.contact.trim() ? ' filled' : ''}${errorFor('contact') ? ' fl-error' : ''}`}>
                            <input
                                data-analytics-focus="booking-field"
                                id="booking-contact"
                                type="tel"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="012-345 6789"
                                aria-invalid={errorFor('contact') ? 'true' : undefined}
                                aria-describedby={errorFor('contact') ? 'booking-contact-error' : undefined}
                                className={errorFor('contact') ? 'has-error' : ''}
                                required
                            />
                            <label htmlFor="booking-contact">Contact Number *</label>
                        </div>
                        {errorFor('contact') && <p className="field-error" id="booking-contact-error">{errorFor('contact')}</p>}
                    </div>

                    <div className="form-group">
                        <div className={`fl${formData.email.trim() ? ' filled' : ''}${errorFor('email') ? ' fl-error' : ''}`}>
                            <input
                                data-analytics-focus="booking-field"
                                id="booking-email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="email@example.com"
                                aria-invalid={errorFor('email') ? 'true' : undefined}
                                aria-describedby={errorFor('email') ? 'booking-email-error' : undefined}
                                className={errorFor('email') ? 'has-error' : ''}
                            />
                            <label htmlFor="booking-email">Email (optional)</label>
                        </div>
                        {errorFor('email') && <p className="field-error" id="booking-email-error">{errorFor('email')}</p>}
                    </div>

                    <fieldset className="form-group">
                        <legend>Who Is This Consultation For?</legend>
                        <div className="booking-check-grid">
                            <label className="booking-check-item">
                                <input type="checkbox" name="forSelf" checked={formData.forSelf} onChange={handleChange} />
                                <span>For myself</span>
                            </label>
                            <label className="booking-check-item">
                                <input type="checkbox" name="forChild" checked={formData.forChild} onChange={handleChange} />
                                <span>For my child</span>
                            </label>
                            <label className="booking-check-item">
                                <input type="checkbox" name="forOther" checked={formData.forOther} onChange={handleChange} />
                                <span>For someone else</span>
                            </label>
                        </div>
                        {formData.forChild && (
                            <div className="fl always child-age-row">
                                <select
                                    id="childAge"
                                    name="childAge"
                                    value={formData.childAge}
                                    onChange={handleChange}
                                >
                                    <option value="">Select age</option>
                                    {Array.from({ length: 18 }, (_, i) => i + 1).map(age => (
                                        <option key={age} value={String(age)}>{age}</option>
                                    ))}
                                </select>
                                <label htmlFor="childAge">Child age</label>
                            </div>
                        )}
                    </fieldset>

                    <div className="form-group">
                        <div className={`fl fl-area${formData.experience.trim() ? ' filled' : ''}`}>
                            <textarea
                                data-analytics-focus="booking-field"
                                id="booking-experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="I'm experiencing..."
                                rows={2}
                            />
                            <label htmlFor="booking-experience">Describe what you're feeling or any preferences</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className={`fl fl-area${formData.additionalNotes.trim() ? ' filled' : ''}`}>
                            <textarea
                                id="booking-notes"
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleChange}
                                placeholder="Anything else we should know?"
                                rows={2}
                            />
                            <label htmlFor="booking-notes">Additional notes (optional)</label>
                        </div>
                    </div>

                    {submitError && <p className="submit-error">{submitError}</p>}

                    <Button type="submit" style={{ width: '100%', marginTop: '4px' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send via WhatsApp'}
                    </Button>
                </form>
            </motion.div>
            <Style>{`
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(8px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    overscroll-behavior: contain;
                }
                /* Sized to fit one screen with the button visible; if a very
                   short screen still overflows, the card itself scrolls (never
                   the page behind it). */
                .modal-content {
                    width: 100%;
                    max-width: 480px;
                    background: #fff;
                    padding: 26px 32px 28px;
                    position: relative;
                    max-height: calc(100vh - 32px);
                    max-height: calc(100dvh - 32px);
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    -webkit-overflow-scrolling: touch;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    border: 1px solid var(--hairline);
                    border-radius: 24px;
                }
                .close-btn {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--color-text-grey);
                    transition: color 0.3s;
                    padding: 5px;
                    border-radius: 50%;
                }
                .close-btn:hover {
                    color: var(--color-primary);
                    background: rgba(0,0,0,0.05);
                }
                .close-btn:active {
                    background: rgba(0,0,0,0.09);
                    transform: scale(0.92);
                }
                .modal-title {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    line-height: 1.2;
                    color: var(--color-text-charcoal);
                    letter-spacing: -0.02em;
                    margin: 0 24px 14px;
                    text-align: center;
                    font-weight: 700;
                }
                .booking-form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin: 0;
                    padding: 0;
                    border: 0;
                    min-width: 0;
                }
                .form-group legend {
                    font-weight: 600;
                    color: var(--color-text-main);
                    font-size: 0.875rem;
                    margin-left: 2px;
                    padding: 0;
                    margin-bottom: 6px;
                }
                /* Floating label: the label sits inside the field and floats up
                   on focus or once there is a value. Placeholder is only shown
                   while focused, so the label is the sole resting hint. */
                .fl {
                    position: relative;
                }
                .fl input, .fl textarea, .fl select {
                    display: block;
                    width: 100%;
                    min-height: 50px;
                    padding: 21px 14px 6px;
                    border: 1.5px solid var(--color-tint-blue);
                    border-radius: 14px;
                    font-family: var(--font-body);
                    font-size: 1rem;
                    color: var(--color-text-main);
                    background: #fff;
                    transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
                }
                .fl select {
                    appearance: none;
                    -webkit-appearance: none;
                    padding-right: 40px;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill='%23475569' d='M3 5.5l5 5 5-5z'/></svg>");
                    background-repeat: no-repeat;
                    background-position: right 14px center;
                }
                .fl textarea {
                    resize: vertical;
                    line-height: 1.4;
                }
                .fl label {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    margin: 0;
                    font-weight: 400;
                    font-size: 0.95rem;
                    line-height: 1.2;
                    color: #64748B;
                    pointer-events: none;
                    max-width: calc(100% - 28px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    transition: top 0.18s cubic-bezier(.22,.7,.3,1), transform 0.18s cubic-bezier(.22,.7,.3,1),
                                font-size 0.18s cubic-bezier(.22,.7,.3,1), color 0.15s ease;
                }
                /* textarea labels are sentences — let them wrap instead of truncating */
                .fl-area textarea { padding-top: 26px; min-height: 76px; }
                .fl-area label { top: 14px; transform: none; white-space: normal; line-height: 1.25; }
                .fl:focus-within label, .fl.filled label, .fl.always label {
                    top: 7px;
                    transform: none;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #475569;
                }
                .fl input::placeholder, .fl textarea::placeholder { color: transparent; transition: color 0.15s ease; }
                .fl input:focus::placeholder, .fl textarea:focus::placeholder { color: #9AA7B4; }
                .fl input:hover, .fl textarea:hover, .fl select:hover { border-color: var(--color-pastel-blue); }
                .fl input:focus, .fl textarea:focus, .fl select:focus {
                    outline: none;
                    border-color: var(--color-primary);
                    background-color: white;
                    box-shadow: 0 0 0 4px var(--color-tint-blue);
                }
                /* The three "who for" options sit side by side to save two rows. */
                .booking-check-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 8px;
                }
                .booking-check-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-height: 44px;
                    padding: 6px 8px;
                    border: 1.5px solid var(--color-tint-blue);
                    border-radius: 14px;
                    background: #fff;
                    font-weight: 500;
                    font-size: 0.78rem;
                    line-height: 1.15;
                    cursor: pointer;
                    -webkit-tap-highlight-color: transparent;
                    transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.08s ease;
                }
                .booking-check-item:hover { border-color: var(--color-pastel-blue); }
                .booking-check-item:active { transform: scale(0.985); }
                .booking-check-item:has(input:checked) {
                    background: var(--color-tint-blue);
                    border-color: var(--color-primary);
                }
                .booking-check-item input {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    padding: 0;
                    margin: 0;
                    flex: 0 0 auto;
                    border: 2px solid #B4C2CE;
                    border-radius: 6px;
                    background: #fff;
                    cursor: pointer;
                    transition: border-color 0.12s ease, background-color 0.12s ease;
                }
                .booking-check-item input:checked {
                    border-color: var(--color-primary);
                    background: var(--color-primary);
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><path fill='white' d='M8 13.4L4.6 10l-1.2 1.2L8 15.8l8-8-1.2-1.2z'/></svg>");
                    background-size: 18px 18px;
                    background-position: center;
                    background-repeat: no-repeat;
                }
                .booking-check-item input:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 3px; }
                .child-age-row { margin-top: 8px; }
                .fl-error input, .form-group input.has-error, .form-group textarea.has-error {
                    border-color: #dc2626;
                    background-color: white;
                }
                .fl-error label { color: #b91c1c; }
                .form-group input.has-error:focus {
                    border-color: #dc2626;
                    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
                }
                .booking-form .btn {
                    min-height: 50px;
                    border-radius: 999px;
                }
                .field-error {
                    color: #b91c1c;
                    font-size: 0.82rem;
                    margin: 0;
                    margin-left: 2px;
                }
                .submit-error {
                    color: #b91c1c;
                    background: #fee2e2;
                    border: 1px solid #fecaca;
                    border-radius: 10px;
                    padding: 8px 12px;
                    margin: 0;
                    font-size: 0.875rem;
                }
                /* Mobile: a centered popup with rounded corners and a dimmed
                   backdrop, compact enough that the button shows without
                   scrolling on a typical phone. */
                @media (max-width: 640px) {
                    .modal-overlay { padding: 12px; }
                    .modal-content {
                        max-height: calc(100vh - 24px);
                        max-height: calc(100dvh - 24px);
                        padding: 18px 16px 18px;
                        border-radius: 22px;
                    }
                    .modal-title { font-size: 1.2rem; margin: 0 28px 12px; }
                    .close-btn { top: 8px; right: 8px; }
                    .booking-form { gap: 10px; }
                    .form-group { gap: 4px; }
                    .form-group legend { margin-bottom: 4px; }
                    .fl input, .fl textarea, .fl select {
                        font-size: 16px; /* also prevents iOS focus zoom */
                    }
                    .fl label { font-size: 15px; }
                    .fl-area label { font-size: 14px; }
                    .fl-area textarea { padding-top: 40px; min-height: 84px; }
                    .fl:focus-within label, .fl.filled label, .fl.always label { font-size: 12px; }
                    .booking-check-item { padding: 6px 8px; gap: 6px; font-size: 14px; }
                }

            `}</Style>
        </motion.div>
        )}
        </AnimatePresence>
    );
};

export default BookingModal;
