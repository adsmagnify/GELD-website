import React, { useEffect, useRef, useState } from "react";
import styles from "./About.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface AboutProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
}

export default function About({ ref, onScrollDown }: AboutProps) {
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
      {
        threshold: 0.15,
      }
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
          <span className={styles.aboutBadgeText}>Why GELD exists</span>
        </div>

        {/* Main Paragraph */}
        <p className={styles.aboutText}>
          <span className={styles.serifItalic}>Markets never stand still, and neither do we</span>{" "}
          <span className={styles.highlightText}>At Geld, we track every shift, decode every opportunity, 
          and make sure your wealth is always working in the right direction,</span>{" "}
          <span className={styles.fadeText}>across every asset class, not just equities.</span>{" "}
          <span className={styles.fadeText}>
            You focus on building your kingdom. We make sure your money keeps pace with your ambition.
          </span>
        </p>
      </div>

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} darkText={true} />
        </div>
      )}
    </section>
  );
}


