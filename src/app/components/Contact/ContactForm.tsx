"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getContactIntent,
  persistContactIntent,
  resolveContactIntent,
  thankYouPageHref,
  type ContactIntentConfig,
} from "@/app/lib/contactContext";
import { submitContactForm } from "@/app/lib/submitContactForm";

import styles from "../../contact/page.module.css";

type ContactFormProps = {
  intent?: string;
  source: string;
  showLogo?: boolean;
  idPrefix?: string;
};

export default function ContactForm({
  intent: intentProp,
  source,
  showLogo = true,
  idPrefix = "contact",
}: ContactFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedIntent = useMemo(
    () => resolveContactIntent(intentProp || searchParams.get("intent")),
    [intentProp, searchParams]
  );
  const context: ContactIntentConfig = getContactIntent(resolvedIntent);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await submitContactForm({
        name,
        email,
        phone,
        message,
        source,
        intent: context.id,
      });
      persistContactIntent(result.intent);
      router.push(thankYouPageHref(result.intent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.header}>
        {showLogo ? <div className={styles.logo}>GELD</div> : null}
        <div className={styles.badge}>
          <span className={styles.badgeText}>{context.formBadge}</span>
        </div>
        <h2 className={styles.title}>{context.formTitle}</h2>
        <p className={styles.subheading}>{context.formSubheading}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="hidden" name="intent" value={context.id} readOnly />

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-name`}>
            Full Name
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            className={styles.input}
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-email`}>
            Email Address
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            className={styles.input}
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-phone`}>
            Contact Number
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            className={styles.input}
            placeholder="+91 99999 99999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-message`}>
            Message
          </label>
          <textarea
            id={`${idPrefix}-message`}
            className={styles.textarea}
            placeholder={context.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        {error ? <p className={styles.errorText}>{error}</p> : null}
      </form>
    </>
  );
}
