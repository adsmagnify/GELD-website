import React from "react";
import styles from "./Background.module.css";

export default function Background() {
  return (
    <div className={styles.glowBg}>
      <div className={styles.glowLine1}></div>
      <div className={styles.glowLine2}></div>
      <div className={styles.glowLine3}></div>
      <div className={styles.glowLine4}></div>
      
      {/* Subtle 3D perspective market floor grid */}
      <div className={styles.grid3d}></div>
      
      {/* High-precision coordinate overlay */}
      <div className={styles.gridOverlay}></div>
      
      {/* Concentric Wealth Orbitals */}
      <div className={styles.orbitalsContainer}>
        <svg className={styles.orbitalsSvg} viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="500" r="400" className={styles.orbitRing1} />
          <circle cx="500" cy="500" r="300" className={styles.orbitRing2} />
          <circle cx="500" cy="500" r="200" className={styles.orbitRing3} />
          {/* Animated revolving nodes */}
          <circle cx="500" cy="100" r="6" className={styles.orbitNode1} />
          <circle cx="500" cy="200" r="5" className={styles.orbitNode2} />
          <circle cx="500" cy="300" r="4" className={styles.orbitNode3} />
        </svg>
      </div>

      {/* Harmonic Market Waves */}
      <div className={styles.harmonicWavesContainer}>
        <svg className={styles.harmonicSvg} viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path className={styles.wave1} d="M 0,300 C 150,220 300,380 450,300 C 600,220 750,380 900,300 C 1050,220 1200,300 1200,300" />
          <path className={styles.wave2} d="M 0,350 C 200,270 400,430 600,350 C 800,270 1000,430 1200,350" />
          <path className={styles.wave3} d="M 0,400 C 250,340 500,460 750,400 C 1000,340 1200,400 1200,400" />
        </svg>
      </div>

      {/* Liquidity Particle Flows */}
      <div className={`${styles.liquidityParticle} ${styles.p1}`}></div>
      <div className={`${styles.liquidityParticle} ${styles.p2}`}></div>
      <div className={`${styles.liquidityParticle} ${styles.p3}`}></div>
      <div className={`${styles.liquidityParticle} ${styles.p4}`}></div>
      <div className={`${styles.liquidityParticle} ${styles.p5}`}></div>
    </div>
  );
}
