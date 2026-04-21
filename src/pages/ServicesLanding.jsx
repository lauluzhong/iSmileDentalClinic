import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Reveal, FadeIn } from '../components/Reveal';
import { servicesData } from '../data/servicesData';
import { ArrowRight, CheckCircle, ArrowUpRight, HelpCircle } from 'lucide-react';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';
import { enrichEvent } from '../lib/attribution';

const ServicesLanding = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.slice(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    // GEO FAQ content for search visibility
    const faqs = [
        {
            q: "What questions should I ask during a dental consultation?",
            a: "You might ask about the recommended treatment approach, what to expect during the procedure, any alternatives available, and what the recovery timeline looks like. Your dentist can provide details specific to your situation."
        },
        {
            q: "What should I expect during my first dental visit at iSmile?",
            a: "Your first visit typically includes a comprehensive oral examination, discussion of your dental history and concerns, and sometimes diagnostic imaging if needed. The dental team will explain their findings and discuss potential treatment options with you."
        },
        {
            q: "How do I know which dental treatment is right for me?",
            a: "Your dentist will assess your oral health, discuss your goals and concerns, and explain different treatment options. They can help you understand the benefits and considerations of each approach based on your specific situation."
        },
        {
            q: "What should I expect for my child's dental visit?",
            a: "Children's dental visits are designed to be positive experiences. The dental team will gently examine your child's teeth and gums, discuss oral hygiene habits, and may provide preventive treatments like fluoride application. They'll work at your child's pace to build comfort and trust."
        },
        {
            q: "What should I know about dental costs and insurance?",
            a: "Dental costs vary depending on the treatment needed. During your consultation, your dentist can provide an estimate of treatment costs. Many clinics accept various insurance plans - you can contact the clinic directly to discuss your specific insurance coverage."
        },
        {
            q: "What happens during emergency dental care?",
            a: "For dental emergencies, the clinic will typically assess the situation promptly to address pain or immediate concerns. This may involve examination, diagnostic imaging if needed, and discussion of treatment options to manage the emergency situation."
        },
        {
            q: "What kind of follow-up care should I expect after treatment?",
            a: "Follow-up care depends on the treatment received. Your dentist will provide specific aftercare instructions and may schedule follow-up appointments to monitor healing and treatment outcomes. Regular check-ups are generally recommended to maintain oral health."
        }
    ];

    // Add FAQ schema for GEO/SEO
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
        <div className="services-landing">
            <Helmet>
                <title>Dental Services Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Explore comprehensive dental services in Petaling Jaya — preventive, restorative, orthodontic & cosmetic treatments for children, adults & families at iSmile Clinic." />
                <link rel="canonical" href="https://ismile.com.my/services" />
            </Helmet>

            {/* Hero Section */}
            <div className="services-hero-gradient" style={{
                paddingTop: '180px',
                paddingBottom: '60px',
                textAlign: 'left'
            }}>
                <div className="container">
                    <div style={{ maxWidth: '850px' }}>
                        <Reveal width="100%">
                            <h1 className="hero-title" style={{
                                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                                fontWeight: 800,
                                color: 'var(--color-text-charcoal)',
                                letterSpacing: '-0.02em',
                                marginBottom: '20px',
                                lineHeight: '1.1'
                            }}>
                                Comprehensive Care For <span className="text-gradient">Every Smile</span>
                            </h1>
                        </Reveal>

                        <Reveal delay={0.2} width="100%">
                            <p className="hero-description" style={{
                                fontSize: '1.25rem',
                                color: 'var(--color-text-muted)',
                                maxWidth: '700px',
                                margin: '0',
                                lineHeight: '1.6',
                                fontWeight: 500
                            }}>
                                From preventive care to advanced restorative and cosmetic treatments, 
                                we provide intentional dental services for the whole family.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Service Directory Grid */}
            <div id="service-directory" className="container" style={{ paddingBottom: '80px' }}>
                <div className="directory-grid">
                    {Object.entries(servicesData).map(([key, data], index) => (
                        <FadeIn key={key} delay={index * 0.08} className="directory-category-card">
                            <div className="category-header">
                                <div className="category-icon-small">{data.icon}</div>
                                <Link to={`/services/${key}`} className="category-title-link">
                                    <h3>{data.displayTitle}</h3>
                                </Link>
                            </div>
                            <p className="category-bracket">({data.bracketText})</p>
                            <ul className="directory-list">
                                {data.services.map((service, sIdx) => (
                                    <li key={sIdx}>
                                        <CheckCircle size={16} className="text-primary-teal list-check-icon" />
                                        {service.path ? (
                                            <Link to={service.path} className="service-link">{service.name} <ArrowUpRight size={14} className="service-link-arrow" /></Link>
                                        ) : (
                                            <span>{service.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <Link to={`/services/${key}`} className="explore-category-link">
                                <span>Explore Category</span>
                                <ArrowRight size={16} />
                            </Link>
                        </FadeIn>
                    ))}
                </div>

                {/* FAQ Section for GEO Optimization */}
                <section className="faq-section section-padding" style={{ 
                    background: '#f8f9fa', 
                    borderRadius: '24px',
                    marginTop: '60px',
                    padding: '60px 0'
                }}>
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: '50px' }}>
                            <Reveal width="100%">
                                <h2 style={{
                                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                                    fontWeight: 700,
                                    color: 'var(--color-text-charcoal)',
                                    marginBottom: '16px',
                                    lineHeight: '1.2'
                                }}>
                                    Questions Patients <span className="text-gradient">Often Ask</span>
                                </h2>
                            </Reveal>
                            <Reveal delay={0.2} width="100%">
                                <p style={{
                                    fontSize: '1.1rem',
                                    color: 'var(--color-text-muted)',
                                    maxWidth: '700px',
                                    margin: '0 auto',
                                    lineHeight: '1.6'
                                }}>
                                    Common questions about dental visits, treatments, and what to expect.
                                </p>
                            </Reveal>
                        </div>

                        <div className="faq-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '30px',
                            marginTop: '40px'
                        }}>
                            {faqs.map((faq, i) => (
                                <FadeIn key={i} delay={i * 0.08} className="faq-item" style={{
                                    padding: '30px',
                                    background: 'white',
                                    borderRadius: '20px',
                                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px' }}>
                                        <HelpCircle size={20} className="text-primary-teal" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <h4 style={{
                                            margin: 0,
                                            color: 'var(--color-primary)',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            lineHeight: '1.4'
                                        }}>
                                            {faq.q}
                                        </h4>
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        color: 'var(--color-text-muted)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        paddingLeft: '32px'
                                    }}>
                                        {faq.a}
                                    </p>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center" style={{ marginTop: '80px', paddingBottom: '40px' }}>
                    <FadeIn>
                        <h3 style={{ color: 'var(--color-text-charcoal)', fontWeight: 700, marginBottom: '20px', fontSize: '1.3rem' }}>Not sure which treatment is right for you?</h3>
                        <Button onClick={() => {
                            const ctaLocation = 'services_landing_cta';
                            const eventData = {
                                event: 'whatsapp_click',
                                whatsapp_page: window.location.pathname,
                                whatsapp_cta_text: 'Get In Touch With Us',
                                whatsapp_type: 'services_landing_cta'
                            };
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push(enrichEvent(eventData, ctaLocation));
                            window.open('https://wa.me/60163222135', '_blank');
                        }}>
                            Get In Touch With Us
                        </Button>
                    </FadeIn>
                </div>
            </div>

            <style>{`
                .services-landing {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%);
                }

                .directory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                }

                .directory-category-card {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    padding: 32px;
                    border-radius: 24px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    display: flex;
                    flex-direction: column;
                }

                .directory-category-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    background: rgba(255, 255, 255, 0.85);
                }

                .category-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 6px;
                    padding-bottom: 0;
                }

                .category-icon-small {
                    color: var(--color-primary-teal);
                    flex-shrink: 0;
                }

                .category-title-link {
                    text-decoration: none;
                }

                .category-title-link h3 {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                    transition: color 0.2s ease;
                }

                .category-title-link:hover h3 {
                    color: var(--color-primary-teal);
                }

                .category-bracket {
                    font-size: 0.95rem;
                    color: #64748b;
                    margin: 0 0 20px 0;
                    font-weight: 500;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                }

                .directory-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 20px 0;
                    flex-grow: 1;
                }

                .directory-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    margin-bottom: 14px;
                    font-size: 0.95rem;
                    color: #475569;
                    line-height: 1.4;
                }

                .list-check-icon {
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .directory-list li span {
                    margin-top: -1px;
                }

                .service-link {
                    text-decoration: none;
                    color: #475569;
                    transition: color 0.2s ease;
                    margin-top: -1px;
                }

                .service-link:hover {
                    color: var(--color-primary-teal);
                }

                .service-link-arrow {
                    display: inline-block;
                    vertical-align: middle;
                    opacity: 0.4;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                    margin-left: 2px;
                }

                .service-link:hover .service-link-arrow {
                    opacity: 1;
                    transform: translate(2px, -2px);
                }

                .text-primary-teal {
                    color: var(--color-primary-teal);
                }

                .explore-category-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--color-primary-teal);
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-decoration: none;
                    margin-top: auto;
                    padding-top: 16px;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    transition: gap 0.3s ease;
                }

                .explore-category-link:hover {
                    gap: 14px;
                }

                @media (max-width: 1024px) {
                    .services-landing { padding-top: 20px; }
                    .services-hero-gradient { 
                        padding-top: 100px; 
                        text-align: center; 
                    }
                    .hero-description {
                        margin: 0 auto;
                    }
                    .directory-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .directory-category-card {
                        padding: 24px;
                        border-radius: 20px;
                    }
                    .hero-title { font-size: 2.2rem; }
                    .hero-description { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
};

export default ServicesLanding;
