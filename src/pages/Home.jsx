import { useBooking } from '../context/BookingContext';
import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Sparkles, Smile, Users } from 'lucide-react';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import { motion } from 'framer-motion';

// Updated Image Paths
const FAMILY_HERO = "/images/family_hero_three_generations.jpg";
const GUM_IMG = "/images/gum_hero_1765825178470.png";
const SENSITIVITY_IMG = "/images/sensitivity_hero_1765825197668.png";
const ORTHO_IMG = "/images/adult_ortho_hero_1765825218135.png";
const BONE_IMG = "/images/bone_loss_hero_1765825236985.png";
const VENEER_IMG = "/images/veneers_hero_1765825257935.png";
const AIRWAY_IMG = "/images/child_airway_hero_1765825276038.png";

const MotionLink = motion(Link);

import { blogPosts } from '../data/blogPosts';

const Home = () => {
    const { openBooking } = useBooking();
    const navigate = useNavigate();

    // Get the specific blog posts in the requested order
    const orderedBlogIds = [
        'invisalign-vs-braces-lifestyle',
        'root-canal-vs-extraction',
        'your-childs-first-dental-visit',
        'mouth-breathing-in-children',
        'government-vs-private-braces'
    ];

    const featuredBlogs = orderedBlogIds
        .map(id => blogPosts.find(post => post.id === id))
        .filter(Boolean);

    // Scroll Animation Logic
    const scrollSectionRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollSectionRef.current) return;
            const el = scrollSectionRef.current;
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

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
        <div className="home-page" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #eff6ff 100%)', minHeight: '100vh' }}>
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="liquid-shape" style={{ top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--color-secondary)' }}></div>
                <div className="liquid-shape animate-float" style={{ bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'var(--color-primary)', animationDelay: '1s' }}></div>
                <div className="liquid-shape" style={{ top: '40%', right: '30%', width: '200px', height: '200px', background: 'var(--color-accent)', filter: 'blur(60px)' }}></div>

                <div className="container hero-container">
                    <div className="hero-content">
                        <Reveal><h1 className="hero-title">
                            Dental Care for <br />
                            <span className="text-gradient">Every Generation</span>
                        </h1></Reveal>
                        <Reveal delay={0.2}><p className="hero-subtitle">
                            At iSmile, we deliver high-quality dental care for every stage of life, ensuring that individuals and families maintain radiant, healthy smiles.
                        </p></Reveal>
                        <FadeIn delay={0.4} className="hero-actions">
                            <Button onClick={() => openBooking()}>Book an Appointment</Button>
                        </FadeIn>
                    </div>

                    <div className="hero-visual">
                        <FadeIn delay={0.2}>
                            <div className="glass-panel hero-card" style={{ padding: 0, overflow: 'hidden', aspectRatio: '4/5' }}>
                                <img src={FAMILY_HERO} alt="Happy Family" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                            </div></FadeIn>
                    </div>
                </div>
            </section>

            {/* 2. Service Bento Grid */}
            <section className="section-padding services-bento-section">
                <div className="container">
                    <div className="section-header text-center">
                        <Reveal width="100%"><h2 style={{ marginBottom: '3rem', marginTop: 0, fontSize: '3rem', fontWeight: 700 }}>Comprehensive Care for <span className="text-gradient">Every Stage of Life</span></h2></Reveal>
                    </div>

                    <div className="bento-grid">
                        {/* Card 1: Maintain & Repair */}
                        <MotionLink to="/services/maintain" className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="card-top">
                                <Shield size={32} className="card-icon" />
                            </div>
                            <div className="card-content">
                                <span className="eyebrow">PROTECT & REPAIR</span>
                                <h3 className="card-headline">Healthy Teeth. For Life</h3>
                                <p className="card-body">Comprehensive examination & diagnosis, gentle scaling & polishing to help you maintain a healthy smile.</p>
                            </div>
                        </MotionLink>

                        {/* Card 2: Straighten Teeth */}
                        <MotionLink to="/services/straighten" className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="card-top">
                                <Sparkles size={32} className="card-icon" />
                            </div>
                            <div className="card-content">
                                <span className="eyebrow">STRAIGHTEN TEETH</span>
                                <h3 className="card-headline">Confidence in Every Smile</h3>
                                <p className="card-body">Precision orthodontic treatment with metal or clear brackets and clear aligners for your every need.</p>
                            </div>
                        </MotionLink>

                        {/* Card 3: Replace Teeth */}
                        <MotionLink to="/services/replace" className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="card-top">
                                <Smile size={32} className="card-icon" />
                            </div>
                            <div className="card-content">
                                <span className="eyebrow">REPLACE TEETH</span>
                                <h3 className="card-headline">Eat, Speak and Smile Confidently Again</h3>
                                <p className="card-body">Restoring function with premium implants, bridges, and custom dentures.</p>
                            </div>
                        </MotionLink>

                        {/* Card 4: Enhance Smile */}
                        <MotionLink to="/services/enhance" className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="card-top">
                                <Star size={32} className="card-icon" />
                            </div>
                            <div className="card-content">
                                <span className="eyebrow">ENHANCE SMILE</span>
                                <h3 className="card-headline">Design Your Dream Smile.</h3>
                                <p className="card-body">Aesthetic transformation using ceramic veneers, composite bonding, and professional whitening.</p>
                            </div>
                        </MotionLink>

                        {/* Card 5: Children & Growth */}
                        <MotionLink to="/services/children" className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="card-top">
                                <Users size={32} className="card-icon" />
                            </div>
                            <div className="card-content">
                                <span className="eyebrow">CHILDREN & GROWTH</span>
                                <h3 className="card-headline">Developing Healthy Smiles</h3>
                                <p className="card-body">Early intervention and gentle dental paediatric care to keep your child's smile on track.</p>
                            </div>
                        </MotionLink>
                    </div>
                </div>
            </section>

            {/* 3. Social Proof */}
            <section className="section-padding reviews-section">
                <div className="container">
                    <Reveal width="100%"><h2 className="text-center" style={{ marginBottom: '3rem', fontSize: '3rem', fontWeight: 700 }}>Trusted by <span className="text-gradient">Families</span></h2></Reveal>
                    <div className="reviews-slider">
                        {[
                            { text: "My regular dental clinic of over a decade, with trustworthy dentists, assistants and receptionists who work diligently with so much care and love for every single one of their patients. I've referred multiple family members here since I first came, because I know they will always be in good hands here at iSmile. The environment is also inviting, clean and calming. Highly recommended.", author: "Kah Mun Hew", type: "Satisfied Patient", avatar: "https://i.pravatar.cc/150?u=sarah" },
                            { text: "I was terrified of dentists, but the iSmile team made me feel so safe and heard.", author: "Michael T.", type: "Nervous Patient", avatar: "https://i.pravatar.cc/150?u=michael" },
                            { text: "Professional, clean, and incredibly detailed in their work. Highly recommended.", author: "David K.", type: "Professional", avatar: "https://i.pravatar.cc/150?u=david" }
                        ].map((review, i) => (
                            <div key={i} className="glass-panel review-card">
                                <div className="review-stars">★★★★★</div>
                                <p className="review-text">"{review.text}"</p>
                                <div className="review-author" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img src={review.avatar} alt={review.author} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong>{review.author}</strong>
                                        <span>{review.type}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: '60px' }}>
                        <Link to="/reviews" className="btn-link">See More Reviews <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </section>

            {/* 4. Welcome Section */}
            <section className="section-padding welcome-section">
                <div className="container">
                    <div className="welcome-container">
                        <div className="welcome-content-split">
                            <h2 className="welcome-headline">Built on <br /><span className="text-blue">Competency & <br />Compassion</span></h2>
                            <p className="welcome-description">
                                At iSmile, we combine <strong>family-run warmth</strong> with <strong>advanced, high-quality dentistry</strong> to deliver care that is both personal and precise.
                                With over 20 years of experience, we strive to make every patient feel comfortable, supported, and genuinely cared for.
                            </p>
                            <div className="welcome-actions">
                                <Button variant="primary" onClick={() => navigate('/about')}>Meet Our Team</Button>
                            </div>
                        </div>
                        <div className="welcome-image-split">
                            <img src="/images/team_group.jpg" alt="Our Team" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Dental Education - Horizontal Scroll */}
            <section className="section-padding dental-education-section">
                <div className="container">
                    <div className="section-header flex-between w-full" style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 700 }}>Dental Education</h2>
                        <Link to="/blog" className="btn-link">Visit Learning Centre <ArrowRight size={16} /></Link>
                    </div>

                    <div className="horizontal-scroll-mask">
                        <div className="horizontal-track-simple">
                            {featuredBlogs.map((post, i) => (
                                <Link to={`/blog/${post.id}`} key={i} className="glass-panel insight-card-large" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="insight-image-large">
                                        <img src={post.img} alt={post.title} />
                                    </div>
                                    <div className="insight-content">
                                        <h4>{post.title}</h4>
                                        <span className="read-more-link">Read More</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        /* General Hero & Section Styles */
        .hero-section { min-height: 90vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 80px; }
        .hero-container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; position: relative; z-index: 2; }
        .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; margin-bottom: 20px; font-weight: 700; word-break: break-word; }
        .hero-subtitle { font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 30px; max-width: 500px; line-height: 1.5; }
        .hero-card { padding: 10px; position: relative; transform: rotate(-2deg); transition: transform 0.5s ease; width: 100%; max-width: 400px; margin: 0 auto; box-sizing: border-box; }
        .hero-card:hover { transform: rotate(0deg) scale(1.02); }
        .floating-badge { position: absolute; bottom: 40px; right: -20px; background: rgba(255, 255, 255, 0.9); padding: 10px 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); backdrop-filter: blur(10px); }
        
        /* Welcome Section & About Preview Section Redesign */
        .welcome-section, .about-preview { /* Use default background */ }
        .welcome-container, .about-card-container { 
            display: flex; 
            align-items: stretch; 
            min-height: 480px; 
            border-radius: 40px; 
            overflow: hidden; 
            background: #fff;
            box-shadow: 0 20px 50px rgba(0,0,0,0.05);
            margin: 0 auto;
        }
        .welcome-content-split, .about-content-split { 
            flex: 0.8; 
            padding: 60px; 
            display: flex; 
            flex-direction: column; 
            justify-content: center;
        }
        .welcome-headline, .about-headline { 
            font-size: 3.5rem; 
            font-weight: 700; 
            line-height: 1.05; 
            margin-bottom: 24px; 
            color: #1D1D1F; 
            letter-spacing: -0.02em;
        }
        .welcome-description, .about-description { 
            font-size: 1.25rem; 
            color: #424245; 
            margin-bottom: 40px; 
            max-width: 500px; 
            line-height: 1.5; 
        }
        .welcome-image-split, .about-image-split { 
            flex: 1.5; 
            position: relative; 
            overflow: hidden; 
            
        }
        .welcome-image-split img, .about-image-split img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover;
            object-position: center 20%;
        }
        .welcome-actions, .about-actions { display: flex; gap: 15px; }

        /* Bento Grid Services */
        .services-bento-section {
            /* Use default background */
        }

        .bento-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
        }

        .bento-card {
            background-color: #FFFFFF;
            border-radius: 24px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
            text-decoration: none;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            position: relative;
            min-height: 220px;
        }

        .bento-card:hover {
            transform: scale(1.01);
            box-shadow: 0 20px 40px rgba(0,0,0,0.06);
            border-color: rgba(0,0,0,0.08);
        }

        /* Removed individual grid column spans for 5x1 grid */

        .card-top {
            margin-bottom: 24px;
        }

        .card-icon {
            color: var(--color-primary);
            stroke-width: 1.5px;
            opacity: 0.9;
        }

        .eyebrow {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #636e72;
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .card-headline {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1D1D1F;
            line-height: 1.2;
            margin-bottom: 12px;
        }

        .card-body {
            font-size: 0.9rem;
            color: #636e72;
            line-height: 1.4;
        }

        /* Reviews */
        .reviews-slider { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .review-card { padding: 30px; }
        .review-stars { color: #FFD700; margin-bottom: 15px; font-size: 1.2rem; }
        .btn-link { color: var(--color-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }

        /* About */
        .split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .image-placeholder-rect { width: 100%; height: 300px; background: #eee; display: flex; align-items: center; justify-content: center; color: #aaa; border-radius: 12px; }

        /* === DENTAL EDUCATION SECTION === */
        .horizontal-scroll-mask {
            width: 100%;
            overflow-x: auto;
            padding: 20px 0 40px;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE/Edge */
        }
        
        .horizontal-scroll-mask::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
        }
        
        .horizontal-track-simple {
            display: flex;
            gap: 30px;
            width: max-content;
            padding: 0 10px;
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

        /* Responsive */
        @media (max-width: 1024px) {
            .bento-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .bento-card {
                min-height: 200px;
            }
            .card-large, .card-wide, .card-vertical, .card-medium, .card-small {
                grid-column: span 1;
                grid-row: span 1;
                min-height: 350px;
                flex-direction: column;
                max-width: 100%;
            }
            .card-large .card-content, .card-wide .card-content {
                max-width: 100%;
            }
            .side-float { width: 100%; height: 50%; left: 0; }
        }

        @media (max-width: 768px) {
            .hero-container, .split-layout { grid-template-columns: 1fr; text-align: center; gap: 30px; }
            .hero-section { padding-top: 100px; min-height: auto; padding-bottom: 60px; }
            .welcome-container, .about-card-container { flex-direction: column; min-height: auto; width: 100%; }
            .welcome-content-split, .about-content-split { padding: 40px 20px; text-align: center; align-items: center; }
            .welcome-headline, .about-headline { font-size: 2.2rem; }
            .welcome-description, .about-description { margin-left: auto; margin-right: auto; font-size: 1rem; }
            .welcome-image-split, .about-image-split { height: 250px; width: 100%; }
            .hero-title { font-size: 2.2rem; }
            .hero-visual { order: -1; margin-bottom: 20px; }
            .insight-card-large { width: 85vw; }
            .card-headline { font-size: 1.25rem; }
            .bento-grid { grid-template-columns: 1fr; }
            .bento-card { min-height: auto; padding: 20px; }
            .card-top { margin-bottom: 15px; }
            .section-header h2 { font-size: 2rem !important; }
            .text-center .btn-link { justify-content: center; }
        }
      `}</style>
        </div>
    );
};

export default Home;
