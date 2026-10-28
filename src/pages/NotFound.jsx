import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Style from '../components/Style';

// Unknown URLs used to render a blank page under the header (no catch-all
// route). This is the smallest honest page: what happened and where to go.
const NotFound = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="not-found-page">
            <Helmet>
                <title>Page not found | iSmile Dental Clinic</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <section className="section-padding">
                <div className="container nf-wrap">
                    <h1>Page <em>not found</em></h1>
                    <p className="nf-lead">The page you are looking for has moved or no longer exists.</p>
                    <div className="nf-links">
                        <Link to="/" className="quiet-link">Go to the homepage →</Link>
                        <Link to="/services" className="quiet-link">See our services →</Link>
                    </div>
                </div>
            </section>
            <Style>{`
                .not-found-page .section-padding { padding-top: 170px; padding-bottom: var(--space-section-lg); }
                .not-found-page .nf-wrap { max-width: 760px; }
                .not-found-page h1 { font-size: var(--fs-h1); line-height: 1.08; letter-spacing: -0.03em; margin: 0 0 20px; }
                .not-found-page .nf-lead { font-size: var(--fs-lead); line-height: 1.65; color: var(--color-text-slate); margin: 0 0 28px; max-width: 620px; }
                .not-found-page .nf-links { display: flex; flex-wrap: wrap; gap: 12px 32px; }
                @media (max-width: 1024px) { .not-found-page .section-padding { padding-top: 120px; } }
            `}</Style>
        </div>
    );
};

export default NotFound;
