import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";

import { getBlogImageUrl } from "@/sanity/lib/blogImage";
import type { BlogPost } from "@/app/types/blog";

import { portableTextComponents } from "./portableTextComponents";
import styles from "./BlogPost.module.css";

interface BlogPostViewProps {
  blog: BlogPost;
}

function formatDate(dateString?: string) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getAuthorInitials(author?: string) {
  if (!author) return "G";

  return author
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function BlogPostView({ blog }: BlogPostViewProps) {
  const featuredImageUrl = blog.featuredImage
    ? getBlogImageUrl(blog.featuredImage, 1200, 675)
    : null;

  return (
    <article className={styles.article}>
      <div className={styles.inner}>
        <Link href="/blog" className={styles.backLink}>
          <span className={styles.backArrow} aria-hidden="true">
            ←
          </span>
          Back to all articles
        </Link>

        <div className={styles.heroMeta}>
          {blog.category ? (
            <span className={styles.category}>{blog.category}</span>
          ) : null}
          {blog.publishedAt ? (
            <>
              {blog.category ? (
                <span className={styles.metaDot} aria-hidden="true">
                  ·
                </span>
              ) : null}
              <time className={styles.metaItem} dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
            </>
          ) : null}
          {blog.readingTime ? (
            <>
              <span className={styles.metaDot} aria-hidden="true">
                ·
              </span>
              <span className={styles.metaItem}>{blog.readingTime}</span>
            </>
          ) : null}
        </div>

        <h1 className={styles.title}>{blog.title}</h1>

        {blog.excerpt ? <p className={styles.excerpt}>{blog.excerpt}</p> : null}

        {featuredImageUrl ? (
          <div className={styles.featuredImageWrap}>
            <Image
              src={featuredImageUrl}
              alt={blog.featuredImage?.alt || blog.title}
              width={1200}
              height={675}
              className={styles.featuredImage}
              priority
              sizes="(max-width: 768px) 100vw, 760px"
            />
          </div>
        ) : null}

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.content}>
          {blog.content ? (
            <PortableText value={blog.content} components={portableTextComponents} />
          ) : null}
        </div>

        {blog.author ? (
          <footer className={styles.footer}>
            <div className={styles.author}>
              <div className={styles.authorAvatar} aria-hidden="true">
                {getAuthorInitials(blog.author)}
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorLabel}>Written by</span>
                <span className={styles.authorName}>{blog.author}</span>
              </div>
            </div>
          </footer>
        ) : null}
      </div>
    </article>
  );
}
