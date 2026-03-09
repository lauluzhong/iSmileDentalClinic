import { useBooking } from '../context/BookingContext';
import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Sparkles, Smile, Users, Quote } from 'lucide-react';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';
import { Reveal, FadeIn } from '../components/Reveal';
import { motion } from 'framer-motion';

// Updated Image Paths
const FAMILY_HERO = "/images/family_hero_three_generations.jpg";
const GUM_IMG = "/images/blog/concerned_person_brushing.png";
const SENSITIVITY_IMG = "/images/sensitivity_hero_1765825197668.png";
const ORTHO_IMG = "/images/adult_ortho_hero_1765825218135.png";
const VENEER_IMG = "/images/veneers_hero_1765825257935.png";
const AIRWAY_IMG = "/images/child_airway_hero_1765825276038.png";

const MotionLink = motion(Link);

import blogIndex from '../data/blog-index.json';

const Home = () => {
    const { openBooking } = useBooking();
    const navigate = useNavigate();

    // Get the specific blog posts in the requested order
    const orderedBlogSlugs = [
        'clear-aligners-vs-braces',
        'root-canal-vs-extraction',
        'your-childs-first-dental-visit',
        'mouth-breathing-in-children',
        'government-vs-private-braces'
    ];

    const featuredBlogs = orderedBlogSlugs
        .map(slug => blogIndex.find(post => post.slug === slug))
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
            <Helmet>
                <title>iSmile Dental Clinic Petaling Jaya | Family Dentist in Damansara Jaya</title>
                <meta name="description" content="iSmile Dental Clinic Petaling Jaya - Gentle, patient-centred dental care for children, adults & families. Book your visit today." />
            </Helmet>

            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="liquid-shape" style={{ top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--color-secondary)' }}></div>
                <div className="liquid-shape animate-float" style={{ bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'var(--color-primary)', animationDelay: '1s' }}></div>
                <div className="liquid-shape" style={{ top: '40%', right: '30%', width: '200px', height: '200px', background: 'var(--color-accent)', filter: 'blur(60px)' }}></div>

                <div className="container hero-container">
                    <div className="hero-content">
                        <Reveal><h1 className="hero-title">
                            iSmile Dental Clinic Petaling Jaya <br />
                            <span className="text-gradient">Dental Care for Every Generation</span>
                        </h1></Reveal>
                        <Reveal delay={0.2}><p className="hero-subtitle">
                            iSmile Dental Clinic is a patient-centred dental clinic in Petaling Jaya, caring for children, adults, and families through every stage of life. We focus on clear explanations, thoughtful recommendations, and long-term oral health—so you can feel confident about the care you choose.
                        </p></Reveal>
                        <FadeIn delay={0.4} className="hero-actions">
                            <Button onClick={() => openBooking('', 'hero-cta')}>Schedule a Visit</Button>
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
                        <Reveal width="100%"><h2 className="section-title services-title">Comprehensive Care for <br className="mobile-break" /><span className="text-gradient">Every Stage of Life</span></h2></Reveal>
                    </div>

                    <div className="bento-grid">
                        {/* Card 1: Maintain & Repair */}
                        <MotionLink to="/services/protect" className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="card-top">
                                <Shield size={32} className="card-icon" />
                            </div>
                            <div className="card-content">
                                <span className="eyebrow">PROTECT & REPAIR</span>
                                <h3 className="card-headline">Healthy Teeth <br /> For Life</h3>
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
                                <h3 className="card-headline">Speak and Smile Confidently Again</h3>
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
                                <h3 className="card-headline">Design Your Dream Smile</h3>
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
                    <Reveal width="100%"><h2 className="section-title reviews-title text-center">Trusted by <span className="text-gradient">Families</span></h2></Reveal>
                    <div className="reviews-slider">
                        {[
                            {
                                text: (
                                    <>
                                        <p>
                                            "I have been a patient of iSmile for <strong>over a decade</strong>.
                                            The dental professionals there are <strong>truly professional and caring</strong>.
                                        </p>
                                        <p>
                                            My <strong>fear of being in the dentist chair has been completely removed</strong> by the
                                            <strong>gentle care</strong> I received. I also appreciate their cooperation with my
                                            orthodontist, from the time iSmile was still in Uptown.
                                        </p>
                                        <p>
                                            My family’s dental health is <strong>securely in the hands of iSmile</strong>."
                                        </p>
                                    </>
                                ),
                                author: "Mike Ngui",
                                type: "Patient",
                                avatar: "/images/reviews/mike_ngui.png",
                                rating: 5
                            },
                            {
                                text: (
                                    <>
                                        <p>
                                            "My regular dental clinic of <strong>over a decade</strong>, with <strong>trustworthy dentists</strong>,
                                            assistants and receptionists who work diligently with so much <strong>care and love</strong> for
                                            every single one of their patients.
                                        </p>
                                        <p>
                                            I've referred multiple family members here since I first came, because I know they
                                            will <strong>always be in good hands</strong> here at iSmile. The environment is also
                                            inviting, clean and calming. <strong>Highly recommended.</strong>"
                                        </p>
                                    </>
                                ),
                                author: "Kah Mun Hew",
                                type: "Patient",
                                avatar: "/images/reviews/kah_mun_hew.png",
                                rating: 5
                            },
                            {
                                text: (
                                    <>
                                        <p>
                                            "Have been to my fair share of dentists. Above all, I appreciate iSmile's <strong>professional care</strong>
                                            and <strong>'customer first' attitude</strong>. They would prescribe but also would listen to
                                            concerns and also <strong>see the situation holistically</strong>.
                                        </p>
                                        <p>
                                            It's good they <strong>track records and my dental history</strong> in their system so that
                                            whoever attends to you will have a clear picture. Appreciated <strong>Dr Jean and Dr Mah</strong>
                                            very much for their <strong>gentle and thorough care</strong>."
                                        </p>
                                    </>
                                ),
                                author: "Benny Kong",
                                type: "Patient",
                                avatar: "/images/reviews/benny_kong.png",
                                rating: 5
                            }
                        ].map((review, i) => (
                            <div key={i} className="glass-panel review-card">
                                <div className="quote-icon"><Quote size={40} color="var(--color-tint-blue)" /></div>
                                <div className="review-stars">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
                                </div>
                                <div className="review-text">{review.text}</div>
                                <div className="review-author">
                                    <img src={review.avatar} alt={review.author} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong>{review.author}</strong>
                                        <span className="review-type">{review.type}</span>
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
                            <h2 className="welcome-headline">Built on <br /><span className="text-blue">Competency & <br className="desktop-only" />Compassion</span></h2>
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
                    <div className="section-header flex-between w-full dental-edu-header">
                        <h2 className="section-title dental-edu-title">Dental Education</h2>
                        <Link to="/blog" className="btn-link">Visit Learning Centre <ArrowRight size={16} /></Link>
                    </div>

                    <div className="horizontal-scroll-mask">
                        <div className="horizontal-track-simple">
                            {featuredBlogs.map((post, i) => (
                                <Link to={`/blog/${post.slug}`} key={i} className="glass-panel insight-card-large" style={{ textDecoration: 'none', color: 'inherit' }}>
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
        .mobile-break { display: none; }
        .hero-section { min-height: 90vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 120px; }
        .hero-container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; position: relative; z-index: 2; }
        .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; margin-bottom: 20px; font-weight: 700; word-break: break-word; }
        .hero-subtitle { font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 30px; max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.6; }
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
            font-size: 2.5rem; 
            font-weight: 700; 
            line-height: 1.05; 
            margin-bottom: 24px; 
            color: #1D1D1F; 
            letter-spacing: -0.02em;
        }
        .welcome-description, .about-description { 
            font-size: 1.1rem; 
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
        .section-title { margin-bottom: 60px; margin-top: 0; font-size: 2.5rem; font-weight: 700; line-height: 1.1; }
        .dental-edu-header { margin-bottom: 30px; }


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
        .review-card { 
            padding: 30px; 
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .quote-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            opacity: 0.5;
        }
        .review-text {
            font-size: 0.9rem;
            font-style: italic;
            margin-bottom: 25px;
            color: var(--color-text-main);
            flex: 1;
            line-height: 1.5;
        }

        .review-text p {
            margin-bottom: 12px;
        }

        .review-text p:last-child {
            margin-bottom: 0;
        }
        .review-author {
            display: flex;
            align-items: center;
            gap: 12px;
            border-top: 1px solid rgba(0,0,0,0.05);
            padding-top: 15px;
        }
        .review-type {
            font-size: 0.8rem;
            color: var(--color-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .review-stars { 
            color: #FFD700; 
            margin-bottom: 15px; 
            font-size: 1.2rem;
            display: flex;
            gap: 4px;
        }
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

        @media (max-width: 1024px) {
            .section-padding { padding: 24px 0; }
            .hero-section { padding-top: 90px; text-align: center; min-height: auto; padding-bottom: 40px; }
            .hero-container { grid-template-columns: 1fr; gap: 24px; padding: 0 16px; }
            .hero-content { display: flex; flex-direction: column; align-items: center; order: 2; text-align: center; }
            .hero-title { font-size: 2rem; line-height: 1.1; margin-bottom: 12px; text-align: center; }
            .hero-subtitle { font-size: 0.95rem; margin-bottom: 24px; margin-top: 0; max-width: 300px; margin-left: auto; margin-right: auto; line-height: 1.4; }
            .hero-visual { order: 1; width: 100%; max-width: 260px; margin: 0 auto; }
            .home-page .hero-card { transform: rotate(0); border-radius: 20px; aspect-ratio: 1/1; height: auto; }
            
            .home-page .section-title { font-size: 1.75rem; margin-bottom: 1rem; line-height: 1.1; }
            
            /* Services Carousel */
            .services-bento-section { position: relative; }
            .bento-grid {
                display: flex;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
                -ms-overflow-style: none;
                gap: 12px;
                margin: 0 -16px;
                padding: 0 16px 20px 16px;
                width: calc(100% + 32px);
                mask-image: linear-gradient(to right, black calc(100% - 40px), transparent 100%);
                -webkit-mask-image: linear-gradient(to right, black calc(100% - 40px), transparent 100%);
            }
            .bento-grid::-webkit-scrollbar { display: none; }
            .bento-card {
                flex: 0 0 calc(85% - 16px);
                scroll-snap-align: center;
                min-height: 180px; /* Reduced further */
                aspect-ratio: auto; 
                padding: 20px;
                border-radius: 20px;
            }
            .card-headline { font-size: 1.1rem; line-height: 1.2; margin-bottom: 6px; }
            .card-body { font-size: 0.85rem; line-height: 1.35; opacity: 0.85; }
            .eyebrow { margin-bottom: 6px; font-size: 0.7rem; }
            .card-top { margin-bottom: 16px; }
            .card-icon { width: 28px; height: 28px; }

            .welcome-container, .about-card-container { flex-direction: column; border-radius: 24px; }
            .welcome-content-split, .about-content-split { padding: 32px 20px; text-align: center; align-items: center; }
            .welcome-headline, .about-headline { font-size: 1.75rem; margin-bottom: 16px; }
            .welcome-description, .about-description { font-size: 0.9rem; margin-bottom: 24px; line-height: 1.5; }
            .welcome-image-split, .about-image-split { height: 180px; border-radius: 0 0 24px 24px; }
            
            .reviews-slider { 
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                gap: 16px;
                margin: 0; /* Remove negative margins to respect container padding */
                padding: 20px 8px 40px 8px; /* Add internal padding to make cards thinner */
                scrollbar-width: none;
            }
            .reviews-slider::-webkit-scrollbar { display: none; }
            .review-card { 
                flex: 0 0 100%; /* Cards take full width of the narrowed container */
                scroll-snap-align: center;
                padding: 20px; 
                border-radius: 20px; 
            }
            .review-text { font-size: 0.85rem; margin-bottom: 16px; }
            
            .dental-edu-header { margin-bottom: 16px; align-items: flex-end; }

            .desktop-only { display: none; }
            .mobile-break { display: inline; }
            .horizontal-track-simple { gap: 12px; padding: 0 16px; }
            .insight-card-large { width: 240px; border-radius: 20px; }
            .insight-image-large { height: 140px; }
            .insight-content { padding: 16px; }
            .insight-content h4 { font-size: 0.95rem; line-height: 1.3; margin-bottom: 4px; }
            .read-more-link { font-size: 0.85rem; }
        }
      `}</style>
        </div>
    );
};

export default Home;
