import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const ClearAligners = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Clear Aligners",
            "description": "Modern orthodontic solution using custom-made transparent plastic trays to gradually shift teeth into alignment.",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/straighten"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/straighten/clear-aligners"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

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

    const seo = specialtyFor('ClearAligners');
    // Copy lives in src/data/serviceSeo.js so the prerendered HTML matches.
    const faqs = seo.faqs.map(f => ({ q: fillStats(f.q, reviewStats), a: fillStats(f.a, reviewStats) }));

    return (
        <SpecialtyLayout
            helmet={(
                <Helmet>
                    <title>{fillStats(seo.title, reviewStats)}</title>
                    <meta name="description" content={fillStats(seo.description, reviewStats)} />
                    <link rel="canonical" href={seo.canonical} />
                </Helmet>
            )}
            eyebrow="Orthodontics"
            title="Clear Aligners"
            titleAccent="Aligners"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="A modern orthodontic solution using a series of custom-made, transparent plastic trays to gradually shift teeth into alignment. Think of it as a sequence of almost-invisible molds, each tray slightly different from the last, with you moving to the next tray every 1 to 2 weeks. There are no brackets, no wires, and no food restrictions. We offer Invisalign, Angel Aligner, and ClearSmile systems."
            scienceTitle="The Science & Tech"
            scienceIntro="Clear aligners apply controlled, directional force to specific teeth at specific times. Your dentist plans the entire tooth movement sequence digitally before you start, using 3D scans to guide treatment and improve precision."
            features={[
                {
                    h4: 'Advanced Aligner Material',
                    p: 'Multi-layer medical-grade plastic aligner material designed for constant, gentle force and precise control of tooth movements.',
                },
                {
                    h4: 'Digital Workflow',
                    p: 'High-precision 3D intraoral scanning eliminates the need for messy putty impressions and allows for accurate treatment planning from the start.',
                },
            ]}
            workflowTitle="Clinical Workflow"
            workflow={[
                { text: '3D Intraoral Scanning & Digital Impressions' },
                { text: 'Advanced Digital Treatment Planning' },
                { text: 'Custom Aligner Fabrication & Delivery' },
                { text: 'Precision Attachment Placement' },
                { text: 'Monitoring & Periodic Progress Tracking' },
            ]}
            faqs={faqs}
            faqIdPrefix="clear-aligners"
            faqAnalyticsLabel="specialty-clear-aligners"
            ctaTitle="Consult with our dentists today"
            ctaAccent="today"
            ctaText="Get a professional assessment based on your unique dental structure."
            bookingLabel="Interested in Clear Aligners"
            bookingSource="specialty-clear-aligners"
            relatedKey="services/straighten/clear-aligners"
        />
    );
};

export default ClearAligners;
