import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import StickyActionBar from './StickyActionBar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const { pathname } = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

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
