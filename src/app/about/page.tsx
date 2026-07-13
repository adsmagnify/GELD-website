import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import About from "../components/About/About";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Background />
      <About />
    </div>
  );
}