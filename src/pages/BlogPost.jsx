import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Reveal, FadeIn } from '../components/Reveal';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import blogIndex from '../data/blog-index.json';
import ResponsiveImage from '../components/ResponsiveImage';
import { relatedServices } from '../data/blogServiceLinks';
import FaqAccordion from '../components/FaqAccordion';
import Style from '../components/Style';

const SITE_URL = 'https://ismile.com.my';
const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { openBooking } = useBooking();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0); setLoading(true); setNotFound(false);
        fetch(`/blog-content/${slug}.json`).then(res => { if (!res.ok) throw new Error('Not found'); return res.json(); }).then(data => { setPost(data); setLoading(false); }).catch(() => { setNotFound(true); setLoading(false); });
    }, [slug]);
    const relatedPosts = useMemo(() => {
        if (!post) return [];
        const eligiblePosts = blogIndex.filter(p => p.content_type === 'educational');
        const activeCats = post.categories && post.categories.length > 0 ? post.categories : (post.category ? [post.category] : []);
        const sameCat = eligiblePosts.filter(p => { if (p.slug === slug) return false; const pCats = p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []); return pCats.some(c => activeCats.includes(c)); }).sort((a, b) => { const aCats = a.categories && a.categories.length > 0 ? a.categories : (a.category ? [a.category] : []); const bCats = b.categories && b.categories.length > 0 ? b.categories : (b.category ? [b.category] : []); return bCats.filter(c => activeCats.includes(c)).length - aCats.filter(c => activeCats.includes(c)).length; });
        const others = eligiblePosts.filter(p => { if (p.slug === slug) return false; const pCats = p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []); return !pCats.some(c => activeCats.includes(c)); });
        return [...sameCat, ...others].slice(0, 3);
    }, [post, slug]);
    if (notFound) return <Navigate to="/blog" replace />;
    if (loading) return <div className="blog-post-loading"><div /><Style>{`@keyframes blog-post-spin{to{transform:rotate(360deg)}}.blog-post-loading{min-height:100vh;display:flex;align-items:center;justify-content:center}.blog-post-loading div{width:40px;height:40px;border:3px solid var(--hairline);border-top-color:var(--color-primary-teal);border-radius:50%;animation:blog-post-spin .8s linear infinite}`}</Style></div>;
    const canonicalUrl = post.canonical_url || `${SITE_URL}/blog/${slug}`;
    const ogImage = post.img?.startsWith('http') ? post.img : `${SITE_URL}${post.img}`;
    const bookingAction = () => {
        const cleanTopic = post.title.replace(/\?$/, ''); let topic = cleanTopic;
        if (post.slug === 'clear-aligner-treatment-complexity') topic = 'clear aligner treatment';
        openBooking(`Interested in ${topic}`, `blog-post-${post.slug}`);
    };
    return <div className="blog-post-page">
        <Helmet>
            <title>{post.title} | iSmile Dental Clinic</title><meta name="description" content={post.excerpt} /><link rel="canonical" href={canonicalUrl} />
            <meta property="og:type" content="article" /><meta property="og:url" content={canonicalUrl} /><meta property="og:title" content={post.title} /><meta property="og:description" content={post.excerpt} /><meta property="og:image" content={ogImage} /><meta property="og:site_name" content="iSmile Dental Clinic" /><meta property="article:published_time" content={post.date} /><meta property="article:section" content={post.categories ? post.categories.join(', ') : post.category} />
            <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={post.title} /><meta name="twitter:description" content={post.excerpt} /><meta name="twitter:image" content={ogImage} />
            <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, image: ogImage, datePublished: post.date, dateModified: post.date, author: { '@type': 'Organization', name: 'iSmile Dental Clinic', url: SITE_URL }, publisher: { '@type': 'Organization', name: 'iSmile Dental Clinic', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }, articleSection: post.categories ? post.categories.join(', ') : post.category })}</script>
            {post.faq && post.faq.length > 0 && <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })}</script>}
        </Helmet>
        <header className="post-header container"><Reveal><div className="post-tags-container">{post.tags && post.tags.map((tag, idx) => <Link key={`tag-${idx}`} to={`/blog?category=${encodeURIComponent(tag)}`} className="eyebrow post-tag">{tag}</Link>)}</div></Reveal><Reveal delay={0.1}><h1>{post.title}</h1></Reveal><Reveal delay={0.2}><p className="post-date">{formatDate(post.date)}</p></Reveal></header>
        {post.img && <div className="container featured-image-container"><FadeIn><div className="featured-image-wrapper"><ResponsiveImage src={post.img} alt={post.title} className="featured-post-img" loading="lazy" sizes="(max-width: 900px) 100vw, 900px" /></div></FadeIn></div>}
        <main className="container blog-article"><FadeIn>
            <button onClick={() => navigate('/blog')} className="back-link"><ArrowLeft size={20} /> Back to Learning Centre</button>
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            {relatedServices(post.categories).length > 0 && <section className="post-related-services"><h3>Related treatments</h3><ul>{relatedServices(post.categories).map((svc) => <li key={svc.path}><Link to={svc.path} className="hairline-row" data-analytics-click="blog-related-service" data-analytics-label={svc.label}>{svc.label}<span aria-hidden="true">→</span></Link></li>)}</ul></section>}
            {post.faq && post.faq.length > 0 && <section className="post-faq-section"><h3>Frequently Asked Questions</h3><FaqAccordion items={post.faq} idPrefix={slug} analyticsLabel="blog-post" /></section>}
            <section className="post-closing"><p className="eyebrow">Next steps</p><p className="statement">Your Smile Deserves <em>Thoughtful Care</em></p><p>Schedule a consultation for a personalized assessment.</p><Button variant="primary" onClick={bookingAction}>Book a Consultation</Button></section>
        </FadeIn></main>
        {relatedPosts.length > 0 && <section className="related-posts container"><FadeIn><h2>You May Also Like</h2><div className="related-posts-grid">{relatedPosts.map((rp) => <article key={rp.slug} className="related-post media-item"><Link to={`/blog/${rp.slug}`} className="related-post-image media-image"><ResponsiveImage src={rp.img} alt={rp.title} loading="lazy" sizes="(max-width: 768px) 82vw, 340px" /></Link><p className="eyebrow">{rp.tags && rp.tags.length > 0 ? rp.tags[0] : (rp.categories && rp.categories[0]) || rp.category}</p><h3 className="media-title"><Link to={`/blog/${rp.slug}`}>{rp.title}</Link></h3><p className="related-post-date">{formatDate(rp.date)}</p><Link to={`/blog/${rp.slug}`} className="quiet-link">Read More →</Link></article>)}</div></FadeIn></section>}
        <Style>{`.blog-post-page .post-header{padding:156px 20px 48px;text-align:center}.blog-post-page .post-tags-container{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:16px}.blog-post-page .post-tag{color:var(--color-primary-deep)}.blog-post-page .post-header h1{max-width:1000px;margin:0 auto;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:700;line-height:1.1;letter-spacing:-.02em;text-wrap:balance}.blog-post-page .post-date{margin:20px 0 0;color:var(--color-text-grey);font-size:.95rem}.blog-post-page .featured-image-container{max-width:900px}.blog-post-page .featured-image-wrapper{overflow:hidden;border-radius:26px}.blog-post-page .featured-image-wrapper picture,.blog-post-page .featured-post-img{display:block;width:100%}.blog-post-page .blog-article{max-width:800px;padding-top:40px;padding-bottom:0}.blog-post-page .back-link{display:flex;align-items:center;gap:8px;margin:0 0 40px;padding:0;border:0;background:none;color:var(--color-text-grey);font:inherit;font-weight:500;cursor:pointer}.blog-post-page .back-link:hover{color:var(--color-primary-teal)}.blog-post-page .blog-content h3{margin:40px 0 20px;font-family:var(--font-heading);font-size:var(--fs-h3);font-weight:700;line-height:1.3;letter-spacing:-.02em}.blog-post-page .blog-content p{margin:0 0 25px;color:var(--color-text-slate);font-size:1.125rem;line-height:1.8}.blog-post-page .blog-content .blog-image-wrapper{margin:40px 0;overflow:hidden;border-radius:26px}.blog-post-page .blog-content .blog-image-wrapper img{display:block;width:100%;height:auto}.blog-post-page .blog-content .image-caption{margin:12px 0 0;padding:0;background:transparent;border:0;color:var(--color-text-grey);font-size:.95rem;font-style:italic;text-align:center}.blog-post-page .blog-content ul{margin-bottom:25px;padding-left:20px}.blog-post-page .blog-content li{margin-bottom:12px;color:var(--color-text-slate);font-size:1.125rem;line-height:1.6}.blog-post-page .blog-content strong{color:var(--color-text-charcoal)}.blog-post-page .blog-content a{color:var(--color-primary);text-decoration:underline;text-underline-offset:3px}.blog-post-page .post-related-services,.blog-post-page .post-faq-section,.blog-post-page .post-closing{margin-top:60px;padding-top:40px;border-top:1px solid var(--hairline)}.blog-post-page .post-related-services h3,.blog-post-page .post-faq-section h3{margin:0 0 20px;font-size:var(--fs-h3);font-weight:700}.blog-post-page .post-related-services ul{list-style:none;margin:0;padding:0}.blog-post-page .post-related-services .hairline-row{display:flex;justify-content:space-between;gap:16px;padding:14px 0;color:var(--color-primary-deep);font-weight:600}.blog-post-page .post-faq-section h3{margin-bottom:20px}.blog-post-page .post-closing{text-align:center}.blog-post-page .post-closing .eyebrow{margin-bottom:12px}.blog-post-page .post-closing .statement{margin:0 auto 14px;max-width:650px}.blog-post-page .post-closing .statement em{font-family:var(--font-accent);font-style:italic;color:var(--color-primary-teal);font-weight:400}.blog-post-page .post-closing>p:not(.eyebrow):not(.statement){color:var(--color-text-slate);margin:0 0 26px}.blog-post-page .related-posts{padding-top:var(--space-section-lg);padding-bottom:var(--space-section-lg)}.blog-post-page .related-posts h2{margin:0 0 32px;font-size:var(--fs-h2);font-weight:700}.blog-post-page .related-posts-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.blog-post-page .related-post-image{display:block;overflow:hidden;border-radius:26px;aspect-ratio:3/2}.blog-post-page .related-post-image picture,.blog-post-page .related-post-image img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease-slow)}.blog-post-page .related-post:hover .related-post-image img{transform:scale(1.04)}.blog-post-page .related-post>.eyebrow{margin:16px 0 7px;color:var(--color-primary-deep)}.blog-post-page .related-post .media-title{margin:0 0 8px;font-size:1.15rem;line-height:1.35}.blog-post-page .related-post .media-title a:hover{color:var(--color-primary-teal)}.blog-post-page .related-post-date{margin:0 0 12px;color:var(--color-text-grey);font-size:.88rem}@media(max-width:1024px){.blog-post-page .post-header{padding-top:120px}.blog-post-page .featured-image-container{padding:0 16px}.blog-post-page .blog-article{padding-top:34px}.blog-post-page .related-posts-grid{display:flex;overflow-x:auto;margin:0 -16px;padding:0 16px 8px;gap:18px;scroll-snap-type:x mandatory}.blog-post-page .related-post{width:78vw;max-width:340px;flex:0 0 auto;scroll-snap-align:start}}`}</Style>
    </div>;
};
export default BlogPost;
