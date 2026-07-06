"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./FundManagers.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface FundManagersProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  [key: string]: any;
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
      { threshold: 0.05 }
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
      name: "Raamdeo Agrawal",
      role: "Chairman & Co-Founder",
      company: "Motilal Oswal (MOSL)",
      specialty: "Value Investing",
      bio: "Co-founder of MOSL and pioneer of the QGLP investing framework.",
      avatar: "/ramdeoagrawal1.jpg",
      linkedin: "https://www.linkedin.com/in/raamdeo-agrawal-38600b12/"
    },
    {
      name: "Chandan Taparia",
      role: "Head - Derivatives & Technicals",
      company: "Motilal Oswal (MOSL)",
      specialty: "Derivatives Desk",
      bio: "Renowned derivatives strategist and momentum research lead.",
      avatar: "/chandantaparia.jpg",
      linkedin: "https://www.linkedin.com/in/chandan-taparia-b7001438/"
    },
    {
      name: "Sailesh Saraf",
      role: "Founder & Director",
      company: "Dynamic Equities",
      specialty: "Multi-Asset PMS",
      bio: "Creator of algorithmic allocation and capital indexing models.",
      avatar: "/ShaileshSaraf.jpg",
      linkedin: "https://www.linkedin.com/in/sailesh-saraf-57a66914"
    },
    {
      name: "Sunil Singhania",
      role: "Founder",
      company: "Abakkus Asset Manager",
      specialty: "Equity Alpha",
      bio: "Celebrated fund manager with multi-billion dollar track records.",
      avatar: "/Sunil Singhania.jpg",
      linkedin: "https://www.linkedin.com/in/sunilsinghania/",
      objectPosition: "top"
    },
    {
      name: "Pankaj Murarka",
      role: "Founder & CIO",
      company: "Renaissance Investment",
      specialty: "Growth Portfolios",
      bio: "Over 25 years of institutional equity management experience.",
      avatar: "/Pankaj Murarka.jpg",
      linkedin: "https://www.linkedin.com/in/pankaj-murarka-60a63110"
    },
    {
      name: "Shailendra Kumar",
      role: "Founder & CIO",
      company: "Narnolia",
      specialty: "Quantitative PMS",
      bio: "Architect of advanced absolute return models and indexes.",
      avatar: "/Shailendra Kumar.jpg",
      linkedin: "https://www.linkedin.com/in/shailendra-kumar-9b16124"
    },
    {
      name: "Vikas Khemani",
      role: "Founder",
      company: "Carnelian Advisors",
      specialty: "Thematic Equity",
      bio: "Former CEO of Edelweiss Securities, managing thematic alpha.",
      avatar: "/Vikas Khemani.jpeg",
      linkedin: "https://www.linkedin.com/in/vikaskhemani/"
    },
    {
      name: "Madhu Runawat",
      role: "Founder & Managing Director",
      company: "Wealth Co",
      specialty: "Private Wealth",
      bio: "Crafts customized estate structures and private capital vaults.",
      avatar: "/Madhu Runawat.jpg",
      linkedin: "https://www.linkedin.com/in/madhu-runawat-9014164b",
      objectPosition: "top"
    }
  ];

  return (
    <section ref={activeRef} className={`${styles.aboutSection} ${isVisible ? styles.revealed : ""}`}>
      {/* 1. Centered Editorial Statement (Formatting exact match to About Us) */}
      <div className={styles.statementWrapper}>
        <div className={styles.aboutContainer}>
          {/* Badge */}
          <div className={styles.aboutBadge}>
            <span className={styles.aboutBadgeText}>Investment Architects</span>
          </div>

          {/* Main Paragraph */}
          <p className={styles.aboutText}>
            <span className={styles.serifItalic}>Great portfolios require visionary minds.</span>{" "}
            <span className={styles.fadeText}>Guided by legends like Raamdeo Agrawal and Sunil Singhania,</span>{" "}
            <span className={styles.highlightText}>
              our fund management panel brings over 150 combined years of market-beating expertise.
            </span>{" "}
            <span className={styles.fadeText}>
              Connecting your ambition directly with the architects of Indian wealth creation.
            </span>
          </p>
        </div>
      </div>

      {/* 2. Grid of Luxurious Cards (Directly below) */}
      <div className={styles.cardsWrapper}>
        <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
          <div className={styles.grid}>
            {managers.map((m, idx) => (
              <div key={idx} className={styles.card} style={{ transitionDelay: `${idx * 80}ms` }}>
                <div className={styles.avatarWrapper}>
                  <Image
                    src={m.avatar}
                    alt={m.name}
                    className={styles.avatarImg}
                    width={88}
                    height={88}
                    loading="lazy"
                    style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined}
                  />
                  <div className={styles.avatarGlow}></div>
                </div>
                
                <div className={styles.titles}>
                  <h3 className={styles.name}>{m.name}</h3>
                  <p className={styles.company}>{m.company}</p>
                  <p className={styles.role}>{m.role}</p>
                </div>

                <div className={styles.divider}></div>
                
                <p className={styles.bio}>{m.bio}</p>
                
                <div className={styles.specialtyBadge}>
                  <span>{m.specialty}</span>
                </div>

                <button 
                  className={styles.linkedinBtn}
                  onClick={() => window.open(m.linkedin, "_blank")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.linkedinIcon}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>Connect on LinkedIn</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} darkText={false} />
        </div>
      )}
    </section>
  );
}
