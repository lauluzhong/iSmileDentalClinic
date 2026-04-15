import { useEffect } from 'react';

/**
 * Microsoft Clarity Analytics Component
 * 
 * This component loads Microsoft Clarity tracking script.
 * It only loads in production environment to avoid tracking development activity.
 * 
 * Usage:
 * 1. Add your Clarity project ID to .env.local as VITE_CLARITY_PROJECT_ID
 * 2. Import and use this component in your main App.jsx
 * 
 * @returns {null} This component doesn't render anything
 */
const ClarityAnalytics = () => {
    useEffect(() => {
        // Check if Clarity is already loaded from index.html
        if (typeof window !== 'undefined' && window.clarity) {
            console.log('Microsoft Clarity already loaded from HTML');
            return;
        }
        
        // Only load in production if not already loaded
        if (import.meta.env.PROD && import.meta.env.VITE_CLARITY_PROJECT_ID) {
            const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
            
            // Microsoft Clarity tracking script
            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() {
                    (c[a].q = c[a].q || []).push(arguments);
                };
                t = l.createElement(r);
                t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", projectId);
            
            console.log('Microsoft Clarity analytics loaded from React component');
        } else if (!import.meta.env.VITE_CLARITY_PROJECT_ID) {
            console.warn('Microsoft Clarity project ID not found in environment variables');
        }
    }, []);

    // This component doesn't render anything
    return null;
};

export default ClarityAnalytics;