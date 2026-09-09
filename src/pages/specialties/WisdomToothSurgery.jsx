import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const WisdomToothSurgery = () => {
    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "WisdomToothSurgery",
            "description": "Professional dental treatment at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/replace"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/replace"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Wisdom Tooth Surgery",
            "description": "Professional wisdom tooth extraction at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/protect"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/protect"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const seo = specialtyFor('WisdomToothSurgery');
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
            eyebrow="Oral Surgery"
            title="Wisdom Tooth Surgery"
            titleAccent="Surgery"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="Safe removal of impacted wisdom teeth in Petaling Jaya. Expert care for painful or problematic third molars. Book your consultation today."
            scienceTitle="The Science & Tech"
            scienceIntro="Successful wisdom tooth removal relies on advanced diagnostics and surgical precision. At iSmile, we prioritize minimally invasive techniques to ensure the fastest possible recovery."
            features={[
                {
                    h4: 'Digital Diagnostics',
                    p: 'Comprehensive 3D X-rays (CBCT) allow us to map the exact root position and its proximity to the inferior alveolar nerve.',
                },
                {
                    h4: 'Tissue Management',
                    p: 'We use precise incisions and piezosurgery (ultrasonic bone cutting) where applicable to minimize trauma to surrounding tissue.',
                },
            ]}
            workflowTitle="Clinical Workflow"
            workflow={[
                { text: 'Pre-op 3D Imaging (OPG/CBCT)' },
                { text: 'Patient Comfort & Anesthesia' },
                { text: 'Surgical Access & Sectioning' },
                { text: 'Socket Debridement & Irrigation' },
                { text: 'A-PRF Placement & Final Suturing' },
            ]}
            faqs={faqs}
            faqIdPrefix="wisdom-tooth"
            faqAnalyticsLabel="specialty-wisdom-tooth"
            ctaTitle="Consult with our specialists today"
            ctaAccent="today"
            ctaText="Get a professional assessment based on your unique dental structure."
            bookingLabel="Interested in Wisdom Tooth Surgery"
            bookingSource="specialty-wisdom-tooth"
            relatedKey="services/protect/wisdom-tooth"
        />
    );
};

export default WisdomToothSurgery;
