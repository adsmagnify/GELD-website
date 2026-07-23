import type { MetadataRoute } from "next";

import type { BlogPost } from "@/app/types/blog";
import { SITE_URL } from "@/app/lib/site";
import { client } from "@/sanity/lib/client";
import { BLOGS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 3600;

const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  { path: "/products/pms", changeFrequency: "weekly", priority: 0.85 },
  { path: "/products/aif", changeFrequency: "weekly", priority: 0.85 },
  {
    path: "/products/mutual-funds",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    path: "/products/mini-stock-portfolio",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  { path: "/performance", changeFrequency: "weekly", priority: 0.8 },
  { path: "/fund-managers", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/docs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/webinar", changeFrequency: "weekly", priority: 0.7 },
  { path: "/socialmedia", changeFrequency: "weekly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const blogs: BlogPost[] = await client.fetch(
      BLOGS_QUERY,
      {},
      { next: { revalidate: 3600 } }
    );

    blogEntries = blogs
      .filter((blog) => blog.slug?.current)
      .map((blog) => ({
        url: `${SITE_URL}/blog/${blog.slug.current}`,
        lastModified: blog.publishedAt
          ? new Date(blog.publishedAt)
          : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // Sitemap should still build if Sanity is temporarily unavailable.
  }

  return [...staticEntries, ...blogEntries];
}
