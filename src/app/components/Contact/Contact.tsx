"use client";

import React, { useState, forwardRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./Contact.module.css";
import { thankYouPageHref } from "../../lib/contactContext";
import {
  CONTACT_LIMITS,
  EMAIL_PATTERN,
  NAME_PATTERN,
  firstContactError,
  getPhoneDigits,
  validateContactField,
  validateContactFields,
  type ContactFieldErrors,
  type ContactFieldKey,
} from "../../lib/contactValidation";
import { submitContactForm } from "../../lib/submitContactForm";

interface ContactProps {
  // Optional props
}

const Contact = forwardRef<HTMLElement, ContactProps>((props, ref) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFieldKey, boolean>>>({});
  const [isVisible, setIsVisible] = useState(false);

  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = (ref as React.RefObject<HTMLElement | null>) || fallbackRef;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const current = activeRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [activeRef]);

  const setFieldLiveError = (field: ContactFieldKey, value: string, markTouched = false) => {
    const requireFilled = markTouched || Boolean(touched[field]);
    const nextError = validateContactField(field, value, { requireFilled });
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (nextError) next[field] = nextError;
      else delete next[field];
      return next;
    });
  };

  const handleBlur = (field: ContactFieldKey, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldLiveError(field, value, true);
  };

  const handlePhoneChange = (value: string) => {
    const digits = getPhoneDigits(value);
    if (digits.length > CONTACT_LIMITS.MAX_PHONE_DIGITS) return;
    setPhone(digits);
    setFieldLiveError("phone", digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({ name: true, email: true, phone: true, message: true });

    const errors = validateContactFields({ name, email, phone, message });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(firstContactError(errors));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        source: "home-page",
        intent: "home",
      });
      router.push(thankYouPageHref(result.intent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className={styles.section}>
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        <div className={styles.head}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>Get In Touch</span>
          </div>
          <h2 className={styles.title}>
            Let's build your <span className={styles.goldText}>financial future</span>
          </h2>
          <p className={styles.subheading}>
            Our experts are ready to assist you. Fill out the form below.
          </p>
        </div>

        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="home-name">
                Full Name
              </label>
              <input
                id="home-name"
                type="text"
                className={`${styles.input} ${fieldErrors.name ? styles.inputInvalid : ""}`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  const value = e.target.value.slice(0, CONTACT_LIMITS.MAX_NAME);
                  setName(value);
                  setFieldLiveError("name", value);
                }}
                onBlur={() => handleBlur("name", name)}
                pattern={NAME_PATTERN.source}
                minLength={CONTACT_LIMITS.MIN_NAME}
                maxLength={CONTACT_LIMITS.MAX_NAME}
                autoComplete="name"
                required
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "home-name-error" : undefined}
              />
              {fieldErrors.name ? (
                <p id="home-name-error" className={styles.fieldError}>
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="home-email">
                Email Address
              </label>
              <input
                id="home-email"
                type="email"
                className={`${styles.input} ${fieldErrors.email ? styles.inputInvalid : ""}`}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  const value = e.target.value.slice(0, CONTACT_LIMITS.MAX_EMAIL);
                  setEmail(value);
                  setFieldLiveError("email", value);
                }}
                onBlur={() => handleBlur("email", email)}
                pattern={EMAIL_PATTERN.source}
                maxLength={CONTACT_LIMITS.MAX_EMAIL}
                autoComplete="email"
                required
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "home-email-error" : undefined}
              />
              {fieldErrors.email ? (
                <p id="home-email-error" className={styles.fieldError}>
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="home-phone">
                Contact Number
              </label>
              <input
                id="home-phone"
                type="tel"
                className={`${styles.input} ${fieldErrors.phone ? styles.inputInvalid : ""}`}
                placeholder="9999999999"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleBlur("phone", phone)}
                inputMode="numeric"
                maxLength={CONTACT_LIMITS.MAX_PHONE_DIGITS}
                autoComplete="tel"
                required
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? "home-phone-error" : undefined}
              />
              {fieldErrors.phone ? (
                <p id="home-phone-error" className={styles.fieldError}>
                  {fieldErrors.phone}
                </p>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="home-message">
                Message
              </label>
              <textarea
                id="home-message"
                className={`${styles.textarea} ${fieldErrors.message ? styles.inputInvalid : ""}`}
                placeholder="Tell us about your financial goals..."
                value={message}
                onChange={(e) => {
                  const value = e.target.value.slice(0, CONTACT_LIMITS.MAX_MESSAGE);
                  setMessage(value);
                  setFieldLiveError("message", value);
                }}
                onBlur={() => handleBlur("message", message)}
                rows={3}
                minLength={CONTACT_LIMITS.MIN_MESSAGE}
                maxLength={CONTACT_LIMITS.MAX_MESSAGE}
                required
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? "home-message-error" : undefined}
              />
              {fieldErrors.message ? (
                <p id="home-message-error" className={styles.fieldError}>
                  {fieldErrors.message}
                </p>
              ) : null}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {error && <p className={styles.errorText}>{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";

export default Contact;
