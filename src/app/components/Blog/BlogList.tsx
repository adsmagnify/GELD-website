import { client } from "@/sanity/lib/client";
import { BLOGS_QUERY } from "@/sanity/lib/queries";
import type { BlogPost } from "@/app/types/blog";

import BlogCard from "./BlogCard";
import styles from "./BlogList.module.css";

export default async function BlogList() {
  const blogs: BlogPost[] = await client.fetch(BLOGS_QUERY);

  return (
    <section className={styles.section} aria-labelledby="blog-list-heading">
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
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
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
