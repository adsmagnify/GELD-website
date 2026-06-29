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
          <span className={styles.aboutBadgeText}>About GELD</span>
        </div>

        {/* Main Paragraph */}
        <p className={styles.aboutText}>
          <span className={styles.serifItalic}>We believe the future of banking is digital,</span>{" "}
          <span className={styles.fadeText}>transparent, and customer-first.</span>{" "}
          <span className={styles.highlightText}>Our platform empowers financial institutions</span>{" "}
          <span className={styles.fadeText}>
            to transform traditional operations into seamless digital experiences
            enhancing trust, efficiency, and innovation at every level.
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


