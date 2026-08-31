import { Helmet } from 'react-helmet-async';
import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Award } from 'lucide-react';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import { Link } from 'react-router-dom';
import dentistProfiles from '../data/dentists';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';

/* Resolve each team card to its profile page in src/data/dentists.js.
   Matched on the photo path, the one field both arrays share verbatim. */
const profileSlugByImg = Object.fromEntries(dentistProfiles.map((d) => [d.img, d.slug]));

const doctors = [
    {
        name: "Dr. Ong Nguk Jean",
        role: "Founder & Dental Surgeon, BDS (Malaya)",
        years: "34 years",
        qualifications: "BDS, University of Malaya",
        bio: "Passionate about caring for people and families, building genuine long-term relationships that last,",
        languages: "English, Chinese, Malay, Foo Chow, Cantonese, Hokkien",
        img: "/images/doctors/dr_Jean Ong.jpg",
        keyCompetency: "General Dentistry, Endodontics / Root Canal Treatment, Occlusion & Smile, Functional Occlusion & Rehabilitation"
    },
    {
        name: "Dr. Amy Chin Mei Kuen",
        role: "Dental Surgeon, BDS (Malaya)",
        years: "24 years",
        qualifications: "BDS, University of Malaya",
        bio: "Passionate about educating patients and helping them achieve good oral health with confidence.",
        languages: "English, Malay, Cantonese",
        img: "/images/doctors/dr_Amy Chin Mei Kuen.jpg",
        keyCompetency: "General Dentistry, Geriatric Dental Care"
    },
    {
        name: "Dr. Ling Yoke Li",
        role: "Dental Surgeon, DDS (USM)",
        years: "20 years",
        qualifications: "DDS, University of Science Malaysia",
        bio: "Warm and thoughtful, with a strong focus on early intervention and long-term airway wellness in children.",
        languages: "English, Chinese, Malay",
        img: "/images/doctors/dr_Ling.jpg",
        keyCompetency: "Extensive Post-Graduate Training, Covering Pediatric Interceptive Orthodontics (incl. Myofunctional Therapy), Functional Orthodontics, Airway-focused Dentistry for Adults & Children"
    },
    {
        name: "Dr. Mah Haw Yeng",
        role: "Dental Surgeon, BDS (Malaya)",
        years: "24 years",
        qualifications: "BDS, University of Malaya",
        bio: "Passionate about families, committed to serving patients wholeheartedly with warmth.",
        languages: "Mandarin, Cantonese, English, Bahasa Malaysia",
        img: "/images/doctors/dr_Mah Haw Yeng.jpg",
        keyCompetency: "General Dentistry, Orthodontics (children & adults), Myofunctional orthodontics"
    },
    {
        name: "Dr. Azelia Lau Yiling",
        role: "Dental Surgeon, BDS (NIZ, RUSSIA)",
        years: "17 years",
        qualifications: "BDS, Nizhny Novgorod State Medical Academy",
        bio: "Passionate about making dental visits a pleasant experience for patients of all ages.",
        languages: "English, Malay",
        img: "/images/doctors/dr_Azelia Lau Yiling.jpg",
        keyCompetency: "General Dentistry, Pediatric Dental Care"
    },
    {
        name: "Dr. Priscilla Chan Mei Shen",
        role: "Dental Surgeon, BDS (Malaya)",
        years: "23 years",
        qualifications: "BDS, University of Malaya",
        bio: "Passionate about helping children and families overcome their fear of dental treatment.",
        languages: "English, Chinese, Bahasa Malaysia, Hokkien, Cantonese",
        img: "/images/doctors/dr_Priscilla.jpg",
        keyCompetency: "General Dentistry, Pediatric Dental Care"
    },
    {
        name: "Dr Lim Zhi Yin Joan",
        role: "Specialist, BDS (Malaya), Cert. Advanced Restorative & Aesthetic Dentistry (UCLA)",
        years: "19 years",
        qualifications: "Cert. Advanced Restorative (UCLA), MFDS (RCS Edinburgh), BDS (UM)",
        specialties: "Esthetic Dentistry, Fixed Prosthodontics, Implantology, Smile Design, Full-mouth Rehabilitation",
        bio: "Passionate about advancing restorative and aesthetic dentistry, delivering the highest quality to patients.",
        languages: "English, Mandarin, Malay",
        img: "/images/doctors/dr_Lim Zhi Yin Joan.jpg"
    },
    {
        name: "Dr Yeoh Oon Take",
        role: "Specialist, BDS (Malaya), D.Clin.Dent Prosthodontics (Melbourne)",
        years: "14 years",
        qualifications: "BDS (Malaya), D.Clin.Dent Prosthodontics (Melbourne)",
        specialties: "Dental Implants, Oral Function, Crown and Bridge",
        bio: "Driven toward continual improvement while delivering functional and long-lasting treatment outcomes.",
        languages: "Malay, Mandarin, English, Cantonese, Hokkien",
        img: "/images/doctors/dr_yeoh.jpg"
    }
];

