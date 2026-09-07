import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const PediatricDentistry = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Pediatric Dentistry",
            "description": "Gentle dental care for children in Petaling Jaya. First dental visits, preventive treatments, and child-friendly care at iSmile Dental Clinic.",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/children"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/children/pediatric-dentistry"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const seo = specialtyFor('PediatricDentistry');
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
            eyebrow="Children's Care"
            title="Pediatric Dentistry"
            titleAccent="Dentistry"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="Gentle, trauma-free dental care for children from their very first tooth onwards. We focus on prevention, education, and creating positive dental experiences that last a lifetime. Every pediatric check-up at iSmile also includes a basic myofunctional screening to assess breathing patterns and oral posture."
            scienceTitle="Prevention is Key"
            scienceIntro="Our pediatric approach focuses on early intervention, prevention, and building healthy habits from a young age so your child can maintain a healthy smile for life."
            features={[
                {
                    h4: 'Fissure Sealants',
                    p: 'Protective coatings on back teeth to prevent decay in grooves and pits where cavities commonly form. A painless, quick procedure that may provide years of protection.',
                },
                {
                    h4: 'Topical Fluoride',
                    p: 'Professionally applied fluoride strengthens enamel and makes teeth more resistant to cavities. Applied at cleanings for optimal coverage and protection.',
                },
                {
                    h4: 'Child-Friendly Environment',
                    p: 'We take time to build trust with your child. No rush, no judgment. Just a positive, fun experience that makes them excited about dental health.',
                },
            ]}
            workflowTitle="Children's Services"
            workflow={[
                { text: 'First Dental Visit & Assessment' },
                { text: 'Fissure Sealants' },
                { text: 'Topical Fluoride Treatment' },
                { text: 'Paediatric Fillings' },
                { text: 'Baby Tooth Extraction' },
                { text: 'Basic Myofunctional Screening' },
            ]}
            faqs={faqs}
            faqIdPrefix="pediatric-dentistry"
            faqAnalyticsLabel="specialty-pediatric-dentistry"
            ctaTitle="Start your child on a healthy smile"
            ctaAccent="healthy smile"
            ctaText="Book their first visit and set them up for a lifetime of great dental health."
            bookingLabel="Pediatric Dentistry for my child"
            bookingSource="specialty-pediatric-dentistry"
            relatedKey="services/children/pediatric-dentistry"
        />
    );
};

export default PediatricDentistry;
