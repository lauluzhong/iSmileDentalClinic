import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { Reveal } from '../components/Reveal';
import Style from '../components/Style';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';

// Real portraits, same assets the About page uses.
const TEAM_PHOTOS = [
    '/images/doctors/dr_Jean Ong.jpg',
    '/images/doctors/dr_Amy Chin Mei Kuen.jpg',
    '/images/doctors/dr_Ling.jpg',
    '/images/doctors/dr_Mah Haw Yeng.jpg',
    '/images/doctors/dr_Azelia Lau Yiling.jpg',
    '/images/doctors/dr_Priscilla.jpg',
    '/images/doctors/dr_Lim Zhi Yin Joan.jpg',
    '/images/doctors/dr_yeoh.jpg',
];

// Base64 inflates ~33% and the API route caps at 3MB raw, so gate here too.
const MAX_CV_BYTES = 3 * 1024 * 1024;

const STATUS_OPTIONS = [
    'Practising at another clinic',
    'Doing locum sessions',
    'Running my own practice',
    'Recently graduated',
    'Other',
];

const LOOKING_FOR_OPTIONS = [
    'A full-time association',
    'Part-time sessions',
    'Locum sessions',
    'Just exploring',
];

const POINTS = [
    {
        n: '01',
        title: 'An established patient base',
        body: 'Two decades of families who return year after year, with a supportive clinical team beside the chair.',
    },
    {
        n: '02',
        title: 'Room to grow your dentistry',
        body: 'A broad case mix across the family, with digital workflows and multidisciplinary care under one roof.',
    },
    {
        n: '03',
        title: 'A team of family people',
        body: 'Most of us are parents ourselves. Caring for families is not just what we do, it is who we are.',
    },
];

