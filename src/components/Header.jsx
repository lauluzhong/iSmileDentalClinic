import { useBooking } from '../context/BookingContext';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
const logo = '/logo.png';

const Header = () => {
    const { openBooking } = useBooking();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMobileDropdown = (name) => {
        setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const isDarkPage = location.pathname.startsWith('/services') && !isScrolled;

    // Handle scroll effect for glass header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        {
            name: 'About Us',
            path: '/about',
            dropdown: [
                { name: 'Our Founder', hash: '#founder' },
                { name: 'Our Team', hash: '#team' }
            ]
        },
        {
            name: 'Our Services',
            path: null,
            dropdown: [
                { name: 'Protect & Repair', path: '/services/protect' },
                { name: 'Straighten Teeth', path: '/services/straighten' },
                { name: 'Replace Teeth', path: '/services/replace' },
                { name: 'Enhance Smile', path: '/services/enhance' },
                { name: 'Children & Growth', path: '/services/children' },
            ]
        },
        { name: 'Our Reviews', path: '/reviews' },
        { name: 'Learning Centre', path: '/blog' },
        { name: 'Contact', path: '/contact' },
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
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''} ${isDarkPage ? 'header-dark' : ''}`}>
            <div className="container header-container">
                <div className="header-left">
                    <Link
                        to="/"
                        className="logo-link"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                scrollToTop();
                            }
                        }}
                    >
                        <img src={logo} alt="iSmile Dental Clinic" style={{ height: '65px', width: 'auto', transition: 'height 0.3s ease' }} />
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
                                            className="nav-link"
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
                                            {link.dropdown.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="dropdown-item"
                                                    onClick={() => handleDropdownClick(link.path, item.hash || item.path)}
                                                >
                                                    {item.name}
                                                </div>
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
                    <Button onClick={() => openBooking()}>Book Appointment</Button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
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
                        <ul className="mobile-nav-list">
                            {navLinks.map((link) => (
                                <li key={link.name} className="mobile-nav-item">
                                    {link.dropdown ? (
                                        // Accordion Item
                                        <div className="mobile-accordion-group">
                                            <div
                                                className="mobile-nav-link-header"
                                                onClick={() => toggleMobileDropdown(link.name)}
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                                            >
                                                <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>{link.name}</span>
                                                <ChevronDown
                                                    size={16}
                                                    style={{
                                                        transform: activeMobileDropdown === link.name ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        transition: 'transform 0.3s ease',
                                                        color: '#94a3b8'
                                                    }}
                                                />
                                            </div>

                                            {/* Submenu */}
                                            <div className={`mobile-submenu-container ${activeMobileDropdown === link.name ? 'open' : ''}`}>
                                                <ul className="mobile-dropdown-grid">
                                                    {link.dropdown.map(subItem => (
                                                        <li key={subItem.name} className="mobile-dropdown-card">
                                                            <span
                                                                onClick={() => handleDropdownClick(link.path, subItem.hash || subItem.path)}
                                                                className="mobile-dropdown-link"
                                                            >
                                                                {subItem.name}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        // Regular Link
                                        <Link
                                            to={link.path}
                                            className="mobile-nav-link-header"
                                            onClick={(e) => {
                                                if (location.pathname === link.path) {
                                                    e.preventDefault();
                                                    scrollToTop();
                                                }
                                                setMobileMenuOpen(false);
                                            }}
                                            style={{ display: 'block', fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                            <li style={{ marginTop: '10px' }}>
                                <Button onClick={() => { openBooking(); setMobileMenuOpen(false); }} style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}>Book Appointment</Button>
                            </li>
                        </ul>
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
            background: rgba(248, 250, 252, 0.2); /* Semi-transparent base */
            backdrop-filter: blur(20px);
        }

        .header.header-dark {
            background: rgba(0, 0, 0, 0.25); /* Darker glass for hero images */
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

        .mobile-toggle {
            display: none;
            cursor: pointer;
        }

        .desktop-nav {
            display: block;
        }
        
        .mobile-nav-overlay {
            position: fixed;
            top: 80px;
            left: 20px;
            right: 20px;
            background: rgba(248, 250, 252, 0.95);
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            gap: 4px; /* Tighter gap for main items */
        }
        
        .mobile-nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 4px; /* Tighter gap for main items */
        }
        
        .mobile-nav-item {
            border-bottom: 1px solid rgba(0,0,0,0.05);
            padding-bottom: 4px;
        }
        .mobile-nav-item:last-child { border-bottom: none; }

        .mobile-nav-link-header {
            padding: 12px 4px; /* Smaller tap target but still accessible */
            cursor: pointer;
        }

        .mobile-submenu-container {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        }
        
        .mobile-submenu-container.open {
            max-height: 500px; /* Arbitrary large number */
            opacity: 1;
            margin-bottom: 10px;
        }

        /* Mobile Dropdown Styling */
        .mobile-dropdown-grid {
            display: flex;
            flex-direction: column;
            gap: 6px; /* Tight gap */
            padding: 5px 0 0 10px; /* Indent */
            margin: 0;
            list-style: none;
        }
        
        .mobile-dropdown-card {
            background: transparent;
            border-radius: 8px;
            transition: background 0.2s;
        }

        .mobile-dropdown-card:hover {
            background: rgba(0,0,0,0.03);
        }

        .mobile-dropdown-link {
            display: block;
            padding: 8px 12px; /* Smaller padding */
            font-size: 0.85rem; /* Reduced font size */
            color: #475569; 
            font-weight: 500;
            cursor: pointer;
            width: 100%;
        }

        @media (max-width: 900px) {
            .desktop-nav, .header-actions {
                display: none;
            }
            .mobile-toggle {
                display: block;
            }
        }

        /* Redefined Mobile UI/UX - Strict Scoping */
        @media (max-width: 768px) {
            .header {
                padding: 10px 0;
                background: transparent !important;
                backdrop-filter: none !important;
            }
            .header-container {
                background: var(--glass-bg);
                backdrop-filter: var(--glass-blur);
                -webkit-backdrop-filter: var(--glass-blur);
                border: 1px solid var(--glass-border);
                box-shadow: var(--glass-shadow);
                border-radius: 50px;
                margin: 0 16px;
                padding: 0 20px;
                height: 54px;
                position: relative;
                justify-content: space-between !important; /* Force space between */
            }
            .header.scrolled .header-container {
                margin: 0 16px;
                height: 50px;
            }
            
            /* Logo Positioning - Left Aligned */
            .logo-link {
                position: static !important; /* Reset absolute positioning */
                transform: none !important;
            }
            .logo-link img {
                height: 32px !important; /* Slightly smaller for mobile bar */
                display: block;
            }
            
            .mobile-toggle {
                display: flex !important;
                align-items: center;
                justify-content: center;
                margin-left: 0 !important; /* Reset margin auto */
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 8px;
            }
            .mobile-nav-overlay {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                border-radius: 32px;
                border: 1px solid rgba(255,255,255,1);
                top: 80px;
                box-shadow: 0 20px 60px -10px rgba(0,0,0,0.15);
                padding: 24px; /* More breathing room outside */
            }
        }
      `}</style>
        </header>
    );
};

export default Header;
