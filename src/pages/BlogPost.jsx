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
            <div className="post-header-gradient" style={{
                background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%)',
                padding: '160px 0 80px',
                position: 'relative',
                marginTop: '0'
            }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <Reveal>
                        <span className="post-category" style={{
                            color: 'var(--color-primary)',
                            marginBottom: '20px',
                            display: 'inline-block',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>
                            {post.category}
                        </span>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="post-title-gradient" style={{
                            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                            fontWeight: 800,
                            margin: '10px 0',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            maxWidth: '1000px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            {post.title}
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p style={{
                            fontSize: '1.1rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: 500,
                            marginTop: '20px',
                            letterSpacing: '0.5px'
                        }}>{post.date}</p>
                    </Reveal>
                </div>
            </div>

            {/* Featured Image and Content Section */}
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', marginTop: '-60px', zIndex: 10 }}>
                <FadeIn>
                    {post.img && (
                        <div className="featured-image-wrapper">
                            <img
                                src={post.img}
                                alt={post.title}
                                className="featured-post-img"
                                loading="lazy"
                            />
                        </div>
                    )}
                </FadeIn>
            </div>

            <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
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
                            fontSize: '1rem',
                            fontWeight: 500,
                            transition: 'color 0.3s'
                        }}
                    >
                        <ArrowLeft size={20} /> Back to Learning Centre
                    </button>

                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                    <div className="post-footer" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Your Smile Deserves Thoughtful Care</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Schedule a consultation for a personalized assessment.</p>
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    // Clean up the title for the prefill text
                                    const cleanTopic = post.title.replace(/\?$/, '');
                                    let topic = cleanTopic;

                                    // Specific override for Clear Aligner complexity
                                    if (post.id === 'clear-aligner-treatment-complexity') {
                                        topic = 'clear aligner treatment';
                                    }

                                    openBooking(`Interested in ${topic}`, `blog-post-${post.id}`);
                                }}
                            >
                                Book a Consultation
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            </div>

            <style>{`
                .post-title-gradient {
                    background: linear-gradient(135deg, #1a202c 0%, var(--color-primary-teal) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .featured-image-wrapper {
                    border-radius: 24px; 
                    overflow: hidden; 
                    box-shadow: 0 30px 60px rgba(0,0,0,0.12);
                    background: white;
                }
                .featured-post-img {
                    width: 100%; 
                    height: auto; 
                    max-height: 550px; 
                    object-fit: cover;
                    display: block;
                    transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .featured-image-wrapper:hover .featured-post-img {
                    transform: scale(1.02);
                }
                .blog-content h3 {
                    font-size: 1.8rem;
                    color: var(--color-text-charcoal);
                    margin-top: 40px;
                    margin-bottom: 20px;
                    font-weight: 700;
                    line-height: 1.3;
                }
                .blog-content p {
                    font-size: 1.15rem;
                    line-height: 1.8;
                    color: #4a5568;
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
                    color: #4a5568;
                }
                .blog-content strong {
                    color: var(--color-text-charcoal);
                }
                
                @media (max-width: 1024px) {
                    .post-header-gradient { padding: 100px 0 60px; }
                    .post-title-gradient { font-size: 2.2rem; margin: 10px 0; }
                    .container { padding-left: 20px; padding-right: 20px; }
                    
                    .featured-image-wrapper { margin-top: -30px; border-radius: 20px; }
                    .featured-post-img { max-height: 250px; }
                    
                    .blog-content { padding-top: 20px; }
                    .blog-content h3 { font-size: 1.5rem; margin-top: 30px; }
                    .blog-content p { font-size: 1.05rem; line-height: 1.6; margin-bottom: 20px; }
                    .blog-content li { font-size: 1rem; }
                    
                    .post-footer { margin-top: 40px; padding-top: 30px; }
                    .post-footer h3 { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default BlogPost;
