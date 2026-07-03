"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./SocialRail.module.css";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/geldwealth/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Anil-Jha/100055548436300/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anil-jha-08b5b323",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function SocialRail() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const scrollEl = document.querySelector(".page-scroll-container");
    if (!scrollEl) {
      return;
    }

    lastScrollY.current = scrollEl.scrollTop;

    const onScroll = () => {
      const currentY = scrollEl.scrollTop;
      const delta = currentY - lastScrollY.current;

      if (currentY < 64) {
        setVisible(true);
      } else if (delta > 10) {
        setVisible(false);
      } else if (delta < -10) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside
      className={`${styles.rail} ${visible ? styles.visible : styles.hidden}`}
      aria-label="Social media links"
    >
      <ul className={styles.list}>
        {socialLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label={link.label}
            >
              {link.icon}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
