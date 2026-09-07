import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import StickyActionBar from './StickyActionBar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const { pathname, hash } = useLocation();

    // Scroll to top on route change, or to the #hash target if there is one.
    // Pages are lazy-loaded, so the target may not exist yet: retry briefly.
    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }
        // The page-transition animation and image loads shift layout after the
        // first scroll, so keep re-aligning until things settle. A timer, not
        // requestAnimationFrame: rAF stalls in background/occluded tabs.
        const start = performance.now();
        let timer;
        const seek = () => {
            const el = document.getElementById(hash.slice(1));
            if (el) el.scrollIntoView();
            if (performance.now() - start < 2000) timer = setTimeout(seek, 100);
        };
        seek();
        return () => clearTimeout(timer);
    }, [pathname, hash]);

    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
            <StickyActionBar />
        </div>
    );
};

export default Layout;
