/**
 * The clinic's dentists — the single source for the team.
 *
 * Why this file exists: doctor-name searches are the highest-converting queries
 * the site has ("dr jean ong" converts at 41.7% against a 0.23% site average),
 * but there was nowhere for them to land. "dr ling dentist" drew 157 impressions
 * at position 9.5 with ZERO clicks, because the only mention of her was a card
 * on /about with no page behind it.
 *
 * Everything here was already published on /about. This moves it into one place
 * so a profile page and the About grid cannot drift apart, and adds a slug,
 * per-page metadata and the fields Person schema needs.
 *
 * ⚠️ THE WORD "SPECIALIST" IS DELIBERATELY NOT USED AS A TITLE.
 * In Malaysia it is protected — it means entry on the Malaysian Dental Council
 * specialist register, not a postgraduate qualification. /about currently labels
 * two dentists "Specialist"; Dr Yeoh's D.Clin.Dent Prosthodontics is a
 * recognised specialist pathway, but a UCLA certificate and MFDS are not, and
 * neither registration has been confirmed. Dr Ong already ruled on the same
 * point for paediatrics (claim 12: "we are not pediatric dentists").
 *
 * So these pages state each qualification verbatim, which is factual and
 * defensible, and let the reader draw the conclusion. Do not add the bare title
 * back without confirming the MDC register entry.
 */

const dentists = [
    {
        slug: 'dr-jean-ong',
        name: 'Dr. Ong Nguk Jean',
        knownAs: 'Dr. Jean Ong',
        role: 'Founder & Dental Surgeon',
        years: '34 years',
        qualifications: 'BDS, University of Malaya',
        bio: 'Passionate about caring for people and families, building genuine long-term relationships that last.',
        languages: 'English, Chinese, Malay, Foo Chow, Cantonese, Hokkien',
        img: '/images/doctors/dr_Jean Ong.jpg',
        keyCompetency: 'General Dentistry, Endodontics / Root Canal Treatment, Occlusion & Smile, Functional Occlusion & Rehabilitation',
        founder: true,
    },
    {
        slug: 'dr-amy-chin',
        name: 'Dr. Amy Chin Mei Kuen',
        knownAs: 'Dr. Amy Chin',
        role: 'Dental Surgeon',
        years: '24 years',
        qualifications: 'BDS, University of Malaya',
        bio: 'Passionate about educating patients and helping them achieve good oral health with confidence.',
        languages: 'English, Malay, Cantonese',
        img: '/images/doctors/dr_Amy Chin Mei Kuen.jpg',
        keyCompetency: 'General Dentistry, Geriatric Dental Care',
    },
    {
        slug: 'dr-ling-yoke-li',
        name: 'Dr. Ling Yoke Li',
        knownAs: 'Dr. Ling',
        role: 'Dental Surgeon',
        years: '20 years',
        qualifications: 'DDS, University of Science Malaysia',
        bio: 'Warm and thoughtful, with a strong focus on early intervention and long-term airway wellness in children.',
        languages: 'English, Chinese, Malay',
        img: '/images/doctors/dr_Ling.jpg',
        keyCompetency: 'Extensive post-graduate training covering paediatric interceptive orthodontics (including myofunctional therapy), functional orthodontics, and airway-focused dentistry for adults and children',
    },
    {
        slug: 'dr-mah-haw-yeng',
        name: 'Dr. Mah Haw Yeng',
        knownAs: 'Dr. Mah',
        role: 'Dental Surgeon',
        years: '24 years',
        qualifications: 'BDS, University of Malaya',
        bio: 'Passionate about families, committed to serving patients wholeheartedly with warmth.',
        languages: 'Mandarin, Cantonese, English, Bahasa Malaysia',
        img: '/images/doctors/dr_Mah Haw Yeng.jpg',
        keyCompetency: 'General Dentistry, Orthodontics (children and adults), Myofunctional Orthodontics',
    },
    {
        slug: 'dr-azelia-lau',
        name: 'Dr. Azelia Lau Yiling',
        knownAs: 'Dr. Azelia Lau',
        role: 'Dental Surgeon',
        years: '17 years',
        qualifications: 'BDS, Nizhny Novgorod State Medical Academy',
        bio: 'Passionate about making dental visits a pleasant experience for patients of all ages.',
        languages: 'English, Malay',
        img: '/images/doctors/dr_Azelia Lau Yiling.jpg',
        keyCompetency: 'General Dentistry, Paediatric Dental Care',
    },
    {
        slug: 'dr-priscilla-chan',
        name: 'Dr. Priscilla Chan Mei Shen',
        knownAs: 'Dr. Priscilla Chan',
        role: 'Dental Surgeon',
        years: '23 years',
        qualifications: 'BDS, University of Malaya',
        bio: 'Passionate about helping children and families overcome their fear of dental treatment.',
        languages: 'English, Chinese, Bahasa Malaysia, Hokkien, Cantonese',
        img: '/images/doctors/dr_Priscilla.jpg',
        keyCompetency: 'General Dentistry, Paediatric Dental Care',
    },
    {
        slug: 'dr-joan-lim',
        name: 'Dr Lim Zhi Yin Joan',
        knownAs: 'Dr. Joan Lim',
        role: 'Dental Surgeon',
        years: '19 years',
        qualifications: 'BDS (Malaya), Cert. Advanced Restorative & Aesthetic Dentistry (UCLA), MFDS (RCS Edinburgh)',
        bio: 'Passionate about advancing restorative and aesthetic dentistry, delivering the highest quality to patients.',
        languages: 'English, Mandarin, Malay',
        img: '/images/doctors/dr_Lim Zhi Yin Joan.jpg',
        keyCompetency: 'Aesthetic Dentistry, Fixed Prosthodontics, Implantology, Smile Design, Full-mouth Rehabilitation',
    },
    {
        slug: 'dr-yeoh-oon-take',
        name: 'Dr Yeoh Oon Take',
        knownAs: 'Dr. Yeoh',
        role: 'Dental Surgeon',
        years: '14 years',
        qualifications: 'BDS (Malaya), D.Clin.Dent Prosthodontics (Melbourne)',
        bio: 'Driven toward continual improvement while delivering functional and long-lasting treatment outcomes.',
        languages: 'Malay, Mandarin, English, Cantonese, Hokkien',
        img: '/images/doctors/dr_yeoh.jpg',
        keyCompetency: 'Dental Implants, Oral Function, Crown and Bridge',
    },
];

/** Page metadata for a dentist. Kept here so the build and the app agree. */
export function dentistSeo(d) {
    return {
        title: `${d.knownAs} — Dentist in Damansara Jaya, PJ | iSmile Dental Clinic`,
        description: `${d.knownAs} is a dental surgeon at iSmile Dental Clinic in Damansara Jaya, Petaling Jaya, with ${d.years} in practice. ${d.qualifications}. Call or WhatsApp to book.`,
    };
}

export function dentistBySlug(slug) {
    return dentists.find((d) => d.slug === slug) || null;
}

export default dentists;
