import React from 'react';
import { Linkedin, Award } from 'lucide-react';

const doctors = [
    {
        name: "Dr Jean Ong",
        role: "Founder & Dental Surgeon",
        years: "33 years",
        qualifications: "BDS, University of Malaya",
        bio: "Loves being a wife, mother, and grandmother, and is passionate about caring for people.",
        languages: "English, Chinese, Malay, Foo Chow, Cantonese, Hokkien",
        img: "/images/doctors/dr_Jean Ong.jpg"
    },
    {
        name: "Dr Amy Chin Mei Kuen",
        role: "Dental Surgeon",
        years: "23 years",
        qualifications: "BDS, University of Malaya",
        bio: "Passionate about educating patients and helping them achieve good oral health while giving them a smile they can be proud of.",
        languages: "English, Malay, Cantonese",
        img: "/images/doctors/dr_Amy Chin Mei Kuen.jpg"
    },
    {
        name: "Dr Mah Haw Yeng",
        role: "Dental Surgeon",
        years: "Since 2002",
        qualifications: "BDS, University of Malaya",
        specialties: "Orthodontics, Wisdom Teeth Removal, Dentures",
        bio: "Kind and gentle, always committed to serving her patients wholeheartedly.",
        languages: "Mandarin, Cantonese, English, Bahasa Malaysia",
        img: "/images/doctors/dr_Mah Haw Yeng.jpg"
    },
    {
        name: "Dr Ling",
        role: "Dental Surgeon",
        years: "TBC",
        qualifications: "TBC",
        bio: "TBC",
        languages: "TBC",
        img: "/images/doctors/dr_Ling.jpg"
    },
    {
        name: "Azelia Lau Yiling",
        role: "Dental Surgeon",
        years: "16 years",
        qualifications: "Nizhny Novgorod State Medical Academy",
        bio: "Passionate about making dental visits a pleasant experience for both the young and the old.",
        languages: "English, Malay",
        img: "/images/doctors/dr_Azelia Lau Yiling.jpg"
    },
    {
        name: "Dr Priscilla",
        role: "Dental Surgeon",
        years: "23 years",
        qualifications: "BDS, University of Malaya (2003)",
        bio: "Finds satisfaction in helping children overcome their fear of dentists; mother of four.",
        languages: "English, Chinese, Bahasa Malaysia, Hokkien, Cantonese",
        img: "/images/doctors/dr_Priscilla.jpg"
    },
    {
        name: "Dr Lim Zhi Yin Joan",
        role: "Specialist",
        years: "18 years",
        qualifications: "Cert. Advanced Restorative (UCLA), MFDS (RCS Edinburgh), BDS (UM)",
        specialties: "Esthetic dentistry, Fixed prosthodontics, Implantology",
        bio: "Passionate about elevating restorative and aesthetic dentistry through advanced training, clinical excellence, and teaching.",
        languages: "English, Mandarin, Malay",
        img: "/images/doctors/dr_Lim Zhi Yin Joan.jpg"
    },
    {
        name: "Yeoh Oon Take",
        role: "Specialist",
        years: "13 years",
        qualifications: "BDS (Malaya), D.Clin.Dent Prosthodontics (Melbourne)",
        specialties: "Dental implants, Oral function, Crown and bridge",
        bio: "Enjoys the current moment while constantly seeking opportunities to improve.",
        languages: "Malay, Mandarin, English, Cantonese, Hokkien",
        img: "/images/doctors/dr_yeoh.jpg"
    }
];

