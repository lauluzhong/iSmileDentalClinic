import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import SpecialtyLayout from '../../components/SpecialtyLayout';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const MyofunctionalOrthodontics = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Add Service schema for SEO
    useEffect(() => {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": "Myofunctional Orthodontics",
            "description": "Early orthodontic treatment for children at iSmile Dental Clinic Petaling Jaya",
            "provider": {
                "@type": "Dentist",
                "name": "iSmile Dental Clinic",
                "url": "https://ismile.com.my/services/children"
            },
            "areaServed": {
                "@type": "Place",
                "name": "Petaling Jaya, Selangor"
            },
            "url": "https://ismile.com.my/services/children/myofunctional"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(serviceSchema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const seo = specialtyFor('MyofunctionalOrthodontics');
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

    const stories = [
        {
            h4: 'The First Few Weeks',
            body: [
                'Most children adapt to wearing a removable appliance at night within the first couple of weeks. It is common for parents to notice their child settling into the routine quickly, much like getting used to wearing a retainer. The appliance becomes part of the bedtime routine, and most children take to it naturally.',
            ],
            note: 'Families often describe the first stage as a period of awareness and adjustment before the routine starts to feel more familiar.',
        },
        {
            h4: 'Changes Parents Spot First',
            body: [
                'The earliest changes are often visible in everyday moments. A child may become more aware of keeping their lips closed at rest, where their tongue sits, or how they swallow. Parents sometimes notice these small habit changes first, because they see their child in relaxed, natural settings every day.',
            ],
            note: 'If mouth breathing, snoring, or nasal blockage continues, the child may also need airway or medical evaluation alongside dental care.',
        },
        {
            h4: 'Progress Over Time',
            body: [
                'As oral muscles and daily habits improve, changes may become more noticeable. Some children show better oral posture, more comfortable lip closure, or dental development that is easier to monitor as they grow. Speech clarity may improve in some cases, depending on the underlying cause.',
            ],
            note: 'The pace varies from child to child. Some show early improvements in awareness and posture, while lasting habit changes usually take several months or longer. Follow-up appointments help track what is happening and adjust the approach as needed.',
        },
        {
            h4: 'The Role of Consistency',
            body: [
                'Progress depends heavily on consistency. Children who wear their appliance as instructed and practise the recommended exercises regularly are more likely to build lasting habits. Parents play a key role here by helping their child keep the routine going.',
            ],
            note: 'Most families find that the routine becomes automatic after a few weeks. What felt like an effort at first becomes something the child does without thinking.',
        },
    ];

    const fits = [
        {
            h4: 'As a standalone approach',
            p: 'For some children, myofunctional orthodontics may be recommended as an early standalone approach. The appliance and exercises are used to support healthier oral posture, muscle function, and dental development. This is most suitable when concerns are identified early and the child has good growth potential.',
        },
        {
            h4: 'As a first phase',
            p: 'In other cases, myofunctional treatment is the first phase of a longer orthodontic journey. The aim is to improve the conditions for teeth and jaws to develop, so that if braces or aligners are needed later, the orthodontic plan can be built on a stronger functional foundation.',
        },
        {
            h4: "Alongside other children's dental care",
            p: "Myofunctional orthodontics works alongside regular paediatric dentistry. Routine check-ups, cleanings, and preventive care continue as normal. The myofunctional approach fits into the broader picture of your child's dental health without disrupting other care.",
        },
        {
            h4: 'Addressing habits, not just teeth',
            p: 'A key feature of this approach is that it looks at underlying habits such as mouth breathing, tongue thrust, and swallow patterns rather than focusing only on tooth position. Myofunctional therapy is often used alongside orthodontic care to support stability and long-term results.',
        },
    ];

    return (
        <SpecialtyLayout
            helmet={(
                <Helmet>
                    <title>{fillStats(seo.title, reviewStats)}</title>
                    <meta name="description" content={fillStats(seo.description, reviewStats)} />
                    <link rel="canonical" href={seo.canonical} />
                </Helmet>
            )}
            eyebrow="Interceptive Orthodontics"
            title="Myofunctional Orthodontics"
            titleAccent="Orthodontics"
            subline="Petaling Jaya | iSmile Dental Clinic"
            lead="Myofunctional orthodontics addresses the root causes of jaw underdevelopment and crowding by correcting muscle patterns, breathing habits, and oral posture. At iSmile, we use removable functional braces worn mostly at night that gently guide jaw development and habit correction."
            scienceTitle="The Science & Tech"
            scienceIntro="Instead of just moving teeth after they have gone off course, myofunctional orthodontics works upstream to address why the bite problem developed in the first place."
            features={[
                {
                    h4: 'Muscle Retraining',
                    p: 'Uses specialized appliances to train the tongue to rest on the roof of the mouth, establish proper lip seal, and correct swallowing patterns.',
                },
                {
                    h4: 'Airway & Breathing Health',
                    p: 'Focuses on establishing nasal breathing, which is important for proper facial growth and may help with sleep quality. We screen for mouth breathing patterns at every assessment.',
                },
            ]}
            workflowTitle="Clinical Workflow"
            workflow={[
                { text: 'Thorough Assessment of medical, birth and child developmental history' },
                { text: 'Oral Myofunctional Assessment' },
                { text: 'Airway & Sleep Screening' },
                {
                    text: 'Customized Appliance Selection',
                    note: 'e.g. Expanders, Mandibular Advancers, Maxillary Protractor, Munchees, Myofunctional Appliances ie LM Activator, Braces, Clear Aligners',
                },
                { text: 'Monthly Muscle Exercise Programs' },
                { text: 'Progress Tracking & Growth Monitoring' },
            ]}
            faqs={faqs}
            faqIdPrefix="myofunctional"
            faqAnalyticsLabel="specialty-myofunctional"
            ctaTitle="Consult with our specialists today"
            ctaAccent="today"
            ctaText="Get a professional assessment based on your unique dental structure."
            bookingLabel="Interested in  Myofunctional Orthodontics"
            bookingSource="specialty-myofunctional"
            relatedKey="services/children/myofunctional"
        >
            <section className="sp-stories">
                <div className="container">
                    <h2 className="system-title">What Parents Often Notice During Treatment</h2>
                    <div className="sp-story-rail">
                        {stories.map((story, i) => (
                            <div className="sp-story" key={i}>
                                <span className="sp-story-num">{String(i + 1).padStart(2, '0')}</span>
                                <h4>{story.h4}</h4>
                                {story.body.map((p, j) => (
                                    <p key={j}>{p}</p>
                                ))}
                                <p className="sp-pull"><em>{story.note}</em></p>
                            </div>
                        ))}
                    </div>
                    <p className="sp-story-footer">
                        Every child's journey is different. Some adapt quickly, others take more time. The most important factor is consistency — showing up, wearing the appliance, and doing the exercises as recommended.
                    </p>
                </div>
            </section>

            <section className="sp-fits">
                <div className="container">
                    <h2 className="system-title">How Myofunctional Orthodontics Fits Into Your Child's Care</h2>
                    <div className="sp-fit-list">
                        {fits.map((item, i) => (
                            <div className="sp-fit" key={i}>
                                <h4>{item.h4}</h4>
                                <p>{item.p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </SpecialtyLayout>
    );
};

export default MyofunctionalOrthodontics;
