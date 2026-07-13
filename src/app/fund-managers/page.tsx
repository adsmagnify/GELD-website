import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import FundManagers from "../components/FundManagers/FundManagers";

export default function FundManagersPage() {
  return (
    <div className={styles.container}>
      <Background />
      <FundManagers isSubpage />
    </div>
  );
}
