import React, { useState } from 'react';
import { Clock, Coffee, Wifi, Headphones, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const NewPatients = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        { q: "Do you accept insurance?", a: "We are a fee-for-service practice. We provide detailed receipts which you can submit to your insurance claims." },
        { q: "Where can I park?", a: "There is ample street parking available directly in front of the clinic. We also have reserved spots for patients with mobility issues." },
        { q: "Do you handle emergencies?", a: "Yes, we prioritize dental emergencies and aim to see you on the same day during our operating hours." },
    ];

    return (
        <div className="new-patients-page">
            <div className="hero-section section-padding pb-0" style={{ paddingTop: '160px' }}>
                <div className="container text-center">
                    <h1 className="hero-title">Your First Visit <span className="text-gradient">Feels Different Here</span></h1>
                    <p className="hero-subtitle">No rushing. No judgment. Just you and us.</p>
                </div>
            </div>

            {/* Flow */}
            <div className="container section-padding">
                <h2 className="text-center mb-5" style={{ textAlign: 'center' }}>A Conversation, Not Just an Exam</h2>
                <div className="process-timeline">
                    {[
                        { step: "01", title: "Registration", desc: "Digital forms sent to your phone. Zero paperwork on arrival." },
                        { step: "02", title: "Comprehensive Assessment", desc: "We look at more than just teeth—airway, gums, and bite function." },
                        { step: "03", title: "Discussion", desc: "We sit down (not in the dental chair) to discuss your goals and options." }
                    ].map((item, i) => (
                        <div key={i} className="process-step">
                            <div className="step-number">{item.step}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comfort */}
            <div className="comfort-section section-padding" style={{ background: 'var(--color-tint-blue)' }}>
                <div className="container">
                    <h2 className="text-center mb-5" style={{ textAlign: 'center' }}>Designed for Comfort</h2>
                    <div className="amenities-grid">
                        <div className="glass-panel amenity-card">
                            <Headphones size={32} color="var(--color-primary)" />
                            <h4>Noise-Cancelling Headphones</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Blocks out the noise of the loud dental machines.</p>
                        </div>
                        <div className="glass-panel amenity-card">
                            <Coffee size={32} color="var(--color-primary)" />
                            <h4>Weighted Blankets</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Provides Deep Touch Pressure (DTP), which mimics a comforting hug.</p>
                        </div>
                        <div className="glass-panel amenity-card">
                            <AlertCircle size={32} color="var(--color-primary)" />
                            <h4>"Stop" Signal Policy</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Raise your hand, and we stop. You are in control.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="container section-padding">
                <div className="faq-container">
                    <h2 className="mb-5">Common Questions</h2>
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`glass-panel faq-item ${openFaq === index ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                                <div className="faq-question">
                                    <h4>{faq.q}</h4>
                                    {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {openFaq === index && <div className="faq-answer">{faq.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
          .process-timeline {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 40px;
              text-align: center;
          }

          .step-number {
              font-size: 3rem;
              font-weight: 700;
              color: #00A0C6; /* Cyan to match title */
              margin-bottom: 20px;
          }

          .amenities-grid {
              display: flex;
              justify-content: center;
              gap: 30px;
              flex-wrap: wrap;
          }

          .amenity-card {
              padding: 30px;
              text-align: center;
              min-width: 250px;
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
          }

          .faq-container {
              max-width: 800px;
              margin: 0 auto;
          }

          .faq-list {
              width: 100%;
          }

          .faq-item {
              margin-bottom: 20px;
              cursor: pointer;
              transition: all 0.3s;
          }

          .faq-question {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px;
          }
          
          .faq-question h4 {
              margin: 0;
          }
          
          .faq-answer {
              padding: 0 20px 20px;
              color: var(--color-text-muted);
              border-top: 1px solid rgba(0,0,0,0.05);
              padding-top: 20px;
          }
       `}</style>
        </div>
    );
};

export default NewPatients;
