/**
 * Single source of truth for service-page SEO copy.
 *
 * Both the React specialty pages and the build-time prerenderer
 * (vite-plugin-blog-ssg.js) read from here, so the crawlable static HTML and
 * the rendered page can never drift apart.
 *
 * ${RATING} and ${COUNT} are substituted at build time from
 * src/data/review-stats.json (kept current by the review_stats_sync cron) —
 * never hardcode review figures here.
 */

export const SERVICE_CATEGORIES = [
  {
    path: 'services/protect',
    title: "Root Canal & Wisdom Tooth Surgery, PJ | iSmile",
    description: "Protect & repair your teeth at iSmile Damansara Jaya, Petaling Jaya — check-ups, root canal treatment & wisdom tooth surgery. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/protect",
  },
  {
    path: 'services/straighten',
    title: "Braces & Clear Aligners in Petaling Jaya | iSmile",
    description: "Straighten your teeth at our Damansara Jaya clinic — braces & clear aligners for adults and teens. Rated ${RATING}★ on Google. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/straighten",
  },
  {
    path: 'services/replace',
    title: "Dental Implants & Dentures in Petaling Jaya | iSmile",
    description: "Replace missing teeth at iSmile Damansara Jaya — implants, bridges & dentures from a family practice serving PJ since 2006. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/replace",
  },
  {
    path: 'services/enhance',
    title: "Teeth Whitening & Veneers in Petaling Jaya | iSmile",
    description: "Cosmetic dentistry at our Damansara Jaya clinic — teeth whitening, veneers & smile makeovers. Rated ${RATING}★ from ${COUNT} Google reviews. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/enhance",
  },
  {
    path: 'services/children',
    title: "Children's Dentistry in Petaling Jaya | iSmile",
    description: "Children's dental care in Damansara Jaya, PJ — first visits, check-ups & preventive care from a family practice since 2006. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/children",
  },
];

