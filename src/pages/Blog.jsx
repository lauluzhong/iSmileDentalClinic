import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Reveal, FadeIn } from '../components/Reveal';
import { blogPosts as posts } from '../data/blogPosts';

const Blog = () => {
    // Determine Featured Post
    const featuredPost = posts.find(post => post.title.startsWith("Invisalign vs Braces"));
    // Filter out the featured post for the grid
    const otherPosts = posts.filter(post => post !== featuredPost);

    return (
        <div className="blog-page">
            <div className="blog-hero section-padding">
                <div className="container">
                    <Reveal width="100%"><h1 className="hero-title">Learning <span className="text-gradient">Centre</span></h1></Reveal>
                    <Reveal delay={0.2} width="100%"><p className="hero-subtitle">
                        Welcome to our learning space—where we share our heart for dental education and empower you with the knowledge to care for your lifelong smile.
                    </p></Reveal>
                </div>
            </div>

            <div className="container section-padding pt-0">
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
                            <img src={featuredPost.img} alt={featuredPost.title} />
                        </div>
                    </FadeIn>
                )}

                {/* Grid */}
                <div className="posts-grid">
                    {otherPosts.map((post, index) => (
                        <Link to={`/blog/${post.id}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <FadeIn className="glass-panel post-card">
                                <div className="post-image">
                                    <img src={post.img} alt={post.title} />
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
          .blog-hero {
              text-align: center;
              padding-top: 180px;
              padding-bottom: 20px;
          }
          
          .hero-title {
              font-size: 3rem;
              font-weight: 700;
          }
          
          .hero-subtitle {
              font-size: 1.2rem;
              color: var(--color-text-muted);
              max-width: 800px;
              margin: 20px auto 0;
              line-height: 1.6;
          }

          .featured-post {
              display: grid;
              grid-template-columns: 1fr 1fr;
              overflow: hidden;
              padding: 0;
              min-height: 350px;
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
          
          .featured-image img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }

          .posts-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 30px;
              margin-top: 80px;
          }

          .post-card {
              padding: 0;
              overflow: hidden;
              transition: transform 0.3s;
              cursor: pointer;
              height: 100%;
              display: flex;
              flex-direction: column;
          }
          
          .post-card:hover {
              transform: translateY(-5px);
          }

          .post-image {
              height: 200px;
              flex-shrink: 0;
          }
          
          .post-image img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }

          .post-content {
              padding: 20px;
              display: flex;
              flex-direction: column;
              flex-grow: 1;
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
             flex-grow: 1;
          }

          .post-meta {
              font-size: 0.85rem;
              color: var(--color-text-muted);
              margin-top: 10px;
          }
          
          @media (max-width: 768px) {
              .blog-hero {
                  padding-top: 140px;
                  padding-bottom: 20px;
              }
              .hero-title {
                  font-size: 2.5rem;
              }
              .hero-subtitle {
                  font-size: 1.1rem;
              }
              
              .featured-post {
                  grid-template-columns: 1fr;
              }
              .featured-image {
                  height: 200px;
                  order: -1;
              }
              .featured-content {
                  padding: 24px;
              }
              
              .posts-grid {
                  margin-top: 40px;
                  grid-template-columns: 1fr;
                  gap: 30px;
              }
          }
       `}</style>
        </div>
    );
};

export default Blog;
