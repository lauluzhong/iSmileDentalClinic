import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Reveal, FadeIn } from '../components/Reveal';
import { servicesData } from '../data/servicesData';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Button from '../components/Button';
import RelatedReading from '../components/RelatedReading';
import FaqAccordion from '../components/FaqAccordion';
import { Helmet } from 'react-helmet-async';
import { enrichEvent } from '../lib/attribution';
import Style from '../components/Style';
import { SERVICES_LANDING_CSS } from '../styles/pageStyles';
import { hreflangLinks, LangSwitch } from '../i18n/intlRoutes.jsx';

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
                <title>Dental Services in Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Explore our dental services in Petaling Jaya — check-ups, braces & clear aligners, implants, whitening & kids' dentistry in Damansara Jaya. WhatsApp us to book." />
                <link rel="canonical" href="https://ismile.com.my/services" />
                {hreflangLinks('services')}
            </Helmet>

            {/* Hero */}
            <section className="sl-hero">
                <div className="container">
                    <div className="sl-hero-inner">
                        <LangSwitch page="services" lang="en" />
                        <Reveal width="100%"><span className="eyebrow">Our Services</span></Reveal>
                        <Reveal width="100%">
                            <h1 className="sl-title">
                                Comprehensive Care For <em>Every Smile</em>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2} width="100%">
                            <p className="sl-lead">
                                From preventive care to advanced restorative and cosmetic treatments,
                                we provide intentional dental services for the whole family.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Service directory — numbered hairline rows, one per category */}
            <div id="service-directory" className="container sl-directory-wrap">
                <div className="sl-directory">
                    {Object.entries(servicesData).map(([key, data], index) => (
                        <FadeIn key={key} delay={index * 0.08} className="sl-cat">
                            <div className="sl-cat-grid">
                                <span className="sl-cat-num">{String(index + 1).padStart(2, '0')}</span>
                                <div className="sl-cat-body">
                                    <Link to={`/services/${key}`} className="sl-cat-row">
                                        <span className="sl-cat-head">
                                            <h3 className="sl-cat-title">{data.displayTitle}</h3>
                                            <span className="sl-cat-line">{data.bracketText}</span>
                                        </span>
                                        <ArrowRight size={22} className="sl-cat-arrow" />
                                    </Link>
                                    <ul className="sl-cat-links">
                                        {data.services.map((service, sIdx) => (
                                            <li key={sIdx}>
                                                {service.path ? (
                                                    <Link to={service.path} className="sl-treatment-link">{service.name}<ArrowUpRight size={13} className="sl-treatment-arrow" /></Link>
                                                ) : (
                                                    <span className="sl-treatment">{service.name}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* FAQ — on the page background, no slab */}
                <section className="sl-faq">
                    <div className="sl-faq-header">
                        <Reveal width="100%"><span className="eyebrow">Planning your visit</span></Reveal>
                        <Reveal width="100%">
                            <h2 className="system-title">
                                Questions Patients <em>Often Ask</em>
                            </h2>
                        </Reveal>
                        <Reveal delay={0.2} width="100%">
                            <p className="sl-faq-lead">
                                Common questions about dental visits, treatments, and what to expect.
                            </p>
                        </Reveal>
                    </div>

                    <FaqAccordion items={faqs} idPrefix="services" analyticsLabel="services-landing" />
                </section>

                {/* CTA */}
                <div className="sl-cta">
                    <FadeIn>
                        <span className="eyebrow">Here to help</span>
                        <h2 className="statement">Not sure which treatment is <em>right for you?</em></h2>
                        <div className="sl-cta-action">
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
                        </div>
                    </FadeIn>
                </div>
            </div>

            <RelatedReading pathKey="services" />

            <Style>{SERVICES_LANDING_CSS}</Style>
        </div>
    );
};

export default ServicesLanding;