export const SERVICE_SPECIALTIES = [
  {
    component: 'WisdomToothSurgery',
    path: 'services/protect/wisdom-tooth',
    title: "Wisdom Tooth Removal in Petaling Jaya | iSmile",
    description: "Wisdom tooth surgery at iSmile Damansara Jaya, PJ — removal of impacted wisdom teeth by our clinic team. Open Mon–Sat. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/protect/wisdom-tooth",
    h1: "Wisdom Tooth Surgery Petaling Jaya | iSmile Dental Clinic",
    lead: "Safe removal of impacted wisdom teeth in Petaling Jaya. Expert care for painful or problematic third molars. Book your consultation today.",
    faqs: [
      { q: "Why is surgery required instead of a normal extraction?", a: "Impacted wisdom teeth are trapped in the jawbone or gums, requiring surgical access. Unlike simple extractions, surgery involves careful tissue management and often sectioning the tooth for a minimally invasive removal." },
      { q: "What is the recovery timeline?", a: "Initial healing and closure of the site take 3-5 days. While most patients return to normal activities within a week, full tissue recovery typically takes about 2 weeks." },
      { q: "What is 'Dry Socket'?", a: "Dry socket is a condition where the protective blood clot dislodges before healing. At iSmile, we use advanced suturing techniques and 'A-PRF' (Platelet-Rich Fibrin) from your own blood to significantly minimize this risk." },
      { q: "Can I have multiple wisdom teeth removed at once?", a: "Yes, it is common to remove all four wisdom teeth in a single session to minimize the overall recovery period. Factors like position and complexity are considered to ensure your procedure is as smooth and comfortable as possible." },
      { q: "When can I eat normally again?", a: "You can start with soft foods after 24 hours. Most patients return to their regular diet within 7-10 days as the extraction sites heal." },
    ],
  },
  {
    component: 'RootCanalTreatment',
    path: 'services/protect/root-canal',
    title: "Root Canal Treatment in Petaling Jaya | iSmile",
    description: "Root canal treatment at iSmile Damansara Jaya, PJ to save an infected tooth. Family practice, open Mon–Sat. WhatsApp us to book an assessment.",
    canonical: "https://ismile.com.my/services/protect/root-canal",
    h1: "Root Canal Treatment Petaling Jaya | iSmile Dental Clinic",
    lead: "Root canal treatment in Petaling Jaya. Save infected teeth and relieve pain. Book your consultation today.",
    faqs: [
      { q: "Is root canal treatment painful?", a: "This is a common myth. With modern anesthesia and techniques, a root canal is typically no more uncomfortable than a routine filling. In fact, the procedure is designed to eliminate the pain caused by infection." },
      { q: "Why do I need a crown afterwards?", a: "After a root canal, the tooth loses its blood supply and can become brittle over time. A crown (cap) is placed to reinforce the tooth structure, preventing fractures and restoring full function." },
      { q: "How many visits does it take?", a: "Most treatments are completed in 1 to 2 visits, depending on the complexity of the canal system and the severity of the infection. We prioritize thorough cleaning to ensure long-term success." },
      { q: "What happens if I don't get a root canal?", a: "An untreated infection will continue to spread, potentially leading to a painful abscess, bone loss around the root, and eventually the need for extraction." },
      { q: "Will the tooth look different afterwards?", a: "Typically, the tooth is restored with a crown that matches your natural teeth perfectly, so it will look and feel natural." },
    ],
  },
  {
    component: 'ClearAligners',
    path: 'services/straighten/clear-aligners',
    title: "Clear Aligners in Petaling Jaya | iSmile Dental Clinic",
    description: "Invisalign & clear aligners at our Damansara Jaya clinic — discreet teeth straightening for adults & teens. Rated ${RATING}★ on Google. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/straighten/clear-aligners",
    h1: "Clear Aligners Petaling Jaya | iSmile Dental Clinic",
    lead: "A modern orthodontic solution using a series of custom-made, transparent plastic trays to gradually shift teeth into alignment. Think of it as a sequence of almost-invisible molds, each tray slightly different from the last, with you moving to the next tray every 1 to 2 weeks. There are no brackets, no wires, and no food restrictions. We offer Invisalign, Angel Aligner, and ClearSmile systems.",
    faqs: [
      { q: "How many hours a day must I wear them?", a: "For clinical success, 20 to 22 hours per day is typically required. They should only be removed for eating, drinking (except water), and oral hygiene." },
      { q: "Does it affect speech?", a: "A minor lisp may occur for the first day or two as the tongue adapts to the aligner thickness. This usually resolves quickly on its own." },
      { q: "Can I eat with them?", a: "No, aligners must be removed during meals to prevent staining, damage, and to ensure proper oral hygiene." },
      { q: "Are aligners suitable for all cases?", a: "While aligners can treat many orthodontic issues, some complex cases may still require traditional braces. Our dentists will assess your situation using 3D scanning and advise on the most appropriate option." },
      { q: "How do I clean my aligners?", a: "Rinse them with lukewarm water and brush them gently with a soft toothbrush. Avoid hot water as it can warp the plastic." },
    ],
  },
  {
    component: 'DentalImplants',
    path: 'services/replace/dental-implants',
    title: "Dental Implants in Damansara Jaya, PJ | iSmile",
    description: "Replace missing teeth with titanium dental implants at iSmile Damansara Jaya, Petaling Jaya. Rated ${RATING}★ from ${COUNT} Google reviews. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/replace/dental-implants",
    h1: "Dental Implants Petaling Jaya | iSmile Dental Clinic",
    lead: "A dental implant is a titanium screw placed surgically into your jawbone, where it functions as an artificial tooth root. After a healing period called osseointegration, a crown is attached to give you a replacement tooth that looks, feels, and functions like a natural one.",
    faqs: [
      { q: "How long does the process take?", a: "The healing phase normally takes several months before the final crown is placed. Your dentist will give you a more specific estimate based on your individual case and bone quality." },
      { q: "Is the procedure painful?", a: "The jawbone has very few pain receptors. Most patients find the procedure less uncomfortable than a standard tooth extraction." },
      { q: "What is the success rate?", a: "Dental implants, when placed by experienced clinicians in suitable patients with good oral hygiene, tend to have high success rates over time. Your dentist will discuss factors that affect outcomes for your specific situation." },
      { q: "Am I too old for dental implants?", a: "Age itself is rarely a limiting factor. As long as you have reasonable oral health and sufficient bone density (or are suitable for bone grafting), implants may be a viable option. Your dentist will assess your individual situation." },
      { q: "How do I care for my dental implant?", a: "Treat it much like a natural tooth. Brush and floss regularly. Regular dental check-ups are important to monitor the health of the surrounding gum and bone over time." },
    ],
  },
  {
    component: 'TeethWhitening',
    path: 'services/enhance/teeth-whitening',
    title: "Teeth Whitening in Petaling Jaya | iSmile Dental Clinic",
    description: "Professional teeth whitening at iSmile Damansara Jaya — in-clinic treatments & take-home trays. Rated ${RATING}★ from ${COUNT} Google reviews. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/enhance/teeth-whitening",
    h1: "Teeth Whitening Petaling Jaya | iSmile Dental Clinic",
    lead: "Professional teeth whitening in Petaling Jaya. Brighten your smile with our custom treatment. Book your consultation today.",
    faqs: [
      { q: "Why is Take-Home Whitening considered the 'Gold Standard'?", a: "Take-home whitening allows for a gradual, deeper oxidation process. By using custom-fitted trays over 10-14 days, the oxygen molecules penetrate deeper into the tooth structure, leading to more stable protocols and significantly less rebound (yellowing coming back) compared to single-session chair-side whitening." },
      { q: "How long do I need to wear the trays each day?", a: "Depending on the concentration prescribed by our doctors, you'll wear the trays for either 30-60 minutes during the day or overnight while you sleep. Most patients achieve their target shade within 2 weeks." },
      { q: "Is the whitening gel safe for my gums?", a: "Yes, because our trays are custom-made from 3D scans of your mouth, they are trimmed precisely to your gum line. This prevents the whitening gel from leaking onto the soft tissues, minimizing irritation and ensuring the gel stays exactly where it's needed." },
      { q: "What happens if my teeth feel sensitive?", a: "Our prescribed gels contain built-in desensitizers and high water content to prevent dehydration. However, if sensitivity occurs, you can simply skip a night or use a desensitizing gel in your trays. The process is entirely under your control." },
      { q: "Will it damage my enamel?", a: "Professional whitening gels are formulated to be pH-neutral and contain minerals that protect the enamel. When used as prescribed, it does not thin or damage the tooth structure." },
    ],
  },
  {
    component: 'CosmeticDentistry',
    path: 'services/enhance/cosmetic-dentistry',
    title: "Cosmetic Dentist in Petaling Jaya | iSmile Dental Clinic",
    description: "Veneers, smile design & full mouth rehabilitation at iSmile Damansara Jaya — a family clinic serving Petaling Jaya since 2006. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/enhance/cosmetic-dentistry",
    h1: "Cosmetic Dentistry Petaling Jaya | iSmile Dental Clinic",
    lead: "Design your dream smile with aesthetic dental treatments tailored to your unique facial features. From veneers to full mouth rehabilitation, we combine art and science for results that look natural and function beautifully.",
    faqs: [
      { q: "What's the difference between composite and ceramic veneers?", a: "Composite veneers are directly bonded in a single visit and can be repaired easily. Ceramic veneers are lab-made from porcelain for superior aesthetics, durability, and stain resistance. Your dentist will recommend the best option based on your goals and tooth condition." },
      { q: "How long do veneers last?", a: "With good care, ceramic veneers can normally last up to 10-15 years or more. Composite veneers normally last around 5-7 years before they need maintenance or replacement. How long any restoration lasts depends on the bite, on grinding habits and on day-to-day care." },
      { q: "Do veneers require tooth reduction?", a: "Minimally invasive protocols mean we preserve as much natural tooth structure as possible. Composite veneers often require little to no reduction, while ceramic veneers may require a thin layer (0.3-0.5mm) for optimal fit and aesthetics." },
      { q: "Can I see how my new smile will look before committing?", a: "Yes. We offer a 'Trial Smile' mock-up process where you can preview and feel your new smile before any treatment begins. This ensures complete confidence in the final result." },
      { q: "Is cosmetic dentistry only about aesthetics?", a: "Not at iSmile. Our cosmetic treatments are designed with function in mind. We analyze bite forces, jaw alignment, and facial harmony to ensure your new smile is as healthy as it is beautiful." },
    ],
  },
  {
    component: 'MyofunctionalOrthodontics',
    path: 'services/children/myofunctional',
    title: "Myofunctional Orthodontics for Kids, PJ | iSmile",
    description: "Early orthodontic treatment for children in Damansara Jaya, Petaling Jaya — guiding jaw development & teeth alignment at a family clinic. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/children/myofunctional",
    h1: "Myofunctional Orthodontics Petaling Jaya | iSmile Dental Clinic",
    lead: "Myofunctional orthodontics addresses the root causes of jaw underdevelopment and crowding by correcting muscle patterns, breathing habits, and oral posture. At iSmile, we use removable functional braces worn mostly at night that gently guide jaw development and habit correction.",
    faqs: [
      { q: "What is myofunctional orthodontics and how does it work?", a: "Myofunctional orthodontics uses removable functional braces, typically worn at night, to address the root causes of jaw and teeth development issues. Instead of just moving teeth after they have already gone off course, this approach works on the muscle patterns, breathing habits, and oral posture that influence how the jaw develops. At iSmile Dental Clinic, each case starts with a thorough assessment covering medical history, developmental milestones, and an oral myofunctional evaluation." },
      { q: "What dental issues can myofunctional orthodontics address in children?", a: "The main focus areas include lip seal correction, training the tongue to rest on the roof of the mouth, establishing nasal breathing, and correcting swallowing patterns. The treatment also screens for mouth breathing and sleep-related breathing concerns that can affect facial growth and dental development. These patterns are evaluated during the initial assessment before any appliance is recommended." },
      { q: "What does myofunctional orthodontic treatment involve?", a: "The treatment follows a structured process: a thorough assessment of medical and developmental history, an oral myofunctional assessment, airway and sleep screening, customized appliance selection, monthly muscle exercise programs, and ongoing progress tracking with growth monitoring. The whole approach is designed to guide natural jaw development gradually, rather than force teeth into position." },
      { q: "What types of appliances are used in myofunctional orthodontics?", a: "Several appliances may be used depending on the assessment findings, including expanders, mandibular advancers, maxillary protractors, munchees, and myofunctional appliances like the LM Activator. Braces or clear aligners may also be recommended later if needed. The dentist selects the appliance based on the child's growth stage and specific developmental needs identified during assessment." },
      { q: "At what age can children start myofunctional orthodontic treatment?", a: "Treatment typically works best while the jaw is still actively growing, which for many children means roughly between the ages of 5 and 12. The dentist will evaluate growth phase and developmental readiness during the initial consultation. Starting early may help the jaw develop in a way that creates more space for teeth and could reduce the need for extensive treatment later on." },
    ],
  },
  {
    component: 'PediatricDentistry',
    path: 'services/children/pediatric-dentistry',
    title: "Kids' Dentist in Petaling Jaya | iSmile Dental Clinic",
    description: "Gentle children's dentistry in Damansara Jaya — first visits, fissure sealants & fluoride treatment. Family practice since 2006. WhatsApp us to book.",
    canonical: "https://ismile.com.my/services/children/pediatric-dentistry",
    h1: "Pediatric Dentistry Petaling Jaya | iSmile Dental Clinic",
    lead: "Gentle, trauma-free dental care for children from their very first tooth onwards. We focus on prevention, education, and creating positive dental experiences that last a lifetime. Every pediatric check-up at iSmile also includes a basic myofunctional screening to assess breathing patterns and oral posture.",
    faqs: [
      { q: "When should my child have their first dental visit?", a: "We typically recommend around age 1, or within 6 months of the first tooth appearing, in line with the Malaysian Dental Association and the American Academy of Pediatric Dentistry. Early visits help your child become comfortable with the dental environment and allow us to monitor growth and development from the start." },
      { q: "Are baby teeth really that important?", a: "Yes. Baby teeth hold space for adult teeth, guide proper chewing and speech development, and affect your child's confidence. Untreated decay in baby teeth can also lead to infection and may affect developing adult teeth underneath." },
      { q: "What are fissure sealants?", a: "Fissure sealants are thin protective coatings applied to the chewing surfaces of back teeth where cavities commonly form. They fill in the grooves and pits, creating a smoother surface that is easier to clean and protected from plaque and food particles." },
      { q: "Is fluoride treatment safe for children?", a: "Yes. Professionally applied topical fluoride strengthens tooth enamel and makes it more resistant to cavities. We use age-appropriate concentrations that are both safe and effective for your child's developmental stage." },
      { q: "How can I help my child feel comfortable at the dentist?", a: "Start young, keep conversations positive, and avoid using words like pain or shot. At iSmile, we create a fun, judgment-free environment where children learn to see dental visits as a normal part of staying healthy." },
    ],
  },
];

/** All prerenderable service routes. */
export const ALL_SERVICE_PAGES = [...SERVICE_CATEGORIES, ...SERVICE_SPECIALTIES];

/** Look up a specialty's content by its component name. */
export function specialtyFor(component) {
  return SERVICE_SPECIALTIES.find((s) => s.component === component);
}

/**
 * Substitute the ${RATING} / ${COUNT} tokens from review-stats.json.
 * Stats are passed in rather than imported so this module stays dependency-free
 * and usable from both the React bundle and the Node build plugin.
 */
export function fillStats(str, stats) {
  if (!str) return str;
  return str
    .replace(/\$\{RATING\}/g, String(stats.rating))
    .replace(/\$\{COUNT\}/g, String(stats.count));
}
