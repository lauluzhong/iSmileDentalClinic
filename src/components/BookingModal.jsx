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
        // The document scroller is <html>, not <body> — lock both.
        const previousBodyOverflow = document.body.style.overflow;
        const previousRootOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousRootOverflow;
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
            onClick={closeBooking}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div className="modal-content glass-panel" onClick={e => e.stopPropagation()} {...cardMotion}>
                <button className="close-btn" onClick={closeBooking} aria-label="Close booking modal"><X size={24} /></button>

                <h2 className="modal-title">Schedule a visit with us today</h2>
                <div style={{ height: '2px', width: '60px', background: 'var(--color-secondary)', margin: '0 auto 20px', borderRadius: '1px' }} />

                <form data-analytics-form="booking-submission" onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label htmlFor="booking-name">Name *</label>
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
                        {errorFor('name') && <p className="field-error" id="booking-name-error">{errorFor('name')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="booking-contact">Contact Number *</label>
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
                        {errorFor('contact') && <p className="field-error" id="booking-contact-error">{errorFor('contact')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="booking-email">Email (optional)</label>
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
                        {errorFor('email') && <p className="field-error" id="booking-email-error">{errorFor('email')}</p>}
                    </div>

                    <div className="form-group">
                        <label>Who Is This Consultation For?</label>
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
                            <div className="child-age-row">
                                <label htmlFor="childAge">Child age</label>
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
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Describe what you're feeling or any preferences</label>
                        <textarea
                            data-analytics-focus="booking-field"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="I'm experiencing..."
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label>Additional notes (optional)</label>
                        <textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            placeholder="Anything else we should know?"
                            rows={3}
                        />
                    </div>

                    {submitError && <p className="submit-error">{submitError}</p>}

                    <Button type="submit" style={{ width: '100%', marginTop: '10px' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send via WhatsApp'}
                    </Button>
                </form>
            </motion.div>
            <Style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(8px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 40px;
                    position: relative;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    border: 1px solid rgba(255,255,255,0.6);
                    border-radius: 24px;
                }
                .close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
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
                    font-size: 1.8rem;
                    color: var(--color-primary);
                    margin-bottom: 15px;
                    text-align: center;
                    font-weight: 700;
                }
                .booking-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-weight: 600;
                    color: var(--color-text-main);
                    font-size: 0.9rem;
                    margin-left: 2px;
                }
                .form-group input, .form-group textarea, .form-group select {
                    padding: 12px 16px;
                    border: 1px solid #e1e4e8;
                    border-radius: 12px;
                    font-family: var(--font-body);
                    font-size: 1rem;
                    background: rgba(255,255,255,0.8);
                    transition: all 0.3s;
                }
                .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
                    outline: none;
                    border-color: var(--color-primary);
                    background: white;
                    box-shadow: 0 0 0 4px var(--color-tint-blue);
                }
                .booking-check-grid {
                    display: grid;
                    gap: 10px;
                    margin-top: 4px;
                }
                .booking-check-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                    margin-left: 0;
                }
                .booking-check-item input {
                    width: 18px;
                    height: 18px;
                    padding: 0;
                }
                .child-age-row {
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    align-items: center;
                    gap: 10px;
                    margin-top: 6px;
                }
                .form-group input.has-error,
                .form-group textarea.has-error {
                    border-color: #dc2626;
                }
                .form-group input.has-error:focus {
                    border-color: #dc2626;
                    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
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
                    padding: 10px 12px;
                    margin: 0;
                    font-size: 0.9rem;
                }
                /* Mobile: a real centered popup, not a full-screen sheet —
                   rounded corners visible top AND bottom, dimmed backdrop all
                   around, internal scroll for overflow. */
                @media (max-width: 640px) {
                    .modal-overlay { padding: 32px 18px; }
                    .modal-content {
                        max-height: 85vh;
                        max-height: 85svh;
                        padding: 24px 20px 22px;
                        border-radius: 24px;
                    }
                    .modal-title { font-size: 1.3rem; margin: 0 20px 10px; }
                    .close-btn { top: 12px; right: 12px; }
                    .booking-form { gap: 14px; }
                    .form-group { gap: 6px; }
                    .form-group input, .form-group textarea, .form-group select {
                        padding: 10px 14px;
                        font-size: 16px; /* also prevents iOS focus zoom */
                    }
                    .form-group textarea { min-height: 0; }
                }

            `}</Style>
        </motion.div>
        )}
        </AnimatePresence>
    );
};

export default BookingModal;
