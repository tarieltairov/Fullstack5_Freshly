import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <Link to='/' className={styles.logo}>
            🥦 Freshly
          </Link>
          <p className={styles.tagline}>Свежие продукты с доставкой на дом</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Навигация</h4>
          <ul className={styles.list}>
            <li>
              <Link to='/' className={styles.link}>
                Каталог
              </Link>
            </li>
            <li>
              <Link to='/cart' className={styles.link}>
                Корзина
              </Link>
            </li>
            <li>
              <Link to='/about' className={styles.link}>
                О нас
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Контакты</h4>
          <ul className={styles.list}>
            <li className={styles.contact}>+996 555 123 456</li>
            <li className={styles.contact}>support@freshly.kg</li>
            <li className={styles.contact}>г. Бишкек, ул. Чуй, 100</li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Режим работы</h4>
          <ul className={styles.list}>
            <li className={styles.contact}>Пн–Пт: 9:00–21:00</li>
            <li className={styles.contact}>Сб–Вс: 10:00–20:00</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>© {year} Freshly. Учебный проект.</div>
    </footer>
  );
}
