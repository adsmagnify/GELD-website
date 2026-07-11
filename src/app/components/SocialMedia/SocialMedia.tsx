"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import styles from "./SocialMedia.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface SocialMediaPost {
  embedUrl: string;
  postUrl: string;
  title: string;
  comment: string;
  name: string;
  role: string;
  profileUrl: string;
  platform: "instagram" | "youtube" | "linkedin";
}

const getPlatformIcon = (platform: "instagram" | "youtube" | "linkedin") => {
  switch (platform) {
    case "instagram":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#FEFE7B" }}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#FEFE7B" }}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#FEFE7B" }}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
  }
};

interface SocialMediaProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
  isGoldenBg?: boolean;
}

const AUTOPLAY_MS = 6000;
const DRAG_THRESHOLD = 6;

const socialMediaPosts: SocialMediaPost[] = [
  {
    embedUrl: "/videos/instagram_reel.mp4",
    postUrl: "https://www.instagram.com/reel/DYXTlf5NkLJ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    title: "Instagram Reel",
    comment: "Insights into our execution model and digital wealth custody architecture.",
    name: "Official Instagram",
    role: "@geldwealth",
    profileUrl: "https://www.instagram.com/geldwealth/",
    platform: "instagram",
  },
  {
    embedUrl: "/videos/youtube_short.mp4",
    postUrl: "https://youtube.com/shorts/_7fooMC6aks?si=_XQsRYMbBA4_-FB2",
    title: "YouTube Short",
    comment: "Starting Stock Market Investing or Picking?",
    name: "Official YouTube",
    role: "@GeldWealthmanagement",
    profileUrl: "https://www.youtube.com/@GeldWealthmanagement",
    platform: "youtube",
  },
  {
    embedUrl: "/videos/linkedin_post.mp4",
    postUrl: "https://www.linkedin.com/posts/geldwealth_starting-stock-market-investing-or-picking-activity-7477590114441969665-O-MV?utm_source=li_share&utm_content=feedcontent&utm_medium=g_dt_web&utm_campaign=copy",
    title: "LinkedIn Post",
    comment: "Long-term investment strategies and picking the right multi-cap portfolios.",
    name: "Official LinkedIn",
    role: "GeldWealth",
    profileUrl: "https://in.linkedin.com/company/geldwealth",
    platform: "linkedin",
  }
];

export default function SocialMedia({
  ref,
  onScrollDown,
  isSubpage,
  isGoldenBg,
}: SocialMediaProps) {
  const n = socialMediaPosts.length;

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
    if (!isActive) {
      goTo(i);
    } else {
      window.open(socialMediaPosts[i].postUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      ref={activeRef as React.RefObject<HTMLElement>}
      className={`${styles.section} ${isGoldenBg ? styles.goldenBg : ""} ${isSubpage ? styles.subpage : ""} ${isVisible ? styles.revealed : ""}`}
    >
      <div className={styles.container}>
        <div className={styles.head}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>Social Media</span>
          </div>
          <h2 className={styles.title}>
            GELD on <span className={styles.goldText}>Social Media</span>
          </h2>
          <p className={styles.subheading}>
            Check out what we've been sharing and what the community is saying about GELD. Click the active card to view on social media.
          </p>
        </div>

        <div
          className={styles.stage}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="GELD social media posts"
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
            {socialMediaPosts.map((t, i) => {
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
                      <video
                        src={t.embedUrl}
                        className={styles.socialVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                      <div className={styles.videoOverlayHint}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.redirectIcon}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span className={styles.hintText}>View Post</span>
                      </div>
                      <div className={styles.iframeOverlay}></div>
                    </div>
                    <div className={styles.body}>
                      <span className={styles.quoteMark}>&ldquo;</span>
                      <p className={styles.quote}>{t.comment}</p>
                      <div className={styles.author}>
                        <h4 className={styles.name}>{t.name}</h4>
                        <div className={styles.platformBadge}>
                          {getPlatformIcon(t.platform)}
                          <a
                            href={t.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.profileLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t.role}
                          </a>
                        </div>
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
            aria-label="Previous social media post"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => go(1)}
            aria-label="Next social media post"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className={styles.dots} role="tablist" aria-label="Select social media post">
          {socialMediaPosts.map((_, i) => (
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
