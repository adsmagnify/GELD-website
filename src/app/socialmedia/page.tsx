import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import SocialMedia from "../components/SocialMedia/SocialMedia";

export default function SocialMediaPage() {
  return (
    <div className={styles.container}>
      <Background />
      <SocialMedia isSubpage />
    </div>
  );
}
