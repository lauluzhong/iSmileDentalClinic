/**
 * SEO copy + crawlable content for the core (non-service, non-blog) pages.
 *
 * These routes previously served the bare SPA shell, so a crawler that doesn't
 * execute JS saw nothing. The build prerenders them from this file.
 *
 * ${RATING} / ${COUNT} are filled at build time from review-stats.json — never
 * hardcode review figures. Use fillStats() from ./serviceSeo.js.
 */

export const CORE_PAGES = [
  {
    path: 'contact',
    title: "Contact iSmile Dental Clinic — Damansara Jaya, PJ",
    description: "iSmile Dental Clinic, 75 & 75A Jalan SS 22/23, Damansara Jaya PJ. Open Mon–Fri 9:30am–5:30pm, Sat till 3:30pm. Rated ${RATING}★ by ${COUNT} patients — WhatsApp to book.",
    h1: "Get in Touch",
    intro: "iSmile Dental Clinic is a family dental practice in Damansara Jaya, Petaling Jaya, caring for Selangor families since 2006. Appointments are by booking — call or WhatsApp us.",
    facts: [
      "Address: 75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya, Selangor, Malaysia",
      "Phone / WhatsApp: +60163222135",
      "Hours: Monday–Friday 9:30 AM – 5:30 PM; Saturday 9:30 AM – 3:30 PM; Sunday closed",
      "Ground floor with full wheelchair access. Street parking available around the clinic.",
    ],
  },
  {
    path: 'faq',
    title: "Dentist FAQs — Petaling Jaya | iSmile Dental Clinic",
    description: "Common questions about visiting iSmile Dental Clinic in Damansara Jaya, PJ — appointments, payment, X-ray safety, children’s first visits and dental emergencies.",
    h1: "Common Questions",
    intro: "Answers to the questions patients ask us most often about visiting iSmile Dental Clinic in Damansara Jaya, Petaling Jaya.",
    faqSections: [
      {
        category: "Visiting & Payments",
        questions: [
          { q: "Where can I park?", a: "There is street parking is available around the clinic. For your convenience, there is also covered parking at Atria Shopping Gallery just a short 1 minute walk from our clinic." },
          { q: "How do I schedule a visit?", a: "We operate strictly by appointment to ensure every patient receives dedicated care. Please call or WhatsApp us at +60163222135 to schedule your visit." },
          { q: "Do you accept credit cards?", a: "Yes, we accept all major credit cards, including Visa and Mastercard. We also support various E-wallets and DuitNow QR transfers for a contactless payment experience." },
          { q: "How can I obtain information regarding the pricing of treatments?", a: "Treatment costs vary based on individual needs. During your consultation, we will provide a personalized treatment plan and a clear breakdown of costs before you proceed." },
          { q: "Is the clinic wheelchair accessible?", a: "Yes, we are located on the ground floor with full wheelchair access. We also have allocated parking right in front of the clinic for those who may need easier access, such as wheelchair users or our elderly patients." },
        ],
      },
      {
        category: "General Dental Care",
        questions: [
          { q: "How often should I visit the dentist?", a: "We recommend a routine check-up and professional cleaning every 6 months. Regular visits help maintain optimal oral health and allow us to detect potential issues before they become serious." },
          { q: "What should I do in a dental emergency?", a: "If you experience severe pain, swelling, or a dental injury, please reach out to us at +60163222135. We prioritize emergency cases and will do our best to provide same-day care." },
          { q: "Are dental X-rays (radiographs) safe?", a: "Your safety is our top priority. We use advanced digital 2D and 3D imaging technology, which offers high-definition clarity with minimal radiation exposure. These radiographs are vital for safe and accurate treatment. Rest assured, we strictly adhere to the highest safety standards to protect our patients." },
        ],
      },
      {
        category: "Children's Dental Care",
        questions: [
          { q: "At what age should my child first see a dentist?", a: "We recommend bringing your child for their first dental visit by their first birthday or when their first tooth erupts. Early visits help children feel comfortable and establish good lifelong habits." },
          { q: "Can I bring my children with me?", a: "Absolutely! We are a family-oriented clinic and we love seeing children. Our team is trained to provide a gentle, step-by-step introduction to dentistry to ensure a positive and anxiety-free experience for your little ones." },
          { q: "What kind of dental services do you offer for children?", a: "We provide comprehensive paediatric dental care including routine check-ups, fluoride treatments, and pit & fissure sealants to prevent decay. We also specialize in early interceptive orthodontics and myofunctional therapy to support healthy jaw growth and airway development." },
        ],
      },
    ],
  },
  {
    path: 'reviews',
    title: "iSmile Reviews — ${RATING}★ Dentist in Petaling Jaya",
    description: "Rated ${RATING}★ from ${COUNT} Google reviews. See what patients say about iSmile Dental Clinic in Damansara Jaya, Petaling Jaya — then WhatsApp us to book.",
    h1: "Stories from our community",
    intro: "iSmile Dental Clinic is rated ${RATING}★ from ${COUNT} Google reviews by patients in Damansara Jaya and across Petaling Jaya.",
  },
  {
    path: 'about',
    title: "About iSmile — Family Dental Clinic in Petaling Jaya",
    description: "Meet the team at iSmile Dental Clinic, Damansara Jaya — a family practice caring for Petaling Jaya smiles since 2006. WhatsApp us to book a visit.",
    h1: "Where Competency and Compassion Meet",
    intro: "iSmile Dental Clinic has been a family dental practice in Damansara Jaya, Petaling Jaya since 2006, founded by principal dentist Dr Ong. We care for families across Selangor — from children’s first visits through to implants and orthodontics.",
  },
  {
    // In sitemap.xml since forever, but never prerendered — the services hub
    // was still serving the bare SPA shell after the 2026-07-28 sprint
    // prerendered its children. Found by the 2026-07-29 link audit.
    path: 'services',
    title: "Dental Services in Petaling Jaya | iSmile Dental Clinic",
    description: "Family dental care in Damansara Jaya, PJ — preventive and root canal treatment, braces and clear aligners, implants, cosmetic dentistry and children's dentistry.",
    h1: "Our Dental Services",
    intro: "iSmile Dental Clinic in Damansara Jaya, Petaling Jaya provides family dental care across five areas. Every treatment starts with a consultation so we can recommend what genuinely suits you.",
    facts: [
      "Protect Your Teeth — check-ups, cleaning, fillings, root canal treatment and wisdom tooth surgery",
      "Straighten Your Teeth — traditional braces, clear aligners and myofunctional orthodontics",
      "Replace Missing Teeth — dental implants, bridges and dentures",
      "Enhance Your Smile — teeth whitening, veneers and cosmetic dentistry",
      "Children's Dentistry — first visits, preventive care and early growth assessment",
    ],
  },
  {
    path: 'blog',
    title: "Dental Health Advice for PJ Families | iSmile Dental",
    description: "Practical dental advice for Petaling Jaya families — children’s dentistry, orthodontics, oral surgery and preventive care from the iSmile team.",
    h1: "Learning Centre",
    intro: "Practical dental advice for Petaling Jaya families from the team at iSmile Dental Clinic, Damansara Jaya.",
    listsBlogIndex: true,
  },
];

