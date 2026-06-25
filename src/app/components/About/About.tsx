import React from "react";
import styles from "./About.module.css";

interface AboutProps {
  ref?: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
}

export default function About({ ref, isVisible }: AboutProps) {
  return (
    <section ref={ref} className={`${styles.aboutSection} ${isVisible ? styles.revealed : ""}`}>
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
    </section>
  );
}
