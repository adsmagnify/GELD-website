import React from "react";
import styles from "./ProductChargesNote.module.css";
import { PRODUCT_CHARGES_COPY } from "../../data/productCopy";

export default function ProductChargesNote() {
  return (
    <aside className={styles.note} aria-labelledby="product-charges-heading">
      <h3 id="product-charges-heading" className={styles.label}>
        Our charges
      </h3>
      <p className={styles.text}>{PRODUCT_CHARGES_COPY}</p>
    </aside>
  );
}
