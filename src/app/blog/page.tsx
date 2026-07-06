"use client";

import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import Blog from "../components/Blog/Blog";

export default function BlogPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Blog isSubpage />
    </div>
  );
}
