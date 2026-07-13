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
} from "@/app/lib/contactValidation";
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
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFieldKey, boolean>>>({});

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

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="intent" value={context.id} readOnly />

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-name`}>
            Full Name
          </label>
          <input
            id={`${idPrefix}-name`}
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
            aria-describedby={fieldErrors.name ? `${idPrefix}-name-error` : undefined}
          />
          {fieldErrors.name ? (
            <p id={`${idPrefix}-name-error`} className={styles.fieldError}>
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-email`}>
            Email Address
          </label>
          <input
            id={`${idPrefix}-email`}
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
            aria-describedby={fieldErrors.email ? `${idPrefix}-email-error` : undefined}
          />
          {fieldErrors.email ? (
            <p id={`${idPrefix}-email-error`} className={styles.fieldError}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-phone`}>
            Contact Number
          </label>
          <input
            id={`${idPrefix}-phone`}
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
            aria-describedby={fieldErrors.phone ? `${idPrefix}-phone-error` : undefined}
          />
          {fieldErrors.phone ? (
            <p id={`${idPrefix}-phone-error`} className={styles.fieldError}>
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`${idPrefix}-message`}>
            Message
          </label>
          <textarea
            id={`${idPrefix}-message`}
            className={`${styles.textarea} ${fieldErrors.message ? styles.inputInvalid : ""}`}
            placeholder={context.messagePlaceholder}
            value={message}
            onChange={(e) => {
              const value = e.target.value.slice(0, CONTACT_LIMITS.MAX_MESSAGE);
              setMessage(value);
              setFieldLiveError("message", value);
            }}
            onBlur={() => handleBlur("message", message)}
            rows={4}
            minLength={CONTACT_LIMITS.MIN_MESSAGE}
            maxLength={CONTACT_LIMITS.MAX_MESSAGE}
            required
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? `${idPrefix}-message-error` : undefined}
          />
          {fieldErrors.message ? (
            <p id={`${idPrefix}-message-error`} className={styles.fieldError}>
              {fieldErrors.message}
            </p>
          ) : null}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        {error ? <p className={styles.errorText}>{error}</p> : null}
      </form>
    </>
  );
}
