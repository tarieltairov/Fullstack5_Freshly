import { useCart } from '../../context/CartContext';
import styles from './Counter.module.scss';

interface CounterProps {
  productId: string;
}

export function Counter({ productId }: CounterProps) {
  const { getItemQuantity, increaseItem, decreaseItem } = useCart();

  const quantity = getItemQuantity(productId);

  const handleChangeCount = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    actionType: 'plus' | 'minus',
  ) => {
    e.stopPropagation();

    const action = actionType === 'plus' ? increaseItem : decreaseItem;

    action(productId);
  };

  return (
    <div className={styles.counter}>
      <button
        className={styles.counter__btn}
        onClick={(e) => handleChangeCount(e, 'minus')}
        aria-label='Уменьшить'
      >
        -
      </button>

      <span className={styles.counter__value}>{quantity}</span>

      <button
        className={styles.counter__btn}
        onClick={(e) => handleChangeCount(e, 'plus')}
        aria-label='Увеличить'
      >
        +
      </button>
    </div>
  );
}
