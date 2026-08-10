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
    body: 'Drop us a text and we\'ll happily sort out an answer and a time that suits you.',
    action: 'WhatsApp the clinic',
    message: 'Hi iSmile, I have a question before booking a visit.'
};

/**
 * Ordered rules. First match wins, so exact specialty pages come first, then
 * their category hubs, then the generic /services fallback.
 *
 * Specialty variants exist because the visitor there has already narrowed down
 * to one treatment — the prompt should name it, and the pre-typed message
 * should carry it into the chat.
 */
const RULES = [
    /* ---- Specialty pages (most specific first) ---- */
    {
        id: 'clear-aligners',
        match: (p) => p === '/services/straighten/clear-aligners',
        title: 'Curious whether clear aligners would work for you?',
        body: 'Drop us a text and we\'ll walk you through how an aligner assessment works.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am interested in clear aligners and would like to know more.'
    },
    {
        id: 'wisdom-tooth',
        match: (p) => p === '/services/protect/wisdom-tooth',
        title: 'Wisdom tooth on your mind?',
        body: 'Tell us what you\'re feeling and we\'ll help you figure out the next step.',
        action: 'Message the clinic',
        message: 'Hi iSmile, I have a question about my wisdom tooth.'
    },
    {
        id: 'root-canal',
        match: (p) => p === '/services/protect/root-canal',
        title: 'Been told you might need a root canal?',
        body: 'Tell us what\'s going on and we\'ll walk you through what to expect.',
        action: 'Message the clinic',
        message: 'Hi iSmile, I would like to ask about root canal treatment.'
    },
    {
        id: 'dental-implants',
        match: (p) => p === '/services/replace/dental-implants',
        title: 'Have a question about dental implants?',
        body: 'Drop us a text and we\'ll walk you through how implants work and how to get started.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am interested in dental implants and would like to know more.'
    },
    {
        id: 'teeth-whitening',
        match: (p) => p === '/services/enhance/teeth-whitening',
        title: 'Thinking about brightening your smile?',
        body: 'Drop us a text and we\'ll walk you through the options.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am interested in teeth whitening.'
    },
    {
        id: 'cosmetic-dentistry',
        match: (p) => p === '/services/enhance/cosmetic-dentistry',
        title: 'Considering upgrading your smile?',
        body: 'Tell us what you have in mind and we\'ll take it from there.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am interested in cosmetic dentistry and would like to know more.'
    },
    {
        id: 'myofunctional',
        match: (p) => p === '/services/children/myofunctional',
        title: 'Noticed mouth breathing, snoring or crowded teeth?',
        body: 'Just tell us how old your child is and what you\'ve noticed, and we\'ll walk you through how a screening works.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I would like to ask about myofunctional treatment for my child.'
    },
    {
        id: 'pediatric',
        match: (p) => p === '/services/children/pediatric-dentistry',
        title: 'Bringing your child in for the first time?',
        body: 'Just tell us their age and what you\'ve noticed, and we\'ll walk you through how a first visit works.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I would like to bring my child in. Could you tell me how the first visit works?'
    },

    /* ---- Category hubs ---- */
    {
        id: 'straighten',
        match: (p) => p.startsWith('/services/straighten'),
        title: 'Wondering if braces or aligners would suit you?',
        body: 'Drop us a text and we\'ll walk you through how an assessment works.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am considering braces or clear aligners and would like to know more.'
    },
    {
        id: 'children',
        match: (p) => p.startsWith('/services/children'),
        title: 'Bringing your child in for the first time?',
        body: 'Just tell us their age and what you\'ve noticed, and we\'ll walk you through how a first visit works.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I would like to bring my child in. Could you tell me how the first visit works?'
    },
    {
        id: 'protect',
        match: (p) => p.startsWith('/services/protect'),
        title: 'Is a tooth bothering you?',
        body: 'Tell us what you\'re feeling and we\'ll help you get seen.',
        action: 'Message the clinic',
        message: 'Hi iSmile, I have some tooth discomfort and would like to arrange a visit.'
    },
    {
        id: 'replace',
        match: (p) => p.startsWith('/services/replace'),
        title: 'Exploring options for restoring your smile?',
        body: 'Drop us a text and we\'ll walk you through the options.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I would like to know more about options for restoring my teeth.'
    },
    {
        id: 'enhance',
        match: (p) => p.startsWith('/services/enhance'),
        title: 'Considering improving your smile?',
        body: 'Tell us what you have in mind and we\'ll take it from there.',
        action: 'Ask on WhatsApp',
        message: 'Hi iSmile, I am interested in improving my smile.'
    },
    {
        id: 'location',
        match: (p) => p.startsWith('/services/locations'),
        title: 'Nearby and thinking of coming in?',
        body: 'Drop us a text for directions, parking, or a time that works for you.',
        action: 'Message the clinic',
        message: 'Hi iSmile, I am in the area and would like to arrange a visit.'
    },
    {
        id: 'services',
        match: (p) => p.startsWith('/services'),
        title: 'Not sure which treatment you need?',
        body: 'Tell us what\'s bothering you and we\'ll point you in the right direction.',
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
                body: 'Drop us a text and we\'ll happily answer, even if you\'re not ready to book.',
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
        body: 'Drop us a text and we\'ll help you find a first appointment that works for you.',
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
