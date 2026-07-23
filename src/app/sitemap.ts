import type { MetadataRoute } from "next";

import { SITE_URL } from "@/app/lib/site";

export const revalidate = 3600;

const staticRoutes: {
  path: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
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
  const lastModified = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries = await getBlogEntries(lastModified);

  return [...staticEntries, ...blogEntries];
}

async function getBlogEntries(
  fallbackDate: string
): Promise<MetadataRoute.Sitemap> {
  try {
    const { client } = await import("@/sanity/lib/client");
    const { BLOGS_QUERY } = await import("@/sanity/lib/queries");

    const blogs = await client.fetch<
      { slug?: { current?: string }; publishedAt?: string }[]
    >(BLOGS_QUERY, {}, { next: { revalidate: 3600 } });

    if (!Array.isArray(blogs)) return [];

    return blogs
      .filter((blog) => blog.slug?.current)
      .map((blog) => ({
        url: `${SITE_URL}/blog/${blog.slug!.current}`,
        lastModified: blog.publishedAt || fallbackDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}
