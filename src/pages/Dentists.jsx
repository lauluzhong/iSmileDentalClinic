import React from 'react';
import { Routes, Route, useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Globe, Award, Clock, GraduationCap } from 'lucide-react';
import dentists, { dentistBySlug, dentistSeo } from '../data/dentists.js';
import Button from '../components/Button';
import { useBooking } from '../context/BookingContext';
import Style from '../components/Style';

const SITE = 'https://ismile.com.my';

/**
 * Dentist pages: an index at /dentists and a profile at /dentists/:slug.
 *
 * These exist because doctor-name queries are the best-converting traffic the
 * site gets and had nowhere to land. Content is what /about already published.
 *
 * Both are rendered here in React AND prerendered by vite-plugin-blog-ssg.js.
 * That pairing is deliberate: the prerendered shell is deleted the moment React
 * mounts, so anything that exists only in the build output is visible to
 * crawlers and invisible to people. See the ServiceGuide comment for the bug
 * that taught us this.
 */

function DentistCard({ d }) {
    return (
        <Link to={`/dentists/${d.slug}`} className="media-item dentist-card">
            <div className="dentist-card-media">
                <img src={encodeURI(d.img)} alt={d.knownAs} loading="lazy" width="220" height="220" />
            </div>
            <div className="dentist-card-body">
                <h2 className="dentist-card-name">{d.knownAs}</h2>
                <p className="dentist-card-role">{d.role}</p>
                <span className="quiet-link dentist-card-cta">View profile <ArrowRight size={15} /></span>
            </div>
        </Link>
    );
}

function DentistIndex() {
    return (
        <div className="dentists-page dentists-page-index">
            <Helmet>
                <title>Our Dentists in Damansara Jaya, Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Meet the dentists at iSmile Dental Clinic in Damansara Jaya, Petaling Jaya. Eight dental surgeons with 14 to 34 years in practice across general, paediatric, orthodontic and restorative care." />
                <link rel="canonical" href={`${SITE}/dentists`} />
            </Helmet>

            <div className="dentists-hero">
                <div className="container dentists-header">
                    <p className="eyebrow">Damansara Jaya, Petaling Jaya</p>
                    <h1>Our <em>dentists</em></h1>
                    <p className="dentists-intro">
                        Our team in Damansara Jaya covers general, paediatric, orthodontic and restorative
                        care between them, with 14 to 34 years in practice each. If you would like to see a
                        particular dentist, say so when you book and the front desk
                        will arrange it for you where possible.
                    </p>
                </div>
            </div>

            <div className="container dentists-grid">
                {dentists.map((d) => <DentistCard key={d.slug} d={d} />)}
            </div>

            <DentistStyles />
        </div>
    );
}

