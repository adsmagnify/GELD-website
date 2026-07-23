export const BLOGS_QUERY = `
*[_type == "blog"] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  featuredImage{
    asset->,
    alt
  },
  author,
  category,
  readingTime,
  publishedAt
}
`;

export const BLOG_QUERY = `
*[_type=="blog" && slug.current==$slug][0]{
  _id,
  title,
  tableOfContents,
  slug,
  excerpt,
  content,
  faqs[]{
    _key,
    question,
    answer
  },
  featuredImage{
    asset->{
      url
    },
    alt
  },
  author,
  category,
  readingTime,
  publishedAt
}
`;

export const WEBINAR_QUERY = `
*[_id == "webinar"][0]{
  poster{
    asset->,
    alt,
    hotspot,
    crop
  }
}
`;