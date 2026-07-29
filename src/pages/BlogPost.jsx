import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Reveal, FadeIn } from '../components/Reveal';
import Button from '../components/Button';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import blogIndex from '../data/blog-index.json';
import ResponsiveImage from '../components/ResponsiveImage';
import { relatedServices } from '../data/blogServiceLinks';

const SITE_URL = 'https://ismile.com.my';

const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

/**
 * One collapsible blog FAQ entry.
 *
 * The answer is ALWAYS in the DOM — collapsing is done with max-height/opacity,
 * never by unmounting. Search and LLM crawlers therefore still read every answer
 * (and the FAQPage JSON-LD keeps matching the visible text), while patients get a
 * scannable list of questions instead of a wall of copy.
 */
const FaqItem = ({ item, index, slug }) => {
    const [open, setOpen] = useState(false);
    const answerId = `faq-a-${slug || 'post'}-${index}`;

    return (
        <div style={{ marginBottom: '16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)', overflow: 'hidden' }}>
            <h4 style={{ margin: 0 }}>
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    aria-expanded={open}
                    aria-controls={answerId}
                    data-analytics-click="blog-faq-toggle"
                    data-analytics-label={item.q}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                        width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                        font: 'inherit', textAlign: 'left', cursor: 'pointer',
                        color: 'var(--color-primary)', fontWeight: '600'
                    }}
                >
                    <span>{item.q}</span>
                    <ChevronDown
                        size={20}
                        aria-hidden="true"
                        style={{ flexShrink: 0, transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'none' }}
                    />
                </button>
            </h4>
            <div
                id={answerId}
                style={{
                    display: 'grid',
                    gridTemplateRows: open ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.25s ease',
                }}
            >
                <div style={{ overflow: 'hidden' }}>
                    <p style={{ margin: 0, padding: '0 20px 18px', color: 'var(--color-text)', lineHeight: '1.7' }}>{item.a}</p>
                </div>
            </div>
        </div>
    );
};

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { openBooking } = useBooking();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setNotFound(false);

        fetch(`/blog-content/${slug}.json`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(() => {
                setNotFound(true);
                setLoading(false);
            });
    }, [slug]);

    // Compute related posts: same category first, then fill with recent posts
    const relatedPosts = useMemo(() => {
        if (!post) return [];
        const eligiblePosts = blogIndex.filter(p => p.content_type === 'educational');
        const activeCats = post.categories && post.categories.length > 0 ? post.categories : (post.category ? [post.category] : []);
        const sameCat = eligiblePosts.filter(p => {
            if (p.slug === slug) return false;
            const pCats = p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []);
            return pCats.some(c => activeCats.includes(c));
        }).sort((a, b) => {
            const aCats = a.categories && a.categories.length > 0 ? a.categories : (a.category ? [a.category] : []);
            const bCats = b.categories && b.categories.length > 0 ? b.categories : (b.category ? [b.category] : []);
            const aOverlap = aCats.filter(c => activeCats.includes(c)).length;
            const bOverlap = bCats.filter(c => activeCats.includes(c)).length;
            return bOverlap - aOverlap;
        });
        const others = eligiblePosts.filter(p => {
            if (p.slug === slug) return false;
            const pCats = p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []);
            return !pCats.some(c => activeCats.includes(c));
        });
        const combined = [...sameCat, ...others];
        return combined.slice(0, 3);
    }, [post, slug]);

    if (notFound) return <Navigate to="/blog" replace />;

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e0e0e0',
                borderTopColor: 'var(--color-primary-teal)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const canonicalUrl = post.canonical_url || `${SITE_URL}/blog/${slug}`;
    const ogImage = post.img?.startsWith('http') ? post.img : `${SITE_URL}${post.img}`;

    return (
        <div className="blog-post-page">
            <Helmet>
                <title>{post.title} | iSmile Dental Clinic</title>
                <meta name="description" content={post.excerpt} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:site_name" content="iSmile Dental Clinic" />
                <meta property="article:published_time" content={post.date} />
                <meta property="article:section" content={post.categories ? post.categories.join(", ") : post.category} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:image" content={ogImage} />

                {/* Article JSON-LD */}
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": post.title,
                    "description": post.excerpt,
                    "image": ogImage,
                    "datePublished": post.date,
                    "dateModified": post.date,
                    "author": {
                        "@type": "Organization",
                        "name": "iSmile Dental Clinic",
                        "url": SITE_URL
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "iSmile Dental Clinic",
                        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` }
                    },
                    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
                    "articleSection": post.categories ? post.categories.join(", ") : post.category
                })}</script>
                {post.faq && post.faq.length > 0 && (
                  <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": post.faq.map(f => ({
                      "@type": "Question",
                      "name": f.q,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f.a
                      }
                    }))
                  })}</script>
                )}
            </Helmet>

            {/* Hero Section */}
            <div className="post-header-gradient" style={{
                background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%)',
                padding: '160px 0 80px',
                position: 'relative',
                marginTop: '0'
            }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <Reveal>
                        <div className="post-tags-container" style={{
                            marginBottom: '20px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            justifyContent: 'center'
                        }}>
                            {post.tags && post.tags.map((tag, idx) => (
                                <Link 
                                  key={`tag-${idx}`}
                                  to={`/blog?category=${encodeURIComponent(tag)}`}
                                  className="post-tag" 
                                  style={{
                                    color: 'var(--color-primary)',
                                    fontSize: '0.54rem', /* Increased by 20% from 0.45rem */
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    background: 'rgba(79, 163, 194, 0.1)',
                                    border: '1px solid rgba(79, 163, 194, 0.2)',
                                    borderRadius: '12px',
                                    padding: '3px 10px', /* Slightly increased padding for better proportion */
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(79, 163, 194, 0.2)';
                                    e.target.style.borderColor = 'var(--color-primary)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(79, 163, 194, 0.1)';
                                    e.target.style.borderColor = 'rgba(79, 163, 194, 0.2)';
                                  }}
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
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
                        }}>{formatDate(post.date)}</p>
                    </Reveal>
                </div>
            </div>

            {/* Featured Image and Content Section */}
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', marginTop: '-60px', zIndex: 10 }}>
                <FadeIn>
                    {post.img && (
                        <div className="featured-image-wrapper">
                            <ResponsiveImage
                                src={post.img}
                                alt={post.title}
                                className="featured-post-img"
                                loading="lazy"
                                sizes="(max-width: 900px) 100vw, 900px"
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

                    {/* Pre-FAQ CTA */}
                    <div className="pre-faq-cta" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', fontWeight: 700 }}>
                            {(() => {
                                const tag = post.tags && post.tags.length > 0 ? post.tags[0] : (post.categories && post.categories[0]) || '';
                                return tag ? `Have Questions About ${tag}?` : 'Have Questions for Our Dentists?';
                            })()}
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                            Our dentists are here to help — schedule a consultation for personalised advice.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => {
                                const cleanTopic = post.title.replace(/\?$/, '');
                                let topic = cleanTopic;

                                if (post.slug === 'clear-aligner-treatment-complexity') {
                                    topic = 'clear aligner treatment';
                                }

                                openBooking(`Interested in ${topic}`, `blog-post-${post.slug}`);
                            }}
                        >
                            Book a Consultation
                        </Button>
                    </div>

                    {/* Internal links to the treatment pages this post relates to.
                        The audit found service pages had no inbound links from the blog. */}
                    {relatedServices(post.categories).length > 0 && (
                      <div className="post-related-services" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Related treatments</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {relatedServices(post.categories).map((svc) => (
                            <li key={svc.path}>
                              <Link
                                to={svc.path}
                                data-analytics-click="blog-related-service"
                                data-analytics-label={svc.label}
                                style={{ display: 'inline-block', padding: '10px 18px', background: '#f8fafc', borderRadius: '999px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
                              >
                                {svc.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {post.faq && post.faq.length > 0 && (
                      <div className="post-faq-section" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '30px', textAlign: 'center', fontSize: '2rem' }}>Frequently Asked Questions</h3>
                        <div style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
                          {post.faq.map((item, idx) => (
                            <FaqItem key={idx} item={item} index={idx} slug={post.slug} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="post-footer" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Your Smile Deserves Thoughtful Care</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Schedule a consultation for a personalized assessment.</p>
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    const cleanTopic = post.title.replace(/\?$/, '');
                                    let topic = cleanTopic;

                                    if (post.slug === 'clear-aligner-treatment-complexity') {
                                        topic = 'clear aligner treatment';
                                    }

                                    openBooking(`Interested in ${topic}`, `blog-post-${post.slug}`);
                                }}
                            >
                                Book a Consultation
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
                <div className="related-posts-section">
                    <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <FadeIn>
                            <h2 className="related-posts-title">You May Also Like</h2>
                            <div className="related-posts-grid">
                                {relatedPosts.map((rp) => (
                                    <Link to={`/blog/${rp.slug}`} key={rp.slug} className="related-post-card">
                                        <div className="related-post-image">
                                            <ResponsiveImage src={rp.img} alt={rp.title} loading="lazy" sizes="(max-width: 768px) 100vw, 340px" />
                                        </div>
                                        <div className="related-post-content">
                                            <span className="related-post-cat">{rp.tags && rp.tags.length > 0 ? rp.tags[0] : (rp.categories && rp.categories[0]) || rp.category}</span>
                                            <h4>{rp.title}</h4>
                                            <span className="related-post-date">{formatDate(rp.date)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            )}

            <style>{`
                .post-title-gradient {
                    background: linear-gradient(135deg, #1a202c 0%, var(--color-primary-teal) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .featured-image-wrapper picture {
                    display: block;
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
                .blog-content a {
                    color: var(--color-primary);
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .blog-content a:hover {
                    color: var(--color-primary-teal);
                }

                /* Related Posts Section */
                .related-posts-section {
                    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 30%, #f0f7ff 100%);
                    padding: 60px 20px 80px;
                    margin-top: 20px;
                }

                .related-posts-title {
                    text-align: center;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--color-text-charcoal);
                    margin-bottom: 40px;
                    letter-spacing: -0.01em;
                }

                .related-posts-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }

                .related-post-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    text-decoration: none;
                    color: inherit;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .related-post-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
                }

                .related-post-image {
                    height: 180px;
                    overflow: hidden;
                }

                .related-post-image picture {
                    display: block;
                    width: 100%;
                    height: 100%;
                }

                .related-post-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .related-post-card:hover .related-post-image img {
                    transform: scale(1.06);
                }

                .related-post-content {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .related-post-cat {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: var(--color-primary);
                    letter-spacing: 1px;
                }

                .related-post-content h4 {
                    font-size: 1.05rem;
                    font-weight: 600;
                    line-height: 1.4;
                    margin: 8px 0 12px;
                    color: var(--color-text-charcoal);
                }

                .related-post-date {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    margin-top: auto;
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

                    /* Related posts mobile */
                    .related-posts-section { padding: 40px 16px 60px; }
                    .related-posts-title { font-size: 1.4rem; margin-bottom: 24px; }
                    .related-posts-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .related-post-card {
                        flex-direction: row;
                        border-radius: 16px;
                    }
                    .related-post-image {
                        width: 120px;
                        min-width: 120px;
                        height: auto;
                    }
                    .related-post-content {
                        padding: 14px 16px;
                    }
                    .related-post-content h4 {
                        font-size: 0.95rem;
                        margin: 4px 0 8px;
                    }
                }
            `}</style>
        </div>
    );
};

export default BlogPost;
