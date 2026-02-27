import { Helmet } from 'react-helmet-async';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import blogIndex from '../data/blog-index.json';

const POSTS_PER_PAGE = 12;

const formatDate = (isoDate) => {
    return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

const Blog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    // Featured post: first post with featured: true, fallback to first post
    const featuredPost = blogIndex.find(p => p.featured) || blogIndex[0];
    // Grid posts: everything except the featured post
    const otherPosts = blogIndex.filter(p => p.slug !== featuredPost?.slug);

    // Pagination
    const totalPages = Math.ceil(otherPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = otherPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const goToPage = (page) => {
        setSearchParams(page === 1 ? {} : { page: String(page) });
        window.scrollTo(0, 0);
    };

    return (
        <div className="blog-page">
            <Helmet>
                <title>Dental Learning Centre | iSmile Dental Clinic Petaling Jaya</title>
                <meta name="description" content="Dental health tips & advice from iSmile Dental Clinic Petaling Jaya. Learn about oral care & dental treatments." />
                <link rel="canonical" href={`https://ismile.com.my/blog${currentPage > 1 ? `?page=${currentPage}` : ''}`} />
            </Helmet>
            <div className="blog-hero-gradient" style={{
                background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%)',
                paddingTop: '180px',
                paddingBottom: '80px',
                textAlign: 'center'
            }}>
                <div className="container">
                    <Reveal width="100%"><h1 className="hero-title" style={{
                        fontSize: "clamp(2.5rem, 5vw, 4rem)",
                        fontWeight: 800,
                        color: 'var(--color-text-charcoal)',
                        letterSpacing: '-0.02em'
                    }}>Learning <span className="text-gradient">Centre</span></h1></Reveal>
                    <Reveal delay={0.2} width="100%"><p className="hero-subtitle" style={{
                        fontSize: '1.2rem',
                        color: 'var(--color-text-muted)',
                        maxWidth: '800px',
                        margin: '25px auto 0',
                        lineHeight: '1.6',
                        fontWeight: 500
                    }}>
                        Welcome to our learning space—where we share our heart for dental education and empower you with the knowledge to care for your lifelong smile.
                    </p></Reveal>
                </div>
            </div>

            <div className="container section-padding">
                {/* Featured */}
                {featuredPost && (
                    <FadeIn className="glass-panel featured-post">
                        <div className="featured-content">
                            <span className="badge">Featured</span>
                            <h2>{featuredPost.title}</h2>
                            <p>{featuredPost.excerpt}</p>
                            <Link to={`/blog/${featuredPost.slug}`}>
                                <Button variant="outline">Read Article</Button>
                            </Link>
                        </div>
                        <div className="featured-image">
                            <img src={featuredPost.img} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </FadeIn>
                )}

                {/* Grid */}
                <div className="posts-grid" style={{ marginTop: '80px' }}>
                    {paginatedPosts.map((post) => (
                        <Link to={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <FadeIn className="glass-panel post-card">
                                <div className="post-image">
                                    <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="post-content">
                                    <span className="post-cat">{post.category}</span>
                                    <h3>{post.title}</h3>
                                    <div className="post-meta">{formatDate(post.date)}</div>
                                </div>
                            </FadeIn>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '50px', marginBottom: '20px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: page === currentPage ? 'var(--color-primary-teal)' : 'rgba(255,255,255,0.8)',
                                    color: page === currentPage ? 'white' : 'var(--color-text-charcoal)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    boxShadow: page === currentPage ? '0 4px 12px rgba(79,163,194,0.3)' : '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
          .search-bar {
              display: flex;
              align-items: center;
              gap: 15px;
              max-width: 500px;
              margin: 0 auto;
              padding: 10px 15px;
              border-radius: 50px;
              background: rgba(255,255,255,0.8);
          }

          .featured-post {
              display: grid;
              grid-template-columns: 1fr 1fr;
              overflow: hidden;
              padding: 0;
              min-height: 350px;
              border-radius: 24px;
          }

          .featured-content {
              padding: 40px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
          }

          .featured-image {
              height: 100%;
          }

          .posts-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 30px;
          }

          .post-card {
              padding: 0;
              overflow: hidden;
              transition: transform 0.3s;
              cursor: pointer;
              height: 100%;
              border-radius: 24px;
          }

          .post-card:hover {
              transform: translateY(-5px);
          }

          .post-image {
              height: 200px;
          }

          .post-content {
              padding: 24px;
          }

          .post-cat {
              font-size: 0.8rem;
              color: var(--color-primary);
              font-weight: 600;
              text-transform: uppercase;
          }

          .post-content h3 {
             margin: 10px 0;
             font-size: 1.25rem;
             line-height: 1.4;
          }

          .post-meta {
              font-size: 0.85rem;
              color: var(--color-text-muted);
              margin-top: 10px;
          }

          @media (max-width: 1024px) {
              .featured-post {
                  grid-template-columns: 1fr;
                  border-radius: 20px;
                  min-height: auto;
                  margin-left: 8px;
                  margin-right: 8px;
                  width: auto;
              }
              .featured-image {
                  height: 200px;
                  order: -1;
              }
              .featured-content { padding: 24px; }
              .featured-content h2 { font-size: 1.5rem; }

              .posts-grid {
                  grid-template-columns: 1fr;
                  gap: 20px;
                  margin-top: 40px;
              }
              .post-card {
                  border-radius: 20px;
                  margin-left: 8px;
                  margin-right: 8px;
                  width: auto;
              }

              .blog-hero-gradient { padding-top: 120px; padding-bottom: 60px; }
              .hero-title { font-size: 2.5rem; }
              .hero-subtitle { font-size: 1rem; margin-top: 15px; }
          }
       `}</style>
        </div>
    );
};

export default Blog;
