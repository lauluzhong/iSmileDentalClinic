import { Helmet } from 'react-helmet-async';
import React from 'react';
import { Star, Quote } from 'lucide-react';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import reviewStats from '../data/review-stats.json';

const GoogleG = () => (
    <svg width="13" height="13" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
    </svg>
);

// Reviewers who have no profile photo get initials on a brand-tinted tile rather
// than a generic silhouette. Deterministic: the same name always picks the same
// tint, so the avatar is stable across renders and reorderings.
// Charcoal on the three lighter brand tints — 6.6:1, 10.5:1 and 13.2:1, so all
// clear WCAG AA. White on these fails (down to 1.5:1), hence the dark text.
const AVATAR_TINTS = [
    'var(--color-sky-blue)',
    'var(--color-pastel-blue)',
    'var(--color-tint-blue)',
];

// First + last initial, so "Sook Yeen Lee" reads SL rather than colliding with
// "Sze Yoong" at SY.
const initialsOf = (name) => {
    const parts = name.split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    const picked = parts.length === 1 ? [parts[0]] : [parts[0], parts[parts.length - 1]];
    return picked.map((w) => w[0].toUpperCase()).join('');
};

const InitialsAvatar = ({ name, size = 50 }) => {
    const tint = AVATAR_TINTS[
        [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TINTS.length
    ];
    return (
        <div
            aria-hidden="true"
            style={{
                width: size, height: size, borderRadius: '50%',
                background: tint, color: 'var(--color-text-charcoal)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 600,
                fontSize: size * 0.38, letterSpacing: '0.02em', lineHeight: 1,
            }}
        >
            {initialsOf(name)}
        </div>
    );
};

const reviewsList = [
    {
        text: (
            <>
                <p>
                    "I have been a patient of iSmile for <strong>over a decade</strong>.
                    The dental professionals there are <strong>truly professional and caring</strong>.
                </p>
                <p>
                    My <strong>fear of being in the dentist chair has been completely removed</strong> by the{" "}
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
                    whoever attends to you will have a clear picture. Appreciated <strong>Dr Jean and Dr Mah</strong>{" "}
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
        text: (
            <>
                <p>
                    "The only dental clinic I trust for my family with <strong>2 young kids</strong>.
                    An experienced team of dentists who are <strong>kind and caring</strong>,
                    very <strong>clean and comfortable environment</strong> too."
                </p>
            </>
        ),
        author: "Lydia Ng",
        rating: 5,
        avatar: "/images/reviews/lydia_ng.jpg",
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "Family visit to iSmile is a must each time we are back here in Malaysia.
                    Saw <strong>Dr. Jean</strong>, <strong>Dr. Ling</strong> and <strong>Dr. Mah</strong>.
                    Love the ambience each time."
                </p>
                <p>
                    "Friendly receptionist and nurses too.{" "}
                    <strong>Trustworthy dentist</strong> you can definitely rely on for healthy dental care :)"
                </p>
            </>
        ),
        author: "Sze Yoong",
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "My trusted dental clinic all the time for <strong>myself and my family</strong>.
                    I greatly appreciate your care, everything you have done for us. Thank you."
                </p>
            </>
        ),
        author: "Sook Yeen Lee",
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "They have been my <strong>go-to dentist for me and my kids</strong> for many years.
                </p>
                <p>
                    Dr Mah has been giving me <strong>kind and detailed advice</strong> to help me with my periodontal disease.
                    Thank you, iSmile. 😊"
                </p>
            </>
        ),
        author: "Tan Bee Wah",
        rating: 5,
        type: "Verified Google Review"
    },
    {
        text: (
            <>
                <p>
                    "Dr Amy is the <strong>most amazing and gentle dentist</strong>. She has been our{" "}
                    <strong>family dentist for more than 10 years</strong>.
                </p>
                <p>
                    Elaine is a really friendly and efficient front desk staff. Always welcoming every
                    patient with her warm smile 🥰"
                </p>
            </>
        ),
        author: "Christina Phang",
        rating: 5,
        avatar: "/images/reviews/christina_phang.jpg",
        type: "Verified Google Review"
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
                <title>iSmile Reviews — 4.8★ Dentist in Petaling Jaya</title>
                <meta name="description" content="Rated 4.8★ from 91 Google reviews. See what patients say about iSmile Dental Clinic in Damansara Jaya, Petaling Jaya — then WhatsApp us to book." />
                <link rel="canonical" href="https://ismile.com.my/reviews" />
            </Helmet>
            <div className="reviews-hero-gradient">
                <div className="container">
                    <Reveal width="100%">
                        <span className="pill-label" style={{ marginBottom: '22px' }}><Star size={13} fill="#E0A500" color="#E0A500" /> {reviewStats.rating} average · {reviewStats.count} Google reviews</span>
                    </Reveal>
                    <Reveal width="100%">
                        <h1 className="reviews-hero-title">
                            Stories from <span className="text-gradient">our community</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2} width="100%">
                        <p className="reviews-hero-subtitle">
                            Real families, real stories. Some have trusted us for over two decades—here's what they have to say.
                        </p>
                    </Reveal>

                    <Reveal delay={0.3} width="100%">
                        <div className="reviews-stats">
                            <div className="reviews-stat">
                                <span className="reviews-stat-num">{reviewStats.rating}<span className="reviews-stat-unit">/5</span></span>
                                <span className="reviews-stat-label">Google rating</span>
                            </div>
                            <span className="reviews-stat-divider" />
                            <div className="reviews-stat">
                                <span className="reviews-stat-num">{reviewStats.count}+</span>
                                <span className="reviews-stat-label">Verified reviews</span>
                            </div>
                            <span className="reviews-stat-divider" />
                            <div className="reviews-stat">
                                <span className="reviews-stat-num">20+</span>
                                <span className="reviews-stat-label">Years of care</span>
                            </div>
                        </div>
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
                            <div className="review-footer">
                                {review.avatar ? (
                                    <img src={review.avatar} alt={review.author} loading="lazy" width="50" height="50" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <InitialsAvatar name={review.author} />
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong>{review.author}</strong>
                                    <span className="review-type"><GoogleG /> Verified Google review</span>
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
        .reviews-hero-gradient {
            background: linear-gradient(135deg, #F0F7FF 0%, #E0F2FE 55%, #EAF7F0 100%);
            padding-top: 180px;
            padding-bottom: 90px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .reviews-hero-title {
            font-size: clamp(2.4rem, 1.6rem + 3.4vw, 4rem);
            font-weight: 800;
            color: var(--color-text-charcoal);
            letter-spacing: -0.03em;
            margin-bottom: 20px;
            line-height: 1.05;
        }
        .reviews-hero-subtitle {
            font-size: var(--fs-lead);
            color: var(--color-text-slate);
            max-width: 640px;
            margin: 0 auto;
            line-height: 1.6;
        }
        .reviews-stats {
            display: inline-flex;
            align-items: center;
            gap: 36px;
            margin-top: 44px;
            padding: 22px 40px;
            background: rgba(255,255,255,0.75);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.7);
            border-radius: 24px;
            box-shadow: var(--shadow-md);
        }
        .reviews-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .reviews-stat-num { font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--color-primary-deep); line-height: 1; letter-spacing: -0.02em; }
        .reviews-stat-unit { font-size: 1rem; color: var(--color-text-grey); font-weight: 600; }
        .reviews-stat-label { font-size: 0.82rem; color: var(--color-text-slate); font-weight: 500; }
        .reviews-stat-divider { width: 1px; height: 44px; background: rgba(16,42,51,0.12); }

        .reviews-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
            gap: 28px;
        }

        .review-card-large {
            padding: 34px 30px;
            position: relative;
            display: flex;
            flex-direction: column;
            background: #fff;
            border: 1px solid rgba(16,42,51,0.06);
            border-radius: 24px;
            box-shadow: var(--shadow-sm);
            transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
        }
        .review-card-large:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }

        .quote-icon {
            position: absolute;
            top: 24px;
            right: 26px;
            opacity: 0.5;
        }

        .stars {
            margin-bottom: 20px;
            display: flex;
            gap: 4px;
        }

        .review-body {
            font-size: 0.96rem;
            margin-bottom: 24px;
            color: var(--color-text-slate);
            flex: 1;
            line-height: 1.65;
        }
        .review-body strong { color: var(--color-text-charcoal); font-weight: 600; }

        .review-body p {
            margin-bottom: 12px;
        }

        .review-body p:last-child {
            margin-bottom: 0;
        }

        .review-footer {
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            gap: 14px;
            border-top: 1px solid rgba(16,42,51,0.07);
            padding-top: 18px;
        }
        .review-footer strong { color: var(--color-text-charcoal); font-family: var(--font-heading); }

        .review-type {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 0.78rem;
            color: var(--color-text-grey);
            margin-top: 2px;
        }
        @media (max-width: 1024px) {
            .reviews-hero-gradient { padding-top: 140px; padding-bottom: 60px; }
            .reviews-grid { grid-template-columns: 1fr; gap: 20px; }
            .review-card-large {
                padding: 26px 24px;
                border-radius: 20px;
                margin-left: 8px;
                margin-right: 8px;
                width: auto;
            }
            .reviews-hero-subtitle { font-size: 1rem; }
            .reviews-stats { gap: 20px; padding: 18px 22px; margin-top: 32px; flex-wrap: wrap; justify-content: center; }
            .reviews-stat-num { font-size: 1.6rem; }
        }
        @media (max-width: 480px) {
            .reviews-stats { gap: 14px; padding: 16px; border-radius: 20px; }
            .reviews-stat-divider { display: none; }
            .reviews-stat { flex: 0 0 calc(33% - 10px); }
            .reviews-stat-num { font-size: 1.4rem; }
            .reviews-stat-label { font-size: 0.72rem; }
        }
      `}</style>
        </div>
    );
};

export default Reviews;
