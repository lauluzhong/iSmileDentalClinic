import { Helmet } from 'react-helmet-async';
import { useBooking } from '../context/BookingContext';
import React from 'react';
import { Award } from 'lucide-react';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';

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
    const { openBooking } = useBooking();

    return (
        <div className="about-page">
            <Helmet>
                <title>About iSmile Dental Clinic Petaling Jaya | Your Family Dentist</title>
                <meta name="description" content="Meet the experienced dental team at iSmile Clinic in Damansara Jaya. 7 specialists in general, restorative & cosmetic dentistry serving Petaling Jaya families." />
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
                        <div className="journey-grid">
                            <FadeIn className="journey-card">
                                <div className="journey-year">2006</div>
                                <h3>Where We Began</h3>
                                <div className="journey-divider"></div>
                                <p>Founded in 2006 by Dr. Jean in Damansara Uptown, iSmile began with a simple belief: dentistry should feel personal, honest, and compassionate. Our early commitment to family care and trust continues to guide everything we do today.</p>
                            </FadeIn>
                            <FadeIn className="journey-card">
                                <div className="journey-year">2022</div>
                                <h3>Where We Are Now</h3>
                                <div className="journey-divider"></div>
                                <p>In 2022, we moved to Damansara Jaya into a purpose-built clinic designed to enhance comfort and clinical quality. Today, we welcome families with expanded services, stronger facilities, and a growing patient community.</p>
                            </FadeIn>
                            <FadeIn className="journey-card">
                                <div className="journey-year">Today</div>
                                <h3>Where We’re Going</h3>
                                <div className="journey-divider"></div>
                                <p>We are evolving into a modern, digitally-driven clinic for families — combining advanced technology, personalised care, and a continued commitment to delivering dentistry with excellence, accuracy, and heart.</p>
                            </FadeIn>
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

                    <div className="team-grid">
                        {doctors.map((doc, index) => (
                            <div key={index} className="glass-panel team-card">
                                <div className="team-photo">
                                    {doc.img && <img
                                        src={doc.img}
                                        alt={doc.name}
                                        loading="lazy"
                                    />}
                                </div>
                                <div className="team-info">
                                    <div className="team-header-top">
                                        <h3>{doc.name}</h3>
                                        <div className="team-role">{doc.role}</div>
                                        <div className="team-meta">
                                            <div><Award size={14} /> {doc.years}</div>
                                        </div>
                                    </div>

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
                        <Button onClick={() => openBooking('', 'about-page-cta')}>Schedule a Visit</Button>
                    </FadeIn>
                </div>
            </section>

            <style>{`
                .about-page {
                    background: #fff;
                }

                .about-hero-container {
                    background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%);
                    padding-top: 120px;
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
                    background: #1a202c;
                    padding: 120px 0;
                    scroll-margin-top: 120px;
                }

                .founder-card-dark {
                    display: flex;
                    align-items: center;
                    gap: 60px;
                    color: white;
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
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .team-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }

                .team-photo {
                    height: 350px;
                    overflow: hidden;
                }

                .team-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center top;
                }

                .team-info {
                    padding: 30px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .team-header-top {
                    min-height: 120px;
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
                    .journey-section { padding-bottom: 60px; }
                    .journey-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .journey-card { padding: 24px; border-radius: 20px; }
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
                    
                    .team-info { padding: 20px; }
                    .team-info h3 { font-size: 1.3rem; }
                    .team-role { font-size: 0.75rem; }
                    .team-bio { font-size: 0.9rem; }
                    .team-specialties { padding: 12px; font-size: 0.8rem; }
                }

                @media (max-width: 767px) {
                    .team-grid {
                        grid-template-columns: 1fr;
                    }
                    .team-photo {
                         height: 280px;
                    }
                }
            `}</style>
        </div>
    );
};

export default About;
