"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteFooter.module.css";

const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Lodha%20Signet%2C%20A-618%2C%20Senapati%20Bapat%20Marg%2C%20next%20to%20Kamala%20Mills%2C%20Lower%20Parel%2C%20Mumbai%2C%20Maharashtra%20400013&z=16&output=embed";
const MAP_LINK =
  "https://www.google.com/maps/place/Lodha+Signet,+A-618,+Senapati+Bapat+Marg,+next+to+Kamala+Mills,+Lower+Parel,+Mumbai,+Maharashtra+400013";

function LazyMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={styles.mapFrameWrap}>
      {shouldLoad ? (
        <iframe
          title="GELD Office Location Map"
          src={MAP_EMBED_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={styles.mapFrame}
        />
      ) : (
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapPlaceholder}
          aria-label="Open office location on Google Maps"
        >
          <span>View map</span>
        </a>
      )}
    </div>
  );
}

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
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo} onClick={(e) => handleScrollTo("hero", e)}>
            GELD
          </Link>
          <p className={styles.description}>
            At Geld, we believe you don’t need to know stock picking to invest in Equity markets. We give you access to Indias Top fund managers with no additional costs.
Experts manage our money with concentrated bets in 20-25 stocks in a portfolio.
Let the Pros do the work while you relax and let your money work harder than you!
          </p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/geldwealth/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Anil-Jha/100055548436300/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/anil-jha-08b5b323" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>

          {pathname !== "/performance" && (
            <div className={styles.officeBlock}>
              <h4 className={styles.officeTitle}>Office Address</h4>
              <p className={styles.officeAddress}>
                Lodha Signet, A-618, Senapati Bapat Marg, next to Kamala Mills,
                Lower Parel, Mumbai, Maharashtra 400013
              </p>
              <LazyMap />
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                View on Google Maps
              </a>
            </div>
          )}
        </div>

        <div className={styles.linksGrid}>
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

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Resources</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/webinar">Webinar</Link>
              </li>
              <li>
                <Link href="/testimonials">Social Media</Link>
              </li>
              <li>
                <Link href="/#contact" onClick={(e) => handleScrollTo("contact", e)}>Contact us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.disclaimerSection}>
        <div className={styles.disclaimerContainer}>
          <div className={styles.disclaimerBlock}>
            <span className={styles.disclaimerTitle}>Standard Warning</span>
            <p className={styles.disclaimerText}>
              Investment in securities market is subject to market risks. Read all the related documents carefully before investing.
            </p>
          </div>
          <div className={styles.disclaimerBlock}>
            <span className={styles.disclaimerTitle}>Disclaimer</span>
            <p className={styles.disclaimerText}>
              Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. GELD (brand of Dynamic Equities Pvt. Ltd.) is a registered Investment Adviser. Past performance is no guarantee of future results.
            </p>
          </div>
        </div>
      </div>

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
              adsmagnify <span style={{ color: "#e25555" }}>♥</span>
            </a>{" "}
            {/* <span style={{ color: "#e25555" }}>♥</span> */}
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
