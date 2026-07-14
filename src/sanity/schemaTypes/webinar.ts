import { defineField, defineType } from "sanity";

export const webinar = defineType({
  name: "webinar",
  title: "Webinar",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Webinar",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      description: "Main webinar poster shown on the home page and webinar page.",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) =>
            rule.required().warning("Alt text is important for accessibility and SEO"),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "poster",
    },
    prepare({ media }) {
      return {
        title: "Webinar",
        subtitle: "Poster image",
        media,
      };
    },
  },
});
