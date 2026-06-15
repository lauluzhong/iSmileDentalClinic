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
const FAMILY_HERO_WEBP = "/images/family_hero_three_generations.webp";
const GUM_IMG = "/images/blog/concerned_person_brushing.png";
const GUM_IMG_WEBP = "/images/blog/concerned_person_brushing.webp";
const SENSITIVITY_IMG = "/images/sensitivity_hero_1765825197668.png";
const SENSITIVITY_IMG_WEBP = "/images/sensitivity_hero_1765825197668.webp";
const ORTHO_IMG = "/images/adult_ortho_hero_1765825218135.png";
const ORTHO_IMG_WEBP = "/images/adult_ortho_hero_1765825218135.webp";
const VENEER_IMG = "/images/veneers_hero_1765825257935.png";
const VENEER_IMG_WEBP = "/images/veneers_hero_1765825257935.webp";
const AIRWAY_IMG = "/images/child_airway_hero_1765825276038.png";
const AIRWAY_IMG_WEBP = "/images/child_airway_hero_1765825276038.webp";

// Review avatar WebP variants
const AVATAR_MIKE_WEBP = "/images/reviews/mike_ngui.webp";
const AVATAR_MIKE = "/images/reviews/mike_ngui.png";
const AVATAR_KAH_MUN_WEBP = "/images/reviews/kah_mun_hew.webp";
const AVATAR_KAH_MUN = "/images/reviews/kah_mun_hew.png";
const AVATAR_BENNY_WEBP = "/images/reviews/benny_kong.webp";
const AVATAR_BENNY = "/images/reviews/benny_kong.png";

// Team image
const TEAM_IMG = "/images/team_group.jpg";
const TEAM_IMG_WEBP = "/images/team_group.webp";

const MotionLink = motion(Link);

import blogIndex from '../data/blog-index.json';

