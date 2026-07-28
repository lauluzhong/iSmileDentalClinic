import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import Button from './Button';
import { insertLead } from '../lib/supabase';
import { enrichEvent } from '../lib/attribution';

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

    if (!isBookingOpen) return null;

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

        if (!formData.name || !formData.contact) {
            setSubmitError('Please fill in your name and contact number');
            setIsSubmitting(false);
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

        await insertLead({
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

        pushBookingEvent('booking_confirmed', {
            ...safeEventPayload,
            lead_storage: 'supabase',
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

    return (
        <div className="modal-overlay" onClick={closeBooking}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={closeBooking} aria-label="Close booking modal"><X size={24} /></button>

                <h2 className="modal-title">Schedule a visit with us today</h2>
                <div style={{ height: '2px', width: '60px', background: 'var(--color-secondary)', margin: '0 auto 20px', borderRadius: '1px' }} />

                <form data-analytics-form="booking-submission" onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            data-analytics-focus="booking-field"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Number *</label>
                        <input
                            data-analytics-focus="booking-field"
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="012-345 6789"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email (optional)</label>
                        <input
                            data-analytics-focus="booking-field"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                        />
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
            </div>
            <style>{`
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
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 40px;
                    position: relative;
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
                .submit-error {
                    color: #b91c1c;
                    background: #fee2e2;
                    border: 1px solid #fecaca;
                    border-radius: 10px;
                    padding: 10px 12px;
                    margin: 0;
                    font-size: 0.9rem;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default BookingModal;
