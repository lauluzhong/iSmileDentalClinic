import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import blogIndex from '../data/blog-index.json';
import { pickRelatedPosts } from '../data/serviceBlogLinks';
import ResponsiveImage from './ResponsiveImage';
import Style from './Style';

/**
 * "Keep reading" strip for the bottom of a service or specialty page.
 *
 * Sits below the booking CTA so the page has an exit for the visitor who is
 * researching rather than ready to book. Which posts appear is decided in
 * src/data/serviceBlogLinks.js.
 *
 * Three cards, images and all. Desktop lays them out as a grid; below 1024px
 * they become a snap-scrolling carousel that bleeds to the screen edge, the
 * same gesture as Dental Education on the homepage. Whichever layout is in
 * play, the Learning Centre button underneath always renders — the section
 * should never dead-end any more than the page above it did.
 */
export default function RelatedReading({ pathKey, title = 'Keep reading', limit = 3 }) {
    const posts = pickRelatedPosts(blogIndex, pathKey, limit);
    if (posts.length === 0) return null;

    return (
        <section className="related-reading">
            <div className="container">
                <div className="related-reading-head">
                    <h2>{title}</h2>
                    <Link
                        to="/blog"
                        className="related-reading-all"
                        data-analytics-click="service-related-reading-all"
                        data-analytics-label={pathKey}
                    >
                        Visit the Learning Centre <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="related-reading-scroller">
                    <ul className="related-reading-track">
                        {posts.map((post) => {
                            const img = post.img;
                            return (
                                <li key={post.slug}>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="related-reading-card"
                                        data-analytics-click="service-related-reading"
                                        data-analytics-label={post.slug}
                                    >
                                        {img && (
                                            <div className="related-reading-media">
                                                <ResponsiveImage
                                                    src={img}
                                                    alt={post.title}
                                                    loading="lazy"
                                                    sizes="(max-width: 1024px) 320px, 380px"
                                                />
                                            </div>
                                        )}
                                        <div className="related-reading-body">
                                            {post.tags && post.tags.length > 0 && (
                                                <span className="related-reading-tag">{post.tags[0]}</span>
                                            )}
                                            <h3>{post.title}</h3>
                                            {post.excerpt && <p>{post.excerpt}</p>}
                                            <span className="related-reading-more">
                                                Read article <ArrowRight size={15} />
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* An <a> carrying the button classes, not <Link><Button> —
                    that nests a <button> inside an <a>, which is invalid and
                    breaks keyboard activation. */}
                <div className="related-reading-cta">
                    <Link
                        to="/blog"
                        className="btn btn-outline"
                        data-analytics-click="service-related-reading-cta"
                        data-analytics-label={pathKey}
                    >
                        Read more in the Learning Centre
                    </Link>
                </div>
            </div>

            <Style>{`
                .related-reading {
                    background: #f8f9fa;
                    padding: 72px 0;
                    text-align: left;
                }

                .related-reading-head {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: 20px;
                    flex-wrap: wrap;
                    margin-bottom: 32px;
                }

                .related-reading-head h2 {
                    margin: 0;
                    font-size: clamp(1.6rem, 3vw, 2.1rem);
                    font-weight: 700;
                    color: var(--color-text-charcoal);
                    letter-spacing: -0.01em;
                }

                .related-reading-all {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--color-primary);
                    font-weight: 600;
                    font-size: 0.95rem;
                    text-decoration: none;
                    white-space: nowrap;
                }

                .related-reading-all:hover { text-decoration: underline; }

                .related-reading-track {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }

                .related-reading-track > li { display: flex; }

                .related-reading-card {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.06);
                    border-radius: 20px;
                    overflow: hidden;
                    text-decoration: none;
                    color: inherit;
                    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
                }

                .related-reading-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                }

                .related-reading-media {
                    height: 190px;
                    width: 100%;
                    overflow: hidden;
                    background: #eef2f5;
                }

                .related-reading-media picture,
                .related-reading-media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
                }

                .related-reading-card:hover .related-reading-media img { transform: scale(1.05); }

                .related-reading-body {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 24px;
                }

                .related-reading-tag {
                    align-self: flex-start;
                    font-size: 0.65rem;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    font-weight: 600;
                    color: var(--color-primary);
                    background: rgba(79, 163, 194, 0.1);
                    border: 1px solid rgba(79, 163, 194, 0.2);
                    border-radius: 12px;
                    padding: 4px 10px;
                    margin-bottom: 12px;
                }

                .related-reading-card h3 {
                    margin: 0 0 10px 0;
                    font-size: 1.15rem;
                    line-height: 1.35;
                    font-weight: 700;
                    color: var(--color-text-charcoal);
                }

                .related-reading-card p {
                    margin: 0 0 18px 0;
                    font-size: 0.95rem;
                    line-height: 1.55;
                    color: var(--color-text-muted, #555);
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .related-reading-more {
                    margin-top: auto;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--color-primary);
                }

                .related-reading-cta {
                    margin-top: 36px;
                    text-align: center;
                }

                .related-reading-cta .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                }

                @media (max-width: 1024px) {
                    .related-reading { padding: 48px 0; }
                    .related-reading-head { margin-bottom: 20px; }

                    /* Carousel, matching Dental Education on the homepage: the
                       scroller breaks out of .container's 16px gutter so cards
                       run to the screen edge, and the track re-adds it as
                       padding so the first card still lines up with the heading. */
                    .related-reading-all { display: none; }

                    .related-reading-scroller {
                        margin: 0 -16px;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        scroll-snap-type: x mandatory;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                        padding-bottom: 4px;
                    }

                    .related-reading-scroller::-webkit-scrollbar { display: none; }

                    .related-reading-track {
                        display: flex;
                        grid-template-columns: none;
                        gap: 16px;
                        width: max-content;
                        padding: 4px 16px;
                    }

                    .related-reading-track > li {
                        width: 78vw;
                        max-width: 320px;
                        flex-shrink: 0;
                        scroll-snap-align: start;
                    }

                    .related-reading-card { border-radius: 18px; }
                    .related-reading-media { height: 170px; }
                    .related-reading-body { padding: 20px; }
                    .related-reading-card h3 { font-size: 1.05rem; }
                    .related-reading-card p {
                        font-size: 0.92rem;
                        -webkit-line-clamp: 2;
                        margin-bottom: 14px;
                    }
                    .related-reading-cta { margin-top: 24px; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .related-reading-card,
                    .related-reading-media img { transition: none; }
                    .related-reading-card:hover { transform: none; }
                    .related-reading-card:hover .related-reading-media img { transform: none; }
                }
            `}</Style>
        </section>
    );
}
