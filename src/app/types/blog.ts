import type { PortableTextBlock } from "next-sanity";

export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  content?: PortableTextBlock[];
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  author?: string;
  category?: string;
  readingTime?: string;
  publishedAt?: string;
};
