import { Helmet } from 'react-helmet-async';
import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Smile } from 'lucide-react';
import Button from '../../components/Button';

const DentalImplants = () => {
    const { openBooking } = useBooking();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Dental Implants",
            "description": "Replace missing teeth with permanent dental implants at iSmile Dental Clinic Petaling Jaya.",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/replace"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/replace/dental-implants"
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
            "q": "Does dental implant surgery hurt?",
            "a": "No, the procedure itself is painless with local anesthesia. The recovery is mildly uncomfortable (swelling, soreness for a few days) but manageable with prescribed pain relief. Most patients are back to work within a few days."
        },
        {
            "q": "How long does the entire process take?",
            "a": "In straightforward cases with good bone, the process may take around 4–5 months from implant placement to final crown. Cases requiring bone grafting or sinus lift may take longer. We'll give you a realistic timeline at assessment."
        },
        {
            "q": "What if I don't have enough bone?",
            "a": "Bone grafting is common and well-established. We may use synthetic bone, donor bone, or your own bone. It adds a healing stage before implant placement, but it makes implant placement possible in many cases that would otherwise not have been viable."
        },
        {
            "q": "Is the implant safe if I have metal allergies?",
            "a": "Titanium allergies are exceptionally rare. Titanium is one of the most biocompatible materials used in medicine. If you have a documented titanium sensitivity, we discuss alternative materials (zirconia implants), though these have slightly different clinical profiles."
        },
        {
            "q": "How do I know if my implant is failing?",
            "a": "Signs include: persistent pain or discomfort around the implant site (beyond normal healing), mobility of the implant, gum recession or deepening pockets around it, or infection. Many problems may be caught at routine review appointments, which is why long-term monitoring matters."
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
                <title>Dental Implants Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Replace missing teeth with permanent dental implants at iSmile Clinic, Damansara Jaya. Bio-compatible titanium implants for a natural-looking, lasting smile." />
                <link rel="canonical" href="https://ismile.com.my/services/replace/dental-implants" />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Technical Deep-Dive</div>
                    <h1>Dental Implants <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">A dental implant is a titanium screw surgically placed into your jawbone, functioning as an artificial tooth root. After healing (osseointegration), a crown is attached — giving you a replacement tooth that looks, feels, and functions like a natural one. The success rate is routinely cited at 95–98% over 10 years. But that doesn't mean the process is simple or without trade-offs. We'll be upfront about both.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>Who Needs Dental Implants — and Who Doesn't</h2>
                            <p>Implants aren't for everyone, and a good dentist will tell you that clearly. Implants are typically recommended when you have missing teeth (or teeth so broken they need extraction), enough bone density or willingness to graft, reasonable general health, and don't smoke or are willing to stop during healing. A bridge or partial denture might be more appropriate in some cases. We're not going to push implants if another solution is better for your situation.</p>

                            <div className="tech-feature-list">

                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>No Grinding of Adjacent Teeth</h4>
                                        <p>Unlike bridges, implants don't require grinding down healthy adjacent teeth. They integrate with your bone, which is why they feel more like your own teeth than any other replacement option.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Recovery and Long-Term Care</h4>
                                        <p>Implant care is like natural teeth — brush twice daily, floss around the abutment with a water flosser or interdental brush. Regular check-ups every 6 months are essential. Note: natural teeth can develop gum disease; implants can develop peri-implantitis, which is preventable with good hygiene.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>The Implant Process Step by Step</h3>
                            <ul className="step-list">
                                <li><span>01</span> Assessment — CBCT 3D scans, bone quality/volume check, health history</li>
                                <li><span>02</span> Treatment plan presentation — clear cost breakdown, no pressure</li>
                                <li><span>03</span> Surgical implant placement under local anesthesia (~30–90 min)</li>
                                <li><span>04</span> Healing and osseointegration (bone fuses to titanium) — 4–8 months</li>
                                <li><span>05</span> Abutment attachment and impressions for custom crown</li>
                                <li>
                                    <span>06</span>
                                    <div>
                                        Final crown fitting
                                        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>
                                            Custom porcelain crown cemented or screwed into place
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
                    <Button onClick={() => openBooking('Interested in Dental Implants', 'specialty-dental-implants')}>Book Consultation</Button>
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

export default DentalImplants;
