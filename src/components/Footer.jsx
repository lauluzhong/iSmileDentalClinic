import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Column 1: Visit Us */}
                    <div className="footer-col text-center">
                        <h4 className="footer-heading">Visit Us</h4>
                        <p className="footer-text">
                            We are ready to help you smile with<br />confidence.
                        </p>
                        <div className="address-block">
                            <strong>Address:</strong><br />
                            75 & 75A , Jalan SS 22/23,<br />
                            Damansara Jaya, Petaling Jaya,<br />
                            Malaysia
                        </div>
                        <div className="mt-custom">
                            <Button style={{ background: '#00A0C6', border: 'none', padding: '10px 30px' }}>Get Directions</Button>
                        </div>
                    </div>

                    {/* Column 2: Opening Hours */}
                    <div className="footer-col text-center">
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

                    {/* Column 3: Book Appointment */}
                    <div className="footer-col text-center">
                        <h4 className="footer-heading">Book Appointment</h4>
                        <p className="footer-text">
                            Ready to schedule your visit?
                        </p>
                        <div style={{ marginTop: '80px' }}>
                            {/* Spacer to push button down similar to screenshot */}
                            <Button style={{ background: '#00A0C6', border: 'none', padding: '10px 40px' }} onClick={() => window.open('https://wa.me/6013222135', '_blank')}>Book Now</Button>
                        </div>
                    </div>

                    {/* Column 4: Location Map */}
                    <div className="footer-col">
                        <h4 className="footer-heading text-center">Location</h4>
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.935105658661!2d101.587!3d3.105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2smy!4v1600000000000!5m2!1sen!2smy"
                                width="100%"
                                height="200"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
        .footer {
            background-color: #E6EEF5; /* Light blue/grey background from screenshot */
            padding: 60px 0 60px;
            color: #333;
            font-family: var(--font-body);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 40px;
            align-items: start;
        }

        .footer-col {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .footer-heading {
            color: #00A0C6; /* Cyan color from screenshot */
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .footer-text {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #333;
            font-weight: 500;
        }

        .address-block {
            font-size: 1rem;
            line-height: 1.6;
            color: #333;
            font-weight: 500;
        }

        .hours-block {
            margin-bottom: 20px;
        }

        .day-label {
            font-weight: 700;
            color: #000;
            margin-bottom: 4px;
        }

        .time-val {
            font-weight: 400;
            color: #333;
        }
        
        .map-container {
             width: 100%;
             border-radius: 12px;
             overflow: hidden;
             box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .mt-custom {
            margin-top: 60px; /* Increased spacing */
        }

        @media (max-width: 768px) {
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 60px;
            }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
