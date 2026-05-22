/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '../types/product';
import { products as initialProducts } from '../mock/products';

interface ProductsContextType {
  products: Product[];
  addProduct: (data: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, data: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

const STORAGE_KEY = 'products';

function readProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProducts;
    return JSON.parse(raw);
  } catch {
    return initialProducts;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(readProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (data: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...data, id: Date.now() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: number, data: Omit<Product, 'id'>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...data, id } : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProduct = (id: number) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);

  if (!ctx) {
    throw new Error('useProducts must be used within <ProductsProvider>');
  }

  return ctx;
}
