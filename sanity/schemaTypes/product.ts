
const product = {
  name: "product",
  title: "Product",
  type: "document",

  fields: [
    {
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      description: "Choose a category managed in the Zeva admin dashboard.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "price",
      title: "Price (₦)",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    },
    {
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "images",
      title: "Additional Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    },
    {
      name: "stock",
      title: "Available Quantity",
      type: "number",
      description: "Total number of pieces available for this product.",
      initialValue: 0,
      validation: (Rule: any) =>
        Rule.required().integer().min(0),
    },
    {
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    },
  ],
};

export default product;
