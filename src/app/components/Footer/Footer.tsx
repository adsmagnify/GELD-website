import React from "react";
import styles from "./Footer.module.css";

interface FooterProps {
  onScrollClick: () => void;
}

export default function Footer({ onScrollClick }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {/* Scroll Indicator */}
      <div 
        className={styles.scroll} 
        onClick={onScrollClick} 
        role="button" 
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onScrollClick(); }}
      >
        <span>Scroll</span>
        <span className={styles.scrollArrow}>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1V13M5 13L1 9M5 13L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Advisors Bubble Stack */}
      <div className={styles.advisorBadge}>
        <span className={styles.advisorText}>Meet with 10+ financial advisors</span>
        <div className={styles.avatarsGroup}>
          <div className={styles.avatar}>
            <img src="/avatar1.svg" alt="Advisor 1" className={styles.avatarImage} />
          </div>
          <div className={styles.avatar}>
            <img src="/avatar2.svg" alt="Advisor 2" className={styles.avatarImage} />
          </div>
          <div className={styles.avatar}>
            <img src="/avatar3.svg" alt="Advisor 3" className={styles.avatarImage} />
          </div>
        </div>
        <span className={styles.advisorLabel}>Finance experts</span>
      </div>
    </footer>
  );
}
