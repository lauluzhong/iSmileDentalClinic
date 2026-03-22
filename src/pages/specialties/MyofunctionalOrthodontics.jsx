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
            "q": "Is it better than braces?",
            "a": "It addresses the root cause — muscle patterns, breathing dysfunction, poor bone loading — whereas braces only treat the symptoms (tooth position). Often, it reduces or eliminates the need for future braces. We sometimes work with braces as a combined approach when the situation calls for it."
        },
        {
            "q": "What age is best to start?",
            "a": "Around 6–7 years old, when the first adult molars and front teeth are typically visible. This is early enough to intercept habit patterns before they become structural problems. Your dentist will assess your child's specific growth stage and recommend the right timing."
        },
        {
            "q": "What does the patient have to do?",
            "a": "Wear the appliance 1–2 hours during the day and overnight while sleeping. Plus daily myofunctional exercises — short routines that retrain muscle patterns. Your dentist will advise on the specific wearing schedule for your child's case."
        },
        {
            "q": "How soon can we see results?",
            "a": "Visible changes in oral habits — lip seal, nasal breathing — can often be seen within 6 months. Structural changes in the jaw develop over 12–24 months, depending on severity and compliance."
        },
        {
            "q": "Does my child need to wear it at school?",
            "a": "Typically not for most of the school day. The main wear is overnight during sleep, plus 1–2 hours during quiet activities at home (reading, homework, screen time)."
        },
        {
            "q": "My child has thumb-sucking habit. Can Myobrace help?",
            "a": "Yes. Myobrace makes thumb-sucking physically awkward during the critical night hours when habits consolidate. We also address the habit directly with counseling and myofunctional exercises."
        },
        {
            "q": "Is it uncomfortable?",
            "a": "Most children adapt within the first 1–2 weeks. It's bulkier than nothing, but it's soft silicone, not metal. Children who breathe through their mouth often notice they sleep better once they start wearing it — which tends to be motivating."
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
                    <div className="tech-badge"><Shield size={16} /> Myobrace System</div>
                    <h1>Myofunctional Orthodontics <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">Myobrace is a removable, functional brace worn mostly at night that gently guides jaw development and habit correction. At iSmile, every child's first visit includes a myofunctional screening — we look at lip seal, tongue posture, breathing pattern, and tonsil size to understand why the bite went off track in the first place.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>How Myobrace Works</h2>
                            <p>Myobrace corrects the muscle patterns, breathing habits, and oral posture that cause bite problems — working upstream rather than just moving teeth downstream. Think of it like fixing the soil before planting rather than just pruning a crooked tree.</p>

                            <div className="tech-feature-list">
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>The Myobrace System</h4>
                                        <p>One of the most researched myofunctional appliances globally. A removable, functional brace that guides jaw development and habit correction — worn mostly at night plus 1–2 hours during the day.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Habit Correction</h4>
                                        <p>Corrects mouth breathing, tongue posture, lip seal, and swallowing pattern — the root causes of jaw underdevelopment and crowding that braces alone can't fix.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>The Airway Connection</h4>
                                        <p>Mouth breathing in children is far more common — and consequential — than most parents realize. A narrow palate means a narrowed nasal airway. We flag mouth breathing early and discuss whether an ENT referral is needed alongside our work.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Why Early Intervention Matters</h4>
                                        <p>Between ages roughly 5 and 12, the jaw is still malleable. After 12, growth slows dramatically and the window for non-surgical jaw expansion largely closes. Small interventions at 7 can produce structural changes that surgery can't replicate later.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Treatment Process</h3>
                            <ul className="step-list">
                                <li><span>01</span> Full myofunctional assessment — lip seal, breathing, tonsils, tongue posture</li>
                                <li><span>02</span> Custom Myobrace appliance ordering (typically arrives within 2 weeks)</li>
                                <li><span>03</span> Night wear (every night during sleep) + 1–2 hours daytime quiet activities</li>
                                <li><span>04</span> Regular check-ins every 6–8 weeks — monitor progress, adjust appliance</li>
                                <li><span>05</span> Myofunctional exercises — short daily routines retrain muscle patterns</li>
                                <li><span>06</span> Retention phase — transition to retainer, assessed individually</li>
                            </ul>
                            <p style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>Typical treatment duration: 12–24 months, depending on severity and compliance.</p>
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
                    <h2>Find out if Myobrace is right for your child</h2>
                    <p className="mb-4">If your child is between 5 and 12 and you've noticed anything — mouth breathing, teeth crowding, thumb-sucking, snoring, difficulty concentrating — it's worth a conversation.</p>
                    <Button onClick={() => openBooking('Interested in Myofunctional Orthodontics', 'specialty-myofunctional')}>Book Consultation</Button>
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
                .faq-item { padding: 24px; border-radius: 16px; }
                .faq-item h4 { margin-bottom: 15px; color: var(--color-primary); }
                .faq-item p { font-size: 0.95rem; line-height: 1.6; opacity: 0.9; }
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
