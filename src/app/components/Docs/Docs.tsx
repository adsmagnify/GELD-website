

"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Docs.module.css";

interface DocsProps {
  ref?: React.RefObject<HTMLElement | null>;
  isSubpage?: boolean;
}

export default function Docs({ ref }: DocsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const [activeTab, setActiveTab] = useState<"intro" | "privacy" | "terms" | "api">("privacy");

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

  const docsContent = {
    intro: {
      title: "Introduction to GELD",
      lastUpdated: "Last updated: June 2026",
      paragraphs: [
        "GELD is a high-precision digital banking technology platform designed to streamline wealth management, transaction ledgers, and on-chain capital allocation vaults.",
        "By integrating automated portfolio orbitals and real-time auditing benchmarks, GELD helps financial institutions bridge traditional investments with digital ledgers, ensuring complete capital efficiency and robust threat prevention overlays."
      ]
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: June 2026",
      paragraphs: [
        "At GELD, protecting your privacy is our primary engineering requirement. We do not sell, trade, or distribute user identification records or portfolio transaction paths to external brokers.",
        "Your credential logs are protected using client-side cryptographic shielding, multi-factor vault overlays, and periodic decentralized network refreshes.",
        "By using GELD's high-yield streams and ledger platforms, you consent to our secure transaction mapping policies designed to prevent automated routing fraud."
      ]
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "Last updated: June 2026",
      paragraphs: [
        "These terms outline the operational guidelines for allocating funds through GELD's automated wealth orbitals and liquidity stream vaults.",
        "GELD does not guarantee speculative yields; historical APY figures represent verified strategy audits and are not absolute assurances of future growth.",
        "Unauthorized reverse engineering of orbital math, ledger node paths, or security shields is strictly prohibited and is subject to immediate service termination."
      ]
    },
    api: {
      title: "API Reference",
      lastUpdated: "Last updated: June 2026",
      paragraphs: [
        "GELD exposes lightweight, developer-friendly REST and WebSocket endpoints for query integrations, transaction streams, and security audit confirmations.",
        "Use the `/v1/vaults/liquidity` endpoint to retrieve real-time APY strategy figures, or `/v1/orbitals/status` to monitor asset balancing coordinates.",
        "Authentication requires fanning key tokens generated in your administrative dashboard."
      ]
    }
  };

  const activeDoc = docsContent[activeTab];

  return (
    <section ref={activeRef} className={styles.section}>
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        <div className={styles.heroSection}>
          <h2 className={styles.title}>
            System & <span className={styles.goldText}>Documents</span>
          </h2>
          <p className={styles.subtitle}>
            Read GELD's system specifications, legal policies, API endpoints, and terms of service.
          </p>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarHeader}>Documentation</h3>
            <nav className={styles.sidebarNav}>
              <button
                className={`${styles.navBtn} ${activeTab === "intro" ? styles.activeNavBtn : ""}`}
                onClick={() => setActiveTab("intro")}
              >
                Introduction
              </button>
              <button
                className={`${styles.navBtn} ${activeTab === "privacy" ? styles.activeNavBtn : ""}`}
                onClick={() => setActiveTab("privacy")}
              >
                Privacy Policy
              </button>
              <button
                className={`${styles.navBtn} ${activeTab === "terms" ? styles.activeNavBtn : ""}`}
                onClick={() => setActiveTab("terms")}
              >
                Terms of Service
              </button>
              <button
                className={`${styles.navBtn} ${activeTab === "api" ? styles.activeNavBtn : ""}`}
                onClick={() => setActiveTab("api")}
              >
                API Reference
              </button>
            </nav>
          </aside>

          <article className={styles.content}>
            <div className={styles.docHeader}>
              <h3 className={styles.docTitle}>{activeDoc.title}</h3>
              <p className={styles.docMeta}>{activeDoc.lastUpdated}</p>
            </div>

            <div className={styles.docBody}>
              {activeDoc.paragraphs.map((p, idx) => (
                <p key={idx} className={styles.docParagraph}>
                  {p}
                </p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}