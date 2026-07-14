"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Webinar.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";
import { buildMailtoHref, openSupportEmail } from "../../lib/openSupportEmail";

const WEBINAR_MAIL = {
  subject: "Webinar Registration Help",
  body: "Hi GELD team,\n\nI need help with webinar registration.\n\n",
} as const;

interface WebinarProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
  posterSrc?: string;
  posterAlt?: string;
}

const REGISTER_URL =
  "https://us06web.zoom.us/meeting/register/c_aXknaCTjKhfQDFje_WhQ";

const topics = [
  {
    title: "High probability trades",
    desc: "Spot and execute setups with stronger win rates.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Connected Line Graph on top */}
        <path d="M4 10l5-4 5 4 6-5" strokeWidth="1.5" />
        <circle cx="4" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="14" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="20" cy="5" r="1.5" fill="currentColor" stroke="none" />

        {/* Candlestick 1 */}
        <line x1="6" y1="12" x2="6" y2="20" strokeWidth="1.5" />
        <rect x="4.5" y="14" width="3" height="4" fill="none" rx="0.5" />

        {/* Candlestick 2 */}
        <line x1="12" y1="11" x2="12" y2="21" strokeWidth="1.5" />
        <rect x="10.5" y="13" width="3" height="6" fill="currentColor" fillOpacity="0.2" rx="0.5" />

        {/* Candlestick 3 */}
        <line x1="18" y1="9" x2="18" y2="19" strokeWidth="1.5" />
        <rect x="16.5" y="11" width="3" height="5" fill="none" rx="0.5" />
      </svg>
    ),
  },
  {
    title: "Derivatives decoded",
    desc: "F&O simplified, without the confusion.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Circle of magnifying glass */}
        <circle cx="11.5" cy="10.5" r="7" />
        {/* Vertical handle going down */}
        <line x1="11.5" y1="17.5" x2="11.5" y2="22" />
        {/* Letters 'd' and 'X' drawn with paths inside the circle */}
        <path d="M9.5 7.5v5M9.5 12.5a2 2 0 110-4h.01" strokeWidth="1.5" />
        <path d="M12.5 8.5l3.5 3.5M16 8.5l-3.5 3.5" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Risk management",
    desc: "Protect capital before the market moves against you.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Warning Triangle on top left */}
        <path d="M9 2.5l6.5 11h-13z" />
        <line x1="9" y1="6" x2="9" y2="10" strokeWidth="1.5" />
        <circle cx="9" cy="12" r="0.6" fill="currentColor" stroke="none" />

        {/* Gear on bottom right */}
        <circle cx="16" cy="16" r="2.5" />
        <path d="M16 11.5v1M16 19.5v1M11.5 16h1M19.5 16h1M12.8 12.8l.7.7M18.5 18.5l.7.7M19.2 12.8l-.7.7M13.5 18.5l-.7.7" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Read the market",
    desc: "Charts, volume, and trends like a professional.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Document sheet */}
        <path d="M4 3h9.5L18 7.5V21H4V3z" />
        <path d="M13.5 3v4.5H18" strokeWidth="1.5" />

        {/* Bar chart lines inside document */}
        <line x1="7" y1="8" x2="11" y2="8" strokeWidth="1.5" />
        <line x1="7" y1="11" x2="9" y2="11" strokeWidth="1.5" />

        {/* Small bars */}
        <line x1="7" y1="17" x2="7" y2="14" strokeWidth="1.5" />
        <line x1="10" y1="17" x2="10" y2="12" strokeWidth="1.5" />

        {/* Magnifying glass in bottom right */}
        <circle cx="15.5" cy="15.5" r="3.5" fill="none" />
        <line x1="18" y1="18" x2="21" y2="21" strokeWidth="1.5" />
        {/* Dollar symbol inside */}
        <path d="M15.5 13.5v4M14.5 14.8c.2-.4.6-.6 1-.6.6 0 1 .4 1 1 0 .6-.4.8-1 1s-1 .4-1 1 .4 1 1 1c.4 0 .8-.2 1-.6" strokeWidth="1.2" />
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

export default function Webinar({
  ref,
  onScrollDown,
  isSubpage,
  posterSrc = "/webinar_poster.jpg",
  posterAlt = "GELD webinar poster: Ask The Expert, Trade Smarter with Chandan Taparia",
}: WebinarProps) {
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
            Join a live session with one of India's most watched market voices, and get your
            trading questions answered directly.
          </p>
        </header>

        <div className={styles.stage}>
          <div className={styles.posterColumn}>
            <div className={styles.posterShell}>
              <div className={styles.posterGlow} aria-hidden="true" />
              <div className={styles.posterFrame}>
                <Image
                  src={posterSrc}
                  alt={posterAlt}
                  width={640}
                  height={900}
                  className={styles.posterImg}
                  sizes="(max-width: 768px) 90vw, 420px"
                  priority={isSubpage}
                  loading={isSubpage ? "eager" : "lazy"}
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
                Whether you trade on your own or are just starting out,{" "}
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
              <p className={styles.supportLine}>
                For registration help, contact{" "}
                <a
                  href={buildMailtoHref(WEBINAR_MAIL.subject, WEBINAR_MAIL.body)}
                  className={styles.supportLink}
                  onClick={(e) => {
                    e.preventDefault();
                    openSupportEmail(WEBINAR_MAIL.subject, WEBINAR_MAIL.body);
                  }}
                >
                  Support@geldwealth.com
                </a>
              </p>
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
