"use client";

import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import Testimonials from "../components/SocialMedia/SocialMedia";

export default function TestimonialsPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Testimonials isSubpage />
    </div>
  );
}