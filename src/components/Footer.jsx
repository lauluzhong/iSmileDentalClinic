import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

const Footer = () => {
    const { openBooking } = useBooking();
    const location = useLocation();

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
                            className="footer-logo"
                            onClick={(e) => {
                                if (location.pathname === '/') {
                                    e.preventDefault();
                                    scrollToTop();
                                }
                            }}
                        >
                            <img src="/logo.png" alt="iSmile" style={{ height: "110px", width: "auto" }} />
                        </Link>
                        <p className="footer-desc">
                            We are ready to help you smile with confidence. At iSmile Dental, we are dedicated to providing comprehensive dental care for the entire family.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col links-col">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li>
                                <Link
                                    to="/"
                                    onClick={(e) => {
                                        if (location.pathname === '/') {
                                            e.preventDefault();
                                            scrollToTop();
                                        }
                                    }}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    onClick={(e) => {
                                        if (location.pathname === '/about') {
                                            e.preventDefault();
                                            scrollToTop();
                                        }
                                    }}
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services"
                                    onClick={(e) => {
                                        if (location.pathname === '/services') {
                                            e.preventDefault();
                                            scrollToTop();
                                        }
                                    }}
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/reviews"
                                    onClick={(e) => {
                                        if (location.pathname === '/reviews') {
                                            e.preventDefault();
                                            scrollToTop();
                                        }
                                    }}
                                >
                                    Reviews
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    onClick={(e) => {
                                        if (location.pathname === '/blog') {
                                            e.preventDefault();
                                            scrollToTop();
                                        }
                                    }}
                                >
                                    Learning Centre
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    onClick={(e) => {
                                        if (location.pathname === '/faq') {
                                            e.preventDefault();
                                            scrollToTop();
                                        }
                                    }}
                                >
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Visit Us */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Visit Us</h4>
                        <div className="address-block">
                            <p>
                                75 & 75A , Jalan SS 22/23,<br />
                                Damansara Jaya, Petaling Jaya,<br />
                                Malaysia
                            </p>
                        </div>
                        <div className="direction-buttons">
                            <Button
                                className="direction-btn google-btn"
                                onClick={() => window.open('https://maps.app.goo.gl/yt8MxXDpDxXgXqre6', '_blank')}
                            >
                                <img src="/images/google-maps.png" alt="Google Maps" className="btn-icon" />
                                Google Maps
                            </Button>
                            <Button
                                className="direction-btn waze-btn"
                                onClick={() => window.open('https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location', '_blank')}
                            >
                                <img src="/images/waze.png" alt="Waze" className="btn-icon" />
                                Waze
                            </Button>
                        </div>
                    </div>

                    {/* Column 4: Opening Hours */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Opening Hours</h4>
                        <div className="hours-block">
                            <div className="day-label">Monday to Friday:</div>
                            <div className="time-val">9:30 AM - 5:30 PM</div>
                        </div>
                        <div className="hours-block">
                            <div className="day-label">Saturday:</div>
                            <div className="time-val">9:30 AM - 3:30 PM</div>
                        </div>
                        <div className="hours-block">
                            <div className="day-label">Sunday:</div>
                            <div className="time-val">Closed</div>
                        </div>
                    </div>

                    {/* Column 5: Book Appointment */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Book Appointment</h4>
                        <p className="footer-text">
                            Ready to schedule your visit?
                        </p>
                        <div className="mt-4">
                            <Button style={{ background: '#00A0C6', border: 'none', padding: '10px 30px' }} onClick={() => openBooking()}>Book Now</Button>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
        .footer {
            background-color: #E6EEF5;
            padding: 80px 0;
            color: #333;
            font-family: var(--font-body);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
            gap: 30px;
            align-items: start;
        }

        .footer-col {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
        }

        .footer-logo {
            font-family: var(--font-heading, "Inter", sans-serif);
            font-size: 1.8rem;
            font-weight: 800;
            color: #000;
            margin-bottom: 5px;
            text-decoration: none;
            display: inline-block;
        }

        .footer-desc {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #555;
            max-width: 280px;
        }

        .footer-heading {
            color: #00A0C6;
            font-family: var(--font-heading);
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 25px;
        }
        
        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links li {
            margin-bottom: 12px;
        }

        .footer-links a {
            text-decoration: none;
            color: #444;
            font-size: 0.95rem;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: #00A0C6;
            padding-left: 5px; /* Subtle interaction */
        }

        .address-block p {
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.6;
            color: #444;
        }

        .hours-block {
            margin-bottom: 12px;
        }

        .day-label {
            font-weight: 700;
            color: #333;
            font-size: 0.9rem;
            margin-bottom: 4px;
        }

        .time-val {
            font-size: 0.9rem;
            color: #555;
        }

        .footer-text {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #444;
            margin-bottom: 20px;
        }

        .direction-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
        }

        .direction-btn {
            background: white !important;
            border: 1.5px solid #00A0C6 !important;
            color: #00A0C6 !important;
            padding: 8px 16px !important;
            font-size: 0.9rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            border-radius: 50px !important;
            transition: all 0.3s ease !important;
            width: 160px !important;
            justify-content: flex-start !important;
            padding-left: 20px !important;
        }

        .direction-btn:hover {
            background: #00A0C6 !important;
            color: white !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 160, 198, 0.2);
        }

        .btn-icon {
            width: 20px;
            height: 20px;
        }

        .mt-4 {
            margin-top: 1.2rem;
        }

        @media (max-width: 1200px) {
            .footer-grid {
                 grid-template-columns: repeat(3, 1fr);
                 gap: 40px;
            }
            .branding-col {
                grid-column: span 1;
            }
        }

        @media (max-width: 850px) {
             .branding-col {
                grid-column: span 3;
            }
        }

        @media (max-width: 768px) {
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 50px;
            }
            .branding-col {
                grid-column: span 1;
            }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
