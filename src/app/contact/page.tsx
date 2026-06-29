"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Background from "../components/Background/Background";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className={styles.container}>
      {/* Dynamic gold-and-black particles and grids background */}
      <Background />

      <div className={styles.wrapper}>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
        {!isSubmitted ? (
          <>
            <div className={styles.header}>
              <div className={styles.logo}>GELD</div>
              <h2 className={styles.title}>Contact Us</h2>
              <p className={styles.subtitle}>Get in touch with our financial experts</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className={styles.input}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="message">Message</label>
                <textarea
                  id="message"
                  className={styles.textarea}
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className={styles.title}>Thank You!</h2>
            <p className={styles.successSubtitle}>
              Your message has been sent successfully. Our team will contact you shortly.
            </p>
            <Link href="/" className={styles.returnBtn}>
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}
