import React from 'react';
import LegalPage from '../components/LegalPage';

const sections = [
    { heading: 'How to ask', body: [
        'Send us a message using either of these:',
        [
            'WhatsApp +60 16-322 2135',
            'Email ismile.general@gmail.com',
        ],
        'Please include your full name, the phone number or social media account you used to contact us, and what you would like deleted (for example, your Facebook or Instagram messages, a website enquiry, or everything).',
    ] },
    { heading: 'What happens next', body: [[
        'We confirm we have received your request within 3 working days.',
        'We may ask a simple question to check the request is really from you.',
        'We delete your data within 30 days and let you know when it is done.',
    ]] },
    { heading: 'Data we may need to keep', body: [
        'If you have been a patient, Malaysian law requires us to keep your dental records for a set period. We will delete everything else, such as messages and enquiries, and tell you what we must keep and why.',
    ] },
    { heading: 'Facebook and Instagram', body: [
        'This includes any information we received when you messaged or commented on our Facebook or Instagram pages. You can also remove your own comments directly in the app at any time.',
    ] },
];

const DataDeletion = () => (
    <LegalPage
        title={<>Delete your <em>data</em></>}
        metaTitle="Data Deletion | iSmile Dental Clinic"
        description="How to ask iSmile Dental Clinic to delete your personal data, including data from Facebook and Instagram messages. Requests completed within 30 days."
        path="/data-deletion"
        updated="11 November 2026"
        lead="You can ask us to delete the personal data we hold about you at any time. Here is how."
        sections={sections}
    />
);

export default DataDeletion;
