import { useBooking } from '../context/BookingContext';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Phone } from 'lucide-react';
import Button from './Button';
const logo = '/logo.png';

const Header = () => {
    const { openBooking } = useBooking();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
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
                { name: 'Maintain & Repair', path: '/services/maintain' },
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
        if (hashOrPath && hashOrPath.startsWith('#')) {
            // It's a hash anchor on the parent page
            navigate(path);
            setTimeout(() => {
                const element = document.getElementById(hashOrPath.replace('#', ''));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else if (hashOrPath) {
            // It's a full path (e.g., /services/straighten)
            navigate(hashOrPath);
        } else {
            // Just the parent path
            navigate(path);
        }
        setMobileMenuOpen(false);
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''} ${isDarkPage ? 'header-dark' : ''}`}>
            <div className="container header-container">
                <div className="header-left">
                    <Link to="/" className="logo-link">
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
                                        <Link to={link.path} className="nav-link">
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
            {mobileMenuOpen && (
                <div className="mobile-nav-overlay glass-panel">
                    <ul className="mobile-nav-list">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                {link.path ? (
                                    <Link to={link.path} onClick={() => setMobileMenuOpen(false)}>{link.name}</Link>
                                ) : (
                                    <div style={{ padding: '10px 0' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--color-primary)', display: 'block', marginBottom: '8px' }}>{link.name}</span>
                                        {link.dropdown && (
                                            <ul style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {link.dropdown.map(subItem => (
                                                    <li key={subItem.name}>
                                                        <span
                                                            onClick={() => handleDropdownClick(link.path, subItem.hash || subItem.path)}
                                                            style={{ fontSize: '0.9rem', color: '#555', cursor: 'pointer' }}
                                                        >
                                                            {subItem.name}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                        <li>
                            <Button onClick={() => { openBooking(); setMobileMenuOpen(false); }} style={{ width: '100%' }}>Book Appointment</Button>
                        </li>
                    </ul>
                </div>
            )}

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
            gap: 15px;
        }
        
        .mobile-nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        @media (max-width: 900px) {
            .desktop-nav, .header-actions {
                display: none;
            }
            .mobile-toggle {
                display: block;
            }
        }
      `}</style>
        </header>
    );
};

export default Header;
