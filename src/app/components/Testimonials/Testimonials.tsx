"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import styles from "./Testimonials.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface Testimonial {
  comment: string;
  name: string;
  role: string;
  image?: string;
}

interface TestimonialsProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
  isGoldenBg?: boolean;
}

const AUTOPLAY_MS = 6000;
const DRAG_THRESHOLD = 6;

const testimonials: Testimonial[] = [
  {
    comment: "Dezerv's transparency gave me the confidence I needed.",
    name: "Sudeep Goenka",
    role: "Director, Goldiee Group",
    image: "/client_sarah.jpg",
  },
  {
    comment: "Dezerv simply brought clarity to my investments.",
    name: "Pooja Jauhar",
    role: "Founder & CEO, The Glitch",
    image: "/client_elena.jpg",
  },
  {
    comment: "GELD's wealth custody models secure our corporate reserves.",
    name: "Michael Chang",
    role: "Partner, Apex Capital Partners",
    image: "/client_michael.jpg",
  },
];

export default function Testimonials({
  ref,
  onScrollDown,
  isSubpage,
  isGoldenBg,
}: TestimonialsProps) {
  const n = testimonials.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const dragState = useRef<{ startX: number | null; dragging: boolean }>({
    startX: null,
    dragging: false,
  });
  const draggedRef = useRef(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 }
    );
    const current = activeRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [activeRef]);

  const go = useCallback(
    (dir: number) => setActiveIndex((i) => (i + dir + n) % n),
    [n]
  );
  const goTo = useCallback(
    (i: number) => setActiveIndex(((i % n) + n) % n),
    [n]
  );

  useEffect(() => {
    if (!AUTOPLAY_MS) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || isMobile) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) go(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [go, isMobile]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = { startX: e.clientX, dragging: false };
    draggedRef.current = false;
    pausedRef.current = true;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const { startX, dragging } = dragState.current;
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) > DRAG_THRESHOLD) {
      dragState.current.dragging = true;
      draggedRef.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (dragState.current.dragging) setDragX(dx);
  };

  const endDrag = () => {
    if (dragState.current.dragging) {
      const threshold = 80;
      if (dragX > threshold) go(-1);
      else if (dragX < -threshold) go(1);
    }
    dragState.current = { startX: null, dragging: false };
    setDragX(0);
    pausedRef.current = false;
  };

  const wrappedOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    return offset;
  };

  const cardStyle = (offset: number): React.CSSProperties => {
    const abs = Math.abs(offset);
    const sign = Math.sign(offset);

    if (abs > 2) {
      return {
        transform: isMobile
          ? "translate(-50%, -50%) scale(0.92)"
          : "translate(-50%, -50%) translateX(0) translateZ(-900px) scale(0.5)",
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
      };
    }

    const peek = dragX * 0.04;
    const translateX = sign * (abs * 48) + peek;

    if (isMobile) {
      return {
        transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${1 - abs * 0.08})`,
        opacity: abs === 0 ? 1 : abs === 1 ? 0.45 : 0,
        zIndex: 10 - abs,
        pointerEvents: abs === 0 ? "auto" : "none",
      };
    }

    const translateZ = -abs * 240;
    const rotateY = -sign * Math.min(abs * 38, 46);
    const scale = 1 - abs * 0.14;
    const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : 0.22;

    return {
      transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 10 - abs,
      pointerEvents: "auto",
    };
  };

  const handleCardClick = (i: number, isActive: boolean) => {
    if (draggedRef.current) return;
    if (!isActive) goTo(i);
  };

  return (
    <section
      ref={activeRef as React.RefObject<HTMLElement>}
      className={`${styles.section} ${isGoldenBg ? styles.goldenBg : ""} ${isSubpage ? styles.subpage : ""} ${isVisible ? styles.revealed : ""}`}
    >
      <div className={styles.container}>
        <div className={styles.head}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>Testimonials</span>
          </div>
          <h2 className={styles.title}>
            What partners <span className={styles.goldText}>say</span>
          </h2>
          <p className={styles.subheading}>
            Read honest feedback and stories from our clients who transitioned to GELD.
          </p>
        </div>

        <div
          className={styles.stage}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onKeyDown={onKeyDown}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className={styles.deck}>
            {testimonials.map((t, i) => {
              const offset = wrappedOffset(i);
              const isActive = offset === 0;
              return (
                <article
                  key={i}
                  className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
                  style={cardStyle(offset)}
                  aria-hidden={!isActive}
                  onClick={() => handleCardClick(i, isActive)}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.media}>
                      {t.image ? (
                        <Image
                          src={t.image}
                          alt={t.name}
                          className={styles.mediaImg}
                          width={120}
                          height={120}
                          sizes="80px"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <span className={styles.monogram}>
                          {t.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div className={styles.body}>
                      <span className={styles.quoteMark}>&ldquo;</span>
                      <p className={styles.quote}>{t.comment}</p>
                      <div className={styles.author}>
                        <h4 className={styles.name}>{t.name}</h4>
                        <p className={styles.role}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => go(1)}
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className={styles.dots} role="tablist" aria-label="Select testimonial">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === activeIndex}
              role="tab"
            />
          ))}
        </div>
      </div>

      {onScrollDown && (
        <div className={`${styles.scrollWrapper} scrollWrapperCentered`}>
          <ScrollButton onClick={onScrollDown} />
        </div>
      )}
    </section>
  );
}
