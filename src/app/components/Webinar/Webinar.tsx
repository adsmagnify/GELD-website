"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Webinar.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface WebinarProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
}

const REGISTER_URL =
  "https://us06web.zoom.us/meeting/register/c_aXknaCTjKhfQDFje_WhQ";

const topics = [
  {
    title: "High probability trades",
    desc: "Spot and execute setups with stronger win rates.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Derivatives decoded",
    desc: "F&O simplified — without the confusion.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 4l-4 4 4 4M16 20l4-4-4-4M4 12h16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Risk management",
    desc: "Protect capital before the market moves against you.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Read the market",
    desc: "Charts, volume, and trends like a professional.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 18V6M10 18V10M16 18V13M22 18V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Live Q&A",
    desc: "Your questions answered directly by Chandan.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 9h10M7 13h6M6 4h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 3V6a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Webinar({ ref, onScrollDown, isSubpage }: WebinarProps) {
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
      { threshold: 0.08 }
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

  return (
    <section
      ref={activeRef}
      className={`${styles.section} ${isVisible ? styles.revealed : ""} ${
        isSubpage ? styles.subpage : ""
      }`}
      id="webinar"
    >
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.gridLines} aria-hidden="true" />

      <div className={styles.webinarContainer}>
        <header className={styles.headerBlock}>
          <div className={styles.badge}>
            {/* <span className={styles.liveDot} aria-hidden="true" /> */}
            <span>Weekly Live Webinar</span>
          </div>
          <p className={styles.tagline}>
            Know today. <span>Profit tomorrow.</span>
          </p>
          <h2 className={styles.mainTitle}>
            Ask The <span className={styles.serifText}>Expert</span>,{" "}
            <span className={styles.goldText}>Trade Smarter</span>
          </h2>
          <p className={styles.subSubtitle}>
            Join a live session with one of India's most watched market voices — and get your
            trading questions answered directly.
          </p>
        </header>

        <div className={styles.stage}>
          <div className={styles.posterColumn}>
            <div className={styles.posterShell}>
              <div className={styles.posterGlow} aria-hidden="true" />
              <div className={styles.posterFrame}>
                <Image
                  src="/webinar_poster.png"
                  alt="GELD webinar poster — Ask The Expert, Trade Smarter with Chandan Taparia"
                  width={640}
                  height={900}
                  className={styles.posterImg}
                  priority={isSubpage}
                />
              </div>
              {/* <div className={styles.limitedRibbon}>
                <span>Limited seats</span>
                <strong>Register now</strong>
              </div> */}
            </div>
          </div>

          <div className={styles.detailColumn}>
            <div className={styles.topicsPanel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>What we'll cover</h3>
                <p className={styles.panelHint}>60-minute wealth masterclass</p>
              </div>
              <div className={styles.topicsGrid}>
                {topics.map((topic, idx) => (
                  <div
                    key={topic.title}
                    className={styles.topicCard}
                    style={{ transitionDelay: `${idx * 70}ms` }}
                  >
                    <div className={styles.topicIcon}>{topic.icon}</div>
                    <div>
                      <h4 className={styles.topicTitle}>{topic.title}</h4>
                      <p className={styles.topicDesc}>{topic.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ctaPanel}>
              <p className={styles.ctaCopy}>
                Whether you trade on your own or are just starting out —{" "}
                <strong>this is the session you don't want to miss.</strong>
              </p>
              <button
                type="button"
                className={styles.reserveBtn}
                onClick={() => window.open(REGISTER_URL, "_blank", "noopener,noreferrer")}
              >
                Reserve your seat
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <a href="mailto:Support@geldwealth.com" className={styles.supportLink}>
                For registration help, contact Support@geldwealth.com
              </a>
            </div>
          </div>
        </div>

        <p className={styles.disclaimerText}>
          This webinar is for educational purposes only. Views expressed are of the speaker and do
          not constitute investment advice. Securities market investments are subject to market
          risks. Please read all related documents carefully before investing. GELD is a SEBI
          Registered Investment Advisor.
        </p>
      </div>

      {onScrollDown && (
        <div className={`${styles.scrollWrapper} scrollWrapperCentered`}>
          <ScrollButton onClick={onScrollDown} darkText={false} />
        </div>
      )}
    </section>
  );
}
