import { Helmet } from 'react-helmet-async';
import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import Button from '../../components/Button';

const ClearAligners = () => {
    const { openBooking } = useBooking();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            "q": "Are clear aligners really invisible?",
            "a": "Almost invisible is more accurate — they're not braces-on-teeth visible, but up close people can usually see them, especially under certain lighting. Most adults and teens find this acceptable."
        },
        {
            "q": "Does it hurt?",
            "a": "You'll feel pressure for the first day or two after switching to a new tray — that's the tooth movement happening. It's not sharp pain, but it's noticeable. Most patients describe it as uncomfortable but manageable and say they get used to it quickly."
        },
        {
            "q": "Can my teenager lose aligners?",
            "a": "It happens. Aligners get wrapped in napkins and accidentally thrown away. We have a replacement protocol. We tell every teen patient: the aligner goes in your face, not on the table."
        },
        {
            "q": "What's the difference between Invisalign and other clear aligners?",
            "a": "Invisalign has the most extensive research database and the most sophisticated software. Other systems (Angel Aligner, ClearCorrect, etc.) work on similar principles. We choose based on your clinical needs and budget."
        },
        {
            "q": "My child is 9. Can they use clear aligners?",
            "a": "Yes — if they're mature enough to wear them consistently (20+ hours/day) and have sufficient adult teeth erupted. This is assessed case by case. Some 9-year-olds are ready; others need to wait."
        },
        {
            "q": "Can adults in their 40s or 50s use clear aligners?",
            "a": "Yes. Age isn't the limiting factor — bone health and tooth condition are. We assess each adult individually. Many of our adult patients are in their 40s and 50s and get excellent results."
        }
    ];

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Clear Aligners",
            "description": "Transparent plastic trays to gradually shift teeth into alignment at iSmile Dental Clinic Petaling Jaya.",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/straighten"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/straighten/clear-aligners"
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
                <title>Clear Aligners Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Straighten your teeth discreetly with clear aligners (Invisalign / Angel / ClearSmile) at iSmile Clinic, Damansara Jaya. Custom plans for adults and teens." />
                <link rel="canonical" href="https://ismile.com.my/services/straighten/clear-aligners" />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Clear Aligner Systems</div>
                    <h1>Clear Aligners <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">Clear aligners are transparent, custom-fitted plastic trays that gradually shift teeth into alignment — no brackets, no wires. The key question we ask is not "do you want clear aligners?" but "are clear aligners the right mechanism for your specific tooth movement needs?" At iSmile, we offer both Invisalign and clear aligner alternatives, and we walk you through the pros and cons without steering you toward the most expensive option if it is not the best fit.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>How Clear Aligners Work</h2>
                            <p>Each tray in the series is slightly different from the last, and every 1–2 weeks you move to the next tray. The mechanics work by applying controlled, directional force to specific teeth at specific times. Your orthodontist plans the entire sequence digitally before you start — you see a projected outcome on screen before committing.</p>

                            <div className="tech-feature-list">
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Invisalign and Alternatives</h4>
                                        <p>We offer both Invisalign (the most established system with the most research) and clear aligner alternatives that achieve similar outcomes at different price points. We choose based on your clinical needs and budget.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Digital Treatment Planning</h4>
                                        <p>Intraoral 3D scans replace messy putty impressions. You receive a digital treatment preview showing every stage of tooth movement and the projected final result before production begins.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Children and Clear Aligners</h4>
                                        <p>Systems like Invisalign First are designed for mixed dentition (kids with baby teeth AND adult teeth). At iSmile, children receiving clear aligners undergo myofunctional screening as standard practice — we address root habit patterns alongside tooth movement for more durable results.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Treatment Process</h3>
                            <ul className="step-list">
                                <li><span>01</span> Full examination and clear aligner suitability assessment</li>
                                <li><span>02</span> Digital intraoral scans (no messy putty impressions)</li>
                                <li><span>03</span> Digital treatment preview — you approve before production</li>
                                <li><span>04</span> Aligner delivery and fitting — 20–22 hours per day wear</li>
                                <li><span>05</span> Check-ins every 6–8 weeks (brief, 15–20 minute appointments)</li>
                                <li><span>06</span> Refinement trays if needed (normal, built into most plans)</li>
                                <li><span>07</span> Retention — night retainer to hold your new smile</li>
                            </ul>
                            <p style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>Average duration: 6–18 months for adults, 6–12 months for children.</p>
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
                    <h2>Find out if clear aligners are right for you</h2>
                    <p className="mb-4">No-pressure consultation. We show you the digital plan, explain what clear aligners can and cannot do, and give you time to think.</p>
                    <Button onClick={() => openBooking('Interested in Clear Aligners', 'specialty-clear-aligners')}>Book Consultation</Button>
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

export default ClearAligners;
