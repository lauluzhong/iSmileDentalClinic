/**
 * Copy and routing rules for the contextual CTA prompt (see CtaPrompt.jsx).
 *
 * The prompt is a *conversation* opener, not an offer. The usual dental-industry
 * playbook for popups is a discount ("15% off your first visit"), which we
 * deliberately do not use: the marketing truth-gate forbids price, clinical and
 * credential claims in public copy without owner sign-off. What we offer instead
 * is the thing Malaysian patients actually want at this point in the journey,
 * which is an answer on WhatsApp before they have to commit to a booking.
 *
 * Copy rules carried over from the content playbook: no prices, no named
 * dentists, no em dashes, no promises about reply times or outcomes.
 */

export const WHATSAPP_NUMBER = '60163222135';

/** Build a wa.me link with a page specific opening message already typed out. */
export const whatsappUrl = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/**
 * Routes where the prompt never appears.
 *
 * Contact and FAQ already put a one tap WhatsApp link in front of the visitor,
 * so a prompt there is noise. Recall visitors arrived from a recall message and
 * are already in the funnel. Join Us is aimed at dental professionals, not
 * patients, so a patient CTA would be the wrong message to the wrong audience.
 */
const SUPPRESSED = ['/contact', '/faq', '/recall', '/join-us'];

export const isSuppressedPath = (pathname) =>
    SUPPRESSED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/** "early-orthodontic-treatment" -> "early orthodontic treatment" */
const deslug = (slug) => slug.replace(/-/g, ' ').trim();

const DEFAULT_PROMPT = {
    id: 'general',
    title: 'Have a question before you book?',
    body: 'Message us on WhatsApp and we will get back to you with an answer and a time that suits.',
    action: 'WhatsApp the clinic',
    message: 'Hi iSmile, I have a question before booking a visit.'
};

/**
 * Ordered rules. First match wins, so the specific service categories are
 * listed before the generic /services fallback.
 */
const RULES = [
    {
        id: 'straighten',
        match: (p) => p.startsWith('/services/straighten'),
        title: 'Wondering if braces or aligners would suit you?',
        body: 'Send us a message and we will explain how an assessment works and what to expect.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am considering braces or clear aligners and would like to know more.'
    },
    {
        id: 'children',
        match: (p) => p.startsWith('/services/children'),
        title: 'Bringing your child in for the first time?',
        body: 'Tell us their age and what you have noticed, and we will explain how a first visit works.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I would like to bring my child in. Could you tell me how the first visit works?'
    },
    {
        id: 'protect',
        match: (p) => p.startsWith('/services/protect'),
        title: 'Is a tooth bothering you?',
        body: 'Message us and describe what you are feeling. We will help you get seen.',
        action: 'Message the clinic',
        message: 'Hi iSmile, I have some tooth discomfort and would like to arrange a visit.'
    },
    {
        id: 'replace',
        match: (p) => p.startsWith('/services/replace'),
        title: 'Weighing up how to replace a missing tooth?',
        body: 'Message us and we will explain what is involved and how to get started.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am missing a tooth and would like to know what my options are.'
    },
    {
        id: 'enhance',
        match: (p) => p.startsWith('/services/enhance'),
        title: 'Thinking about changing something in your smile?',
        body: 'Tell us what you have in mind and we will explain how a consultation works.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am interested in improving the look of my smile.'
    },
    {
        id: 'location',
        match: (p) => p.startsWith('/services/locations'),
        title: 'Nearby and thinking of coming in?',
        body: 'Message us on WhatsApp for directions, parking, or to find a time that works.',
        action: 'Message the clinic',
        message: 'Hi iSmile, I am in the area and would like to arrange a visit.'
    },
    {
        id: 'services',
        match: (p) => p.startsWith('/services'),
        title: 'Not sure which treatment you need?',
        body: 'Tell us what is bothering you on WhatsApp and we will point you to the right next step.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am not sure which treatment I need. Could you help me work it out?'
    },
    {
        id: 'blog-post',
        match: (p) => /^\/blog\/.+/.test(p),
        build: (pathname) => {
            const topic = deslug(pathname.replace(/^\/blog\//, '').replace(/\/$/, ''));
            return {
                id: 'blog-post',
                title: 'Still have a question after reading?',
                body: 'Message the clinic on WhatsApp. We are happy to answer even if you are not ready to book.',
                action: 'Ask a question',
                message: topic
                    ? `Hi iSmile, I was reading your article about ${topic} and have a question.`
                    : DEFAULT_PROMPT.message
            };
        }
    },
    {
        id: 'reviews',
        match: (p) => p === '/reviews',
        title: 'Looking for a dentist your family can stay with?',
        body: 'Message us on WhatsApp and we will help you find a first appointment that works.',
        action: 'WhatsApp the clinic',
        message: 'Hi iSmile, I am looking for a family dentist and would like to arrange a first visit.'
    }
];

/**
 * @param {string} pathname
 * @returns {{id:string,title:string,body:string,action:string,message:string}}
 */
export function resolvePrompt(pathname) {
    const path = pathname.replace(/\/+$/, '') || '/';
    const rule = RULES.find((r) => r.match(path));
    if (!rule) return DEFAULT_PROMPT;
    if (rule.build) return rule.build(path);
    const { match, build, ...copy } = rule;
    return copy;
}
