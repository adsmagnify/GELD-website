"use client";

import { useSearchParams } from "next/navigation";

import ContactForm from "@/app/components/Contact/ContactForm";
import { resolveContactIntent } from "@/app/lib/contactContext";

import styles from "./page.module.css";

export default function ContactPageClient() {
  const searchParams = useSearchParams();
  const intent = resolveContactIntent(searchParams.get("intent"));

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <ContactForm key={intent} intent={intent} source="contact-page" />
          </div>
        </div>
      </div>
    </div>
  );
}
