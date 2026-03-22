import { Helmet } from 'react-helmet-async';
import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Users } from 'lucide-react';
import Button from '../../components/Button';

const PediatricDentistry = () => {
    const { openBooking } = useBooking();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Pediatric Dentistry",
            "description": "Gentle dental care for children in Petaling Jaya. First dental visits, preventive treatments, and child-friendly care at iSmile Dental Clinic.",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/children"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/children/pediatric-dentistry"
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
            "q": "What age should a child stop using a bottle?",
            "a": "Around 12–14 months is the recommended target. After that, bottle use — especially at night — may be one of the leading causes of early childhood caries. Transition to a cup."
        },
        {
            "q": "My child is afraid of the dentist. What do I do?",
            "a": "This is very common, especially if they've had a negative experience elsewhere. Our approach is gradual desensitization. We don't force anything. Some children need a couple of visits before we're even looking in their mouth properly. That's okay. The goal is a child who trusts us and is willing to come back."
        },
        {
            "q": "When do baby teeth fall out?",
            "a": "Most children start losing front teeth around age 6–7, and back molars around age 10–12. The full adult dentition (28 teeth, minus wisdom teeth) is usually in around age 12–13. We track this at every visit and flag if something seems early or late."
        },
        {
            "q": "Should I help my child brush?",
            "a": "Yes, young children don't have the fine motor control to brush effectively. We recommend parents brush for the child or do a "supervised brush" where you go over what they've done. Electric toothbrushes with a timer help make this less of a battle."
        },
        {
            "q": "What are dental sealants and does my child need them?",
            "a": "Sealants are a thin protective coating applied to the chewing surfaces of back molars — the areas most prone to cavities because food gets trapped in the grooves. We typically recommend them when adult molars erupt (around age 6–7) and again for the 12-year molars. It's a quick, painless procedure with strong evidence for cavity prevention."
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
                <title>Pediatric Dentistry Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Gentle dental care for children in Damansara Jaya, Petaling Jaya. First dental visits, fissure sealants, fluoride treatment & child-friendly care." />
                <link rel="canonical" href="https://ismile.com.my/services/children/pediatric-dentistry" />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Users size={16} /> Children's Dentistry</div>
                    <h1>Pediatric Dentistry <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">Tooth decay can start the moment a tooth erupts, and baby teeth aren't throwaway teeth — they hold space for adult teeth, guide eruption, and affect speech development. But beyond the clinical reason, there's a practical one: the earlier a child visits, the more comfortable they become. An 18-month-old who comes in for a quick, positive first visit grows into a 5-year-old who walks in without fear.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>What Happens at a Children's Check-Up at iSmile</h2>
                            <p>We start seeing children young — some before their first birthday. For each visit: we ask about brushing habits and diet; count teeth and check for decay; assess how the bite is developing; do a gentle clean if appropriate; apply fluoride varnish to strengthen enamel; then discuss findings with parents. Every pediatric check-up also includes our myofunctional screening — we observe breathing pattern, tongue posture, and lip seal at rest, and flag any concerns.</p>

                            <div className="tech-feature-list">

                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Myofunctional Screening Included</h4>
                                        <p>Can your child breathe through their nose comfortably with lips closed? Does their tongue rest on the roof of the mouth or the floor? We flag mouth-breathing patterns and discuss whether a detailed assessment or ENT referral is warranted.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Common Issues We Address</h4>
                                        <p>Early childhood caries (bottle tooth decay), thumb-sucking and pacifier habits beyond age 4, crowding and spacing, enamel hypoplasia, dental trauma, and tongue-tie/lip-tie. We assess for all of these routinely at every visit.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Children's Services at iSmile</h3>
                            <ul className="step-list">
                                <li><span>01</span> First dental visit — low-key, parent on lap, just a quick peek</li>
                                <li><span>02</span> Dental check-up — counting teeth, decay check, bite assessment</li>
                                <li><span>03</span> Gentle cleaning and fluoride application</li>
                                <li><span>04</span> Myofunctional screening — breathing, tongue posture, lip seal</li>
                                <li><span>05</span> Parent discussion — practical advice specific to your child</li>
                                <li><span>06</span> Tongue-tie / lip-tie assessment and simple release (frenectomy)</li>
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
                    <h2>Start your child on a healthy smile</h2>
                    <p className="mb-4">Book their first visit and set them up for a lifetime of great dental health.</p>
                    <Button onClick={() => openBooking('Pediatric Dentistry for my child', 'specialty-pediatric-dentistry')}>Book Consultation</Button>
                </div>
            </section>

            <style>{`
                .specialty-page { padding-top: 100px; }
                .tech-hero { padding: 80px 0; background: #1a1a1a; color: white; text-align: left; }
                .tech-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: var(--color-secondary); }
                .tech-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color: white; }
                .tech-hero h1 span { font-weight: 400; opacity: 0.6; font-size: 2rem; display: block; }
                .tech-hero .h1-sub { font-weight: 400; opacity: 0.6; font-size: 2rem; display: block; }
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

export default PediatricDentistry;
