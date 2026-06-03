import { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import { Counter } from '../../components/Counter';
import { EmptyState } from '../../components/EmptyState';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import type { Product as ProductType } from '../../types/product';
import styles from './Product.module.scss';

export function Product() {
  const { getProduct, loadProduct } = useProducts();
  const location = useLocation();
  const { id } = useParams();
  const { addToCart, getItemQuantity } = useCart();

  const [loadedProduct, setLoadedProduct] = useState<ProductType | null>(null);
  const [notFoundId, setNotFoundId] = useState('');

  const cachedProduct = id ? getProduct(id) : undefined;
  const product =
    cachedProduct ?? (loadedProduct?.id === id ? loadedProduct : null);
  const notFound = !id || notFoundId === id;

  useEffect(() => {
    if (!id || cachedProduct) {
      return;
    }

    let ignore = false;

    loadProduct(id).then((nextProduct) => {
      if (ignore) return;

      if (nextProduct) {
        setLoadedProduct(nextProduct);
      } else {
        setNotFoundId(id);
      }
    });

    return () => {
      ignore = true;
    };
  }, [cachedProduct, id, loadProduct]);

  if (notFound) {
    return <Navigate to='/' replace />;
  }

  if (!product) {
    return <EmptyState title='Загружаем товар...' />;
  }

  const inCart = getItemQuantity(product.id) > 0;

  return (
    <div className={styles.productPage}>
      <BackButton
        btnText={location.state?.from === '/' ? 'Вернуться на главную' : 'Назад'}
      />

      <h1 className={styles.productPage_title}>Страница продукта</h1>

      <h2 className={styles.productPage_name}>{product.title}</h2>
      <p className={styles.productPage_price}>цена: {product.price}</p>

      <p className={styles.productPage_description}>{product.description}</p>

      <img
        className={styles.productPage_img}
        src={product.imageUrl}
        alt={product.title}
        onError={(event) => {
          event.currentTarget.src = `https://placehold.co/600x400/16a34a/ffffff?text=${product.title}`;
        }}
      />

      <div className={styles.productPage_actions}>
        {inCart ? (
          <Counter productId={product.id} />
        ) : (
          <button
            className={styles.productPage_btn}
            onClick={() => addToCart(product)}
          >
            Добавить в корзину
          </button>
        )}
      </div>
    </div>
  );
}
