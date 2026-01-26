import React from 'react';
import { MapPin, Phone, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';

const Contact = () => {
    const navigate = useNavigate();
    
    return (
        <div className="contact-page">
            <div className="container section-padding" style={{ paddingTop: '180px' }}>
                <div className="contact-content text-center">
                    <Reveal width="100%">
                        <h1 className="hero-title mb-4" style={{ fontSize: "3rem", fontWeight: 700 }}>Get in <span className="text-gradient">Touch</span></h1>
                    </Reveal>
                    <Reveal delay={0.2} width="100%">
                        <p className="lead-text mb-5" style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '800px', margin: '20px auto 40px', lineHeight: '1.6' }}>We're here to answer your questions and help you schedule your visit.</p>
                    </Reveal>

                    <div className="info-grid">
                        <div className="info-item">
                            <div className="icon-box"><MapPin /></div>
                            <div>
                                <h4>Visit Us</h4>
                                <p>75 & 75A , Jalan SS 22/23,<br />Damansara Jaya, Petaling Jaya,<br />Malaysia</p>
                                <div className="contact-direction-buttons mt-4">
                                    <Button
                                        className="contact-direction-btn google-btn"
                                        onClick={() => window.open('https://maps.app.goo.gl/yt8MxXDpDxXgXqre6', '_blank')}
                                    >
                                        <img src="/images/google-maps.png" alt="Google Maps" className="btn-icon" />
                                        Google Maps
                                    </Button>
                                    <Button
                                        className="contact-direction-btn waze-btn"
                                        onClick={() => window.open('https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location', '_blank')}
                                    >
                                        <img src="/images/waze.png" alt="Waze" className="btn-icon" />
                                        Waze
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box"><Phone /></div>
                            <div>
                                <h4>Contact Us</h4>
                                <p><a href="tel:+60163222135" className="phone-link">+60 16 322 2135</a></p>
                                <div className="contact-direction-buttons mt-4">
                                    <Button 
                                        className="contact-direction-btn"
                                        onClick={() => window.open('https://wa.me/60163222135', '_blank')}
                                    >
                                        <Phone size={18} />
                                        Get In Touch With Us
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box"><HelpCircle /></div>
                            <div>
                                <h4>FAQ</h4>
                                <p>Find answers to common questions about our services and policies.</p>
                                <div className="contact-direction-buttons mt-4">
                                    <Button 
                                        className="contact-direction-btn"
                                        onClick={() => navigate('/faq')}
                                    >
                                        <HelpCircle size={18} />
                                        View FAQ
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="glass-panel" style={{ marginTop: '80px', padding: 0, overflow: 'hidden', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.584482197798!2d101.606!3d3.1258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4936fefe2c33%3A0x381bee2fa94d3505!2siSmile%20Dental%20Clinic%2C%2075%20%26%2075A%20Jalan%20SS%2022%2F23%2C%20Damansara%20Jaya!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy"
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
              max-width: 1200px;
              margin: 0 auto;
          }

          .info-grid {
              display: flex;
              flex-wrap: wrap; 
              justify-content: center;
              gap: 30px;
              margin-top: 40px;
          }

          .info-item {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
              padding: 40px;
              background: rgba(255,255,255,0.9);
              border-radius: 20px;
              min-width: 320px;
              flex: 1;
              max-width: 400px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
              transition: transform 0.3s ease;
              text-align: left;
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

          .contact-direction-buttons {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-top: 25px;
              align-items: flex-start;
          }

          .contact-direction-btn {
              background: white !important;
              border: 1px solid #e2e8f0 !important;
              color: #475569 !important;
              padding: 10px 20px !important;
              font-size: 0.9rem !important;
              display: flex !important;
              align-items: center !important;
              gap: 10px !important;
              border-radius: 12px !important;
              transition: all 0.2s ease !important;
              width: 180px !important;
              justify-content: flex-start !important;
              padding-left: 20px !important;
              box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
          }

          .contact-direction-btn:hover {
              border-color: var(--color-primary, #00A0C6) !important;
              color: var(--color-primary, #00A0C6) !important;
              background: #f0f9ff !important;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 160, 198, 0.1);
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
              text-decoration: underline;
          }

          .btn-icon {
              width: 20px;
              height: 20px;
          }


          .mt-4 {
              margin-top: 1rem;
          }

          @media (max-width: 1024px) {
              .contact-content { padding: 0 20px; }
              .info-grid { flex-direction: column; gap: 20px; }
              .info-item { 
                  width: 100%; 
                  max-width: 100%; 
                  min-width: auto; 
                  padding: 30px; 
                  margin: 0;
              }
              .section-padding { padding-top: 100px !important; }
              .hero-title { font-size: 2.5rem !important; margin-bottom: 20px !important; }
              .lead-text { font-size: 1rem !important; margin-bottom: 30px !important; }
              
              .contact-direction-buttons { 
                  width: 100%; 
                  flex-direction: row;
                  justify-content: space-between; /* Use space-between or center with gap */
                  gap: 15px; 
              }
              .contact-direction-btn { 
                  flex: 1; /* Allow buttons to grow and fill space equally */
                  width: auto !important; /* Override the desktop fixed width */
                  justify-content: center !important; 
                  padding: 10px 10px !important;
                  text-align: center;
              }
          }
       `}</style>
        </div>
    );
};

export default Contact;
