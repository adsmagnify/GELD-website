"use client";

import React, { Suspense } from "react";
import styles from "../page.module.css";
import Background from "../../components/Background/Background";
import Products from "../../components/Products/Products";
import { MINI_STOCK_PORTFOLIOS_NAME } from "../../data/catalogProducts";

export default function IapProductPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Suspense
        fallback={
          <div style={{ color: "#ffffff", padding: "100px", textAlign: "center" }}>
            Loading {MINI_STOCK_PORTFOLIOS_NAME}...
          </div>
        }
      >
        <Products mode="detail" defaultProduct={MINI_STOCK_PORTFOLIOS_NAME} />
      </Suspense>
    </div>
  );
}
