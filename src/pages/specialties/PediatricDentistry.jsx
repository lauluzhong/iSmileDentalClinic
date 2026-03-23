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
            "q": "When should my child have their first dental visit?",
            "a": "We typically recommend around age 1, or within 6 months of the first tooth appearing. Early visits help your child become comfortable with the dental environment and allow us to monitor growth and development from the start."
        },
        {
            "q": "Are baby teeth really that important?",
            "a": "Yes. Baby teeth hold space for adult teeth, guide proper chewing and speech development, and affect your child's confidence. Untreated decay in baby teeth can also lead to infection and may affect developing adult teeth underneath."
        },
        {
            "q": "What are fissure sealants?",
            "a": "Fissure sealants are thin protective coatings applied to the chewing surfaces of back teeth where cavities commonly form. They fill in the grooves and pits, creating a smoother surface that is easier to clean and protected from plaque and food particles."
        },
        {
            "q": "Is fluoride treatment safe for children?",
            "a": "Yes. Professionally applied topical fluoride strengthens tooth enamel and makes it more resistant to cavities. We use age-appropriate concentrations that are both safe and effective for your child's developmental stage."
        },
        {
            "q": "How can I help my child feel comfortable at the dentist?",
            "a": "Start young, keep conversations positive, and avoid using words like pain or shot. At iSmile, we create a fun, judgment-free environment where children learn to see dental visits as a normal part of staying healthy."
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
                    <p className="lead">Gentle, trauma-free dental care for children from their very first tooth onwards. We focus on prevention, education, and creating positive dental experiences that last a lifetime. Every pediatric check-up at iSmile also includes a basic myofunctional screening to assess breathing patterns and oral posture.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>Prevention is Key</h2>
                            <p>Our pediatric approach focuses on early intervention, prevention, and building healthy habits from a young age so your child can maintain a healthy smile for life.</p>

                            <div className="tech-feature-list">

                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Fissure Sealants</h4>
                                        <p>Protective coatings on back teeth to prevent decay in grooves and pits where cavities commonly form. A painless, quick procedure that may provide years of protection.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Topical Fluoride</h4>
                                        <p>Professionally applied fluoride strengthens enamel and makes teeth more resistant to cavities. Applied at cleanings for optimal coverage and protection.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Child-Friendly Environment</h4>
                                        <p>We take time to build trust with your child. No rush, no judgment. Just a positive, fun experience that makes them excited about dental health.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Children's Services</h3>
                            <ul className="step-list">
                                <li><span>01</span> First Dental Visit & Assessment</li>
                                <li><span>02</span> Fissure Sealants</li>
                                <li><span>03</span> Topical Fluoride Treatment</li>
                                <li><span>04</span> Paediatric Fillings</li>
                                <li><span>05</span> Baby Tooth Extraction</li>
                                <li><span>06</span> Basic Myofunctional Screening</li>
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
