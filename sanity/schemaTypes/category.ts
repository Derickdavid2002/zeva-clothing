export default {
  name: "category", title: "Shop Category", type: "document",
  fields: [
    { name: "title", title: "Category Name", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule: any) => Rule.required() },
    { name: "description", title: "Description", type: "text", rows: 2 },
    { name: "image", title: "Category Image", type: "image", options: { hotspot: true } },
    { name: "order", title: "Display Order", type: "number", initialValue: 0 },
  ],
}
