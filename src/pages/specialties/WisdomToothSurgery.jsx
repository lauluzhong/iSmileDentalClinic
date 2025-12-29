import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle } from 'lucide-react';
import Button from '../../components/Button';

const WisdomToothSurgery = () => {
    const { openBooking } = useBooking();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            q: "Why is surgery required instead of a normal extraction?",
            a: "Impacted wisdom teeth are trapped in the jawbone or gums, requiring surgical access. Unlike simple extractions, surgery involves careful tissue management and often sectioning the tooth for a minimally invasive removal."
        },
        {
            q: "What is the recovery timeline?",
            a: "Initial healing and closure of the site take 3-5 days. While most patients return to normal activities within a week, full tissue recovery typically takes about 2 weeks."
        },
        {
            q: "What is 'Dry Socket'?",
            a: "Dry socket is a condition where the protective blood clot dislodges before healing. At iSmile, we use advanced suturing techniques and 'A-PRF' (Platelet-Rich Fibrin) from your own blood to significantly minimize this risk."
        }
    ];

    return (
        <div className="specialty-page">
            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Technical Deep-Dive</div>
                    <h1>Wisdom Tooth Surgery <span>(Odontectomy)</span></h1>
                    <p className="lead">A precise surgical procedure to remove impacted or problematic third molars with clinical accuracy and patient comfort.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>The Science & Tech</h2>
                            <p>Successful wisdom tooth removal relies on advanced diagnostics and surgical precision. At iSmile, we prioritize minimally invasive techniques to ensure the fastest possible recovery.</p>
                            
                            <div className="tech-feature-list">
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Digital Diagnostics</h4>
                                        <p>Comprehensive 3D X-rays (CBCT) allow us to map the exact root position and its proximity to the inferior alveolar nerve.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Tissue Management</h4>
                                        <p>We use precise incisions and piezosurgery (ultrasonic bone cutting) where applicable to minimize trauma to surrounding tissue.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Clinical Workflow</h3>
                            <ul className="step-list">
                                <li><span>01</span> Pre-op 3D Imaging (OPG/CBCT)</li>
                                <li><span>02</span> Anesthesia Injection (Local/Sedation)</li>
                                <li><span>03</span> Surgical Access & Sectioning</li>
                                <li><span>04</span> Socket Debridement & Irrigation</li>
                                <li><span>05</span> A-PRF Placement & Final Suturing</li>
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
                    <Button onClick={() => openBooking('Interested in Wisdom Tooth Surgery')}>Book Consultation</Button>
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
                .feature-icon { color: var(--color-primary); margin-top: 4px; flex-shrink: 0; }
                .feature-text h4 { font-size: 1.25rem; margin-bottom: 8px; font-weight: 700; }
                .tech-meta { padding: 40px; background: white; border: 1px solid rgba(0,0,0,0.05); }
                .step-list { list-style: none; padding: 0; margin-top: 30px; }
                .step-list li { display: flex; align-items: center; gap: 20px; padding: 15px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .step-list li span { font-family: 'Space Grotesk', sans-serif; font-weight: 800; color: var(--color-primary); font-size: 1.2rem; opacity: 0.3; flex-shrink: 0; }
                .faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
                .faq-item { padding: 30px; background: white; }
                .faq-item h4 { margin-bottom: 15px; color: var(--color-primary); }
                
                @media (max-width: 768px) {
                    .tech-grid { grid-template-columns: 1fr; gap: 40px; }
                    .tech-hero { padding: 60px 0; text-align: left; }
                    .tech-hero h1 { font-size: 2.2rem; }
                    .tech-hero h1 span { font-size: 1.3rem; margin-top: 5px; }
                    .tech-hero .lead { font-size: 1.1rem; }
                    
                    .tech-meta { padding: 24px; }
                    .feature-text h4 { font-size: 1.1rem; }
                    .tech-feature { gap: 15px; }
                    
                    .step-list li { gap: 15px; font-size: 0.95rem; }
                    .step-list li span { font-size: 1rem; }
                    
                    .section-padding { padding: 60px 0; }
                }
            `}</style>
        </div>
    );
};

export default WisdomToothSurgery;
