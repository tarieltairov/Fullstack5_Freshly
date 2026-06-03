import { Link, useNavigate } from 'react-router-dom';
import { Counter } from '../../components/Counter';
import { useCart } from '../../context/CartContext';
import styles from './Cart.module.scss';
import { EmptyState } from '../../components/EmptyState';

export function Cart() {
  const { cart, removeItemFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className={styles.cart}>
        <h2>Корзина</h2>

        <EmptyState
          className={styles.cartEmpty}
          icon='🛒'
          title='Корзина пуста'
          text='Добавьте товары из каталога, чтобы оформить заказ.'
          action={
            <Link to='/' className={styles.cart__catalogBtn}>
              Перейти в каталог
            </Link>
          }
        />
      </div>
    );
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const onRemoveItemClick = (
    productId: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    removeItemFromCart(productId);
  };

  return (
    <div className={styles.cart}>
      <h1 className={styles.cart__title}>Корзина</h1>

      <div className={styles.cart__list}>
        {cart.map((item) => {
          return (
            <div
              onClick={() => handleProductClick(item.id)}
              key={item.id}
              className={styles.cart__item}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className={styles.cart__item_img}
                onError={(event) => {
                  event.currentTarget.src = `https://placehold.co/400x400/16a34a/ffffff?text=${item.title}`;
                }}
              />
              <div className={styles.cart__item_right}>
                <h2 className={styles.cart__item_title}>{item.title}</h2>
                <h3 className={styles.cart__item_price}>{item.price} сом</h3>
                <div className={styles.cart__item_controls}>
                  <Counter productId={item.id} />

                  <button
                    onClick={(e) => onRemoveItemClick(item.id, e)}
                    className={styles.cart__item_remove}
                  >
                    Удалить
                  </button>
                </div>
                <p className={styles.cart__item_subtotal}>
                  Сумма: <b>{item.price * item.quantity} сомы</b>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.cart__footer}>
        <div className={styles.cart__total}>
          Итого: <b>{totalPrice} сом</b>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className={styles.cart__checkoutBtn}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
