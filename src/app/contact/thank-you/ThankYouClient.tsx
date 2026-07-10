"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { getContactIntent, resolveContactIntent } from "@/app/lib/contactContext";

import styles from "../page.module.css";

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const intent = resolveContactIntent(searchParams.get("intent"));
  const context = getContactIntent(intent);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className={styles.badge}>
                <span className={styles.badgeText}>{context.formBadge}</span>
              </div>
              <h2 className={styles.title}>{context.thankYouTitle}</h2>
              <p className={styles.successSubtitle}>{context.thankYouMessage}</p>
              <div className={styles.thankYouActions}>
                <Link href="/" className={styles.returnBtn}>
                  Return to Home
                </Link>
                <Link href="/products" className={styles.secondaryReturnBtn}>
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
