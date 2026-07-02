import React, { useEffect, useRef, useState } from "react";
import styles from "./Blog.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface BlogProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  [key: string]: any;
}

export default function Blog({ ref, onScrollDown }: BlogProps) {
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
          <span className={styles.aboutBadgeText}>Research & Insights</span>
        </div>

        {/* Main Paragraph */}
        <p className={styles.aboutText}>
          <span className={styles.serifItalic}>Information is noise, signal is wealth.</span>{" "}
          <span className={styles.fadeText}>At Geld, our research desk decodes complex macro trends,</span>{" "}
          <span className={styles.highlightText}>publishing institutional-grade market briefs, derivative analysis, and tactical asset allocations.</span>{" "}
          <span className={styles.fadeText}>Stay ahead of the curve with insights engineered for the ambitious investor.</span>
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
