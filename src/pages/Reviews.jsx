import React from 'react';
import { Star, Quote } from 'lucide-react';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';

const reviewsList = [
    {
        text: "My kids actually look forward to going to the dentist now. Dr. Jean is simply amazing!",
        author: "Sarah L.",
        type: "Parent",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        text: "I was terrified of dentists, but the iSmile team made me feel so safe and heard.",
        author: "Michael T.",
        type: "Nervous Patient",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=michael"
    },
    {
        text: "Professional, clean, and incredibly detailed in their work. Highly recommended.",
        author: "David K.",
        type: "Professional",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=david"
    },
    {
        text: "The best dental experience I've ever had. No pain, great results.",
        author: "Jenny W.",
        type: "Cosmetic Patient",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=jenny"
    },
    {
        text: "Dr. Amy explained everything so clearly. I felt very empowered.",
        author: "Ahmad R.",
        type: "General Checkup",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=ahmad"
    },
    {
        text: "Finally found a clinic that treats my whole family with care.",
        author: "Michelle Tan",
        type: "Parent",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=michelle"
    }
];

const Reviews = () => {
    return (
        <div className="reviews-page">
            <div className="reviews-hero section-padding">
                <Reveal width="100%"><h1 className="hero-title">Stories From <span className="text-gradient">Our Community</span></h1></Reveal>
            </div>

            <div className="container section-padding pt-0">
                <div className="reviews-grid">
                    {reviewsList.map((review, index) => (
                        <FadeIn key={index} className="glass-panel review-card-large">
                            <div className="quote-icon"><Quote size={40} color="var(--color-tint-blue)" /></div>
                            <div className="stars">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
                            </div>
                            <p className="review-body">"{review.text}"</p>
                            <div className="review-footer">
                                <img src={review.avatar} alt={review.author} className="reviewer-avatar" />
                                <div className="reviewer-info">
                                    <strong>{review.author}</strong>
                                    <span className="review-type">{review.type}</span>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="text-center share-story-section">
                    <Reveal width="100%"><h3>Have a story to share?</h3></Reveal>
                    <p className="mb-4">We'd love to hear from you.</p>
                    <a href="https://g.page/r/CQU1Takv7hs4EAE/review" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Button>Share Your Experience</Button></a>
                </div>
            </div>

            <style>{`
        .reviews-hero {
            text-align: center;
            padding-top: 180px;
            padding-bottom: 20px;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 700;
        }

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
            font-size: 1.1rem;
            font-style: italic;
            margin-bottom: 25px;
            color: var(--color-text-main);
            min-height: 80px;
            flex-grow: 1;
        }
        
        .review-footer {
            display: flex;
            align-items: center;
            gap: 15px;
            border-top: 1px solid rgba(0,0,0,0.05);
            padding-top: 15px;
            margin-top: auto;
        }

        .reviewer-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .reviewer-info {
            display: flex;
            flex-direction: column;
            text-align: left;
        }

        .review-type {
            font-size: 0.85rem;
            color: var(--color-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .share-story-section {
            margin-top: 100px;
            text-align: center;
        }

        @media (max-width: 768px) {
            .reviews-hero {
                padding-top: 140px;
                padding-bottom: 10px;
            }
            .hero-title {
                font-size: 2.2rem;
            }
            .reviews-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .review-card-large {
                padding: 24px;
            }
            .review-body {
                font-size: 1rem;
                min-height: auto;
            }
            .share-story-section {
                margin-top: 60px;
            }
        }
      `}</style>
        </div>
    );
};

export default Reviews;
