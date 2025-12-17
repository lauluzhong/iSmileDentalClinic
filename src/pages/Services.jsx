import React from 'react';
import { Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Sparkles, Smile, Star, Users } from 'lucide-react';
import Button from '../components/Button';

const servicesData = {
    maintain: {
        title: "Maintain & Repair",
        hero: "Healthy Teeth. For Life.",
        description: "Preventive care to detect issues early and restorative treatments to bring back functionality.",
        icon: <Shield size={32} />, // Reduced size to match design
        color: "var(--color-primary)",
        services: ["Diagnostics (CBCT/OPG)", "Scaling & Polishing", "Fillings", "Night Guards"],
        tier1: {
            title: "Root Canal Therapy",
            desc: "Save your natural tooth and relieve pain effectively.",
            path: "/services/maintain/root-canal"
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
        title: "Straighten Teeth",
        hero: "Confidence in Every Smile.",
        description: "Modern orthodontic solutions for children, teens, and adults.",
        icon: <Sparkles size={32} />, // Reduced size
        color: "var(--color-secondary)",
        services: ["Fixed Braces (Metal/Ceramic)", "Clear Aligners", "Retainers", "Early Intervention"],
        tier1: {
            title: "Invisalign® & Clear Aligners",
            desc: "The clear alternative to braces. Straighten your teeth without anyone knowing.",
            path: "/services/straighten/invisalign"
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
        title: "Replace Missing Teeth",
        hero: "Eat, Speak, and Smile Again.",
        description: "Restoring function and aesthetics for a complete, confident smile.",
        icon: <Smile size={32} />, // Reduced size
        color: "var(--color-primary)",
        services: ["Dental Bridges", "Dentures (Valplast/Acrylic)", "Implant-Supported Dentures"],
        tier1: {
            title: "Dental Implants",
            desc: "The gold standard for tooth replacement. Look and feel just like natural teeth.",
            path: "/services/replace/implants"
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
        title: "Enhance Smile",
        hero: "Design Your Dream Smile.",
        description: "Cosmetic treatments tailored to your unique facial features.",
        icon: <Star size={32} />, // Reduced size
        color: "var(--color-accent)",
        services: ["Teeth Whitening", "Smile Design", "Gummy Smile Correction", "Bonding"],
        tier1: {
            title: "Veneers & Makeovers",
            desc: "Transform your smile with custom-crafted porcelain veneers.",
            path: "/services/enhance/veneers"
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
        title: "Children & Growth",
        hero: "Growing Healthy Smiles & Airways.",
        description: "Specialized care for infants and children, focusing on growth and development.",
        icon: <Users size={32} />, // Reduced size
        color: "var(--color-secondary)",
        services: ["Kids Check-ups", "Fissure Sealants", "Fluoride Treatment", "Early Orthodontics"],
        tier1: {
            title: "Myofunctional Therapy & Airway",
            desc: "Addressing mouth breathing and oral habits for better sleep and health.",
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

    return (
        <div className="service-hub">
            {/* Hero */}
            <div className="hub-hero section-padding">
                <div className="container text-center">
                    <div className="hero-header-container">
                        <div className="hub-icon">{data.icon}</div>
                        <h1 className="pill-title">{data.title}</h1>
                    </div>
                    <h2 className="hero-main-title">{data.hero}</h2>
                    <p className="hero-subtitle">{data.description}</p>
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
                            <span className="badge">Featured Treatment</span>
                            <h3>{data.tier1.title}</h3>
                            <p>{data.tier1.desc}</p>
                            <Button variant="outline">Learn More</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience Section */}
            <div className="experience-section section-padding" style={{ background: 'var(--color-tint-blue)' }}>
                <div className="container">
                    <div className="split-layout">
                        <div className="exp-content">
                            <h2>{data.experience.title}</h2>
                            <p className="lead-text">{data.experience.desc}</p>
                        </div>
                        <div className="exp-visual">
                            {/* Replaced placeholder visual with helpful text block */}
                            <div className="glass-panel info-visual">
                                <h3>{data.experience.visualTitle || "Why This Matters"}</h3>
                                {data.experience.visualContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
            padding-top: 120px;
         }
         
         .hero-header-container {
             display: inline-flex;
             align-items: center;
             justify-content: center;
             gap: 15px;
             margin-bottom: 30px;
         }

         .hub-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-primary);
         }
         
         .pill-title {
             font-size: 1.5rem;
             font-weight: 700;
             color: var(--color-text-main);
             margin: 0;
         }
         
         .hero-main-title {
             font-size: 3.5rem;
             margin-bottom: 20px;
             font-weight: 800;
             color: var(--color-primary);
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
             margin-top: 20px;
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
             background: linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3));
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
         
         .comparison-list {
             padding-left: 20px;
             margin-top: 10px;
         }
         
         .comparison-list li {
             margin-bottom: 10px;
         }

         /* Blog Section Styles */
         .blog-section {
             /* MAX-WIDTH REMOVED FOR ALIGNMENT WITH HEADING */
             /* max-width: 900px; */ 
             margin: 40px auto;
             background: transparent; 
         }
         
         .section-label {
             margin-bottom: 20px;
             font-weight: 500;
             text-transform: uppercase;
             letter-spacing: 1px;
             font-size: 0.9rem;
         }

         .blogs-grid {
             display: grid;
             grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
             gap: 30px;
             justify-content: center;
         }
         
         .blog-card {
             display: block;
             text-decoration: none;
             color: inherit;
             overflow: hidden;
             transition: transform 0.3s ease, box-shadow 0.3s ease;
             border: 1px solid rgba(0,0,0,0.05);
             padding: 0; /* Remove default glass panel padding */
         }
         
         .blog-card:hover {
             transform: translateY(-5px);
             box-shadow: 0 10px 30px rgba(0,0,0,0.1);
         }
         
         .blog-image-placeholder {
             height: 160px;
             background: #e0e0e0;
             display: flex;
             align-items: center;
             justify-content: center;
             color: #888;
             font-weight: 600;
             font-size: 1.2rem;
         }
         
         .blog-card-content {
             padding: 20px;
             text-align: left;
         }
         
         .blog-card h4 {
             margin: 0 0 10px 0;
             font-size: 1.1rem;
             color: var(--color-text-main);
         }
         
         .read-more {
             color: var(--color-primary);
             font-size: 0.9rem;
             font-weight: 600;
             display: flex;
             align-items: center;
             gap: 5px;
         }

         @media (max-width: 768px) {
             .sub-grid {
                 grid-template-columns: 1fr;
             }
             .hero-header-container {
                 flex-direction: row; /* Keep horizontal on mobile too if space permits, or auto-wrap */
                 gap: 10px;
             }
         }
       `}</style>
        </div>
    );
};

// Main Services Component handling routing
const Services = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/services/maintain" replace />} />
            <Route path=":category" element={<ServiceHub />} />
        </Routes>
    );
};

export default Services;
