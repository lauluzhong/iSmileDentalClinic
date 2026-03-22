import { Helmet } from 'react-helmet-async';
import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Users } from 'lucide-react';
import Button from '../../components/Button';

const MyofunctionalOrthodontics = () => {
    const { openBooking } = useBooking();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Myofunctional Orthodontics",
            "description": "Early orthodontic treatment for children at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/children"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/children/myobrace"
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
            "q": "At what age should I bring my child for myofunctional assessment?",
            "a": "We recommend around age 6–7, when the first adult molars and front teeth are typically visible. This is early enough to intercept habit patterns before they become structural problems."
        },
        {
            "q": "Will my child need braces later if they do Myobrace first?",
            "a": "Possibly, but likely far less treatment than if you did nothing now. Some children who complete Myobrace treatment with good habit correction need only minor cosmetic alignment later. Others still benefit from braces but for a shorter duration. Your dentist will give you honest guidance either way."
        },
        {
            "q": "Is Myobrace uncomfortable?",
            "a": "Most children adapt within the first couple of weeks. It's bulkier than nothing, but it's soft silicone, not metal. We find that children who've been mouth breathing often notice they sleep better once they start wearing it, which tends to be motivating."
        },
        {
            "q": "My child has thumb-sucking habit. Can Myobrace help?",
            "a": "Yes, one of the things Myobrace does is make thumb-sucking physically awkward during the night hours when habits consolidate. We may also address the habit directly with counseling and myofunctional exercises."
        },
        {
            "q": "My child is already 10. Is it too late?",
            "a": "It depends on growth stage. We assess each child individually with a growth check. Some 10-year-olds still have significant growth remaining; others are approaching the end of the interceptive window. Come in and we'll tell you honestly."
        }
    ];

    // Add FAQ schema for SEO
    useEffect(() => {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(faqSchema);
        document.head.appendChild(script);
        
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div className="specialty-page">
            <Helmet>
                <title>Myobrace for Children Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Myobrace orthodontic treatment for children in Damansara Jaya, Petaling Jaya. Early intervention for healthy jaw development & natural teeth alignment." />
                <link rel="canonical" href="https://ismile.com.my/services/children/myobrace" />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Technical Deep-Dive</div>
                    <h1>Myofunctional Orthodontics <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">Myofunctional orthodontics isn't just "braces for kids" — it's a fundamentally different approach that corrects the muscle patterns, breathing habits, and oral posture causing the bite problem at its root. The goal isn't just straight teeth. It's a child who breathes through their nose, rests their tongue properly on the palate, and has a wide enough airway to sleep deeply and focus at school.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>Why Children Are the Ideal Patients</h2>
                            <p>Between ages roughly 5 and 12, a child's jaw is still malleable — the interceptive treatment window when small interventions produce outsized results. The human face grows most rapidly before age 12. After that, growth slows dramatically and the window for non-surgical jaw expansion largely closes. By the time many teenagers reach us at 14 or 15, significant jaw underdevelopment may only be corrected through surgery. But at 7? A myofunctional appliance combined with habit correction can genuinely expand a narrow palate, open an airway, and redirect jaw growth.</p>

                            <div className="tech-feature-list">

                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Habit Correction</h4>
                                        <p>Corrects mouth breathing, tongue posture, lip seal, and swallowing pattern — the upstream causes of orthodontic problems. Once these are corrected, teeth tend to drift into better positions naturally with minimal mechanical assistance.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>The Airway Connection</h4>
                                        <p>Mouth breathing triggers a chain reaction: tongue sits low, palate doesn't get stimulated, upper jaw doesn't develop fully, arch is too small for adult teeth, leading to crowding. We screen for this at every first visit and refer to ENT if needed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Treatment Process at iSmile</h3>
                            <ul className="step-list">
                                <li><span>01</span> Initial consultation — full myofunctional assessment (free first visit)</li>
                                <li><span>02</span> Custom Myobrace appliance fitting (arrives within ~2 weeks)</li>
                                <li><span>03</span> Night wear (during sleep) + 1–2 hours daytime quiet activities</li>
                                <li><span>04</span> Regular check-ins with habit tracking and appliance adjustments</li>
                                <li><span>05</span> Retention phase — transition to retainer as needed</li>
                                <li>
                                    <span>06</span>
                                    <div>
                                        Typical treatment duration
                                        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>
                                            12 to 24 months depending on severity and compliance
                                        </div>
                                    </div>
                                </li>
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
                    <Button onClick={() => openBooking('Interested in  Myofunctional Orthodontics', 'specialty-myofunctional')}>Book Consultation</Button>
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
