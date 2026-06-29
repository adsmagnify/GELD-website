

"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Blog.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface BlogProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
}

export default function Blog({ ref, onScrollDown }: BlogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  // Same pattern as About: start hidden, observer flips it on mount (subpage)
  // or on scroll (homepage). The flip is what plays the transition.
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

  const articles = [
    {
      title: "How AI and Orbitals Shape Digital Banking",
      category: "Engineering",
      date: "June 24, 2026",
      readTime: "6 min read",
      summary: "Explore the mathematics behind GELD's automated asset rebalancing loops, quantitative indexes, and fanning portfolio structures."
    },
    {
      title: "Ledger Security: Guarding On-Chain Vault Assets",
      category: "Security",
      date: "June 18, 2026",
      readTime: "8 min read",
      summary: "An inside look at our distributed multi-signature vaults, cold-custody infrastructure overlays, and cryptographic key shields."
    },
    {
      title: "Why Audited Yields Maintain Capital Integrity",
      category: "Finance",
      date: "June 12, 2026",
      readTime: "5 min read",
      summary: "Understanding the importance of transparent quarterly audits, verifiable liquidity backing, and automated yield payouts."
    }
  ];

  return (
    <section ref={activeRef} className={styles.section}>
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        <div className={styles.heroSection}>
          <h2 className={styles.title}>
            Fintech & <span className={styles.goldText}>Articles</span>
          </h2>
          <p className={styles.subtitle}>
            Keep up to date with GELD's security releases, strategic outlooks, and algorithmic improvements.
          </p>
        </div>

        <div className={styles.grid}>
          {articles.map((a, idx) => (
            <div key={idx} className={styles.card} style={{ transitionDelay: `${idx * 100}ms` }}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{a.category}</span>
                <div className={styles.meta}>
                  <span>{a.date}</span>
                  <span className={styles.bullet}>•</span>
                  <span>{a.readTime}</span>
                </div>
              </div>

              <h3 className={styles.articleTitle}>{a.title}</h3>
              <p className={styles.summary}>{a.summary}</p>

              <button className={styles.readBtn}>
                Read Article
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIcon}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
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