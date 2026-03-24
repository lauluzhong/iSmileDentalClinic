import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Reveal, FadeIn } from '../components/Reveal';
import { servicesData } from '../data/servicesData';
import { ArrowRight, CheckCircle, ArrowUpRight } from 'lucide-react';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';

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

                {/* CTA */}
                <div className="text-center" style={{ marginTop: '80px', paddingBottom: '40px' }}>
                    <FadeIn>
                        <h3 style={{ color: 'var(--color-text-charcoal)', fontWeight: 700, marginBottom: '20px', fontSize: '1.3rem' }}>Not sure which treatment is right for you?</h3>
                        <Button onClick={() => {
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                                event: 'whatsapp_click',
                                whatsapp_page: window.location.pathname,
                                whatsapp_cta_text: 'Get In Touch With Us',
                                whatsapp_type: 'services_landing_cta'
                            });
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
