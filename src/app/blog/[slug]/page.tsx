import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Background from "@/app/components/Background/Background";
import BlogPostView from "@/app/components/Blog/BlogPost";
import shellStyles from "@/app/shared/subpageShell.module.css";
import { client } from "@/sanity/lib/client";
import { BLOG_QUERY } from "@/sanity/lib/queries";
import type { BlogPost } from "@/app/types/blog";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog: BlogPost | null = await client.fetch(BLOG_QUERY, { slug });

  if (!blog) {
    return { title: "Article not found | GELD Wealth" };
  }

  const description =
    blog.excerpt || "Research and insights from GELD Wealth.";
  const imageUrl = blog.featuredImage?.asset?.url;

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: blog.title,
      description,
      url: `/blog/${slug}`,
      publishedTime: blog.publishedAt,
      images: imageUrl ? [{ url: imageUrl, alt: blog.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog: BlogPost | null = await client.fetch(BLOG_QUERY, { slug });

  if (!blog) redirect("/blog");

  return (
    <div className={shellStyles.container}>
      <Background />
      <BlogPostView blog={blog} />
    </div>
  );
}
