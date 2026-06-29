"use client";

import React, { useState, forwardRef } from "react";
import styles from "./Contact.module.css";
import Background from "../Background/Background";

interface ContactProps {
  // Optional props
}

const Contact = forwardRef<HTMLElement, ContactProps>((props, ref) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section ref={ref} className={styles.section}>
      <Background />
      <div className={styles.container}>
        <div className={styles.head}>
          <span className={styles.label}>GET IN TOUCH</span>
          <h2 className={styles.title}>
            Let's build your <span className={styles.goldText}>financial future</span>
          </h2>
          <p className={styles.subtitle}>
            Our experts are ready to assist you. Fill out the form below.
          </p>
        </div>

        <div className={styles.card}>
          {!isSubmitted ? (
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

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          ) : (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className={styles.successTitle}>Thank You!</h3>
              <p className={styles.successText}>
                Your message has been sent successfully. We will get back to you shortly.
              </p>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setName("");
                  setEmail("");
                  setMessage("");
                }} 
                className={styles.resetBtn}
              >
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";

export default Contact;
