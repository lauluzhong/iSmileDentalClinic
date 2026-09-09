import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const TeethWhitening = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Teeth Whitening",
            "description": "Professional teeth whitening treatment at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/enhance"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/enhance/teeth-whitening"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const seo = specialtyFor('TeethWhitening');
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
            eyebrow="Aesthetic Dentistry"
            title="Teeth Whitening"
            titleAccent="Whitening"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="Professional teeth whitening in Petaling Jaya. Brighten your smile with our custom treatment. Book your consultation today."
            scienceTitle="The Science of Gradual Whitening"
            scienceIntro="While instant results are popular, true long-term whitening occurs through a sustained oxidation process. Our protocol ensures the deepest stains are removed with minimal sensitivity."
            features={[
                {
                    h4: '3D-Printed Custom Trays',
                    p: 'We use high-precision digital scanners to map your teeth. This ensures a reservoir-perfect fit that holds the gel in place and prevents saliva from diluting the whitening agent.',
                },
                {
                    h4: 'Prescribed Whitening Chemistry',
                    p: 'We provide medical-grade Carbamide or Hydrogen Peroxide gels with stabilized pH and desensitizers (like Potassium Nitrate and Fluoride) to protect your enamel.',
                },
                {
                    h4: 'Long-Term Shade Stability',
                    p: "The gradual process allows for 'enamel re-hydration' between sessions, resulting in a brightness that lasts significantly longer than rapid chair-side treatments.",
                },
            ]}
            workflowTitle="Prescription Workflow"
            workflow={[
                { text: 'Comprehensive Oral Health Screening' },
                { text: 'High-Definition 3D Digital Scanning' },
                { text: 'Laboratory Fabrication of Custom Trays' },
                { text: 'Personalized Gel Prescription & Briefing' },
                { text: 'Structured At-Home Whitening (10-14 days)' },
                { text: 'Final Shade Assessment & Maintenance' },
            ]}
            faqs={faqs}
            faqIdPrefix="teeth-whitening"
            faqAnalyticsLabel="specialty-teeth-whitening"
            ctaTitle="Ready for a lasting transformation?"
            ctaAccent="lasting transformation"
            ctaText="Consult with our doctors to receive your customized professional whitening kit."
            ctaButtonLabel="Get Your Custom Kit"
            bookingLabel="Interested in Take-Home Whitening"
            bookingSource="specialty-teeth-whitening"
            relatedKey="services/enhance/teeth-whitening"
        />
    );
};

export default TeethWhitening;
