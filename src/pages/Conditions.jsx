import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, Clock, Heart, Star, Shield, Layers, Smile, Sparkles, Users } from 'lucide-react';
import Button from '../components/Button';
import { useBooking } from '../context/BookingContext';
import { concernsData } from '../data/concernsData';

const getCategoryIcon = (slug) => {
    switch(slug) {
        case 'pain-infection': return <Shield size={28} />;
        case 'cavities-damage-wear': return <Layers size={28} />;
        case 'missing-loose-teeth': return <Smile size={28} />;
        case 'crooked-teeth-bite': return <Sparkles size={28} />;
        case 'smile-appearance': return <Star size={28} />;
        case 'children-oral-care': return <Users size={28} />;
        case 'elderly-ageing-care': return <Heart size={28} />;
        case 'preventive-routine': return <Clock size={28} />;
        default: return <Info size={28} />;
    }
};

const Conditions = () => {
    const { openBooking } = useBooking();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="conditions-page">
            <section className="conditions-hero section-padding">
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-700"
                    >
                        <h1 className="hero-title mb-6">Conditions & Concerns</h1>
                        <p className="lead-text">
                            Find the right care based on what you’re experiencing.<br />
                            Select a category below to see how we can help.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="conditions-grid-section mb-20 scroll-margin">
                <div className="container">
                    <div className="conditions-grid">
                        {Object.values(concernsData).map((category, index) => (
                            <Link to={`/concerns/${category.slug}`} key={category.slug} className="no-underline">
                                <motion.div
                                    className="concern-directory-box glass-panel"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <div className="box-icon-container mb-6 text-primary">
                                        {getCategoryIcon(category.slug)}
                                    </div>
                                    <h3 className="box-title mb-2">{category.title}</h3>
                                    <p className="box-desc text-gray-600 mb-6">{category.description}</p>
                                    <div className="box-footer flex items-center gap-2 font-bold text-primary">
                                        View Solutions <ArrowRight size={16} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                .conditions-page {
                    background: radial-gradient(circle at 0% 0%, var(--color-tint-blue) 0%, transparent 40%),
                                 radial-gradient(circle at 100% 100%, var(--color-pastel-blue) 0%, transparent 40%);
                    padding-top: 180px;
                    padding-bottom: 120px;
                }
                .hero-title {
                    font-size: clamp(3rem, 6vw, 5rem);
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: var(--color-primary);
                }
                .conditions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 30px;
                }
                .concern-directory-box {
                    padding: 40px;
                    height: 100%;
                    transition: all 0.4s ease;
                    border: 1px solid rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                }
                .concern-directory-box:hover {
                    transform: translateY(-8px);
                    border-color: var(--color-primary-teal);
                    box-shadow: 0 20px 40px rgba(79, 163, 194, 0.2);
                }
                .box-icon-container {
                    width: 60px;
                    height: 60px;
                    background: #f1f5f9;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-primary);
                }
                .box-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2d3748;
                }
                .box-desc {
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #4a5568;
                }
                @media (max-width: 1024px) {
                    .conditions-page {
                        padding-top: 120px;
                        padding-bottom: 80px;
                    }
                    .hero-title {
                        font-size: 2.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Conditions;
