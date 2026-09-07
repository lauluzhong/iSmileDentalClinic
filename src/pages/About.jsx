import { Helmet } from 'react-helmet-async';
import { useBooking } from '../context/BookingContext';
import React from 'react';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import { Link } from 'react-router-dom';
import Style from '../components/Style';
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
                            <Reveal><h1 className="hero-title">Where <em>Competency and Compassion</em> Meet</h1></Reveal>
                            <Reveal delay={0.2}><p className="hero-description">
                                A place where clinical excellence joins genuine heart. We believe in partnering with our patients to ensure they feel safe, heard, and valued at every step of their journey.
                            </p></Reveal>
                        </div>
                    </div>
                </div>

                <section id="journey" className="journey-section">
                    <div className="container">
                        <Reveal><h2 className="system-title">Our <em>Journey</em> So Far</h2></Reveal>
                        {/* The cards render statically — no scroll reveal on them.
                            They used to be per-card FadeIns, but whileInView never fires
                            for a card sitting outside a horizontal scroller, so the third
                            one stayed at opacity 0 forever. Wrapping the whole rail in one
                            FadeIn would fix that while making a single missed trigger hide
                            the entire section, so the content simply doesn't depend on an
                            animation to be visible. The heading above keeps its Reveal. */}
                        <div className="journey-grid">
                            <div className="journey-card">
                                <div className="stage-num">2006</div>
                                <div className="journey-copy"><h3>Where We Began</h3>
                                <p>Founded in 2006 by Dr. Jean in Damansara Uptown, iSmile began with a simple belief: dentistry should feel personal, honest, and compassionate. Our early commitment to family care and trust continues to guide everything we do today.</p>
                                </div>
                            </div>
                            <div className="journey-card">
                                <div className="stage-num">2022</div>
                                <div className="journey-copy"><h3>Where We Are Now</h3>
                                <p>In 2022, we moved to Damansara Jaya into a purpose-built clinic designed to enhance comfort and clinical quality. Today, we welcome families with expanded services, stronger facilities, and a growing patient community.</p>
                                </div>
                            </div>
                            <div className="journey-card">
                                <div className="stage-num">Today</div>
                                <div className="journey-copy"><h3>Where We’re Going</h3>
                                <p>We are evolving into a modern, digitally-driven clinic for families — combining advanced technology, personalised care, and a continued commitment to delivering dentistry with excellence, accuracy, and heart.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section id="founder" className="founder-section">
                <div className="container">
                    <div className="founder-card-dark">
                        <div className="founder-content">
                            <Reveal><span className="eyebrow">Meet Our Founder</span></Reveal>
                            <Reveal><h2 className="system-title">Dr. <em>Jean Ong</em></h2></Reveal>
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
                            <Link className="quiet-link" to={`/dentists/${profileSlugByImg[doctors[0].img]}`}>View full profile →</Link>
                        </div>
                        <div className="founder-image-container">
                            <img src="/images/doctors/dr_Jean Ong.jpg" alt="Dr Jean Ong" className="founder-img" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="team" className="section-padding team-section" style={{ scrollMarginTop: '110px' }}>
                <div className="container">
                    <Reveal width="100%"><h2 className="system-title text-center">The Team Behind <em>Your Smile</em></h2></Reveal>


                    <div className="team-grid">
                        {doctors.map((doc, index) => (
                            <div key={index} className="team-card">
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
                                        <div className="team-meta">{doc.years}</div>
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
                                        <Link className="quiet-link team-profile-link" to={`/dentists/${profileSlugByImg[doc.img]}`}>
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
            <section className="section-padding about-closing">
                <div className="container">
                    <FadeIn>
                        <span className="eyebrow">A visit that feels different</span>
                        <h2 className="statement">Ready to Experience Thoughtful Dental Care?</h2>
                        <Button onClick={() => openBooking('', 'about-page-cta')}>Book a Visit</Button>
                    </FadeIn>
                </div>
            </section>

            <Style>{`
                /* no opaque page background — the shared hero tint (index.css) shows through */
                .about-page .about-hero-container { padding-top: 140px; }
                .about-page .about-hero { padding: 72px 0 60px; }
                .about-page .hero-content-left { max-width: 800px; }
                .about-page .hero-title { margin: 0 0 24px; font-size: clamp(2.5rem, 5vw, 4.2rem); font-weight: 700; line-height: 1.08; letter-spacing: -0.03em; text-wrap: balance; }
                .about-page .hero-description { max-width: 650px; margin: 0; color: var(--color-text-slate); font-size: var(--fs-lead); line-height: 1.6; }
                .about-page .journey-section { padding: 52px 0 var(--space-section-lg); scroll-margin-top: 120px; }
                .about-page .journey-section .system-title { margin-bottom: 34px; }
                .about-page .journey-grid { border-top: 1px solid var(--hairline); }
                .about-page .journey-card { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 28px; padding: 34px 0; border-bottom: 1px solid var(--hairline); }
                .about-page .stage-num { color: var(--color-primary-teal); font-family: var(--font-heading); font-size: .8rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding-top: 5px; }
                .about-page .journey-copy h3 { margin: 0 0 8px; font-size: 1.25rem; font-weight: 700; }
                .about-page .journey-copy p { margin: 0; color: var(--color-text-slate); line-height: 1.7; }
                .about-page .founder-section { padding: var(--space-section-lg) 0; scroll-margin-top: 120px; }
                .about-page .founder-card-dark { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, .82fr); gap: clamp(36px, 6vw, 84px); align-items: center; }
                .about-page .founder-content { grid-column: 1; }
                .about-page .founder-content .system-title { margin-bottom: 8px; }
                .about-page .founder-role { margin: 0 0 30px; color: var(--color-primary-deep); font-size: .9rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
                .about-page .founder-bio h3 { margin: 0 0 14px; font-size: 1.35rem; }
                .about-page .founder-bio p { margin: 0 0 16px; color: var(--color-text-slate); line-height: 1.75; }
                .about-page .founder-image-container { grid-column: 2; grid-row: 1; }
                .about-page .founder-img { display: block; width: 100%; border-radius: 26px !important; }
                /* Team: the owner reverted this to the pre-sweep uniform card
                   grid (8 Sep 2026) — aligned, equal-height cards read better
                   here than the bare stacked tiles. New typography and tokens
                   kept; glass/blur not restored. */
                .about-page .team-section { padding: var(--space-section-lg) 0; scroll-margin-top: 120px; }
                .about-page .team-section .system-title { margin-bottom: 42px; }
                .about-page .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; }
                .about-page .team-card {
                    padding: 0; overflow: hidden; display: flex; flex-direction: column;
                    background: #fff; border-radius: 24px;
                    border: 1px solid var(--hairline);
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.4s var(--ease-slow), box-shadow 0.4s ease;
                }
                .about-page .team-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
                .about-page .team-card-head { display: contents; }
                .about-page .team-photo { height: 350px; overflow: hidden; position: relative; }
                .about-page .team-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center top; transition: transform 0.6s var(--ease-slow); display: block; }
                .about-page .team-card:hover .team-photo img { transform: scale(1.04); }
                .about-page .team-header-top { min-height: 120px; padding: 30px 30px 0; }
                .about-page .team-header-top h3 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin: 0 0 8px; color: var(--color-text-charcoal); }
                .about-page .team-role { color: var(--color-primary-deep); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
                .about-page .team-meta { color: var(--color-text-grey); font-size: 0.9rem; margin-bottom: 8px; }
                .about-page .team-info { padding: 0 30px 30px; flex: 1; display: flex; flex-direction: column; }
                .about-page .team-body-content { flex: 1; display: flex; flex-direction: column; }
                .about-page .team-bio { color: var(--color-text-slate); line-height: 1.6; font-size: 0.95rem; margin: 0 0 20px; }
                .about-page .team-specialties { font-size: 0.85rem; padding: 14px 0; border-top: 1px solid var(--hairline); margin-bottom: 8px; color: var(--color-text-slate); line-height: 1.55; }
                .about-page .team-languages { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--hairline); color: var(--color-text-grey); font-weight: 500; min-height: 85px; display: flex; align-items: flex-start; }
                .about-page .team-profile-link { display: inline-block; margin-top: 12px; font-size: 0.9rem; font-weight: 600; color: var(--color-primary-deep); }
                .about-page .team-profile-link:hover { text-decoration: underline; }
                .about-page .about-closing { padding-bottom: 80px; text-align: center; }
                .about-page .about-closing .eyebrow { margin-bottom: 14px; }
                .about-page .about-closing .statement { max-width: 760px; margin: 0 auto 30px; }
                @media (max-width: 1024px) { .about-page .about-hero-container { padding-top: 108px; } .about-page .founder-card-dark { grid-template-columns: 1fr 1fr; } .about-page .team-grid { gap: 24px; } .about-page .team-card { border-radius: 20px; } .about-page .team-info { padding: 0 20px 20px; } .about-page .team-header-top { padding: 20px 20px 0; } .about-page .team-header-top h3 { font-size: 1.3rem; } .about-page .team-role { font-size: 0.75rem; } .about-page .team-bio { font-size: 0.9rem; } }
                @media (max-width: 700px) { .about-page .about-hero { padding: 46px 0 32px; } .about-page .journey-card { grid-template-columns: 76px minmax(0, 1fr); gap: 16px; padding: 26px 0; } .about-page .founder-card-dark { display: flex; flex-direction: column; align-items: stretch; } .about-page .founder-image-container { order: -1; } .about-page .team-grid { grid-template-columns: 1fr; } .about-page .team-card-head { display: flex; align-items: center; gap: 16px; padding: 16px 16px 4px; } .about-page .team-photo { flex: 0 0 116px; width: 116px; height: auto; aspect-ratio: 3 / 4; border-radius: 16px; } .about-page .team-photo img { object-position: center 12%; } .about-page .team-header-top { min-height: 0; padding: 0; } .about-page .team-role { margin-bottom: 8px; letter-spacing: 0.6px; } .about-page .team-meta { margin-bottom: 0; } .about-page .team-info { padding: 16px; } .about-page .team-languages { min-height: 0; padding-top: 16px; } .about-page .team-bio { margin-bottom: 16px; } }
            
                @media (max-width: 480px) {
                    .about-page .journey-card { grid-template-columns: 1fr; gap: 6px; }
                }
            `}</Style>
        </div>
    );
};

export default About;
