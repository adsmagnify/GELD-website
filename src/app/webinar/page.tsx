import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import Webinar from "../components/Webinar/Webinar";

export default function WebinarPage() {
  return (
    <div className={styles.container}>
      <Background />
      <Webinar isSubpage />
    </div>
  );
}