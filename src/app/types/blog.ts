import type { PortableTextBlock } from "next-sanity";

export type BlogFaq = {
  _key: string;
  question: string;
  answer: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  content?: PortableTextBlock[];
  tableOfContents?: {
    rows: {
      cells: string[];
    }[];
  };
  faqs?: BlogFaq[];
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  author?: string;
  category?: string;
  readingTime?: string;
  publishedAt?: string;
};
