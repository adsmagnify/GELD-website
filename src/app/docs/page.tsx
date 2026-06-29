"use client";

import React from "react";
import styles from "./page.module.css";
import Background from "../components/Background/Background";
import Docs from "../components/Docs/Docs";

export default function DocsPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Docs isSubpage />
    </div>
  );
}
