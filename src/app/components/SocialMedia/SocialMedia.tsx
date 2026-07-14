"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  platform: "instagram" | "youtube" | "linkedin" | "google";
}

const getPlatformIcon = (platform: "instagram" | "youtube" | "linkedin" | "google") => {
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
    case "google":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#FEFE7B" }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
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
  },
  {
    embedUrl: "https://www.google.com/maps?q=Lodha%20Signet%2C%20A-618%2C%20Senapati%20Bapat%20Marg%2C%20next%20to%20Kamala%20Mills%2C%20Lower%20Parel%2C%20Mumbai%2C%20Maharashtra%20400013&z=16&output=embed",
    postUrl: "https://www.google.com/maps/place/Geld+Wealth/@19.0030951,72.8298069,17z/data=!4m15!1m8!3m7!1s0x3be7cf5e083751ff:0x534fde02a1584363!2sGeld+Wealth!8m2!3d19.0030951!4d72.8298069!10e1!16s%2Fg%2F11nk84f_7t!3m5!1s0x3be7cf5e083751ff:0x534fde02a1584363!8m2!3d19.0030951!4d72.8298069!16s%2Fg%2F11nk84f_7t?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D",
    title: "Google Map Location",
    comment: "My portfolio doubled in 2 years! GELD has been a game-changer for my financial goals. Their suggested mix of equity and debt consistently outperformed benchmarks.",
    name: "Geld Wealth",
    role: "4.8 ★★★★★ (11 Google reviews) • Financial consultant in Mumbai",
    profileUrl: "https://www.google.com/maps/place/Geld+Wealth/@19.0030951,72.8298069,17z/data=!4m15!1m8!3m7!1s0x3be7cf5e083751ff:0x534fde02a1584363!2sGeld+Wealth!8m2!3d19.0030951!4d72.8298069!10e1!16s%2Fg%2F11nk84f_7t!3m5!1s0x3be7cf5e083751ff:0x534fde02a1584363!8m2!3d19.0030951!4d72.8298069!16s%2Fg%2F11nk84f_7t?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D",
    platform: "google",
  }
];

interface GoogleReviewItem {
  authorName: string;
  avatarText: string;
  avatarBg: string;
  timeAgo: string;
  ratingStars: number;
  text: string;
}

