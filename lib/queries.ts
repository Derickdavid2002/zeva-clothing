
export const allProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    category,
    price,
    description,
    image,
    images,
    stock,
    inStock,
    featured
  }
`;

export const featuredProductsQuery = `
  *[_type == "product" && featured == true] {
    _id,
    name,
    slug,
    category,
    price,
    description,
    image,
    images,
    stock,
    inStock,
    featured
  }
`;

export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    category,
    price,
    description,
    image,
    images,
    stock,
    inStock,
    featured
  }
`;

export const allCategoriesQuery = `
  *[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    image,
    "imageUrl": image.asset->url,
    order
  }
`;
