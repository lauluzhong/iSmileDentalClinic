import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const CosmeticDentistry = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Cosmetic Dentistry",
            "description": "Transform your smile with veneers, smile design, and aesthetic dental treatments at iSmile Dental Clinic Petaling Jaya.",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/enhance"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/enhance/cosmetic-dentistry"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const seo = specialtyFor('CosmeticDentistry');
    // Copy lives in src/data/serviceSeo.js so the prerendered HTML matches.
    const faqs = seo.faqs.map(f => ({ q: fillStats(f.q, reviewStats), a: fillStats(f.a, reviewStats) }));

    // Add FAQ schema for SEO
    useEffect(() => {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(faqSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <SpecialtyLayout
            helmet={(
                <Helmet>
                    <title>{fillStats(seo.title, reviewStats)}</title>
                    <meta name="description" content={fillStats(seo.description, reviewStats)} />
                    <link rel="canonical" href={seo.canonical} />
                </Helmet>
            )}
            eyebrow="Smile Design"
            title="Cosmetic Dentistry"
            titleAccent="Dentistry"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="Design your dream smile with aesthetic dental treatments tailored to your unique facial features. From veneers to full mouth rehabilitation, we combine art and science for results that look natural and function beautifully."
            scienceTitle="The Art & Science"
            scienceIntro="True cosmetic dentistry goes beyond just 'white teeth'. We analyze and design a smile with function in mind that is pleasing and harmonious with your facial features."
            features={[
                {
                    h4: 'Smile Analysis',
                    p: 'We evaluate tooth proportions, gum display, lip support, and facial symmetry to create a smile that is uniquely yours.',
                },
                {
                    h4: 'Trial Smile Mock-ups',
                    p: 'Preview your new smile before any treatment. See and feel how it looks in your mouth, then approve before we proceed.',
                },
                {
                    h4: 'Minimally Invasive Protocols',
                    p: 'We preserve natural tooth structure wherever possible. Composite veneers often require little to no reduction.',
                },
            ]}
            workflowTitle="Treatment Options"
            workflow={[
                { text: 'Composite Veneers — Direct bonding, single visit' },
                { text: 'Ceramic Veneers — Lab-made, superior aesthetics' },
                { text: 'All-Ceramic Crowns — Strength and beauty combined' },
                { text: 'Full Mouth Rehabilitation — Complete transformation' },
            ]}
            faqs={faqs}
            faqIdPrefix="cosmetic-dentistry"
            faqAnalyticsLabel="specialty-cosmetic-dentistry"
            ctaTitle="Design your perfect smile"
            ctaAccent="perfect smile"
            ctaText="Book a cosmetic consultation to explore your options."
            bookingLabel="Interested in Cosmetic Dentistry"
            bookingSource="specialty-cosmetic-dentistry"
            relatedKey="services/enhance/cosmetic-dentistry"
        />
    );
};

export default CosmeticDentistry;