const Home = () => {
    const { openBooking } = useBooking();
    const navigate = useNavigate();

    // Get the specific blog posts in the requested order
    // Updated 2026-03-28: Feature newest posts covering priority topics
    const orderedBlogSlugs = [
        'child-candidate-myofunctional-orthodontics',      // P2: Myofunctional Orthodontics
        'mouth-breathing-thumb-sucking-crowded-teeth',     // P2: Myofunctional + Kids
        'signs-child-early-orthodontic-assessment',        // P2: Orthodontics
        'lm-activator-vs-invisalign',                      // P2: Myofunctional vs Clear Aligners
        'dental-implants-malaysia-explained'               // P3: Implants
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
                <meta name="description" content="iSmile Dental Clinic in Damansara Jaya, Petaling Jaya — gentle, patient-centred dental care for children, adults & families. Book your visit today." />
                <link rel="canonical" href="https://ismile.com.my/" />
            </Helmet>

            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="liquid-shape" style={{ top: '12%', left: '6%', width: '340px', height: '340px', background: 'var(--color-secondary)' }}></div>
                <div className="liquid-shape animate-float" style={{ bottom: '6%', right: '2%', width: '420px', height: '420px', background: 'var(--color-primary)', animationDelay: '1s' }}></div>
                <div className="liquid-shape" style={{ top: '44%', right: '32%', width: '220px', height: '220px', background: 'var(--color-accent)', filter: 'blur(70px)' }}></div>

                <div className="container hero-container">
                    <div className="hero-content">
                        <Reveal><span className="pill-label hero-pill"><Heart size={14} /> Caring for families since 2006</span></Reveal>
                        <Reveal delay={0.1}><h1 className="hero-title">
                            Dental care for <span className="text-gradient">every generation</span>
                        </h1></Reveal>
                        <Reveal delay={0.2}><p className="hero-subtitle">
                            iSmile is a patient-centred dental clinic in Petaling Jaya, caring for children, adults, and grandparents through every stage of life. Clear explanations, thoughtful recommendations, and long-term oral health—so you can feel confident about the care you choose.
                        </p></Reveal>
                        <FadeIn delay={0.4} className="hero-actions">
                            <Button onClick={() => openBooking('', 'hero-cta')}>Schedule a Visit <ArrowRight size={18} /></Button>
                            <Link to="/about" className="hero-secondary-link">Meet our team <ArrowRight size={16} /></Link>
                        </FadeIn>
                        <FadeIn delay={0.5} className="hero-trust">
                            <div className="hero-trust-item">
                                <div className="hero-trust-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#E0A500" color="#E0A500" />)}
                                </div>
                                <span><strong>4.9</strong> on Google · 76 reviews</span>
                            </div>
                            <span className="hero-trust-divider" />
                            <div className="hero-trust-item"><strong>20+</strong> years of trusted care</div>
                        </FadeIn>
                    </div>

                    <div className="hero-visual">
                            <div className="hero-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <picture>
                                  <source type="image/avif" srcSet={`/images/family_hero_three_generations-480w.avif 480w, /images/family_hero_three_generations-768w.avif 768w, /images/family_hero_three_generations.avif 947w`} sizes="(max-width: 768px) 100vw, 50vw" />
                                  <source type="image/webp" srcSet={`/images/family_hero_three_generations-480w.webp 480w, /images/family_hero_three_generations-768w.webp 768w, ${FAMILY_HERO_WEBP} 947w`} sizes="(max-width: 768px) 100vw, 50vw" />
                                  <source type="image/jpeg" srcSet={`/images/family_hero_three_generations-480w.jpg 480w, /images/family_hero_three_generations-768w.jpg 768w, ${FAMILY_HERO} 947w`} sizes="(max-width: 768px) 100vw, 50vw" />
                                  <img src={FAMILY_HERO} srcSet={`/images/family_hero_three_generations-480w.jpg 480w, /images/family_hero_three_generations-768w.jpg 768w, ${FAMILY_HERO} 947w`} sizes="(max-width: 768px) 100vw, 50vw" alt="Three generations of a family smiling together at iSmile Dental Clinic" width="947" height="1024" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                                </picture>
                                <motion.div className="hero-floating-badge" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
                                    <Users size={20} />
                                    <div>
                                        <strong>3–4 generations</strong>
                                        <span>under one roof</span>
                                    </div>
                                </motion.div>
                            </div>
                    </div>
                </div>
            </section>

            {/* 2. Service Bento Grid */}
            <section className="section-padding services-bento-section">
                <div className="container">
                    <div className="section-header text-center">
                        <Reveal width="100%"><span className="pill-label">Our Services</span></Reveal>
                        <Reveal width="100%"><h2 className="section-title services-title">Comprehensive care for <br className="mobile-break" /><span className="text-gradient">every stage of life</span></h2></Reveal>
                        <Reveal width="100%"><p className="section-lead">From a child's first check-up to restoring a grandparent's smile—one trusted team for the whole family.</p></Reveal>
                    </div>

                    <div className="bento-grid">
                        {/* Card 1: Maintain & Repair */}
                        <MotionLink to="/services/protect" className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="card-top">
                                <span className="card-icon-wrap"><Shield size={26} className="card-icon" /></span>
                                <ArrowRight size={20} className="card-arrow" />
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
                                <span className="card-icon-wrap"><Sparkles size={26} className="card-icon" /></span>
                                <ArrowRight size={20} className="card-arrow" />
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
                                <span className="card-icon-wrap"><Smile size={26} className="card-icon" /></span>
                                <ArrowRight size={20} className="card-arrow" />
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
                                <span className="card-icon-wrap"><Star size={26} className="card-icon" /></span>
                                <ArrowRight size={20} className="card-arrow" />
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
                                <span className="card-icon-wrap"><Users size={26} className="card-icon" /></span>
                                <ArrowRight size={20} className="card-arrow" />
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
                    <div className="section-header text-center">
                        <Reveal width="100%"><span className="pill-label"><Star size={13} fill="#E0A500" color="#E0A500" /> 4.9 · 76 Google reviews</span></Reveal>
                        <Reveal width="100%"><h2 className="section-title reviews-title text-center">Trusted by <span className="text-gradient">families</span></h2></Reveal>
                    </div>
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
                                avatar: AVATAR_MIKE_WEBP,
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
                                avatar: AVATAR_KAH_MUN_WEBP,
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
                                avatar: AVATAR_BENNY_WEBP,
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
                                    <img src={review.avatar} alt={review.author} loading="lazy" width="40" height="40" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
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
                            <picture>
                              <source type="image/webp" srcSet={`/images/team_group-480w.webp 480w, /images/team_group-768w.webp 768w, ${TEAM_IMG_WEBP} 1024w`} sizes="(max-width: 768px) 100vw, 50vw" />
                              <source type="image/jpeg" srcSet={`/images/team_group-480w.jpg 480w, /images/team_group-768w.jpg 768w, ${TEAM_IMG} 1024w`} sizes="(max-width: 768px) 100vw, 50vw" />
                              <img src={TEAM_IMG} srcSet={`/images/team_group-480w.jpg 480w, /images/team_group-768w.jpg 768w, ${TEAM_IMG} 1024w`} sizes="(max-width: 768px) 100vw, 50vw" alt="iSmile Dental Clinic team" width="1024" height="682" loading="lazy" decoding="async" />
                            </picture>
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
                                        <img src={post.img} alt={post.title} loading="lazy" />
                                    </div>
                                    <div className="insight-content">
                                        <h3>{post.title}</h3>
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
        .hero-section { min-height: 92vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 140px; padding-bottom: 60px; }
        .hero-container { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; position: relative; z-index: 2; }
        .hero-content { text-align: left; }
        .hero-pill { margin-bottom: 22px; }
        .hero-title { font-size: var(--fs-display); line-height: 1.05; margin-bottom: 22px; font-weight: 700; letter-spacing: -0.03em; }
        .hero-subtitle { font-size: var(--fs-lead); color: var(--color-text-slate); margin-bottom: 32px; max-width: 540px; line-height: 1.6; }
        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .hero-secondary-link { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-heading); font-weight: 600; color: var(--color-primary-deep); font-size: 1rem; transition: gap 0.25s ease; }
        .hero-secondary-link:hover { gap: 10px; color: var(--color-primary-teal); }
        .hero-trust { display: flex; align-items: center; gap: 20px; margin-top: 36px; flex-wrap: wrap; color: var(--color-text-slate); font-size: 0.95rem; }
        .hero-trust-item { display: flex; align-items: center; gap: 8px; }
        .hero-trust-item strong { color: var(--color-text-charcoal); }
        .hero-trust-stars { display: inline-flex; gap: 2px; }
        .hero-trust-divider { width: 1px; height: 22px; background: rgba(16,42,51,0.12); }

        .hero-visual { position: relative; }
        .hero-card { position: relative; border-radius: 28px; overflow: hidden; aspect-ratio: 4/5; width: 100%; max-width: 440px; margin: 0 auto; box-shadow: var(--shadow-lg); transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); transform: rotate(-1.5deg); }
        .hero-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(0,110,140,0.20) 100%); pointer-events: none; }
        .hero-card:hover { transform: rotate(0deg) scale(1.015); }
        .hero-floating-badge { position: absolute; bottom: 22px; left: 22px; z-index: 3; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); padding: 12px 18px; border-radius: 16px; box-shadow: var(--shadow-md); color: var(--color-primary-deep); }
        .hero-floating-badge > div { display: flex; flex-direction: column; line-height: 1.2; }
        .hero-floating-badge strong { font-family: var(--font-heading); font-size: 0.95rem; color: var(--color-text-charcoal); }
        .hero-floating-badge span { font-size: 0.78rem; color: var(--color-text-grey); }

        .section-header { margin-bottom: 56px; }
        .section-header .pill-label { margin-bottom: 18px; }
        .section-lead { font-size: var(--fs-lead); color: var(--color-text-slate); max-width: 620px; margin: 18px auto 0; line-height: 1.6; }
        
        /* Welcome Section & About Preview Section Redesign */
        .welcome-section, .about-preview { /* Use default background */ }
        .welcome-container, .about-card-container {
            display: flex;
            align-items: stretch;
            min-height: 480px;
            border-radius: 32px;
            overflow: hidden;
            background: #fff;
            box-shadow: var(--shadow-lg);
            border: 1px solid rgba(16,42,51,0.05);
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
            font-size: var(--fs-h2);
            font-weight: 700;
            line-height: 1.05;
            margin-bottom: 24px;
            color: var(--color-text-charcoal);
            letter-spacing: -0.025em;
        }
        .welcome-description, .about-description {
            font-size: var(--fs-lead);
            color: var(--color-text-slate);
            margin-bottom: 40px;
            max-width: 500px;
            line-height: 1.65;
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
        .section-title { margin-bottom: 0; margin-top: 0; font-size: var(--fs-h2); font-weight: 700; line-height: 1.08; letter-spacing: -0.025em; }
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
            padding: 28px 24px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
            text-decoration: none;
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.5s ease;
            border: 1px solid rgba(16,42,51,0.06);
            box-shadow: var(--shadow-sm);
            position: relative;
            min-height: 240px;
        }

        .bento-card::before {
            content: '';
            position: absolute;
            inset: 0 0 auto 0;
            height: 4px;
            background: linear-gradient(90deg, var(--color-primary-deep), var(--color-sky-blue));
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .bento-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-lg);
            border-color: rgba(0,141,176,0.18);
        }
        .bento-card:hover::before { opacity: 1; }
        .bento-card:hover .card-icon-wrap { background: var(--color-primary-teal); color: #fff; transform: scale(1.05); }
        .bento-card:hover .card-arrow { opacity: 1; transform: translateX(0); }

        .card-top {
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .card-icon-wrap {
            width: 52px; height: 52px;
            display: inline-flex; align-items: center; justify-content: center;
            border-radius: 14px;
            background: var(--color-tint-light);
            color: var(--color-primary-deep);
            transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }

        .card-arrow { color: var(--color-primary-teal); opacity: 0; transform: translateX(-6px); transition: all 0.4s ease; }

        .card-icon {
            color: var(--color-primary);
            stroke-width: 1.6px;
            opacity: 0.9;
        }

        .eyebrow {
            display: block;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: var(--color-primary-deep);
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .card-headline {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--color-text-charcoal);
            line-height: 1.18;
            margin-bottom: 12px;
            letter-spacing: -0.01em;
        }

        .card-body {
            font-size: 0.92rem;
            color: var(--color-text-slate);
            line-height: 1.5;
        }

        /* Reviews */
        .reviews-slider { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; }
        .review-card {
            padding: 34px 30px;
            display: flex;
            flex-direction: column;
            position: relative;
            background: #fff;
            border: 1px solid rgba(16,42,51,0.06);
            border-radius: 24px;
            box-shadow: var(--shadow-sm);
            transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
        }
        .review-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
        .quote-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            opacity: 0.5;
        }
        .review-text {
            font-size: 0.95rem;
            margin-bottom: 25px;
            color: var(--color-text-slate);
            flex: 1;
            line-height: 1.65;
        }
        .review-text strong { color: var(--color-text-charcoal); font-weight: 600; }

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
        
        .insight-card-large { box-shadow: var(--shadow-sm); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease; }
        .insight-card-large:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
        .insight-card-large .insight-image-large img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .insight-card-large:hover .insight-image-large img { transform: scale(1.05); }

        .insight-content h3 {
            margin-bottom: 12px;
            font-size: 1.15rem;
            line-height: 1.3;
        }

        .read-more-link {
            font-size: 0.95rem;
            color: var(--color-primary-deep);
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .read-more-link::after { content: '→'; transition: transform 0.25s ease; }
        .insight-card-large:hover .read-more-link::after { transform: translateX(4px); }

        /* ============================
           RESPONSIVE — TABLET (481–1024px)
           ============================ */
        @media (max-width: 1024px) {
            .desktop-only { display: none; }
            .mobile-break { display: inline; }

            .section-padding { padding: 48px 0; }
            .home-page .section-title { font-size: 2rem; margin-bottom: 1.5rem; line-height: 1.1; }

            /* Hero — stacked but with more breathing room */
            .hero-section { padding-top: 100px; text-align: center; min-height: auto; padding-bottom: 48px; }
            .hero-container { grid-template-columns: 1fr; gap: 32px; padding: 0 24px; }
            .hero-content { display: flex; flex-direction: column; align-items: center; order: 2; text-align: center; }
            .hero-title { font-size: 2.4rem; line-height: 1.08; margin-bottom: 16px; text-align: center; }
            .hero-subtitle { font-size: 1rem; margin-bottom: 28px; margin-top: 0; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.55; }
            .hero-actions { justify-content: center; }
            .hero-trust { justify-content: center; margin-top: 28px; }
            .hero-visual { order: 1; width: 100%; max-width: 300px; margin: 0 auto; }
            .home-page .hero-card { transform: rotate(0); border-radius: 22px; aspect-ratio: 4/5; height: auto; }
            .section-header { margin-bottom: 36px; }
            .section-lead { font-size: 1rem; margin-top: 14px; }

            /* Services — 2-col grid on tablet, not horizontal scroll */
            .bento-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }
            .bento-card {
                min-height: 180px;
                padding: 20px;
                border-radius: 20px;
            }
            .bento-card:last-child {
                grid-column: 1 / -1;
                max-width: 50%;
                margin: 0 auto;
            }
            .card-headline { font-size: 1.1rem; line-height: 1.2; margin-bottom: 8px; }
            .card-body { font-size: 0.85rem; line-height: 1.4; opacity: 0.85; }
            .eyebrow { margin-bottom: 6px; font-size: 0.7rem; }
            .card-top { margin-bottom: 16px; }
            .card-icon { width: 28px; height: 28px; }

            /* Welcome — stacked but with larger image */
            .welcome-container, .about-card-container { flex-direction: column; border-radius: 28px; }
            .welcome-content-split, .about-content-split { padding: 40px 32px; text-align: center; align-items: center; }
            .welcome-headline, .about-headline { font-size: 2rem; margin-bottom: 16px; }
            .welcome-description, .about-description { font-size: 0.95rem; margin-bottom: 28px; line-height: 1.5; }
            .welcome-image-split, .about-image-split { height: 320px; border-radius: 0 0 28px 28px; }

            /* Reviews — 2 visible on tablet */
            .reviews-slider { 
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                gap: 16px;
                margin: 0;
                padding: 20px 8px 40px 8px;
                scrollbar-width: none;
            }
            .reviews-slider::-webkit-scrollbar { display: none; }
            .review-card { 
                flex: 0 0 calc(50% - 12px);
                scroll-snap-align: start;
                padding: 24px; 
                border-radius: 20px; 
            }
            .review-text { font-size: 0.85rem; margin-bottom: 16px; }

            /* Dental Education — header centered for consistency */
            .dental-edu-header { margin-bottom: 16px; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
            .horizontal-track-simple { gap: 20px; padding: 0 16px; }
            .insight-card-large { width: 320px; border-radius: 20px; }
            .insight-image-large { height: 200px; }
            .insight-content { padding: 20px; }
            .insight-content h4 { font-size: 1rem; line-height: 1.3; margin-bottom: 6px; }
            .read-more-link { font-size: 0.9rem; }
        }

        /* ============================
           RESPONSIVE — PHONE (≤480px)
           ============================ */
        @media (max-width: 480px) {
            .section-padding { padding: 40px 0; }
            .home-page .section-title { font-size: 1.6rem; margin-bottom: 1.25rem; line-height: 1.1; }

            /* Hero — compact to keep CTA near fold */
            .hero-section { padding-top: 88px; padding-bottom: 32px; }
            .hero-container { gap: 24px; padding: 0 16px; }
            .hero-pill { margin-bottom: 14px; }
            .hero-title { font-size: 2rem; line-height: 1.08; margin-bottom: 12px; }
            .hero-subtitle { font-size: 0.95rem; margin-bottom: 22px; max-width: 360px; line-height: 1.5; }
            .hero-actions { flex-direction: column; gap: 14px; width: 100%; max-width: 280px; }
            .hero-actions .btn { width: 100%; }
            .hero-trust { flex-direction: column; gap: 10px; }
            .hero-trust-divider { display: none; }
            .hero-visual { max-width: 250px; }
            .home-page .hero-card { aspect-ratio: 4/5; border-radius: 18px; }
            .hero-floating-badge { bottom: 14px; left: 14px; padding: 9px 13px; gap: 9px; }
            .hero-floating-badge strong { font-size: 0.82rem; }

            /* Services — horizontal scroll carousel */
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
                mask-image: linear-gradient(to right, black calc(100% - 30px), transparent 100%);
                -webkit-mask-image: linear-gradient(to right, black calc(100% - 30px), transparent 100%);
            }
            .bento-grid::-webkit-scrollbar { display: none; }
            .bento-card {
                flex: 0 0 75%;
                scroll-snap-align: center;
                min-height: 170px;
                aspect-ratio: auto; 
                padding: 20px;
                border-radius: 18px;
            }
            .bento-card:last-child {
                grid-column: unset;
                max-width: unset;
                margin: unset;
            }
            .card-headline { font-size: 1.05rem; line-height: 1.2; margin-bottom: 6px; }
            .card-body { font-size: 0.8rem; line-height: 1.35; opacity: 0.85; }
            .eyebrow { margin-bottom: 4px; font-size: 0.65rem; }
            .card-top { margin-bottom: 14px; }
            .card-icon { width: 26px; height: 26px; }

            /* Welcome — taller image for better visual impact */
            .welcome-container, .about-card-container { border-radius: 20px; }
            .welcome-content-split, .about-content-split { padding: 28px 20px; }
            .welcome-headline, .about-headline { font-size: 1.6rem; margin-bottom: 12px; }
            .welcome-description, .about-description { font-size: 0.88rem; margin-bottom: 20px; }
            .welcome-image-split, .about-image-split { height: 260px; border-radius: 0 0 20px 20px; }

            /* Reviews — full-width swipe */
            .review-card { 
                flex: 0 0 calc(100% - 16px);
                scroll-snap-align: center;
                padding: 20px; 
                border-radius: 18px; 
            }
            .review-text { font-size: 0.82rem; margin-bottom: 14px; }

            /* Dental Education */
            .dental-edu-header { flex-direction: column; align-items: center; gap: 6px; text-align: center; }
            .horizontal-track-simple { gap: 12px; padding: 0 16px; }
            .insight-card-large { width: 240px; border-radius: 16px; }
            .insight-image-large { height: 140px; }
            .insight-content { padding: 14px; }
            .insight-content h4 { font-size: 0.9rem; line-height: 1.3; margin-bottom: 4px; }
            .read-more-link { font-size: 0.82rem; }
        }

      `}</style>
        </div>
    );
};

export default Home;
