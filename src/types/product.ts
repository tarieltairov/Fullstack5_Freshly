export type Category =
  | 'Молочные'
  | 'Мясо'
  | 'Овощи и фрукты'
  | 'Напитки'
  | 'Бакалея'
  | 'Ноутбуки';

export interface Product {
  title: string;
  price: number;
  imageUrl: string;
  id: string;
  category: Category;
  description: string;
}

export interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: Category;
  description?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type ProductPayload = Omit<Product, 'id'>;

export function normalizeProduct(product: ApiProduct): Product {
  return {
    id: product._id,
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
    description: product.description ?? '',
  };
}
