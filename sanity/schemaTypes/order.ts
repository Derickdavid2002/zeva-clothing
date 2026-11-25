export default {
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: "orderNumber",
      title: "Order Number",
      type: "string",
    },
    {
  name: "stockDeducted",
  title: "Stock Deducted",
  type: "boolean",
  initialValue: false,
  readOnly: true,
},
  {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Payment Confirmed", value: "confirmed" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Payment Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
    },
    {
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        { name: "name", title: "Full Name", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
      ],
    },
    {
      name: "delivery",
      title: "Delivery Info",
      type: "object",
      fields: [
        { name: "address", title: "Address", type: "string" },
        { name: "state", title: "State", type: "string" },
        { name: "fee", title: "Delivery Fee", type: "number" },
      ],
    },
    {
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", title: "Product ID", type: "string" },
            { name: "name", title: "Product Name", type: "string" },
            { name: "price", title: "Price", type: "number" },
            { name: "qty", title: "Quantity", type: "number" },
            { name: "size", title: "Selected Size", type: "string" },
            { name: "color", title: "Selected Colour", type: "string" },
            { name: "selectedOptions", title: "Selected Options", type: "array", of: [{ type: "object", fields: [{ name: "label", title: "Option", type: "string" }, { name: "value", title: "Selected Value", type: "string" }] }] },
            { name: "image", title: "Image", type: "image" },
          ],
        },
      ],
    },
    {
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    },
    {
      name: "total",
      title: "Total",
      type: "number",
    },
    {
      name: "proofOfPayment",
      title: "Proof of Payment",
      type: "image",
      options: { hotspot: true },
    },
    { name: "rejectionReason", title: "Payment Rejection Reason", type: "text" },
    { name: "proofSubmittedAt", title: "Payment Proof Submitted At", type: "datetime" },
    {
      name: "notes",
      title: "Customer Notes",
      type: "text",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    },
  ],
  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "customer.name",
      subtitle: "status",
      orderNumber: "orderNumber",
    },
    prepare({ title, subtitle, orderNumber }: any) {
      return {
        title: `${orderNumber} — ${title}`,
        subtitle: subtitle?.toUpperCase(),
      }
    },
  },
}