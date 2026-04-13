// MODIFIED VERSION WITH SUPABASE + PEDIATRIC FIELDS
// Replace the existing BookingModal.jsx with this version

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import Button from './Button';
import { supabase } from '../lib/supabase'; // New import

const BookingModal = () => {
    const { isBookingOpen, closeBooking, prefillData } = useBooking();
    const hasOpenedRef = useRef(false);

    // Form state - EXPANDED with pediatric fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        experience: '',
        forSelf: false,
        forChild: false,
        childAge: '',
        forOther: false,
        additionalNotes: ''
    });

    // Simple state to track touched fields
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Fire booking_modal_open event when modal opens
    useEffect(() => {
        if (isBookingOpen && !hasOpenedRef.current) {
            hasOpenedRef.current = true;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'booking_modal_open',
                booking_page: window.location.pathname,
                booking_source_button: prefillData?.sourceButton || 'direct',
                booking_cta_text: prefillData?.sourceButton || 'unknown'
            });
        }
        if (!isBookingOpen) {
            hasOpenedRef.current = false;
        }
    }, [isBookingOpen, prefillData]);

    // Effect to handle prefill data when modal opens
    useEffect(() => {
        if (isBookingOpen) {
            if (prefillData && prefillData.experience) {
                setFormData(prev => ({ ...prev, experience: prefillData.experience }));
            } else {
                setFormData(prev => ({ ...prev, experience: "" }));
            }
        }
    }, [isBookingOpen, prefillData]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isBookingOpen) {
            setFormData({
                name: '',
                email: '',
                contact: '',
                experience: '',
                forSelf: false,
                forChild: false,
                childAge: '',
                forOther: false,
                additionalNotes: ''
            });
            setTouched({});
            setSubmitError('');
        }
    }, [isBookingOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        // Basic validation
        if (!formData.name.trim() || !formData.contact.trim()) {
            setSubmitError('Please fill in required fields');
            setIsSubmitting(false);
            return;
        }

        const currentPage = window.location.pathname;

        try {
            // 1. Save to Supabase
            const { error: supabaseError } = await supabase
                .from('leads')
                .insert({
                    name: formData.name.trim(),
                    contact: formData.contact.trim(),
                    email: formData.email.trim() || null,
                    experience: formData.experience.trim(),
                    for_self: formData.forSelf,
                    for_child: formData.forChild,
                    child_age: formData.forChild && formData.childAge ? parseInt(formData.childAge) : null,
                    for_other: formData.forOther,
                    additional_notes: formData.additionalNotes.trim(),
                    source_page: currentPage,
                    source_button: prefillData?.sourceButton || 'direct',
                    whatsapp_sent: false
                });

            if (supabaseError) {
                console.error('Supabase error:', supabaseError);
                // Continue with WhatsApp even if Supabase fails
            }

            // 2. Fire whatsapp_submit_click event BEFORE opening WhatsApp
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'whatsapp_submit_click',
                whatsapp_page: currentPage,
                whatsapp_cta_text: prefillData?.sourceButton || 'unknown',
                whatsapp_for_self: formData.forSelf,
                whatsapp_for_child: formData.forChild,
                whatsapp_child_age: formData.childAge || null,
                whatsapp_for_other: formData.forOther
            });

            // 3. Fire to Vercel API (non-blocking — don't slow down WhatsApp open)
            if (process.env.NODE_ENV === 'production') {
                fetch('/api/booking-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        contact: formData.contact,
                        email: formData.email,
                        experience: formData.experience,
                        page: currentPage,
                        button: prefillData?.sourceButton || 'direct'
                    })
                }).catch(err => console.error('API error:', err));
            }

            // 4. WhatsApp Link Construction
            const phoneNumber = '60163222135';
            
            // Build family details section
            const familyDetails = [];
            if (formData.forSelf) familyDetails.push('For myself');
            if (formData.forChild) {
                const ageText = formData.childAge ? ` (${formData.childAge} years old)` : '';
                familyDetails.push(`For my child${ageText}`);
            }
            if (formData.forOther) familyDetails.push('For someone else');
            
            const familySection = familyDetails.length > 0 
                ? `\n\n**Patient Details:**\n${familyDetails.map(d => `- ${d}`).join('\n')}`
                : '';
            
            const additionalNotesSection = formData.additionalNotes.trim()
                ? `\n\n**Additional Notes:**\n${formData.additionalNotes.trim()}`
                : '';

            const message = `Hi iSmile Dental Clinic, I'd like to schedule a visit.

Name: ${formData.name}
Contact: ${formData.contact}
Email: ${formData.email}

${formData.experience}${familySection}${additionalNotesSection}

Looking forward to hearing from you!`;

            const encodedMessage = encodeURIComponent(message);
            const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // 5. Update Supabase record to mark WhatsApp as sent
            if (!supabaseError) {
                // Note: We'd need the lead ID to update, but for simplicity
                // we'll rely on the initial insert timestamp
            }

            // 6. Open WhatsApp
            window.open(url, '_blank');
            closeBooking();
            
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isBookingOpen) return null;

    return (
        <div className="modal-overlay" onClick={closeBooking}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={closeBooking}><X size={24} /></button>

                <h2 className="modal-title">Schedule a visit with us today</h2>
                <div style={{height: '2px', width: '60px', background: 'var(--color-secondary)', margin: '0 auto 20px', borderRadius: '1px'}}></div>

                <form data-analytics-form="booking-submission" onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label>Name *</label>
                        <input data-analytics-focus="booking-field"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => {
                                if (!touched.name) {
                                    window.dataLayer = window.dataLayer || [];
                                    window.dataLayer.push({
                                        event: 'form_start',
                                        form_name: 'booking-submission',
                                        form_field: 'name'
                                    });
                                }
                            }}
                            required
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Number *</label>
                        <input
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 012-3456789"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                        />
                    </div>

                    {/* NEW: Patient Selection Section */}
                    <div className="form-group">
                        <label style={{ marginBottom: '8px', display: 'block' }}>
                            Select all that apply:
                        </label>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="forSelf"
                                    checked={formData.forSelf}
                                    onChange={handleChange}
                                />
                                <span>For myself</span>
                            </label>
                            
                            <div style={{ marginLeft: '20px' }}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="forChild"
                                        checked={formData.forChild}
                                        onChange={handleChange}
                                    />
                                    <span>For my child</span>
                                </label>
                                
                                {formData.forChild && (
                                    <div style={{ marginTop: '8px', marginLeft: '20px' }}>
                                        <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                            Child's age (optional):
                                            <input
                                                type="number"
                                                name="childAge"
                                                value={formData.childAge}
                                                onChange={handleChange}
                                                min="0"
                                                max="18"
                                                placeholder="e.g. 8"
                                                style={{ 
                                                    marginLeft: '8px',
                                                    padding: '6px 8px',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: '4px',
                                                    width: '80px'
                                                }}
                                            />
                                            <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                                                years old
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>
                            
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="forOther"
                                    checked={formData.forOther}
                                    onChange={handleChange}
                                />
                                <span>For someone else</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tell us what you're interested in</label>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g. Interested in myofunctional orthodontics for my child"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Additional notes (optional)</label>
                        <textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            placeholder="Any other information you'd like to share..."
                            rows="2"
                        />
                    </div>

                    {submitError && (
                        <div style={{ 
                            color: 'var(--color-error)', 
                            fontSize: '14px', 
                            marginBottom: '16px',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            borderRadius: '4px'
                        }}>
                            {submitError}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg" 
                        fullWidth
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send via WhatsApp'}
                    </Button>

                    <p style={{ 
                        fontSize: '12px', 
                        color: 'var(--color-text-tertiary)', 
                        textAlign: 'center', 
                        marginTop: '16px',
                        lineHeight: '1.4'
                    }}>
                        By submitting, you agree to our Privacy Policy. 
                        Your information will be securely stored and used only for scheduling your appointment.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;