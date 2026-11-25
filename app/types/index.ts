
export interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  category: string;
  price: number;
  description: string;
  image: any;
  images?: any[];
  stock: number;
  inStock: boolean;
  featured: boolean;
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: any;
  order?: number;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: any;
  slug: string;
  qty: number;
  cartKey?: string;
}
