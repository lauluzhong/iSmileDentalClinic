import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Star } from 'lucide-react';
import Button from '../../components/Button';

const TeethWhitening = () => {
    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "TeethWhitening",
            "description": "Professional dental treatment at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/replace"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/replace"
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);
        
        return () => {
            document.head.removeChild(script);
        };
    }, []);
    const { openBooking } = useBooking();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Teeth Whitening",
            "description": "Professional teeth whitening treatment at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/enhance"
            },
            "areaServed": {
                "@Type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/enhance"
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);
        
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const faqs = [
        {
            "q": "Why is Take-Home Whitening considered the 'Gold Standard'?",
            "a": "Take-home whitening allows for a gradual, deeper oxidation process. By using custom-fitted trays over 10-14 days, the oxygen molecules penetrate deeper into the tooth structure, leading to more stable protocols and significantly less rebound (yellowing coming back) compared to single-session chair-side whitening."
        },
        {
            "q": "How long do I need to wear the trays each day?",
            "a": "Depending on the concentration prescribed by our doctors, you'll wear the trays for either 30-60 minutes during the day or overnight while you sleep. Most patients achieve their target shade within 2 weeks."
        },
        {
            "q": "Is the whitening gel safe for my gums?",
            "a": "Yes, because our trays are custom-made from 3D scans of your mouth, they are trimmed precisely to your gum line. This prevents the whitening gel from leaking onto the soft tissues, minimizing irritation and ensuring the gel stays exactly where it's needed."
        },
        {
            "q": "What happens if my teeth feel sensitive?",
            "a": "Our prescribed gels contain built-in desensitizers and high water content to prevent dehydration. However, if sensitivity occurs, you can simply skip a night or use a desensitizing gel in your trays. The process is entirely under your control."
        },
        {
            "q": "Will it damage my enamel?",
            "a": "Professional whitening gels are formulated to be pH-neutral and contain minerals that protect the enamel. When used as prescribed, it does not thin or damage the tooth structure."
        }
    ];

    return (
        <div className="specialty-page">
            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Star size={16} /> Professional Gold Standard</div>
                    <h1>Take-Home Teeth Whitening <span>(Customized Precision)</span></h1>
                    <p className="lead">The most effective, stable, and predictable way to brighten your smile. Using laboratory-grade custom trays and prescribed whitening gels for a professional transformation in the comfort of your home.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>The Science of Gradual Whitening</h2>
                            <p>While instant results are popular, true long-term whitening occurs through a sustained oxidation process. Our protocol ensures the deepest stains are removed with minimal sensitivity.</p>

                            <div className="tech-feature-list">
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>3D-Printed Custom Trays</h4>
                                        <p>We use high-precision digital scanners to map your teeth. This ensures a reservoir-perfect fit that holds the gel in place and prevents saliva from diluting the whitening agent.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Prescribed Whitening Chemistry</h4>
                                        <p>We provide medical-grade Carbamide or Hydrogen Peroxide gels with stabilized pH and desensitizers (like Potassium Nitrate and Fluoride) to protect your enamel.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Long-Term Shade Stability</h4>
                                        <p>The gradual process allows for 'enamel re-hydration' between sessions, resulting in a brightness that lasts significantly longer than rapid chair-side treatments.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Prescription Workflow</h3>
                            <ul className="step-list">
                                <li><span>01</span> Comprehensive Oral Health Screening</li>
                                <li><span>02</span> High-Definition 3D Digital Scanning</li>
                                <li><span>03</span> Laboratory Fabrication of Custom Trays</li>
                                <li><span>04</span> Personalized Gel Prescription & Briefing</li>
                                <li><span>05</span> Structured At-Home Whitening (10-14 days)</li>
                                <li><span>06</span> Final Shade Assessment & Maintenance</li>
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
                    <h2>Ready for a lasting transformation?</h2>
                    <p className="mb-4">Consult with our doctors to receive your customized professional whitening kit.</p>
                    <Button onClick={() => openBooking('Interested in Take-Home Whitening', 'specialty-teeth-whitening')}>Get Your Custom Kit</Button>
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

export default TeethWhitening;
