"use client";

import { useEffect, useRef, useState } from "react";

import type { BlogPost } from "@/app/types/blog";

import BlogCard from "./BlogCard";
import styles from "./BlogList.module.css";

interface BlogListClientProps {
  blogs: BlogPost[];
}

export default function BlogListClient({ blogs }: BlogListClientProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    const current = sectionRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.revealed : ""}`}
      aria-labelledby="blog-list-heading"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>Published Research</p>
        <h2 id="blog-list-heading" className={styles.title}>
          Latest Articles
        </h2>
        <p className={styles.subtitle}>
          Institutional-grade market insights, portfolio strategies, and wealth
          management perspectives from the GELD research desk.
        </p>
      </header>

      {blogs.length > 0 ? (
        <div className={styles.grid}>
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className={styles.cardReveal}
              style={{ transitionDelay: `${0.12 + index * 0.08}s` }}
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No articles yet</p>
          <p className={styles.emptyText}>
            New research and insights will appear here once published.
          </p>
        </div>
      )}
    </section>
  );
}