function DentistProfile() {
    const { slug } = useParams();
    const d = dentistBySlug(slug);
    const { openBooking } = useBooking();

    if (!d) return <Navigate to="/dentists" replace />;

    const seo = dentistSeo(d);
    const others = dentists.filter((x) => x.slug !== d.slug);

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        name: d.name,
        alternateName: d.knownAs,
        image: SITE + d.img,
        url: `${SITE}/dentists/${d.slug}`,
        knowsLanguage: d.languages.split(',').map((s) => s.trim()),
        worksFor: {
            '@type': 'Dentist',
            name: 'iSmile Dental Clinic',
            url: SITE,
            address: {
                '@type': 'PostalAddress',
                streetAddress: '75 & 75A, Jalan SS 22/23, Damansara Jaya',
                addressLocality: 'Petaling Jaya',
                addressRegion: 'Selangor',
                postalCode: '47400',
                addressCountry: 'MY',
            },
        },
    };

    return (
        <div className="dentists-page dentists-page-profile">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <link rel="canonical" href={`${SITE}/dentists/${d.slug}`} />
                <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
            </Helmet>

            <div className="dentist-hero">
                <div className="container dentist-profile">
                    {/* Humans arrive from the About team grid, so back goes there.
                        /dentists still exists for search landers and the sitemap. */}
                    <Link to="/about#team" className="dentist-back">
                        <ArrowLeft size={16} /> Our team
                    </Link>

                    <div className="dentist-profile-head">
                        <div className="dentist-profile-imgwrap">
                            <img src={encodeURI(d.img)} alt={d.knownAs} className="dentist-profile-img" width="280" height="280" />
                        </div>
                        <div className="dentist-profile-intro">
                            <p className="dentist-profile-role">{d.role}</p>
                            <h1 className="dentist-profile-name">{d.knownAs}</h1>
                            <p className="dentist-profile-bio">{d.bio}</p>
                            <div className="dentist-profile-details">
                                <p><Clock size={17} /> {d.years} in practice</p>
                                <p><GraduationCap size={17} /> {d.qualifications}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dentist-profile">
                <dl className="dentist-facts">
                    <div className="dentist-fact">
                        <dt><Globe size={17} /> Languages</dt>
                        <dd>{d.languages}</dd>
                    </div>
                    {d.keyCompetency && (
                        <div className="dentist-fact">
                            <dt><Award size={17} /> Areas of focus</dt>
                            <dd>{d.keyCompetency}</dd>
                        </div>
                    )}
                </dl>

                <div className="dentist-cta">
                    <p className="eyebrow">Your visit</p>
                    <h2 className="statement">Book an appointment</h2>
                    <p className="dentist-cta-copy">
                        We are at 75 &amp; 75A, Jalan SS 22/23, Damansara Jaya, Petaling Jaya. If you
                        would like to see a particular dentist, let the front desk know and they will
                        arrange it for you where possible.
                    </p>
                    {/* The first argument prefills the booking form's free-text field, which
                        becomes the body of the pre-typed WhatsApp message. It is deliberately
                        EMPTY here. Every other page seeds a page-specific opener, but naming a
                        dentist would put a doctor-specific request in the patient's mouth before
                        they have asked for one, and the front desk assigns appointments. If a patient
                        wants a particular dentist they can type it themselves.

                        The second argument is the analytics source. It never reaches the message,
                        so per-dentist attribution still works. */}
                    <Button onClick={() => openBooking('', `dentist-${d.slug}`)}>
                        Book an appointment
                    </Button>
                </div>

                <div className="dentist-others">
                    <h2>Other dentists at the clinic</h2>
                    <div className="dentist-others-grid">
                        {others.map((o) => (
                            <Link key={o.slug} to={`/dentists/${o.slug}`} className="dentist-other">
                                <img src={encodeURI(o.img)} alt={o.knownAs} loading="lazy" width="96" height="96" />
                                <strong>{o.knownAs}</strong>
                                <em>{o.role}</em>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <DentistStyles />
        </div>
    );
}

function DentistStyles() {
    return (
        <Style>{`
            .dentists-page { padding: 170px 0 80px; }
            .dentists-page-index, .dentists-page-profile { padding-top: 0; }

            .dentists-hero { text-align: center; }
            .dentists-header { max-width: 720px; }
            .dentists-header h1 { margin: 0 0 16px; letter-spacing: -0.02em; text-wrap: balance; }
            .dentists-intro { margin: 0 auto; font-size: 1.0625rem; line-height: 1.7; color: var(--color-text-slate); }

            .dentists-grid {
                display: grid; gap: 32px 24px; margin-top: 48px;
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            }
            .dentist-card {
                display: flex; flex-direction: column; text-decoration: none; color: inherit;
                border: 0; border-radius: 0; overflow: visible; background: transparent;
            }
            .dentist-card-media {
                overflow: hidden; border-radius: 20px;
            }
            .dentist-card-media img {
                width: 100%; height: 250px; object-fit: cover; object-position: top;
                display: block; transition: transform .35s ease;
            }
            .dentist-card:hover .dentist-card-media img { transform: scale(1.04); }
            .dentist-card-body { display: flex; flex-direction: column; flex: 1; padding: 16px 0 0; }
            .dentist-card-name { font-family: var(--font-heading); font-weight: 700; font-size: 1.125rem; margin: 0 0 4px; }
            .dentist-card-role { margin: 0 0 14px; color: var(--color-text-slate); font-size: .9375rem; }
            .dentist-card-cta {
                display: inline-flex; align-items: center; gap: 6px; margin-top: auto;
                font-family: var(--font-heading, sans-serif); font-weight: 600; font-size: .875rem;
                color: var(--color-text-slate);
            }
            .dentist-card-cta svg { transition: transform .2s ease; }
            .dentist-card:hover .dentist-card-cta svg { transform: translateX(3px); }

            .dentist-hero { padding: 150px 0 56px; }
            .dentist-profile { max-width: 860px; }
            .dentist-back {
                display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
                color: var(--color-text-grey); font-size: .9375rem; margin-bottom: 32px;
            }
            .dentist-back:hover { color: var(--color-primary-teal); }
            .dentist-profile-head { display: flex; gap: 40px; align-items: center; flex-wrap: wrap; }
            .dentist-profile-imgwrap {
                flex-shrink: 0; border-radius: 26px; overflow: hidden;
            }
            .dentist-profile-img { width: 280px; height: 280px; object-fit: cover; object-position: top; display: block; }
            .dentist-profile-intro { flex: 1; min-width: 280px; }
            .dentist-profile-role {
                margin: 0 0 8px; color: var(--color-primary-teal);
                font-family: var(--font-heading, sans-serif); font-weight: 600;
                font-size: .875rem; text-transform: uppercase; letter-spacing: .1em;
            }
            .dentist-profile-name { margin: 0 0 14px; letter-spacing: -0.02em; }
            .dentist-profile-bio { margin: 0 0 22px; font-size: 1.0625rem; line-height: 1.7; color: var(--color-text-grey); }
            .dentist-profile-details { display: grid; gap: 8px; }
            .dentist-profile-details p { display: flex; align-items: flex-start; gap: 8px; margin: 0; color: var(--color-text-slate); font-size: .9375rem; }
            .dentist-profile-details svg, .dentist-fact svg { flex: 0 0 auto; color: var(--color-primary-teal); margin-top: 1px; }

            .dentist-facts { margin: 40px 0 0; border-top: 1px solid var(--hairline); }
            .dentist-fact {
                display: grid; grid-template-columns: minmax(150px, .35fr) 1fr; gap: 24px;
                padding: 18px 0; border-bottom: 1px solid var(--hairline);
            }
            .dentist-fact dt {
                display: flex; align-items: center; gap: 10px; font-weight: 600;
                font-family: var(--font-heading, sans-serif);
                font-size: .8125rem; text-transform: uppercase; letter-spacing: .06em;
                color: var(--color-text-slate); margin: 0;
            }
            .dentist-fact dd { margin: 0; font-size: 1rem; line-height: 1.6; color: var(--color-text-slate); }

            .dentist-cta {
                margin-top: 64px; max-width: 660px;
            }
            .dentist-cta h2 { margin: 0 0 14px; }
            .dentist-cta-copy { margin: 0 0 24px; line-height: 1.7; color: var(--color-text-slate); }

            /* Horizontal strip (owner, 8 Sep 2026): seven vertical rows wasted
               a screen of scrolling; a row of compact portrait tiles says the
               same thing at a glance. Wraps on desktop, swipes on mobile. */
            .dentist-others { margin-top: 64px; border-top: 1px solid var(--hairline); padding-top: 32px; }
            .dentist-others h2 { font-size: 1.25rem; margin: 0 0 24px; }
            .dentist-others-grid { display: flex; flex-wrap: wrap; gap: 28px 32px; }
            .dentist-other {
                display: flex; flex-direction: column; align-items: center; gap: 3px;
                width: 108px; text-align: center; text-decoration: none; color: inherit;
            }
            .dentist-other img {
                width: 76px; height: 76px; border-radius: 50%; object-fit: cover; object-position: top;
                margin-bottom: 8px; transition: transform 0.4s var(--ease-slow), box-shadow 0.4s ease;
            }
            .dentist-other:hover img { transform: translateY(-4px); box-shadow: 0 10px 22px rgba(13,42,58,0.16); }
            .dentist-other strong { font-size: .875rem; line-height: 1.25; }
            .dentist-other:hover strong { color: var(--color-primary-deep); }
            .dentist-other em { font-style: normal; font-size: .72rem; color: var(--color-text-grey); line-height: 1.3; }

            @media (max-width: 1024px) {
                .dentist-others-grid { flex-wrap: nowrap; overflow-x: auto; gap: 20px; padding-bottom: 8px; scrollbar-width: none; -ms-overflow-style: none; }
                .dentist-others-grid::-webkit-scrollbar { display: none; }
                .dentist-other { flex: none; width: 96px; }
                .dentists-page { padding: 110px 0 60px; }
                .dentists-page-index, .dentists-page-profile { padding-top: 0; }
                .dentists-hero { padding: 120px 0 44px; }
                .dentist-hero { padding: 110px 0 40px; }
                .dentist-profile-head { gap: 24px; }
                .dentist-profile-imgwrap { width: 100%; }
                .dentist-profile-img { width: 100%; height: 320px; }
            }
            @media (max-width: 480px) {
                .dentists-hero { padding: 112px 0 40px; }
                .dentist-hero { padding: 104px 0 36px; }
                .dentists-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 14px; }
                .dentist-card-media img { height: 190px; }
                .dentist-card-name { font-size: 1rem; }
                .dentist-card-role { font-size: .8125rem; }
                .dentist-profile-img { height: 300px; }
                .dentist-fact { grid-template-columns: 1fr; gap: 6px; }
            }
        `}</Style>
    );
}

export default function DentistsRoutes() {
    return (
        <Routes>
            <Route index element={<DentistIndex />} />
            <Route path=":slug" element={<DentistProfile />} />
        </Routes>
    );
}
