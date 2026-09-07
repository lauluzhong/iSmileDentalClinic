import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import Button from '../components/Button';
import FaqAccordion from '../components/FaqAccordion';
import { Reveal, FadeIn } from '../components/Reveal';
import Style from '../components/Style';
import { enrichEvent } from '../lib/attribution';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';

const faqData = [
    { category: "Visiting & Payments", questions: [
        { q: "Where can I park?", a: "There is street parking is available around the clinic. For your convenience, there is also covered parking at Atria Shopping Gallery just a short 1 minute walk from our clinic." },
        { q: "How do I schedule a visit?", a: <>We operate strictly by appointment to ensure every patient receives dedicated care. Please call or WhatsApp us at <a href="https://wa.me/60163222135" target="_blank" rel="noopener noreferrer" className="phone-link">+60163222135</a> to schedule your visit.</> },
        { q: "Do you accept credit cards?", a: "Yes, we accept all major credit cards, including Visa and Mastercard. We also support various E-wallets and DuitNow QR transfers for a contactless payment experience." },
        { q: "How can I obtain information regarding the pricing of treatments?", a: "Treatment costs vary based on individual needs. During your consultation, we will provide a personalized treatment plan and a clear breakdown of costs before you proceed." },
        { q: "Is the clinic wheelchair accessible?", a: "Yes, we are located on the ground floor with full wheelchair access. We also have allocated parking right in front of the clinic for those who may need easier access, such as wheelchair users or our elderly patients." }
    ] },
    { category: "General Dental Care", questions: [
        { q: "How often should I visit the dentist?", a: "We recommend a routine check-up and professional cleaning every 6 months. Regular visits help maintain optimal oral health and allow us to detect potential issues before they become serious." },
        { q: "What should I do in a dental emergency?", a: <>If you experience severe pain, swelling, or a dental injury, please reach out to us at <a href="https://wa.me/60163222135" target="_blank" rel="noopener noreferrer" className="phone-link">+60163222135</a>. We prioritize emergency cases and will do our best to provide same-day care.</> },
        { q: "Are dental X-rays (radiographs) safe?", a: "Your safety is our top priority. We use advanced digital 2D and 3D imaging technology, which offers high-definition clarity with minimal radiation exposure. These radiographs are vital for safe and accurate treatment. Rest assured, we strictly adhere to the highest safety standards to protect our patients." }
    ] },
    { category: "Children's Dental Care", questions: [
        { q: "At what age should my child first see a dentist?", a: "We recommend bringing your child for their first dental visit by their first birthday, or within six months of their first tooth appearing. That is where both the Malaysian Dental Association and the American Academy of Pediatric Dentistry put it. Early visits help children feel comfortable and let us catch changes while they are still simple to manage. Early visits help children feel comfortable and establish good lifelong habits." },
        { q: "Can I bring my children with me?", a: "Absolutely! We are a family-oriented clinic and we love seeing children. Our team is trained to provide a gentle, step-by-step introduction to dentistry to ensure a positive and anxiety-free experience for your little ones." },
        { q: "What kind of dental services do you offer for children?", a: "We provide comprehensive paediatric dental care including routine check-ups, fluoride treatments, and pit & fissure sealants to prevent decay. We also specialize in early interceptive orthodontics and myofunctional therapy to support healthy jaw growth and airway development." }
    ] }
];

const FAQ = () => {
    const seo = CORE_PAGES.find(p => p.path === 'faq');
    useEffect(() => {
        const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqData.flatMap(category => category.questions.map(q => ({ "@type": "Question", "name": q.q, "acceptedAnswer": { "@type": "Answer", "text": typeof q.a === 'string' ? q.a : 'Contact us for more information.' } }))) };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(faqSchema);
        document.head.appendChild(script);
        return () => document.head.removeChild(script);
    }, []);

    return (
        <div className="page-container faq-page">
            <Helmet><title>{fillStats(seo.title, reviewStats)}</title><meta name="description" content={fillStats(seo.description, reviewStats)} /><link rel="canonical" href="https://ismile.com.my/faq" /></Helmet>
            <main className="container section-padding faq-container">
                <header className="faq-heading">
                    <Reveal><p className="eyebrow">FAQ</p><h1 className="statement">Common <em>Questions</em></h1></Reveal>
                    <Reveal delay={0.1}><p className="faq-lead">We're here to help you feel confident and informed about every part of your dental journey with us.</p></Reveal>
                </header>
                <div className="faq-content">
                    {faqData.map((section, sIdx) => (
                        <section key={section.category} className="faq-section">
                            <FadeIn delay={sIdx * 0.1}><p className="eyebrow">{section.category}</p><FaqAccordion items={section.questions} idPrefix={'faq-' + sIdx} analyticsLabel="faq-page" /></FadeIn>
                        </section>
                    ))}
                </div>
                <section className="still-questions">
                    <FadeIn><p className="eyebrow">Contact</p><h2 className="statement">Still have <em>questions?</em></h2><p>Can't find what you're looking for? Reach out to our friendly team.</p><Button onClick={() => {
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
                    }}>Get In Touch With Us</Button></FadeIn>
                </section>
            </main>
            <Style>{`
                .faq-page .faq-container { padding-top: 160px; }
                .faq-page .faq-heading { max-width: 800px; margin-bottom: 64px; }
                .faq-page .faq-heading .eyebrow, .faq-page .faq-section > .eyebrow, .faq-page .still-questions .eyebrow { margin-bottom: 16px; }
                .faq-page .faq-lead { max-width: 800px; margin: 20px 0 0; color: var(--color-text-slate); font-size: var(--fs-lead); line-height: 1.6; }
                .faq-page .faq-section { margin-bottom: 64px; }
                .faq-page .faq-section .faq-accordion { max-width: none; margin: 20px 0 0; }
                .faq-page .phone-link { color: var(--color-primary-teal); font-weight: 700; text-decoration: none; }
                .faq-page .still-questions { max-width: 800px; margin-top: 72px; padding-top: 52px; border-top: 1px solid var(--hairline); }
                .faq-page .still-questions .statement { margin-bottom: 16px; }
                .faq-page .still-questions > div > p:not(.eyebrow) { max-width: 520px; margin: 0 0 24px; color: var(--color-text-slate); line-height: 1.6; }
                @media (max-width: 768px) { .faq-page .faq-container { padding-top: 130px; padding-bottom: 64px; } .faq-page .faq-heading { margin-bottom: 42px; } .faq-page .faq-section { margin-bottom: 46px; } .faq-page .still-questions { margin-top: 50px; padding-top: 38px; } }
            `}</Style>
        </div>
    );
};

export default FAQ;
