import Link from "next/link";
import { PortableText } from "next-sanity";

import type { BlogPost } from "@/app/types/blog";

import { headingAnchorId, portableTextComponents } from "./portableTextComponents";
import TocAnchorLink from "./TocAnchorLink";
import styles from "./BlogPost.module.css";

interface BlogPostViewProps {
  blog: BlogPost;
}

/**
 * The CMS table-of-contents is free-typed text with no explicit link to a
 * heading, and its wording rarely matches the heading text verbatim. So we
 * match positionally instead: the table's rows list the article's main "h2"
 * sections in order, so we zip them against the trailing N "h2" blocks in
 * the content (trailing, because posts often open with unlisted intro
 * headings before the numbered sections start). If the content doesn't have
 * at least as many h2 headings as TOC rows, we skip linking entirely rather
 * than risk pointing at the wrong section.
 */
function getTocHeadingIds(content: BlogPost["content"], rowCount: number): (string | null)[] {
  if (!content || rowCount === 0) return [];

  const h2Keys = content
    .filter((block): block is typeof block & { style: string; _key: string } =>
      block._type === "block" && (block as { style?: string }).style === "h2"
    )
    .map((block) => block._key);

  if (h2Keys.length < rowCount) return new Array(rowCount).fill(null);

  return h2Keys.slice(h2Keys.length - rowCount);
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
  const tocRows = blog.tableOfContents?.rows ?? [];
  const tocDataRows = tocRows.length > 1 ? tocRows.slice(1) : tocRows;
  const tocHeadingIds = getTocHeadingIds(blog.content, tocDataRows.length);

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

        {tocRows.length > 0 ? (
          <nav className={styles.tableOfContents} aria-label="Table of contents">
            <h2 className={styles.tocTitle}>Table of Content</h2>

            <div className={styles.tocCard}>
              <table className={styles.tocTable}>
                {tocRows.length > 1 ? (
                  <thead>
                    <tr>
                      {tocRows[0].cells.map((cell, cellIndex) => (
                        <th key={cellIndex} scope="col" className={styles.tocHeadCell}>
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {tocDataRows.map((row, index) => {
                    const headingId = tocHeadingIds[index];
                    const lastCellIndex = row.cells.length - 1;

                    return (
                      <tr key={index}>
                        {row.cells.map((cell, cellIndex) => (
                          <td key={cellIndex} className={styles.tocCell}>
                            {headingId && cellIndex === lastCellIndex ? (
                              <TocAnchorLink targetId={headingAnchorId(headingId)} className={styles.tocLink}>
                                {cell}
                              </TocAnchorLink>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </nav>
        ) : null}

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.content}>
          {blog.content ? (
            <PortableText value={blog.content} components={portableTextComponents} />
          ) : null}
        </div>

        {blog.faqs && blog.faqs.length > 0 ? (
          <section className={styles.faqs} aria-label="Frequently asked questions">
            <h2 className={styles.faqsTitle}>FAQs</h2>
            <div className={styles.faqList}>
              {blog.faqs.map((faq) => (
                <details key={faq._key} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{faq.question}</summary>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

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