/**
 * Homepage pre-render copy.
 *
 * Kept separate from CORE_PAGES because the homepage is NOT written as its own
 * dist/<path>/index.html — dist/index.html is also the SPA fallback shell that
 * vercel.json rewrites every unmatched route to. The build injects this content
 * into the existing dist/index.html (preserving its head verbatim) and guards it
 * with a pathname check so it only ever shows on "/". See vite-plugin-blog-ssg.js.
 *
 * Copy mirrors the hero in src/pages/Home.jsx — keep the two in sync.
 */
export const HOME_PAGE = {
  h1: "Dental care for every generation",
  eyebrow: "A family practice in Petaling Jaya · Est. 2006",
  intro: "From a child's first visit to a grandparent's new smile, iSmile is the dentist whole families stay with. Honest advice, gentle hands, and care that's looked after Petaling Jaya households for nearly two decades.",
  trust: "Rated ${RATING}★ on Google from ${COUNT} reviews · 20+ years of trusted care",
  hero: {
    alt: "Three generations of a family smiling together at iSmile Dental Clinic",
    base: "/images/family_hero_three_generations",
    portraitBase: "/images/family_hero_three_generations_portrait",
    width: 1024,
    height: 624,
    sizes: "(max-width: 768px) 150vw, 50vw",
  },
  sections: [
    { h2: "Comprehensive care for every stage of life", p: "A child's first check-up. Braces in the teenage years. A grandparent's new smile. One team that knows your family and grows with it." },
    { h2: "Where competency and compassion meet", p: "iSmile Dental Clinic has cared for families in Damansara Jaya, Petaling Jaya since 2006 — general dentistry, orthodontics, implants, cosmetic dentistry and children's dentistry under one roof." },
    { h2: "Visit us in Damansara Jaya", p: "75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya, Selangor. Open Monday–Friday 9:30 AM – 5:30 PM and Saturday 9:30 AM – 3:30 PM. Call or WhatsApp +60163222135 to book." },
  ],
};
