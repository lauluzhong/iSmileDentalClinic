import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import Button from './Button'; 

const BookingModal = () => {
    const { isBookingOpen, closeBooking, prefillData } = useBooking();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        experience: ''
    });
    
    // Simple state to track touched fields
    const [touched, setTouched] = useState({});

    // Effect to handle prefill data when modal opens
    useEffect(() => {
        if (isBookingOpen) {
            if (prefillData && prefillData.experience) {
                setFormData(prev => ({ ...prev, experience: prefillData.experience }));
            } else {
                // Optional: Reset experience if no prefill data is provided (clean slate)
                setFormData(prev => ({ ...prev, experience: "" }));
            }
        }
    }, [isBookingOpen, prefillData]);

    if (!isBookingOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!formData.name || !formData.email || !formData.contact) {
            alert('Please fill in all required fields marked with *');
            return;
        }

        // N8N Trigger implementation
        const n8nWebhookUrl = 'https://lauluzhong.app.n8n.cloud/webhook/de920d9d-60f4-445d-941a-3991599824b7';
        const payload = {
            ...formData,
            sourceButton: prefillData.sourceButton || 'unknown',
            sourcePage: prefillData.sourcePage || window.location.pathname,
            timestamp: new Date().toISOString()
        };

        console.log('Triggering N8N with payload:', payload);

        // Fire and forget tracking to ensure WhatsApp flow isn't blocked by network issues
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.error('N8N Trigger Error (expected if URL is placeholder):', err);
        });

        // WhatsApp Link Construction
        const phoneNumber = '60163222135'; 
        
        // Construct the message
        const message = `Hi iSmile Dental Clinic, I’d like to schedule a visit.

Name: ${formData.name}
Contact: ${formData.contact}
Email: ${formData.email}

${formData.experience}`;

        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'booking_complete' });
        window.open(url, '_blank');
        closeBooking();
    };

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
                            onBlur={handleBlur}
                            placeholder="Your Name"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Number *</label>
                        <input data-analytics-focus="booking-field" 
                            type="tel" 
                            name="contact" 
                            value={formData.contact} 
                            onChange={handleChange} 
                            placeholder="012-345 6789"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input data-analytics-focus="booking-field" 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="email@example.com"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Describe what you're feeling or any preferences</label>
                        <textarea data-analytics-focus="booking-field" 
                            name="experience" 
                            value={formData.experience} 
                            onChange={handleChange} 
                            placeholder="I'm experiencing..."
                            rows={4}
                        />
                    </div>

                    <Button type="submit" style={{ width: '100%', marginTop: '10px' }}>
                        Send via WhatsApp
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

                .form-group input, .form-group textarea {
                    padding: 12px 16px;
                    border: 1px solid #e1e4e8;
                    border-radius: 12px;
                    font-family: var(--font-body);
                    font-size: 1rem;
                    background: rgba(255,255,255,0.8);
                    transition: all 0.3s;
                }

                .form-group input:focus, .form-group textarea:focus {
                    outline: none;
                    border-color: var(--color-primary);
                    background: white;
                    box-shadow: 0 0 0 4px var(--color-tint-blue);
                }

                .form-group small {
                    color: var(--color-text-grey);
                    font-size: 0.8rem;
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
