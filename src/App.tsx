// есть 2 способа настройки маршрутизации (react-router-dom)
import './styles/global.scss';
import { Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';
import { Product } from './pages/Product';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';
import { Cart } from './pages/Cart/Cart';
import { Checkout } from './pages/Checkout';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Admin } from './pages/Admin';
import { About } from './pages/About';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Main />} />
        <Route path='about' element={<About />} />
        <Route path='product/:id' element={<Product />} />
        <Route path='cart' element={<Cart />} />

        <Route element={<PrivateRoute />}>
          <Route path='checkout' element={<Checkout />} />
          <Route path='checkout/success' element={<CheckoutSuccess />} />
        </Route>

        <Route element={<PrivateRoute role='admin' />}>
          <Route path='admin' element={<Admin />} />
        </Route>
      </Route>

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
