import { defineArrayMember, defineField, defineType } from "sanity";

export const blog = defineType({
  name: "blog",
  title: "Blogs",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),

    defineField({
      name: "tableOfContents",
      title: "Table of Contents",
      type: "table",
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "GELD Wealth Team",
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),

    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
    }),

    defineField({
      name: "readingTime",
      title: "Reading Time",
      type: "string",
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      description: "Shown at the end of the blog post",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          title: "FAQ",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
          },
        }),
      ],
    }),
  ],
});
