import React from "react";

import Background from "../components/Background/Background";
import BlogHero from "../components/Blog/BlogHero";
import BlogList from "../components/Blog/BlogList";
import styles from "../shared/subpageShell.module.css";

export const revalidate = 60;

export default function BlogPage() {
  return (
    <div className={styles.container}>
      <Background />
      <BlogHero />
      <BlogList />
    </div>
  );
}
