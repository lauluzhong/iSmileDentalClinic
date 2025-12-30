import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Sparkles, Smile, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';

// Specialty Pages
import WisdomToothSurgery from './specialties/WisdomToothSurgery';
import ClearAligners from './specialties/ClearAligners';
import DentalImplants from './specialties/DentalImplants';
import TeethWhitening from './specialties/TeethWhitening';
import RootCanalTreatment from './specialties/RootCanalTreatment';
import MyofunctionalOrthodontics from './specialties/MyofunctionalOrthodontics';


const servicesData = {
    protect: {
        title: "Protect & Repair\n (Preventive & Restorative)",
        hero: "Healthy Teeth. For Life.",
        description: "Competent and committed services to help you maintain a healthy smile.",
        icon: <Shield size={32} />,
        color: "var(--color-primary)",
        services: [
            { name: "Comprehensive Examination and Diagnosis", desc: "Detailed evaluation to cover your oral health for accurate diagnosis and treatment planning." },
            { name: "Scaling & Polishing", desc: "Professional cleaning to remove plaque, tartar, and surface stains." },
            { name: "Tooth Fillings", desc: "Restoring decayed teeth with high-quality tooth-coloured materials." },
            { name: "Root Canal Treatment", desc: "Saving infected teeth by removing damaged pulp and sealing the root." },
            { name: "Wisdom Tooth Surgery", desc: "Safe removal of impacted wisdom teeth to prevent pain and crowding." }
        ],
        tier1: {
            title: "Root Canal Treatment",
            desc: "Save your natural tooth. Advanced endodontic therapy to relieve pain and restore function.",
            path: "/services/protect/root-canal"
        },
        experience: {
            title: "Preventive Dentistry & Long-Term Care",
            desc: "Our philosophy is simple: prevention is better than cure. We prioritize early detection to preserve your natural tooth structure, using minimally invasive techniques that save you time, money, and discomfort in the long run.",
            benefits: [
                "Digital Diagnostic Imaging for Early Detection",
                "Minimally Invasive Restorative Techniques",
                "Comprehensive Gum Health Management",
                "Anxiety-Free, Judgment-Free Environment"
            ]
        },
        blogs: [
            { title: "Understanding Gum Health", path: "/blog/gum-health", image: "Gum Health" },
            { title: "Managing Tooth Sensitivity", path: "/blog/sensitivity", image: "Sensitivity" }
        ]
    },
    straighten: {
        title: "Straighten Teeth\n (Orthodontics)",
        hero: "Confidence in Every Smile.",
        description: "Modern orthodontic solutions for children, teens, and adults.",
        icon: <Sparkles size={32} />,
        color: "var(--color-secondary)",
        services: [
            { name: "Clear Aligners", desc: "Invisible, removable trays (Invisalign/Clearsmile) for discreet straightening." },
            { name: "Fixed Appliances (Metal & Clear Brackets)", desc: "Powered by the latest Damon Ultima, Q2, and Clear 2 technology." },
            { name: "Removable Appliances", desc: "Early intervention devices for minor tooth movements and growth." },
            { name: "Retainers", desc: "Custom devices (Hawley/Essix) to maintain your new smile after treatment." }
        ],
        tier1: {
            title: "Clear Aligners (Invisalign / Clearsmile)",
            desc: "The clear alternative to braces. Straighten your teeth without anyone knowing.",
            path: "/services/straighten/clear-aligners"
        },
        experience: {
            title: "Digital 3D Scanning",
            desc: "No more messy moulds. We use advanced 3D scanners to visualize your new smile instantly.",
            visualTitle: "Fixed Braces vs. Clear Aligners",
            visualContent: (
                <ul className="comparison-list">
                    <li><strong>Visibility:</strong> Clear Aligners are virtually invisible, whereas braces are noticeable.</li>
                    <li><strong>Comfort:</strong> Aligners are smooth plastic (no wires/brackets), reducing irritation.</li>
                    <li><strong>Hygiene:</strong> Aligners are removable, making flossing and brushing easier.</li>
                    <li><strong>Diet:</strong> No dietary restrictions with aligners; just remove them to eat!</li>
                </ul>
            )
        },
        blogs: [
            { title: "Adult Orthodontics: Is it too late?", path: "/blog/adult-ortho", image: "Adult Ortho" },
            { title: "Living with Retainers", path: "/blog/retainers", image: "Retainers" }
        ]
    },
    replace: {
        title: "Replace Teeth\n (Prosthetics & Implants)",
        hero: "Eat, Speak, and Smile Again.",
        description: "Restoring function and aesthetics for a complete, confident smile.",
        icon: <Smile size={32} />,
        color: "var(--color-primary)",
        services: [
            { name: "Dental Implants", desc: "Permanent, natural-looking replacements for missing tooth roots." },
            { name: "Dental Bridges", desc: "Fixed restoration to bridge the gap created by one or more missing teeth." },
            { name: "Complete Dentures", desc: "Full replacements for missing teeth, restoring function and appearance." },
            { name: "Partial Dentures", desc: "Removable option to replace several missing teeth in a row." },
            { name: "Denture Repairs & Relines", desc: "Maintenance to ensure your dentures fit comfortably and last longer." }
        ],
        tier1: {
            title: "Dental Implants",
            desc: "The gold standard for tooth replacement. Look and function just like natural teeth.",
            path: "/services/replace/dental-implants"
        },
        experience: {
            title: "Function, Comfort, & Confidence",
            desc: "Missing teeth affect more than just your smile—they impact your ability to eat, speak, and live fully. We specialize in functional restoration using biocompatible materials that look and feel like your natural teeth.",
            benefits: [
                "Biocompatible Dental Implants (Titanium)",
                "Bone Preservation to Maintain Facial Structure",
                "High-Esthetic Ceramics for Natural Looks",
                "Full Bite Force Restoration"
            ]
        },
        blogs: [
            { title: "Understanding Bone Loss", path: "/blog/bone-loss", image: "Bone Loss" },
            { title: "Are Dental Implants Safe?", path: "/blog/implant-safety", image: "Implant Safety" }
        ]
    },
    enhance: {
        title: "Enhance Smile\n (Cosmetic Dentistry)",
        hero: "Design Your Dream Smile.",
        description: "Cosmetic dental treatments tailored to your unique facial features.",
        icon: <Star size={32} />,
        color: "var(--color-accent)",
        services: [
            { name: "Composite Veneers", desc: "Direct bonding to reshape teeth and improve aesthetics in one visit." },
            { name: "Ceramic Veneers", desc: "Durable, high-quality porcelain shells for a flawless, lasting smile." },
            { name: "Take-Home Whitening (Gold Standard)", desc: "Customized trays and professional gels for the most stable, long-lasting results." },
            { name: "In-House Whitening", desc: "Rapid clinical whitening for immediate results when time is of the essence." },
            { name: "All-Ceramic Crowns", desc: "Strength and beauty combined for badly damaged or aesthetic teeth. Option for single-visit crown by appointment." },
            { name: "Full Mouth Rehabilitation", desc: "Comprehensive restoration of worn down teeth to improve function, health, and appearance." }
        ],
        tier1: {
            title: "Professional Take-Home Whitening",
            desc: "Transform your smile with professional whitening treatments tailored to you.",
            path: "/services/enhance/teeth-whitening"
        },
        experience: {
            title: "Designed for Your Unique Face",
            desc: "True cosmetic dentistry goes beyond just 'white teeth'. We analyze and design a smile with function in mind that is pleasing and harmonious.",
            benefits: [
                "Detailed Smile Analysis",
                "Custom 'Trial Smile' Mock-ups",
                "Minimally Invasive Veneer Protocols",
                "Natural Light Reflection & Texture"
            ]
        },
        blogs: [
            { title: "Types of Veneers", path: "/blog/veneer-types", image: "Veneers" },
            { title: "Fixing Gummy Smiles", path: "/blog/gummy-smiles", image: "Gummy Smile" }
        ]
    },
    children: {
        title: "Children & Growth\n (Paediatric Dentistry)",
        hero: "Growing Healthy Smiles & Airways.",
        description: "Intentional care from young children to adolescence, focusing on growth and development.",
        icon: <Users size={32} />,
        color: "var(--color-secondary)",
        services: [
            { name: "Myofunctional Orthodontics", desc: "Correcting oral habits to guide proper jaw and face growth." },
            { name: "Fissure Sealants", desc: "Protective coatings on back teeth to prevent decay in grooves." },
            { name: "Topical Fluoride", desc: "Strengthening enamel to make teeth more resistant to cavities." },
            { name: "Paediatric Fillings", desc: "Gentle restoration for baby teeth to maintain space and health." },
            { name: "Baby Tooth Extraction", desc: "Careful removal of retained baby teeth to allow adult teeth to erupt." }
        ],
        tier1: {
            title: "Myofunctional Orthodontics",
            desc: "Addressing mouth breathing and oral habits for better sleep and healthy facial development.",
            path: "/services/children/myobrace"
        },
        experience: {
            title: "Growing Healthy Airways & Smiles",
            desc: "Modern paediatric dentistry is about more than cavities. We rigorously screen for developmental issues like mouth breathing and tongue ties, intervening early to ensure your child develops a healthy airway and a broad, beautiful smile.",
            benefits: [
                "Airway-Centric Growth Assessment",
                "Myofunctional Therapy for Oral Habits",
                "Trauma-Free, Child-Friendly Approach",
                "Early Orthodontic Intervention"
            ]
        },
        blogs: [
            { title: "Mouth Breathing vs Nasal Breathing", path: "/blog/mouth-breathing", image: "Mouth Breathing" },
            { title: "Thumb Sucking: When to worry", path: "/blog/thumb-sucking", image: "Thumb Sucking" }
        ]
    }
};

const ServiceHub = () => {
    const { openBooking } = useBooking();
    const { category } = useParams();
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

    return (
        <div className="service-hub">
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
                            <h3>{data.tier1.title}</h3>
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
                    <Button onClick={() => openBooking(`Interested in ${data.title.split("\n")[0]}`)}>Book Consultation</Button>
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

                @media (max-width: 768px) {
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
            <Route path="/" element={<Navigate to="/services/protect" replace />} />

            {/* Main Category Pages */}
            <Route path=":category" element={<ServiceHub />} />

            {/* Specialty Sub-Pages */}
            <Route path="protect/wisdom-tooth" element={<WisdomToothSurgery />} />
            <Route path="protect/root-canal" element={<RootCanalTreatment />} />
            <Route path="straighten/clear-aligners" element={<ClearAligners />} />
            <Route path="replace/dental-implants" element={<DentalImplants />} />
            <Route path="enhance/teeth-whitening" element={<TeethWhitening />} />
            <Route path="children/myobrace" element={<MyofunctionalOrthodontics />} />
        </Routes>
    );
};

export default Services;
