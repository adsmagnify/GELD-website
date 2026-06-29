

"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./FundManagers.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface FundManagersProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
}

export default function FundManagers({ ref, onScrollDown }: FundManagersProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

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

  const managers = [
    {
      name: "Marcus Vance",
      role: "Chief Investment Architect",
      specialty: "Algorithmic Wealth Orbitals",
      bio: "Marcus has over 15 years of quantitative finance experience at leading institutions. He designs GELD's core orbital allocation strategies and automated rebalancing models.",
      stat: "+26.4% YoY",
      statLabel: "Average Strategy Yield",
      avatar: "/avatar1.svg"
    },
    {
      name: "Helena Rhee",
      role: "Lead Systems Engineer",
      specialty: "Decentralized Ledger Cryptography",
      bio: "Helena oversees ledger synchronization, secure asset custody overlays, and military-grade vault encryption. Formerly led core cryptographic security teams in Silicon Valley.",
      stat: "100%",
      statLabel: "Vault Security Uptime",
      avatar: "/avatar2.svg"
    },
    {
      name: "Devon Pierce",
      role: "Senior Wealth Advisor",
      specialty: "Liquidity Stream Allocation",
      bio: "Devon coordinates client relations and optimizes liquidity stream distributions, aligning GELD's high-yield vaults directly with long-term wealth protection goals.",
      stat: "$1.4B+",
      statLabel: "Assets Managed",
      avatar: "/avatar3.svg"
    }
  ];

  return (
    <section ref={activeRef} className={styles.section}>
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        <div className={styles.heroSection}>
          <h2 className={styles.title}>
            Meet the <span className={styles.goldText}>Architects</span>
          </h2>
          <p className={styles.subtitle}>
            Our financial experts and systems engineers align years of quantitative trading with core ledger security.
          </p>
        </div>

        <div className={styles.grid}>
          {managers.map((m, idx) => (
            <div key={idx} className={styles.card} style={{ transitionDelay: `${idx * 100}ms` }}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <img src={m.avatar} alt={m.name} className={styles.avatarImg} />
                </div>
                <div className={styles.titles}>
                  <h3 className={styles.name}>{m.name}</h3>
                  <p className={styles.role}>{m.role}</p>
                  <p className={styles.specialty}>{m.specialty}</p>
                </div>
              </div>

              <p className={styles.bio}>{m.bio}</p>

              <div className={styles.statContainer}>
                <h4 className={styles.stat}>{m.stat}</h4>
                <p className={styles.statLabel}>{m.statLabel}</p>
              </div>

              <button className={styles.consultBtn}>Review your Portfolio</button>
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
