/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Product, ProductPayload } from '../types/product';
import {
  createProduct as createProductRequest,
  deleteProduct as deleteProductRequest,
  fetchProductById,
  fetchProducts,
  updateProduct as updateProductRequest,
  type ListProductsParams,
} from '../services/products';
import { getApiErrorMessage } from '../services/apiError';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  error: string;
  total: number;
  currentPage: number;
  totalPages: number;
  loadProducts: (params?: ListProductsParams) => Promise<void>;
  loadProduct: (id: string) => Promise<Product | null>;
  addProduct: (data: ProductPayload) => Promise<Product | null>;
  updateProduct: (id: string, data: ProductPayload) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProduct: (id: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const loadProducts = useCallback(async (params: ListProductsParams = {}) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetchProducts(params);

      setProducts(response.data);
      setTotal(response.total);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      setProducts([]);
      setTotal(0);
      setCurrentPage(1);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProduct = useCallback(async (id: string) => {
    setError('');

    try {
      const product = await fetchProductById(id);

      setProducts((prev) => upsertProduct(prev, product));

      return product;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return null;
    }
  }, []);

  const addProduct = async (data: ProductPayload) => {
    setError('');

    try {
      const product = await createProductRequest(data);

      setProducts((prev) => [product, ...prev]);
      setTotal((prev) => prev + 1);

      return product;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return null;
    }
  };

  const updateProduct = async (id: string, data: ProductPayload) => {
    setError('');

    try {
      const product = await updateProductRequest(id, data);

      setProducts((prev) => upsertProduct(prev, product));

      return product;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    setError('');

    try {
      await deleteProductRequest(id);

      setProducts((prev) => prev.filter((product) => product.id !== id));
      setTotal((prev) => Math.max(prev - 1, 0));

      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return false;
    }
  };

  const getProduct = useCallback(
    (id: string) => products.find((product) => product.id === id),
    [products],
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        error,
        isLoading,
        total,
        currentPage,
        totalPages,
        loadProduct,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
      }}
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

function upsertProduct(products: Product[], product: Product) {
  const exists = products.some((item) => item.id === product.id);

  if (!exists) {
    return [product, ...products];
  }

  return products.map((item) => (item.id === product.id ? product : item));
}
