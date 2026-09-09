import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import StickyActionBar from './StickyActionBar';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../lib/useSmoothScroll';

const Layout = ({ children }) => {
    const { pathname, hash } = useLocation();
    const lenisRef = useSmoothScroll();

    // Scroll to top on route change, or to the #hash target if there is one.
    // Pages are lazy-loaded, so the target may not exist yet: retry briefly.
    //
    // Every jump goes through Lenis when it is running: a raw window.scrollTo
    // or scrollIntoView is fought by the animation loop on the very next
    // frame, so the new page can land mid-scroll.
    useEffect(() => {
        const jumpTop = () => {
            const lenis = lenisRef.current;
            if (lenis) lenis.scrollTo(0, { immediate: true });
            else window.scrollTo(0, 0);
        };
        const jumpTo = (el) => {
            const lenis = lenisRef.current;
            if (lenis) lenis.scrollTo(el, { immediate: true });
            else el.scrollIntoView();
        };

        if (!hash) {
            jumpTop();
            return;
        }
        // The page-transition animation and image loads shift layout after the
        // first scroll, so keep re-aligning until things settle. A timer, not
        // requestAnimationFrame: rAF stalls in background/occluded tabs.
        const start = performance.now();
        let timer;
        const seek = () => {
            const el = document.getElementById(hash.slice(1));
            if (el) jumpTo(el);
            if (performance.now() - start < 2000) timer = setTimeout(seek, 100);
        };
        seek();
        return () => clearTimeout(timer);
    }, [pathname, hash, lenisRef]);

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
