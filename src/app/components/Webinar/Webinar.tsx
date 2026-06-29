
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Webinar.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface WebinarProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
}

export default function Webinar({ ref, onScrollDown }: WebinarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const posters = [
    { src: "/webinar_poster_1.png", alt: "The Future of Banking: Digital Transformation" },
    { src: "/webinar_poster_2.png", alt: "Ledger Security & Digital Assets" },
    { src: "/webinar_poster_3.png", alt: "Scaling Liquidity & Real-Time Markets" },
  ];

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posters.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [posters.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posters.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posters.length) % posters.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
  };

  return (
    <section ref={activeRef as any} className={styles.section}>
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        <div className={styles.heroSection}>
          <h2 className={styles.title}>
            The Digital Banking <span className={styles.goldText}>Revolution</span>
          </h2>
          <p className={styles.subtitle}>
            Join our leading investment and tech architects for a live, interactive demonstration of GELD's custom wealth management analytics, real-time liquidity streams, and asset allocation tools.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.carouselCol}>
            <div className={styles.carouselContainer}>
              <div className={styles.carousel}>
                <button className={`${styles.carouselArrow} ${styles.prev}`} onClick={prevSlide} aria-label="Previous slide">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <div className={styles.carouselViewport}>
                  <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {posters.map((poster, index) => (
                      <div key={index} className={styles.slide}>
                        <img src={poster.src} alt={poster.alt} className={styles.posterImage} />
                      </div>
                    ))}
                  </div>
                </div>

                <button className={`${styles.carouselArrow} ${styles.next}`} onClick={nextSlide} aria-label="Next slide">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

              <div className={styles.carouselDots}>
                {posters.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.carouselDot} ${currentSlide === index ? styles.activeDot : ""}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.cardCol}>
            <div className={styles.card}>
              {!isRegistered ? (
                <>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Reserve Your Seat</h2>
                    <p className={styles.cardSubtitle}>Webinar access link will be emailed to you</p>
                  </div>

                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label} htmlFor="webinar-name">Full Name</label>
                      <input
                        id="webinar-name"
                        type="text"
                        className={styles.input}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label} htmlFor="webinar-email">Email Address</label>
                      <input
                        id="webinar-email"
                        type="email"
                        className={styles.input}
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Register Now
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
                  <h2 className={styles.cardTitle}>You're Registered!</h2>
                  <p className={styles.successSubtitle}>
                    Thank you, {name}. We have sent your webinar calendar invite to <strong>{email}</strong>.
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

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} />
        </div>
      )}
    </section>
  );
}