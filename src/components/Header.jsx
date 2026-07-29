import { useBooking } from '../context/BookingContext';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
const logo = '/logo.png';
const logoWebP = '/logo.webp';
// Tightly-cropped wordmark (no transparent padding) — used on mobile so the logo reads larger
const logoTight = '/logo-tight.png';
const logoTightWebP = '/logo-tight.webp';

const Header = () => {
    const { openBooking } = useBooking();
    const [isScrolled, setIsScrolled] = useState(false);
    const [pastHero, setPastHero] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const isDarkPage = location.pathname.startsWith('/services/') && !isScrolled;

    // Handle scroll effect for glass header.
    // pastHero tracks whether we've scrolled beyond ~the immersive Home hero
    // (mobile): below the threshold the header sits transparent on the photo,
    // past it the frosted pill fades back in.
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            setPastHero(window.scrollY > window.innerHeight * 0.72);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mobile header states (CSS scopes both to <=1024px; desktop unaffected).
    // Every page gets the same two-state treatment; the only per-page variable
    // is whether what sits behind the header is dark:
    // - immersive: white logo + translucent chip, for pages whose hero runs
    //   dark right up to the top edge (Home, and the /services/<category> hubs —
    //   NOT the specialty pages under them, which open on a light strip).
    // - collapsed: once scrolled, the logo fades out and only a small floating
    //   frosted circular burger chip remains top-right (all pages).
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const hasDarkHero = location.pathname === '/' ||
        (pathSegments[0] === 'services' && pathSegments.length === 2);
    const isCollapsed = location.pathname === '/' ? pastHero : isScrolled;
    const isImmersive = hasDarkHero && !isCollapsed;

    const navLinks = [
        {
            name: 'About Us',
            path: '/about',
            dropdown: [
                { name: 'Our Journey', hash: '#journey' },
                { name: 'Our Founder', hash: '#founder' },
                { name: 'Our Team', hash: '#team' },
                { divider: true },
                { name: 'Join Our Team', path: '/join-us' }
            ]
        },
        {
            name: 'Our Services', path: '/services',
            
            dropdown: [
                { label: "Featured Services" },
                { name: 'Myofunctional Orthodontics', path: '/services/children/myofunctional' },
                { name: 'Clear Aligners', path: '/services/straighten/clear-aligners' },
                { name: 'Dental Implants', path: '/services/replace/dental-implants' },
                { name: 'Crowns & Bridges', path: '/services/protect/root-canal' },
                { name: 'Cosmetic Dentistry', path: '/services/enhance/cosmetic-dentistry' },
                { divider: true },
                { label: "All Services" },
                { name: 'Straighten Teeth', path: '/services/straighten' },
                { name: 'Replace Teeth', path: '/services/replace' },
                { name: 'Protect & Repair', path: '/services/protect' },
                { name: 'Enhance Smile', path: '/services/enhance' },
                { name: 'Children & Growth', path: '/services/children' },
            ]
        },
        { name: 'Our Reviews', path: '/reviews' },
        { name: 'Learning Centre', path: '/blog' },
        { name: 'Contact', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
    ];

    const handleDropdownClick = (path, hashOrPath) => {
        const isCurrentPath = (hashOrPath === location.pathname) || (path === location.pathname && !hashOrPath);

        if (hashOrPath && hashOrPath.startsWith('#')) {
            // It's a hash anchor on the parent page
            if (location.pathname === path) {
                const element = document.getElementById(hashOrPath.replace('#', ''));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate(path);
                setTimeout(() => {
                    const element = document.getElementById(hashOrPath.replace('#', ''));
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else if (hashOrPath) {
            // It's a full path (e.g., /services/straighten)
            if (location.pathname === hashOrPath) {
                scrollToTop();
            } else {
                navigate(hashOrPath);
            }
        } else {
            // Just the parent path
            if (location.pathname === path) {
                scrollToTop();
            } else {
                navigate(path);
            }
        }
        setMobileMenuOpen(false);
        setActiveSubmenu(null);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
        // Delay resetting active submenu slightly so user doesn't see it jump back while closing
        setTimeout(() => setActiveSubmenu(null), 300);
    };

    const menuVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 }
    };

    const submenuVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 }
    };

    // Find the current active submenu object
    const activeSubmenuData = navLinks.find(link => link.name === activeSubmenu);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''} ${isDarkPage ? 'header-dark' : ''} ${isImmersive ? 'header-immersive' : ''} ${isCollapsed ? 'header-collapsed' : ''}`}>
            <div className="container header-container">
                <div className="header-left">
                    <Link
                        to="/"
                        className="logo-link" data-analytics-click="logo-header"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                scrollToTop();
                            }
                        }}
                    >
                        <picture>
                          {/* width/height per <source>: each art-directed variant has its own
                              intrinsic ratio (tight wordmark is 3:2-ish, padded logo is square).
                              Without these the browser reserves a square box for the tight crop. */}
                          <source media="(max-width: 1024px)" type="image/webp" srcSet={logoTightWebP} width="320" height="215" />
                          <source media="(max-width: 1024px)" type="image/png" srcSet={logoTight} width="462" height="310" />
                          <source type="image/webp" srcSet={logoWebP} width="320" height="320" />
                          <source type="image/png" srcSet={logo} width="500" height="500" />
                          <img className="site-logo-img" src={logo} alt="iSmile Dental Clinic" width="500" height="500" loading="eager" decoding="async" style={{ height: '110px', width: 'auto', transition: 'height 0.3s ease' }} />
                        </picture>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        <ul className="nav-list">
                            {navLinks.map((link) => (
                                <li
                                    key={link.name}
                                    className="nav-item"
                                    onMouseEnter={() => setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {link.path ? (
                                        <Link
                                            to={link.path}
                                            className="nav-link" data-analytics-click="nav-link" data-analytics-label={link.name}
                                            onClick={(e) => {
                                                if (location.pathname === link.path) {
                                                    e.preventDefault();
                                                    scrollToTop();
                                                }
                                            }}
                                        >
                                            {link.name}
                                            {link.dropdown && <ChevronDown size={14} className="dropdown-icon" />}
                                        </Link>
                                    ) : (
                                        <div className="nav-link" style={{ cursor: 'default' }}>
                                            {link.name}
                                            {link.dropdown && <ChevronDown size={14} className="dropdown-icon" />}
                                        </div>
                                    )}

                                    {/* Dropdown Menu */}
                                    {link.dropdown && (
                                        <div className={`dropdown-menu ${activeDropdown === link.name ? 'active' : ''}`}>
                                            {link.dropdown.map((item, i) => (
                                                item.label ? (
                                                    <div key={item.label} className="dropdown-label">{item.label}</div>
                                                ) : item.divider ? (
                                                    <div key={`divider-${i}`} className="dropdown-divider" />
                                                ) : (
                                                    <div
                                                        key={item.name}
                                                        className="dropdown-item"
                                                        onClick={() => handleDropdownClick(link.path, item.hash || item.path)}
                                                    >
                                                        {item.name}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Action Button */}
                <div className="header-actions">
                    <Button data-analytics-click="header-booking" onClick={() => openBooking('', 'header-desktop')}>Book a Visit</Button>
                </div>

                {/* Mobile Menu Toggle */}
                {/* Opening always resets to the top-level list. The close handler
                    clears it too, but only after a 300ms delay (so the submenu
                    doesn't visibly snap back mid-close) — without this, tapping
                    the burger again inside that window reopened the submenu, and
                    with no Back button that was a dead end. */}
                <div className="mobile-toggle" onClick={() => {
                    if (mobileMenuOpen) {
                        handleMobileMenuClose();
                    } else {
                        setActiveSubmenu(null);
                        setMobileMenuOpen(true);
                    }
                }}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-nav-overlay glass-panel"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="mobile-nav-viewport">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {!activeSubmenu ? (
                                    <motion.div
                                        key="main-menu"
                                        initial={{ x: '-110%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: '-110%', opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="mobile-menu-slide"
                                    >
                                        <ul className="mobile-nav-list">
                                            {navLinks.map((link) => (
                                                <li key={link.name} className="mobile-nav-item">
                                                    {link.dropdown ? (
                                                        <div
                                                            className="mobile-nav-link-header"
                                                            onClick={() => setActiveSubmenu(link.name)}
                                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                                                        >
                                                            <span style={{ fontWeight: '600', fontSize: '1.05rem', color: '#1e293b' }}>{link.name}</span>
                                                            <ChevronRight size={18} color="#94a3b8" />
                                                        </div>
                                                    ) : (
                                                        <Link
                                                            to={link.path}
                                                            className="mobile-nav-link-header"
                                                            onClick={(e) => {
                                                                if (location.pathname === link.path) {
                                                                    e.preventDefault();
                                                                    scrollToTop();
                                                                }
                                                                handleMobileMenuClose();
                                                            }}
                                                            style={{ display: 'block', fontWeight: '600', fontSize: '1.05rem', color: '#1e293b' }}
                                                        >
                                                            {link.name}
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                            {/* No Book a Visit here — the sticky action bar carries
                                                one at all times on mobile, so this was a duplicate. */}
                                        </ul>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="submenu"
                                        initial={{ x: '100%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: '100%', opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="mobile-menu-slide"
                                    >
                                        {/* Back sits on the title's own line as an arrow, so it
                                            reads as "go back" without pushing every item down a row. */}
                                        <div className="mobile-submenu-head">
                                            {activeSubmenuData?.path ? (
                                                <Link
                                                    to={activeSubmenuData.path}
                                                    className="mobile-submenu-title"
                                                    onClick={() => {
                                                        handleMobileMenuClose();
                                                        scrollToTop();
                                                    }}
                                                    style={{ display: 'block', textDecoration: 'none' }}
                                                >
                                                    {activeSubmenu}
                                                </Link>
                                            ) : (
                                                <div className="mobile-submenu-title">
                                                    {activeSubmenu}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className="mobile-submenu-back"
                                                aria-label="Back to main menu"
                                                onClick={() => setActiveSubmenu(null)}
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                        </div>

                                        <ul className="mobile-nav-list">
                                            {activeSubmenuData?.dropdown?.map((subItem, subIndex) => (
                                                subItem.divider ? (
                                                    <li key={`divider-${subIndex}`} aria-hidden="true" style={{ margin: '10px 0', borderTop: '1px solid rgba(148, 163, 184, 0.35)' }} />
                                                ) : subItem.label ? (
                                                    <li key={subItem.label} className="mobile-nav-item" style={{ paddingTop: '10px' }}>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>
                                                            {subItem.label}
                                                        </span>
                                                    </li>
                                                ) : (
                                                    <li key={subItem.name} className="mobile-nav-item">
                                                        <span
                                                            onClick={() => handleDropdownClick(activeSubmenuData.path, subItem.hash || subItem.path)}
                                                            className="mobile-nav-link-header"
                                                            style={{ fontWeight: '500', color: '#475569', fontSize: '1rem' }}
                                                        >
                                                            {subItem.name}
                                                        </span>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            transition: all 0.3s ease;
            padding: 20px 0;
            background: rgba(248, 250, 252, 0.2);
            backdrop-filter: blur(20px);
        }

        .header.header-dark {
            background: rgba(0, 0, 0, 0.25);
        }

        .header-dark .nav-link,
        .header-dark .mobile-toggle,
        .header-dark .dropdown-icon {
            color: white !important;
        }

        .header-dark .nav-link:hover {
            color: var(--color-secondary) !important;
        }

        .header.scrolled {
            padding: 15px 0;
            background: rgba(248, 250, 252, 0.7);
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            backdrop-filter: blur(20px);
        }

        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 60px;
        }

        .logo-text {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 2rem;
            color: var(--color-primary);
        }
        
        .logo-star {
            color: var(--color-secondary);
        }

        .logo-link picture {
            display: block;
            line-height: 0;
        }

        .logo-link img {
            width: auto !important;
            object-fit: contain;
            background: transparent;
            display: block;
        }

        .nav-list {
            display: flex;
            gap: 30px;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .nav-item {
            position: relative;
        }

        .nav-link {
            font-weight: 500;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 10px 0;
        }
        
        .nav-link:hover {
            color: var(--color-primary);
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: rgba(248, 250, 252, 0.95);
            min-width: 200px;
            padding: 10px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            border: 1px solid rgba(0,0,0,0.05);
        }

        .dropdown-menu.active {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }

        .dropdown-item {
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .dropdown-item:hover {
            background: var(--color-tint-blue);
            color: var(--color-primary);
        }

        .dropdown-divider {
            height: 1px;
            background: rgba(0,0,0,0.08);
            margin: 8px 0;
        }

        .dropdown-label {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #94a3b8;
            padding: 12px 15px 4px;
            pointer-events: none;
        }

        .mobile-toggle {
            display: none;
            cursor: pointer;
        }

        .desktop-nav {
            display: block;
        }
        
        /* Mobile Overlay & Slide Styles */
        .mobile-nav-overlay {
            position: fixed;
            top: 80px;
            left: 20px;
            right: 20px;
            /* Fixed height for every menu: from under the burger down to just
               above the sticky action bar. Short menus leave the lower part of
               the panel blank; long ones (Our Services) scroll inside it. */
            bottom: calc(84px + env(safe-area-inset-bottom));
            background: rgba(248, 250, 252, 0.95);
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden; /* Hide sliding content */
        }
        
        .mobile-nav-viewport {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 0;
            overflow-y: auto; /* Scrollable if needed */
            overflow-x: hidden;
            /* Both slides share one grid cell so they can overlap during the
               transition without being absolutely positioned. The row grows to
               the taller of the two, so a long submenu scrolls inside this box
               rather than spilling under the sticky action bar. */
            display: grid;
            align-content: start;
        }

        .mobile-menu-slide {
            width: 100%;
            grid-area: 1 / 1;
            display: flex;
            flex-direction: column;
            background: rgba(248, 250, 252, 0); /* Transparent */
        }
        
        .mobile-nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .mobile-nav-item {
            border-bottom: 1px solid rgba(0,0,0,0.05);
            padding-bottom: 4px;
        }
        .mobile-nav-item:last-child { border-bottom: none; }

        .mobile-nav-link-header {
            padding: 7px 0;
            cursor: pointer;
            width: 100%;
            display: block;
        }

        /* Title row: page title on the left, back arrow on the right. The rule
           lives on the row so the arrow sits inside it rather than adding a row. */
        .mobile-submenu-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 14px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .mobile-submenu-title {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--color-primary);
            line-height: 1.1;
        }

        .mobile-submenu-back {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 1px solid rgba(16, 42, 51, 0.10);
            background: #f1f5f9;
            color: #64748b;
            cursor: pointer;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
        }
        .mobile-submenu-back:active { background: #e2e8f0; }

        @media (max-width: 1024px) {
            .desktop-nav, .header-actions {
                display: none;
            }
            .mobile-toggle {
                display: block;
            }
        }

        @media (max-width: 1024px) {
            .header {
                padding: 10px 0;
                background: transparent !important;
                backdrop-filter: none !important;
                /* .header.scrolled also sets a box-shadow. On mobile the bar itself
                   is transparent, so that shadow had nothing to sit under and read
                   as a faint full-width line hanging in mid-air at the header's
                   bottom edge — a ghost of a nav bar that isn't drawn. Needs
                   !important to beat .header.scrolled, same as the two above. */
                box-shadow: none !important;
            }
            /* One mobile header treatment for every page (the Home one): there is
               no bar. The container is a transparent layout box — the logo sits
               directly on the page, and the only chrome is the floating burger
               chip on the right, which morphs from rounded-rect to circle once
               the page scrolls. Previously only Home got this and every other
               page rendered a frosted pill with the logo trapped inside it. */
            .header-container {
                background: transparent;
                backdrop-filter: none;
                -webkit-backdrop-filter: none;
                border: none;
                box-shadow: none;
                margin: 0 16px;
                padding: 0 4px;
                height: 60px;
                position: relative;
                justify-content: space-between !important;
                transition: height 0.3s ease;
            }
            .logo-link img {
                transition: filter 0.35s ease, height 0.3s ease !important;
            }
            .header.header-immersive .logo-link img {
                filter: brightness(0) invert(1) drop-shadow(0 1px 6px rgba(10, 30, 45, 0.35));
                height: 52px !important;
            }
            .header.header-immersive .mobile-toggle {
                background: rgba(255, 255, 255, 0.22);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                box-shadow: none;
                color: #fff;
            }

            /* .header-dark is a desktop concern (white nav links over the dark
               services hero). On mobile the burger's colour is decided by the
               immersive/collapsed state above, so neutralise it here. */
            .header:not(.header-immersive) .mobile-toggle {
                color: var(--color-text-charcoal) !important;
            }

            /* Collapsed state (scrolled, all pages): the bar disappears entirely —
               only a small floating frosted burger chip stays top-right. The header
               ignores pointer events except for the chip and the open menu. */
            .logo-link { transition: opacity 0.3s ease; }
            .header.header-collapsed { pointer-events: none; }
            .header.header-collapsed .mobile-nav-overlay { pointer-events: auto; }
            .header.header-collapsed .logo-link {
                opacity: 0;
                pointer-events: none;
            }
            .header.header-collapsed .mobile-toggle {
                pointer-events: auto;
                width: 44px;
                height: 44px;
                padding: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 14px rgba(16, 42, 51, 0.18);
                color: var(--color-text-charcoal) !important;
            }
            .header.scrolled .header-container {
                margin: 0 16px;
                height: 54px;
            }
            .header.scrolled .logo-link img {
                height: 40px !important;
            }
            
            .logo-link {
                position: static !important;
                transform: none !important;
            }
            .logo-link img {
                height: 44px !important;
                width: auto !important;
                object-fit: contain;
                background: transparent;
                display: block;
            }
            
            /* Unscrolled chip: a rounded-rect frosted square that reads on the
               light page backgrounds of the non-Home pages. Home's immersive
               rule below re-tints it for the photo. */
            .mobile-toggle {
                display: flex !important;
                align-items: center;
                justify-content: center;
                margin-left: 0 !important;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 14px rgba(16, 42, 51, 0.14);
                color: var(--color-text-charcoal);
                border-radius: 14px;
                width: 44px;
                height: 44px;
                padding: 0;
                transition: background 0.35s ease, color 0.35s ease, width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, box-shadow 0.35s ease;
            }
            .mobile-nav-overlay {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                border-radius: 32px;
                border: 1px solid rgba(255,255,255,1);
                top: 80px;
                bottom: calc(84px + env(safe-area-inset-bottom));
                box-shadow: 0 20px 60px -10px rgba(0,0,0,0.15);
                padding: 20px;
            }
        }
      `}</style>
        </header>
    );
};

export default Header;
