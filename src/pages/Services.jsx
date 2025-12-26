import React from 'react';
import { Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Sparkles, Smile, Star, Users } from 'lucide-react';
import Button from '../components/Button';

// Specialty Pages
import WisdomToothSurgery from './specialties/WisdomToothSurgery';
import ClearAligners from './specialties/ClearAligners';
import DentalImplants from './specialties/DentalImplants';
import TeethWhitening from './specialties/TeethWhitening';
import MyofunctionalOrthodontics from './specialties/MyofunctionalOrthodontics';


const servicesData = {
    maintain: {
        title: "Maintain & Repair\n (Preventive & Restoration)",
        hero: "Healthy Teeth. For Life.",
        description: "Preventive care to detect issues early and restorative treatments to bring back functionality.",
        icon: <Shield size={32} />, 
        color: "var(--color-primary)",
        services: ["General Consultation", "Scaling & Polishing", "Tooth Fillings", "Root Canal Treatment", "Wisdom Tooth Surgery"],
        tier1: {
            title: "Wisdom Tooth Surgery",
            desc: "Expert removal of impacted or problematic wisdom teeth with minimal discomfort.",
            path: "/services/maintain/wisdom-tooth"
        },
        experience: {
            title: "A Judgment-Free Zone",
            desc: "We understand dental anxiety. Our team is trained to provide a calm, non-judgmental environment for all check-ups.",
            visualTitle: "What to expect?",
            visualContent: (
                <>
                    <p>
                        At iSmile, you can expect a professional and gentle experience. Our doctors handle every patient with extreme care,
                        ensuring your comfort at all times. We provide honest advice tailored to your well-being, skipping the judgment
                        so you can focus on getting a healthy smile.
                    </p>
                </>
            )
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
        services: ["Clear Aligners (Invisalign/Clearsmile)", "Metal Braces (Damon)", "Retainers (Hawley/Essix)", "Removable Appliances", "Fixed Appliances"],
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
        title: "Replace Missing Teeth\n (Prosthetics & Implants)",
        hero: "Eat, Speak, and Smile Again.",
        description: "Restoring function and aesthetics for a complete, confident smile.",
        icon: <Smile size={32} />, 
        color: "var(--color-primary)",
        services: ["Dental Implants", "Dental Bridges", "Complete Dentures", "Partial Dentures", "Denture Repairs & Relines"],
        tier1: {
            title: "Dental Implants",
            desc: "The gold standard for tooth replacement. Look and feel just like natural teeth.",
            path: "/services/replace/dental-implants"
        },
        experience: {
            title: "Restoring Dignity & Function",
            desc: "Missing teeth can affect more than just your smile. We help you regain the confidence to eat and speak freely.",
            visualTitle: "Why This Matters",
            visualContent: (
                <p>
                    Losing teeth can be daunting, but iSmile is here to help you restore your dignity and function.
                    We believe everyone deserves to eat the foods they love and smile without hesitation.
                    Our goal is to give you back the confidence to live your life fully.
                </p>
            )
        },
        blogs: [
            { title: "Understanding Bone Loss", path: "/blog/bone-loss", image: "Bone Loss" },
            { title: "Are Dental Implants Safe?", path: "/blog/implant-safety", image: "Implant Safety" }
        ]
    },
    enhance: {
        title: "Enhance Smile\n (Cosmetic Dentistry)",
        hero: "Design Your Dream Smile.",
        description: "Cosmetic treatments tailored to your unique facial features.",
        icon: <Star size={32} />, 
        color: "var(--color-accent)",
        services: ["Composite Veneers", "Ceramic Veneers", "In-House Whitening", "Take-Home Whitening", "All-Ceramic Crowns"],
        tier1: {
            title: "Teeth Whitening (In-House / Take-Home)",
            desc: "Transform your smile with professional whitening treatments tailored to you.",
            path: "/services/enhance/teeth-whitening"
        },
        experience: {
            title: "The 'Trial Smile'",
            desc: "See your new smile before you commit. We create digital mock-ups so you know exactly what to expect.",
            visualTitle: "Why This Matters",
            visualContent: (
                <p>
                    At iSmile, we believe in clarity before commitment. We provide digital mock-ups and trial smiles
                    so you can see your potential results before investing in treatment. This ensures you have
                    realistic expectations and attain the smile you truly desire.
                </p>
            )
        },
        blogs: [
            { title: "Types of Veneers", path: "/blog/veneer-types", image: "Veneers" },
            { title: "Fixing Gummy Smiles", path: "/blog/gummy-smiles", image: "Gummy Smile" }
        ]
    },
    children: {
        title: "Children & Growth\n (Paediatrics)",
        hero: "Growing Healthy Smiles & Airways.",
        description: "Specialized care for infants and children, focusing on growth and development.",
        icon: <Users size={32} />, 
        color: "var(--color-secondary)",
        services: ["Myofunctional Orthodontics", "Fissure Sealants", "Topical Fluoride", "Paediatric Fillings", "Baby Tooth Extraction"],
        tier1: {
            title: "Myofunctional Orthodontics",
            desc: "Addressing mouth breathing and oral habits for better sleep and healthy facial development.",
            path: "/services/children/myobrace"
        },
        experience: {
            title: "Red Flag Checklist",
            desc: "We screen for snoring, mouth breathing, and teeth grinding to catch developmental issues early.",
            visualTitle: "Why This Matters",
            visualContent: (
                <p>
                    Identifying red flags early in a child's development is crucial. Catching issues like mouth breathing
                    or improper swallowing early can prevent long-term orthodontic and health problems,
                    ensuring your child grows up with a healthy airway and a beautiful smile.
                </p>
            )
        },
        blogs: [
            { title: "Mouth Breathing vs Nasal Breathing", path: "/blog/mouth-breathing", image: "Mouth Breathing" },
            { title: "Thumb Sucking: When to worry", path: "/blog/thumb-sucking", image: "Thumb Sucking" }
        ]
    }
};

const ServiceHub = () => {
    const { category } = useParams();
    const data = servicesData[category];

    if (!data) return <div className="container section-padding">Service not found</div>;

    const getBgPosition = (cat) => {
        const positions = {
            maintain: '60% 30%',
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
                    <div className="glass-panel service-list-card">
                        <h3>Key Services</h3>
                        <ul className="custom-list">
                            {data.services.map((item, i) => (
                                <li key={i}><CheckCircle size={18} color="var(--color-primary)" /> {item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Tier 1 Highlight */}
                    <div className="glass-panel tier1-card">
                        <div className="tier1-content">
                            <span className="badge">Our Speciality</span>
                            <h3>{data.tier1.title}</h3>
                            <p>{data.tier1.desc}</p>
                            <Link to={data.tier1.path}>
                                <Button variant="outline">Learn More</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience Section */}
            {category === 'straighten' ? (
                <div className="experience-section scanning-hero-section section-padding">
                    <div className="container text-center">
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
                    </div>
                </div>
            ) : (
                <div className="experience-section section-padding" style={{ background: 'var(--color-tint-blue)' }}>
                    <div className="container">
                        <div className="split-layout">
                            <div className="exp-content">
                                <h2>{data.experience.title}</h2>
                                <p className="lead-text">{data.experience.desc}</p>
                            </div>
                            <div className="exp-visual">
                                <div className="glass-panel info-visual">
                                    <h3>{data.experience.visualTitle || "Why This Matters"}</h3>
                                    {data.experience.visualContent}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA & Blogs */}
            <div className="container section-padding text-center">
                <h2>Ready for a healthier smile?</h2>

                {data.blogs && data.blogs.length > 0 && (
                    <div className="blog-section mt-4 mb-4">
                        <p className="text-muted section-label">Learn more about:</p>
                        <div className="blogs-grid">
                            {data.blogs.map((blog, i) => (
                                <Link key={i} to={blog.path} className="glass-panel blog-card">
                                    <div className="blog-image-placeholder">{blog.image}</div>
                                    <div className="blog-card-content">
                                        <h4>{blog.title}</h4>
                                        <span className="read-more">Read More <ArrowRight size={14} /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <br />
                <Button onClick={() => window.open('https://wa.me/6013222135', '_blank')}>Book Consultation</Button>
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
                    gap: 10px;
                    align-items: center;
                    margin-bottom: 15px;
                    font-size: 1.1rem;
                }

                .tier1-card {
                    padding: 40px;
                    background: white;
                    display: flex;
                    align-items: center;
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
                }

                @media (max-width: 768px) {
                    .sub-grid { grid-template-columns: 1fr; }
                    .hero-main-title { font-size: 2.5rem; }
                    .hub-hero { padding: 120px 0 60px 0; min-height: 400px; }
                    .hero-overlay { background: rgba(0,0,0,0.7); }
                    .scanning-title { font-size: 2rem; }
                    .hub-hero .container { padding-left: 20px; }
                }
            `}</style>
        </div>
    );
};

const Services = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/services/maintain" replace />} />
            
            {/* Main Category Pages */}
            <Route path=":category" element={<ServiceHub />} />

            {/* Specialty Sub-Pages */}
            <Route path="maintain/wisdom-tooth" element={<WisdomToothSurgery />} />
            <Route path="straighten/clear-aligners" element={<ClearAligners />} />
            <Route path="replace/dental-implants" element={<DentalImplants />} />
            <Route path="enhance/teeth-whitening" element={<TeethWhitening />} />
            <Route path="children/myobrace" element={<MyofunctionalOrthodontics />} />
        </Routes>
    );
};

export default Services;
