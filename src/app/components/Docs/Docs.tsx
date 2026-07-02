import React, { useEffect, useRef, useState } from "react";
import styles from "./Docs.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface DocsProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  [key: string]: any;
}

export default function Docs({ ref, onScrollDown }: DocsProps) {
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
    <section ref={activeRef} className={`${styles.aboutSection} ${isVisible ? styles.revealed : ""}`}>
      <div className={styles.aboutContainer}>
        {/* Badge */}
        <div className={styles.aboutBadge}>
          <span className={styles.aboutBadgeText}>Documentation</span>
        </div>

        {/* Main Paragraph */}
        <p className={styles.aboutText}>
          <span className={styles.serifItalic}>Transparency built on verified standards.</span>{" "}
          <span className={styles.fadeText}>Review our complete developer API manuals, security whitepapers,</span>{" "}
          <span className={styles.highlightText}>and ledger compliance audit reports detailing our vault cryptography.</span>{" "}
          <span className={styles.fadeText}>Everything you need to inspect the engineering behind the GELD ledger.</span>
        </p>
      </div>

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} darkText={false} />
        </div>
      )}
    </section>
  );
}
