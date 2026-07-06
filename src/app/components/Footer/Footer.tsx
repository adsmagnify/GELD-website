import React from "react";
import Image from "next/image";
import styles from "./Footer.module.css";

interface FooterProps {
  onScrollClick: () => void;
}

const advisorAvatars = [
  { name: "Raamdeo Agrawal", photo: "/ramdeoagrawal1.jpg" },
  { name: "Sunil Singhania", photo: "/Sunil Singhania.jpg" },
  { name: "Pankaj Murarka", photo: "/Pankaj Murarka.jpg" },
];

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
          {advisorAvatars.map((advisor) => (
            <div key={advisor.name} className={styles.avatar}>
              <Image
                src={advisor.photo}
                alt={advisor.name}
                className={styles.avatarImage}
                width={40}
                height={40}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <span className={styles.advisorLabel}>Finance experts</span>
      </div>
    </footer>
  );
}
