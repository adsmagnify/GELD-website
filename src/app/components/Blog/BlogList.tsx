import { client } from "@/sanity/lib/client";
import { BLOGS_QUERY } from "@/sanity/lib/queries";
import type { BlogPost } from "@/app/types/blog";

import BlogListClient from "./BlogListClient";

export default async function BlogList() {
  const blogs: BlogPost[] = await client.fetch(BLOGS_QUERY);

  return <BlogListClient blogs={blogs} />;
}
