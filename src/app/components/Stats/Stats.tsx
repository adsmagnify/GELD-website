"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Stats.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";
import Background from "../Background/Background";

interface StatsProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
}

const slides = [
  { value: 3, decimals: 0, prefix: "", suffix: "M", label: "User worldwide" },
  { value: 1000, decimals: 0, prefix: "", suffix: "", label: "Transactions per day" },
  { value: 70, decimals: 0, prefix: "", suffix: "%", label: "Average users saved" }
];

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Stats({ ref, onScrollDown }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [displaySlide, setDisplaySlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const current = activeRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [activeRef]);

  // Count-up animation
  useEffect(() => {
    if (!isVisible) return;
    const slide = slides[displaySlide];
    const duration = 800; // 800ms count-up
    const startTime = performance.now();
    const startVal = 0;
    const endVal = slide.value;

    let frameId: number;

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + easeProgress * (endVal - startVal);
      
      setAnimatedValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateNumber);
      }
    };

    frameId = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(frameId);
  }, [displaySlide, isVisible]);

  // Powder particles animation on slide transition - Constant and Slow
  useEffect(() => {
    if (!isVisible) return;
    
    // Generate subtle gold powder particles
    const count = 24;
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6; // upward floating cone
      const distance = 30 + Math.random() * 50;
      return {
        id: i,
        // Distributed horizontally across the number bounds
        x: (Math.random() - 0.5) * 240,
        y: (Math.random() - 0.5) * 40,
        // Slow vertical drift
        dx: Math.sin(angle) * distance,
        dy: -50 - Math.random() * 50,
        size: 1.0 + Math.random() * 1.5, // fine powder: 1px to 2.5px
        delay: -Math.random() * 6, // negative delay so they start offset immediately
        duration: 4.5 + Math.random() * 2.5 // slow duration: 4.5s to 7s
      };
    });
    setParticles(newParticles);
  }, [isVisible]);

  const triggerTransition = useCallback((targetIndex: number) => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplaySlide(targetIndex);
      setIsTransitioning(false);
    }, 350); // wait for exit animation to complete (350ms)
    return () => clearTimeout(timer);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const nextIdx = (currentSlide + 1) % slides.length;
      setCurrentSlide(nextIdx);
      triggerTransition(nextIdx);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, triggerTransition, isVisible]);

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setCurrentSlide(index);
    triggerTransition(index);
  };

  const currentSlideData = slides[displaySlide];
  const formattedNumber = `${currentSlideData.prefix}${animatedValue.toFixed(currentSlideData.decimals)}${currentSlideData.suffix}`;

  return (
    <section ref={activeRef as any} className={styles.section}>
      <Background />
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        
        {/* Header Pill */}
        <div className={styles.pillHeader}>
          <div className={styles.pill}>THE NUMBERS SPEAK</div>
          <div className={styles.dashedLine}></div>
        </div>

        {/* Arch & Numbers Wrapper */}
        <div className={styles.archWrapper}>
          {/* Dotted Arch SVG */}
          <svg className={styles.archSvg} viewBox="0 0 1000 500" fill="none">
            <path 
              d="M 100 480 A 400 380 0 0 1 900 480" 
              className={styles.archPath}
              stroke="rgba(206, 149, 58, 0.45)" 
              strokeWidth="1.5" 
              strokeDasharray="6 8" 
            />
          </svg>

          {/* Slide Text Content */}
          <div className={styles.contentViewport}>
            <div 
              className={`${styles.slideContent} ${
                isTransitioning ? styles.exiting : styles.entering
              }`}
            >
              <div className={styles.valueWrapper}>
                <div className={styles.value}>{formattedNumber}</div>
                {particles.map((p) => (
                  <div
                    key={p.id}
                    className={styles.particle}
                    style={{
                      left: `calc(50% + ${p.x}px)`,
                      top: `calc(50% + ${p.y}px)`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      "--dx": `${p.dx}px`,
                      "--dy": `${p.dy}px`,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`
                    } as React.CSSProperties}
                  />
                ))}
              </div>
              <div className={styles.label}>{currentSlideData.label}</div>
            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${displaySlide === i ? styles.activeDot : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
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
