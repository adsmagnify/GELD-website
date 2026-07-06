import React, { useEffect, useRef, useState } from "react";
import styles from "./Docs.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface DocsProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
  [key: string]: any;
}

const LAST_UPDATED = "July 6, 2026";

const POLICY_ITEMS = [
  {
    id: "collect",
    title: "What we collect",
    text: "Name, email, phone, and details you submit via forms, plus basic site usage data like browser type and pages visited.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 7h16M4 12h10M4 17h14" strokeLinecap="round" />
        <circle cx="18" cy="17" r="3" />
      </svg>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    text: "To respond to inquiries, deliver requested services, improve the website, and share updates if you have opted in.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    id: "protect",
    title: "How we protect it",
    text: "We never sell your data. Reasonable safeguards are in place, with limited sharing only when required for operations or law.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "choices",
    title: "Your choices",
    text: "Request updates or deletion anytime, opt out of marketing emails, and note that our services are for adults 18+.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M7 12l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="18" height="18" rx="4" />
      </svg>
    ),
  },
] as const;

export default function Docs({ ref, onScrollDown, isSubpage }: DocsProps) {
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

  return (
    <section
      ref={activeRef}
      className={`${styles.aboutSection} ${isSubpage ? styles.aboutSectionSubpage : ""} ${isVisible ? styles.revealed : ""}`}
    >
      <div className={`${styles.statementWrapper} ${isSubpage ? styles.statementWrapperSubpage : ""}`}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutBadge}>
            <span className={styles.aboutBadgeText}>Privacy Policy</span>
          </div>

          {isSubpage ? (
            <p className={styles.aboutTextCompact}>
              A brief overview of how we handle your information.{" "}
              <span className={styles.highlightTextCompact}>Last updated {LAST_UPDATED}.</span>
            </p>
          ) : (
            <>
              <p className={styles.aboutText}>
                <span className={styles.serifItalic}>Your trust matters to us.</span>{" "}
                <span className={styles.fadeText}>
                  This page outlines the basics of how GELD Wealth collects and uses your information.
                </span>
              </p>
              <p className={styles.lastUpdated}>Last updated: {LAST_UPDATED}</p>
            </>
          )}
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.policyGrid}>
          {POLICY_ITEMS.map((item, index) => (
            <article key={item.id} className={styles.policyTile} style={{ animationDelay: `${index * 80}ms` }}>
              <div className={styles.tileTop}>
                <span className={styles.tileIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.tileIcon}>{item.icon}</span>
              </div>
              <h2 className={styles.tileTitle}>{item.title}</h2>
              <p className={styles.tileText}>{item.text}</p>
            </article>
          ))}
        </div>

        <article className={styles.contactTile}>
          <div className={styles.contactCopy}>
            <p className={styles.contactEyebrow}>Questions?</p>
            <h2 className={styles.contactTitle}>Contact us about your data</h2>
            <p className={styles.contactText}>
              Reach our team for privacy requests, corrections, or any concerns about how your information is handled.
            </p>
          </div>
          <a href="mailto:Support@geldwealth.com" className={styles.contactButton}>
            Support@geldwealth.com
          </a>
        </article>

        <div className={styles.disclaimerBox}>
          <p>
            <strong>Note:</strong> Website content is for informational purposes only and does not constitute
            investment advice. Investments are subject to market risks.
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
