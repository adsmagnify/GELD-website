import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

  return {
    title: `${blog.title} | GELD Wealth`,
    description: blog.excerpt || "Research and insights from GELD Wealth.",
  };
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog: BlogPost | null = await client.fetch(BLOG_QUERY, { slug });

  if (!blog) return notFound();

  return (
    <div className={shellStyles.container}>
      <Background />
      <BlogPostView blog={blog} />
    </div>
  );
}
