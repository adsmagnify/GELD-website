"use client";

import React from "react";
import styles from "./page.module.css";
import Background from "../components/Background/Background";
import Products from "../components/Products/Products";

export default function ProductsPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Products isSubpage />
    </div>
  );
}
