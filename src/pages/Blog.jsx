import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import { blogPosts as posts } from '../data/blogPosts';

const Blog = () => {
    // Determine Featured Post
    const featuredPost = posts.find(post => post.title.startsWith("Clear Aligners vs Braces"));
    // Filter out the featured post for the grid
    const otherPosts = posts.filter(post => post !== featuredPost);

    return (
        <div className="blog-page">
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
                        color: '#2d3748',
                        letterSpacing: '-0.02em'
                    }}>Learning <span className="text-gradient">Centre</span></h1></Reveal>
                    <Reveal delay={0.2} width="100%"><p className="hero-subtitle" style={{
                        fontSize: '1.2rem',
                        color: '#4a5568',
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
                            <Link to={`/blog/${featuredPost.id}`}>
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
                    {otherPosts.map((post, index) => (
                        <Link to={`/blog/${post.id}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <FadeIn className="glass-panel post-card">
                                <div className="post-image">
                                    <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="post-content">
                                    <span className="post-cat">{post.category}</span>
                                    <h3>{post.title}</h3>
                                    <div className="post-meta">{post.date}</div>
                                </div>
                            </FadeIn>
                        </Link>
                    ))}
                </div>
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
              border-radius: 24px; /* Match Home page bento cards */
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
              border-radius: 24px; /* Match Home page bento cards */
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
          
          @media (max-width: 768px) {
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
                  margin-top: 40px !important; 
              }
              .post-card { 
                  border-radius: 20px;
                  margin-left: 8px;
                  margin-right: 8px;
                  width: auto;
              }
              
              .blog-hero-gradient { padding-top: 120px !important; padding-bottom: 60px !important; }
              .hero-title { font-size: 2.5rem !important; }
              .hero-subtitle { font-size: 1rem !important; margin-top: 15px !important; }
          }
       `}</style>
        </div>
    );
};

export default Blog;
