import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Sparkles, Smile, Users } from 'lucide-react';
import Button from '../components/Button';

// Updated Image Paths
const FAMILY_HERO = "/images/family_hero_1765825154068.png";
const GUM_IMG = "/images/gum_hero_1765825178470.png";
const SENSITIVITY_IMG = "/images/sensitivity_hero_1765825197668.png";
const ORTHO_IMG = "/images/adult_ortho_hero_1765825218135.png";
const BONE_IMG = "/images/bone_loss_hero_1765825236985.png";
const VENEER_IMG = "/images/veneers_hero_1765825257935.png";
const AIRWAY_IMG = "/images/child_airway_hero_1765825276038.png";

const Home = () => {
    const navigate = useNavigate();

    // Scroll Animation Logic
    const scrollSectionRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollSectionRef.current) return;
            const el = scrollSectionRef.current;
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Start scrolling when the section hits the top of the viewport
            // We want it sticky, so 'top' will eventually be 0.
            // But we can calculate progress based on how much of the 'height' has passed.
            // The section height is large (e.g. 400vh).
            // Progress = (ViewportHeight - rect.top) / (rect.height - ViewportHeight) roughly?
            // Actually, simplified:
            // When rect.top is 0, progress starts.
            // When rect.bottom is viewportHeight, progress ends.

            const start = 0;
            const end = el.offsetHeight - viewportHeight;
            let current = -rect.top;

            let progress = current / end;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="liquid-shape" style={{ top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--color-secondary)' }}></div>
                <div className="liquid-shape animate-float" style={{ bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'var(--color-primary)', animationDelay: '1s' }}></div>
                <div className="liquid-shape" style={{ top: '40%', right: '30%', width: '200px', height: '200px', background: 'var(--color-accent)', filter: 'blur(60px)' }}></div>

                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Dental Care for <br />
                            <span className="text-gradient">Every Generation</span>
                        </h1>
                        <p className="hero-subtitle">
                            At iSmile, we deliver high-quality dental care for every stage of life, ensuring that individuals and families maintain radiant, healthy smiles.
                        </p>
                        <div className="hero-actions">
                            <Button onClick={() => window.open('https://wa.me/6013222135', '_blank')}>Book an Appointment</Button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="glass-panel hero-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <img src={FAMILY_HERO} alt="Happy Family" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            <div className="glass-badge floating-badge">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ background: 'white', padding: '8px', borderRadius: '50%' }}>
                                        <Star size={16} fill="#FFD700" color="#FFD700" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Top Rated</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Dental Clinic</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Welcome Section */}
            <section className="section-padding welcome-section">
                <div className="container">
                    <div className="glass-panel welcome-card">
                        <div className="split-image">
                            <div className="glass-panel image-frame" style={{ height: '300px', padding: 0, overflow: 'hidden' }}>
                                <img src="/images/team_group.jpg" alt="Our Team" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                            </div>
                        </div>
                        <div className="welcome-content">
                            <h2>Welcome to iSmile.</h2>
                            <div className="divider"></div>
                            <p>
                                At iSmile, we combine <strong>family-run warmth</strong> with <strong>advanced, high-quality dentistry</strong> to deliver care that is both personal and precise.
                                With over 20 years of experience in caring for our patients, we strive to make every patient feel comfortable, supported, and genuinely cared for.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Service Pillars */}
            <section className="section-padding services-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Comprehensive Care for <span className="text-gradient">Every Stage of Life</span></h2>
                    </div>

                    <div className="pillars-grid">
                        {[
                            { icon: <Shield size={32} />, title: "Maintain & Repair", desc: "Check-ups, fillings, and prevention.", path: "/services/maintain" },
                            { icon: <Sparkles size={32} />, title: "Straighten Teeth", desc: "Braces and clear aligners for all ages.", path: "/services/straighten" },
                            { icon: <Smile size={32} />, title: "Replace Missing Teeth", desc: "Implants, bridges, and dentures.", path: "/services/replace" },
                            { icon: <Star size={32} />, title: "Enhance Smile", desc: "Whitening, veneers, and makeovers.", path: "/services/enhance" },
                            { icon: <Users size={32} />, title: "Children & Growth", desc: "Early intervention and airway health.", path: "/services/children" },
                        ].map((service, index) => (
                            <Link to={service.path} key={index} className="glass-panel pillar-card">
                                <div className="pillar-icon">{service.icon}</div>
                                <h3 className="pillar-title">{service.title}</h3>
                                <p className="pillar-desc">{service.desc}</p>
                                <div className="pillar-arrow"><ArrowRight size={20} /></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Social Proof */}
            <section className="section-padding reviews-section">
                <div className="container">
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>Trusted by <span className="text-gradient">Families</span></h2>
                    <div className="reviews-slider">
                        {[
                            { text: "My kids actually look forward to going to the dentist now. Dr. Jean is simply amazing!", author: "Sarah L.", type: "Parent" },
                            { text: "I was terrified of dentists, but the iSmile team made me feel so safe and heard.", author: "Michael T.", type: "Nervous Patient" },
                            { text: "Professional, clean, and incredibly detailed in their work. Highly recommended.", author: "David K.", type: "Professional" }
                        ].map((review, i) => (
                            <div key={i} className="glass-panel review-card">
                                <div className="review-stars">★★★★★</div>
                                <p className="review-text">"{review.text}"</p>
                                <div className="review-author">
                                    <strong>{review.author}</strong>
                                    <span>{review.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: '60px' }}>
                        <Link to="/reviews" className="btn-link">See More Reviews <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </section>

            {/* 5. About Us Preview */}
            <section className="section-padding about-preview">
                <div className="container">
                    <div className="split-layout">
                        <div className="split-content">
                            <h2>Built on <span className="text-gradient">Competency & Compassion</span></h2>
                            <p>
                                Dr. Jean Ong, founder of iSmile Dental Clinic, is a highly experienced dental surgeon with over 25 years in the field and a distinguished graduate of the University of Malaya.
                                She established the clinic to offer modern, high-quality, family-centred dental care.
                            </p>
                            <Button variant="outline" onClick={() => navigate('/about')}>Meet Our Team</Button>
                        </div>
                        <div className="split-image">
                            <div className="glass-panel image-frame" style={{ height: '300px', padding: 0, overflow: 'hidden' }}>
                                <img src="/images/team_group.jpg" alt="Our Team" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Insights Preview - Sticky Scroll */}
            {/* Container height defines scroll duration (300vh = 3 screens worth of scroll) */}
            <section className="insights-sticky-container" ref={scrollSectionRef} style={{ height: '300vh', position: 'relative' }}>
                <div className="sticky-viewport">
                    <div className="container h-full flex-col-center">
                        <div className="section-header flex-between w-full">
                            <h2>Dental Health Insights</h2>
                            <Link to="/blog" className="btn-link">Visit Learning Centre <ArrowRight size={16} /></Link>
                        </div>

                        {/* Horizontal Track */}
                        <div className="horizontal-track-mask">
                            <div
                                className="horizontal-track"
                                style={{
                                    transform: `translateX(-${scrollProgress * 60}%)` // Scroll up to 60%
                                }}
                            >
                                {[
                                    { title: "Understanding Gum Health", img: GUM_IMG },
                                    { title: "Managing Tooth Sensitivity", img: SENSITIVITY_IMG },
                                    { title: "Adult Orthodontics", img: ORTHO_IMG },
                                    { title: "Understanding Bone Loss", img: BONE_IMG },
                                    { title: "Types of Veneers", img: VENEER_IMG },
                                    { title: "Mouth Breathing (Kids)", img: AIRWAY_IMG }
                                ].map((item, i) => (
                                    <div key={i} className="glass-panel insight-card-large">
                                        <div className="insight-image-large">
                                            <img src={item.img} alt={item.title} />
                                        </div>
                                        <div className="insight-content">
                                            <h4>{item.title}</h4>
                                            <Link to="/blog" className="read-more-link">Read More</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p style={{ marginTop: '20px', opacity: 0.6 }}>Scroll down to see more...</p>
                    </div>
                </div>
            </section >

            <style>{`
        /* General Hero & Section Styles */
        .hero-section { min-height: 90vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 80px; }
        .hero-container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; position: relative; z-index: 2; }
        .hero-title { font-size: 3.5rem; line-height: 1.1; margin-bottom: 20px; font-weight: 700; }
        .hero-subtitle { font-size: 1.25rem; color: var(--color-text-muted); margin-bottom: 30px; max-width: 500px; }
        .hero-card { padding: 20px; position: relative; transform: rotate(-2deg); transition: transform 0.5s ease; }
        .hero-card:hover { transform: rotate(0deg) scale(1.02); }
        .floating-badge { position: absolute; bottom: 40px; right: -20px; background: rgba(255, 255, 255, 0.9); padding: 10px 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); backdrop-filter: blur(10px); }
        
        /* Welcome */
        .welcome-card { padding: 60px; text-align: center; max-width: 800px; margin: 0 auto; }
        .divider { height: 4px; width: 60px; background: var(--color-primary); margin: 0 auto 30px; border-radius: 2px; }

        /* Pillars with Fixed Alignment */
        .pillars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 40px; }
        .pillar-card { padding: 30px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; transition: all 0.3s ease; height: 100%; }
        .pillar-card:hover { transform: translateY(-5px); background: rgba(255,255,255, 0.85); border-color: var(--color-primary); }
        .pillar-icon { color: var(--color-primary); background: var(--color-tint-blue); padding: 15px; border-radius: 50%; margin-bottom: 5px; }
        
        /* === FIX FOR ALIGNMENT === */
        .pillar-title {
             min-height: 3rem; /* Enforce height for 2 lines */
             display: flex;
             align-items: center;
             justify-content: center;
             margin: 0;
             line-height: 1.2;
             font-size: 1.15rem;
        }
        /* ========================= */
        
        .pillar-desc { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 15px; }
        .pillar-arrow { margin-top: auto; opacity: 0; transform: translateX(-10px); transition: all 0.3s ease; color: var(--color-primary); }
        .pillar-card:hover .pillar-arrow { opacity: 1; transform: translateX(0); }

        /* Reviews */
        .reviews-slider { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .review-card { padding: 30px; }
        .review-stars { color: #FFD700; margin-bottom: 15px; font-size: 1.2rem; }
        .btn-link { color: var(--color-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }

        /* About */
        .split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .image-placeholder-rect { width: 100%; height: 300px; background: #eee; display: flex; align-items: center; justify-content: center; color: #aaa; border-radius: 12px; }

        /* === STICKY SCROLL SECTION === */
        .sticky-viewport {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom, #fff, #f8fcfd);
        }
        
        .h-full { height: 100%; }
        .flex-col-center { display: flex; flex-direction: column; justify-content: center; width: 100%; }
        
        .horizontal-track-mask {
            width: 100%;
            overflow: hidden; /* Hide scrollbar */
            padding: 40px 0;
        }
        
        .horizontal-track {
            display: flex;
            gap: 40px;
            width: max-content;
            padding: 0 5vw; /* Start with some padding */
            transition: transform 0.1s linear; /* Smooth-ish sync */
            will-change: transform;
        }
        
        .insight-card-large {
            width: 70vw; /* Stretch across screen as requested (iPhone style) */
            max-width: 500px;
            flex-shrink: 0;
            padding: 0;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
            /* Ensure images fit */
        }
        
        .insight-image-large {
            height: 300px;
            width: 100%;
        }
        
        .insight-image-large img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .insight-content {
            padding: 25px; /* Added padding to fix text clipping */
        }
        
        .insight-content h4 {
            margin-bottom: 10px;
            font-size: 1.2rem;
        }

        .read-more-link {
            font-size: 1rem;
            color: var(--color-primary);
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .hero-container, .split-layout { grid-template-columns: 1fr; text-align: center; }
            .hero-title { font-size: 2.5rem; }
            .hero-visual { order: -1; }
            .insight-card-large { width: 85vw; }
        }
      `}</style>
        </>
    );
};

export default Home;
