import React from "react";
import styles from "../shared/subpageShell.module.css";
import Background from "../components/Background/Background";
import Webinar from "../components/Webinar/Webinar";
import { getWebinarPoster } from "../lib/webinarPoster";

export const revalidate = 60;

export default async function WebinarPage() {
  const webinarPoster = await getWebinarPoster();

  return (
    <div className={styles.container}>
      <Background />
      <Webinar
        isSubpage
        posterSrc={webinarPoster.src}
        posterAlt={webinarPoster.alt}
      />
    </div>
  );
}
