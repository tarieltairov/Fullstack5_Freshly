import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProductsProvider } from './context/ProductsContext.tsx';
import { ScrollToTop } from './components/ScrollToTop';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ScrollToTop />
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  </BrowserRouter>,
);