const googleReviewsData: GoogleReviewItem[] = [
  {
    authorName: "Surya Thevar",
    avatarText: "S",
    avatarBg: "#3700b3",
    timeAgo: "3 days ago",
    ratingStars: 5,
    text: "Good service and supportive team.\nAs and when I had questions, they responded and helped me understand the process and everything about my investment decision in detail. 🙌🏼"
  },
  {
    authorName: "Johnkrus",
    avatarText: "J",
    avatarBg: "#03a9f4",
    timeAgo: "3 days ago",
    ratingStars: 4,
    text: "I contacted Geld Wealth to learn more about mutual funds and other investment options. The discussion was clear and informative."
  },
  {
    authorName: "Ashak Abinu",
    avatarText: "A",
    avatarBg: "#e91e63",
    timeAgo: "3 days ago",
    ratingStars: 4,
    text: "I spoke with the Geld Wealth team regarding investments. They explained things in a simple way and helped me understand the available options. My experience was good and the team was supportive whenever I had questions."
  },
  {
    authorName: "Gowardhan Bhuyarkar",
    avatarText: "G",
    avatarBg: "#4caf50",
    timeAgo: "3 weeks ago",
    ratingStars: 5,
    text: "Excellent advisor. Very knowledgeable team. They are very helpful to the clients and explains every thing in details and clear. Good 👍🏻"
  },
  {
    authorName: "Himanshu Tidke",
    avatarText: "H",
    avatarBg: "#ff5722",
    timeAgo: "3 weeks ago",
    ratingStars: 5,
    text: "Good and helpful people... Helped me understand all my financial decisions properly..."
  },
  {
    authorName: "Purvang Kamdar",
    avatarText: "P",
    avatarBg: "#009688",
    timeAgo: "3 weeks ago",
    ratingStars: 5,
    text: "Knowledgeable team and transparent approach. Highly recommended for financial planning."
  },
  {
    authorName: "Nidhi Agarwal",
    avatarText: "N",
    avatarBg: "#9c27b0",
    timeAgo: "a month ago",
    ratingStars: 5,
    text: "Excellent financial advisor—Vikram Jana one them advisor explains investments clearly and genuinely cares about his clients' financial growth"
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
  const prevActiveIndex = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [googleReviewActiveIndex, setGoogleReviewActiveIndex] = useState(0);

  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const dragState = useRef<{ startX: number | null; dragging: boolean }>({
    startX: null,
    dragging: false,
  });
  const draggedRef = useRef(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGoogleReviewActiveIndex((prev) => (prev + 1) % googleReviewsData.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    prevActiveIndex.current = activeIndex;
  }, [activeIndex]);

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
    (dir: number) => setActiveIndex((prev) => prev + dir),
    []
  );

  const goTo = useCallback(
    (targetIndex: number) => {
      setActiveIndex((current) => {
        const currentMod = ((current % n) + n) % n;
        let diff = (targetIndex - currentMod) % n;
        if (diff > n / 2) diff -= n;
        if (diff < -n / 2) diff += n;
        return current + diff;
      });
    },
    [n]
  );

  useEffect(() => {
    if (!AUTOPLAY_MS) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) go(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [go]);

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

  const cardStyle = (cardIndex: number): React.CSSProperties => {
    // 90deg offsets for 4 items in a circle
    const theta_rad = ((cardIndex - activeIndex) * 90 * Math.PI) / 180;

    const currentMod = ((activeIndex % n) + n) % n;
    let diff = (cardIndex - currentMod) % n;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    const absDiff = Math.abs(diff);

    let zIndex = 5;
    const activeMod = ((activeIndex % n) + n) % n;
    const prevMod = ((prevActiveIndex.current % n) + n) % n;
    if (cardIndex === activeMod) {
      zIndex = 10;
    } else if (cardIndex === prevMod) {
      zIndex = 9;
    }

    const clientMobile = mounted ? isMobile : false;

    if (clientMobile) {
      // Mobile Flat Coverflow
      const translateX = parseFloat((Math.sin(theta_rad) * 48).toFixed(2));
      const scale = parseFloat((1 - (1 - Math.cos(theta_rad)) * 0.08).toFixed(2));
      const opacity = parseFloat((1 - (1 - Math.cos(theta_rad)) * 0.55).toFixed(2));

      return {
        transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
        opacity,
        zIndex,
        pointerEvents: absDiff === 0 ? "auto" : "none",
      };
    }

    // Desktop 3D Coverflow
    const peek = dragX * 0.04;
    const translateX = parseFloat((Math.sin(theta_rad) * 48).toFixed(2)) + peek;
    const translateZ = parseFloat(((Math.cos(theta_rad) - 1) * 240).toFixed(2));
    const rotateY = parseFloat((-Math.sin(theta_rad) * 38).toFixed(2));
    const scale = parseFloat((1 - (1 - Math.cos(theta_rad)) * 0.14).toFixed(2));
    const opacity = parseFloat((1 - (1 - Math.cos(theta_rad)) * 0.42).toFixed(2));

    return {
      transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: absDiff === 0 ? "auto" : "none",
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

  const activeModIndex = ((activeIndex % n) + n) % n;

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
              const isActive = i === activeModIndex;
              return (
                <article
                  key={i}
                  className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
                  style={cardStyle(i)}
                  aria-hidden={!isActive}
                  onClick={() => handleCardClick(i, isActive)}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.media}>
                      {t.platform === "google" ? (
                        <iframe
                          title="Geld Wealth Google Maps Office Location"
                          src={t.embedUrl}
                          className={styles.socialImage}
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      ) : (
                        <video
                          src={isVisible ? t.embedUrl : undefined}
                          preload="none"
                          className={styles.socialVideo}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      )}
                      <div className={styles.videoOverlayHint}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.redirectIcon}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span className={styles.hintText}>{t.platform === "google" ? "View Map" : "View Post"}</span>
                      </div>
                      <div className={styles.iframeOverlay}></div>
                    </div>
                    <div className={styles.body}>
                      {t.platform === "google" ? (
                        <div className={styles.googleCardDetails}>
                          <div className={styles.googleCardHeader}>
                            <h4 className={styles.googleCardTitle}>{t.name}</h4>
                            <div className={styles.googleCardRatingRow}>
                              <span className={styles.ratingNum}>4.8</span>
                              <div className={styles.stars}>
                                {"★★★★★".split("").map((star, idx) => (
                                  <span key={idx} className={styles.star}>★</span>
                                ))}
                              </div>
                              <span className={styles.reviewsCount}>11 reviews</span>
                            </div>
                            <p className={styles.googleCardCategory}>Financial consultant in Mumbai, Maharashtra</p>
                          </div>

                          <div className={styles.animatedReviewContainer}>
                            {(() => {
                              const item = googleReviewsData[googleReviewActiveIndex];
                              if (!item) return null;
                              return (
                                <div
                                  key={googleReviewActiveIndex}
                                  className={styles.animatedReviewItem}
                                >
                                  <div className={styles.cardReviewUserRow}>
                                    <div className={styles.cardReviewAvatar} style={{ backgroundColor: item.avatarBg }}>
                                      {item.avatarText}
                                    </div>
                                    <div className={styles.cardReviewUserInfo}>
                                      <h5 className={styles.cardReviewerName}>{item.authorName}</h5>
                                      <div className={styles.cardReviewStarsRow}>
                                        <div className={styles.cardReviewStars}>
                                          {Array.from({ length: item.ratingStars }).map((_, i) => (
                                            <span key={i}>★</span>
                                          ))}
                                        </div>
                                        <span className={styles.cardReviewTime}>{item.timeAgo}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className={styles.cardReviewText}>{item.text}</p>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
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
              className={`${styles.dot} ${i === activeModIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === activeModIndex}
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
