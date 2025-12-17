import React from 'react';
import { Star, Quote } from 'lucide-react';
import Button from '../components/Button';

const reviewsList = [
    {
        text: "My kids actually look forward to going to the dentist now. Dr. Jean is simply amazing!",
        author: "Sarah L.",
        type: "Parent",
        rating: 5
    },
    {
        text: "I was terrified of dentists, but the iSmile team made me feel so safe and heard.",
        author: "Michael T.",
        type: "Nervous Patient",
        rating: 5
    },
    {
        text: "Professional, clean, and incredibly detailed in their work. Highly recommended.",
        author: "David K.",
        type: "Professional",
        rating: 5
    },
    {
        text: "The best dental experience I've ever had. No pain, great results.",
        author: "Jenny W.",
        type: "Cosmetic Patient",
        rating: 5
    },
    {
        text: "Dr. Amy explained everything so clearly. I felt very empowered.",
        author: "Ahmad R.",
        type: "General Checkup",
        rating: 5
    },
    {
        text: "Finally found a clinic that treats my whole family with care.",
        author: "Michelle Tan",
        type: "Parent",
        rating: 5
    }
];

const Reviews = () => {
    return (
        <div className="reviews-page">
            <div className="section-padding" style={{ textAlign: 'center', paddingTop: '180px', paddingBottom: '20px' }}>
                <h1 className="hero-title">Stories From <span className="text-gradient">Our Community</span></h1>
            </div>

            <div className="container section-padding pt-0">
                <div className="reviews-grid">
                    {reviewsList.map((review, index) => (
                        <div key={index} className="glass-panel review-card-large">
                            <div className="quote-icon"><Quote size={40} color="var(--color-tint-blue)" /></div>
                            <div className="stars">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
                            </div>
                            <p className="review-body">"{review.text}"</p>
                            <div className="review-footer">
                                <strong>{review.author}</strong>
                                <span className="review-type">{review.type}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center" style={{ marginTop: '100px', textAlign: 'center' }}>
                    <h3>Have a story to share?</h3>
                    <p className="mb-4">We'd love to hear from you.</p>
                    <Button>Share Your Experience</Button>
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
