import React from 'react';
import { Reveal } from '../components/Reveal';

const FAQ = () => {
    return (
        <div className="page-container">
            <div className="container" style={{ padding: '80px 20px' }}>
                <Reveal>
                    <h1 className="text-center section-title mb-5">Frequently Asked Questions</h1>
                </Reveal>

                <div className="faq-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Reveal>
                        <div className="faq-item mb-4">
                            <h3 className="h5 font-weight-bold">How often should I visit the dentist?</h3>
                            <p>It is generally recommended to visit the dentist every 6 months for a routine check-up and cleaning.</p>
                        </div>
                    </Reveal>

                    <Reveal>
                         <div className="faq-item mb-4">
                            <h3 className="h5 font-weight-bold">Do you accept insurance?</h3>
                            <p>We accept a variety of insurance plans. Please contact our office to verify your specific coverage.</p>
                        </div>
                    </Reveal>

                    <Reveal>
                        <div className="faq-item mb-4">
                            <h3 className="h5 font-weight-bold">What should I do in a dental emergency?</h3>
                            <p>If you have a dental emergency, please call us immediately. We offer emergency slots for urgent cases.</p>
                        </div>
                    </Reveal>
                    
                     <Reveal>
                        <div className="faq-item mb-4">
                            <h3 className="h5 font-weight-bold">How can I book an appointment?</h3>
                            <p>You can book an appointment by calling us, WhatsApping us, or using the "Book Appointment" button on our website.</p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
