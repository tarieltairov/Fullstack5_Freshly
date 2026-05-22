import { Navigate, useLocation, useParams } from 'react-router-dom';
import styles from './Product.module.scss';
import { BackButton } from '../../components/BackButton';
import { useCart } from '../../context/CartContext';
import { Counter } from '../../components/Counter';
import { useProducts } from '../../context/ProductsContext';

export function Product() {
  const { getProduct } = useProducts();
  const location = useLocation();

  const { id } = useParams();

  const { addToCart, getItemQuantity } = useCart();

  const currentProduct = getProduct(Number(id));

  if (!currentProduct) {
    return <Navigate to='/' replace />;
  }

  const inCart = getItemQuantity(currentProduct.id) > 0;

  return (
    <div className={styles.productPage}>
      <BackButton
        btnText={
          location.state?.from === '/' ? 'Вернуться на главную' : 'Назад'
        }
      />

      <h1 className={styles.productPage_title}>Страница продукта</h1>

      <h2 className={styles.productPage_name}>{currentProduct.title}</h2>
      <p className={styles.productPage_price}>цена: {currentProduct.price}</p>

      <p className={styles.productPage_description}>
        {currentProduct.description}
      </p>

      <img
        className={styles.productPage_img}
        src={currentProduct.imageUrl}
        alt={currentProduct.title}
        onError={(event) => {
          event.currentTarget.src = `https://placehold.co/600x400/16a34a/ffffff?text=${currentProduct.title}`;
        }}
      />

      <div className={styles.productPage_actions}>
        {inCart ? (
          <Counter productId={currentProduct.id} />
        ) : (
          <button
            className={styles.productPage_btn}
            onClick={() => addToCart(currentProduct)}
          >
            Добавить в корзину
          </button>
        )}
      </div>
    </div>
  );
}
