import React, { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { Reveal, FadeIn } from '../components/Reveal';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { openBooking } = useBooking();
    
    // Find the post by id matching the slug
    const post = blogPosts.find(p => p.id === slug);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="blog-post-page">
            {/* Hero Section */}
            <div className="post-hero" style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(\${post.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 35%', // Shifted down slightly to show faces better
                height: '60vh',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginTop: '0',
                paddingTop: '120px'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
                    <Reveal>
                        <span className="post-category badge" style={{ color: 'white', marginBottom: '20px', display: 'inline-block', fontSize: '1rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            {post.category}
                        </span>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 700, margin: '10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.3)', color: 'white' }}>
                            {post.title}
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{post.date}</p>
                    </Reveal>
                </div>
            </div>

            {/* Content Section */}
            <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <FadeIn>
                    <button 
                        onClick={() => navigate('/blog')}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            marginBottom: '40px',
                            fontSize: '1rem'
                        }}
                    >
                        <ArrowLeft size={20} /> Back to Blog
                    </button>
                    
                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                    
                    <div className="post-footer" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Ready to prioritize your smile?</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Schedule a consultation for a personalized assessment.</p>
                        <div style={{ marginTop: '20px' }}>
                             <Button 
                                variant="primary" 
                                onClick={() => {
                                    // Clean up the title for the prefill text
                                    const cleanTopic = post.title.replace(/\?$/, '');
                                    let topic = cleanTopic;

                                    // Specific override for Invisalign complexity as requested
                                    if (post.id === 'invisalign-treatment-complexity') {
                                        topic = 'Invisalign treatment';
                                    }

                                    openBooking(`Interested in ${topic}`);
                                }}
                            >
                                Book a Consultation
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            </div>

            <style>{`
                .blog-content h3 {
                    font-size: 1.8rem;
                    color: var(--color-text);
                    margin-top: 40px;
                    margin-bottom: 20px;
                    font-weight: 700;
                }
                .blog-content p {
                    font-size: 1.15rem;
                    line-height: 1.8;
                    color: var(--color-text-light);
                    margin-bottom: 25px;
                }
                .blog-content .blog-image-wrapper {
                    margin: 40px 0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }
                .blog-content .blog-image-wrapper img {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                .blog-content .image-caption {
                    padding: 15px;
                    background: #f9f9f9;
                    margin-bottom: 0;
                    font-size: 0.95rem;
                    color: var(--color-text-muted);
                    text-align: center;
                    font-style: italic;
                    border-top: 1px solid #eee;
                }
                .blog-content ul {
                    margin-bottom: 25px;
                    padding-left: 20px;
                }
                .blog-content li {
                    margin-bottom: 12px;
                    line-height: 1.6;
                    font-size: 1.1rem;
                    color: var(--color-text-light);
                }
                .blog-content strong {
                    color: var(--color-text);
                }
            `}</style>
        </div>
    );
};

export default BlogPost;
