
"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Products.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface ProductsProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
}

export default function Products({ ref, onScrollDown }: ProductsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  // Same pattern as About: start hidden, let the observer flip it on mount
  // (subpage) or on scroll (homepage). The flip is what plays the transition.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const current = activeRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [activeRef]);

  const products = [
    {
      title: "Wealth Orbitals",
      tagline: "Automated Portfolio Rebalancing",
      description: "Harness concentric asset positioning algorithms that dynamically distribute capital across high-performance yields, automatically shielding your gains from volatility.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <line x1="2" y1="12" x2="22" y2="12"></line>
        </svg>
      )
    },
    {
      title: "Liquidity Streams",
      tagline: "High-Yield Vault Protocols",
      description: "Connect to real-time interest streams backed by digital ledgers. Allocate capital into vaults with transparent, on-chain yields updated per transaction tick.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      title: "3D Ledger Core",
      tagline: "Visual Financial Ledger",
      description: "Track transaction nodes, liquidity vectors, and clearing paths inside an interactive 3D perspective dashboard. Financial transparency engineered visually.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      )
    },
    {
      title: "Asset Shields",
      tagline: "Military-Grade Safeguards",
      description: "Safeguard your portfolios using distributed multi-signature key vaults, real-time threat detection overlays, and state-of-the-art cold-custody infrastructure.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    }
  ];

  return (
    <section ref={activeRef} className={styles.section}>
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        
        <div className={styles.heroSection}>
          <h2 className={styles.title}>
            Financial Tech <span className={styles.goldText}>Redefined</span>
          </h2>
          <p className={styles.subtitle}>
            GELD provides high-precision digital instruments for modern capital optimization, ledger tracking, and wealth custody.
          </p>
        </div>

        <div className={styles.grid}>
          {products.map((p, idx) => (
            <div key={idx} className={styles.card} style={{ transitionDelay: `${idx * 100}ms` }}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>{p.icon}</span>
                <div className={styles.titles}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardTagline}>{p.tagline}</p>
                </div>
              </div>
              <p className={styles.cardDescription}>{p.description}</p>
              <button className={styles.cardBtn}>Explore Product</button>
            </div>
          ))}
        </div>
      </div>

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} />
        </div>
      )}
    </section>
  );
}