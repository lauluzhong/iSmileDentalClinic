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

    const faqs = [
        {
            "q": "Does dental implant surgery hurt?",
            "a": "The procedure itself is painless with local anesthesia. The recovery is mildly uncomfortable — swelling, soreness for a few days — but manageable with prescribed pain relief. Most patients are back to normal activities within a few days."
        },
        {
            "q": "How long does the entire process take?",
            "a": "From placement to final crown: typically 4–8 months. The implant needs 3–6 months to fuse with the bone (osseointegration) before the crown is attached. This cannot be rushed — bone grows slowly onto the titanium surface."
        },
        {
            "q": "How long do implants last?",
            "a": "The implant fixture itself can last decades with good care. The crown on top may need replacing in 10–15 years depending on material and wear. Your dentist will advise on maintenance and monitoring at your review appointments."
        },
        {
            "q": "Can you replace multiple teeth with implants?",
            "a": "Yes. Individual implants replace individual teeth. For several missing teeth in a row, an implant-supported bridge may be used. Your dentist will assess your specific situation and recommend the most appropriate solution."
        },
        {
            "q": "What if I don't have enough bone?",
            "a": "Bone grafting can build up the site before implant placement. This adds time to the process but makes implants possible for many patients who would otherwise not be candidates. Your dentist will assess bone volume with a 3D CBCT scan."
        },
        {
            "q": "What does it cost?",
            "a": "We don't publish specific pricing because every case is different — number of implants, need for bone grafting, crown material choice. We give you a clear cost breakdown at the consultation before any commitment. We also offer payment plan options."
        }
    ];

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
                <meta name="description" content="Replace missing teeth with permanent dental implants at iSmile Dental Clinic Damansara Jaya. Titanium implants, custom crowns, 4–8 month treatment timeline." />
                <link rel="canonical" href="https://ismile.com.my/services/replace/dental-implants" />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Dental Implants</div>
                    <h1>Dental Implants <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">A dental implant is a titanium screw surgically placed into your jawbone, functioning as an artificial tooth root. After a healing period, a crown is attached — giving you a replacement tooth that looks, feels, and functions like a natural one. We use 3D CBCT scanning for precise planning and will tell you honestly if implants are the right option for you.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>The Implant Process</h2>
                            <p>An implant has three parts: the titanium fixture (placed in bone), the abutment (connector above the gum), and the crown (visible tooth). Unlike bridges, implants don't require grinding down adjacent healthy teeth. Unlike dentures, they don't move or click.</p>

                            <div className="tech-feature-list">
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>3D CBCT Assessment</h4>
                                        <p>No implant should be placed without 3D imaging. We assess bone quality, bone volume, nerve positions, and sinus proximity with cone beam CT before giving you a quote. If a clinic is quoting based only on a 2D X-ray, that is a red flag.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Surgical Placement</h4>
                                        <p>Under local anesthesia. The procedure itself is not painful — most patients are surprised by how uneventful it is. The gum is stitched over the site and you go home the same day.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Osseointegration</h4>
                                        <p>3–6 months of healing where the implant fuses with your bone. This biological process cannot be rushed — it is what gives implants their stability. During this time you eat soft foods and attend monitoring appointments.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Crown and Maintenance</h4>
                                        <p>Custom crown fabricated by a dental lab (2–3 weeks). Long-term care is like natural teeth — brush, floss, water flosser, regular check-ups. Note: natural teeth can develop gum disease; implants can develop peri-implantitis if hygiene lapses.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Treatment Timeline</h3>
                            <ul className="step-list">
                                <li><span>01</span> CBCT scan and full health assessment</li>
                                <li><span>02</span> Treatment plan presentation with alternatives</li>
                                <li><span>03</span> Implant placement (30–90 minutes per implant)</li>
                                <li><span>04</span> Healing and osseointegration (3–6 months)</li>
                                <li><span>05</span> Abutment placement and impressions</li>
                                <li><span>06</span> Custom crown fitting (2–3 weeks lab time)</li>
                                <li><span>07</span> Review appointments for long-term monitoring</li>
                            </ul>
                            <p style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>Total timeline: typically 4–8 months from placement to final crown.</p>
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
                    <h2>Find out if implants are right for you</h2>
                    <p className="mb-4">Come in for a consultation. We will assess your bone, explain your options, and tell you honestly whether implants are the best solution for your situation.</p>
                    <Button onClick={() => openBooking('Interested in Dental Implants', 'specialty-implants')}>Book Consultation</Button>
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

export default DentalImplants;
