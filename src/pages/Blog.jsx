import { Helmet } from 'react-helmet-async';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Reveal, FadeIn } from '../components/Reveal';
import blogIndex from '../data/blog-index.json';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';
import ResponsiveImage from '../components/ResponsiveImage';
import Style from '../components/Style';

const educationalPosts = blogIndex.filter(post => post.content_type === 'educational');
const POSTS_PER_PAGE = 12;
const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const Blog = () => {
    const seo = CORE_PAGES.find(p => p.path === 'blog');
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const activeCategory = searchParams.get('category') || 'All';
    const activeQuery = (searchParams.get('q') || '').trim();
    const [searchDraft, setSearchDraft] = useState(activeQuery);
    const filterRef = useRef(null);
    const MECE_TAGS = ['Pediatric Dentistry', 'Orthodontics', 'Myofunctional Orthodontics', 'Clear Aligners', 'Traditional Braces', 'Cosmetic Dentistry', 'Restorative Dentistry', 'Oral Surgery', 'Oral Health', 'Preventive Care', 'Emergency Dental', 'Dental Technology'];
    const categories = useMemo(() => {
        const counts = {};
        educationalPosts.forEach(p => {
            const tags = p.tags && p.tags.length > 0 ? p.tags : (p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []));
            tags.forEach(tag => { if (MECE_TAGS.includes(tag)) counts[tag] = (counts[tag] || 0) + 1; });
        });
        return Object.entries(counts).sort((a, b) => b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }));
    }, []);
    const featuredPost = educationalPosts.find(p => p.featured) || educationalPosts[0];
    useEffect(() => { setSearchDraft(activeQuery); }, [activeQuery]);
    const filteredPosts = useMemo(() => {
        const normalizedQuery = activeQuery.toLowerCase();
        return educationalPosts.filter(p => {
            const tags = p.tags && p.tags.length > 0 ? p.tags : (p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []));
            const matchesCategory = activeCategory === 'All' || tags.includes(activeCategory);
            if (!matchesCategory) return false;
            if (!normalizedQuery) return true;
            const haystack = `${p.title || ''} ${p.excerpt || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }, [activeCategory, activeQuery]);
    const otherPosts = useMemo(() => activeCategory === 'All' && !activeQuery ? filteredPosts.filter(p => p.slug !== featuredPost?.slug) : filteredPosts, [activeCategory, activeQuery, filteredPosts, featuredPost]);
    const totalPages = Math.ceil(otherPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = otherPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    const goToPage = (page) => { const params = {}; if (activeCategory !== 'All') params.category = activeCategory; if (page > 1) params.page = String(page); setSearchParams(params); window.scrollTo(0, 0); };
    const setCategory = (cat) => { const params = {}; if (activeQuery) params.q = activeQuery; if (cat !== 'All') params.category = cat; setSearchParams(params); if (filterRef.current) { const pill = filterRef.current.querySelector(`[data-cat="${cat}"]`); if (pill) pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } };
    const setQuery = (value) => { const next = value.trim(); const params = {}; if (next) params.q = next; if (activeCategory !== 'All') params.category = activeCategory; setSearchParams(params); };
    useEffect(() => { if (filterRef.current) { const pill = filterRef.current.querySelector(`[data-cat="${activeCategory}"]`); if (pill) pill.scrollIntoView({ inline: 'center', block: 'nearest' }); } }, [activeCategory]);
    const categoryButton = (name, count) => <button key={name} className={`category-label${activeCategory === name ? ' active' : ''}`} onClick={() => setCategory(name)} data-cat={name}>{name} ({count})</button>;
    return <div className="blog-page">
        <Helmet><title>{fillStats(seo.title, reviewStats)}</title><meta name="description" content={fillStats(seo.description, reviewStats)} /><link rel="canonical" href={`https://ismile.com.my/blog${currentPage > 1 ? `?page=${currentPage}` : ''}`} /></Helmet>
        <header className="blog-hero container"><Reveal width="100%"><p className="eyebrow">Learning Centre</p><h1>Learning <em>Centre</em></h1></Reveal><Reveal delay={0.2} width="100%"><p className="hero-subtitle">Welcome to our learning space—where we share our heart for dental education and empower you with the knowledge to care for your lifelong smile.</p></Reveal></header>
        <main className="container blog-main">
            <div className="blog-search-wrap"><input type="search" className="blog-search-input" placeholder="Search articles by keyword" value={searchDraft} onChange={(e) => { const value = e.target.value; setSearchDraft(value); setQuery(value); }} aria-label="Search blog posts" />{searchDraft && <button type="button" className="blog-search-clear quiet-link" onClick={() => { setSearchDraft(''); setQuery(''); }} aria-label="Clear search">Clear</button>}</div>
            <nav className="category-filter-bar snap-rail" ref={filterRef} aria-label="Filter by topic">{categoryButton('All', educationalPosts.length)}{categories.map(({ name, count }) => categoryButton(name, count))}</nav>
            {featuredPost && activeCategory === 'All' && !activeQuery && <FadeIn className="featured-post media-item"><Link to={`/blog/${featuredPost.slug}`} className="featured-image media-image"><ResponsiveImage src={featuredPost.img} alt={featuredPost.title} loading="lazy" sizes="(max-width: 768px) 88vw, 760px" /></Link><div className="featured-content"><p className="eyebrow">Featured</p><h2>{featuredPost.title}</h2><p>{featuredPost.excerpt}</p><Link to={`/blog/${featuredPost.slug}`} className="quiet-link">Read More →</Link></div></FadeIn>}
            <div className="posts-grid">{paginatedPosts.length > 0 ? paginatedPosts.map((post) => <FadeIn key={post.slug} className="post-card media-item"><Link to={`/blog/${post.slug}`} className="post-image media-image"><ResponsiveImage src={post.img} alt={post.title} loading="lazy" sizes="(max-width: 768px) 82vw, 380px" /></Link><div className="post-content">{post.tags && post.tags.length > 0 && <button className="post-tag eyebrow" onClick={() => setCategory(post.tags[0])}>{post.tags[0]}</button>}<h3 className="media-title"><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3><p className="post-meta">{formatDate(post.date)}</p><Link to={`/blog/${post.slug}`} className="quiet-link">Read More →</Link></div></FadeIn>) : <div className="empty-posts"><p>No other posts in this category yet. Check back soon!</p></div>}</div>
            {totalPages > 1 && <nav className="blog-pagination" aria-label="Blog pages">{currentPage > 1 && <button className="quiet-link" onClick={() => goToPage(currentPage - 1)}>← Previous</button>}{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => <button key={page} className={`page-link${page === currentPage ? ' active' : ''}`} onClick={() => goToPage(page)} aria-current={page === currentPage ? 'page' : undefined}>{page}</button>)}{currentPage < totalPages && <button className="quiet-link" onClick={() => goToPage(currentPage + 1)}>Next →</button>}</nav>}
        </main>
        <Style>{`.blog-page .blog-hero{padding:160px 0 56px;text-align:center}.blog-page .blog-hero .eyebrow{margin-bottom:14px}.blog-page .blog-hero h1{margin:0;font-size:var(--fs-display);font-weight:700;text-wrap:balance}.blog-page .hero-subtitle{max-width:800px;margin:24px auto 0;color:var(--color-text-slate);font-size:var(--fs-lead);line-height:1.6}.blog-page .blog-main{padding-bottom:var(--space-section-lg)}.blog-page .blog-search-wrap{display:flex;gap:12px;margin-bottom:20px}.blog-page .blog-search-input{width:100%;height:56px;padding:0 18px;border:1.5px solid var(--color-tint-blue);border-radius:16px;background:var(--color-bg-white);color:var(--color-text-charcoal);font:inherit}.blog-page .blog-search-input:focus{outline:2px solid var(--color-pastel-blue);outline-offset:2px;border-color:var(--color-primary-teal)}.blog-page .blog-search-clear,.blog-page .page-link{border:0;background:none;cursor:pointer;font:inherit}.blog-page .category-filter-bar{display:flex;flex-wrap:wrap;gap:10px 22px;padding:0 0 28px;margin-bottom:34px}.blog-page .category-label{padding:0 0 3px;border:0;border-bottom:1px solid transparent;background:none;color:var(--color-text-slate);font:inherit;font-size:.92rem;cursor:pointer;white-space:nowrap}.blog-page .category-label:hover,.blog-page .category-label.active{color:var(--color-primary-teal);border-color:var(--color-primary-teal)}.blog-page .featured-post{display:block;max-width:760px;margin:0 auto 64px}.blog-page .featured-content{padding-top:18px}.blog-page .featured-image,.blog-page .post-image{overflow:hidden;border-radius:26px}.blog-page .featured-image picture,.blog-page .featured-image img,.blog-page .post-image picture,.blog-page .post-image img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease-slow)}.blog-page .featured-image,.blog-page .post-image{aspect-ratio:3/2}.blog-page .media-item:hover .media-image img{transform:scale(1.04)}.blog-page .featured-content h2{margin:0 0 14px;font-size:var(--fs-h2);font-weight:700}.blog-page .featured-content p:not(.eyebrow){color:var(--color-text-slate);margin:0 0 18px}.blog-page .posts-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:38px 24px}.blog-page .post-content{padding-top:16px}.blog-page .post-tag{display:block;padding:0;border:0;background:none;cursor:pointer;color:var(--color-primary-deep);margin-bottom:7px}.blog-page .media-title{margin:0 0 8px;font-size:1.2rem;line-height:1.35}.blog-page .media-title a:hover{color:var(--color-primary-teal)}.blog-page .post-meta{margin:0 0 12px;font-size:.88rem;color:var(--color-text-grey)}.blog-page .empty-posts{grid-column:1/-1;padding:60px 20px;text-align:center;color:var(--color-text-slate)}.blog-page .blog-pagination{display:flex;justify-content:center;align-items:baseline;flex-wrap:wrap;gap:16px;margin:58px 0 20px}.blog-page .page-link{color:var(--color-text-slate);padding:0 0 3px;border-bottom:1px solid transparent}.blog-page .page-link.active{color:var(--color-primary-teal);border-color:var(--color-primary-teal);font-weight:700}@media(max-width:1024px){.blog-page .blog-hero{padding-top:124px}.blog-page .category-filter-bar{flex-wrap:nowrap;overflow-x:auto;margin:0 -16px 28px;padding:0 16px 14px;scroll-snap-type:x proximity}.blog-page .category-label{flex:0 0 auto;scroll-snap-align:start}.blog-page .featured-post{margin-bottom:44px}.blog-page .posts-grid{display:flex;overflow-x:auto;margin:0 -16px;padding:0 16px 8px;gap:18px;scroll-snap-type:x mandatory}.blog-page .post-card{width:78vw;max-width:340px;flex:0 0 auto;scroll-snap-align:start}}`}</Style>
    </div>;
};
export default Blog;
