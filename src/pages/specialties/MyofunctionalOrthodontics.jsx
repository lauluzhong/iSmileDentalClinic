import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Users } from 'lucide-react';
import Button from '../../components/Button';

const MyofunctionalOrthodontics = () => {
    const { openBooking } = useBooking();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            "q": "Is it better than braces?",
            "a": "It addresses the root cause (muscles, breathing dysfunction, poor bone loading), whereas braces only treat the symptoms (teeth). Often, it reduces or eliminates the need for future braces."
        },
        {
            "q": "What age is best to start?",
            "a": "Ideally as soon as possible, while the jaw is still actively growing and habits are easier to retrain. Depending on the assessment conducted and appliance that is prescribed, the dentist will advise you on how best to guide your child's jaw growth and development."
        },
        {
            "q": "What does the patient have to do?",
            "a": "Wear the appliance for 1-2 hours during the day and overnight, plus perform daily 5-minute muscle exercises."
        },
        {
            "q": "How soon can we see results?",
            "a": "Visible changes in oral habits (like lip seal and nasal breathing) can often be seen within 6 months, while structural changes in the jaw guide evolve over 1-2 years."
        },
        {
            "q": "Does my child need to wear it at school?",
            "a": "No, the appliance is typically worn for only 1-2 hours during the day (at home) and overnight while sleeping."
        }
    ];

    return (
        <div className="specialty-page">
            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Technical Deep-Dive</div>
                    <h1>Myofunctional Orthodontics <span>(Early Growth Guidance)</span></h1>
                    <p className="lead">A 'Pre-Orthodontic' treatment focusing on correcting the underlying causes of crooked teeth—poor oral habits like mouth breathing and tongue thrusting.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>The Science & Tech</h2>
                            <p>We leverage advanced clinical protocols and digital technology to provide predictable, high-quality outcomes for our patients.</p>

                            <div className="tech-feature-list">

                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Muscle Retraining</h4>
                                        <p>Uses specialized appliances to train the tongue to rest on the roof of the mouth and establish natural lip seal.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Airway Health</h4>
                                        <p>Focuses on establishing nasal breathing, which is crucial for proper facial growth and preventing sleep-disordered breathing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Clinical Workflow</h3>
                            <ul className="step-list">
                                <li><span>01</span> Thorough Assessment of medical, birth and child developmental history</li>
                                <li><span>02</span> Oral Myofunctional Assessment</li>
                                <li><span>03</span> Airway & Sleep Screening</li>
                                <li>
                                    <span>04</span>
                                    <div>
                                        Customized Appliance Selection
                                        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>
                                            e.g. Expanders, Mandibular Advancers, Maxillary Protractor, Munchees, Myofunctional Appliances ie LM Activator, Braces, Clear Aligners
                                        </div>
                                    </div>
                                </li>
                                <li><span>05</span> Monthly Muscle Exercise Programs</li>
                                <li><span>06</span> Progress Tracking & Growth Monitoring</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-section section-padding" style={{ background: '#f8f9fa' }}>
                <div className="container">
                    <h2 className="text-center mb-5" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}><HelpCircle size={32} /> Common Questions</h2>
                    <div className="faq-grid">
                        {faqs.map((faq, i) => (
                            <div key={i} className="faq-item glass-panel">
                                <h4>{faq.q}</h4>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding text-center">
                <div className="container">
                    <h2>Consult with our specialists today</h2>
                    <p className="mb-4">Get a professional assessment based on your unique dental structure.</p>
                    <Button onClick={() => openBooking('Interested in  Myofunctional Orthodontics')}>Book Consultation</Button>
                </div>
            </section>

            <style>{`
                .specialty-page { padding-top: 100px; }
                .tech-hero { padding: 80px 0; background: #1a1a1a; color: white; text-align: left; }
                .tech-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: var(--color-secondary); }
                .tech-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color: white; }
                .tech-hero h1 span { font-weight: 400; opacity: 0.6; font-size: 2rem; display: block; }
                .tech-hero .lead { font-size: 1.3rem; max-width: 800px; opacity: 0.9; }
                .tech-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 60px; align-items: start; }
                .tech-feature-list { margin-top: 40px; }
                .tech-feature { display: flex; gap: 20px; margin-bottom: 30px; }
                .feature-icon { color: var(--color-primary); margin-top: 4px; }
                .feature-text h4 { font-size: 1.25rem; margin-bottom: 8px; font-weight: 700; }
                .tech-meta { padding: 40px; background: white; border: 1px solid rgba(0,0,0,0.05); }
                .step-list { list-style: none; padding: 0; margin-top: 30px; }
                .step-list li { display: flex; align-items: center; gap: 20px; padding: 15px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .step-list li span { font-family: 'Space Grotesk', sans-serif; font-weight: 800; color: var(--color-primary); font-size: 1.2rem; opacity: 0.3; }
                .faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
                .faq-item { padding: 30px; background: white; }
                .faq-item h4 { margin-bottom: 15px; color: var(--color-primary); }
                @media (max-width: 1024px) {
                    .specialty-page { padding-top: 80px; }
                    .tech-hero { padding: 60px 0; }
                    .tech-hero h1 { font-size: 2.2rem; line-height: 1.1; margin-bottom: 16px; }
                    .tech-hero h1 span { font-size: 1.25rem; margin-top: 4px; }
                    .tech-hero .lead { font-size: 1rem; line-height: 1.5; }
                    
                    .tech-grid { grid-template-columns: 1fr; gap: 40px; }
                    .tech-info h2 { font-size: 1.8rem; margin-bottom: 16px; }
                    .tech-feature-list { margin-top: 30px; }
                    .tech-feature { gap: 16px; margin-bottom: 24px; }
                    .feature-text h4 { font-size: 1.1rem; margin-bottom: 4px; }
                    .feature-text p { font-size: 0.95rem; line-height: 1.5; }
                    
                    .tech-meta { padding: 24px; border-radius: 20px; }
                    .tech-meta h3 { font-size: 1.3rem; }
                    .step-list li { padding: 12px 0; gap: 16px; font-size: 0.95rem; }
                    .step-list li span { font-size: 1rem; }
                    
                    .faq-grid { gap: 20px; margin-top: 30px; }
                    .faq-item { padding: 24px; border-radius: 20px; }
                    .faq-item h4 { font-size: 1.05rem; line-height: 1.4; }
                    .faq-item p { font-size: 0.95rem; line-height: 1.5; }
                    
                    .section-padding { padding: 40px 0; }
                }
            `}</style>
        </div>
    );
};

export default MyofunctionalOrthodontics;
