"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Do not render the public site navbar on admin portal pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when page changes
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => {
      const nextState = !prev;
      document.body.style.overflow = nextState ? 'hidden' : '';
      return nextState;
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`} id="main-nav" ref={navRef}>
      <div className="nav-container">
        <Link href="/" className="nav-logo" onClick={closeMobileMenu}>
          <Image 
            src="/images/logo-transparent.png" 
            alt="GKB Textiles Logo" 
            width={120} 
            height={36} 
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
        <button
          className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
          id="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          aria-controls="nav-links"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="nav-links">
          <li>
            <Link href="/" className={isLinkActive('/') ? 'active' : ''} onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={isLinkActive('/about') ? 'active' : ''} onClick={closeMobileMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link href="/products" className={isLinkActive('/products') ? 'active' : ''} onClick={closeMobileMenu}>
              Products
            </Link>
          </li>
          <li>
            <Link href="/sustainability" className={isLinkActive('/sustainability') ? 'active' : ''} onClick={closeMobileMenu}>
              Sustainability
            </Link>
          </li>
          <li>
            <Link href="/contact" className={isLinkActive('/contact') ? 'active' : ''} onClick={closeMobileMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
