"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./PmsCarousel.module.css";
import {
  PMS_DISCLAIMER,
  PMS_SCHEME_HIGHLIGHTS,
  type PmsSchemeHighlight,
} from "../../data/pmsData";

const SCROLL_SPEED = 0.7;
const RESUME_AFTER_MS = 10;

function SchemeCard({ scheme }: { scheme: PmsSchemeHighlight }) {
  return (
    <article className={styles.card}>
      <div className={styles.logoWrap}>
        <Image
          src={scheme.logo}
          alt={`${scheme.manager} logo`}
          width={220}
          height={56}
          className={styles.logo}
          style={{
            objectFit: scheme.logoFit ?? "contain",
            transform: scheme.logoScale ? `scale(${scheme.logoScale})` : undefined,
          }}
        />
      </div>
      <h5 className={styles.schemeName}>{scheme.name}</h5>
      <p className={styles.manager}>{scheme.manager}</p>
      <div className={styles.returns}>
        {scheme.sinceInception && (
          <div className={styles.returnRow}>
            <span className={styles.returnLabel}>Since inception</span>
            <span className={styles.returnVal}>{scheme.sinceInception}</span>
          </div>
        )}
        {scheme.threeYear && (
          <div className={styles.returnRow}>
            <span className={styles.returnLabel}>3Y</span>
            <span className={styles.returnVal}>{scheme.threeYear}</span>
          </div>
        )}
        {scheme.avgRollingThreeYear && (
          <div className={styles.returnRow}>
            <span className={styles.returnLabel}>Avg. rolling 3Y</span>
            <span className={styles.returnVal}>{scheme.avgRollingThreeYear}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default function PmsCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticUntilRef = useRef(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startScrollLeft: 0, pointerId: -1 });
  const [isPaused, setIsPaused] = useState(false);

  const loopItems = [...PMS_SCHEME_HIGHLIGHTS, ...PMS_SCHEME_HIGHLIGHTS];

  const scheduleResume = (delay = RESUME_AFTER_MS) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
      setIsPaused(false);
    }, delay);
  };

  const pause = () => {
    isPausedRef.current = true;
    setIsPaused(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const markProgrammaticScroll = () => {
      isProgrammaticScrollRef.current = true;
      programmaticUntilRef.current = performance.now() + 64;
    };

    const autoScroll = () => {
      if (!isPausedRef.current && !dragRef.current.active && viewport) {
        markProgrammaticScroll();
        viewport.scrollLeft += SCROLL_SPEED;

        const loopPoint = viewport.scrollWidth / 2;
        if (loopPoint > 0 && viewport.scrollLeft >= loopPoint - 1) {
          viewport.scrollLeft -= loopPoint;
        }
      }
      rafRef.current = requestAnimationFrame(autoScroll);
    };

    if (!prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(autoScroll);
    } else {
      isPausedRef.current = true;
      setIsPaused(true);
    }

    const onScroll = () => {
      if (
        isProgrammaticScrollRef.current ||
        performance.now() < programmaticUntilRef.current
      ) {
        isProgrammaticScrollRef.current = false;
        return;
      }
      pause();
      scheduleResume();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        pause();
        return;
      }

      dragRef.current = {
        active: true,
        startX: event.clientX,
        startScrollLeft: viewport.scrollLeft,
        pointerId: event.pointerId,
      };
      pause();
      viewport.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active || event.pointerId !== dragRef.current.pointerId) return;
      const delta = event.clientX - dragRef.current.startX;
      markProgrammaticScroll();
      viewport.scrollLeft = dragRef.current.startScrollLeft - delta;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragRef.current.active || event.pointerId !== dragRef.current.pointerId) return;
      dragRef.current.active = false;
      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      scheduleResume();
    };

    const onTouchEnd = () => scheduleResume();

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        pause();
        scheduleResume();
      }
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", onTouchEnd, { passive: true });
    viewport.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
      viewport.removeEventListener("wheel", onWheel);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Partner PMS Performance</span>
        <span className={styles.headerHint}>
          {isPaused ? "Browsing…" : "Auto-scrolling · swipe anytime"}
        </span>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        aria-roledescription="carousel"
        aria-label="Partner PMS performance carousel"
      >
        <div className={styles.track}>
          {loopItems.map((scheme, index) => (
            <SchemeCard key={`${scheme.name}-${index}`} scheme={scheme} />
          ))}
        </div>
      </div>

      <p className={styles.disclaimer}>{PMS_DISCLAIMER}</p>
    </div>
  );
}
