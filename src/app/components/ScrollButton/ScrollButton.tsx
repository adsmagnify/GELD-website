import React from "react";
import styles from "./ScrollButton.module.css";

interface ScrollButtonProps {
  onClick: () => void;
  darkText?: boolean;
}

export default function ScrollButton({ onClick, darkText = false }: ScrollButtonProps) {
  return (
    <div 
      className={`${styles.scroll} ${darkText ? styles.darkText : ""}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <span>Scroll</span>
      <span className={styles.scrollArrow}>
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 1V13M5 13L1 9M5 13L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
