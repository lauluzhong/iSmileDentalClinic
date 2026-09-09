import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const DentalImplants = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const seo = specialtyFor('DentalImplants');
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
            eyebrow="Implantology"
            title="Dental Implants"
            titleAccent="Implants"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="A dental implant is a titanium screw placed surgically into your jawbone, where it functions as an artificial tooth root. After a healing period called osseointegration, a crown is attached to give you a replacement tooth that looks, feels, and functions like a natural one."
            scienceTitle="The Science & Tech"
            scienceIntro="We use Grade 5 Titanium for implants, a highly biocompatible material that the body readily accepts."
            features={[
                {
                    h4: 'Bio-compatibility',
                    p: 'Grade 5 Titanium promotes healthy bone growth and integration, minimizing the risk of rejection.',
                },
                {
                    h4: 'Osseointegration',
                    p: 'The biological process where bone cells grow directly onto the surface of the implant, creating a structural bond that mimics the strength of natural tooth roots.',
                },
            ]}
            workflowTitle="Clinical Workflow"
            workflow={[
                { text: 'CBCT 3D Bone Density Analysis' },
                { text: 'Surgical Implant Placement (Fixtures)' },
                { text: 'Osseointegration Healing Phase (typically several months)' },
                { text: 'Abutment Attachment & Soft Tissue Shaping' },
                { text: 'Final Porcelain Crown / Prosthesis Placement' },
            ]}
            faqs={faqs}
            faqIdPrefix="dental-implants"
            faqAnalyticsLabel="specialty-dental-implants"
            ctaTitle="Consult with our specialists today"
            ctaAccent="today"
            ctaText="Get a professional assessment based on your unique dental structure."
            bookingLabel="Interested in Dental Implants"
            bookingSource="specialty-dental-implants"
            relatedKey="services/replace/dental-implants"
        />
    );
};

export default DentalImplants;
