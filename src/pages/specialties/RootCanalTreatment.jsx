import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const RootCanalTreatment = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Root Canal Treatment",
            "description": "Endodontic treatment to save infected teeth at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/protect"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/protect/root-canal"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const seo = specialtyFor('RootCanalTreatment');
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
            eyebrow="Endodontics"
            title="Root Canal Treatment"
            titleAccent="Treatment"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="Root canal treatment in Petaling Jaya. Save infected teeth and relieve pain. Book your consultation today."
            scienceTitle="The Science & Tech"
            scienceIntro="Successful endodontic therapy relies on advanced visualization and instrument flexibility. At iSmile, we use modern rotary technologies to ensure deep cleaning with minimal structural loss."
            features={[
                {
                    h4: 'Digital Diagnostics',
                    p: 'High-resolution digital X-rays allow us to measure the exact length and curvature of your root canals, ensuring no area is left untreated. For complexed root canals and retreatments, we use Cone Beam CT scans which is a fast & low radiation 3D X-ray to achieve an even more detailed and accurate pre-treatment diagnosis.',
                },
                {
                    h4: 'Rotary Endodontics',
                    p: 'We use flexible nickel-titanium (NiTi) rotary files that navigate curved canals efficiently, removing infection faster and more thoroughly than traditional hand files.',
                },
                {
                    h4: 'Bioceramic Sealer',
                    p: 'We use the latest biocompatible materials, such as bioceramics, to seal the root canals. These advanced sealers are highly compatible with surrounding tissues, actively promoting healing while ensuring a durable, long-term seal.',
                },
            ]}
            workflowTitle="Clinical Workflow"
            workflow={[
                { text: 'Diagnosis & Imaging' },
                { text: 'Anesthesia & Isolation (Rubber Dam)' },
                { text: 'Access Opening & Pulp Removal' },
                { text: 'Cleaning & Shaping (Instrumentation)' },
                { text: 'Obturation (Sealing)' },
                { text: 'Final Restoration (Crown/Filling)' },
            ]}
            faqs={faqs}
            faqIdPrefix="root-canal"
            faqAnalyticsLabel="specialty-root-canal"
            ctaTitle="Save your natural tooth today"
            ctaAccent="natural tooth"
            ctaText="Don't wait for the pain to worsen. Consult with us early."
            bookingLabel="Interested in Root Canal Treatment"
            bookingSource="specialty-root-canal"
            relatedKey="services/protect/root-canal"
        />
    );
};

export default RootCanalTreatment;
