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
            <div className="section-padding" style={{ textAlign: 'center', paddingTop: '180px', paddingBottom: '20px' }}>
                <Reveal width="100%"><h1 className="hero-title" style={{ fontSize: "3rem", fontWeight: 700 }}>Stories From <span className="text-gradient">Our Community</span></h1></Reveal>
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
        }
        
        .review-footer {
            display: flex;
            flex-direction: column;
            border-top: 1px solid rgba(0,0,0,0.05);
            padding-top: 15px;
        }

        .review-type {
            font-size: 0.85rem;
            color: var(--color-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
      `}</style>
        </div>
    );
};

export default Reviews;