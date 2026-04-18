import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Reveal, FadeIn } from '../../components/Reveal';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const DamansaraJaya = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const faqData = [
    {
      q: "Where is iSmile Dental Clinic located in Damansara Jaya?",
      a: "Our clinic is located at 75 & 75A, Jalan SS 22/23, Damansara Jaya, Petaling Jaya. We are near Atria Shopping Gallery, with parking available nearby."
    },
    {
      q: "What are your clinic hours in Damansara Jaya?",
      a: "We are open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 9:00 AM to 1:00 PM. We are closed on Sundays and public holidays. Emergency dental services are available during clinic hours."
    },
    {
      q: "Do you accept walk-ins at your Damansara Jaya clinic?",
      a: "Appointments are preferred to ensure we can give you the best possible service. However, we accommodate walk-ins based on availability, and emergency cases are always prioritized."
    },
    {
      q: "Is iSmile Dental Clinic in Damansara Jaya accepting new patients?",
      a: "Yes, we welcome new patients and families! You can schedule online, call us at +6016-322 2135, or WhatsApp us to book your first appointment."
    },
    {
      q: "What dental services are available at your Damansara Jaya location?",
      a: "We offer comprehensive dental care including family dentistry for all ages, preventive care and check-ups, emergency dental services, cosmetic and restorative treatments, orthodontics, dental implants, wisdom tooth surgery, and more."
    },
    {
      q: "How do I book an appointment at your Damansara Jaya clinic?",
      a: "You can book an appointment by calling +6016-322 2135, sending a WhatsApp message to https://wa.me/60163222135, or using our online booking system. We recommend booking in advance to secure your preferred time slot."
    }
  ];

  return (
    <div className="location-page">
      <Helmet>
        <title>Dentist in Damansara Jaya | iSmile Dental Clinic</title>
        <meta name="description" content="Your trusted family dentist in Damansara Jaya. Comprehensive dental care with a gentle touch." />
        <link rel="canonical" href="https://ismile.com.my/services/locations/damansara-jaya" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ismile.com.my/services/locations/damansara-jaya" />
        <meta property="og:title" content="Dentist in Damansara Jaya | iSmile Dental Clinic" />
        <meta property="og:description" content="Your trusted family dentist in Damansara Jaya. Comprehensive dental care with a gentle touch." />
        <meta property="og:image" content="https://ismile.com.my/logo.png" />
      </Helmet>

      {/* Hero */}
      <section className="loc-hero">
        <div className="loc-container">
          <Reveal>
            <div className="loc-hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Damansara Jaya, Petaling Jaya
            </div>
            <h1>Your Family Dentist in Damansara Jaya</h1>
            <p className="loc-hero-subtitle">Comprehensive, gentle dental care for children, adults, and families — right in the heart of Damansara Jaya. We focus on your comfort and long-term oral health.</p>
            <a href="https://wa.me/60163222135?text=Hi%20I%20would%20like%20to%20book%20an%20appointment%20at%20your%20Damansara%20Jaya%20clinic" className="loc-btn">Book Your Appointment</a>
          </Reveal>
        </div>
      </section>

      {/* About Section */}
      <section className="loc-section">
        <div className="loc-container">
          <FadeIn>
            <div className="loc-about-grid">
              <div>
                <h2 className="loc-section-title">About Our Damansara Jaya Clinic</h2>
                <p className="loc-section-desc" style={{ marginBottom: '16px' }}>Located in the vibrant neighbourhood of Damansara Jaya, our clinic is designed to offer a welcoming, stress-free environment for patients of all ages. We understand that visiting the dentist can be anxiety-inducing, which is why we prioritise patient comfort and clear communication.</p>
                <p className="loc-section-desc">Our clinic is equipped with modern dental technology, including digital X‑rays, intraoral scanners, and sterilisation protocols that meet the highest international standards. We serve families across Petaling Jaya with everything from routine check-ups to advanced restorative and cosmetic treatments.</p>
              </div>
              <div className="loc-about-highlights">
                <div className="loc-highlight">
                  <div className="loc-highlight-icon">🏥</div>
                  <div>
                    <h4>Modern Equipment</h4>
                    <p>Digital X-rays, 3D scanners, and advanced sterilisation</p>
                  </div>
                </div>
                <div className="loc-highlight">
                  <div className="loc-highlight-icon">👨‍👩‍👧‍👦</div>
                  <div>
                    <h4>Family-Friendly</h4>
                    <p>Welcoming environment for patients of all ages</p>
                  </div>
                </div>
                <div className="loc-highlight">
                  <div className="loc-highlight-icon">💬</div>
                  <div>
                    <h4>Clear Communication</h4>
                    <p>We explain every treatment option so you can decide confidently</p>
                  </div>
                </div>
                <div className="loc-highlight">
                  <div className="loc-highlight-icon">🅿️</div>
                  <div>
                    <h4>Convenient Location</h4>
                    <p>Reserved parking in front, near Atria Mall Damansara Jaya</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Section */}
      <section className="loc-section loc-section-alt">
        <div className="loc-container">
          <Reveal>
            <h2 className="loc-section-title" style={{ textAlign: 'center' }}>Our Services</h2>
            <p className="loc-section-desc" style={{ textAlign: 'center', margin: '0 auto 10px' }}>Comprehensive dental care for every member of your family.</p>
            <div className="loc-services-grid">
              <Link to="/services/children" className="loc-service-card">
                <div className="loc-service-icon">👶</div>
                <h3>Family &amp; Pediatric Dentistry</h3>
                <p>Regular check-ups, cleanings, fluoride treatments, and oral health education for every member of your family.</p>
                <span className="loc-service-link">Learn more →</span>
              </Link>
              <Link to="/services/straighten/clear-aligners" className="loc-service-card">
                <div className="loc-service-icon">✨</div>
                <h3>Orthodontics &amp; Clear Aligners</h3>
                <p>Invisalign, braces, and early interceptive treatments to straighten teeth and correct bite issues.</p>
                <span className="loc-service-link">Learn more →</span>
              </Link>
              <Link to="/services/enhance/cosmetic-dentistry" className="loc-service-card">
                <div className="loc-service-icon">💎</div>
                <h3>Cosmetic Dentistry</h3>
                <p>Teeth whitening, veneers, and smile makeovers to enhance your confidence and appearance.</p>
                <span className="loc-service-link">Learn more →</span>
              </Link>
              <Link to="/services/protect/wisdom-tooth" className="loc-service-card">
                <div className="loc-service-icon">🦷</div>
                <h3>Wisdom Tooth Surgery</h3>
                <p>Safe, comfortable removal of impacted wisdom teeth with sedation options available.</p>
                <span className="loc-service-link">Learn more →</span>
              </Link>
              <Link to="/services/replace/dental-implants" className="loc-service-card">
                <div className="loc-service-icon">🔩</div>
                <h3>Dental Implants</h3>
                <p>Permanent tooth replacement with natural-looking results and long-lasting stability.</p>
                <span className="loc-service-link">Learn more →</span>
              </Link>
              <Link to="/services/protect/root-canal" className="loc-service-card">
                <div className="loc-service-icon">🛡️</div>
                <h3>Crowns, Bridges &amp; Root Canal</h3>
                <p>Restorative treatments to protect damaged teeth, replace missing teeth, and preserve oral health.</p>
                <span className="loc-service-link">Learn more →</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="loc-section">
        <div className="loc-container">
          <Reveal>
            <h2 className="loc-section-title" style={{ textAlign: 'center' }}>What Our Patients Say</h2>
            <p className="loc-section-desc" style={{ textAlign: 'center', margin: '0 auto' }}>Real reviews from real patients in the Damansara Jaya community.</p>
            <div className="loc-reviews-grid">
              <div className="loc-review-card">
                <div className="loc-review-header">
                  <div className="loc-review-avatar">A</div>
                  <div className="loc-review-meta">
                    <strong>Ashley Chin</strong>
                    <span>Local Guide · Google Review</span>
                  </div>
                </div>
                <div className="loc-review-stars">★★★★★</div>
                <p className="loc-review-text">"Happy with the service and helpful that there is one reserved parking in front of the clinic. Good location near Atria DJ and the clinic is clean and calm vibes. Thank you Dr Jean and all the friendly staff too!"</p>
              </div>
              <div className="loc-review-card">
                <div className="loc-review-header">
                  <div className="loc-review-avatar">E</div>
                  <div className="loc-review-meta">
                    <strong>Eugene Lee</strong>
                    <span>Local Guide · Google Review</span>
                  </div>
                </div>
                <div className="loc-review-stars">★★★★★</div>
                <p className="loc-review-text">"I've been coming to iSmile Dental Clinic for my checkups and have always had a great experience. The front desk is friendly, and Dr. Jean Ong is incredibly thorough and attentive. Be sure to book an appointment ahead of time because slots fill up quickly. There is also reserved parking spots in front of the clinic, but if those are full, you can park at Atria Mall and walk over. Overall, it's a clean, professional clinic with excellent service. I'd definitely return and highly recommend it for any dental care!"</p>
              </div>
            </div>
            <div className="loc-reviews-cta">
              <a href="https://search.google.com/search?q=iSmile+Dental+Clinic+Petaling+Jaya" target="_blank" rel="noopener noreferrer" className="loc-btn loc-btn-outline">Read More Reviews on Google</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Location & Hours Section */}
      <section className="loc-section loc-section-alt">
        <div className="loc-container">
          <FadeIn>
            <h2 className="loc-section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Visit Our Damansara Jaya Clinic</h2>
            <div className="loc-info-grid">
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '16px' }}>Address</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#424245', marginBottom: '24px' }}>
                  75 &amp; 75A, Jalan SS 22/23<br />
                  Damansara Jaya, Petaling Jaya<br />
                  Selangor 47400, Malaysia
                </p>

                <div className="loc-direction-btns">
                  <a href="https://maps.app.goo.gl/yt8MxXDpDxXgXqre6" target="_blank" rel="noopener noreferrer" className="loc-dir-btn">
                    <img src="/images/google-maps.png" alt="Google Maps" loading="lazy" /> Google Maps
                  </a>
                  <a href="https://ul.waze.com/ul?place=ChIJMyz-_jZJzDERBTVNqS_uGzg&ll=3.12583430%2C101.61623380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location" target="_blank" rel="noopener noreferrer" className="loc-dir-btn">
                    <img src="/images/waze.png" alt="Waze" loading="lazy" /> Waze
                  </a>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '36px', marginBottom: '16px' }}>Operating Hours</h3>
                <ul className="loc-hours-list">
                  <li><span className="day">Monday – Friday</span><span className="time">9:30 AM – 5:30 PM</span></li>
                  <li><span className="day">Saturday</span><span className="time">9:30 AM – 3:30 PM</span></li>
                  <li><span className="day">Sunday &amp; Public Holidays</span><span className="time">Closed</span></li>
                </ul>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '36px', marginBottom: '16px' }}>Parking &amp; Transport</h3>
                <ul className="loc-parking-list">
                  <li>
                    <span className="loc-parking-icon">✓</span>
                    Reserved parking available in front of the clinic
                  </li>
                  <li>
                    <span className="loc-parking-icon">✓</span>
                    Additional parking at nearby Atria Mall (short walk)
                  </li>
                  <li>
                    <span className="loc-parking-icon">✓</span>
                    Accessible via Rapid KL buses servicing Damansara Jaya
                  </li>
                  <li>
                    <span className="loc-parking-icon">✓</span>
                    10-minute drive from the nearest LRT station
                  </li>
                </ul>
              </div>

              <div>
                <div className="loc-map-wrapper">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.584482197798!2d101.606!3d3.1258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4936fefe2c33%3A0x381bee2fa94d3505!2siSmile%20Dental%20Clinic%2C%2075%20%26%2075A%20Jalan%20SS%2022%2F23%2C%20Damansara%20Jaya!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="loc-section">
        <div className="loc-container">
          <FadeIn>
            <h2 className="loc-section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Frequently Asked Questions</h2>
            <div className="loc-faq-grid">
              {faqData.map((item, idx) => {
                const itemKey = `faq-${idx}`;
                const isOpen = openItems[itemKey];
                return (
                  <div key={idx} className={`loc-faq-card ${isOpen ? 'loc-faq-card-open' : ''}`} onClick={() => toggleItem(itemKey)} style={{ cursor: 'pointer' }}>
                    <div className="loc-faq-question-row">
                      <h3 className="loc-faq-question" style={{ color: 'var(--color-text-charcoal)', flex: 1 }}>{item.q}</h3>
                      <ChevronDown size={20} className={`loc-faq-chevron ${isOpen ? 'loc-faq-chevron-open' : ''}`} />
                    </div>
                    <div className={`loc-faq-answer ${isOpen ? 'loc-faq-answer-open' : ''}`}>
                      <div className="loc-faq-answer-inner" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="loc-final-cta">
        <div className="loc-container" style={{ maxWidth: '800px' }}>
          <Reveal>
            <h2>Ready to Experience Gentle Dentistry in Damansara Jaya?</h2>
            <p>Book your appointment today and discover why families in Damansara Jaya trust iSmile Dental Clinic for their oral health needs.</p>
            <a href="https://wa.me/60163222135?text=Hi%20I%20would%20like%20to%20book%20an%20appointment%20at%20your%20Damansara%20Jaya%20clinic" className="loc-btn-white">Book Your Appointment Now</a>
            <p className="loc-final-phone">Or call us at <strong>+6016-322 2135</strong></p>
          </Reveal>
        </div>
      </section>

      {/* Scoped Styles for the Location Component */}
      <style dangerouslySetInnerHTML={{ __html: `
        .loc-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .loc-hero { background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #dcfce7 100%); padding: 120px 0 80px; text-align: center; position: relative; }
        .loc-hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(79, 163, 194, 0.1); border: 1px solid rgba(79, 163, 194, 0.2); border-radius: 20px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--color-primary); font-weight: 600; margin-bottom: 24px; }
        .loc-hero h1 { font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; max-width: 800px; margin: 0 auto 20px; background: linear-gradient(135deg, #1a202c 0%, var(--color-primary-teal) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .loc-hero-subtitle { font-size: 1.15rem; color: var(--color-text-muted); max-width: 650px; margin: 0 auto 36px; line-height: 1.7; }
        .loc-btn { display: inline-block; background: linear-gradient(135deg, #3a8ba8, var(--color-primary-teal)); color: white; padding: 16px 36px; border-radius: 50px; font-weight: 600; font-size: 1.1rem; font-family: var(--font-heading); border: none; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(79, 163, 194, 0.3); text-decoration: none;}
        .loc-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79, 163, 194, 0.4); color: white; }
        .loc-btn-outline { background: transparent; border: 2px solid var(--color-primary); color: var(--color-primary); box-shadow: none; }
        .loc-btn-outline:hover { background: var(--color-primary); color: white; }
        .loc-section { padding: 80px 0; }
        .loc-section-alt { background: #fbfbfd; }
        .loc-section-title { font-size: 2.4rem; font-weight: 700; margin-bottom: 16px; color: var(--color-text-charcoal); letter-spacing: -0.01em; }
        .loc-section-desc { font-size: 1.15rem; line-height: 1.7; color: #424245; max-width: 800px; }
        .loc-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .loc-about-highlights { display: flex; flex-direction: column; gap: 20px; }
        .loc-highlight { display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: white; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); transition: all 0.3s ease; }
        .loc-highlight:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        .loc-highlight-icon { width: 44px; height: 44px; background: #D8EEF5; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--color-primary); font-size: 1.3rem; }
        .loc-highlight h4 { font-size: 1rem; font-weight: 600; margin: 0 0 4px; }
        .loc-highlight p { font-size: 0.9rem; color: var(--color-text-muted); margin: 0; line-height: 1.5; }
        .loc-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 40px; }
        .loc-service-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 8px 32px 0 rgba(79, 163, 194, 0.15); border-radius: 20px; padding: 32px; transition: all 0.3s ease; text-decoration: none; color: inherit; display: block; text-align: left; }
        .loc-service-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(79, 163, 194, 0.2); }
        .loc-service-icon { font-size: 2rem; margin-bottom: 16px; }
        .loc-service-card h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 10px; color: var(--color-primary); }
        .loc-service-card p { font-size: 0.95rem; color: #555; line-height: 1.6; margin: 0; }
        .loc-service-link { display: inline-flex; align-items: center; gap: 6px; color: var(--color-primary); font-weight: 600; font-size: 0.9rem; margin-top: 16px; transition: gap 0.2s ease; }
        .loc-service-card:hover .loc-service-link { gap: 10px; }
        .loc-reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; margin-top: 40px; }
        .loc-review-card { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: all 0.3s ease; text-align: left; }
        .loc-review-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .loc-review-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .loc-review-avatar { width: 44px; height: 44px; border-radius: 50%; background: #D8EEF5; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--color-primary); font-size: 1.1rem; }
        .loc-review-meta strong { display: block; font-size: 1rem; color: var(--color-text-charcoal); }
        .loc-review-meta span { font-size: 0.8rem; color: var(--color-text-muted); }
        .loc-review-stars { color: #FBBC05; font-size: 1.1rem; letter-spacing: 2px; margin-bottom: 14px; }
        .loc-review-text { font-size: 1rem; color: #4a5568; line-height: 1.7; font-style: italic; }
        .loc-reviews-cta { text-align: center; margin-top: 40px; }
        .loc-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; text-align: left; }
        .loc-hours-list { list-style: none; padding: 0; margin: 0; }
        .loc-hours-list li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 1rem; }
        .loc-hours-list li:last-child { border-bottom: none; }
        .loc-hours-list .day { font-weight: 600; color: var(--color-text-charcoal); }
        .loc-hours-list .time { color: var(--color-text-muted); }
        .loc-parking-list { list-style: none; padding: 0; margin: 20px 0 0; }
        .loc-parking-list li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; font-size: 0.95rem; color: #4a5568; line-height: 1.5; }
        .loc-parking-icon { flex-shrink: 0; margin-top: 2px; color: var(--color-primary); }
        .loc-direction-btns { display: flex; gap: 12px; margin-top: 24px; }
        .loc-dir-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.9rem; font-weight: 500; color: #475569; cursor: pointer; transition: all 0.2s ease; text-decoration: none; }
        .loc-dir-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: #f0f9ff; transform: translateY(-2px); }
        .loc-dir-btn img { width: 18px; height: 18px; }
        .loc-map-wrapper { border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-top: 40px; }
        .loc-map-wrapper iframe { display: block; border: 0; }
        .loc-final-cta { padding: 80px 0; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%); color: white; text-align: center; }
        .loc-final-cta h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; color: white; }
        .loc-final-cta p { font-size: 1.2rem; line-height: 1.6; margin-bottom: 36px; opacity: 0.92; max-width: 600px; margin-left: auto; margin-right: auto; }
        .loc-btn-white { background: white; color: var(--color-primary); padding: 16px 36px; border-radius: 50px; font-weight: 700; font-size: 1.15rem; font-family: var(--font-heading); border: none; cursor: pointer; transition: all 0.3s ease; display: inline-block; text-decoration: none; }
        .loc-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); color: var(--color-primary); }
        .loc-final-phone { margin-top: 16px; font-size: 1rem; opacity: 0.8; }
        .loc-final-phone strong { font-weight: 600; }

        /* FAQ Section Styles */
        .loc-faq-grid { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }
        .loc-faq-card { padding: 30px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 8px 32px 0 rgba(79, 163, 194, 0.15); border-radius: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease; user-select: none; }
        .loc-faq-card:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(79, 163, 194, 0.25); }
        .loc-faq-card-open { border-color: rgba(79, 163, 194, 0.3); }
        .loc-faq-question-row { display: flex; align-items: center; gap: 12px; }
        .loc-faq-question { font-size: 1.05rem; font-weight: 600; margin: 0; }
        .loc-faq-chevron { color: var(--color-primary-teal); transition: transform 0.3s ease; flex-shrink: 0; }
        .loc-faq-chevron-open { transform: rotate(180deg); }
        .loc-faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, margin-top 0.35s ease; margin-top: 0; }
        .loc-faq-answer-open { max-height: 500px; margin-top: 16px; }
        .loc-faq-answer-inner { color: var(--color-text-muted); line-height: 1.6; }

        @media (max-width: 1024px) {
          .loc-hero { padding: 90px 0 50px; }
          .loc-hero h1 { font-size: 2.2rem; }
          .loc-hero-subtitle { font-size: 1rem; }
          .loc-section { padding: 50px 0; }
          .loc-section-title { font-size: 1.8rem; }
          .loc-section-desc { font-size: 1rem; }
          .loc-about-grid { grid-template-columns: 1fr; gap: 30px; }
          .loc-services-grid { grid-template-columns: 1fr; gap: 16px; margin-top: 24px; }
          .loc-service-card { padding: 24px; }
          .loc-reviews-grid { grid-template-columns: 1fr; gap: 16px; }
          .loc-review-card { padding: 24px; }
          .loc-info-grid { grid-template-columns: 1fr; gap: 40px; }
          .loc-direction-btns { flex-wrap: wrap; }
          .loc-final-cta h2 { font-size: 1.8rem; }
          .loc-final-cta p { font-size: 1rem; }
          .loc-container { padding: 0 16px; }
          .loc-faq-grid { gap: 12px; margin-top: 30px; }
          .loc-faq-card { padding: 20px; border-radius: 16px; }
          .loc-faq-question { font-size: 0.95rem; }
          .loc-faq-answer-inner { font-size: 0.9rem; }
        }
      ` }}></style>
    </div>
  );
};

export default DamansaraJaya;
