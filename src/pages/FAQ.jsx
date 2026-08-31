import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import { Reveal, FadeIn } from '../components/Reveal';
import { HelpCircle, Info, CreditCard, User, Droplets, Calendar, Users, ChevronDown } from 'lucide-react';
import { enrichEvent } from '../lib/attribution';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';

const FAQ = () => {
    // Meta comes from src/data/corePagesSeo.js, the same source the build
    // uses to prerender this page — so the two cannot drift.
    const seo = CORE_PAGES.find(p => p.path === 'faq');
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (key) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Add FAQ schema markup for SEO
    useEffect(() => {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.flatMap(category => 
                category.questions.map(q => ({
                    "@type": "Question",
                    "name": q.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": typeof q.a === 'string' ? q.a : 'Contact us for more information.'
                    }
                }))
            )
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(faqSchema);
        document.head.appendChild(script);
        
        return () => {
            document.head.removeChild(script);
        };
    }, []);

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
                    q: "How do I schedule a visit?",
                    a: <>We operate strictly by appointment to ensure every patient receives dedicated care. Please call or WhatsApp us at <a href="https://wa.me/60163222135" target="_blank" rel="noopener noreferrer" className="phone-link">+60163222135</a> to schedule your visit.</>
                },
                {
                    q: "Do you accept credit cards?",
                    a: "Yes, we accept all major credit cards, including Visa and Mastercard. We also support various E-wallets and DuitNow QR transfers for a contactless payment experience."
                },
                {
                    q: "How can I obtain information regarding the pricing of treatments?",
                    a: "Treatment costs vary based on individual needs. During your consultation, we will provide a personalized treatment plan and a clear breakdown of costs before you proceed."
                },
                {
                    q: "Is the clinic wheelchair accessible?",
                    a: "Yes, we are located on the ground floor with full wheelchair access. We also have allocated parking right in front of the clinic for those who may need easier access, such as wheelchair users or our elderly patients."
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
                    a: <>If you experience severe pain, swelling, or a dental injury, please reach out to us at <a href="https://wa.me/60163222135" target="_blank" rel="noopener noreferrer" className="phone-link">+60163222135</a>. We prioritize emergency cases and will do our best to provide same-day care.</>
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
                    a: "We recommend bringing your child for their first dental visit at around age two. By then there are enough teeth to examine properly and most children can follow what is being asked of them, which makes the visit easier for everyone. If anything is worrying you before that, a discoloured tooth, a knock to the mouth or a habit you want an opinion on, bring them in at whatever age they are. Early visits help children feel comfortable and establish good lifelong habits."
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
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href="https://ismile.com.my/faq" />
            </Helmet>
            <div className="container section-padding faq-container">
                <div className="mb-5">
                    <Reveal>
                        <h1 className="hero-title mb-3" style={{ color: 'var(--color-primary)' }}>Common Questions</h1>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="lead-text" style={{ maxWidth: '800px', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
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
                                    <h2 className="h3 mb-0" style={{ color: 'var(--color-text-charcoal)', fontWeight: 700 }}>{section.category}</h2>
                                </div>

                                <div className="faq-grid">
                                    {section.questions.map((item, qIdx) => {
                                        const itemKey = `${sIdx}-${qIdx}`;
                                        const isOpen = openItems[itemKey];
                                        return (
                                        <div key={qIdx} className={`faq-card glass-panel ${isOpen ? 'faq-card-open' : ''}`} onClick={() => toggleItem(itemKey)} role="button" tabIndex={0} aria-expanded={isOpen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItem(itemKey); } }}>
                                            <div className="faq-question-row">
                                                <h3 className="h5 font-weight-bold mb-0" style={{ color: 'var(--color-text-charcoal)', flex: 1 }}>{item.q}</h3>
                                                <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'faq-chevron-open' : ''}`} />
                                            </div>
                                            <div className={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`}>
                                                <div className="faq-answer-inner" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.a}</div>
                                            </div>
                                        </div>
                                        );
                                    })}
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
                            onClick={() => {
                                const ctaLocation = 'faq_page_cta';
                                const eventData = {
                                    event: 'whatsapp_click',
                                    whatsapp_page: window.location.pathname,
                                    whatsapp_cta_text: 'Get In Touch With Us',
                                    whatsapp_type: 'faq_page_cta'
                                };
                                window.dataLayer = window.dataLayer || [];
                                window.dataLayer.push(enrichEvent(eventData, ctaLocation));
                                window.open('https://wa.me/60163222135', '_blank');
                            }}
                        >
                            Get In Touch With Us
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
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .faq-card {
                    padding: 30px;
                    height: auto;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    user-select: none;
                }

                .faq-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(79, 163, 194, 0.15);
                }

                .faq-card-open {
                    border-color: rgba(79, 163, 194, 0.3);
                }

                .faq-question-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .faq-chevron {
                    color: var(--color-primary-teal);
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }

                .faq-chevron-open {
                    transform: rotate(180deg);
                }

                .faq-answer {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.35s ease, margin-top 0.35s ease;
                    margin-top: 0;
                }

                .faq-answer-open {
                    max-height: 500px;
                    margin-top: 16px;
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

                .phone-link {
                    color: var(--color-primary);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .phone-link:hover {
                    color: var(--color-primary-dark);
                    text-decoration: underline;
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

                .faq-container {
                    padding-top: 160px;
                }

                @media (max-width: 1024px) {
                    .faq-container {
                        padding-top: 100px;
                        padding-bottom: 60px;
                        padding-left: 20px;
                        padding-right: 20px;
                    }
                    .faq-grid {
                        gap: 12px;
                    }
                    .p-5 {
                        padding: 1.5rem;
                    }
                    .faq-card {
                        padding: 20px;
                        border-radius: 16px;
                    }
                    .hero-title {
                        font-size: 2rem;
                    }
                    .lead-text {
                        font-size: 1rem;
                    }
                    .category-icon {
                        width: 40px;
                        height: 40px;
                    }
                    .section-header h2 {
                        font-size: 1.3rem;
                    }
                    .faq-question-row h3 {
                        font-size: 0.95rem;
                    }
                    .faq-answer-inner {
                        font-size: 0.9rem;
                    }
                    .still-questions {
                        border-radius: 20px !important;
                        padding: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default FAQ;
