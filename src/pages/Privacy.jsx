import React from 'react';
import LegalPage from '../components/LegalPage';

const CONTACT = 'WhatsApp or call +60 16-322 2135, email ismile.general@gmail.com, or visit us at 75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya, Selangor.';

const sections = [
    { heading: 'Who we are', body: [
        'iSmile Dental Clinic is a family dental clinic at 75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya, Selangor, Malaysia. We are responsible for the personal data described here, in line with the Personal Data Protection Act 2010 (PDPA).',
    ] },
    { heading: 'What we collect', body: [[
        'Website booking and enquiry form: your name, phone number, email and what you are interested in.',
        'Patient registration form and pre-visit forms (such as the airway form): the details you fill in, including contact, medical and dental history, and details of a parent or guardian for children.',
        'Messages and comments you send us on Instagram, Facebook, LinkedIn and X, including your name and any phone or WhatsApp number you choose to share.',
        'WhatsApp chats with the clinic.',
        'Job applications: your name, contact details, the role and your CV.',
        'Website analytics: how the site is used, collected through Google Analytics and Google Tag Manager using cookies. This does not identify you by name.',
    ]] },
    { heading: 'Why we use it', body: [[
        'To reply to you and answer your questions.',
        'To arrange, confirm and remind you about appointments.',
        'To provide your dental care and keep your clinical records.',
        'To follow up about the enquiry you made.',
        'To consider your job application.',
        'To understand how our website is used so we can improve it.',
    ], 'We only send marketing messages if you have agreed to receive them. You can stop them at any time by replying "stop" or telling us.'] },
    { heading: 'Facebook and Instagram', body: [
        'Information we receive through Facebook or Instagram, such as your messages, comments and profile name, is used only to respond to you and help with your enquiry. We never sell it, and we do not use it for anything else.',
    ] },
    { heading: 'Who handles your data', body: [
        'Your data is handled by our clinic staff. We also use trusted service providers who store or process it for us:',
        [
            'Google (Sheets, Drive and Analytics)',
            'Meta (Facebook, Instagram and WhatsApp)',
            'Vercel, which hosts our website',
            'A social media management tool we use to manage our social media messages and posts',
            'Our own secure server, which helps us manage messages and appointments',
        ],
        'These providers may store data outside Malaysia. We do not sell your personal data to anyone. We only share it with others when the law requires it, or with your consent.',
    ] },
    { heading: 'How long we keep it', body: [
        'We keep patient records for as long as required by Malaysian law and professional guidelines for dental records. Enquiries, messages and job applications that do not lead to treatment or employment are kept only as long as needed to deal with them, and are then deleted. You can ask us to delete your data at any time; see our Data Deletion page.',
    ] },
    { heading: 'Keeping it safe', body: [
        'We limit access to the staff who need it, and use password-protected systems and secure connections. No system is perfectly secure, but we take care to protect your information.',
    ] },
    { heading: 'Your rights', body: [[
        'Ask for a copy of the personal data we hold about you.',
        'Ask us to correct data that is wrong or out of date.',
        'Withdraw your consent, for example to marketing messages, at any time.',
        'Ask us to delete your data, as explained on our Data Deletion page.',
    ], 'We will reply within 21 days, as the PDPA requires.'] },
    { heading: 'Contact us', body: [
        `For any question or request about your personal data: ${CONTACT}`,
        'We may update this policy from time to time. The latest version is always on this page.',
    ] },
];

const Privacy = () => (
    <LegalPage
        title={<>Privacy <em>policy</em></>}
        metaTitle="Privacy Policy | iSmile Dental Clinic"
        description="How iSmile Dental Clinic in Damansara Jaya, Petaling Jaya collects, uses and protects your personal data under the Personal Data Protection Act 2010."
        path="/privacy"
        updated="11 November 2026"
        lead="This page explains what personal data we collect, why we collect it, who handles it and the choices you have. We keep it in plain words."
        sections={sections}
    />
);

export default Privacy;
