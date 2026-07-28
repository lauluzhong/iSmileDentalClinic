import { Helmet } from 'react-helmet-async';
import { useBooking } from '../../context/BookingContext';
import React, { useEffect } from 'react';
import { Shield, CheckCircle, HelpCircle, Users } from 'lucide-react';
import Button from '../../components/Button';
import { specialtyFor, fillStats } from '../../data/serviceSeo';
import reviewStats from '../../data/review-stats.json';

const MyofunctionalOrthodontics = () => {
    const { openBooking } = useBooking();
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
            "url": "https://ismile.com.my/services/children"
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

    return (
        <div className="specialty-page">
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href={seo.canonical} />
            </Helmet>

            <div className="tech-hero">
                <div className="container">
                    <div className="tech-badge"><Shield size={16} /> Technical Deep-Dive</div>
                    <h1>Myofunctional Orthodontics <span className="h1-sub">Petaling Jaya | iSmile Dental Clinic</span></h1>
                    <p className="lead">Myofunctional orthodontics addresses the root causes of jaw underdevelopment and crowding by correcting muscle patterns, breathing habits, and oral posture. At iSmile, we use removable functional braces worn mostly at night that gently guide jaw development and habit correction.</p>
                </div>
            </div>

            <section className="science-section section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-info">
                            <h2>The Science & Tech</h2>
                            <p>Instead of just moving teeth after they have gone off course, myofunctional orthodontics works upstream to address why the bite problem developed in the first place.</p>

                            <div className="tech-feature-list">

                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Muscle Retraining</h4>
                                        <p>Uses specialized appliances to train the tongue to rest on the roof of the mouth, establish proper lip seal, and correct swallowing patterns.</p>
                                    </div>
                                </div>
                                <div className="tech-feature">
                                    <div className="feature-icon"><CheckCircle size={20} /></div>
                                    <div className="feature-text">
                                        <h4>Airway & Breathing Health</h4>
                                        <p>Focuses on establishing nasal breathing, which is important for proper facial growth and may help with sleep quality. We screen for mouth breathing patterns at every assessment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-meta glass-panel">
                            <h3>Clinical Workflow</h3>
                            <ul className="step-list">
                                <li><span>01</span> Thorough Assessment of medical, birth and child developmental history</li>
                                <li><span>02</span> Oral Myofunctional Assessment</li>
                                <li><span>03</span> Airway & Sleep Screening</li>
                                <li>
                                    <span>04</span>
                                    <div>
                                        Customized Appliance Selection
                                        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>
                                            e.g. Expanders, Mandibular Advancers, Maxillary Protractor, Munchees, Myofunctional Appliances ie LM Activator, Braces, Clear Aligners
                                        </div>
                                    </div>
                                </li>
                                <li><span>05</span> Monthly Muscle Exercise Programs</li>
                                <li><span>06</span> Progress Tracking & Growth Monitoring</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="patient-stories-section section-padding" style={{ background: '#f0f4f8' }}>
                <div className="container">
                    <h2 className="text-center mb-5" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}><Users size={32} /> What Parents Often Notice During Treatment</h2>
                    
                    <div className="story-grid">
                        <div className="story-card glass-panel">
                            <div className="story-number">01</div>
                            <h4>The First Few Weeks</h4>
                            <p>Most children adapt to wearing a removable appliance at night within the first couple of weeks. It is common for parents to notice their child settling into the routine quickly, much like getting used to wearing a retainer. The appliance becomes part of the bedtime routine, and most children take to it naturally.</p>
                            <p className="story-note">Families often describe the first stage as a period of awareness and adjustment before the routine starts to feel more familiar.</p>
                        </div>

                        <div className="story-card glass-panel">
                            <div className="story-number">02</div>
                            <h4>Changes Parents Spot First</h4>
                            <p>The earliest changes are often visible in everyday moments. A child may become more aware of keeping their lips closed at rest, where their tongue sits, or how they swallow. Parents sometimes notice these small habit changes first, because they see their child in relaxed, natural settings every day.</p>
                            <p className="story-note">If mouth breathing, snoring, or nasal blockage continues, the child may also need airway or medical evaluation alongside dental care.</p>
                        </div>

                        <div className="story-card glass-panel">
                            <div className="story-number">03</div>
                            <h4>Progress Over Time</h4>
                            <p>As oral muscles and daily habits improve, changes may become more noticeable. Some children show better oral posture, more comfortable lip closure, or dental development that is easier to monitor as they grow. Speech clarity may improve in some cases, depending on the underlying cause.</p>
                            <p className="story-note">The pace varies from child to child. Some show early improvements in awareness and posture, while lasting habit changes usually take several months or longer. Follow-up appointments help track what is happening and adjust the approach as needed.</p>
                        </div>

                        <div className="story-card glass-panel">
                            <div className="story-number">04</div>
                            <h4>The Role of Consistency</h4>
                            <p>Progress depends heavily on consistency. Children who wear their appliance as instructed and practise the recommended exercises regularly are more likely to build lasting habits. Parents play a key role here by helping their child keep the routine going.</p>
                            <p className="story-note">Most families find that the routine becomes automatic after a few weeks. What felt like an effort at first becomes something the child does without thinking.</p>
                        </div>
                    </div>

                    <p className="story-footer text-center mt-4" style={{ maxWidth: '700px', margin: '30px auto 0', opacity: 0.8 }}>
                        Every child's journey is different. Some adapt quickly, others take more time. The most important factor is consistency — showing up, wearing the appliance, and doing the exercises as recommended.
                    </p>
                </div>
            </section>

            <section className="how-it-fits-section section-padding" style={{ background: 'white' }}>
                <div className="container">
                    <h2 className="text-center mb-5">How Myofunctional Orthodontics Fits Into Your Child's Care</h2>
                    
                    <div className="fits-grid">
                        <div className="fits-item">
                            <h4>As a standalone approach</h4>
                            <p>For some children, myofunctional orthodontics may be recommended as an early standalone approach. The appliance and exercises are used to support healthier oral posture, muscle function, and dental development. This is most suitable when concerns are identified early and the child has good growth potential.</p>
                        </div>
                        <div className="fits-item">
                            <h4>As a first phase</h4>
                            <p>In other cases, myofunctional treatment is the first phase of a longer orthodontic journey. The aim is to improve the conditions for teeth and jaws to develop, so that if braces or aligners are needed later, the orthodontic plan can be built on a stronger functional foundation.</p>
                        </div>
                        <div className="fits-item">
                            <h4>Alongside other children's dental care</h4>
                            <p>Myofunctional orthodontics works alongside regular paediatric dentistry. Routine check-ups, cleanings, and preventive care continue as normal. The myofunctional approach fits into the broader picture of your child's dental health without disrupting other care.</p>
                        </div>
                        <div className="fits-item">
                            <h4>Addressing habits, not just teeth</h4>
                            <p>A key feature of this approach is that it looks at underlying habits such as mouth breathing, tongue thrust, and swallow patterns rather than focusing only on tooth position. Myofunctional therapy is often used alongside orthodontic care to support stability and long-term results.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-section section-padding" style={{ background: '#f8f9fa' }}>
                <div className="container">
                    <h2 className="text-center mb-5" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}><HelpCircle size={32} /> Common Questions</h2>
                    <div className="faq-grid">
                        {faqs.map((faq, i) => (
                            <div key={i} className="faq-item glass-panel">
                                <h4>{faq.q}</h4>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding text-center">
                <div className="container">
                    <h2>Consult with our specialists today</h2>
                    <p className="mb-4">Get a professional assessment based on your unique dental structure.</p>
                    <Button onClick={() => openBooking('Interested in  Myofunctional Orthodontics', 'specialty-myofunctional')}>Book Consultation</Button>
                </div>
            </section>

            <style>{`
                .specialty-page { padding-top: 100px; }
                .tech-hero { padding: 80px 0; background: #1a1a1a; color: white; text-align: left; }
                .tech-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: var(--color-secondary); }
                .tech-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color: white; }
                .tech-hero h1 span { font-weight: 400; opacity: 0.6; font-size: 2rem; display: block; }
                .tech-hero .lead { font-size: 1.3rem; max-width: 800px; opacity: 0.9; }
                .tech-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 60px; align-items: start; }
                .tech-feature-list { margin-top: 40px; }
                .tech-feature { display: flex; gap: 20px; margin-bottom: 30px; }
                .feature-icon { color: var(--color-primary); margin-top: 4px; }
                .feature-text h4 { font-size: 1.25rem; margin-bottom: 8px; font-weight: 700; }
                .tech-meta { padding: 40px; background: white; border: 1px solid rgba(0,0,0,0.05); }
                .step-list { list-style: none; padding: 0; margin-top: 30px; }
                .step-list li { display: flex; align-items: center; gap: 20px; padding: 15px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .step-list li span { font-family: 'Space Grotesk', sans-serif; font-weight: 800; color: var(--color-primary); font-size: 1.2rem; opacity: 0.3; }
                .faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
                .faq-item { padding: 30px; background: white; }
                .faq-item h4 { margin-bottom: 15px; color: var(--color-primary); }
                .story-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px; margin-top: 40px; }
                .story-card { padding: 30px; background: white; border-radius: 20px; position: relative; }
                .story-card h4 { margin-bottom: 16px; color: var(--color-text-charcoal); }
                .story-card p { line-height: 1.65; }
                .story-number { font-family: 'Space Grotesk', sans-serif; font-weight: 800; color: var(--color-primary); font-size: 2rem; opacity: 0.3; margin-bottom: 10px; }
                .story-note { font-style: italic; opacity: 0.8; margin-top: 15px; border-left: 3px solid var(--color-primary); padding-left: 15px; font-size: 0.95rem; }
                .story-footer { font-size: 1.05rem; line-height: 1.6; }
                .fits-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px; margin-top: 40px; }
                .fits-item { padding: 30px; background: #f8f9fa; border-radius: 20px; }
                .fits-item h4 { margin-bottom: 12px; color: var(--color-primary); }
                .fits-item p { line-height: 1.65; }
                @media (max-width: 1024px) {
                    .specialty-page { padding-top: 80px; }
                    .tech-hero { padding: 60px 0; }
                    .tech-hero h1 { font-size: 2.2rem; line-height: 1.1; margin-bottom: 16px; }
                    .tech-hero h1 span { font-size: 1.25rem; margin-top: 4px; }
                    .tech-hero .lead { font-size: 1rem; line-height: 1.5; }
                    
                    .tech-grid { grid-template-columns: 1fr; gap: 40px; }
                    .tech-info h2 { font-size: 1.8rem; margin-bottom: 16px; }
                    .tech-feature-list { margin-top: 30px; }
                    .tech-feature { gap: 16px; margin-bottom: 24px; }
                    .feature-text h4 { font-size: 1.1rem; margin-bottom: 4px; }
                    .feature-text p { font-size: 0.95rem; line-height: 1.5; }
                    
                    .tech-meta { padding: 24px; border-radius: 20px; }
                    .tech-meta h3 { font-size: 1.3rem; }
                    .step-list li { padding: 12px 0; gap: 16px; font-size: 0.95rem; }
                    .step-list li span { font-size: 1rem; }
                    
                    .faq-grid { gap: 20px; margin-top: 30px; }
                    .faq-item { padding: 24px; border-radius: 20px; }
                    .faq-item h4 { font-size: 1.05rem; line-height: 1.4; }
                    .faq-item p { font-size: 0.95rem; line-height: 1.5; }
                    
                    .section-padding { padding: 40px 0; }
                }
                @media (max-width: 768px) {
                    .story-grid, .fits-grid { grid-template-columns: 1fr; gap: 20px; }
                    .story-card { padding: 24px; }
                    .fits-item { padding: 24px; }
                }
            `}</style>
        </div>
    );
};

export default MyofunctionalOrthodontics;
