import { useBooking } from '../context/BookingContext';
import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Sparkles, Smile, Users, Quote } from 'lucide-react';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';
import { Reveal } from '../components/Reveal';
import { motion, useReducedMotion } from 'framer-motion';
import reviewStats from '../data/review-stats.json';

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
    const prefersReducedMotion = useReducedMotion();

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
                <title>Family Dentist Damansara Jaya, PJ | iSmile Dental Clinic</title>
                <meta name="description" content="Family dental clinic in Damansara Jaya, Petaling Jaya since 2006. Check-ups, braces, implants & kids' dentistry. Rated 4.8★ from 91 Google reviews. WhatsApp us to book." />
                <link rel="canonical" href="https://ismile.com.my/" />
            </Helmet>

            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="liquid-shape" style={{ top: '12%', left: '6%', width: '340px', height: '340px', background: 'var(--color-secondary)' }}></div>
                <div className="liquid-shape animate-float" style={{ bottom: '6%', right: '2%', width: '420px', height: '420px', background: 'var(--color-primary)', animationDelay: '1s' }}></div>
                <div className="liquid-shape" style={{ top: '44%', right: '32%', width: '220px', height: '220px', background: 'var(--color-accent)', filter: 'blur(70px)' }}></div>

                <div className="container hero-container">
                    {/* Hero content renders statically — above-the-fold copy must never start at opacity 0 */}
                    <div className="hero-content">
                        <span className="hero-eyebrow">
                            <span className="hero-eyebrow-mark"><Heart size={13} /></span>
                            <span className="hero-eyebrow-text">A family practice in Petaling Jaya</span>
                            <span className="hero-eyebrow-year">Est. 2006</span>
                        </span>
                        <h1 className="hero-title">
                            Dental care for <span className="text-gradient">every generation</span>
                        </h1>
                        <p className="hero-subtitle hero-subtitle-desktop">
                            From a child's first visit to a grandparent's new smile, iSmile is the dentist whole families stay with. Honest advice, gentle hands, and care that's looked after Petaling Jaya households for nearly two decades.
                        </p>
                        <p className="hero-subtitle hero-subtitle-mobile">
                            The family dentist Petaling Jaya households have stayed with since 2006.
                        </p>
                        <div className="hero-actions">
                            <Button onClick={() => openBooking('', 'hero-cta')}>Book a Visit <ArrowRight size={18} /></Button>
                            <Link to="/about" className="hero-secondary-link">Meet our team <ArrowRight size={16} /></Link>
                        </div>
                        <div className="hero-trust">
                            <div className="hero-trust-item">
                                <div className="hero-trust-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#E0A500" color="#E0A500" />)}
                                </div>
                                <span><strong>{reviewStats.rating}</strong> on Google · {reviewStats.count} reviews</span>
                            </div>
                            <span className="hero-trust-divider" />
                            <div className="hero-trust-item"><strong>20+</strong> years of trusted care</div>
                        </div>
                    </div>

                    <div className="hero-visual">
                            <div className="hero-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <picture>
                                  <source type="image/avif" srcSet={`/images/family_hero_three_generations-480w.avif 480w, /images/family_hero_three_generations-768w.avif 768w, /images/family_hero_three_generations.avif 947w`} sizes="(max-width: 768px) 100vw, 50vw" />
                                  <source type="image/webp" srcSet={`/images/family_hero_three_generations-480w.webp 480w, /images/family_hero_three_generations-768w.webp 768w, ${FAMILY_HERO_WEBP} 947w`} sizes="(max-width: 768px) 100vw, 50vw" />
                                  <source type="image/jpeg" srcSet={`/images/family_hero_three_generations-480w.jpg 480w, /images/family_hero_three_generations-768w.jpg 768w, ${FAMILY_HERO} 947w`} sizes="(max-width: 768px) 100vw, 50vw" />
                                  <img src={FAMILY_HERO} srcSet={`/images/family_hero_three_generations-480w.jpg 480w, /images/family_hero_three_generations-768w.jpg 768w, ${FAMILY_HERO} 947w`} sizes="(max-width: 768px) 100vw, 50vw" alt="Three generations of a family smiling together at iSmile Dental Clinic" width="947" height="576" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
                                </picture>
                                <div className="hero-floating-badge">
                                    <div className="hero-badge-copy">
                                        <strong>Trusted by families across multiple generations</strong>
                                    </div>
                                </div>
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
                        <Reveal width="100%"><p className="section-lead">A child's first check-up. Braces in the teenage years. A grandparent's new smile. One team that knows your family and grows with it.</p></Reveal>
                    </div>

                    <div className="bento-grid">
                        {/* Card 1: Maintain & Repair */}
                        <MotionLink to="/services/protect" className="bento-card" initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -40px 0px" }} transition={{ duration: 0.35, ease: "easeOut" }}>
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
                        <MotionLink to="/services/straighten" className="bento-card" initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -40px 0px" }} transition={{ duration: 0.35, ease: "easeOut" }}>
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
                        <MotionLink to="/services/replace" className="bento-card" initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -40px 0px" }} transition={{ duration: 0.35, ease: "easeOut" }}>
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
                        <MotionLink to="/services/enhance" className="bento-card" initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -40px 0px" }} transition={{ duration: 0.35, ease: "easeOut" }}>
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
                        <MotionLink to="/services/children" className="bento-card" initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -40px 0px" }} transition={{ duration: 0.35, ease: "easeOut" }}>
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

                    {/* Mobile chip grid (Option A) — replaces the swipe carousel on phones */}
                    <div className="chip-grid">
                        {[
                            { to: '/services/protect', label: 'Check-ups & cleaning', Icon: Shield },
                            { to: '/services/straighten', label: 'Braces & aligners', Icon: Sparkles },
                            { to: '/services/replace', label: 'Implants & dentures', Icon: Smile },
                            { to: '/services/enhance', label: 'Veneers & whitening', Icon: Star },
                            { to: '/services/children', label: 'Children & growing smiles', Icon: Users }
                        ].map(({ to, label, Icon }) => (
                            <Link key={to} to={to} className="service-chip">
                                <span className="service-chip-icon"><Icon size={18} /></span>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Social Proof */}
            <section className="section-padding reviews-section">
                <div className="container">
                    <div className="section-header text-center">
                        <Reveal width="100%"><span className="pill-label"><Star size={13} fill="#E0A500" color="#E0A500" /> {reviewStats.rating} · {reviewStats.count} Google reviews</span></Reveal>
                        <Reveal width="100%"><h2 className="section-title reviews-title text-center">Trusted by <span className="text-gradient">families</span></h2></Reveal>
                    </div>
                    <div className="reviews-slider">
                        {[
                            {
                                // One-line pulls, verbatim from each patient's full Google review (full text on /reviews)
                                text: "My fear of being in the dentist chair has been completely removed by the gentle care I received.",
                                author: "Mike Ngui",
                                type: "Patient",
                                avatar: AVATAR_MIKE_WEBP,
                                rating: 5
                            },
                            {
                                text: "I've referred multiple family members here since I first came, because I know they will always be in good hands here at iSmile.",
                                author: "Kah Mun Hew",
                                type: "Patient",
                                avatar: AVATAR_KAH_MUN_WEBP,
                                rating: 5
                            },
                            {
                                text: "Above all, I appreciate iSmile's professional care and 'customer first' attitude.",
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
                                <div className="review-text"><p>“{review.text}”</p></div>
                                <div className="review-author">
                                    <img src={review.avatar} alt={review.author} loading="lazy" width="40" height="40" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong>{review.author}</strong>
                                        <span className="review-type">{review.type}</span>
                                    </div>
                                    <Link to="/reviews" className="review-more">Full review <ArrowRight size={14} /></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center reviews-more-row">
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

        /* Bespoke hero eyebrow — replaces the generic AI chip.
           A thin keyline + small caps label + year, reading like editorial masthead type. */
        .hero-eyebrow {
            display: inline-flex; align-items: center; gap: 12px;
            margin-bottom: 26px;
            padding: 0; background: none;
        }
        .hero-eyebrow-mark {
            display: inline-flex; align-items: center; justify-content: center;
            width: 26px; height: 26px; border-radius: 50%;
            background: var(--color-primary-deep); color: #fff; flex-shrink: 0;
        }
        .hero-eyebrow-text {
            font-family: var(--font-heading); font-weight: 600;
            font-size: 0.82rem; letter-spacing: 0.04em;
            color: var(--color-text-charcoal);
        }
        .hero-eyebrow-year {
            position: relative; padding-left: 14px;
            font-family: var(--font-heading); font-weight: 600;
            font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--color-primary-deep);
        }
        .hero-eyebrow-year::before {
            content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
            width: 1px; height: 14px; background: rgba(16,42,51,0.18);
        }
        .hero-title { font-size: var(--fs-display); line-height: 1.05; margin-bottom: 22px; font-weight: 700; letter-spacing: -0.03em; }
        .hero-subtitle { font-size: var(--fs-lead); color: var(--color-text-slate); margin-bottom: 32px; max-width: 540px; line-height: 1.6; }
        /* Short mobile subline (Option A) — swapped in below 1024px */
        .hero-subtitle-mobile { display: none; }
        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .hero-secondary-link { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-heading); font-weight: 600; color: var(--color-primary-deep); font-size: 1rem; transition: gap 0.25s ease; }
        .hero-secondary-link:hover { gap: 10px; color: var(--color-primary-teal); }
        .hero-trust { display: flex; align-items: center; gap: 20px; margin-top: 36px; flex-wrap: wrap; color: var(--color-text-slate); font-size: 0.95rem; }
        .hero-trust-item { display: flex; align-items: center; gap: 8px; }
        .hero-trust-item strong { color: var(--color-text-charcoal); }
        .hero-trust-stars { display: inline-flex; gap: 2px; }
        .hero-trust-divider { width: 1px; height: 22px; background: rgba(16,42,51,0.12); }

        .hero-visual { position: relative; max-width: 460px; margin: 0 auto; }

        /* Editorial frame tag — labels the photo as a real patient photo, de-emphasising the "stock" feel */
        .hero-frame-tag {
            position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
            z-index: 4; white-space: nowrap;
            font-family: var(--font-heading); font-weight: 600;
            font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase;
            color: var(--color-primary-deep);
            background: #fff; padding: 6px 14px; border-radius: 50px;
            box-shadow: var(--shadow-sm); border: 1px solid rgba(0,141,176,0.14);
        }

        .hero-card {
            position: relative; border-radius: 24px; overflow: hidden;
            aspect-ratio: 16/11; width: 100%; max-width: 520px; margin: 0 auto;
            box-shadow: var(--shadow-lg);
            transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
            transform: rotate(-1.25deg);
            /* Crisp teal keyline so the frame reads as intentional/editorial, not a raw stock drop-in */
            outline: 6px solid #fff; outline-offset: -6px;
        }
        /* Keep the photo natural and warm — just a soft bottom shade for badge legibility
           and a whisper of grain so it reads as art-directed, not a heavy teal duotone. */
        .hero-card picture, .hero-card img { display: block; width: 100%; height: 100%; }
        .hero-card img { filter: saturate(0.98) contrast(1.02); }
        .hero-card::before {
            content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none;
            background: linear-gradient(180deg, rgba(0,90,118,0) 58%, rgba(0,90,118,0.20) 100%);
        }
        .hero-card::after {
            content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0.16;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
            mix-blend-mode: overlay;
        }
        .hero-card:hover { transform: rotate(0deg) scale(1.012); }

        /* Redesigned "generations" badge — elegant glass card with a divider + small-caps label */
        .hero-floating-badge {
            position: absolute; bottom: 18px; left: 18px; right: 18px; z-index: 5;
            display: flex; align-items: center; gap: 14px;
            background: rgba(255,255,255,0.82);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            padding: 14px 16px; border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0,90,118,0.22);
            border: 1px solid rgba(255,255,255,0.7);
        }
        .hero-badge-icon {
            display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
            width: 40px; height: 40px; border-radius: 12px;
            background: linear-gradient(135deg, var(--color-primary-deep), var(--color-primary-teal));
            color: #fff;
        }
        .hero-badge-copy { display: flex; flex-direction: column; line-height: 1.28; min-width: 0; }
        .hero-badge-copy strong { font-family: var(--font-heading); font-size: 0.92rem; color: var(--color-text-charcoal); }
        .hero-badge-copy span { font-size: 0.74rem; color: var(--color-text-slate); }

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
        .bento-card:hover .card-icon-wrap { background: var(--color-primary-teal); transform: scale(1.05); box-shadow: 0 8px 20px rgba(0,141,176,0.30); }
        /* Keep the icon legible on hover: flip it to white so it stays visible on the teal chip */
        .bento-card:hover .card-icon-wrap .card-icon { color: #fff; opacity: 1; }
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

        /* Mobile services chip grid (Option A) — hidden on desktop/tablet */
        .chip-grid { display: none; grid-template-columns: 1fr 1fr; gap: 10px; }
        .service-chip {
            display: flex; align-items: center; gap: 10px;
            background: #fff; border: 1px solid rgba(16,42,51,0.08);
            border-radius: 16px; padding: 13px 12px;
            font-family: var(--font-heading); font-weight: 600;
            font-size: 0.9rem; line-height: 1.2;
            color: var(--color-text-charcoal);
            box-shadow: var(--shadow-sm);
        }
        .service-chip:last-child { grid-column: 1 / -1; }
        .service-chip-icon {
            flex: none; width: 34px; height: 34px; border-radius: 10px;
            background: var(--color-tint-light); color: var(--color-primary-deep);
            display: flex; align-items: center; justify-content: center;
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
            font-size: 0.82rem;
            color: var(--color-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .review-more {
            margin-left: auto;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-primary-deep);
            white-space: nowrap;
        }
        .review-more:hover { color: var(--color-primary-teal); }
        .review-stars { 
            color: #FFD700; 
            margin-bottom: 15px; 
            font-size: 1.2rem;
            display: flex;
            gap: 4px;
        }
        .btn-link { color: var(--color-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }
        .reviews-more-row { margin-top: 60px; }

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

            /* Compact mobile rhythm: ~32px section padding (≈64px between sections on tablet) */
            .section-padding { padding: 32px 0; }
            .home-page .section-title { font-size: 2rem; margin-bottom: 0.75rem; line-height: 1.1; }

            /* ---- Hero — Option A immersive full-bleed (photo as background) ---- */
            .hero-section { position: relative; padding: 0; min-height: 100vh; min-height: 100svh; display: block; text-align: left; overflow: hidden; }
            .hero-section .liquid-shape { display: none; }
            .hero-container { display: block; padding: 0; max-width: none; }
            .hero-visual { position: absolute; inset: 0; max-width: none; margin: 0; z-index: 1; }
            .home-page .hero-card { position: absolute; inset: 0; height: 100%; max-width: none; aspect-ratio: auto; transform: none; border-radius: 0; outline: none; box-shadow: none; }
            .home-page .hero-card img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; filter: none; }
            /* Option A shade — light at the top, dark at the bottom for text contrast */
            .home-page .hero-card::before { background: linear-gradient(180deg, rgba(15,35,50,0.30) 0%, rgba(15,35,50,0.05) 35%, rgba(13,42,58,0.86) 88%); }
            .home-page .hero-card::after { display: none; }
            .hero-floating-badge { display: none; }
            .hero-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; min-height: 100vh; min-height: 100svh; padding: 110px 22px calc(76px + env(safe-area-inset-bottom)); text-align: left; }
            .hero-eyebrow { display: none; }
            .hero-subtitle-desktop { display: none; }
            .hero-subtitle-mobile { display: block; }
            /* Trust line — restored and moved above the headline, per the mock */
            .hero-trust { display: flex; order: -1; margin: 0 0 12px; gap: 10px; color: rgba(255,255,255,0.95); font-size: 0.85rem; }
            .hero-trust-item strong { color: #fff; }
            .hero-trust-divider { display: none; }
            .hero-trust .hero-trust-item:last-of-type { display: none; }
            .hero-title { font-size: 2.35rem; line-height: 1.12; margin-bottom: 10px; color: #fff; }
            .hero-title .text-gradient { background: none; -webkit-background-clip: initial; background-clip: initial; -webkit-text-fill-color: #fff; color: #fff; }
            .hero-subtitle { font-size: 1rem; color: rgba(255,255,255,0.92); margin: 0 0 18px; max-width: 420px; line-height: 1.55; }
            .hero-actions { gap: 14px; }
            /* One white pill CTA on the photo */
            .hero-actions .btn { background: #fff; color: var(--color-primary-deep); box-shadow: 0 12px 30px rgba(10,35,50,0.35); }
            .hero-secondary-link { display: none; }
            .section-header { margin-bottom: 22px; }
            .section-header .pill-label { margin-bottom: 10px; }
            .section-lead { font-size: 1rem; margin-top: 10px; }

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
            .eyebrow { margin-bottom: 6px; font-size: 0.8125rem; }
            .card-top { margin-bottom: 16px; }
            .card-icon { width: 28px; height: 28px; }

            /* Welcome — stacked but with larger image */
            .welcome-container, .about-card-container { flex-direction: column; border-radius: 28px; }
            .welcome-content-split, .about-content-split { padding: 28px 24px; text-align: center; align-items: center; }
            .welcome-headline, .about-headline { font-size: 2rem; margin-bottom: 12px; }
            .welcome-description, .about-description { font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5; }
            .welcome-image-split, .about-image-split { height: 320px; border-radius: 0 0 28px 28px; }

            /* Reviews — 2 visible on tablet */
            .reviews-slider {
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                gap: 16px;
                margin: 0;
                padding: 8px 8px 12px 8px;
                scrollbar-width: none;
            }
            .reviews-more-row { margin-top: 12px; }
            .reviews-slider::-webkit-scrollbar { display: none; }
            .review-card { 
                flex: 0 0 calc(50% - 12px);
                scroll-snap-align: start;
                padding: 24px; 
                border-radius: 20px; 
            }
            .review-text { font-size: 0.95rem; margin-bottom: 16px; }

            /* Dental Education — header centered for consistency */
            .dental-edu-header { margin-bottom: 12px; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
            .horizontal-scroll-mask { padding: 8px 0 12px; }
            .horizontal-track-simple { gap: 20px; padding: 0 16px; }
            .insight-card-large { width: 320px; border-radius: 20px; }
            .insight-image-large { height: 200px; }
            .insight-content { padding: 20px; }
            .insight-content h3 { font-size: 1rem; line-height: 1.3; margin-bottom: 6px; }
            .read-more-link { font-size: 0.9rem; }
        }

        /* ============================
           RESPONSIVE — PHONE (≤480px)
           ============================ */
        @media (max-width: 480px) {
            /* Phone rhythm: 24px section padding ≈ 48px between sections */
            .section-padding { padding: 24px 0; }
            .home-page .section-title { font-size: 1.6rem; margin-bottom: 0.5rem; line-height: 1.1; }
            .section-header { margin-bottom: 18px; }
            .reviews-more-row { margin-top: 8px; }

            /* Hero — immersive layout already applies at ≤1024px; phone type tweaks only */
            .hero-title { font-size: 2.1rem; line-height: 1.12; margin-bottom: 10px; }
            .hero-subtitle { font-size: 1rem; max-width: 340px; }
            .hero-content { padding-left: 18px; padding-right: 18px; }
            .hero-actions .btn { width: auto; padding: 14px 24px; }

            /* Services — Option A chip grid replaces the swipe carousel */
            .bento-grid { display: none; }
            .chip-grid { display: grid; }

            /* Welcome — taller image for better visual impact */
            .welcome-container, .about-card-container { border-radius: 20px; }
            .welcome-content-split, .about-content-split { padding: 24px 18px; }
            .welcome-headline, .about-headline { font-size: 1.6rem; margin-bottom: 10px; }
            .welcome-description, .about-description { font-size: 0.88rem; margin-bottom: 16px; }
            .welcome-image-split, .about-image-split { height: 260px; border-radius: 0 0 20px 20px; }

            /* Reviews — full-width swipe */
            .review-card { 
                flex: 0 0 calc(100% - 16px);
                scroll-snap-align: center;
                padding: 20px; 
                border-radius: 18px; 
            }
            .review-text { font-size: 0.95rem; margin-bottom: 14px; }

            /* Dental Education */
            .dental-edu-header { flex-direction: column; align-items: center; gap: 6px; text-align: center; }
            .horizontal-track-simple { gap: 12px; padding: 0 16px; }
            .insight-card-large { width: 240px; border-radius: 16px; }
            .insight-image-large { height: 140px; }
            .insight-content { padding: 14px; }
            .insight-content h3 { font-size: 0.95rem; line-height: 1.3; margin-bottom: 4px; }
            .read-more-link { font-size: 0.85rem; }
        }

      `}</style>
        </div>
    );
};

export default Home;
