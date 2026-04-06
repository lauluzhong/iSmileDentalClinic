import { Helmet } from 'react-helmet-async';
import React, { useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import blogIndex from '../data/blog-index.json';
const educationalPosts = blogIndex.filter(post => post.content_type === 'educational');

const POSTS_PER_PAGE = 12;

const formatDate = (isoDate) => {
    return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

const Blog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const activeCategory = searchParams.get('category') || 'All';
    const filterRef = useRef(null);

    // MECE Tag List (12 tags)
    const MECE_TAGS = [
        'Pediatric Dentistry',
        'Orthodontics',
        'Myofunctional Orthodontics',
        'Clear Aligners',
        'Traditional Braces',
        'Cosmetic Dentistry',
        'Restorative Dentistry',
        'Oral Surgery',
        'Oral Health',
        'Preventive Care',
        'Emergency Dental',
        'Dental Technology'
    ];

    // Extract unique categories with counts from tags
    const categories = useMemo(() => {
        const counts = {};
        educationalPosts.forEach(p => {
            // Use tags if available, otherwise fall back to categories
            const tags = p.tags && p.tags.length > 0 ? p.tags : 
                        (p.categories && p.categories.length > 0 ? p.categories : 
                        (p.category ? [p.category] : []));
            
            tags.forEach(tag => {
                // Only count tags that are in our MECE list
                if (MECE_TAGS.includes(tag)) {
                    counts[tag] = (counts[tag] || 0) + 1;
                }
            });
        });
        
        // Sort by count, then alphabetically
        return Object.entries(counts)
            .sort((a, b) => {
                if (b[1] !== a[1]) return b[1] - a[1]; // Sort by count first
                return a[0].localeCompare(b[0]); // Then alphabetically
            })
            .map(([name, count]) => ({ name, count }));
    }, []);

    // Featured post: first post with featured: true, fallback to first post
    const featuredPost = educationalPosts.find(p => p.featured) || educationalPosts[0];

    // Grid posts: everything except the featured post, filtered by category
    // When "All": exclude featured post from grid (it's shown separately)
    // When filtering: include ALL posts (featured post not shown separately)
    const otherPosts = useMemo(() => {
        if (activeCategory === 'All') {
            return educationalPosts.filter(p => p.slug !== featuredPost?.slug);
        }
        return educationalPosts.filter(p => {
            // Use tags for filtering (primary), fall back to categories
            const tags = p.tags && p.tags.length > 0 ? p.tags : 
                        (p.categories && p.categories.length > 0 ? p.categories : 
                        (p.category ? [p.category] : []));
            return tags.includes(activeCategory);
        });
    }, [activeCategory, featuredPost]);

    // Pagination
    const totalPages = Math.ceil(otherPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = otherPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const goToPage = (page) => {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (page > 1) params.page = String(page);
        setSearchParams(params);
        window.scrollTo(0, 0);
    };

    const setCategory = (cat) => {
        const params = {};
        if (cat !== 'All') params.category = cat;
        setSearchParams(params);

        if (filterRef.current) {
            const pill = filterRef.current.querySelector(`[data-cat="${cat}"]`);
            if (pill) {
                pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    };

    useEffect(() => {
        if (filterRef.current) {
            const pill = filterRef.current.querySelector(`[data-cat="${activeCategory}"]`);
            if (pill) {
                pill.scrollIntoView({ inline: 'center', block: 'nearest' });
            }
        }
    }, [activeCategory]);

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
                {/* Category Filter Bar */}
                <nav className="category-filter-bar" ref={filterRef} aria-label="Filter by topic">
                    <button
                        className={`category-pill${activeCategory === 'All' ? ' active' : ''}`}
                        onClick={() => setCategory('All')}
                        data-cat="All"
                    >
                        All
                        <span className="pill-count">{educationalPosts.length}</span>
                    </button>
                    {categories.map(({ name, count }) => (
                        <button
                            key={name}
                            className={`category-pill${activeCategory === name ? ' active' : ''}`}
                            onClick={() => setCategory(name)}
                            data-cat={name}
                        >
                            {name}
                            <span className="pill-count">{count}</span>
                        </button>
                    ))}
                </nav>

                {/* Featured — only show on "All" view */}
                {featuredPost && activeCategory === 'All' && (
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
                <div className="posts-grid" style={{ marginTop: '50px' }}>
                    {paginatedPosts.length > 0 ? (
                        paginatedPosts.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <FadeIn className="glass-panel post-card">
                                    <div className="post-image">
                                        <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="post-content">
                                        <div className="post-tags">
                                            {post.tags && post.tags.map((tag, idx) => (
                                                <button 
                                                    key={`tag-${idx}`}
                                                    className="post-tag"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setCategory(tag);
                                                    }}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                        <h3>{post.title}</h3>
                                        <div className="post-meta">{formatDate(post.date)}</div>
                                    </div>
                                </FadeIn>
                            </Link>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                                No other posts in this category yet. Check back soon!
                            </p>
                        </div>
                    )}
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
          /* Category Filter Bar */
          .category-filter-bar {
              display: flex;
              gap: 10px;
              padding: 6px 0 20px;
              margin-bottom: 30px;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              -ms-overflow-style: none;
              scroll-behavior: smooth;
              position: relative;
          }

          .category-filter-bar::-webkit-scrollbar {
              display: none;
          }

          .category-pill {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 10px 20px;
              border-radius: 50px;
              border: 1.5px solid #e2e8f0;
              background: rgba(255, 255, 255, 0.85);
              color: var(--color-text-charcoal);
              font-size: 0.9rem;
              font-weight: 600;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.25s ease;
              flex-shrink: 0;
              backdrop-filter: blur(8px);
          }

          .category-pill:hover {
              border-color: var(--color-primary-teal);
              color: var(--color-primary-teal);
              box-shadow: 0 2px 12px rgba(79, 163, 194, 0.15);
          }

          .category-pill.active {
              background: var(--color-primary-teal);
              color: white;
              border-color: var(--color-primary-teal);
              box-shadow: 0 4px 16px rgba(79, 163, 194, 0.3);
          }

          .category-pill.active .pill-count {
              background: rgba(255, 255, 255, 0.25);
              color: white;
          }

          .pill-count {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-width: 22px;
              height: 22px;
              padding: 0 6px;
              border-radius: 50px;
              background: #f1f5f9;
              color: var(--color-text-muted);
              font-size: 0.75rem;
              font-weight: 700;
              line-height: 1;
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
              grid-template-columns: repeat(3, 1fr);
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

          .post-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-bottom: 8px;
          }

          .post-tag {
              font-size: 0.54rem; /* Increased by 20% from 0.45rem */
              color: var(--color-primary);
              font-weight: 500;
              text-transform: uppercase;
              background: rgba(79, 163, 194, 0.1);
              border: 1px solid rgba(79, 163, 194, 0.2);
              border-radius: 12px;
              padding: 3px 10px; /* Slightly increased padding for better proportion */
              cursor: pointer;
              transition: all 0.2s;
              white-space: nowrap;
          }

          .post-tag:hover {
              background: rgba(79, 163, 194, 0.2);
              border-color: var(--color-primary);
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
              .category-filter-bar {
                  padding: 6px 8px 16px;
                  margin-bottom: 20px;
                  mask-image: linear-gradient(to right, transparent 0, black 8px, black calc(100% - 30px), transparent 100%);
                  -webkit-mask-image: linear-gradient(to right, transparent 0, black 8px, black calc(100% - 30px), transparent 100%);
              }

              .category-pill {
                  padding: 8px 16px;
                  font-size: 0.85rem;
              }

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
                  margin-top: 30px !important;
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
