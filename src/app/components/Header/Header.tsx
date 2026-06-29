
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");
  const [visibleSection, setVisibleSection] = useState("hero");
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

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
        // Scrolling down (content goes up) -> hide
        setShowHeader(false);
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
    <header className={`${styles.header} ${isHeaderDark ? styles.headerDark : ""} ${showHeader ? "" : styles.headerHidden}`}>
      <Link href="/" className={styles.logo}>
        <span>GELD</span>
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
          About us
        </Link>
        <Link
          href="/products"
          className={`${styles.navLink} ${isLinkActive("products") ? styles.activeNavLink : ""}`}
        >
          Products
        </Link>
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
          href="/#contact" 
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
      </div>
    </header>
  );
}