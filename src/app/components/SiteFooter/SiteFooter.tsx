"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const pathname = usePathname();

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isDarkFooter = pathname === "/about";

  return (
    <footer className={`${styles.footer} ${isDarkFooter ? styles.footerDark : ""}`}>
      <div className={styles.container}>
        {/* Left Column: Logo & Socials */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo} onClick={(e) => handleScrollTo("hero", e)}>
            GELD
          </Link>
          <p className={styles.description}>
            Empowering institutions and individuals with next-generation digital wealth custody and custody-grade execution models.
          </p>
          <div className={styles.socials}>
            {/* Instagram */}
            <a href="https://www.instagram.com/geldwealth/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/people/Anil-Jha/100055548436300/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/anil-jha-08b5b323" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>

          <div className={styles.officeBlock}>
            <h4 className={styles.officeTitle}>Office Address</h4>
            <p className={styles.officeAddress}>
              Lodha Signet, A-618, Senapati Bapat Marg, next to Kamala Mills,
              Lower Parel, Mumbai, Maharashtra 400013
            </p>
            <div className={styles.mapFrameWrap}>
              <iframe
                title="GELD Office Location Map"
                src="https://www.google.com/maps?q=Lodha%20Signet%2C%20A-618%2C%20Senapati%20Bapat%20Marg%2C%20next%20to%20Kamala%20Mills%2C%20Lower%20Parel%2C%20Mumbai%2C%20Maharashtra%20400013&z=16&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={styles.mapFrame}
              />
            </div>
            <a
              href="https://www.google.com/maps/place/Lodha+Signet,+A-618,+Senapati+Bapat+Marg,+next+to+Kamala+Mills,+Lower+Parel,+Mumbai,+Maharashtra+400013"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              View on Google Maps
            </a>
          </div>
        </div>

        {/* Right Columns: Links Grid */}
        <div className={styles.linksGrid}>
          {/* Column 1 */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/" onClick={(e) => handleScrollTo("hero", e)}>Home</Link>
              </li>
              <li>
                <Link href="/about">About us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/docs">Docs(Privacy Policy)</Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Products</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/fund-managers">Fund Managers</Link>
              </li>
              <li>
                <Link href="/performance">Performance</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Resources</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/webinar">Webinar</Link>
              </li>
              <li>
                <Link href="/testimonials">Testimonials</Link>
              </li>
              <li>
                <Link href="/#contact" onClick={(e) => handleScrollTo("contact", e)}>Contact us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright} suppressHydrationWarning>
            © {new Date().getFullYear()} GELD. All rights reserved.
            {" | "}
            Made by{" "}
            <a 
              href="https://adsmagnify.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.adsmagnifyLink}
            >
              adsmagnify
            </a> {" "}
            <span style={{ color: "#e25555" }}>♥</span>
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/docs">Terms of Service</Link>
            <Link href="/docs">Privacy Policy</Link>
            <Link href="/docs">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
