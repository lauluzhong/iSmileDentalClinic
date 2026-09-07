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
            </Helmet>

            {/* Hero */}
            <section className="sl-hero">
                <div className="container">
                    <div className="sl-hero-inner">
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
                            <Link to={`/services/${key}`} className="sl-cat-row">
                                <span className="sl-cat-num">{String(index + 1).padStart(2, '0')}</span>
                                <h3 className="sl-cat-title">{data.displayTitle}</h3>
                                <p className="sl-cat-line">{data.bracketText}</p>
                                <ArrowRight size={22} className="sl-cat-arrow" />
                            </Link>
                            <ul className="sl-cat-links">
                                {data.services.map((service, sIdx) => (
                                    <li key={sIdx}>
                                        {service.path ? (
                                            <Link to={service.path} className="sl-treatment-link">{service.name} <ArrowUpRight size={14} className="sl-treatment-arrow" /></Link>
                                        ) : (
                                            <span className="sl-treatment">{service.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>
                    ))}
                </div>

                {/* FAQ — on the page background, no slab */}
                <section className="sl-faq">
                    <div className="sl-faq-header">
                        <Reveal width="100%"><span className="eyebrow">FAQ</span></Reveal>
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

            <Style>{`
                .services-landing {
                    min-height: 100vh;
                    background: var(--color-background);
                }

                /* ---------- Hero ---------- */
                .sl-hero { padding: 180px 0 24px; }
                .sl-hero-inner { max-width: 850px; }
                .sl-title {
                    font-family: var(--font-heading);
                    font-size: var(--fs-statement);
                    font-weight: 700;
                    color: var(--color-text-charcoal);
                    letter-spacing: -0.03em;
                    line-height: 1.06;
                    margin: 0 0 20px;
                    text-wrap: balance;
                }
                .sl-lead {
                    font-size: var(--fs-lead);
                    color: var(--color-text-slate);
                    max-width: 700px;
                    margin: 0;
                    line-height: 1.65;
                }

                /* ---------- Directory rows ---------- */
                .sl-directory-wrap { padding-bottom: 80px; }
                .sl-directory { border-top: 1px solid var(--hairline); margin-top: 40px; }
                .sl-cat { border-bottom: 1px solid var(--hairline); }
                .sl-cat-row {
                    position: relative;
                    display: grid;
                    grid-template-columns: 72px minmax(0, 0.85fr) minmax(0, 1.15fr) 40px;
                    align-items: center;
                    gap: 32px;
                    padding: 38px 18px 10px;
                    text-decoration: none;
                    color: inherit;
                    overflow: hidden;
                }
                .sl-cat-row::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    background: linear-gradient(90deg, rgba(0,141,176,0.08) 0%, rgba(0,141,176,0.02) 62%, rgba(0,141,176,0) 100%);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.75s var(--ease-slow);
                }
                .sl-cat-row:hover::before,
                .sl-cat-row:focus-visible::before { transform: scaleX(1); }
                .sl-cat-row > * { position: relative; z-index: 1; }
                .sl-cat-num {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 0.12em;
                    color: var(--color-primary-teal);
                }
                .sl-cat-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: clamp(1.45rem, 1.1rem + 1.1vw, 2.1rem);
                    line-height: 1.1;
                    letter-spacing: -0.025em;
                    color: var(--color-text-charcoal);
                    margin: 0;
                    transition: transform 0.7s var(--ease-slow);
                }
                .sl-cat-row:hover .sl-cat-title { transform: translateX(10px); }
                .sl-cat-line { color: var(--color-text-slate); font-size: 1rem; line-height: 1.6; margin: 0; }
                .sl-cat-arrow {
                    color: var(--color-primary-teal);
                    opacity: 0.3;
                    transition: opacity 0.5s ease, transform 0.7s var(--ease-slow);
                }
                .sl-cat-row:hover .sl-cat-arrow { opacity: 1; transform: translate(6px, -4px) rotate(-45deg); }

                /* Treatment links: an indented quiet list under each row */
                .sl-cat-links {
                    list-style: none;
                    margin: 0;
                    padding: 0 18px 30px calc(72px + 32px + 18px);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px 28px;
                }
                .sl-cat-links li { margin: 0; }
                .sl-treatment,
                .sl-treatment-link {
                    font-size: 0.95rem;
                    color: var(--color-text-slate);
                    line-height: 1.5;
                    text-decoration: none;
                }
                .sl-treatment-link { transition: color 0.2s ease; }
                .sl-treatment-link:hover { color: var(--color-primary-teal); }
                .sl-treatment-arrow {
                    display: inline-block;
                    vertical-align: middle;
                    opacity: 0.4;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                    margin-left: 2px;
                }
                .sl-treatment-link:hover .sl-treatment-arrow {
                    opacity: 1;
                    transform: translate(2px, -2px);
                }

                /* ---------- FAQ ---------- */
                .sl-faq { margin-top: 96px; }
                .sl-faq-header { max-width: 700px; margin-bottom: 44px; }
                .sl-faq-lead {
                    font-size: var(--fs-lead);
                    color: var(--color-text-slate);
                    margin: 16px 0 0;
                    line-height: 1.65;
                }

                /* ---------- CTA ---------- */
                .sl-cta { text-align: center; margin-top: 96px; padding-bottom: 40px; }
                .sl-cta-action { margin-top: 32px; }

                @media (max-width: 1024px) {
                    .sl-hero { padding: 120px 0 8px; }
                    .sl-title { font-size: 2.2rem; }
                    .sl-lead { font-size: 1rem; }
                    .sl-directory { margin-top: 28px; }
                    .sl-cat-row {
                        grid-template-columns: 34px 1fr;
                        gap: 6px 14px;
                        padding: 22px 6px 6px;
                    }
                    .sl-cat-num { font-size: 0.72rem; }
                    .sl-cat-title { font-size: 1.35rem; }
                    .sl-cat-row:hover .sl-cat-title { transform: none; }
                    .sl-cat-line { grid-column: 2; font-size: 0.92rem; }
                    .sl-cat-arrow { display: none; }
                    .sl-cat-links {
                        padding: 4px 6px 22px calc(34px + 14px);
                        gap: 6px 20px;
                    }
                    .sl-faq { margin-top: 56px; }
                    .sl-faq-header { margin-bottom: 28px; }
                    .sl-cta { margin-top: 56px; }
                }
            `}</Style>
        </div>
    );
};

export default ServicesLanding;
