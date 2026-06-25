import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

interface HeaderProps {
  onAboutClick: () => void;
}

export default function Header({ onAboutClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span>GELD</span>
      </Link>

      <nav className={styles.nav}>
        <a 
          href="#about" 
          className={styles.navLink}
          onClick={(e) => {
            e.preventDefault();
            onAboutClick();
          }}
        >
          About us
        </a>
        <a href="#" className={styles.navLink}>Products</a>
        <a href="#" className={styles.navLink}>Fund Managers</a>
        <a href="#" className={styles.navLink}>Performance</a>
        <a href="#" className={styles.navLink}>Webinar</a>
        <a href="#" className={styles.navLink}>Blog</a>
        <a href="#" className={styles.navLink}>Docs(Privacy Policy)</a>
      </nav>

      <div className={styles.headerActions}>
        <Link href="/login" className={styles.loginBtn}>Login</Link>
        <Link href="/signup" className={styles.signupBtn}>Sign up</Link>
      </div>
    </header>
  );
}
