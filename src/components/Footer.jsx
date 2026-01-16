import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import Button from './Button';

const Footer = () => {
    const { openBooking } = useBooking();
    const location = useLocation();
    const [openSections, setOpenSections] = React.useState({
        links: false,
        visit: false,
        hours: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Column 1: Brand & Intro */}
                    <div className="footer-col branding-col">
                        <Link
                            to="/"
                            className="footer-logo" data-analytics-click="logo-footer"
                            onClick={(e) => {
                                if (location.pathname === '/') {
                                    e.preventDefault();
                                    scrollToTop();
                                }
                            }}
                        >
                            <img src="/logo.png" alt="iSmile" />
                        </Link>
                        <p className="footer-desc">
                            We are ready to help you smile with confidence. At iSmile Dental Clinic, we are dedicated to providing comprehensive dental care for the entire family.
                        </p>
                        <p className="footer-copyright">
                            © 2026 iSmile Dental Clinic. All rights reserved.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col links-col">
                        <div className="footer-accordion-header" onClick={() => toggleSection('links')}>
                            <h4 className="footer-heading">Quick Links</h4>
                            <span className={`accordion-icon ${openSections.links ? 'open' : ''}`}>+</span>
                        </div>
                        <ul className={`footer-links accordion-content ${openSections.links ? 'show' : ''}`}>
                            <li><Link to="/" onClick={(e) => { if (location.pathname === '/') { e.preventDefault(); scrollToTop(); } }}>Home</Link></li>
                            <li><Link to="/about" onClick={(e) => { if (location.pathname === '/about') { e.preventDefault(); scrollToTop(); } }}>About Us</Link></li>
                            <li><Link to="/services" onClick={(e) => { if (location.pathname === '/services') { e.preventDefault(); scrollToTop(); } }}>Our Services</Link></li>
                            <li><Link to="/reviews" onClick={(e) => { if (location.pathname === '/reviews') { e.preventDefault(); scrollToTop(); } }}>Reviews</Link></li>
                            <li><Link to="/blog" onClick={(e) => { if (location.pathname === '/blog') { e.preventDefault(); scrollToTop(); } }}>Learning Centre</Link></li>
                            <li><Link to="/faq" onClick={(e) => { if (location.pathname === '/faq') { e.preventDefault(); scrollToTop(); } }}>FAQs</Link></li>
                            <li><Link to="/services#service-directory">Full Service Directory</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Visit Us */}
                    <div className="footer-col">
                        <div className="footer-accordion-header" onClick={() => toggleSection('visit')}>
                            <h4 className="footer-heading">Visit Us</h4>
                            <span className={`accordion-icon ${openSections.visit ? 'open' : ''}`}>+</span>
                        </div>
                        <div className={`accordion-content ${openSections.visit ? 'show' : ''}`}>
                            <div className="address-block">
                                <p>75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya, Selangor</p>
                            </div>
                            <div className="direction-buttons">
                                <Button className="direction-btn" data-analytics-click="footer-maps" data-analytics-label="google-maps" onClick={() => window.open('https://maps.app.goo.gl/yt8MxXDpDxXgXqre6', '_blank')}>
                                    <img src="/images/google-maps.png" alt="Maps" className="btn-icon" /> Google
                                </Button>
                                <Button className="direction-btn" data-analytics-click="footer-maps" data-analytics-label="waze" onClick={() => window.open('https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location', '_blank')}>
                                    <img src="/images/waze.png" alt="Waze" className="btn-icon" /> Waze
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Opening Hours */}
                    <div className="footer-col">
                        <div className="footer-accordion-header" onClick={() => toggleSection('hours')}>
                            <h4 className="footer-heading">Opening Hours</h4>
                            <span className={`accordion-icon ${openSections.hours ? 'open' : ''}`}>+</span>
                        </div>
                        <div className={`accordion-content ${openSections.hours ? 'show' : ''}`}>
                            <div className="hours-block">
                                <p className="day-label">Monday to Friday:</p>
                                <p className="time-val">9:30 AM - 5:30 PM</p>
                            </div>
                            <div className="hours-block">
                                <p className="day-label">Saturday:</p>
                                <p className="time-val">9:30 AM - 3:30 PM</p>
                            </div>
                            <div className="hours-block">
                                <p className="day-label">Sunday / Public Holidays:</p>
                                <p className="time-val">Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 5: Call to Action */}
                    <div className="footer-col cta-col">
                        <h4 className="footer-heading">Contact</h4>
                        <div className="phone-block">
                            <Smartphone size={20} className="phone-icon" />
                            <a href="tel:0163222135" className="phone-link">016-322 2135</a>
                        </div>
                        <p className="cta-desc">Ready to schedule your visit?</p>
                        <div className="mt-4">
                            <Button data-analytics-click="footer-booking" style={{ padding: '12px 40px', boxShadow: '0 4px 15px rgba(79, 163, 194, 0.3)' }} onClick={() => openBooking()}>Get in Touch</Button>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
        .footer {
            background-color: #edf2f7;
            padding: 80px 0 40px;
            color: #334155;
            border-top: 1px solid #e2e8f0;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
            gap: 40px;
        }

        .footer-logo img {
            height: 155px !important;
            margin-bottom: 8px;
        }

        .footer-desc {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #64748b;
            max-width: 280px;
            margin-top: 0;
            margin-bottom: 24px;
        }

        .footer-copyright {
            font-size: 0.8rem;
            color: #94a3b8;
            margin: 0;
        }

        .footer-heading {
            color: #00A0C6;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 24px;
            letter-spacing: 0.02em;
        }

        .footer-links { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 12px; }
        .footer-links a { color: #475569; font-size: 0.95rem; transition: color 0.2s; }
        .footer-links a:hover { color: var(--color-primary); }

        .address-block p { font-size: 0.95rem; color: #475569; line-height: 1.6; margin-top: 0; margin-bottom: 20px; }
        
        .hours-block { margin-bottom: 15px; }
        .day-label { font-weight: 700; color: #334155; font-size: 0.95rem; margin-top: 0; margin-bottom: 4px; }
        .time-val { font-size: 0.9rem; color: #64748b; margin-top: 0; }
        .cta-desc { font-size: 0.95rem; color: #64748b; line-height: 1.5; margin-top: 0; }

        .phone-block {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
        }
        .phone-icon {
            color: #00A0C6;
        }
        .phone-link {
            color: #475569;
            font-size: 1.1rem;
            font-weight: 600;
            text-decoration: none;
            transition: color 0.2s;
        }
        .phone-link:hover {
            color: var(--color-primary);
        }

        .direction-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .direction-btn {
            background: white !important;
            border: 1px solid #e2e8f0 !important;
            color: #475569 !important;
            padding: 10px 20px !important;
            border-radius: 12px !important;
            font-size: 0.9rem !important;
            font-weight: 500 !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
            transition: all 0.2s !important;
        }
        .direction-btn:hover { border-color: var(--color-primary) !important; color: var(--color-primary) !important; background: #f0f9ff !important; }
        .btn-icon { width: 18px; height: 18px; }

        .footer-accordion-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .accordion-icon { display: none; font-size: 1.2rem; transition: transform 0.3s; color: #94a3b8; }
        .accordion-icon.open { transform: rotate(45deg); }

        @media (max-width: 1024px) {
            .footer-grid { grid-template-columns: repeat(3, 1fr); }
            .cta-col { grid-column: span 3; text-align: center; margin-top: 20px; }
            .phone-block { justify-content: center; }
        }

        @media (max-width: 1024px) {
            .footer { padding: 40px 0; }
            .footer-grid { 
                grid-template-columns: 1fr; 
                gap: 0;
            }
            .branding-col { text-align: center; align-items: center; padding: 0 0 16px; border-bottom: 1px solid #f1f5f9; margin-bottom: 16px; }
            .footer-logo img { height: 100px !important; margin-bottom: 0px; }
            .footer-desc { margin: 8px auto 16px; font-size: 0.85rem; }
            
            .footer-col { border-bottom: 1px solid #f1f5f9; padding: 16px 0; }
            .footer-heading { margin-bottom: 0; font-size: 1rem; }
            
            .footer-accordion-header { padding: 8px 16px; margin: 0 -16px; }
            .accordion-icon { display: block; }
            
            .accordion-content { 
                max-height: 0; 
                overflow: hidden; 
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
                opacity: 0;
                padding: 0 16px;
            }
            .accordion-content.show { 
                max-height: 500px; 
                opacity: 1; 
                padding: 16px 16px 24px; 
            }

            .cta-col { grid-column: span 1; border-bottom: none; padding-top: 40px; }
            .direction-buttons { flex-direction: row; justify-content: center; transform: scale(0.95); margin-top: 5px; }
            .direction-btn { width: 140px !important; }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
