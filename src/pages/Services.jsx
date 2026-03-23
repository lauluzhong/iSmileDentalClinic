import { useBooking } from '../context/BookingContext';
import React, { useEffect } from 'react';
import { Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Sparkles, Smile, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { servicesData } from '../data/servicesData';
import ServicesLanding from './ServicesLanding';
import { Helmet } from 'react-helmet-async';

// Specialty Pages
import WisdomToothSurgery from './specialties/WisdomToothSurgery';
import ClearAligners from './specialties/ClearAligners';
import DentalImplants from './specialties/DentalImplants';
import TeethWhitening from './specialties/TeethWhitening';
import RootCanalTreatment from './specialties/RootCanalTreatment';
import MyofunctionalOrthodontics from './specialties/MyofunctionalOrthodontics';
import CosmeticDentistry from './specialties/CosmeticDentistry';
import PediatricDentistry from './specialties/PediatricDentistry';

const ServiceHub = () => {
    const { openBooking } = useBooking();
    const { category } = useParams();
    const location = useLocation();
    
    // Handle hash scrolling from footer link
    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const element = document.getElementById(location.hash.replace('#', ''));
                if (element) {
                    const headerOffset = 200;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }, 500);
        }
    }, [location]);
    const data = servicesData[category];

    if (!data) return <div className="container section-padding">Service not found</div>;

    const getBgPosition = (cat) => {
        const positions = {
            protect: '60% 30%',
            straighten: 'center 25%',
            children: 'center 30%',
            enhance: 'center 30%',
            replace: '70% 30%'
        };
        return positions[cat] || 'center center';
    };

    // SEO data for each service category
    const seoData = {
        protect: { title: "Protect & Repair Dental Services Petaling Jaya | iSmile Dental Clinic", desc: "Preventive & restorative dental care in Petaling Jaya. Root canal, wisdom tooth surgery & more.", canonical: "https://ismile.com.my/services/protect" },
        straighten: { title: "Straighten Teeth Petaling Jaya | iSmile Dental Clinic", desc: "Orthodontic treatments in Petaling Jaya. Clear aligners & braces for adults & teens.", canonical: "https://ismile.com.my/services/straighten" },
        replace: { title: "Replace Missing Teeth Petaling Jaya | iSmile Dental Clinic", desc: "Dental implants & dentures in Petaling Jaya. Restore your smile with lasting results.", canonical: "https://ismile.com.my/services/replace" },
        enhance: { title: "Enhance Your Smile Petaling Jaya | iSmile Dental Clinic", desc: "Cosmetic dentistry in Petaling Jaya. Teeth whitening, veneers & smile makeovers.", canonical: "https://ismile.com.my/services/enhance" },
        children: { title: "Children's Dentistry Petaling Jaya | iSmile Dental Clinic", desc: "Gentle dental care for children & teens in Petaling Jaya. First visits & preventive care.", canonical: "https://ismile.com.my/services/children" }
    };
    const seo = seoData[category] || { title: "Dental Services Petaling Jaya | iSmile Dental Clinic", desc: "Comprehensive dental services in Petaling Jaya for the whole family.", canonical: "https://ismile.com.my/services" };

    return (
        <div className="service-hub">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.desc} />
                <link rel="canonical" href={seo.canonical} />
            </Helmet>
            {/* Hero */}
            <div className="hub-hero" style={{
                backgroundImage: `url(/images/service_${category}.png)`,
                backgroundPosition: getBgPosition(category)
            }}>
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content-left">
                        <div className="hero-header-container">
                            <div className="hub-icon">{data.icon}</div>
                            <h1 className="pill-title">{data.title}</h1>
                        </div>
                        <h2 className="hero-main-title">{data.hero}</h2>
                        <p className="hero-subtitle">{data.description}</p>
                    </div>
                </div>
            </div>

            {/* Key Services & Tier 1 */}
            <div className="container section-padding">
                <div className="sub-grid">
                    {/* Key Services List */}
                    <motion.div
                        className="glass-panel service-list-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>Key Services</h3>
                        <ul className="custom-list">
                            {data.services.map((item, i) => (
                                <li key={i}>
                                    <div className="service-item-header">
                                        <CheckCircle size={18} color="var(--color-primary)" className="service-icon" />
                                        <span className="service-name">{item.name}</span>
                                    </div>
                                    <p className="service-desc">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Tier 1 Highlight */}
                    <motion.div
                        className="glass-panel tier1-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="tier1-content">
                            <span className="badge">Highlight</span>
                            <Link to={data.tier1.path}><h3>{data.tier1.title}</h3></Link>
                            <p>{data.tier1.desc}</p>
                            <Link to={data.tier1.path}>
                                <Button variant="outline">Learn More</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Experience Section */}
            {category === 'straighten' ? (
                <div className="experience-section scanning-hero-section section-padding">
                    <motion.div
                        className="container text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="scanning-content-header mb-5">
                            <h2 className="scanning-title">{data.experience.title}</h2>
                            <p className="lead-text scanning-lead mx-auto">{data.experience.desc}</p>
                        </div>
                        <div className="scanning-visual-container">
                            <img
                                src="/images/teeth_3d_scan.png"
                                alt="3D Digital Scan"
                                className="scanning-image"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="experience-section section-padding">
                    <div className="container">
                        <div className="apple-grid">
                            <div className="apple-content">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="apple-title">{data.experience.title}</h2>
                                    <p className="apple-desc">{data.experience.desc}</p>
                                </motion.div>
                            </div>
                            <div className="apple-visual">
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {data.experience.benefits ? (
                                        <div className="benefits-card">
                                            <h3 className="benefits-header">Key Benefits</h3>
                                            <ul className="benefit-list">
                                                {data.experience.benefits.map((feat, i) => (
                                                    <li key={i} className="benefit-item">
                                                        <CheckCircle size={24} className="benefit-icon" />
                                                        <span>{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="glass-panel info-visual">
                                            <h3>{data.experience.visualTitle || "Why This Matters"}</h3>
                                            {data.experience.visualContent}
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA & Blogs */}
            <div className="container section-padding text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Ready for a healthier smile?</h2>
                    <br />
                    <Button onClick={() => openBooking(`Interested in ${data.title.split("\n")[0]}`, "services-hub-cta")}>Book Consultation</Button>
                </motion.div>
            </div>

            <style>{`
                .hub-hero {
                    padding: 160px 0 100px 0;
                    position: relative;
                    background-size: cover;
                    color: white;
                    overflow: hidden;
                    background-color: #1a1a1a;
                    min-height: 500px;
                    display: flex;
                    align-items: center;
                }

                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
                    z-index: 1;
                }

                .hub-hero .container {
                    position: relative;
                    z-index: 2;
                    text-align: left !important;
                    width: 100%;
                    margin-left: 0;
                    padding-left: 10%;
                }

                .hero-content-left {
                    max-width: 600px;
                    text-align: left;
                }

                .hero-header-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    justify-content: flex-start;
                }

                .hub-icon {
                    display: flex;
                    color: var(--color-secondary);
                }
                
                .pill-title {
                    font-size: 1.2rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(255,255,255,0.8);
                    margin: 0;
                    font-weight: 700;
                    white-space: pre-line;
                }

                .hero-main-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                    line-height: 1.1;
                    color: white;
                    text-align: left;
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    line-height: 1.6;
                    margin: 0;
                    text-align: left;
                }

                /* Scanning Hero Section */
                .scanning-hero-section {
                    background: #000;
                    color: white;
                    padding: 100px 0;
                }

                .scanning-title {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                    background: linear-gradient(to bottom, #fff 0%, #888 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .scanning-lead {
                    color: #888;
                    max-width: 700px;
                }

                .scanning-visual-container {
                    margin-top: 60px;
                    position: relative;
                    display: flex;
                    justify-content: center;
                }

                .scanning-image {
                    max-width: 900px;
                    width: 100%;
                    height: auto;
                    filter: drop-shadow(0 0 50px rgba(255,255,255,0.1));
                    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
                }

                .sub-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 40px;
                }

                .service-list-card {
                    padding: 40px;
                }

                .custom-list {
                    list-style: none;
                    padding: 0;
                    margin: 20px 0 0 0;
                }
                
                .custom-list li {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 20px;
                    color: var(--color-text-main);
                }

                .service-item-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .service-name {
                    font-size: 1.1rem;
                    font-weight: 500;
                }

                .service-icon {
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .service-desc {
                    margin: 0 0 0 28px; /* Indent to align with text start */
                    font-size: 0.95rem;
                    color: #555; /* Darker for better visibility */
                    line-height: 1.4;
                }

                .tier1-card {
                    padding: 40px;
                    background: white;
                    display: flex;
                    align-items: center;
                    border: 1px solid rgba(0,0,0,0.05); /* Make it subtle */
                }

                .badge {
                    display: inline-block;
                    background: var(--color-primary);
                    color: white;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 15px;
                }
                
                .info-visual {
                    padding: 40px;
                    background: white;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .blogs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 30px;
                    margin-top: 20px;
                }
                
                .blog-card {
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .blog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                }

                .blog-card-content {
                    padding: 24px;
                    text-align: left;
                }

                .blog-card-content h4 {
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    line-height: 1.4;
                }

                .read-more {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--color-primary);
                    font-weight: 600;
                    font-size: 0.95rem;
                    margin-top: 8px;
                }

                .blog-image-placeholder {
                    padding: 24px 24px 0 24px;
                    color: #666;
                    font-size: 0.9rem;
                    text-align: left;
                }

                .apple-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }

                .apple-title {
                    font-size: 3rem;
                    font-weight: 700;
                    margin-bottom: 24px;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    color: #1d1d1f;
                }

                .apple-desc {
                    font-size: 1.25rem;
                    line-height: 1.5;
                    font-weight: 400;
                    color: #424245; /* Apple gray */
                    max-width: 90%;
                }

                .benefits-card {
                    background: #fbfbfd; /* Very subtle off-white */
                    border-radius: 24px;
                    padding: 40px;
                    border: 1px solid rgba(0,0,0,0.04);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                }
                
                .benefits-header {
                    font-size: 1.2rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #86868b;
                    margin-bottom: 25px;
                    font-weight: 600;
                }

                .benefit-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .benefit-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    margin-bottom: 20px;
                    font-size: 1.1rem;
                    color: #1d1d1f;
                    font-weight: 500;
                }

                .benefit-icon {
                    color: var(--color-primary-teal);
                    flex-shrink: 0;
                    margin-top: 4px;
                }

                @media (max-width: 1024px) {
                    .sub-grid { grid-template-columns: 1fr; gap: 24px; }
                    .hero-main-title { font-size: 2.2rem; word-wrap: break-word; line-height: 1.1; margin-bottom: 16px; } 
                    .hub-hero { padding: 100px 0 50px 0; min-height: auto; }
                    .hero-overlay { background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%); } 
                    .scanning-title { font-size: 1.8rem; }
                    .hub-hero .container { padding-left: 20px; padding-right: 20px; }
                    .hero-subtitle { font-size: 1rem; line-height: 1.5; }
                    .pill-title { font-size: 1rem; }
                    
                    /* Apple Style Mobile */
                    .apple-grid { grid-template-columns: 1fr; gap: 30px; }
                    .apple-title { font-size: 2rem; margin-bottom: 16px; }
                    .apple-desc { max-width: 100%; font-size: 1rem; line-height: 1.5; }
                    
                    .service-list-card, .tier1-card, .benefits-card, .info-visual {
                        padding: 24px;
                        border-radius: 20px;
                        margin-left: 8px;
                        margin-right: 8px;
                        width: auto;
                    }
                    
                    .blog-section .glass-panel {
                        margin-bottom: 0;
                    }

                    .blogs-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .hero-content-left {
                        width: 100%;
                    }

                    .scanning-hero-section { padding: 60px 0; }
                    .scanning-visual-container { margin-top: 40px; }
                    .section-padding { padding: 40px 0; }
                }
            `}</style>
        </div>
    );
};

const Services = () => {
    return (
        <Routes>
            <Route path="/" element={<ServicesLanding />} />

            {/* Main Category Pages */}
            <Route path=":category" element={<ServiceHub />} />

            {/* Specialty Sub-Pages */}
            <Route path="protect/wisdom-tooth" element={<WisdomToothSurgery />} />
            <Route path="protect/root-canal" element={<RootCanalTreatment />} />
            <Route path="straighten/clear-aligners" element={<ClearAligners />} />
            <Route path="replace/dental-implants" element={<DentalImplants />} />
            <Route path="enhance/teeth-whitening" element={<TeethWhitening />} />
            <Route path="children/myofunctional" element={<MyofunctionalOrthodontics />} />
            <Route path="enhance/cosmetic-dentistry" element={<CosmeticDentistry />} />
            <Route path="children/pediatric-dentistry" element={<PediatricDentistry />} />
        </Routes>
    );
};

export default Services;
