"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Stats.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";
import Background from "../Background/Background";

interface StatsProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isGoldenBg?: boolean;
}

const slides = [
  { value: 39, decimals: 0, prefix: "", suffix: " Years", label: "Combined market experience leading our advisory" },
  { value: 2500, decimals: 0, prefix: "", suffix: "+", label: "Investors guided across India" },
  { value: 100, decimals: 0, prefix: "", suffix: "%", label: "Regulator compliant" }
];

const ARC_CX = 500;
const ARC_CY = 380;
const ARC_RX = 410;
const ARC_RY = 370;
const SEGMENT_GAP = 0.07;

function getArcPoint(angle: number) {
  return {
    x: ARC_CX + ARC_RX * Math.cos(angle),
    y: ARC_CY - ARC_RY * Math.sin(angle),
  };
}

function getArcSegmentPath(startAngle: number, endAngle: number) {
  const start = getArcPoint(startAngle);
  const end = getArcPoint(endAngle);
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${ARC_RX} ${ARC_RY} 0 0 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}

const ARCH_BOUNDARIES = [Math.PI, (2 * Math.PI) / 3, Math.PI / 3, 0];

const SEGMENT_RANGES: [number, number][] = [
  [ARCH_BOUNDARIES[0] + SEGMENT_GAP, ARCH_BOUNDARIES[1] - SEGMENT_GAP],
  [ARCH_BOUNDARIES[1] + SEGMENT_GAP, ARCH_BOUNDARIES[2] - SEGMENT_GAP],
  [ARCH_BOUNDARIES[2] + SEGMENT_GAP, ARCH_BOUNDARIES[3] - SEGMENT_GAP],
];

const SEGMENT_CENTERS = SEGMENT_RANGES.map(([start, end]) => (start + end) / 2);
const SEGMENT_HALF_WIDTH = (SEGMENT_RANGES[0][1] - SEGMENT_RANGES[0][0]) / 2;

const ARCH_SEGMENT_PATHS = SEGMENT_RANGES.map(([start, end]) =>
  getArcSegmentPath(start, end)
);

function getHighlightPath(center: number) {
  return getArcSegmentPath(center - SEGMENT_HALF_WIDTH, center + SEGMENT_HALF_WIDTH);
}

const HIGHLIGHT_SLIDE_MS = 550;
const SLIDE_EXIT_MS = 180;

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

