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
        body: 'A broad case mix across the family, with digital workflows including cone beam CT imaging on site.',
    },
    {
        n: '03',
        title: 'An environment where you can learn',
        body: 'Experienced colleagues to discuss cases with, whatever stage of practice you are at.',
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

            <div className="container section-padding" style={{ paddingTop: '180px' }}>

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
                    <Reveal delay={0.15} width="100%">
                        <p className="join-lead">
                            iSmile is a family dental practice in Damansara Jaya, Petaling Jaya, caring for
                            the same families since 2006. We welcome expressions of interest from dental
                            practitioners at every stage of practice.
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
                                    <img key={src} src={src} alt="" loading="lazy" width="64" height="64" />
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

            <style>{`
        .join-us-page {
            background: linear-gradient(180deg, #FFFFFF 0%, #eff6ff 100%);
        }

        .join-hero { text-align: center; max-width: 800px; margin: 0 auto 64px; }

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
            font-size: var(--fs-h1, 3.2rem);
            font-weight: 700;
            line-height: 1.08;
            letter-spacing: -0.025em;
            margin: 0 0 20px;
        }
        .join-lead {
            font-size: 1.15rem;
            color: var(--color-text-muted, #64748b);
            line-height: 1.65;
            margin: 0 auto;
            max-width: 680px;
        }

        /* Editorial split */
        .join-split {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            gap: 48px;
            align-items: center;
            max-width: 1000px;
            margin: 0 auto 80px;
            text-align: left;
        }

        .join-point {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            padding: 22px 0;
        }
        .join-point + .join-point,
        .join-points > div + div .join-point {
            border-top: 1px solid rgba(148, 163, 184, 0.25);
        }
        .join-point-n {
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: var(--color-primary-teal, #4FA3C2);
            padding-top: 4px;
            font-variant-numeric: tabular-nums;
        }
        .join-point h2 {
            font-size: 1.15rem;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 6px;
            letter-spacing: -0.01em;
        }
        .join-point p {
            font-size: 0.95rem;
            color: #64748b;
            line-height: 1.65;
            margin: 0;
        }

        /* Team card */
        .join-team-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(79, 163, 194, 0.2);
            border-radius: 24px;
            padding: 36px 32px;
            text-align: center;
            box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
        }
        .join-team-photos {
            display: flex;
            justify-content: center;
            margin-bottom: 22px;
        }
        .join-team-photos img {
            width: 64px; height: 64px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #fff;
            box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
            margin-left: -14px;
        }
        .join-team-photos img:first-child { margin-left: 0; }
        .join-team-card h2 {
            font-size: 1.3rem;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 10px;
            letter-spacing: -0.015em;
        }
        .join-team-card p {
            font-size: 0.95rem;
            color: #64748b;
            line-height: 1.65;
            margin: 0;
        }

        .join-form-wrap {
            max-width: 720px;
            margin: 0 auto;
        }
        .join-form, .join-success {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 40px 36px;
            text-align: left;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
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
            .join-hero { margin-bottom: 40px; }
            .join-title { font-size: 2.2rem; }
            .join-lead { font-size: 1.05rem; }
            .join-eyebrow { display: none; }
            .join-team-photos img { width: 52px; height: 52px; margin-left: -12px; }
            .join-field-row { grid-template-columns: 1fr; gap: 0; }
            .join-form { padding: 28px 20px; }
            .join-split { margin-bottom: 56px; }
        }
      `}</style>
        </div>
    );
};

export default JoinUs;
