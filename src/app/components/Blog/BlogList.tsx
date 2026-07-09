import { client } from "@/sanity/lib/client";
import { BLOGS_QUERY } from "@/sanity/lib/queries";
import type { BlogPost } from "@/app/types/blog";

import BlogListClient from "./BlogListClient";

export const revalidate = 60;

export default async function BlogList() {
  const blogs: BlogPost[] = await client.fetch(
    BLOGS_QUERY,
    {},
    { next: { revalidate: 60 } }
  );

  return <BlogListClient blogs={blogs} />;
}
