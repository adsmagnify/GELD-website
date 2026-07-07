
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { MINI_STOCK_PORTFOLIOS_NAME } from "../../data/catalogProducts";

export default function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");
  const [visibleSection, setVisibleSection] = useState("hero");
  const [showHeader, setShowHeader] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Auto-hide/reveal scroll listener
  useEffect(() => {
    const scrollContainer = document.querySelector(".page-scroll-container");
    if (!scrollContainer) return;

    lastScrollY.current = scrollContainer.scrollTop;
    setShowHeader(scrollContainer.scrollTop < 50);

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      if (currentScrollY < 50) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down (content goes up) -> hide (only if mobile menu is closed)
        if (!isMobileMenuOpen) {
          setShowHeader(false);
        }
      } else if (currentScrollY < lastScrollY.current - 5) {
        // Scrolling up (content goes down) -> show (with small tolerance threshold)
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, isMobileMenuOpen]);

  // Handle window resizing to close mobile drawer when scaling back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1240) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Allow route-specific layout spacing (home keeps hero behind nav).
  useEffect(() => {
    document.body.dataset.route = pathname === "/" ? "home" : "inner";
    return () => {
      delete document.body.dataset.route;
    };
  }, [pathname]);

  // Highlight the nav item matching the current route.
  // On the home page ("/") we scroll-spy the hero; on every other route
  // the active item is derived from the pathname.
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(pathname.replace("/", ""));
      return;
    }

    setActiveSection("hero");
    setVisibleSection("hero");

    const scrollContainer = document.querySelector(".page-scroll-container");
    const observerOptions = {
      root: scrollContainer,
      rootMargin: "-30% 0px -30% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSection(entry.target.id);
        }
      });
    }, observerOptions);

    const hero = document.getElementById("hero");
    const about = document.getElementById("about");
    const stats = document.getElementById("stats");
    const testimonials = document.getElementById("testimonials");
    const contact = document.getElementById("contact");

    if (hero) observer.observe(hero);
    if (about) observer.observe(about);
    if (stats) observer.observe(stats);
    if (testimonials) observer.observe(testimonials);
    if (contact) observer.observe(contact);

    return () => observer.disconnect();
  }, [pathname]);

  const isLinkActive = (id: string) => activeSection === id;

  const isHeaderDark = (pathname === "/" && (visibleSection === "about" || visibleSection === "testimonials")) || pathname === "/about";

  return (
    <header className={`${styles.header} ${isHeaderDark ? styles.headerDark : ""} ${showHeader ? "" : styles.headerHidden} ${isMobileMenuOpen ? styles.headerMobileOpen : ""}`}>
      <Link href="/" className={styles.logoLink} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={styles.logoWrapper}>
          <Image
            src="/geld_logo_g.png"
            alt="G"
            className={styles.logoG}
            width={45}
            height={45}
            priority
            sizes="(max-width: 768px) 32px, 45px"
          />
          <Image
            src="/geld_logo_text.png"
            alt="ELD WEALTH"
            className={styles.logoText}
            width={140}
            height={38}
            priority
            sizes="(max-width: 768px) 100px, 140px"
          />
        </div>
      </Link>

      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.navLink} ${isLinkActive("hero") ? styles.activeNavLink : ""}`}
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`${styles.navLink} ${isLinkActive("about") ? styles.activeNavLink : ""}`}
        >
          Why GELD exists
        </Link>
        <div className={styles.navDropdownWrapper}>
          <Link
            href="/products"
            className={`${styles.navLink} ${isLinkActive("products") ? styles.activeNavLink : ""}`}
          >
            Products
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={styles.navArrow}>
              <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className={styles.navDropdown}>
            <Link href="/products/iap" className={styles.navDropdownItem}>{MINI_STOCK_PORTFOLIOS_NAME}</Link>
            <Link href="/products/pms" className={styles.navDropdownItem}>PMS (Portfolio Management Services)</Link>
            <Link href="/products/aif" className={styles.navDropdownItem}>AIF (Alternative Investment Fund)</Link>
            <Link href="/products/mutual-funds" className={styles.navDropdownItem}>Mutual Funds</Link>
          </div>
        </div>
        <Link
          href="/fund-managers"
          className={`${styles.navLink} ${isLinkActive("fund-managers") ? styles.activeNavLink : ""}`}
        >
          Fund Managers
        </Link>
        <Link
          href="/performance"
          className={`${styles.navLink} ${isLinkActive("performance") ? styles.activeNavLink : ""}`}
        >
          Performance
        </Link>
        <Link
          href="/webinar"
          className={`${styles.navLink} ${isLinkActive("webinar") ? styles.activeNavLink : ""}`}
        >
          Webinar
        </Link>
        <Link
          href="/testimonials"
          className={`${styles.navLink} ${isLinkActive("testimonials") ? styles.activeNavLink : ""}`}
        >
          Testimonials
        </Link>
        <Link
          href="/blog"
          className={`${styles.navLink} ${isLinkActive("blog") ? styles.activeNavLink : ""}`}
        >
          Blog
        </Link>
        <Link
          href="/docs"
          className={`${styles.navLink} ${isLinkActive("docs") ? styles.activeNavLink : ""}`}
        >
          Docs(Privacy Policy)
        </Link>
      </nav>

      <div className={styles.headerActions}>
        <Link 
          href="/contact" 
          className={styles.contactBtn}
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Contact us
        </Link>

        {/* Hamburger menu button for small screen viewports */}
        <button 
          className={`${styles.hamburgerBtn} ${isMobileMenuOpen ? styles.hamburgerActive : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.mobileNavLinks}>
          <Link
            href="/"
            className={`${styles.mobileNavLink} ${isLinkActive("hero") ? styles.activeNavLink : ""}`}
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              if (pathname === "/") {
                e.preventDefault();
                document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`${styles.mobileNavLink} ${isLinkActive("about") ? styles.activeNavLink : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About us
          </Link>
          <div className={styles.mobileDropdownWrapper}>
            <Link
              href="/products"
              className={`${styles.mobileNavLink} ${isLinkActive("products") ? styles.activeNavLink : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <div className={styles.mobileSublinks}>
              <Link href="/products/iap" className={styles.mobileSublink} onClick={() => setIsMobileMenuOpen(false)}>{MINI_STOCK_PORTFOLIOS_NAME}</Link>
              <Link href="/products/pms" className={styles.mobileSublink} onClick={() => setIsMobileMenuOpen(false)}>PMS</Link>
              <Link href="/products/aif" className={styles.mobileSublink} onClick={() => setIsMobileMenuOpen(false)}>AIF</Link>
              <Link href="/products/mutual-funds" className={styles.mobileSublink} onClick={() => setIsMobileMenuOpen(false)}>Mutual Funds</Link>
            </div>
          </div>
          <Link
            href="/fund-managers"
            className={`${styles.mobileNavLink} ${isLinkActive("fund-managers") ? styles.activeNavLink : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Fund Managers
          </Link>
          <Link
            href="/performance"
            className={`${styles.mobileNavLink} ${isLinkActive("performance") ? styles.activeNavLink : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Performance
          </Link>
          <Link
            href="/webinar"
            className={`${styles.mobileNavLink} ${isLinkActive("webinar") ? styles.activeNavLink : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Webinar
          </Link>
          <Link
            href="/testimonials"
            className={`${styles.mobileNavLink} ${isLinkActive("testimonials") ? styles.activeNavLink : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link
            href="/blog"
            className={`${styles.mobileNavLink} ${isLinkActive("blog") ? styles.activeNavLink : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/docs"
            className={`${styles.mobileNavLink} ${isLinkActive("docs") ? styles.activeNavLink : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Docs(Privacy Policy)
          </Link>
          <Link
            href="/contact"
            className={`${styles.mobileNavLink} ${styles.mobileContactLink}`}
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              if (pathname === "/") {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}