import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Button from './Button';
import Style from './Style';

// CV application form (careers pages). Floating labels, 56px targets, white
// fields: the website form language from BookingModal. Posts to
// /api/careers-apply, which records the row in the clinic's Sheet and hands the
// CV to the clinic's own delivery path. Nothing is kept in the browser.

const MAX_CV_BYTES = 3 * 1024 * 1024;
const ACCEPT = '.pdf,.doc,.docx';

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export default function CareersApplyForm({ role, roleSlug, idPrefix = 'ca' }) {
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', consent: false });
    const [cvFile, setCvFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const update = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validateField = (field, value) => {
        if (field === 'name' && !value.trim()) return 'Please enter your name.';
        if (field === 'phone' && !/^\+?[0-9 ().-]{7,20}$/.test(value.trim())) return 'Please enter a phone number we can reach you on.';
        if (field === 'email' && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please check the email address.';
        return '';
    };
    const onBlur = (field) => (e) => {
        const msg = validateField(field, e.target.value);
        setErrors((prev) => ({ ...prev, [field]: msg }));
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        setErrors((prev) => ({ ...prev, cv: '' }));
        if (!file) { setCvFile(null); return; }
        if (file.size > MAX_CV_BYTES) {
            setCvFile(null);
            setErrors((prev) => ({ ...prev, cv: 'Please keep the file under 3MB.' }));
            e.target.value = '';
            return;
        }
        setCvFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        const next = {
            name: validateField('name', form.name),
            phone: validateField('phone', form.phone),
            email: validateField('email', form.email),
            cv: cvFile ? '' : 'Please attach your CV.',
        };
        setErrors(next);
        if (Object.values(next).some(Boolean)) return;

        setSubmitError('');
        setSubmitting(true);
        try {
            const payload = {
                role, roleSlug,
                name: form.name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                message: form.message.trim(),
                timestamp: new Date().toISOString(),
                cv: { filename: cvFile.name, mime: cvFile.type, base64: await fileToBase64(cvFile) },
            };
            const res = await fetch('/api/careers-apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json().catch(() => ({}));
            if (!res.ok || result.ok === false) throw new Error(result.error || 'Something went wrong');
            setSubmitted(true);
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'careers_apply_submit', role: roleSlug });
        } catch (err) {
            console.error(err);
            setSubmitError('We could not send your application just now. Please try again, or WhatsApp us at +60163222135.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="ca-success" role="status">
                <CheckCircle size={48} style={{ color: 'var(--color-primary-teal)' }} aria-hidden="true" />
                <h2>Thank you, we have your application</h2>
                <p>We read every application personally. If your experience fits the role, we will be in touch on WhatsApp within a few days.</p>
                <Style>{CSS}</Style>
            </div>
        );
    }

    const fl = (field, extra = '') => `fl${form[field].trim() ? ' filled' : ''}${errors[field] ? ' fl-error' : ''}${extra}`;

    return (
        <form className="ca-form" onSubmit={handleSubmit} noValidate data-analytics-form="careers-apply">
            <div className="ca-row">
                <div className="ca-group">
                    <div className={fl('name')}>
                        <input id={`${idPrefix}-name`} type="text" value={form.name} onChange={update('name')} onBlur={onBlur('name')}
                            autoComplete="name" placeholder="Your full name" aria-invalid={errors.name ? 'true' : undefined} required />
                        <label htmlFor={`${idPrefix}-name`}>Full name *</label>
                    </div>
                    {errors.name && <p className="ca-error">{errors.name}</p>}
                </div>
                <div className="ca-group">
                    <div className={fl('phone')}>
                        <input id={`${idPrefix}-phone`} type="tel" value={form.phone} onChange={update('phone')} onBlur={onBlur('phone')}
                            autoComplete="tel" inputMode="tel" placeholder="012 345 6789" aria-invalid={errors.phone ? 'true' : undefined} required />
                        <label htmlFor={`${idPrefix}-phone`}>Phone (WhatsApp) *</label>
                    </div>
                    {errors.phone && <p className="ca-error">{errors.phone}</p>}
                </div>
            </div>

            <div className="ca-group">
                <div className={fl('email')}>
                    <input id={`${idPrefix}-email`} type="email" value={form.email} onChange={update('email')} onBlur={onBlur('email')}
                        autoComplete="email" inputMode="email" placeholder="you@example.com" aria-invalid={errors.email ? 'true' : undefined} />
                    <label htmlFor={`${idPrefix}-email`}>Email</label>
                </div>
                {errors.email && <p className="ca-error">{errors.email}</p>}
            </div>

            <div className="ca-group">
                <div className={fl('message', ' fl-area')}>
                    <textarea id={`${idPrefix}-message`} rows={4} value={form.message} onChange={update('message')}
                        placeholder="Where you have worked, when you could start, and anything else you would like us to know." />
                    <label htmlFor={`${idPrefix}-message`}>A little about you</label>
                </div>
            </div>

            <div className="ca-group">
                <label className={`ca-file${cvFile ? ' has-file' : ''}${errors.cv ? ' ca-file-error' : ''}`} htmlFor={`${idPrefix}-cv`}>
                    <span className="ca-file-label">{cvFile ? cvFile.name : 'Attach your CV *'}</span>
                    <span className="ca-file-hint">{cvFile ? 'Tap to change' : 'PDF or Word, up to 3MB'}</span>
                    <input id={`${idPrefix}-cv`} type="file" accept={ACCEPT} onChange={handleFile} />
                </label>
                {errors.cv && <p className="ca-error">{errors.cv}</p>}
            </div>

            <label className="ca-consent">
                <input type="checkbox" checked={form.consent} onChange={update('consent')} required />
                <span>
                    I consent to iSmile Dental Clinic collecting and using the personal data in this form,
                    including my CV, to consider my application, in line with the Personal Data Protection Act 2010. *
                </span>
            </label>

            {submitError && <p className="ca-error" role="alert">{submitError}</p>}

            <Button type="submit" data-analytics-click="careers-apply-submit" disabled={submitting} className="ca-submit">
                {submitting ? 'Sending…' : 'Send application'}
            </Button>
            <Style>{CSS}</Style>
        </form>
    );
}

const CSS = `
.ca-form { text-align: left; }
.ca-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
.ca-group { margin-bottom: 16px; }

.fl { position: relative; }
.fl input, .fl textarea {
    display: block; width: 100%; min-height: 56px;
    padding: 24px 16px 8px;
    border: 1.5px solid var(--color-tint-blue); border-radius: 16px;
    font-family: var(--font-body); font-size: 16px; color: var(--color-text-main);
    background: #fff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.fl textarea { resize: vertical; line-height: 1.45; }
.fl label {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    margin: 0; font-weight: 400; font-size: 15px; line-height: 1.2; color: #64748B;
    pointer-events: none; max-width: calc(100% - 32px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: top 0.18s cubic-bezier(.22,.7,.3,1), transform 0.18s cubic-bezier(.22,.7,.3,1),
                font-size 0.18s cubic-bezier(.22,.7,.3,1), color 0.15s ease;
}
.fl-area textarea { padding-top: 30px; min-height: 120px; }
.fl-area label { top: 16px; transform: none; white-space: normal; line-height: 1.25; }
.fl:focus-within label, .fl.filled label { top: 9px; transform: none; font-size: 12px; font-weight: 500; color: #475569; }
.fl input::placeholder, .fl textarea::placeholder { color: transparent; transition: color 0.15s ease; }
.fl input:focus::placeholder, .fl textarea:focus::placeholder { color: #9AA7B4; }
.fl input:hover, .fl textarea:hover { border-color: var(--color-pastel-blue); }
.fl input:focus, .fl textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 4px var(--color-tint-blue); }
.fl-error input, .fl-error textarea { border-color: #dc2626; }
.fl-error label { color: #b91c1c; }

.ca-file {
    display: flex; flex-direction: column; justify-content: center; gap: 2px;
    min-height: 56px; padding: 10px 16px; cursor: pointer;
    border: 1.5px dashed var(--color-pastel-blue); border-radius: 16px; background: #fff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.ca-file:hover { border-color: var(--color-primary-teal); }
.ca-file:focus-within { border-color: var(--color-primary); box-shadow: 0 0 0 4px var(--color-tint-blue); }
.ca-file.has-file { border-style: solid; border-color: var(--color-primary-teal); }
.ca-file.ca-file-error { border-color: #dc2626; }
.ca-file-label { font-size: 15px; color: var(--color-text-charcoal); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ca-file-hint { font-size: 12px; color: #64748B; }
.ca-file input { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }

.ca-consent {
    display: flex; gap: 12px; align-items: flex-start;
    font-size: 0.85rem; color: var(--color-text-slate); line-height: 1.5;
    margin: 4px 0 20px; cursor: pointer;
}
.ca-consent input { margin-top: 3px; width: 18px; height: 18px; flex: none; accent-color: var(--color-primary-teal); }
.ca-error { color: #b91c1c; font-size: 0.85rem; margin: 6px 0 0 2px; }
.ca-submit { padding: 16px 44px; min-height: 56px; }

.ca-success { text-align: center; padding: 48px 16px; }
.ca-success h2 { margin: 16px 0 8px; font-size: var(--fs-h3); color: var(--color-text-charcoal); }
.ca-success p { color: var(--color-text-slate); margin: 0 auto; max-width: 48ch; line-height: 1.6; }

@media (max-width: 640px) {
    .ca-row { grid-template-columns: 1fr; gap: 0; }
    .ca-submit { width: 100%; }
}
`;
