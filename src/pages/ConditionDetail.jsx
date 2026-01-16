import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Info } from 'lucide-react';
import Button from '../components/Button';
import { useBooking } from '../context/BookingContext';
import { concernsData } from '../data/concernsData';

const serviceNameMapping = {
    "Protect & Repair": "protecting and repairing teeth",
    "Replace Teeth": "replacing teeth",
    "Straighten Teeth": "straightening teeth",
    "Enhance Smile": "enhancing your smile",
    "Children & Growth": "children's dental health and growth"
};

const ConditionDetail = () => {
    const { slug } = useParams();
    const { openBooking } = useBooking();
    const data = concernsData[slug];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!data) return <div className="container section-padding pt-40">Category not found</div>;

    return (
        <div className="condition-category-page">
            <section className="category-intro section-padding-small">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-800"
                    >
                        <h1 className="category-title mb-6">{data.title}</h1>
                        <p className="reassuring-text lead-text mb-0">
                            {data.intro}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="common-conditions section-padding">
                <div className="container">
                    <h2 className="section-subtitle mb-8">Common Conditions & Concerns</h2>
                    <div className="condition-box-grid">
                        {data.commonConditions.map((condition, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="condition-info-box glass-panel">
                                    <div className="condition-icon-wrapper">
                                        <Info size={18} />
                                    </div>
                                    <span className="condition-text">{condition}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="how-we-help section-padding">
                <div className="container">
                    <div className="how-we-help-card ">
                        <h2 className="help-title mb-10">How We Can Help</h2>
                        <div className="services-help-list">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {data.howWeHelp.map((service, index) => (
                                    <div key={index} className="service-help-item py-3">
                                        <h4 className="flex items-center gap-3 font-bold text-xl mb-0">
                                            <CheckCircle size={22} className="text-primary-teal" />
                                            {service.name}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="category-navigation section-padding-small">
                <div className="container text-center">
                    <div className="max-w-800 mx-auto">
                        {data.relatedCategories.map((cat, index) => (
                            <Link 
                                key={index} 
                                to={cat.path} 
                                className="next-step-link group"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <span className="next-step-text">
                                        Understand more about {serviceNameMapping[cat.name] || cat.name.toLowerCase()} and how we can help.
                                    </span>
                                    <div className="next-step-arrow-wrapper">
                                        <ArrowRight size={40} className="next-step-arrow" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bottom-cta pb-20">
                <div className="container text-center">
                    <Button onClick={() => openBooking(`Consultation for ${data.title}`)} size="lg">Schedule a Visit</Button>
                </div>
            </section>

            <style>{`
                .condition-category-page {
                    background: radial-gradient(circle at 0% 0%, var(--color-tint-blue) 0%, transparent 40%),
                                radial-gradient(circle at 100% 100%, var(--color-pastel-blue) 0%, transparent 40%);
                    background-attachment: fixed;
                    padding-top: 180px;
                    padding-bottom: 60px;
                    min-height: 100vh;
                }
                .category-title {
                    font-size: clamp(3rem, 6vw, 5rem);
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: var(--color-primary);
                }
                .section-subtitle {
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #718096;
                    font-weight: 700;
                }
                .condition-box-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                }
                .condition-info-box {
                    padding: 24px 30px;
                    height: 100%;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .condition-info-box:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(79, 163, 194, 0.2);
                    border-color: var(--color-primary-teal);
                }
                .condition-icon-wrapper {
                    width: 32px;
                    height: 32px;
                    background: var(--color-primary-teal);
                    color: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .condition-text {
                    font-weight: 700;
                    font-size: 1.15rem;
                    color: #2d3748;
                    line-height: 1.3;
                }
                .help-title {
                    font-size: 3rem;
                    font-weight: 800;
                    line-height: 1.1;
                    color: var(--color-primary);
                }
                .how-we-help-card {
                    background: white;
                    border-radius: 30px;
                    padding: 80px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.04);
                    border: 1px solid rgba(0,0,0,0.03);
                }
                @media (max-width: 768px) {
                    .how-we-help-card {
                        padding: 40px 24px;
                        border-radius: 24px;
                    }
                }
                .services-help-list {
                    background: transparent;
                }
                
                .next-step-link {
                    display: block;
                    text-decoration: none !important;
                    padding: 20px 0;
                }
                .next-step-text {
                    font-size: clamp(1.8rem, 4vw, 3rem);
                    font-weight: 800;
                    color: var(--color-primary);
                    line-height: 1.2;
                    transition: all 0.4s ease;
                }
                .next-step-link:hover .next-step-text {
                    color: var(--color-sky-blue);
                    transform: scale(1.02);
                }
                .next-step-arrow-wrapper {
                   color: var(--color-primary-teal);
                   transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .next-step-link:hover .next-step-arrow-wrapper {
                    transform: translateY(15px);
                }
                .next-step-arrow {
                    stroke-width: 2.5;
                }

                .bg-light {
                    background: transparent;
                }
                .section-padding-small {
                    padding: 40px 0;
                }
                .pb-20 {
                    padding-bottom: 80px;
                }
                @media (max-width: 1024px) {
                    .condition-category-page {
                        padding-top: 120px;
                        padding-bottom: 40px;
                    }
                    .category-title {
                        font-size: 2.5rem !important;
                    }
                    .condition-box-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .condition-info-box {
                        padding: 20px 24px;
                    }
                }
                @media (max-width: 768px) {
                    .help-title { font-size: 2.2rem; }
                    .next-step-text { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default ConditionDetail;
