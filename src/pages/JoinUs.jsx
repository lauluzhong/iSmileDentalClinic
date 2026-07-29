import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { Stethoscope, Users, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { Reveal } from '../components/Reveal';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';

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

const JoinUs = () => {
    const seo = CORE_PAGES.find(p => p.path === 'join-us');
    const [form, setForm] = useState({
        name: '', phone: '', email: '', registration: '',
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
                <div className="join-content text-center">
                    <Reveal width="100%">
                        <h1 className="hero-title mb-4" style={{ fontSize: '3rem', fontWeight: 700 }}>
                            Practise at <span className="text-gradient">iSmile</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2} width="100%">
                        <p className="lead-text" style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '760px', margin: '20px auto 40px', lineHeight: '1.6' }}>
                            iSmile is a family dental practice in Damansara Jaya, Petaling Jaya, caring for
                            the same families since 2006. We welcome expressions of interest from dental
                            practitioners at every stage of practice.
                        </p>
                    </Reveal>

                    <div className="join-highlights">
                        <div className="join-highlight">
                            <div className="icon-box"><Users /></div>
                            <h2>An established patient base</h2>
                            <p>Two decades of families who return year after year, with a supportive clinical team beside the chair.</p>
                        </div>
                        <div className="join-highlight">
                            <div className="icon-box"><Stethoscope /></div>
                            <h2>Room to grow your dentistry</h2>
                            <p>A broad case mix across the family, with digital workflows including cone beam CT imaging on site.</p>
                        </div>
                        <div className="join-highlight">
                            <div className="icon-box"><Clock /></div>
                            <h2>Arrangements that fit you</h2>
                            <p>Session-based arrangements shaped around your stage of practice, from locum sessions to a full-time association.</p>
                        </div>
                    </div>

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

                                <div className="join-field">
                                    <label htmlFor="ju-practice">Where are you practising now?</label>
                                    <input id="ju-practice" type="text" value={form.currentPractice} onChange={update('currentPractice')} />
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
                                    {submitting ? 'Sending…' : 'Send my details'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .join-highlights {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            max-width: 1000px;
            margin: 0 auto 60px;
            text-align: left;
        }
        .join-highlight {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 28px 24px;
        }
        .join-highlight .icon-box {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: #f0f9ff;
            color: var(--color-primary-teal, #4FA3C2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }
        .join-highlight h2 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 8px;
        }
        .join-highlight p {
            font-size: 0.95rem;
            color: #64748b;
            line-height: 1.6;
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

        @media (max-width: 768px) {
            .join-highlights { grid-template-columns: 1fr; }
            .join-field-row { grid-template-columns: 1fr; gap: 0; }
            .join-form { padding: 28px 20px; }
        }
      `}</style>
        </div>
    );
};

export default JoinUs;
