// Careers hub listings (team roles). Dental practitioners use /careers/dentists.
//
// Source: "People & Competence/Job Descriptions (Oct 2026)" (v2 PDFs). Wording
// follows those JDs; titles follow Contracts/GOVERNANCE.md ("Dental Surgery
// Assistant", "Front Desk Associate"). No pay is ever shown here.
//
// `open: false` hides a role from the list and its page returns 404, so a JD
// can stay on file without being advertised. Add a role = add an object.

export const JOBS = [
  {
    slug: 'front-desk-associate',
    title: 'Front Desk Associate',
    type: 'Full-time',
    location: 'Damansara Jaya, Petaling Jaya',
    hours: 'Monday to Friday, 9:00am to 5:30pm. Saturday, 9:00am to 3:30pm.',
    experience: '2 years',
    open: true,
    summary: 'The first and last person every patient meets. You keep the day running smoothly and make sure everyone feels welcome.',
    responsibilities: [
      ['Patient reception', 'Greet and assist patients on arrival, by phone and on WhatsApp, in a welcoming and professional manner.'],
      ['Appointment management', 'Manage the appointment schedule, including confirmations, reminders and rebooking.'],
      ['Records and documentation', 'Register new patients and maintain accurate, confidential patient records in the clinic\'s systems.'],
      ['Billing and payment', 'Explain payment steps, collect payments, issue receipts and reconcile daily transactions in line with clinic procedures.'],
      ['Patient enquiries', 'Handle enquiries and concerns professionally, and escalate to management where necessary.'],
      ['Clinic coordination', 'Work closely with the doctors and Dental Surgery Assistants, keep the reception area presentable, and perform other duties as assigned.'],
    ],
    requirements: [
      '2 years of working experience in a front desk, reception, customer service or other client-facing role.',
      'Fluent in English and Mandarin, spoken and written. Bahasa Malaysia is an advantage.',
      'Strong administrative and organisational skills, with attention to detail and accuracy.',
      'Excellent communication skills and a courteous, composed manner, including during busy periods.',
      'Proficient with computers and able to learn new systems quickly.',
      'Dental or medical clinic experience is an advantage. No specific field of study required.',
    ],
    offer: [
      'Training on the clinic\'s systems and procedures',
      'A supportive team in a family dental clinic',
      'Clear expectations and opportunities to grow',
    ],
  },
  {
    slug: 'social-media-marketing-executive',
    title: 'Social Media Marketing Executive',
    type: 'Full-time',
    location: 'Damansara Jaya, Petaling Jaya',
    hours: '',
    experience: 'Fresh graduates welcome',
    open: true,
    summary: 'Build iSmile\'s presence on social media with real clinic content, run our channels and look after the people who talk to us online.',
    responsibilities: [
      ['Content creation', 'Plan, shoot and edit short-form videos for the clinic\'s channels, including patient experience and educational content.'],
      ['Channel management', 'Manage and publish content on Instagram, Facebook, TikTok, YouTube Shorts, X and Threads, following a content calendar.'],
      ['Community engagement', 'Respond to comments and messages promptly and professionally.'],
      ['Performance and targets', 'Own agreed monthly targets for reach, engagement and enquiries, and report on results.'],
      ['Collaboration', 'Work with the doctors and Dental Surgery Assistants to plan content, and support marketing initiatives as assigned.'],
      ['Compliance', 'Ensure content is accurate and complies with clinic guidelines and applicable regulations, including written patient consent and privacy.'],
    ],
    requirements: [
      'Diploma or Bachelor\'s degree in Marketing, Communications, Media or a related field. Fresh graduates welcome.',
      'Experience managing social media accounts (personal, university or internship). Portfolio or work samples preferred.',
      'Proficient in shooting and editing short-form video using a smartphone and common editing applications.',
      'Good written and spoken English. Mandarin or Bahasa Malaysia is an advantage.',
      'Creative, self-motivated and organised, with strong ownership of results.',
      'Comfortable on or behind the camera, and respectful of patient confidentiality.',
    ],
    offer: [
      'Training and guidance from the team',
      'A supportive team in a family dental clinic',
      'Opportunities to try new ideas and grow',
    ],
  },
];

export const OPEN_JOBS = JOBS.filter((j) => j.open);
export const findJob = (slug) => OPEN_JOBS.find((j) => j.slug === slug) || null;

// The "nothing fits, send your CV anyway" door on the careers page.
export const GENERAL_APPLICATION = {
  slug: 'general',
  title: 'General application',
  type: 'Any role',
  location: 'Damansara Jaya, Petaling Jaya',
};
