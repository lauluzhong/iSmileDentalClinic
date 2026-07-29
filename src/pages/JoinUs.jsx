import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { Stethoscope, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { Reveal } from '../components/Reveal';
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

            {/* section-padding zeroes horizontal padding, so it must wrap the
                container, never share its div — combined, the page loses its
                side gutters on mobile. */}
            <div className="section-padding join-main">
              <div className="container">

                {/* Hero */}
                <div className="join-hero">
                    <Reveal width="100%">
                        <span className="join-eyebrow">
                            <span className="join-eyebrow-mark"><Stethoscope size={13} /></span>
                            <span className="join-eyebrow-text">For dental practitioners</span>
                            <span className="join-eyebrow-year">Est. 2006</span>
                        </span>
                    </Reveal>
                    <Reveal width="100%">
                        <h1 className="join-title">
                            Practise at <span className="text-gradient">iSmile</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.1} width="100%">
                        <p className="join-tagline">Where competency and compassion meet</p>
                    </Reveal>
                    <Reveal delay={0.15} width="100%">
                        <p className="join-lead">
                            iSmile is a family dental practice in Damansara Jaya, Petaling Jaya, caring for
                            the same families since 2006. We believe dentistry is at its best where
                            competency meets compassion. That is what we stand for, chairside and beyond.
                        </p>
                    </Reveal>
                </div>

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
                        <div className="join-team-card">
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
                            <CheckCircle size={48} style={{ color: 'var(--color-primary-teal, #4FA3C2)' }} />
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

            <style>{`
        .join-us-page {
            background:
                radial-gradient(circle at 8% 10%, rgba(79, 179, 209, 0.15), transparent 27rem),
                linear-gradient(180deg, #eef8fc 0%, #f7fbfd 42%, #eaf5fb 100%);
        }

        .join-main {
            padding-top: 148px;
        }

        .join-hero {
            position: relative;
            overflow: hidden;
            text-align: center;
            max-width: 940px;
            margin: 0 auto 72px;
            padding: 72px clamp(28px, 7vw, 88px);
            border: 1px solid rgba(0, 141, 176, 0.14);
            border-radius: 36px;
            background:
                radial-gradient(circle at 88% 12%, rgba(79, 179, 209, 0.24), transparent 18rem),
                linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(216, 238, 245, 0.74));
            box-shadow: 0 24px 70px rgba(0, 110, 140, 0.12);
        }
        .join-hero::before,
        .join-hero::after {
            content: "";
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
        }
        .join-hero::before {
            width: 190px;
            height: 190px;
            left: -105px;
            bottom: -100px;
            border: 34px solid rgba(0, 141, 176, 0.06);
        }
        .join-hero::after {
            width: 10px;
            height: 10px;
            right: 42px;
            bottom: 38px;
            background: var(--color-gold, #E0A500);
            box-shadow: 18px -13px 0 rgba(0, 141, 176, 0.34);
        }
        .join-hero > * {
            position: relative;
            z-index: 1;
        }

        /* Eyebrow chip — mirrors the Home hero eyebrow */
        .join-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 14px 7px 9px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.75);
            border: 1px solid rgba(79, 163, 194, 0.25);
            box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
            margin-bottom: 22px;
        }
        .join-eyebrow-mark {
            display: flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: rgba(79, 163, 194, 0.12);
            color: var(--color-primary-teal, #4FA3C2);
        }
        .join-eyebrow-text {
            font-size: 0.85rem; font-weight: 600; color: #334155;
            letter-spacing: 0.01em;
        }
        .join-eyebrow-year {
            font-size: 0.8rem; font-weight: 600; color: #94a3b8;
            padding-left: 10px; border-left: 1px solid #e2e8f0;
        }

        .join-title {
            font-size: clamp(3rem, 6vw, 5rem);
            font-weight: 750;
            line-height: 0.98;
            letter-spacing: -0.045em;
            margin: 0 0 24px;
        }
        .join-tagline {
            font-family: var(--font-heading, sans-serif);
            font-size: clamp(1.2rem, 2vw, 1.55rem);
            font-weight: 600;
            letter-spacing: -0.015em;
            color: var(--color-primary-deep, #006E8C);
            margin: 0 0 18px;
        }
        .join-lead {
            font-size: 1.08rem;
            color: #475569;
            line-height: 1.75;
            margin: 0 auto;
            max-width: 650px;
        }
        .join-invite {
            text-align: center;
            font-size: 1.1rem;
            color: #174b5b;
            line-height: 1.6;
            max-width: 720px;
            margin: 0 auto 40px;
            padding: 22px 28px;
            font-weight: 600;
            border: 1px solid rgba(0, 141, 176, 0.18);
            border-radius: 18px;
            background: rgba(216, 238, 245, 0.58);
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

        .join-points {
            display: grid;
            gap: 14px;
        }
        .join-point {
            display: grid;
            grid-template-columns: 46px 1fr;
            gap: 20px;
            align-items: flex-start;
            height: 100%;
            padding: 23px 24px;
            border: 1px solid rgba(0, 141, 176, 0.13);
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.78);
            box-shadow: 0 8px 24px rgba(0, 110, 140, 0.05);
        }
        .join-point-n {
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            border-radius: 13px;
            font-family: var(--font-heading, sans-serif);
            font-size: 0.8rem;
            font-weight: 750;
            letter-spacing: 0.06em;
            color: #fff;
            background: linear-gradient(135deg, var(--color-primary-deep, #006E8C), var(--color-sky-blue, #4FB3D1));
            box-shadow: 0 7px 16px rgba(0, 141, 176, 0.2);
            font-variant-numeric: tabular-nums;
        }
        .join-point h2 {
            font-size: 1.22rem;
            font-weight: 700;
            color: #16313b;
            margin: 0 0 6px;
            letter-spacing: -0.018em;
        }
        .join-point p {
            font-size: 0.95rem;
            color: #536b75;
            line-height: 1.65;
            margin: 0;
        }

        /* Team card */
        .join-team-card {
            height: 100%;
            background:
                radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.19), transparent 17rem),
                linear-gradient(155deg, #006e8c 0%, #008db0 58%, #4fb3d1 100%);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 24px;
            padding: 44px 34px;
            text-align: center;
            box-shadow: 0 22px 48px rgba(0, 110, 140, 0.2);
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
            width: 80px; height: 80px;
            border-radius: 50%;
            /* Portraits are 682x1024 with the face in the top quarter —
               anchor the crop there or the circle shows the torso. */
            object-fit: cover;
            object-position: 50% 12%;
            border: 3px solid #fff;
            box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
            margin-left: -16px;
        }
        .join-team-photos img:first-child { margin-left: 0; }
        .join-team-card h2 {
            font-size: 1.45rem;
            font-weight: 700;
            color: #fff;
            margin: 0 0 10px;
            letter-spacing: -0.015em;
        }
        .join-team-card p {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.65;
            margin: 0;
        }

        .join-form-wrap {
            max-width: 720px;
            margin: 0 auto;
        }
        .join-form, .join-success {
            background: rgba(255, 255, 255, 0.94);
            border: 1px solid rgba(0, 141, 176, 0.14);
            border-radius: 24px;
            padding: 44px 40px;
            text-align: left;
            box-shadow: 0 18px 45px rgba(0, 110, 140, 0.09);
        }
        .join-success {
            text-align: center;
            padding: 60px 36px;
        }
        .join-success h2 { margin: 16px 0 8px; color: #1e293b; }
        .join-success p { color: #64748b; margin: 0; }

        .join-form-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0 0 6px; }
        .join-form-sub { color: #64748b; font-size: 0.95rem; margin: 0 0 28px; }

        .join-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .join-field { margin-bottom: 18px; display: flex; flex-direction: column; }
        .join-field label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 6px;
        }
        .join-field input[type="text"],
        .join-field input[type="tel"],
        .join-field input[type="email"],
        .join-field select,
        .join-field textarea {
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 0.95rem;
            font-family: var(--font-body, inherit);
            color: #1e293b;
            background: #fff;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .join-field input:focus, .join-field select:focus, .join-field textarea:focus {
            border-color: var(--color-primary-teal, #4FA3C2);
            box-shadow: 0 0 0 3px rgba(79, 163, 194, 0.15);
        }
        .join-field input[type="file"] { font-size: 0.9rem; color: #475569; }

        .join-consent {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            font-size: 0.85rem;
            color: #64748b;
            line-height: 1.5;
            margin: 6px 0 18px;
            cursor: pointer;
        }
        .join-consent input { margin-top: 3px; }

        .join-error { color: #dc2626; font-size: 0.9rem; margin: 8px 0 0; }

        @media (max-width: 900px) {
            .join-split { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 768px) {
            .join-main { padding-top: 112px; }
            .join-hero {
                margin: 0 auto 28px;
                padding: 38px 20px 40px;
                border-radius: 24px;
            }
            .join-title { font-size: clamp(2.45rem, 12vw, 3.25rem); }
            .join-lead {
                font-size: 1rem;
                line-height: 1.68;
            }
            .join-eyebrow { display: none; }
            .join-tagline {
                font-size: 1.12rem;
                line-height: 1.3;
                margin-bottom: 14px;
            }
            .join-points { gap: 12px; }
            .join-point {
                grid-template-columns: 38px 1fr;
                gap: 14px;
                padding: 20px 17px;
                border-radius: 16px;
            }
            .join-point-n {
                width: 36px;
                height: 36px;
                border-radius: 11px;
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
            .join-team-card {
                padding: 34px 18px 32px;
                border-radius: 20px;
            }
            .join-team-photos img { width: 64px; height: 64px; margin-left: -13px; }
            .join-field-row { grid-template-columns: 1fr; gap: 0; }
            .join-form { padding: 30px 20px; }
            .join-split { gap: 18px; margin-bottom: 28px; }
            .join-invite {
                margin-bottom: 28px;
                padding: 18px 16px;
                font-size: 1rem;
                text-align: left;
            }
        }
      `}</style>
        </div>
    );
};

export default JoinUs;
