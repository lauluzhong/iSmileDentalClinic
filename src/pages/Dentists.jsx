import React from 'react';
import { Routes, Route, useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Globe, Award, Clock, GraduationCap } from 'lucide-react';
import dentists, { dentistBySlug, dentistSeo } from '../data/dentists.js';
import Button from '../components/Button';
import { useBooking } from '../context/BookingContext';

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

/* Comma-separated data fields rendered as pills. "Endodontics / Root Canal
   Treatment" contains no comma, so a plain split keeps compound terms whole. */
const toList = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);

function DentistCard({ d }) {
    return (
        <Link to={`/dentists/${d.slug}`} className="dentist-card">
            <div className="dentist-card-media">
                <img src={d.img} alt={d.knownAs} loading="lazy" width="220" height="220" />
            </div>
            <div className="dentist-card-body">
                <h2 className="dentist-card-name">{d.knownAs}</h2>
                <p className="dentist-card-role">{d.role}</p>
                <p className="dentist-card-meta"><Clock size={14} /> {d.years} in practice</p>
                <span className="dentist-card-cta">View profile <ArrowRight size={15} /></span>
            </div>
        </Link>
    );
}

function DentistIndex() {
    return (
        <div className="dentists-page">
            <Helmet>
                <title>Our Dentists in Damansara Jaya, Petaling Jaya | iSmile Dental Clinic</title>
                <meta name="description" content="Meet the dentists at iSmile Dental Clinic in Damansara Jaya, Petaling Jaya. Eight dental surgeons with 14 to 34 years in practice across general, paediatric, orthodontic and restorative care." />
                <link rel="canonical" href={`${SITE}/dentists`} />
            </Helmet>

            <div className="container dentists-header">
                <p className="dentists-eyebrow">Our team</p>
                <h1>Our dentists</h1>
                <p className="dentists-intro">
                    Our team in Damansara Jaya covers general, paediatric, orthodontic and restorative
                    care between them, with 14 to 34 years in practice each. If you would like to see a
                    particular dentist, say so when you book and the front desk
                    will arrange it for you where possible.
                </p>
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
    const others = dentists.filter((x) => x.slug !== d.slug).slice(0, 4);

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
                    <Link to="/dentists" className="dentist-back">
                        <ArrowLeft size={16} /> All dentists
                    </Link>

                    <div className="dentist-profile-head">
                        <div className="dentist-profile-imgwrap">
                            <img src={d.img} alt={d.knownAs} className="dentist-profile-img" width="280" height="280" />
                        </div>
                        <div className="dentist-profile-intro">
                            <p className="dentist-profile-role">{d.role}</p>
                            <h1 className="dentist-profile-name">{d.knownAs}</h1>
                            <p className="dentist-profile-bio">{d.bio}</p>
                            <div className="dentist-profile-chips">
                                <span className="dentist-chip"><Clock size={14} /> {d.years} in practice</span>
                                <span className="dentist-chip"><GraduationCap size={14} /> {d.qualifications}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dentist-profile">
                <div className="dentist-facts">
                    <div className="dentist-fact">
                        <dt><span className="dentist-fact-icon"><Globe size={17} /></span> Languages</dt>
                        <dd>
                            <span className="dentist-pills">
                                {toList(d.languages).map((l) => <em key={l}>{l}</em>)}
                            </span>
                        </dd>
                    </div>
                    {d.keyCompetency && (
                        <div className="dentist-fact">
                            <dt><span className="dentist-fact-icon"><Award size={17} /></span> Areas of focus</dt>
                            <dd>
                                <span className="dentist-pills">
                                    {toList(d.keyCompetency).map((c) => <em key={c}>{c}</em>)}
                                </span>
                            </dd>
                        </div>
                    )}
                </div>

                <div className="dentist-cta">
                    <h2>Book an appointment</h2>
                    <p>
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
                                <img src={o.img} alt={o.knownAs} loading="lazy" width="96" height="96" />
                                <span>
                                    <strong>{o.knownAs}</strong>
                                    <em>{o.role}</em>
                                </span>
                                <ArrowRight size={15} className="dentist-other-arrow" />
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
        <style>{`
            .dentists-page { padding: 170px 0 80px; }
            .dentists-page-profile { padding-top: 0; }

            .dentists-eyebrow {
                margin: 0 0 10px; font-family: var(--font-heading, sans-serif);
                font-size: .8125rem; font-weight: 600; text-transform: uppercase;
                letter-spacing: .12em; color: var(--color-primary-teal, #008DB0);
            }
            .dentists-header { max-width: 720px; }
            .dentists-header h1 { margin: 0 0 16px; letter-spacing: -0.02em; }
            .dentists-intro { font-size: 1.0625rem; line-height: 1.7; color: var(--color-text-grey, #555); }

            .dentists-grid {
                display: grid; gap: 24px; margin-top: 48px;
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            }
            .dentist-card {
                display: flex; flex-direction: column; text-decoration: none; color: inherit;
                border: 1px solid rgba(0, 110, 140, 0.10); border-radius: 20px; overflow: hidden;
                background: #fff; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
            }
            .dentist-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 16px 36px rgba(0, 110, 140, 0.12);
                border-color: rgba(0, 141, 176, 0.35);
            }
            .dentist-card-media {
                background: linear-gradient(180deg, #EAF4F8 0%, #F7FBFD 100%);
                overflow: hidden;
            }
            .dentist-card-media img {
                width: 100%; height: 250px; object-fit: cover; object-position: top;
                display: block; transition: transform .35s ease;
            }
            .dentist-card:hover .dentist-card-media img { transform: scale(1.04); }
            .dentist-card-body { display: flex; flex-direction: column; flex: 1; padding: 20px 20px 22px; }
            .dentist-card-name { font-size: 1.125rem; margin: 0 0 4px; }
            .dentist-card-role { margin: 0 0 10px; color: var(--color-primary-teal, #008DB0); font-size: .9375rem; font-weight: 500; }
            .dentist-card-meta {
                display: inline-flex; align-items: center; gap: 6px;
                margin: 0 0 16px; font-size: .875rem; color: var(--color-text-grey, #666);
            }
            .dentist-card-cta {
                display: inline-flex; align-items: center; gap: 6px; margin-top: auto;
                font-family: var(--font-heading, sans-serif); font-weight: 600; font-size: .875rem;
                color: var(--color-primary-deep, #006E8C);
            }
            .dentist-card-cta svg { transition: transform .2s ease; }
            .dentist-card:hover .dentist-card-cta svg { transform: translateX(3px); }

            .dentist-hero {
                padding: 150px 0 56px;
                background: linear-gradient(180deg, #EAF4F8 0%, rgba(247, 250, 252, 0) 100%);
            }
            .dentist-profile { max-width: 860px; }
            .dentist-back {
                display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
                color: var(--color-text-grey, #666); font-size: .9375rem; margin-bottom: 32px;
            }
            .dentist-back:hover { color: var(--color-primary-teal, #008DB0); }
            .dentist-profile-head { display: flex; gap: 40px; align-items: center; flex-wrap: wrap; }
            .dentist-profile-imgwrap {
                flex-shrink: 0; border-radius: 24px; overflow: hidden;
                box-shadow: 0 20px 44px rgba(0, 110, 140, 0.16);
            }
            .dentist-profile-img { width: 280px; height: 280px; object-fit: cover; object-position: top; display: block; }
            .dentist-profile-intro { flex: 1; min-width: 280px; }
            .dentist-profile-role {
                margin: 0 0 8px; color: var(--color-primary-teal, #008DB0);
                font-family: var(--font-heading, sans-serif); font-weight: 600;
                font-size: .875rem; text-transform: uppercase; letter-spacing: .1em;
            }
            .dentist-profile-name { margin: 0 0 14px; letter-spacing: -0.02em; }
            .dentist-profile-bio { margin: 0 0 22px; font-size: 1.0625rem; line-height: 1.7; color: var(--color-text-grey, #555); }
            .dentist-profile-chips { display: flex; flex-wrap: wrap; gap: 10px; }
            .dentist-chip {
                display: inline-flex; align-items: center; gap: 7px;
                padding: 8px 14px; border-radius: 50px; background: #fff;
                border: 1px solid rgba(0, 110, 140, 0.14);
                font-size: .875rem; color: var(--color-text-slate, #475569);
            }
            .dentist-chip svg { color: var(--color-primary-teal, #008DB0); }

            .dentist-facts { display: grid; gap: 20px; margin: 40px 0 0; }
            .dentist-fact {
                padding: 24px 26px; border-radius: 20px; background: #fff;
                border: 1px solid rgba(0, 110, 140, 0.10);
            }
            .dentist-fact dt {
                display: flex; align-items: center; gap: 10px; font-weight: 600;
                font-family: var(--font-heading, sans-serif);
                font-size: .8125rem; text-transform: uppercase; letter-spacing: .06em;
                color: var(--color-text-slate, #475569); margin-bottom: 14px;
            }
            .dentist-fact-icon {
                display: inline-flex; align-items: center; justify-content: center;
                width: 34px; height: 34px; border-radius: 10px;
                background: #EAF4F8; color: var(--color-primary-teal, #008DB0);
            }
            .dentist-fact dd { margin: 0; font-size: 1rem; line-height: 1.6; }
            .dentist-pills { display: flex; flex-wrap: wrap; gap: 8px; }
            .dentist-pills em {
                font-style: normal; font-size: .875rem; line-height: 1.4;
                padding: 7px 13px; border-radius: 50px;
                background: #EAF4F8; color: var(--color-primary-deep, #006E8C);
            }

            .dentist-cta {
                margin-top: 48px; padding: 36px; border-radius: 24px; color: #fff;
                background: linear-gradient(135deg, var(--color-primary-deep, #006E8C) 0%, var(--color-primary-teal, #008DB0) 60%, var(--color-sky-blue, #4FB3D1) 100%);
            }
            .dentist-cta h2 { margin: 0 0 10px; font-size: 1.375rem; color: #fff; }
            .dentist-cta p { margin: 0 0 22px; line-height: 1.7; color: rgba(255, 255, 255, 0.92); max-width: 560px; }
            .dentist-cta .btn {
                background: #fff; color: var(--color-primary-deep, #006E8C);
                border: none; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
            }
            .dentist-cta .btn:hover { transform: translateY(-2px); background: #F2F8FB; }

            .dentist-others { margin-top: 64px; }
            .dentist-others h2 { font-size: 1.25rem; margin: 0 0 20px; }
            .dentist-others-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
            .dentist-other {
                display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit;
                padding: 14px; border-radius: 16px; background: #fff;
                border: 1px solid rgba(0, 110, 140, 0.10);
                transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
            }
            .dentist-other:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 24px rgba(0, 110, 140, 0.10);
                border-color: rgba(0, 141, 176, 0.3);
            }
            .dentist-other img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; object-position: top; }
            .dentist-other span { display: flex; flex-direction: column; flex: 1; }
            .dentist-other strong { font-size: .9375rem; }
            .dentist-other em { font-style: normal; font-size: .8125rem; color: var(--color-text-grey, #777); }
            .dentist-other-arrow { color: var(--color-primary-teal, #008DB0); opacity: 0; transition: opacity .2s ease; }
            .dentist-other:hover .dentist-other-arrow { opacity: 1; }

            @media (max-width: 768px) {
                .dentists-page { padding: 110px 0 60px; }
                .dentists-page-profile { padding-top: 0; }
                .dentist-hero { padding: 110px 0 40px; }
                .dentist-profile-head { gap: 24px; }
                .dentist-profile-imgwrap { width: 100%; }
                .dentist-profile-img { width: 100%; height: 320px; }
                .dentist-cta { padding: 26px; }
            }
        `}</style>
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
