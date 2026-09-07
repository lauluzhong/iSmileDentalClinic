import { Helmet } from 'react-helmet-async';
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import Button from '../components/Button';
import { enrichEvent } from '../lib/attribution';
import { Reveal } from '../components/Reveal';
import Style from '../components/Style';
import { CORE_PAGES } from '../data/corePagesSeo';
import { fillStats } from '../data/serviceSeo';
import reviewStats from '../data/review-stats.json';

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;

const Contact = () => {
    const seo = CORE_PAGES.find(p => p.path === 'contact');
    return (
        <div className="contact-page">
            <Helmet><title>{fillStats(seo.title, reviewStats)}</title><meta name="description" content={fillStats(seo.description, reviewStats)} /><link rel="canonical" href="https://ismile.com.my/contact" /></Helmet>
            <main className="container section-padding contact-container">
                <header className="contact-heading">
                    <Reveal width="100%"><p className="eyebrow">Contact</p></Reveal>
                    <Reveal delay={0.1} width="100%"><h1 className="statement">Get in <em>Touch</em></h1></Reveal>
                    <Reveal delay={0.2} width="100%"><p className="contact-lead">We're here to answer your questions and help you schedule your visit.</p></Reveal>
                </header>
                <dl className="contact-details">
                    <div className="contact-detail-row"><dt>Visit Us</dt><dd><p>75 &amp; 75A, Jalan SS 22/23,<br />Damansara Jaya, 47400 Petaling Jaya,<br />Selangor, Malaysia</p><div className="contact-directions"><a className="quiet-link" href="https://maps.app.goo.gl/yt8MxXDpDxXgXqre6" target="_blank" rel="noopener noreferrer">Google Maps</a><a className="quiet-link" href="https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location" target="_blank" rel="noopener noreferrer">Waze</a></div></dd></div>
                    <div className="contact-detail-row"><dt>Contact</dt><dd><p><a href="tel:+60163222135" className="contact-phone">+60163222135</a></p><Button onClick={() => {
                        const ctaLocation = 'contact_page_cta';
                        const eventData = {
                            event: 'whatsapp_click',
                            whatsapp_page: window.location.pathname,
                            whatsapp_cta_text: 'Get In Touch With Us',
                            whatsapp_type: 'contact_page_cta'
                        };
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push(enrichEvent(eventData, ctaLocation));
                        window.open('https://wa.me/60163222135', '_blank');
                    }}><Phone size={18} />Get In Touch With Us</Button></dd></div>
                    <div className="contact-detail-row"><dt>Opening Hours</dt><dd className="contact-hours"><p><strong>Mon – Fri:</strong> 9:30 AM – 5:30 PM</p><p><strong>Saturday:</strong> 9:30 AM – 3:30 PM</p><p><strong>Sun / PH:</strong> Closed</p></dd></div>
                    <div className="contact-detail-row"><dt>FAQ</dt><dd><p>Find answers to common questions about our services and policies.</p><Link to="/faq" className="quiet-link">View FAQ</Link></dd></div>
                </dl>
                <section className="contact-social" aria-labelledby="follow-us"><h2 id="follow-us" className="system-title">Follow Us</h2><p>Stay updated with our latest news and dental tips</p><div className="contact-social-links"><a href="https://www.instagram.com/ismiledentalclinicmy" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram"><InstagramIcon /></a><a href="https://www.facebook.com/share/18RSFR4Zww/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook"><FacebookIcon /></a></div></section>
                <div className="contact-map"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.584482197798!2d101.606!3d3.1258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4936fefe2c33%3A0x381bee2fa94d3505!2siSmile%20Dental%20Clinic%2C%2075%20%26%2075A%20Jalan%20SS%2022%2F23%2C%20Damansara%20Jaya!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy" width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy" /></div>
            </main>
            <Style>{`
                .contact-page .contact-container { padding-top: 180px; }
                .contact-page .contact-heading { max-width: 760px; margin: 0 auto 56px; text-align: center; }
                .contact-page .contact-heading .eyebrow { margin-bottom: 18px; }
                .contact-page .contact-lead { max-width: 680px; margin: 20px auto 0; color: var(--color-text-slate); font-size: var(--fs-lead); line-height: 1.6; }
                /* 2x2 fact grid (litmus pass, 8 Sep 2026): four short facts do
                   not deserve four full-width rows of vertical scroll. */
                .contact-page .contact-details { max-width: 980px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 72px; border-top: 1px solid var(--hairline); }
                .contact-page .contact-detail-row { padding: 30px 4px; border-bottom: 1px solid var(--hairline); }
                .contact-page .contact-detail-row dt { font-family: var(--font-heading); font-weight: 700; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-primary-teal); margin-bottom: 12px; }
                .contact-page .contact-detail-row dd, .contact-page .contact-detail-row p { margin: 0; color: var(--color-text-slate); line-height: 1.65; }
                .contact-page .contact-phone { color: var(--color-primary-deep); font-family: var(--font-heading); font-weight: 700; text-decoration: none; }
                .contact-page .contact-directions { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 16px; }
                .contact-page .contact-detail-row .btn { margin-top: 18px; }
                .contact-page .contact-hours p + p { margin-top: 4px; }
                .contact-page .contact-social { margin: 72px auto; text-align: center; }
                .contact-page .contact-social p { margin: 12px 0 20px; color: var(--color-text-slate); }
                .contact-page .contact-social-links { display: flex; justify-content: center; gap: 18px; }
                .contact-page .contact-social-links a { color: var(--color-primary-deep); line-height: 0; transition: color .5s var(--ease-slow), transform .5s var(--ease-slow); }
                .contact-page .contact-social-links a:hover { color: var(--color-primary-teal); transform: translateY(-2px); }
                .contact-page .contact-map { overflow: hidden; border-radius: 26px; }
                .contact-page .contact-map iframe { display: block; }
                @media (max-width: 768px) { .contact-page .contact-container { padding-top: 130px; } .contact-page .contact-heading { margin-bottom: 36px; text-align: left; } .contact-page .contact-lead { margin-left: 0; } .contact-page .contact-detail-row { grid-template-columns: 1fr; gap: 8px; padding: 24px 0; } .contact-page .contact-social { margin: 52px auto; } }
            `}</Style>
        </div>
    );
};

export default Contact;
