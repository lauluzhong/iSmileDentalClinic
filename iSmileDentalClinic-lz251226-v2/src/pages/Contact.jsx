import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Button from '../components/Button';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="container section-padding" style={{ paddingTop: '180px' }}>
                <div className="contact-content text-center">
                    <h1 className="hero-title mb-4">Get in Touch</h1>
                    <p className="lead-text mb-5">We're here to answer your questions and help you schedule your visit.</p>

                    <div className="info-grid">
                        <div className="info-item">
                            <div className="icon-box"><MapPin /></div>
                            <div>
                                <h4>Visit Us</h4>
                                <p>75 & 75A , Jalan SS 22/23,<br />Damansara Jaya, Petaling Jaya,<br />Malaysia</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box"><Phone /></div>
                            <div>
                                <h4>Call Us</h4>
                                <p>016-322 2135</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="glass-panel" style={{ marginTop: '80px', padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.935105658661!2d101.587!3d3.105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2smy!4v1600000000000!5m2!1sen!2smy"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy">
                    </iframe>
                </div>
            </div>

            <style>{`
          .contact-content {
              max-width: 800px;
              margin: 0 auto;
          }

          .info-grid {
              display: flex;
              flex-wrap: wrap; 
              justify-content: center;
              gap: 40px;
              margin-top: 40px;
          }

          .info-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
              padding: 30px;
              background: rgba(255,255,255,0.8);
              border-radius: 20px;
              min-width: 250px;
          }

          .icon-box {
              width: 60px;
              height: 60px;
              background: var(--color-tint-blue);
              color: var(--color-primary);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
          }
       `}</style>
        </div>
    );
};

export default Contact;
