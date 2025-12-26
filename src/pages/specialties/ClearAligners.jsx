import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import Button from '../../components/Button';

const ClearAligners = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
                "q": "How many hours a day must I wear them?",
                "a": "For clinical success, 20\u201322 hours per day is required. They should only be removed for eating, drinking (except water), and oral hygiene."
        },
        {
                "q": "Does it affect speech?",
                "a": "A minor lisp may occur for the first 48 hours as the tongue adapts to the aligner thickness, but this typically resolves quickly."
        },
        {
                "q": "Can I eat with them?",
                "a": "No, aligners must be removed during meals to prevent staining, damage, and ensuring proper oral hygiene."
        }
];

    return (
        <div className="specialty-page">
            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Technical Deep-Dive</div>
                    <h1>Clear Aligners <span>(Invisalign / Clearsmile)</span></h1>
                    <p className="lead">A modern orthodontic solution using a series of custom-made, transparent plastic trays to gradually shift teeth into alignment without the need for traditional braces.</p>
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
                                        <h4>SmartTrack Material</h4>
                                        <p>Utilizes a patented multi-layer medical-grade polymer designed for constant, gentle force and superior control of tooth movements.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Digital Workflow</h4>
                                        <p>High-precision 3D intraoral scanning eliminates the need for messy impressions and allows for precise treatment planning.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Clinical Workflow</h3>
                            <ul className="step-list">
                                                                <li><span>01</span> 3D Intraoral Scanning & Digital Impressions</li>
                                <li><span>02</span> ClinCheck® Software Treatment Planning</li>
                                <li><span>03</span> Custom Aligner Fabrication & Delivery</li>
                                <li><span>04</span> SmartForce® Attachment Placement</li>
                                <li><span>05</span> Monitoring & Periodic Progress Tracking</li>

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
                    <Button onClick={() => window.open('https://wa.me/6013222135', '_blank')}>Book Consultation</Button>
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
                @media (max-width: 768px) {
                    .tech-grid { grid-template-columns: 1fr; }
                    .tech-hero h1 { font-size: 2.5rem; }
                    .tech-hero h1 span { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default ClearAligners;