export default function Stats({ ref, onScrollDown, isGoldenBg }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [displaySlide, setDisplaySlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [highlightCenter, setHighlightCenter] = useState(SEGMENT_CENTERS[0]);
  const highlightCenterRef = useRef(SEGMENT_CENTERS[0]);
  const highlightAnimRef = useRef<number | null>(null);

  useEffect(() => {
    const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
    const thresholdVal = isMobileDevice ? 0.85 : 0.15;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: thresholdVal }
    );
    const current = activeRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [activeRef]);

  useEffect(() => {
    const targetCenter = SEGMENT_CENTERS[currentSlide];
    const fromCenter = highlightCenterRef.current;
    const startTime = performance.now();

    if (highlightAnimRef.current !== null) {
      cancelAnimationFrame(highlightAnimRef.current);
    }

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / HIGHLIGHT_SLIDE_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextCenter = fromCenter + (targetCenter - fromCenter) * eased;

      highlightCenterRef.current = nextCenter;
      setHighlightCenter(nextCenter);

      if (progress < 1) {
        highlightAnimRef.current = requestAnimationFrame(tick);
      } else {
        highlightCenterRef.current = targetCenter;
        setHighlightCenter(targetCenter);
        highlightAnimRef.current = null;
      }
    };

    highlightAnimRef.current = requestAnimationFrame(tick);

    return () => {
      if (highlightAnimRef.current !== null) {
        cancelAnimationFrame(highlightAnimRef.current);
      }
    };
  }, [currentSlide]);

  useEffect(() => {
    if (!isVisible) return;
    const slide = slides[displaySlide];
    const duration = 800;
    const startTime = performance.now();
    const startVal = 0;
    const endVal = slide.value;

    let frameId: number;

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

  useEffect(() => {
    if (!isVisible) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile || reducedMotion) {
      setParticles([]);
      return;
    }

    const count = 24;
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
      const distance = 30 + Math.random() * 50;
      return {
        id: i,
        x: (Math.random() - 0.5) * 240,
        y: (Math.random() - 0.5) * 40,
        dx: Math.sin(angle) * distance,
        dy: -50 - Math.random() * 50,
        size: 1.0 + Math.random() * 1.5,
        delay: -Math.random() * 6,
        duration: 4.5 + Math.random() * 2.5
      };
    });
    setParticles(newParticles);
  }, [isVisible]);

  const triggerTransition = useCallback((targetIndex: number) => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplaySlide(targetIndex);
      setIsTransitioning(false);
    }, SLIDE_EXIT_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const nextIdx = (currentSlide + 1) % slides.length;
      setCurrentSlide(nextIdx);
      triggerTransition(nextIdx);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, triggerTransition, isVisible]);

  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);
  const boundaryScrollCount = useRef(0);
  const SCROLL_COOLDOWN_MS = 1200;
  const WHEEL_THRESHOLD = 50;
  const TOUCH_THRESHOLD = 70;

  useEffect(() => {
    boundaryScrollCount.current = 0;
  }, [currentSlide, isVisible]);

  const handleScrollButtonClick = () => {
    boundaryScrollCount.current = 0;
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      triggerTransition(nextSlide);
    } else {
      if (onScrollDown) onScrollDown();
    }
  };

  useEffect(() => {
    const sectionElement = activeRef.current;
    if (!sectionElement || !isVisible) return;

    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();

      if (now - lastScrollTime.current < SCROLL_COOLDOWN_MS) {
        if (
          (e.deltaY > 0 && (currentSlide < slides.length - 1 || boundaryScrollCount.current < 1)) ||
          (e.deltaY < 0 && (currentSlide > 0 || boundaryScrollCount.current < 1))
        ) {
          e.preventDefault();
        }
        return;
      }

      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) {
        if (
          (e.deltaY > 0 && (currentSlide < slides.length - 1 || boundaryScrollCount.current < 1)) ||
          (e.deltaY < 0 && (currentSlide > 0 || boundaryScrollCount.current < 1))
        ) {
          e.preventDefault();
        }
        return;
      }

      if (e.deltaY > 0) {
        // Scroll Down
        if (currentSlide < slides.length - 1) {
          e.preventDefault();
          const nextSlide = currentSlide + 1;
          setCurrentSlide(nextSlide);
          triggerTransition(nextSlide);
          lastScrollTime.current = now;
        } else {
          if (boundaryScrollCount.current < 1) {
            e.preventDefault();
            boundaryScrollCount.current += 1;
            lastScrollTime.current = now;
          }
        }
      } else if (e.deltaY < 0) {
        // Scroll Up
        if (currentSlide > 0) {
          e.preventDefault();
          const prevSlide = currentSlide - 1;
          setCurrentSlide(prevSlide);
          triggerTransition(prevSlide);
          lastScrollTime.current = now;
        } else {
          if (boundaryScrollCount.current < 1) {
            e.preventDefault();
            boundaryScrollCount.current += 1;
            lastScrollTime.current = now;
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const now = performance.now();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) {
        if (
          (deltaY > 0 && (currentSlide < slides.length - 1 || boundaryScrollCount.current < 1)) ||
          (deltaY < 0 && (currentSlide > 0 || boundaryScrollCount.current < 1))
        ) {
          e.preventDefault();
        }
        return;
      }

      if (now - lastScrollTime.current < SCROLL_COOLDOWN_MS) {
        if (
          (deltaY > 0 && (currentSlide < slides.length - 1 || boundaryScrollCount.current < 1)) ||
          (deltaY < 0 && (currentSlide > 0 || boundaryScrollCount.current < 1))
        ) {
          e.preventDefault();
        }
        return;
      }

      if (deltaY > 0) {
        // Scroll Down
        if (currentSlide < slides.length - 1) {
          e.preventDefault();
          const nextSlide = currentSlide + 1;
          setCurrentSlide(nextSlide);
          triggerTransition(nextSlide);
          lastScrollTime.current = now;
          touchStartY.current = touchY;
        } else {
          if (boundaryScrollCount.current < 1) {
            e.preventDefault();
            boundaryScrollCount.current += 1;
            lastScrollTime.current = now;
            touchStartY.current = touchY;
          }
        }
      } else if (deltaY < 0) {
        // Scroll Up
        if (currentSlide > 0) {
          e.preventDefault();
          const prevSlide = currentSlide - 1;
          setCurrentSlide(prevSlide);
          triggerTransition(prevSlide);
          lastScrollTime.current = now;
          touchStartY.current = touchY;
        } else {
          if (boundaryScrollCount.current < 1) {
            e.preventDefault();
            boundaryScrollCount.current += 1;
            lastScrollTime.current = now;
            touchStartY.current = touchY;
          }
        }
      }
    };

    sectionElement.addEventListener("wheel", handleWheel, { passive: false });
    sectionElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    sectionElement.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      sectionElement.removeEventListener("wheel", handleWheel);
      sectionElement.removeEventListener("touchstart", handleTouchStart);
      sectionElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [currentSlide, isVisible, triggerTransition]);

  const handleSegmentClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setCurrentSlide(index);
    triggerTransition(index);
    boundaryScrollCount.current = 0;
  };

  const currentSlideData = slides[displaySlide];
  const formattedNumber = `${currentSlideData.prefix}${animatedValue.toFixed(currentSlideData.decimals)}${currentSlideData.suffix}`;

  return (
    <section ref={activeRef as any} className={`${styles.section} ${isGoldenBg ? styles.goldenBg : ""}`}>
      {!isGoldenBg && <Background />}
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        <div className={styles.statsStage}>
          <div className={styles.pillHeader}>
            <div className={styles.pill}>THE NUMBERS SPEAK</div>
            <div className={styles.dashedLine}></div>
          </div>

          <div className={styles.archWrapper}>
            <svg
              className={styles.archSvg}
              viewBox="0 0 1000 400"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              aria-label="Stat navigation"
            >
              <defs>
                <linearGradient id="archSegmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FEFE7B" />
                  <stop offset="100%" stopColor="#CE953A" />
                </linearGradient>
              </defs>

              {ARCH_SEGMENT_PATHS.map((d, i) => (
                <g
                  key={i}
                  className={styles.archSegmentGroup}
                  onClick={() => handleSegmentClick(i)}
                  aria-label={`Show stat ${i + 1}`}
                >
                  <path d={d} className={styles.archSegmentHit} />
                  <path d={d} className={styles.archSegment} />
                </g>
              ))}

              <path
                d={getHighlightPath(highlightCenter)}
                className={styles.archHighlight}
                pointerEvents="none"
              />
            </svg>

            <div className={styles.contentViewport}>
              <div
                key={displaySlide}
                className={`${styles.slideContent} ${isTransitioning ? styles.exiting : styles.entering}`}
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
        </div>
      </div>

      {onScrollDown && (
        <div className={`${styles.scrollWrapper} scrollWrapperCentered`}>
          <ScrollButton onClick={handleScrollButtonClick} darkText={isGoldenBg} />
        </div>
      )}
    </section>
  );
}
