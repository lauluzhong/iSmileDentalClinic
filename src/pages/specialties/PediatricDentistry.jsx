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

    const faqs = [
        {
            "q": "When should my child first visit a dentist?",
            "a": "By age 1, or within 6 months of the first tooth appearing — whichever comes first. Early visits let your child become comfortable with the dental environment and allow us to monitor growth from the start."
        },
        {
            "q": "Are baby teeth really that important?",
            "a": "Yes. Baby teeth hold space for adult teeth, guide eruption, and affect speech development. Decay in baby teeth can lead to infection and affect the developing adult teeth underneath."
        },
        {
            "q": "Should I help my child brush?",
            "a": "Yes — young children do not have the fine motor control to brush effectively. We recommend parents brush for the child or do a supervised brush where you go over what they have done. Electric toothbrushes with a timer help make this less of a battle."
        },
        {
            "q": "What are fissure sealants?",
            "a": "Protective coatings applied to the chewing surfaces of back teeth where cavities commonly form. They fill grooves and pits, creating a smooth surface that is easier to clean. A quick, painless procedure that provides years of protection."
        },
        {
            "q": "My child is scared of the dentist. What can I do?",
            "a": "Start young — the earlier the visits, the more comfortable your child becomes. Keep conversations positive, avoid scary words, and do not use the dentist as a threat. At iSmile, we take extra time for first visits and let children explore at their own pace."
        },
        {
            "q": "What is myofunctional screening?",
            "a": "At iSmile, every pediatric check-up includes a basic myofunctional assessment — we observe breathing pattern, tongue posture, lip seal, and whether your child snores or mouth-breathes during sleep. If we find patterns that concern us, we discuss whether a more detailed assessment or ENT referral is warranted."
        }
    ];

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Pediatric Dentistry",
            "description": "Gentle dental care for children in Petaling Jaya at iSmile Dental Clinic. First dental visits, preventive treatments, fissure sealants, and myofunctional screening.",
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
                <meta name="description" content="Gentle dental care for children in Damansara Jaya, Petaling Jaya. First dental visits from age 1, fissure sealants, fluoride treatment, and myofunctional screening." />
                <link rel="canonical" href="https://ismile.com.my/services/children/pediatric-dentistry" />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Users size={16} /> Children's Dentistry</div>
                    <h1>Pediatric Dentistry <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">Gentle dental care for children from their very first tooth onwards. Most of the anxiety about the dentist comes from parents, not children — we work with both of you. A child who comes in at age 1 for a positive first visit grows into a patient who walks in without fear at age 15.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>What to Expect at a Children's Check-Up</h2>
                            <p>Our pediatric visits go beyond just checking for cavities. We look at how the bite is developing, assess habit patterns, and give parents specific practical advice.</p>

                            <div className="tech-feature-list">
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Age-Appropriate Visits</h4>
                                        <p>For toddlers, the first visit may just be a quick peek with the child on parent's lap. For older children, we do a full count, clean, fluoride application, and discussion. We never rush — some kids need two or three visits before they are ready to let us look properly.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Fissure Sealants</h4>
                                        <p>Protective coatings on back teeth where cavities commonly form. A quick, painless procedure that provides years of protection. We recommend this for children from age 6 onwards when adult molars start erupting.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Myofunctional Screening</h4>
                                        <p>Every pediatric check-up at iSmile includes observation of lip seal, tongue posture, and breathing pattern. Mouth breathing in children is more common — and more consequential — than most parents realize. We flag it early and discuss whether further assessment is needed.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Practical Parent Guidance</h4>
                                        <p>We give specific advice, not generic "cut down sugar" guidance. Things like: "Your child has deep grooves on the lower molars — consider sealants when the adult ones come in." Each child gets a personalised prevention plan.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>What We Look For</h3>
                            <ul className="step-list">
                                <li><span>01</span> Tooth count and eruption pattern</li>
                                <li><span>02</span> Decay assessment</li>
                                <li><span>03</span> Bite development</li>
                                <li><span>04</span> Gum health</li>
                                <li><span>05</span> Lip seal and breathing pattern</li>
                                <li><span>06</span> Fluoride application (age 2+)</li>
                                <li><span>07</span> Personalised parent discussion</li>
                            </ul>
                            <p style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>Recommended frequency: every 6 months, or as advised by your dentist.</p>
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
                    <h2>Set your child up for a healthy smile</h2>
                    <p className="mb-4">Book their first visit — or their next one. We make dental care something your child looks forward to, not dreads.</p>
                    <Button onClick={() => openBooking('Pediatric Dentistry for my child', 'specialty-pediatric-dentistry')}>Book Consultation</Button>
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

export default PediatricDentistry;
