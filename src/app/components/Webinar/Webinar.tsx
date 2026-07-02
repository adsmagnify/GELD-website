"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Webinar.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface WebinarProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  [key: string]: any;
}

export default function Webinar({ ref, onScrollDown }: WebinarProps) {
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

  const features = [
    {
      title: "How to identify high probability trades",
      desc: "Learn the core triggers to spot and execute trades with high win rates."
    },
    {
      title: "Derivatives decoded • F&O without confusion",
      desc: "Understand futures & options trading simplified for consistent returns."
    },
    {
      title: "How to manage risk before it manages you",
      desc: "Implement professional risk parameters to protect your capital."
    },
    {
      title: "Reading the market like a professional",
      desc: "Analyze charts, technical indicators, and volume trends like a pro."
    },
    {
      title: "Live Q&A • your questions, answered by Chandan",
      desc: "Get direct answers and feedback on your specific trading queries."
    }
  ];

  return (
    <section ref={activeRef} className={`${styles.section} ${isVisible ? styles.revealed : ""}`}>
      <div className={styles.webinarContainer}>
        
        {/* 1. Header Titles (Centered, Top) */}
        <div className={styles.headerBlock}>
          <h2 className={styles.mainTitle}>Join GELD's <span className={styles.goldText}>FREE Weekend Webinar</span></h2>
          <p className={styles.goldSubtitle}>
            Ask The Expert, Trade Smarter
          </p>
          <p className={styles.subSubtitle}>
            Join a live session with one of India's most watched market voices — and get your trading questions answered directly.
          </p>
          <div className={styles.dividerLine}></div>
        </div>

        {/* 2. Split Columns Content */}
        <div className={styles.contentSplit}>
          
          {/* Left Column: Speaker Portrait & Credentials */}
          <div className={styles.speakerColumn}>
            <div className={styles.imageFrame}>
              <img 
                src="/webinar_poster.png" 
                alt="GELD Weekend Webinar poster" 
                className={styles.posterImg} 
              />
            </div>
            
            <div className={styles.speakerBio}>
              {/* <h3 className={styles.speakerName}>Meet Your Speaker – Chandan Taparia</h3>
              <p className={styles.speakerTagline}>Head of Derivatives & Technical Research, Motilal Oswal Financial Services</p>
              <p className={styles.speakerExp}>Seen daily on CNBC TV18 • ET Now • Zee Business</p> */}
              
              {/* Host/Partner Row */}
              {/* <div className={styles.hostWrapper}>
                <img 
                  src="/aastha_jha.png" 
                  alt="Aastha Jha - Partner" 
                  className={styles.hostAvatar} 
                />
                <div className={styles.hostMeta}>
                  <span className={styles.hostLabel}>IN CONVERSATION WITH</span>
                  <span className={styles.hostName}>AASTHA JHA</span>
                  <span className={styles.hostTitle}>PARTNER, GELD</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Column: Wealth Masterclass Features & Button */}
          <div className={styles.featuresColumn}>
            <h3 className={styles.featuresHeading}>Exclusive 60-Minute Wealth Masterclass</h3>
            
            <div className={styles.featuresList}>
              {features.map((item, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <div className={styles.checkmarkWrapper}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkmarkIcon}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className={styles.featureText}>
                    <h4 className={styles.featureTitle}>{item.title}</h4>
                    <p className={styles.featureDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro schedule summary line */}
            <div className={styles.miniScheduleLine}>
              <span className={styles.scheduleBadge}>MONDAY, 13TH JULY 2026</span>
              <span className={styles.scheduleBadge}>7:30 PM ONWARDS</span>
              <span className={styles.scheduleBadge}>ONLINE • FREE TO ATTEND</span>
            </div>

            {/* Call to Actions */}
            <div className={styles.ctaBlock}>
              <button 
                className={styles.reserveBtn}
                onClick={() => window.open("https://us06web.zoom.us/meeting/register/c_aXknaCTjKhfQDFje_WhQ", "_blank")}
              >
                Reserve Your Seat Now !!
              </button>
              <a href="mailto:Support@geldwealth.com" className={styles.supportLink}>
                For zoom registration as well as other queries, contact Support@geldwealth.com
              </a>
            </div>
          </div>

        </div>

        {/* 3. Disclaimers (Centered, Bottom) */}
        <div className={styles.disclaimerWrapper}>
          <p className={styles.disclaimerText}>
            This webinar is for educational purposes only. Views expressed are of the speaker and do not constitute investment advice. Securities market investments are subject to market risks. Please read all related documents carefully before investing. Gold Wealth is a SEBI Registered Investment Advisor.
          </p>
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
