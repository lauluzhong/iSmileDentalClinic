import React from 'react';
import { Reveal, FadeIn } from '../components/Reveal';
import { HelpCircle, Info, CreditCard, User, Droplets, Calendar, Users } from 'lucide-react';

const FAQ = () => {
    const faqData = [
        {
            category: "Visiting & Payments",
            icon: <CreditCard className="w-6 h-6" />,
            questions: [
                {
                    q: "Where can I park?",
                    a: "There is street parking is available around the clinic. For your convenience, there is also covered parking at Atria Shopping Gallery just a short 1 minute walk from our clinic."
                },
                {
                    q: "How do I book an appointment?",
                    a: "We operate strictly by appointment to ensure every patient receives dedicated care. Please call or WhatsApp us at +60 16 322 2135 to schedule your visit."
                },
                {
                    q: "Do you accept credit cards?",
                    a: "Yes, we accept all major credit cards, including Visa and Mastercard. We also support various E-wallets and DuitNow QR transfers for a contactless payment experience."
                },
                {
                    q: "How can I obtain information regarding the pricing of treatments?",
                    a: "Treatment costs vary based on individual needs. During your consultation, we will provide a personalized treatment plan and a clear breakdown of costs before you proceed."
                }
            ]
        },
        {
            category: "General Dental Care",
            icon: <User className="w-6 h-6" />,
            questions: [
                {
                    q: "How often should I visit the dentist?",
                    a: "We recommend a routine check-up and professional cleaning every 6 months. Regular visits help maintain optimal oral health and allow us to detect potential issues before they become serious."
                },
                {
                    q: "What should I do in a dental emergency?",
                    a: "If you experience severe pain, swelling, or a dental injury, please reach out to us at +60 16 322 2135. We prioritize emergency cases and will do our best to provide same-day care."
                },
                {
                    q: "Are dental X-rays (radiographs) safe?",
                    a: "Your safety is our top priority. We use advanced digital 2D and 3D imaging technology, which offers high-definition clarity with minimal radiation exposure. These radiographs are vital for safe and accurate treatment. Rest assured, we strictly adhere to the highest safety standards to protect our patients."
                }
            ]
        },
        {
            category: "Children's Dental Care",
            icon: <Users className="w-6 h-6" />,
            questions: [
                {
                    q: "At what age should my child first see a dentist?",
                    a: "We recommend bringing your child for their first dental visit by their first birthday or when their first tooth erupts. Early visits help children feel comfortable and establish good lifelong habits."
                },
                {
                    q: "Can I bring my children with me?",
                    a: "Absolutely! We are a family-oriented clinic and we love seeing children. Our team is trained to provide a gentle, step-by-step introduction to dentistry to ensure a positive and anxiety-free experience for your little ones."
                },
                {
                    q: "What kind of dental services do you offer for children?",
                    a: "We provide comprehensive paediatric dental care including routine check-ups, fluoride treatments, and pit & fissure sealants to prevent decay. We also specialize in early interceptive orthodontics and myofunctional therapy to support healthy jaw growth and airway development."
                }
            ]
        }
    ];

    return (
        <div className="page-container faq-page">
            <div className="container section-padding" style={{ paddingTop: '160px' }}>
                <div className="mb-5">
                    <Reveal>
                        <h1 className="hero-title mb-3" style={{ color: 'var(--color-primary)' }}>Common Questions</h1>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="lead-text" style={{ maxWidth: '800px', fontSize: '1.2rem', color: '#4a5568' }}>
                            We're here to help you feel confident and informed about every part of your dental journey with us.
                        </p>
                    </Reveal>
                </div>

                <div className="faq-content">
                    {faqData.map((section, sIdx) => (
                        <div key={sIdx} className="faq-section mb-5">
                            <FadeIn delay={sIdx * 0.1}>
                                <div className="section-header mb-4">
                                    <div className="category-icon">
                                        {section.icon}
                                    </div>
                                    <h2 className="h3 mb-0" style={{ color: '#2d3748', fontWeight: 700 }}>{section.category}</h2>
                                </div>

                                <div className="faq-grid">
                                    {section.questions.map((item, qIdx) => (
                                        <div key={qIdx} className="faq-card glass-panel">
                                            <h3 className="h5 font-weight-bold mb-3" style={{ color: '#2d3748' }}>{item.q}</h3>
                                            <p className="mb-0" style={{ color: '#4a5568', lineHeight: 1.6 }}>{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </FadeIn>
                        </div>
                    ))}
                </div>

                <div className="still-questions text-center mt-5 p-5 glass-panel" style={{ borderRadius: '30px' }}>
                    <FadeIn>
                        <HelpCircle className="w-12 h-12 text-blue mx-auto mb-3" />
                        <h3 className="h4 mb-3">Still have questions?</h3>
                        <p className="mb-4">Can't find what you're looking for? Reach out to our friendly team.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.open('https://wa.me/60163222135', '_blank')}
                        >
                            WhatsApp Us
                        </button>
                    </FadeIn>
                </div>
            </div>

            <style>{`
                .faq-page {
                    background: radial-gradient(circle at 0% 0%, var(--color-tint-blue) 0%, transparent 40%),
                                radial-gradient(circle at 100% 100%, var(--color-pastel-blue) 0%, transparent 40%);
                }

                .faq-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                }

                .faq-card {
                    padding: 30px;
                    height: 100%;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .faq-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(79, 163, 194, 0.2);
                }

                .category-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--color-primary-teal);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 16px rgba(79, 163, 194, 0.25);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .d-flex {
                    display: flex;
                }

                .align-items-center {
                    align-items: center;
                }

                .justify-content-center {
                    justify-content: center;
                }

                .mr-3 {
                    margin-right: 1rem;
                }

                .mb-0 {
                    margin-bottom: 0;
                }

                .mb-3 {
                    margin-bottom: 1rem;
                }

                .mb-4 {
                    margin-bottom: 1.5rem;
                }

                .mb-5 {
                    margin-bottom: 3rem;
                }

                .mt-5 {
                    margin-top: 3rem;
                }

                .p-5 {
                    padding: 3rem;
                }

                .w-6 { width: 24px; }
                .h-6 { height: 24px; }
                .w-12 { width: 48px; }
                .h-12 { height: 48px; }

                @media (max-width: 768px) {
                    .faq-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .p-5 {
                        padding: 1.5rem;
                    }
                    .faq-card {
                        padding: 24px;
                        border-radius: 20px;
                    }
                    .section-padding {
                        padding-top: 100px !important; /* Override inline style */
                        padding-bottom: 60px;
                    }
                    .hero-title {
                        font-size: 2.5rem;
                    }
                    .lead-text {
                        font-size: 1rem !important;
                    }
                    .category-icon {
                        width: 40px;
                        height: 40px;
                    }
                    .section-header h2 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FAQ;

