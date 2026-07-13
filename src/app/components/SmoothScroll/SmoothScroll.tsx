"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScroll() {
  const pathname = usePathname();
  const isScrolling = useRef(false);
  const activeIndex = useRef(0);
  const rafId = useRef<number | null>(null);

  const sections = ["hero", "about", "products", "stats", "webinar", "socialmedia", "contact", "footer"];

  // Custom animation function for homepage snapping
  const snapScrollTo = (container: HTMLElement, target: number, duration: number) => {
    const start = container.scrollTop;
    const change = target - start;
    let startTime: number | null = null;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);

      // Cubic ease-in-out curve
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      container.scrollTop = start + change * ease;

      if (progress < duration) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        container.scrollTop = target;
        isScrolling.current = false;
        rafId.current = null;
      }
    };

    rafId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Only run on the homepage
    if (pathname !== "/") {
      return;
    }

    // Disable smooth scroll on mobile devices (width <= 768px)
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      return;
    }

    const container = document.querySelector(".page-scroll-container") as HTMLElement;
    if (!container) return;

    // Cleanup any running animation frame
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    isScrolling.current = false;

    const WHEEL_THRESHOLD = 50;

    // Wheel event listener for programmatic snap scroll
    const handleWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return;

      // Lock scroll inputs completely during active scroll transitions
      if (isScrolling.current) {
        e.preventDefault();
        return;
      }

      // Ignore small scroll deltas (e.g. minor trackpad/finger touches)
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) {
        return;
      }

      e.preventDefault();

      // Dynamically calculate the active section based on current scrollTop.
      // This is 100% immune to mount race conditions, dynamic imports, or resizing.
      let currentIdx = 0;
      let minDiff = Infinity;

      for (let i = 0; i < sections.length; i++) {
        let offset = 0;
        if (sections[i] === "footer") {
          offset = container.scrollHeight - container.clientHeight;
        } else {
          const el = document.getElementById(sections[i]);
          if (el) offset = el.offsetTop;
        }

        const diff = Math.abs(container.scrollTop - offset);
        if (diff < minDiff) {
          minDiff = diff;
          currentIdx = i;
        }
      }

      activeIndex.current = currentIdx;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = activeIndex.current + direction;

      if (nextIndex >= 0 && nextIndex < sections.length) {
        isScrolling.current = true;
        activeIndex.current = nextIndex;

        let targetOffset = 0;
        if (sections[nextIndex] === "footer") {
          targetOffset = container.scrollHeight - container.clientHeight;
        } else {
          const targetElement = document.getElementById(sections[nextIndex]);
          if (targetElement) {
            targetOffset = targetElement.offsetTop;
          } else {
            isScrolling.current = false;
            return;
          }
        }

        // 1400ms duration for a beautifully smooth, premium, "little slow" snap
        snapScrollTo(container, targetOffset, 1400);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    // Expose the custom scroll function to global window
    (window as any).__customScrollTo = (targetId: string) => {
      let index = sections.indexOf(targetId);
      let targetOffset = 0;

      if (targetId === "footer" && index !== -1) {
        targetOffset = container.scrollHeight - container.clientHeight;
      } else {
        const targetElement = document.getElementById(targetId);
        if (targetElement && index !== -1) {
          targetOffset = targetElement.offsetTop;
        } else {
          return;
        }
      }

      isScrolling.current = true;
      activeIndex.current = index;
      snapScrollTo(container, targetOffset, 1400);
    };

    return () => {
      container.removeEventListener("wheel", handleWheel);
      delete (window as any).__customScrollTo;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [pathname]);

  return null;
}
