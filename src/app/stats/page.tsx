"use client";

import React from "react";
import styles from "../shared/subpageShell.module.css";
import Stats from "../components/Stats/Stats";

export default function StatsPage() {
  return (
    <div className={styles.container}>
      <Stats isGoldenBg />
    </div>
  );
}