import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const RECALL_MAPPING = {
  6: 'Hi%20iSmile%2e',
  9: 'Hi%20iSmile%2e%2e',
  12: 'Hi%20iSmile%2e%2e%2e',
};

const DEFAULT_WHATSAPP_URL = 'https://wa.me/60163222135';

const Recall = () => {
  const [searchParams] = useSearchParams();
  const [redirecting, setRedirecting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const recallParam = searchParams.get('recall');
    
    if (!recallParam) {
      setError('Missing recall parameter');
      setRedirecting(false);
      return;
    }

    const recallNumber = parseInt(recallParam, 10);
    const message = RECALL_MAPPING[recallNumber];

    if (!message) {
      setError(`Invalid recall value: ${recallParam}. Valid values are 6, 9, or 12.`);
      setRedirecting(false);
      return;
    }

    // Construct WhatsApp URL
    const whatsappUrl = `https://wa.me/60163222135?text=${message}`;
    
    // Prevent infinite redirect loops by checking if we've already redirected
    const hasRedirected = sessionStorage.getItem(`recall_redirect_${recallNumber}`);
    if (hasRedirected) {
      // Already redirected; maybe user clicked back button. Clear flag and stay on page.
      sessionStorage.removeItem(`recall_redirect_${recallNumber}`);
      setRedirecting(false);
      return;
    }

    // Mark that we're redirecting
    sessionStorage.setItem(`recall_redirect_${recallNumber}`, 'true');
    
    // Perform redirect after a short delay to show UI
    const timer = setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="recall-page">
      <Helmet>
        <title>WhatsApp Recall Redirect - iSmile Dental Clinic</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container section-padding" style={{ paddingTop: '180px', textAlign: 'center' }}>
        {redirecting && !error && (
          <>
            <h1 className="hero-title mb-4">Redirecting to WhatsApp...</h1>
            <p className="lead-text">Please wait while we redirect you to WhatsApp for patient recall.</p>
            <div className="loading-spinner" style={{ marginTop: '40px' }}>
              <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #00A0C6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            </div>
          </>
        )}
        {error && (
          <>
            <h1 className="hero-title mb-4">Unable to Redirect</h1>
            <p className="lead-text">{error}</p>
            <p className="lead-text mt-4">
              <a href="/contact" className="text-link">Contact us</a> for assistance.
            </p>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .text-link {
          color: #00A0C6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Recall;