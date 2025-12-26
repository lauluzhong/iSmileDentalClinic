import React from 'react';
import { Search } from 'lucide-react';
import Button from '../components/Button';

const posts = [
    // From Home Page
    { title: "Understanding Gum Health", category: "Oral Health", date: "Jan 05, 2025", img: "/images/gum_hero_1765825178470.png" },
    { title: "Managing Tooth Sensitivity", category: "Daily Care", date: "Dec 28, 2024", img: "/images/sensitivity_hero_1765825197668.png" },
    { title: "Adult Orthodontics", category: "Cosmetic & Ortho", date: "Dec 15, 2024", img: "/images/adult_ortho_hero_1765825218135.png" },
    { title: "Understanding Bone Loss", category: "Oral Surgery", date: "Oct 15, 2024", img: "/images/bone_loss_hero_1765825236985.png" },
    { title: "Types of Veneers", category: "Cosmetic", date: "Sep 20, 2024", img: "/images/veneers_hero_1765825257935.png" },
    { title: "Mouth Breathing (Kids)", category: "Airway & Growth", date: "Dec 10, 2024", img: "/images/child_airway_hero_1765825276038.png" },

    // Original Blog Posts (Restored with New Images)
    { title: "Why Mouth Breathing in Children Matters", category: "Airway & Growth", date: "Dec 12, 2024", img: "/images/mouth_breathing_sleep.png" },
    { title: "Invisalign vs Braces: What's Right for You?", category: "Cosmetic & Ortho", date: "Nov 28, 2024", img: "/images/invisalign_hand.png" },
    { title: "The Truth About Fluoride", category: "Oral Health 101", date: "Nov 15, 2024", img: "/images/fluoride_brush.png" },
    { title: "How Stress Affects Your Teeth", category: "Wellness", date: "Oct 30, 2024", img: "/images/stress_teeth.png" }
];

const Blog = () => {
    return (
        <div className="blog-page">
            <div className="blog-hero section-padding" style={{ background: 'var(--color-tint-blue)', paddingTop: '160px' }}>
                <div className="container">
                    <h1 className="hero-title">Learning Centre</h1>
                    <p className="hero-subtitle mb-4">Expert insights for a healthier smile.</p>
                </div>
            </div>

            <div className="container section-padding">
                {/* Featured */}
                <div className="glass-panel featured-post">
                    <div className="featured-content">
                        <span className="badge">Featured</span>
                        <h2>Why Airway Health Starts at the Dentist</h2>
                        <p>Did you know that snoring in children isn't cute—it's a red flag? Learn how early intervention can change your child's health trajectory.</p>
                        <Button variant="outline">Read Article</Button>
                    </div>
                    <div className="featured-image">
                        <img src="/images/dentist-child.png" alt="Dentist treating child" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Grid */}
                <div className="posts-grid" style={{ marginTop: '80px' }}>
                    {posts.map((post, index) => (
                        <div key={index} className="glass-panel post-card">
                            <div className="post-image">
                                <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="post-content">
                                <span className="post-cat">{post.category}</span>
                                <h3>{post.title}</h3>
                                <div className="post-meta">{post.date}</div>
                            </div>
                        </div>
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
          }
          
          .post-card:hover {
              transform: translateY(-5px);
          }

          .post-image {
              height: 200px;
          }

          .post-content {
              padding: 20px;
          }

          .post-cat {
              font-size: 0.8rem;
              color: var(--color-primary);
              font-weight: 600;
              text-transform: uppercase;
          }

          .post-meta {
              font-size: 0.85rem;
              color: var(--color-text-muted);
              margin-top: 10px;
          }
          
          @media (max-width: 768px) {
              .featured-post {
                  grid-template-columns: 1fr;
              }
              .featured-image {
                  height: 200px;
                  order: -1;
              }
          }
       `}</style>
        </div>
    );
};

export default Blog;
