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
            "url": "https://ismile.com.my/services/children"
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
            "q": "What is myofunctional orthodontics and how does it work?",
            "a": "Myofunctional orthodontics uses removable functional braces, typically worn at night, to address the root causes of jaw and teeth development issues. Instead of just moving teeth after they have already gone off course, this approach works on the muscle patterns, breathing habits, and oral posture that influence how the jaw develops. At iSmile Dental Clinic, each case starts with a thorough assessment covering medical history, developmental milestones, and an oral myofunctional evaluation."
        },
        {
            "q": "What dental issues can myofunctional orthodontics address in children?",
            "a": "The main focus areas include lip seal correction, training the tongue to rest on the roof of the mouth, establishing nasal breathing, and correcting swallowing patterns. The treatment also screens for mouth breathing and sleep-related breathing concerns that can affect facial growth and dental development. These patterns are evaluated during the initial assessment before any appliance is recommended."
        },
        {
            "q": "What does myofunctional orthodontic treatment involve?",
            "a": "The treatment follows a structured process: a thorough assessment of medical and developmental history, an oral myofunctional assessment, airway and sleep screening, customized appliance selection, monthly muscle exercise programs, and ongoing progress tracking with growth monitoring. The whole approach is designed to guide natural jaw development gradually, rather than force teeth into position."
        },
        {
            "q": "What types of appliances are used in myofunctional orthodontics?",
            "a": "Several appliances may be used depending on the assessment findings, including expanders, mandibular advancers, maxillary protractors, munchees, and myofunctional appliances like the LM Activator. Braces or clear aligners may also be recommended later if needed. The dentist selects the appliance based on the child's growth stage and specific developmental needs identified during assessment."
        },
        {
            "q": "At what age can children start myofunctional orthodontic treatment?",
            "a": "Treatment typically works best while the jaw is still actively growing, which for many children means roughly between the ages of 5 and 12. The dentist will evaluate growth phase and developmental readiness during the initial consultation. Starting early may help the jaw develop in a way that creates more space for teeth and could reduce the need for extensive treatment later on."
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
                <title>Myofunctional Orthodontics for Children Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Myofunctional orthodontic treatment for children in Damansara Jaya, Petaling Jaya. Early intervention for healthy jaw development & natural teeth alignment." />
                <link rel="canonical" href="https://ismile.com.my/services/children/myofunctional" />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Technical Deep-Dive</div>
                    <h1>Myofunctional Orthodontics <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">Myofunctional orthodontics addresses the root causes of jaw underdevelopment and crowding by correcting muscle patterns, breathing habits, and oral posture. At iSmile, we use removable functional braces worn mostly at night that gently guide jaw development and habit correction.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>The Science & Tech</h2>
                            <p>Instead of just moving teeth after they have gone off course, myofunctional orthodontics works upstream to address why the bite problem developed in the first place.</p>

                            <div className="tech-feature-list">

                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Muscle Retraining</h4>
                                        <p>Uses specialized appliances to train the tongue to rest on the roof of the mouth, establish proper lip seal, and correct swallowing patterns.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Airway & Breathing Health</h4>
                                        <p>Focuses on establishing nasal breathing, which is important for proper facial growth and may help with sleep quality. We screen for mouth breathing patterns at every assessment.</p>
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