// Dentist path of the Careers hub (5 Nov 2026). Was /join-us; the form, its
// fields and /api/join-notification wiring are unchanged. Only the layout moved
// to the hub's hairline-row language so the hierarchy reads top to bottom.
const CareersDentists = () => {
    const seo = CORE_PAGES.find(p => p.path === 'careers/dentists');
    const [form, setForm] = useState({
        name: '', phone: '', email: '', registration: '', university: '',
        currentPractice: '', currentStatus: '', lookingFor: '', about: '',
        consent: false,
    });
    const [cvFile, setCvFile] = useState(null);
    const [cvError, setCvError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const update = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        setCvError('');
        if (!file) { setCvFile(null); return; }
        if (file.size > MAX_CV_BYTES) {
            setCvFile(null);
            setCvError('Please keep the file under 3MB.');
            e.target.value = '';
            return;
        }
        setCvFile(file);
    };

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitError('');
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                timestamp: new Date().toISOString(),
            };
            delete payload.consent;
            if (cvFile) {
                payload.cv = {
                    filename: cvFile.name,
                    mime: cvFile.type,
                    base64: await fileToBase64(cvFile),
                };
            }
            const res = await fetch('/api/join-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json().catch(() => ({}));
            if (!res.ok || result.sent === false) {
                throw new Error(result.error || 'Something went wrong');
            }
            setSubmitted(true);
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'join_us_submit' });
        } catch (err) {
            console.error(err);
            setSubmitError('We could not send your enquiry just now. Please try again, or WhatsApp us at +60163222135.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cd-page">
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href="https://ismile.com.my/careers/dentists" />
            </Helmet>

            <section className="container cd-hero">
                <Link to="/careers" className="cd-back"><ArrowLeft size={18} aria-hidden="true" /> Careers</Link>
                <Reveal width="100%">
                    <h1 className="statement">Practise at <em>iSmile</em></h1>
                </Reveal>
                <Reveal delay={0.1} width="100%">
                    <p className="cd-lead">
                        Where competency and compassion meet. A family dental practice caring for the same
                        families since 2006, at home in Damansara Jaya today.
                    </p>
                </Reveal>
            </section>

            <div className="container cd-main">
                <section className="cd-section" aria-labelledby="cd-why">
                    <Reveal width="100%"><h2 id="cd-why" className="system-title">What you <em>would find</em></h2></Reveal>
                    <div className="cd-rows">
                        {POINTS.map((p, i) => (
                            <Reveal key={p.n} delay={0.04 * i} width="100%">
                                <div className="cd-row">
                                    <h3>{p.title}</h3>
                                    <p>{p.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                <Reveal width="100%">
                    <section className="cd-team" aria-labelledby="cd-team-title">
                        <div className="cd-team-photos">
                            {TEAM_PHOTOS.map((src) => (
                                <img key={src} src={src} alt="" loading="lazy" width="160" height="160" />
                            ))}
                        </div>
                        <h2 id="cd-team-title">A safe environment to practise</h2>
                        <p>
                            You would be joining a team of practitioners who have cared for the same
                            families for two decades, in a practice where support is always one chair away.
                        </p>
                    </section>
                </Reveal>

                <section className="cd-section cd-apply" aria-labelledby="cd-apply-title" id="apply">
                    <Reveal width="100%">
                        <h2 id="cd-apply-title" className="system-title">Tell us <em>about yourself</em></h2>
                        <p className="cd-apply-sub">
                            We welcome expressions of interest from dental practitioners at every stage of practice.
                            Every enquiry is read personally and treated in confidence.
                        </p>
                    </Reveal>
                {/* Form: fields and wiring unchanged from /join-us */}
                <div className="join-form-wrap">
                    {submitted ? (
                        <div className="join-success">
                            <CheckCircle size={48} style={{ color: 'var(--color-primary-teal)' }} />
                            <h2>Thank you for your interest</h2>
                            <p>We have received your details and will be in touch personally within a few days.</p>
                        </div>
                    ) : (
                        <form className="join-form" onSubmit={handleSubmit}>
                            <div className="join-field-row">
                                <div className="join-field">
                                    <label htmlFor="ju-name">Full name *</label>
                                    <input id="ju-name" type="text" required value={form.name} onChange={update('name')} autoComplete="name" />
                                </div>
                                <div className="join-field">
                                    <label htmlFor="ju-phone">Phone (WhatsApp) *</label>
                                    <input id="ju-phone" type="tel" required value={form.phone} onChange={update('phone')} autoComplete="tel" />
                                </div>
                            </div>

                            <div className="join-field-row">
                                <div className="join-field">
                                    <label htmlFor="ju-email">Email</label>
                                    <input id="ju-email" type="email" value={form.email} onChange={update('email')} autoComplete="email" />
                                </div>
                                <div className="join-field">
                                    <label htmlFor="ju-reg">Year of graduation / MDC registration</label>
                                    <input id="ju-reg" type="text" value={form.registration} onChange={update('registration')} placeholder="e.g. 2019, full registration" />
                                </div>
                            </div>

                            <div className="join-field-row">
                                <div className="join-field">
                                    <label htmlFor="ju-uni">University you graduated from</label>
                                    <input id="ju-uni" type="text" value={form.university} onChange={update('university')} />
                                </div>
                                <div className="join-field">
                                    <label htmlFor="ju-practice">Where are you practising now?</label>
                                    <input id="ju-practice" type="text" value={form.currentPractice} onChange={update('currentPractice')} />
                                </div>
                            </div>

                            <div className="join-field-row">
                                <div className="join-field">
                                    <label htmlFor="ju-status">Your current status</label>
                                    <select id="ju-status" value={form.currentStatus} onChange={update('currentStatus')}>
                                        <option value="">Select one</option>
                                        {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="join-field">
                                    <label htmlFor="ju-looking">What are you looking for?</label>
                                    <select id="ju-looking" value={form.lookingFor} onChange={update('lookingFor')}>
                                        <option value="">Select one</option>
                                        {LOOKING_FOR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="join-field">
                                <label htmlFor="ju-about">A little about you</label>
                                <textarea id="ju-about" rows={4} value={form.about} onChange={update('about')} placeholder="Your clinical interests, the kind of dentistry you enjoy, and anything else you would like us to know." />
                            </div>

                            <div className="join-field">
                                <label htmlFor="ju-cv">Upload your CV (PDF or Word, up to 3MB)</label>
                                <input id="ju-cv" type="file" accept=".pdf,.doc,.docx" onChange={handleFile} />
                                {cvError && <p className="join-error">{cvError}</p>}
                            </div>

                            <label className="join-consent">
                                <input type="checkbox" required checked={form.consent} onChange={update('consent')} />
                                <span>
                                    I consent to iSmile Dental Clinic collecting and using the personal data in this
                                    form, including my CV, to consider and respond to my enquiry, in line with the
                                    Personal Data Protection Act 2010. *
                                </span>
                            </label>

                            {submitError && <p className="join-error">{submitError}</p>}

                            <Button type="submit" data-analytics-click="join-us-submit" disabled={submitting} style={{ padding: '14px 48px', marginTop: '8px', minHeight: '56px' }}>
                                {submitting ? 'Sending…' : 'Submit'}
                            </Button>
                        </form>
                    )}
                </div>
                </section>
            </div>

            <Style>{CSS}</Style>
        </div>
    );
};

const CSS = `
.cd-hero { padding-top: 150px; padding-bottom: 24px; max-width: 820px; }
.cd-back {
    display: inline-flex; align-items: center; gap: 6px; min-height: 44px;
    font-size: 0.9rem; font-weight: 600; color: var(--color-primary-deep); text-decoration: none;
    margin-bottom: 8px; transition: color 0.18s ease;
}
.cd-back:hover { color: var(--color-primary-teal); }
.cd-hero .statement { margin: 0 0 16px; }
.cd-lead { font-size: var(--fs-lead); color: var(--color-text-slate); line-height: 1.6; margin: 0; max-width: 640px; }

.cd-main { max-width: 820px; padding-bottom: var(--space-section); }
.cd-section { padding: 36px 0 0; }
.cd-section .system-title { margin-bottom: 16px; }
.cd-rows { border-top: 1px solid var(--hairline); }
.cd-row {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 24px; align-items: start;
    padding: 20px 0; border-bottom: 1px solid var(--hairline);
}
.cd-row h3 { font-family: var(--font-heading); font-size: 1.08rem; font-weight: 700; color: var(--color-text-charcoal); margin: 0; letter-spacing: -0.01em; }
.cd-row p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.6; margin: 0; }

/* The team: its own quiet band, centred, nothing squeezed beside it. */
.cd-team { text-align: center; padding: 48px 16px 8px; }
.cd-team-photos { display: flex; justify-content: center; flex-wrap: wrap; gap: 14px 0; margin-bottom: 18px; }
.cd-team-photos img {
    width: 44px; height: 44px; border-radius: 50%;
    /* Portraits are 682x1024 with the face in the top quarter; anchor the crop there. */
    object-fit: cover; object-position: 50% 12%;
    margin-left: -8px; border: 2px solid #fff;
}
.cd-team-photos img:first-child { margin-left: 0; }
.cd-team h2 { font-family: var(--font-heading); font-size: var(--fs-h3); font-weight: 700; color: var(--color-text-charcoal); margin: 0 0 8px; letter-spacing: -0.015em; }
.cd-team p { font-size: 0.95rem; color: var(--color-text-slate); line-height: 1.65; margin: 0 auto; max-width: 52ch; }

.cd-apply { padding-top: 44px; }
.cd-apply-sub { color: var(--color-text-slate); font-size: 0.95rem; line-height: 1.6; margin: -6px 0 24px; max-width: 60ch; }

/* Form: the same fields and wording as before (api/join-notification). */
.join-form-wrap { max-width: 720px; }
.join-form, .join-success { text-align: left; }
.join-success { text-align: center; padding: 48px 16px; }
.join-success h2 { margin: 16px 0 8px; font-size: var(--fs-h3); color: var(--color-text-charcoal); }
.join-success p { color: var(--color-text-slate); margin: 0; }
.join-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.join-field { margin-bottom: 18px; display: flex; flex-direction: column; }
.join-field label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-charcoal); margin-bottom: 6px; }
.join-field input[type="text"], .join-field input[type="tel"], .join-field input[type="email"],
.join-field select, .join-field textarea {
    border: 1.5px solid var(--color-tint-blue); border-radius: 16px; min-height: 56px; padding: 12px 14px;
    font-size: 16px; font-family: var(--font-body, inherit); color: var(--color-text-charcoal);
    background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.join-field input:focus, .join-field select:focus, .join-field textarea:focus {
    border-color: var(--color-primary-teal); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-teal) 15%, transparent);
}
.join-field input[type="file"] { font-size: 0.9rem; color: var(--color-text-slate); }
.join-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 0.85rem; color: var(--color-text-slate); line-height: 1.5; margin: 6px 0 18px; cursor: pointer; }
.join-consent input { margin-top: 3px; }
.join-error { color: var(--color-primary-deep); font-size: 0.9rem; margin: 8px 0 0; }

@media (max-width: 768px) {
    .cd-hero { padding-top: 120px; padding-bottom: 16px; }
    .cd-lead { font-size: 1rem; }
    .cd-row { grid-template-columns: 1fr; gap: 4px; padding: 16px 0; }
    .cd-section { padding-top: 28px; }
    .cd-team { padding: 36px 0 0; }
    .cd-apply { padding-top: 36px; }
    .join-field-row { grid-template-columns: 1fr; gap: 0; }
}
`;

export default CareersDentists;