const About = () => {
    return (
        <>
            <div className="about-hero section-padding">
                <div className="container text-center">
                    <h1 className="hero-title" style={{ marginTop: '20px' }}>About <span className="text-gradient">iSmile</span></h1>
                    <p className="hero-subtitle" style={{ margin: '0 auto', fontSize: '1.3rem', fontWeight: '700' }}>Built on Competency & Compassion</p>
                </div>
            </div>

            {/* 1. Philosophy */}
            <section id="philosophy" className="section-padding">
                <div className="container">
                    <div className="glass-panel content-card">
                        <h2>Where Competency and Compassion Meet</h2>
                        <div className="divider"></div>
                        <p className="lead-text" style={{ fontWeight: '700' }}>
                            iSmile Dental Clinic was founded with a simple conviction: that modern, high-quality dental care should always be rooted in genuine care for people.
                        </p>
                        <p>
                            Connecting clinical excellence with genuine care is our hallmark. We believe in partnering with our patients to ensure they feel safe, heard, and valued at every step of their journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Our Founder */}
            <section id="founder" className="section-padding">
                <div className="container">
                    <div className="split-layout">
                        <div className="split-image">
                            <h2 style={{ marginBottom: '15px' }}>Dr. Jean Ong</h2>
                            <div className="glass-panel image-frame" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src="/images/team_group.jpg" alt="iSmile Team" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                            </div>
                        </div>
                        <div className="split-content">
                            <h2 style={{ marginTop: '30px' }}>A Vision for <span className="text-gradient">Better Care</span></h2>
                            <p>
                                <strong>Dr Jean Ong</strong> founded iSmile with a goal to make every visit feel a little more like home.
                                As a mother of five, she is passionate about creating a safe, welcoming space where families feel seen, supported, and cared for.
                            </p>
                            <p>
                                With over 33 years of experience, she combines deep clinical expertise with a gentle touch, aiming to partner with parents in raising children who grow up with healthy, sustainable dental habits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Our Team */}
            <section id="team" className="section-padding">
                <div className="container">
                    <h2 className="text-center mb-5">The Team Behind <span className="text-gradient">Your Smile</span></h2>

                    <div className="team-grid">
                        {doctors.map((doc, index) => (
                            <div key={index} className="glass-panel team-card">
                                <div className="team-photo">
                                    {doc.img && <img
                                        src={doc.img}
                                        alt={doc.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center 13%'

                                        }}
                                    />}
                                </div>
                                <div className="team-info">
                                    <h3>{doc.name}</h3>
                                    <div className="team-role">{doc.role}</div>
                                    <div className="team-meta">
                                        <div><Award size={14} /> {doc.years}</div>
                                    </div>
                                    <p className="team-bio">{doc.bio}</p>

                                    {doc.specialties && (
                                        <div className="team-specialties">
                                            <strong>Specialties:</strong> {doc.specialties}
                                        </div>
                                    )}

                                    <div className="team-languages">
                                        <small>Speaking: {doc.languages}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
        .about-hero {
            padding-top: 120px;
            padding-bottom: 40px;
        }

        .content-card {
            padding: 60px;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
        }

        .lead-text {
            font-size: 1.4rem;
            color: var(--color-primary);
            font-weight: 300;
            margin-bottom: 20px;
        }

        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .team-card {
            padding: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s;
        }

        .team-card:hover {
            transform: translateY(-5px);
        }

        .team-photo {
            height: 250px;
            background: #e0e0e0;
            width: 100%;
        }

        .team-info {
            padding: 25px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .team-role {
            color: var(--color-secondary);
            font-weight: 600;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
        }

        .team-meta {
            display: flex;
            gap: 15px;
            font-size: 0.9rem;
            color: var(--color-text-muted);
            margin-bottom: 15px;
            align-items: center;
        }

        .team-bio {
            margin-bottom: 20px;
            font-size: 0.95rem;
        }
        
        .team-specialties {
            font-size: 0.85rem;
            background: rgba(255,255,255,0.5);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .team-languages {
            margin-top: auto;
            color: var(--color-text-muted);
            border-top: 1px solid rgba(0,0,0,0.05);
            padding-top: 15px;
        }

        .signature {
            font-family: 'Dancing Script', cursive; /* Placeholder for signature font if available */
            font-size: 2rem;
            color: var(--color-primary);
            margin-top: 30px;
        }
      `}</style>
        </>
    );
};

export default About;
