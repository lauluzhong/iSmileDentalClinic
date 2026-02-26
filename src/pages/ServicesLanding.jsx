import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal, FadeIn } from '../components/Reveal';
import { servicesData } from '../data/servicesData';
import { ArrowRight, CheckCircle } from 'lucide-react';
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
                <meta name="description" content="Comprehensive dental services in Petaling Jaya — preventive, restorative, orthodontic & cosmetic treatments for the whole family." />
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
                                color: '#2d3748',
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
                                color: '#4a5568',
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

            {/* Category Cards Section */}
            <div className="container" style={{ paddingBottom: '120px' }}>
                <div className="services-grid">
                    {Object.entries(servicesData).map(([key, data], index) => (
                        <FadeIn key={key} delay={index * 0.1}>
                            <Link to={`/services/${key}`} className="service-landing-card" style={{ textDecoration: 'none' }}>
                                <div className="card-icon-container">
                                    {data.icon}
                                </div>
                                <h3 className="card-title">{data.displayTitle}</h3>
                                <p className="card-bracket">({data.bracketText})</p>
                                <div className="card-footer">
                                    <span>Explore Services</span>
                                    <ArrowRight size={18} />
                                </div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </div>

            {/* All Services Directory Section */}
            <div id="service-directory" className="directory-section" style={{ paddingBottom: '120px' }}>
                <div className="container">
                    <FadeIn>
                        <div className="mb-5">
                            <h2 className="directory-main-title">Full Service Directory</h2>
                        </div>
                    </FadeIn>

                    <div className="directory-grid">
                        {Object.entries(servicesData).map(([key, data]) => (
                            <FadeIn key={key} className="directory-category-card">
                                <div className="category-header">
                                    <div className="category-icon-small">{data.icon}</div>
                                    <Link to={`/services/${key}`}><h4>{data.displayTitle}</h4></Link>
                                </div>
                                <ul className="directory-list">
                                    {data.services.map((service, sIdx) => (
                                        <li key={sIdx}>
                                            <CheckCircle size={16} className="text-primary-teal" />
                                            {service.path ? (
                                                <Link to={service.path}><span>{service.name}</span></Link>
                                            ) : (
                                                <span>{service.name}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </FadeIn>
                        ))}
                    </div>

                    <div className="text-center" style={{ marginTop: '80px', paddingBottom: '40px' }}>
                        <FadeIn>
                            <h3 className="h4 mb-4" style={{ color: '#2d3748', fontWeight: 700 }}>Not sure which treatment is right for you?</h3>
                            <Button onClick={() => window.open('https://wa.me/60163222135', '_blank')}>
                                Get In Touch With Us
                            </Button>
                        </FadeIn>
                    </div>
                </div>
            </div>

            <style>{`
                .services-landing {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%);
                }
                
                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 40px;
                }

                .service-landing-card {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    padding: 40px;
                    border-radius: 24px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                }

                .service-landing-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
                    background: rgba(255, 255, 255, 0.8);
                }

                .card-icon-container {
                    margin-bottom: 25px;
                    color: var(--color-primary-teal);
                    background: var(--color-tint-blue);
                    width: 64px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                }

                .card-title {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 12px;
                }

                .card-bracket {
                    font-size: 1.05rem;
                    color: #64748b;
                    margin-bottom: 30px;
                    font-weight: 500;
                }

                .card-footer {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--color-primary-teal);
                    font-weight: 700;
                    font-size: 0.95rem;
                    transition: all 0.3s;
                }

                .service-landing-card:hover .card-footer {
                    gap: 12px;
                }

                /* Directory Styles */
                .directory-main-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--color-primary);
                    margin-bottom: 40px;
                }

                .directory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 30px;
                }

                .directory-category-card {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    padding: 30px;
                    border-radius: 24px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .directory-category-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    background: rgba(255, 255, 255, 0.8);
                }

                .category-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .category-icon-small {
                    color: var(--color-primary-teal);
                }

                .category-header h4 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }

                .directory-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .directory-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    margin-bottom: 15px;
                    font-size: 0.95rem;
                    color: #475569;
                    line-height: 1.4;
                }

                .directory-list li span {
                    margin-top: -2px;
                }

                .text-primary-teal {
                    color: var(--color-primary-teal);
                }

                @media (max-width: 1024px) {
                    .services-landing { padding-top: 20px; }
                    .services-hero-gradient { 
                        padding-top: 100px !important; 
                        text-align: center !important; 
                    }
                    .hero-description {
                        margin: 0 auto !important;
                    }
                    .services-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .service-landing-card {
                        padding: 24px;
                        border-radius: 20px;
                    }
                    .directory-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .directory-category-card {
                        padding: 24px;
                        border-radius: 20px;
                    }
                    .directory-main-title {
                        font-size: 2rem;
                        text-align: center;
                    }
                    .hero-title { font-size: 2.2rem !important; }
                    .hero-description { font-size: 1rem !important; }
                }
            `}</style>
        </div>
    );
};

export default ServicesLanding;
