"use client";

import React from "react";
import styles from "./page.module.css";
import Background from "../components/Background/Background";
import Stats from "../components/Stats/Stats";

export default function StatsPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Stats />
    </div>
  );
}