import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import Button from './Button';
import reviewStats from '../data/review-stats.json';
import { enrichEvent } from '../lib/attribution';
import Style from './Style';

const logo = '/logo.png';
const logoWebP = '/logo.webp';

// SVG Icons for social media
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

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
                            <picture>
                              <source type="image/webp" srcSet={logoWebP} width="320" height="320" />
                              <source type="image/png" srcSet={logo} width="500" height="500" />
                              <img className="site-logo-img" src={logo} alt="iSmile Dental Clinic logo" width="500" height="500" loading="lazy" decoding="async" />
                            </picture>
                        </Link>
                        <p className="footer-desc">
                            We are ready to help you smile with confidence. At iSmile Dental Clinic, we are dedicated to providing comprehensive dental care for the entire family.
                        </p>
                        
                        {/* Google Reviews Badge */}
                        <div className="google-reviews-badge" onClick={() => window.open('https://search.google.com/search?q=iSmile+Dental+Clinic+Petaling+Jaya', '_blank')}>
                            <div className="google-rating-row">
                                <div className="stars">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <span className="rating-text">{reviewStats.rating}</span>
                            </div>
                            <p className="reviews-count">{reviewStats.count} reviews</p>
                            <p className="write-review">Write a review →</p>
                        </div>

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
                            <li><Link to="/join-us" onClick={(e) => { if (location.pathname === '/join-us') { e.preventDefault(); scrollToTop(); } }}>Join Our Team</Link></li>
                            <li><Link to="/services">Full Service Directory</Link></li>
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
                                <p>75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya, Selangor, Malaysia</p>
                            </div>
                            <div className="direction-buttons">
                                <Button className="direction-btn" data-analytics-click="footer-maps" data-analytics-label="google-maps" onClick={() => window.open('https://maps.app.goo.gl/yt8MxXDpDxXgXqre6', '_blank')}>
                                    <img src="/images/google-maps.png" alt="Maps" className="btn-icon" loading="lazy" width="18" height="18" /> Google
                                </Button>
                                <Button className="direction-btn" data-analytics-click="footer-maps" data-analytics-label="waze" onClick={() => window.open('https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location', '_blank')}>
                                    <img src="/images/waze.png" alt="Waze" className="btn-icon" loading="lazy" width="18" height="18" /> Waze
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
                            <a
                                href="tel:+60163222135"
                                className="phone-link"
                                onClick={() => {
                                    window.dataLayer = window.dataLayer || [];
                                    window.dataLayer.push(enrichEvent({
                                        event: 'phone_click',
                                        phone_number: '+60163222135',
                                        link_url: 'tel:+60163222135'
                                    }, 'footer'));
                                }}
                            >+60163222135</a>
                        </div>
                        <p className="cta-desc">Ready to schedule your visit?</p>
                        <div className="mt-4">
                            <Button data-analytics-click="footer-booking" style={{ padding: '12px 40px', boxShadow: 'var(--shadow-teal)' }} onClick={() => openBooking('', 'footer-cta')}>Book a Visit</Button>
                        </div>
                        
                        {/* Social Media Links */}
                        <div className="footer-social" style={{ marginTop: '20px' }}>
                            <p className="social-label" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>Follow Us</p>
                            <div className="social-icons-row" style={{ display: 'flex', gap: '12px' }}>
                                <a 
                                    href="https://www.instagram.com/ismiledentalclinicmy" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="footer-social-icon instagram"
                                    aria-label="Follow us on Instagram"
                                >
                                    <InstagramIcon />
                                </a>
                                <a 
                                    href="https://www.facebook.com/share/18RSFR4Zww/?mibextid=wwXIfr" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="footer-social-icon facebook"
                                    aria-label="Follow us on Facebook"
                                >
                                    <FacebookIcon />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Style>{`
        .footer {
            /* Reskinned 7 Sep 2026 to the homepage's committed system: the old
               #edf2f7 slab made the hand-off from any page into the footer feel
               like a different site. The footer now sits on the page's own
               ground behind a single hairline, with the same eyebrow-style
               headings and quiet link colours as the sections above it. */
            background: transparent;
            padding: 96px 0 48px;
            color: #334155;
            border-top: 1px solid rgba(16,42,51,0.10);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
            gap: 40px;
        }

        .footer-logo picture {
            display: block;
            line-height: 0;
        }

        .footer-logo img {
            height: 118px !important;
            width: auto !important;
            max-width: 100%;
            object-fit: contain;
            background: transparent;
            display: block;
            margin-bottom: 8px;
        }

        .footer-desc {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #64748b;
            max-width: 280px;
            margin-top: 0;
            margin-bottom: 16px;
        }

        .google-reviews-badge {
            /* No white box: the card chrome was removed site-wide on the
               homepage, and the footer follows. A hairline above, the rating
               line, and the write-review link underlined like every other
               quiet link in the new system. */
            border-top: 1px solid rgba(16,42,51,0.10);
            padding: 16px 0 0;
            margin-bottom: 20px;
            cursor: pointer;
            text-align: left;
            max-width: 280px;
        }
        .google-reviews-badge:hover .write-review { border-color: var(--color-primary-deep); }
        .google-rating-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        .stars {
            color: #FBBC05;
            font-size: 1.2rem;
            letter-spacing: 2px;
        }
        .rating-text {
            font-weight: 700;
            color: #202124;
            font-size: 1.1rem;
        }
        .reviews-count {
            color: #5f6368;
            font-size: 0.85rem;
            margin: 0 0 8px 0;
        }
        .write-review {
            display: inline-block;
            color: var(--color-primary-deep);
            font-family: var(--font-heading);
            font-size: 0.9rem;
            font-weight: 600;
            margin: 0;
            border-bottom: 1px solid rgba(0,110,140,0.35);
            padding-bottom: 2px;
            transition: border-color 0.25s ease;
        }

        .footer-copyright {
            font-size: 0.8rem;
            color: #94a3b8;
            margin: 0;
        }

        .footer-heading {
            color: var(--color-primary-teal);
            font-family: var(--font-heading);
            font-size: 0.72rem;
            font-weight: 700;
            margin-bottom: 24px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
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
        .phone-icon /* tokenised */ {
            color: var(--color-primary-teal);
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

        /* The white outline pills are BACK by the owner's call (8 Sep 2026):
           he prefers the earlier Maps/Waze buttons over quiet links. Kept on
           tokens rather than the old hex values. */
        .direction-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .direction-btn {
            background: #fff !important;
            border: 1px solid var(--hairline) !important;
            color: var(--color-text-slate) !important;
            padding: 10px 20px !important;
            border-radius: 12px !important;
            font-size: 0.9rem !important;
            font-weight: 500 !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            box-shadow: none !important;
            transition: all 0.2s !important;
        }
        .direction-btn:hover { border-color: var(--color-primary) !important; color: var(--color-primary) !important; background: #f0f9ff !important; }
        .btn-icon { width: 18px; height: 18px; }

        /* Footer social: bare glyphs in the quiet-link palette, no chips,
           no third-party brand gradients (design rollout, 7 Sep 2026). */
        .footer-social-icon {
            display: inline-flex; align-items: center;
            color: var(--color-text-grey);
            transition: color 0.25s ease;
        }
        .footer-social-icon:hover { color: var(--color-primary-deep); }

        @media (max-width: 1024px) {
            .footer-social { text-align: center; }
            .social-icons-row { justify-content: center; }
        }

        .footer-accordion-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .accordion-icon { display: none; font-size: 1.2rem; transition: transform 0.3s; color: #94a3b8; }
        .accordion-icon.open { transform: rotate(45deg); }

        @media (max-width: 1024px) {
            .footer-grid { grid-template-columns: repeat(3, 1fr); }
            .cta-col { grid-column: span 3; text-align: center; margin-top: 20px; }
            .phone-block { justify-content: center; }
        }

        @media (max-width: 1024px) {
            /* Compact, consistently LEFT-ALIGNED accordion footer.
               Bottom padding = just enough to clear the floating action bar. */
            .footer { padding: 28px 0 calc(84px + env(safe-area-inset-bottom)); }
            .footer-copyright { font-size: 0.85rem; }
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 0;
            }
            .branding-col { text-align: left; align-items: flex-start; padding: 0 0 12px; border-bottom: 1px solid var(--hairline); margin-bottom: 8px; }
            .footer-logo img { height: 90px !important; width: auto !important; margin-bottom: 0px; }
            .footer-desc { margin: 6px 0 12px; font-size: 0.85rem; max-width: none; }
            .google-reviews-badge { text-align: left; margin-bottom: 12px; padding: 12px 0 0; }
            .google-rating-row { justify-content: flex-start; }

            .footer-col { border-bottom: 1px solid var(--hairline); padding: 6px 0; }
            .footer-heading { margin-bottom: 0; font-size: 0.78rem; }

            .footer-accordion-header { padding: 8px 0; margin: 0; }
            .accordion-icon { display: block; }

            .accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                opacity: 0;
                padding: 0;
            }
            .accordion-content.show {
                max-height: 500px;
                opacity: 1;
                padding: 8px 0 16px;
            }

            .cta-col { grid-column: span 1; border-bottom: none; padding-top: 14px; text-align: left; }
            .cta-col .footer-heading { margin-bottom: 12px; }
            .phone-block { justify-content: flex-start; margin-bottom: 12px; }
            .footer-social { text-align: left; }
            .social-icons-row { justify-content: flex-start; }
            .direction-buttons { flex-direction: row; justify-content: flex-start; transform: none; margin-top: 5px; }
            .direction-btn { width: 140px !important; }
        }
      `}</Style>
        </footer>
    );
};

export default Footer;
