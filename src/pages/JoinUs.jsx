import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
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

const JoinUs = () => {
    const seo = CORE_PAGES.find(p => p.path === 'join-us');
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
        <div className="join-us-page">
            <Helmet>
                <title>{fillStats(seo.title, reviewStats)}</title>
                <meta name="description" content={fillStats(seo.description, reviewStats)} />
                <link rel="canonical" href="https://ismile.com.my/join-us" />
            </Helmet>

            <section className="container join-hero-section">
                <div className="join-hero">
                    <Reveal width="100%">
                        <span className="join-hero-eyebrow">
                            <span className="join-eyebrow-mark" aria-hidden="true" />
                            <span className="join-eyebrow-text">For dental practitioners</span>
                            <span className="join-eyebrow-year">Est. 2006</span>
                        </span>
                    </Reveal>
                    <Reveal width="100%">
                        <h1 className="join-title">
                            Practise at <em>iSmile</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.1} width="100%">
                        <p className="join-lead">
                            Where competency and compassion meet. A family dental practice in Damansara
                            Jaya, caring for the same families since 2006.
                        </p>
                    </Reveal>
                </div>
            </section>

            <div className="section-padding join-main">
              <div className="container">
                {/* Editorial split: numbered points + the team */}
                <div className="join-split">
                    <div className="join-points">
                        {POINTS.map((p, i) => (
                            <Reveal key={p.n} delay={0.05 * i} width="100%">
                                <div className="join-point">
                                    <span className="join-point-n">{p.n}</span>
                                    <div>
                                        <h2>{p.title}</h2>
                                        <p>{p.body}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={0.1} width="100%">
                        <div className="join-team">
                            <div className="join-team-photos">
                                {TEAM_PHOTOS.map((src) => (
                                    <img key={src} src={src} alt="" loading="lazy" width="160" height="160" />
                                ))}
                            </div>
                            <h2>A safe environment to practise</h2>
                            <p>
                                You would be joining a team of practitioners who have cared for the same
                                families for two decades, in a practice where support is always one chair away.
                            </p>
                        </div>
                    </Reveal>
                </div>

                <Reveal width="100%">
                    <p className="join-invite">
                        We welcome expressions of interest from dental practitioners at every stage of practice.
                    </p>
                </Reveal>

                {/* Form */}
                <div className="join-form-wrap">
                    {submitted ? (
                        <div className="join-success">
                            <CheckCircle size={48} style={{ color: 'var(--color-primary-teal)' }} />
                            <h2>Thank you for your interest</h2>
                            <p>We have received your details and will be in touch personally within a few days.</p>
                        </div>
                    ) : (
                        <form className="join-form" onSubmit={handleSubmit}>
                            <h2 className="join-form-title">Tell us about yourself</h2>
                            <p className="join-form-sub">Every enquiry is read personally and treated in confidence.</p>

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

                            <Button type="submit" data-analytics-click="join-us-submit" disabled={submitting} style={{ padding: '14px 48px', marginTop: '8px' }}>
                                {submitting ? 'Sending…' : 'Submit'}
                            </Button>
                        </form>
                    )}
                </div>
              </div>
            </div>

            <Style>{`
        /* no opaque page background — the shared hero tint (index.css) shows through */
        .join-hero-section { padding-top: 180px; padding-bottom: 72px; text-align: center; }

        .join-hero {
            text-align: center;
            max-width: 760px;
            margin: 0 auto;
        }

        .join-hero-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 0;
            background: none;
            margin-bottom: 22px;
        }
        .join-eyebrow-mark {
            width: 10px; height: 10px; border-radius: 50%;
            background: var(--color-primary-deep); flex-shrink: 0;
        }
        .join-eyebrow-text {
            font-family: var(--font-heading); font-size: 0.82rem; font-weight: 600; color: var(--color-text-charcoal);
            letter-spacing: 0.04em;
        }
        .join-eyebrow-year {
            position: relative; padding-left: 14px; font-family: var(--font-heading); font-size: 0.72rem; font-weight: 600;
            letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-primary-deep);
        }
        .join-eyebrow-year::before { content: ''; position: absolute; left: 0; top: 50%; width: 1px; height: 14px; transform: translateY(-50%); background: var(--hairline-strong); }

        .join-title {
            font-size: var(--fs-statement);
            font-weight: 700;
            line-height: 1.05;
            letter-spacing: -0.03em;
            margin: 0 0 20px;
        }
        .join-lead {
            font-size: var(--fs-lead);
            color: var(--color-text-slate);
            line-height: 1.6;
            margin: 0 auto;
            max-width: 640px;
        }
        .join-main {
            padding-top: 0;
        }
        .join-invite {
            text-align: center;
            font-size: 1.05rem;
            color: var(--color-text-slate);
            line-height: 1.6;
            max-width: 720px;
            margin: 0 auto 40px;
            font-weight: 500;
        }

        /* Editorial split */
        .join-split {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            gap: 32px;
            align-items: stretch;
            max-width: 1060px;
            margin: 0 auto 80px;
            text-align: left;
        }

        /* Three points across (litmus pass, 8 Sep 2026): they were stacked
           rows eating vertical space; side by side under thin top rules they
           read as one composed band, like the homepage's row language. */
        .join-points {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 40px;
        }
        .join-point {
            display: block;
            border-top: 1px solid var(--hairline);
            
            padding: 24px 0 0;
        }
        .join-point .join-point-n { display: block; margin-bottom: 12px; }
        @media (max-width: 1024px) {
            .join-points { grid-template-columns: 1fr; gap: 0; }
            .join-point { padding: 22px 0; }
        }
        .join-point-n {
            font-family: var(--font-heading, sans-serif);
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            color: var(--color-primary-teal);
            font-variant-numeric: tabular-nums;
        }
        .join-point h2 {
            font-size: 1.22rem;
            font-weight: 700;
            color: var(--color-text-charcoal);
            margin: 0 0 6px;
            letter-spacing: -0.018em;
        }
        .join-point p {
            font-size: 0.95rem;
            color: var(--color-text-slate);
            line-height: 1.65;
            margin: 0;
        }

        .join-team {
            height: 100%;
            padding: 10px 0;
            text-align: center;
        }
        .join-team-photos {
            display: flex;
            justify-content: center;
            margin-bottom: 22px;
        }
        .join-team-photos {
            flex-wrap: wrap;
            gap: 14px 0;
        }
        .join-team-photos img {
            width: 40px; height: 40px;
            border-radius: 50%;
            /* Portraits are 682x1024 with the face in the top quarter —
               anchor the crop there or the circle shows the torso. */
            object-fit: cover;
            object-position: 50% 12%;
            margin-left: -8px;
        }
        .join-team-photos img:first-child { margin-left: 0; }
        .join-team h2 {
            font-size: var(--fs-h2);
            font-weight: 700;
            color: var(--color-text-charcoal);
            margin: 0 0 10px;
            letter-spacing: -0.015em;
        }
        .join-team p {
            font-size: 0.95rem;
            color: var(--color-text-slate);
            line-height: 1.65;
            margin: 0;
        }

        .join-form-wrap {
            max-width: 720px;
            margin: 0 auto;
        }
        .join-form, .join-success {
            border-top: 1px solid var(--hairline);
            padding: 44px 0 0;
            text-align: left;
        }
        .join-success {
            text-align: center;
            padding: 60px 36px;
        }
        .join-success h2 { margin: 16px 0 8px; color: var(--color-text-charcoal); }
        .join-success p { color: var(--color-text-slate); margin: 0; }

        .join-form-title { font-size: var(--fs-h2); font-weight: 700; color: var(--color-text-charcoal); margin: 0 0 6px; }
        .join-form-sub { color: var(--color-text-slate); font-size: 0.95rem; margin: 0 0 28px; }

        .join-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .join-field { margin-bottom: 18px; display: flex; flex-direction: column; }
        .join-field label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-text-charcoal);
            margin-bottom: 6px;
        }
        .join-field input[type="text"],
        .join-field input[type="tel"],
        .join-field input[type="email"],
        .join-field select,
        .join-field textarea {
            border: 1.5px solid var(--color-tint-blue);
            border-radius: 16px;
            min-height: 56px;
            padding: 12px 14px;
            font-size: 0.95rem;
            font-family: var(--font-body, inherit);
            color: var(--color-text-charcoal);
            background: var(--color-background);
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .join-field input:focus, .join-field select:focus, .join-field textarea:focus {
            border-color: var(--color-primary-teal);
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-teal) 15%, transparent);
        }
        .join-field input[type="file"] { font-size: 0.9rem; color: var(--color-text-slate); }

        .join-consent {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            font-size: 0.85rem;
            color: var(--color-text-slate);
            line-height: 1.5;
            margin: 6px 0 18px;
            cursor: pointer;
        }
        .join-consent input { margin-top: 3px; }

        .join-error { color: var(--color-primary-deep); font-size: 0.9rem; margin: 8px 0 0; }

        @media (max-width: 900px) {
            .join-split { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 768px) {
            .join-hero-section {
                padding-top: 140px;
                padding-bottom: 60px;
            }
            .join-main { padding-top: 0; }
            .join-title { font-size: var(--fs-statement); }
            .join-lead {
                font-size: 1rem;
                line-height: 1.6;
            }
            .join-point {
                grid-template-columns: 38px 1fr;
                gap: 14px;
                padding: 20px 0;
            }
            .join-point-n {
                font-size: 0.72rem;
            }
            .join-point h2 {
                font-size: 1.08rem;
                line-height: 1.25;
            }
            .join-point p {
                font-size: 0.92rem;
                line-height: 1.58;
            }
            .join-team { padding: 18px 0; }
            .join-team-photos img { width: 40px; height: 40px; margin-left: -8px; }
            .join-field-row { grid-template-columns: 1fr; gap: 0; }
            .join-form, .join-success { padding: 30px 0 0; }
            .join-split { gap: 18px; margin-bottom: 28px; }
            .join-invite {
                margin-bottom: 28px;
                font-size: 1rem;
            }
        }
      `}</Style>
        </div>
    );
};

export default JoinUs;
