import { Helmet } from 'react-helmet-async';
import React from 'react';
import { Star, Quote } from 'lucide-react';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';

const reviewsList = [
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
        rating: 5,
        avatar: "/images/reviews/mike_ngui.png"
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
        rating: 5,
        avatar: "/images/reviews/kah_mun_hew.png"
    },
    {
        text: (
            <>
                <p>
                    "Have been to my fair share of dentists. Above all, I appreciate iSmile's <strong>professional care</strong>{" "}
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
        rating: 5,
        avatar: "/images/reviews/benny_kong.png"
    },
    {
        text: (
            <>
                <p>
                    "Happy with the service and helpful that there is one reserved parking in front of the clinic.
                    Good location near Atria DJ and the clinic is clean and calm vibes.
                </p>
                <p>
                    Thank you <strong>Dr Jean</strong> and all the friendly staff too! 🙂"
                </p>
            </>
        ),
        author: "Ashley Chin",
        rating: 5,
        avatar: "/images/reviews/ashley_chin.png"
    },
    {
        text: "Dr Jean is thorough, professional, gentle yet strong. Have been seeing for over 20 years and will continue to do so.",
        author: "Karen Lam",
        rating: 5,
        avatar: "/images/reviews/karen_lam.png"
    },
    {
        text: "Appreciate reminder of appointments, nice and clean and bright reception area and of course excellent dental services.",
        author: "Wee Min Lee",
        rating: 5,
        avatar: "/images/reviews/wee_min_lee.png"
    }
];

const Reviews = () => {
    return (
        <div className="reviews-page">
            <Helmet>
                <title>Patient Reviews | iSmile Dental Clinic Petaling Jaya</title>
                <meta name="description" content="See what our patients say about their experience at iSmile Dental Clinic Petaling Jaya." />
            </Helmet>
            <div className="reviews-hero-gradient" style={{
                background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%)',
                paddingTop: '180px',
                paddingBottom: '80px',
                textAlign: 'center'
            }}>
                <div className="container">
                    <Reveal width="100%">
                        <h1 className="hero-title" style={{
                            fontSize: "clamp(2.5rem, 5vw, 4rem)",
                            fontWeight: 800,
                            color: '#2d3748',
                            letterSpacing: '-0.02em',
                            marginBottom: '20px'
                        }}>
                            Stories From <span className="text-gradient">Our Community</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2} width="100%">
                        <p className="hero-subtitle" style={{
                            fontSize: '1.2rem',
                            color: '#4a5568',
                            maxWidth: '800px',
                            margin: '0 auto',
                            lineHeight: '1.6',
                            fontWeight: 500
                        }}>
                            Real People. Real Stories. Real Transformation.
                        </p>
                    </Reveal>
                </div>
            </div>

            <div className="container section-padding pt-0">
                <div className="reviews-grid">
                    {reviewsList.map((review, index) => (
                        <FadeIn key={index} className="glass-panel review-card-large">
                            <div className="quote-icon"><Quote size={40} color="var(--color-tint-blue)" /></div>
                            <div className="stars">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
                            </div>
                            <div className="review-body">{review.text}</div>
                            <div className="review-footer" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={review.avatar} alt={review.author} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong>{review.author}</strong>
                                    <span className="review-type">{review.type}</span>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="text-center" style={{ marginTop: '100px', textAlign: 'center' }}>
                    <Reveal width="100%"><h3>Have a story to share?</h3></Reveal>
                    <p className="mb-4">We'd love to hear from you.</p>
                    <a href="https://g.page/r/CQU1Takv7hs4EAE/review" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Button>Share Your Experience</Button></a>
                </div>
            </div>

            <style>{`
        .reviews-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
        }

        .review-card-large {
            padding: 30px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .quote-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            opacity: 0.5;
        }

        .stars {
            margin-bottom: 20px;
            display: flex;
            gap: 4px;
        }

        .review-body {
            font-size: 0.9rem;
            font-style: italic;
            margin-bottom: 25px;
            color: var(--color-text-main);
            flex: 1;
            line-height: 1.5;
        }

        .review-body p {
            margin-bottom: 12px;
        }

        .review-body p:last-child {
            margin-bottom: 0;
        }
        
        .review-footer {
            display: flex;
            flex-direction: column;
            border-top: 1px solid rgba(0,0,0,0.05);
            padding-top: 15px;
        }

        .review-type {
            font-size: 0.8rem;
            color: var(--color-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        @media (max-width: 1024px) {
            .reviews-grid { grid-template-columns: 1fr; gap: 20px; }
            .review-card-large { 
                padding: 24px; 
                border-radius: 20px;
                margin-left: 8px;
                margin-right: 8px;
                width: auto;
            }
            .hero-title { font-size: 2.5rem !important; }
            .hero-subtitle { font-size: 1rem !important; margin-top: 15px !important; }
            /* Adjust inline styles via class overrides if possible, or assume parent handles some */
        }
      `}</style>
        </div>
    );
};

export default Reviews;