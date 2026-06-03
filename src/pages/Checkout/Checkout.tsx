import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './Checkout.module.scss';
import type { OrderErrors, OrderForm } from '../../types/order';
import { useNavigate } from 'react-router-dom';
import { createOrderRequest } from '../../services/orders';
import { getApiErrorMessage } from '../../services/apiError';

export function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();

  const navigate = useNavigate();

  const [form, setForm] = useState<OrderForm>({
    name: '',
    phone: '',
    address: '',
    comment: '',
  });

  const [errors, setErrors] = useState<OrderErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): OrderErrors => {
    const newErrors: OrderErrors = {};

    if (form.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (form.address.trim().length < 5) {
      newErrors.address = 'Адрес должен содержать минимум 5 символов';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
      setIsSubmitting(true);

      try {
        const order = await createOrderRequest({
          name: form.name,
          address: form.address,
          phone: form.phone,
          comment: form.comment,
          productIds: cart.map((i) => i.id),
          quantities: cart.map((i) => i.quantity),
        });

        clearCart();
        navigate('/checkout/success', {
          state: { orderId: order._id, total: order.total },
          replace: true,
        });
      } catch (err) {
        setErrors({ submit: getApiErrorMessage(err) });
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      navigate('/cart');
    }
  }, [cart.length, isSubmitting, navigate]);

  return (
    <div className={styles.checkout}>
      <h1 className={styles.checkout__title}>Оформление заказа</h1>

      <div className={styles.checkout__layout}>
        <form className={styles.checkout__form} onSubmit={handleSubmit}>
          {/* имя */}
          <div className={styles.checkout__field}>
            <label htmlFor='name'>
              Имя <span className={styles.required}>*</span>
            </label>

            <input
              id='name'
              name='name'
              type='text'
              placeholder='Введите имя'
              value={form.name}
              onChange={handleChange}
            />

            {errors.name && (
              <span className={styles.checkout__error}>{errors.name}</span>
            )}
          </div>

          {/* телефон */}
          <div className={styles.checkout__field}>
            <label htmlFor='phone'>
              Телефон <span className={styles.required}>*</span>
            </label>

            <input
              id='phone'
              name='phone'
              type='tel'
              placeholder='Введите номер телефона'
              value={form.phone}
              onChange={handleChange}
            />

            {errors.phone && (
              <span className={styles.checkout__error}>{errors.phone}</span>
            )}
          </div>

          {/* Адрес */}
          <div className={styles.checkout__field}>
            <label htmlFor='address'>
              Адрес <span className={styles.required}>*</span>
            </label>

            <input
              type='text'
              id='address'
              name='address'
              placeholder='Укажите ваш адрес'
              value={form.address}
              onChange={handleChange}
            />

            {errors.address && (
              <span className={styles.checkout__error}>{errors.address}</span>
            )}
          </div>

          {/* комментарий */}
          <div className={styles.checkout__field}>
            <label htmlFor='comment'>Комментарий к заказу</label>

            <textarea
              name='comment'
              id='comment'
              placeholder='Например позвонить за час до доставки'
              rows={3}
              value={form.comment}
              onChange={handleChange}
            />
          </div>

          <button
            disabled={isSubmitting}
            className={styles.checkout__submit}
            type='submit'
          >
            {isSubmitting ? 'Оформляем ...' : 'Подтвердить заказ'}
          </button>

          {errors.submit && (
            <span className={styles.checkout__error}>{errors.submit}</span>
          )}
        </form>

        <aside className={styles.checkout__summary}>
          <h2 className={styles.checkout__summaryTitle}>Ваш заказ</h2>

          <ul className={styles.checkout__items}>
            {cart.map((item) => (
              <li key={item.id} className={styles.checkout__item}>
                <span>
                  {item.title} x {item.quantity}
                </span>
                <span>{item.price * item.quantity} сом</span>
              </li>
            ))}
          </ul>

          <div className={styles.checkout__total}>
            Итого: <b>{totalPrice} сом</b>
          </div>
        </aside>
      </div>
    </div>
  );
}
