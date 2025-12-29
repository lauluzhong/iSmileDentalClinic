import React, { useEffect } from 'react';
import { Reveal, FadeIn } from '../components/Reveal';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
    {
        q: "How often should I visit the dentist?",
        a: "It is generally recommended to visit the dentist every 6 months for a routine check-up and scaling (cleaning). This allows us to detect and treat any issues early before they become serious."
    },
    {
        q: "Do you accept insurance?",
        a: "We accept a variety of corporate insurance plans and panels. Please contact our front desk via WhatsApp to verify if your specific insurance or company panel is covered."
    },
    {
        q: "What should I do in a dental emergency?",
        a: "If you have severe pain, bleeding, or a knocked-out tooth, please call us immediately. We prioritize emergency cases and will do our best to see you as soon as possible."
    },
    {
        q: "How can I book an appointment?",
        a: "The easiest way is to click the 'Book Appointment' button on our website, which opens a WhatsApp chat with us. You can also call us directly during operating hours."
    },
    {
        q: "Do you treat children?",
        a: "Yes! We love seeing children. We recommend bringing your child for their first visit by age 1 or when their first tooth appears. Our team is trained to make visits fun and stress-free."
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept Cash, Credit Cards (Visa/Mastercard), Debit Cards, and QR Pay (DuitNow/TnG eWallet)."
    }
];

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="faq-item glass-panel" onClick={() => setIsOpen(!isOpen)}>
            <div className="faq-question">
                <h3>{question}</h3>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
        </div>
    );
};

const FAQ = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="faq-page">
            <div className="faq-hero section-padding">
                <div className="container">
                    <Reveal width="100%"><h1 className="hero-title">Frequently Asked <span className="text-gradient">Questions</span></h1></Reveal>
                    <Reveal delay={0.2} width="100%"><p className="hero-subtitle">
                        Everything you need to know about your visit to iSmile Dental Clinic.
                    </p></Reveal>
                </div>
            </div>

            <div className="container section-padding pt-0">
                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <FadeIn key={index}>
                            <FAQItem question={item.q} answer={item.a} />
                        </FadeIn>
                    ))}
                </div>
            </div>

            <style>{`
                .faq-hero {
                    text-align: center;
                    padding-top: 180px;
                    padding-bottom: 40px;
                }
                
                .hero-title {
                    font-size: 3rem;
                    font-weight: 700;
                }
                
                .hero-subtitle {
                    font-size: 1.2rem;
                    color: var(--color-text-muted);
                    max-width: 600px;
                    margin: 20px auto 0;
                }

                .faq-list {
                    max-width: 800px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .faq-item {
                    padding: 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .faq-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                }

                .faq-question {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                }

                .faq-question h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0;
                    color: var(--color-text);
                }

                .faq-answer {
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(0,0,0,0.05);
                    color: var(--color-text-light);
                    line-height: 1.6;
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .faq-hero {
                        padding-top: 140px;
                    }
                    .hero-title {
                        font-size: 2.5rem;
                    }
                    .faq-item {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default FAQ;
