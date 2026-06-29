"use client";

import React from "react";
import styles from "./page.module.css";
import Background from "../components/Background/Background";
import Testimonials from "../components/Testimonials/Testimonials";

export default function TestimonialsPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Testimonials isSubpage />
    </div>
  );
}