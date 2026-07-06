"use client";

import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import Performance from "../components/Performance/Performance";

export default function PerformancePage() {
  return (
    <div className={styles.container}>
      <Background />
      <Performance isSubpage />
    </div>
  );
}
