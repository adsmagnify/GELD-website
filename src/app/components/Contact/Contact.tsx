"use client";

import React, { useState, forwardRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./Contact.module.css";
import { thankYouPageHref } from "../../lib/contactContext";
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
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="home-name">Full Name</label>
                <input
                  id="home-name"
                  type="text"
                  className={styles.input}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="home-email">Email Address</label>
                <input
                  id="home-email"
                  type="email"
                  className={styles.input}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="home-phone">Contact Number</label>
                <input
                  id="home-phone"
                  type="tel"
                  className={styles.input}
                  placeholder="+91 99999 99999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="home-message">Message</label>
                <textarea
                  id="home-message"
                  className={styles.textarea}
                  placeholder="Tell us about your financial goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  required
                />
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
