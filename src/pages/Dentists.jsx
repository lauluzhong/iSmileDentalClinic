import React from 'react';
import { Routes, Route, useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Globe, Award, Clock } from 'lucide-react';
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

function DentistCard({ d }) {
    return (
        <Link to={`/dentists/${d.slug}`} className="dentist-card">
            <img src={d.img} alt={d.knownAs} className="dentist-card-img" loading="lazy" width="220" height="220" />
            <div className="dentist-card-body">
                <h2 className="dentist-card-name">{d.knownAs}</h2>
                <p className="dentist-card-role">{d.role}{d.founder ? ' · Founder' : ''}</p>
                <p className="dentist-card-quals">{d.qualifications}</p>
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
                <h1>Our dentists</h1>
                <p className="dentists-intro">
                    Our team in Damansara Jaya covers general, paediatric, orthodontic and restorative
                    care between them, with 14 to 34 years in practice each. If you would like to see a
                    particular dentist, say so when you book and the front desk will arrange it where
                    the diary allows.
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
        <div className="dentists-page">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <link rel="canonical" href={`${SITE}/dentists/${d.slug}`} />
                <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
            </Helmet>

            <div className="container dentist-profile">
                <Link to="/dentists" className="dentist-back">
                    <ArrowLeft size={16} /> All dentists
                </Link>

                <div className="dentist-profile-head">
                    <img src={d.img} alt={d.knownAs} className="dentist-profile-img" width="260" height="260" />
                    <div>
                        <h1 className="dentist-profile-name">{d.knownAs}</h1>
                        <p className="dentist-profile-role">
                            {d.role}{d.founder ? ', and founder of iSmile Dental Clinic' : ''}, Damansara Jaya
                        </p>
                        <p className="dentist-profile-bio">{d.bio}</p>
                    </div>
                </div>

                <dl className="dentist-facts">
                    <div className="dentist-fact">
                        <dt><Award size={16} /> Qualifications</dt>
                        <dd>{d.qualifications}</dd>
                    </div>
                    <div className="dentist-fact">
                        <dt><Clock size={16} /> In practice</dt>
                        <dd>{d.years}</dd>
                    </div>
                    <div className="dentist-fact">
                        <dt><Globe size={16} /> Languages</dt>
                        <dd>{d.languages}</dd>
                    </div>
                    {d.keyCompetency && (
                        <div className="dentist-fact dentist-fact-wide">
                            <dt><Award size={16} /> Areas of focus</dt>
                            <dd>{d.keyCompetency}</dd>
                        </div>
                    )}
                </dl>

                <div className="dentist-cta">
                    <h2>Book an appointment</h2>
                    <p>
                        We are at 75 &amp; 75A, Jalan SS 22/23, Damansara Jaya, Petaling Jaya. If you
                        would like to see a particular dentist, let the front desk know and they will
                        arrange it where the diary allows.
                    </p>
                    {/* The first argument prefills the booking form's free-text field, which
                        becomes the body of the pre-typed WhatsApp message. It is deliberately
                        EMPTY here. Every other page seeds a page-specific opener, but naming a
                        dentist would put a doctor-specific request in the patient's mouth before
                        they have asked for one, and the front desk assigns the diary. If a patient
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
                                <img src={o.img} alt={o.knownAs} loading="lazy" width="72" height="72" />
                                <span>
                                    <strong>{o.knownAs}</strong>
                                    <em>{o.role}</em>
                                </span>
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
            .dentists-page { padding: 140px 0 80px; }
            .dentists-header { max-width: 720px; }
            .dentists-header h1 { margin: 0 0 16px; letter-spacing: -0.02em; }
            .dentists-intro { font-size: 1.0625rem; line-height: 1.7; color: var(--color-text-grey, #555); }

            .dentists-grid {
                display: grid; gap: 24px; margin-top: 48px;
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            }
            .dentist-card {
                display: block; text-decoration: none; color: inherit;
                border: 1px solid rgba(0,0,0,0.08); border-radius: 18px; overflow: hidden;
                background: #fff; transition: transform .2s ease, box-shadow .2s ease;
            }
            .dentist-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
            .dentist-card-img { width: 100%; height: 240px; object-fit: cover; display: block; }
            .dentist-card-body { padding: 18px 18px 22px; }
            .dentist-card-name { font-size: 1.125rem; margin: 0 0 4px; }
            .dentist-card-role { margin: 0 0 8px; color: var(--color-primary-teal, #4FA3C2); font-size: .9375rem; }
            .dentist-card-quals { margin: 0; font-size: .875rem; line-height: 1.5; color: var(--color-text-grey, #666); }

            .dentist-profile { max-width: 820px; }
            .dentist-back {
                display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
                color: var(--color-text-grey, #666); font-size: .9375rem; margin-bottom: 28px;
            }
            .dentist-back:hover { color: var(--color-primary-teal, #4FA3C2); }
            .dentist-profile-head { display: flex; gap: 32px; align-items: flex-start; flex-wrap: wrap; }
            .dentist-profile-img { width: 260px; height: 260px; object-fit: cover; border-radius: 20px; flex-shrink: 0; }
            .dentist-profile-name { margin: 0 0 6px; letter-spacing: -0.02em; }
            .dentist-profile-role { margin: 0 0 16px; color: var(--color-primary-teal, #4FA3C2); font-size: 1rem; }
            .dentist-profile-bio { margin: 0; font-size: 1.0625rem; line-height: 1.7; color: var(--color-text-grey, #555); }

            .dentist-facts {
                display: grid; gap: 20px 32px; margin: 48px 0 0;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            }
            .dentist-fact-wide { grid-column: 1 / -1; }
            .dentist-facts dt {
                display: flex; align-items: center; gap: 7px; font-weight: 600;
                font-size: .8125rem; text-transform: uppercase; letter-spacing: .06em;
                color: var(--color-text-grey, #777); margin-bottom: 6px;
            }
            .dentist-facts dd { margin: 0; font-size: 1rem; line-height: 1.6; }

            .dentist-cta {
                margin-top: 56px; padding: 32px; border-radius: 20px;
                background: var(--color-tint-blue, #F2F8FB);
            }
            .dentist-cta h2 { margin: 0 0 10px; font-size: 1.375rem; }
            .dentist-cta p { margin: 0 0 20px; line-height: 1.7; color: var(--color-text-grey, #555); }

            .dentist-others { margin-top: 64px; }
            .dentist-others h2 { font-size: 1.25rem; margin: 0 0 20px; }
            .dentist-others-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
            .dentist-other {
                display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;
                padding: 10px; border-radius: 14px; transition: background .2s ease;
            }
            .dentist-other:hover { background: rgba(0,0,0,0.035); }
            .dentist-other img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
            .dentist-other span { display: flex; flex-direction: column; }
            .dentist-other strong { font-size: .9375rem; }
            .dentist-other em { font-style: normal; font-size: .8125rem; color: var(--color-text-grey, #777); }

            @media (max-width: 768px) {
                .dentists-page { padding: 110px 0 60px; }
                .dentist-profile-head { gap: 22px; }
                .dentist-profile-img { width: 100%; height: 300px; }
                .dentist-cta { padding: 24px; }
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
