import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Footer = () => {
    const { openBooking } = useBooking();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Column 1: Brand & Intro */}
                    <div className="footer-col branding-col">
                        <Link to="/" className="footer-logo"><img src="/logo.png" alt="iSmile" style={{ height: "110px", width: "auto" }} /></Link>
                        <p className="footer-desc">
                            We are ready to help you smile with confidence. At iSmile Dental, we are dedicated to providing comprehensive dental care for the entire family.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col links-col">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/reviews">Reviews</Link></li>
                            <li><Link to="/blog">Learning Centre</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
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
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                                </svg>
                                Google Maps
                             </Button>
                             <Button 
                                className="direction-btn waze-btn"
                                onClick={() => window.open('https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location', '_blank')}
                             >
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.8 11.5c-1.5-1.5-3.5-2.3-5.6-2.3-1.8 0-3.5.6-4.9 1.7L6.4 9.1c.3-.6.5-1.2.5-1.9 0-2.2-1.8-4-4-4S-1 5-1 7.2c0 2.2 1.8 4 4 4 .7 0 1.3-.2 1.9-.5l1.8 1.9c-1.1 1.4-1.7 3.1-1.7 4.9 0 4.4 3.6 8 8 8 2.1 0 4.1-.8 5.6-2.3 1.5-1.5 2.3-3.5 2.3-5.6 0-2.2-.8-4.2-2.1-5.6zm-14.8-1c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" fill="#33CCFF"/>
                                </svg>
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
            justify-content: center !important;
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
