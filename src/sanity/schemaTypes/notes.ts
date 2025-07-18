import { defineField, defineType } from "sanity";

export const notes = defineType({
    name: "notes",
    title: "notes",
    type: "document",
    fields: [
        defineField({
            name: "title",
            type: "string",
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: {
                source: "title",
            },
        }),
        defineField({
            name: "author",
            type: "reference",
            to: { type: "author" },
        }),
        defineField({
            name: "views",
            type: "number",
        }),
        defineField({
            name: "description",
            type: "text",
        }),
        defineField({
            name: "category",
            type: "string",
            validation: (Rule) =>
                Rule.min(1).max(20).required().error("Please enter a category"),
        }),
        defineField({
            name: "image",
            type: "url",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "file",
            title: "Upload File",
            type: "file",
            options: {
                accept: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].join(", "),
            },
            validation: (Rule) => Rule.required().error("Please upload a file"),


        }),

    ],
});