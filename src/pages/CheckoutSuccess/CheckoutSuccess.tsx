import { Link, Navigate, useLocation } from 'react-router-dom';
import styles from './CheckoutSuccess.module.scss';

interface SuccessState {
  orderId: string;
  total: number;
}

export function CheckoutSuccess() {
  const location = useLocation();
  const state = location.state as SuccessState | null;

  // Если пользователь зашёл сюда напрямую (без оформления) — отправляем на главную
  if (!state) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className={styles.success}>
      <div className={styles.success__icon}>✓</div>
      <h1 className={styles.success__title}>Заказ оформлен!</h1>
      <p className={styles.success__text}>
        Спасибо за покупку. Номер вашего заказа: <b>#{state.orderId}</b>
      </p>
      <p className={styles.success__text}>
        Сумма к оплате: <b>{state.total} сом</b>
      </p>
      <p className={styles.success__hint}>
        Мы свяжемся с вами по указанному телефону для подтверждения доставки.
      </p>

      <Link to='/' className={styles.success__btn}>
        Вернуться к покупкам
      </Link>
    </div>
  );
}
