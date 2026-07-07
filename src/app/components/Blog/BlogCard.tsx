import Image from "next/image";
import Link from "next/link";

import { getBlogImageUrl } from "@/sanity/lib/blogImage";
import type { BlogPost } from "@/app/types/blog";

import styles from "./BlogCard.module.css";

interface BlogCardProps {
  blog: BlogPost;
}

function formatDate(dateString?: string) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogCard({ blog }: BlogCardProps) {
  const imageUrl = blog.featuredImage
    ? getBlogImageUrl(blog.featuredImage, 640, 360)
    : null;

  return (
    <article className={styles.card}>
      <Link href={`/blog/${blog.slug.current}`} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog.featuredImage?.alt || blog.title}
              width={640}
              height={360}
              className={styles.image}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true">
              <svg
                className={styles.placeholderIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16M14 14l1-1a2 2 0 012.8 0L20 15M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.metaRow}>
            {blog.category ? (
              <span className={styles.category}>{blog.category}</span>
            ) : (
              <span />
            )}
            {blog.readingTime ? (
              <span className={styles.readingTime}>{blog.readingTime}</span>
            ) : null}
          </div>

          <h2 className={styles.title}>{blog.title}</h2>

          {blog.excerpt ? <p className={styles.excerpt}>{blog.excerpt}</p> : null}

          <div className={styles.footer}>
            {blog.publishedAt ? (
              <time className={styles.date} dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
            ) : (
              <span />
            )}
            <span className={styles.readMore}>
              Read Article
              <span className={styles.readMoreArrow} aria-hidden="true">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
