"use client";

import React, { Suspense } from "react";
import styles from "../page.module.css";
import Background from "../../components/Background/Background";
import Products from "../../components/Products/Products";

export default function IapProductPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Suspense fallback={<div style={{ color: "#ffffff", padding: "100px", textAlign: "center" }}>Loading IAP Details...</div>}>
        <Products mode="detail" defaultProduct="IAP" />
      </Suspense>
    </div>
  );
}