const About = () => {
    // Meta comes from src/data/corePagesSeo.js, the same source the build
    // uses to prerender this page — so the two cannot drift.
    const seo = CORE_PAGES.find(p => p.path === 'about');
    const { openBooking } = useBooking();

    return (
        <div className="about-page">
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href="https://ismile.com.my/about" />
            </Helmet>
            <div className="about-hero-container">
                <div className="about-hero">
                    <div className="container">
                        <div className="hero-content-left">
                            <Reveal><h1 className="hero-title">Where Competency and Compassion Meet</h1></Reveal>
                            <Reveal delay={0.2}><p className="hero-description">
                                A place where clinical excellence joins genuine heart. We believe in partnering with our patients to ensure they feel safe, heard, and valued at every step of their journey.
                            </p></Reveal>
                        </div>
                    </div>
                </div>

                <section id="journey" className="journey-section">
                    <div className="container">
                        <Reveal><h2 className="section-title">Our Journey So Far</h2></Reveal>
                        {/* The cards render statically — no scroll reveal on them.
                            They used to be per-card FadeIns, but whileInView never fires
                            for a card sitting outside a horizontal scroller, so the third
                            one stayed at opacity 0 forever. Wrapping the whole rail in one
                            FadeIn would fix that while making a single missed trigger hide
                            the entire section, so the content simply doesn't depend on an
                            animation to be visible. The heading above keeps its Reveal. */}
                        <div className="journey-grid">
                            <div className="journey-card">
                                <div className="journey-year">2006</div>
                                <h3>Where We Began</h3>
                                <div className="journey-divider"></div>
                                <p>Founded in 2006 by Dr. Jean in Damansara Uptown, iSmile began with a simple belief: dentistry should feel personal, honest, and compassionate. Our early commitment to family care and trust continues to guide everything we do today.</p>
                            </div>
                            <div className="journey-card">
                                <div className="journey-year">2022</div>
                                <h3>Where We Are Now</h3>
                                <div className="journey-divider"></div>
                                <p>In 2022, we moved to Damansara Jaya into a purpose-built clinic designed to enhance comfort and clinical quality. Today, we welcome families with expanded services, stronger facilities, and a growing patient community.</p>
                            </div>
                            <div className="journey-card">
                                <div className="journey-year">Today</div>
                                <h3>Where We’re Going</h3>
                                <div className="journey-divider"></div>
                                <p>We are evolving into a modern, digitally-driven clinic for families — combining advanced technology, personalised care, and a continued commitment to delivering dentistry with excellence, accuracy, and heart.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section id="founder" className="founder-section-dark">
                <div className="container">
                    <div className="founder-card-dark" style={{ minHeight: 'auto', background: 'transparent' }}>
                        <div className="founder-content">
                            <Reveal><span className="founder-eyebrow">Meet Our Founder</span></Reveal>
                            <Reveal><h2>Dr. Jean Ong</h2></Reveal>
                            <Reveal><h3 className="founder-role">Founder & Dental Surgeon</h3></Reveal>

                            <Reveal delay={0.2}><div className="founder-bio">
                                <h3>A Vision for Better Care</h3>
                                <p>
                                    Dr. Jean Ong founded iSmile with a goal to make every visit feel a little more like home.
                                    As a mother of five, she is passionate about creating a safe, welcoming space where families feel seen, supported, and cared for.
                                </p>
                                <p>
                                    With over 33 years of experience, She combines comprehensive clinical expertise and experience with a gentle touch, aiming to partner with parents in raising children who grow up with healthy, sustainable dental habits.
                                </p>
                                <p>
                                    She firmly believes in practicing evidence-based dentistry and continues to upskill herself regularly with the latest advancements in the dental profession to deliver the highest quality work from herself and her team.
                                </p>
                            </div></Reveal>
                        </div>
                        <div className="founder-image-container">
                            <img src="/images/doctors/dr_Jean Ong.jpg" alt="Dr Jean Ong" className="founder-img" style={{ borderRadius: '20px' }} />
                        </div>
                    </div>
                </div>
            </section>

            <section id="team" className="section-padding team-section">
                <div className="container">
                    <Reveal width="100%"><h2 className="section-title text-center">The Team Behind <span className="text-gradient">Your Smile</span></h2></Reveal>

                    {/* Each dentist also has their own page. Doctor-name searches are the
                        best-converting queries the site gets, and this is the internal link
                        that lets crawlers reach those pages from an established one. */}
                    <Reveal width="100%">
                        <p className="text-center team-profiles-link">
                            Each of our dentists has their own profile —{' '}
                            <Link to="/dentists">read more about the team</Link>.
                        </p>
                    </Reveal>

                    <div className="team-grid">
                        {doctors.map((doc, index) => (
                            <div key={index} className="glass-panel team-card">
                                {/* photo + name/role/years are wrapped together so the
                                    mobile breakpoint can lay them out side by side.
                                    On desktop the wrapper is display:contents, so the
                                    card is the same stacked photo-over-text as before. */}
                                <div className="team-card-head">
                                    <div className="team-photo">
                                        {doc.img && <img
                                            src={doc.img}
                                            alt={doc.name}
                                            loading="lazy"
                                        />}
                                    </div>
                                    <div className="team-header-top">
                                        <h3>{doc.name}</h3>
                                        <div className="team-role">{doc.role}</div>
                                        <div className="team-meta">
                                            <div><Award size={14} /> {doc.years}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="team-info">
                                    <div className="team-body-content">
                                        <p className="team-bio">{doc.bio}</p>

                                        {doc.specialties && (
                                            <div className="team-specialties">
                                                <strong>Specialties:</strong><br />
                                                {doc.specialties}
                                            </div>
                                        )}

                                        {doc.keyCompetency && (
                                            <div className="team-specialties">
                                                <strong>Key Competencies:</strong><br />
                                                {doc.keyCompetency}
                                            </div>
                                        )}
                                    </div>

                                    <div className="team-languages">
                                        <small>Languages Spoken: {doc.languages}</small>
                                    </div>

                                    {profileSlugByImg[doc.img] && (
                                        <Link className="team-profile-link" to={`/dentists/${profileSlugByImg[doc.img]}`}>
                                            View full profile →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Schedule a Visit CTA */}
            <section className="section-padding" style={{ textAlign: 'center', paddingBottom: '80px' }}>
                <div className="container">
                    <FadeIn>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '16px' }}>
                            Ready to Experience Thoughtful Dental Care?
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.6 }}>
                            We'd love to meet you and your family. Schedule a visit to see how we can care for your smile.
                        </p>
                        <Button onClick={() => openBooking('', 'about-page-cta')}>Book a Visit</Button>
                    </FadeIn>
                </div>
            </section>

            <style>{`
                .about-page {
                    background: #fff;
                }

                .about-hero-container {
                    background: linear-gradient(135deg, #F0F7FF 0%, #E0F2FE 55%, #EAF7F0 100%);
                    padding-top: 140px;
                }

                .about-hero {
                    padding: 80px 0 60px;
                }

                .hero-content-left {
                    max-width: 800px;
                    text-align: left;
                }

                .hero-title {
                    font-size: clamp(2.5rem, 5vw, 4.2rem);
                    font-weight: 800;
                    color: var(--color-text-charcoal);
                    line-height: 1.1;
                    margin-bottom: 30px;
                    letter-spacing: -0.02em;
                }

                .hero-description {
                    font-size: 1.25rem;
                    line-height: 1.6;
                    color: #4a5568;
                    max-width: 650px;
                }

                .journey-section {
                    padding-bottom: 120px;
                    scroll-margin-top: 120px;
                }

                .section-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--color-primary);
                    margin-bottom: 60px;
                }

                .journey-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 40px;
                }

                .journey-card {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    padding: 40px;
                    border-radius: 24px;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                }

                .journey-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
                    background: rgba(255, 255, 255, 0.8);
                }

                .journey-year {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--color-secondary);
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .journey-card h3 {
                    font-size: 1.6rem;
                    color: var(--color-text-charcoal);
                    margin-bottom: 15px;
                    font-weight: 700;
                }

                .journey-divider {
                    width: 40px;
                    height: 4px;
                    background: var(--color-secondary);
                    margin-bottom: 25px;
                    border-radius: 2px;
                }

                .journey-card p {
                    line-height: 1.8;
                    color: #4a5568;
                    font-size: 1.05rem;
                }

                /* Founder Section Dark */
                .founder-section-dark {
                    background: linear-gradient(160deg, #0E2731 0%, #123B47 100%);
                    padding: 120px 0;
                    scroll-margin-top: 120px;
                    position: relative;
                    overflow: hidden;
                }
                .founder-section-dark::before {
                    content: '';
                    position: absolute;
                    top: -120px; right: -120px;
                    width: 420px; height: 420px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0,141,176,0.35), transparent 70%);
                    pointer-events: none;
                }

                .founder-card-dark {
                    display: flex;
                    align-items: center;
                    gap: 60px;
                    color: white;
                    position: relative;
                    z-index: 1;
                }

                .founder-content {
                    flex: 1;
                }

                .founder-eyebrow {
                    color: var(--color-secondary);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: block;
                    margin-bottom: 15px;
                }

                .founder-content h2 {
                    font-size: 3.5rem;
                    margin-bottom: 10px;
                    color: white;
                }

                .founder-role {
                    font-size: 1.2rem;
                    color: rgba(255,255,255,0.7);
                    margin-bottom: 40px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .founder-bio h3 {
                    color: var(--color-secondary);
                    font-size: 1.8rem;
                    margin-bottom: 20px;
                }

                .founder-bio p {
                    color: rgba(255,255,255,0.85);
                    line-height: 1.8;
                    font-size: 1.15rem;
                    margin-bottom: 20px;
                }

                .founder-image-container {
                    flex: 1;
                    max-width: 45%;
                }

                .founder-img {
                    width: 100%;
                    border-radius: 30px;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                }

                /* Team Section */
                .team-section {
                    background: #f8fafc;
                    scroll-margin-top: 120px;
                }

                .team-profile-link {
                    display: inline-block;
                    margin-top: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-primary-teal, #4FA3C2);
                    text-decoration: none;
                }
                .team-profile-link:hover { text-decoration: underline; }

                .team-profiles-link {
                    margin: -8px auto 32px;
                    max-width: 560px;
                    color: var(--color-text-grey, #666);
                }
                .team-profiles-link a {
                    color: var(--color-primary-teal, #4FA3C2);
                    text-decoration: underline;
                }

                .team-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 40px;
                }

                .team-card {
                    padding: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    background: #fff;
                    border-radius: 24px;
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
                    border: 1px solid rgba(16,42,51,0.06);
                }

                .team-card:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-lg);
                }

                .team-photo {
                    height: 350px;
                    overflow: hidden;
                    position: relative;
                }

                .team-photo::after {
                    content: '';
                    position: absolute;
                    inset: auto 0 0 0;
                    height: 40%;
                    background: linear-gradient(180deg, transparent, rgba(0,110,140,0.10));
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }
                .team-card:hover .team-photo::after { opacity: 1; }

                .team-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center top;
                    transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
                }
                .team-card:hover .team-photo img { transform: scale(1.04); }

                /* Desktop/tablet: the wrapper dissolves so photo and header sit
                   as direct children of the card, exactly as they used to. */
                .team-card-head {
                    display: contents;
                }

                .team-info {
                    padding: 0 30px 30px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .team-header-top {
                    min-height: 120px;
                    padding: 30px 30px 0;
                }

                .team-info h3 {
                    font-size: 1.5rem;
                    margin-bottom: 8px;
                    color: var(--color-text-charcoal);
                }

                .team-role {
                    color: var(--color-primary);
                    font-weight: 700;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 12px;
                }

                .team-meta {
                    color: #718096;
                    font-size: 0.9rem;
                    margin-bottom: 8px;
                }

                .team-body-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .team-bio {
                    color: #4a5568;
                    line-height: 1.6;
                    font-size: 0.95rem;
                    margin-bottom: 20px;
                }

                .team-specialties {
                    font-size: 0.85rem;
                    background: #f1f5f9;
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    color: #475569;
                    line-height: 1.5;
                }

                .team-languages {
                    margin-top: auto;
                    padding-top: 20px;
                    border-top: 1px solid #edf2f7;
                    color: #64748b;
                    font-weight: 500;
                    min-height: 85px;
                    display: flex;
                    align-items: flex-start;
                }

                @media (max-width: 1024px) {
                    .founder-card-dark {
                        flex-direction: column;
                    }
                    .founder-content {
                        width: 100%;
                    }
                    .founder-image-container {
                        max-width: 100%;
                        order: -1;
                    }
                    .founder-content h2 {
                        font-size: 2.5rem;
                    }
                    .hero-content-left {
                        text-align: left;
                        margin: 0;
                    }
                    .section-title {
                        text-align: center;
                    }
                }

                @media (max-width: 767px) {
                    .founder-card-dark {
                        text-align: center;
                    }
                }

                @media (max-width: 1024px) {
                    .about-hero-container { padding-top: 100px; }
                    .about-hero { padding: 40px 0; }
                    .hero-title {
                        font-size: 2rem;
                        line-height: 1.1;
                        margin-bottom: 20px;
                    }
                    .hero-description {
                        font-size: 1rem;
                        line-height: 1.5;
                    }
                    /* 60px minus the 32px of extra bottom padding the grid now
                       carries for its shadow, so the visual rhythm is unchanged. */
                    .journey-section { padding-bottom: 28px; }
                    /* Journey — horizontal left-to-right swipe carousel on mobile
                       (scroll-snap, ~85%-wide cards with a peek of the next) */
                    .journey-grid {
                        display: flex;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        gap: 14px;
                        margin: 0 -16px;
                        /* overflow-x:auto forces overflow-y to compute to auto, so this
                           box clips vertically. The cards carry a 0 10px 30px shadow
                           (~40px of bleed), so the bottom padding must clear it or the
                           shadow gets sliced into a hard full-width line across the
                           section. Top padding likewise clears the -2px hover lift. */
                        padding: 6px 16px 44px;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }
                    .journey-grid::-webkit-scrollbar { display: none; }
                    .journey-card {
                        flex: 0 0 85%;
                        max-width: 85%;
                        scroll-snap-align: center;
                        padding: 24px;
                        border-radius: 20px;
                    }
                    .journey-year { font-size: 1rem; }
                    .journey-card h3 { font-size: 1.3rem; margin-bottom: 10px; }
                    .journey-card p { font-size: 0.95rem; line-height: 1.6; }

                    /* Founder Mobile */
                    .founder-section-dark { padding: 60px 0; }
                    .founder-content h2 { font-size: 2rem; }
                    .founder-role { font-size: 0.9rem; margin-bottom: 24px; }
                    .founder-bio h3 { font-size: 1.3rem; }
                    .founder-bio p { font-size: 1rem; }
                    .founder-img { border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

                    /* Team Tablet/Mobile */
                    .team-grid {
                         gap: 24px;
                    }
                    .team-card { border-radius: 20px; }
                    
                    .team-info { padding: 0 20px 20px; }
                    .team-header-top { padding: 20px 20px 0; }
                    .team-info h3 { font-size: 1.3rem; }
                    .team-role { font-size: 0.75rem; }
                    .team-bio { font-size: 0.9rem; }
                    .team-specialties { padding: 12px; font-size: 0.8rem; }
                }

                @media (max-width: 767px) {
                    .team-grid {
                        grid-template-columns: 1fr;
                    }

                    /* Phones: the portraits are 2:3 originals, so the old
                       full-width 280px-tall box cropped them to a letterbox —
                       chins and shoulders were sliced off. Here the photo
                       becomes a portrait-shaped thumbnail beside the name, which
                       keeps the whole face and makes eight doctors scannable
                       instead of eight screens of scrolling. */
                    .team-card-head {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        padding: 16px 16px 4px;
                    }
                    .team-photo {
                        flex: 0 0 116px;
                        width: 116px;
                        height: auto;
                        aspect-ratio: 3 / 4;
                        border-radius: 16px;
                    }
                    .team-photo img {
                        object-position: center 12%;
                    }
                    .team-header-top {
                        min-height: 0;
                        padding: 0;
                    }
                    /* tighter tracking so long titles like "Founder & Dental
                       Surgeon, BDS (Malaya)" don't run to three lines */
                    .team-role { margin-bottom: 8px; letter-spacing: 0.6px; }
                    .team-meta { margin-bottom: 0; }
                    .team-info { padding: 16px; }
                    /* the min-height only existed to align cards across grid
                       columns; at one column it is just a gap */
                    .team-languages { min-height: 0; padding-top: 16px; }
                    .team-bio { margin-bottom: 16px; }
                    .team-specialties { margin-bottom: 16px; }
                }
            `}</style>
        </div>
    );
};

export default About;
