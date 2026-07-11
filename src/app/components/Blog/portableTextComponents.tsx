import Image from "next/image";
import type { PortableTextComponents } from "next-sanity";

import { getBlogImageUrl } from "@/sanity/lib/blogImage";

import styles from "./BlogPost.module.css";

export function headingAnchorId(key: string): string;
export function headingAnchorId(key: string | undefined): string | undefined;
export function headingAnchorId(key?: string): string | undefined {
  return key ? `heading-${key}` : undefined;
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => (
      <h2 id={headingAnchorId(value._key)} className={styles.contentH1}>{children}</h2>
    ),
    h2: ({ children, value }) => (
      <h3 id={headingAnchorId(value._key)} className={styles.contentH2}>{children}</h3>
    ),
    h3: ({ children, value }) => (
      <h4 id={headingAnchorId(value._key)} className={styles.contentH3}>{children}</h4>
    ),
    h4: ({ children, value }) => (
      <h5 id={headingAnchorId(value._key)} className={styles.contentH4}>{children}</h5>
    ),
    normal: ({ children }) => <p className={styles.contentP}>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className={styles.contentBlockquote}>{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className={styles.contentList}>{children}</ul>
    ),
    number: ({ children }) => (
      <ol className={styles.contentOrderedList}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.contentListItem}>{children}</li>,
    number: ({ children }) => <li className={styles.contentListItem}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className={styles.contentStrong}>{children}</strong>,
    em: ({ children }) => <em className={styles.contentEm}>{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          className={styles.contentLink}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      const src = getBlogImageUrl(value, 960);
      const alt = typeof value.alt === "string" ? value.alt : "Blog illustration";

      return (
        <figure className={styles.contentFigure}>
          <Image
            src={src}
            alt={alt}
            width={960}
            height={540}
            className={styles.contentImage}
            sizes="(max-width: 768px) 100vw, 720px"
          />
          {value.caption ? (
            <figcaption className={styles.contentCaption}>{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};
