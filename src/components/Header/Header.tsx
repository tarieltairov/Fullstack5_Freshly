import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

import { useCart } from '../../context/CartContext';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

// Link - простая ссылка
// NavLink - ссылка с активным состоянием

interface HeaderRoute {
  to: string;
  label: string;
  badge?: number;
}

export function Header() {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const pages: HeaderRoute[] = [
    {
      to: '/',
      label: 'Главная',
    },
    {
      to: '/cart',
      label: 'Корзина',
      badge: totalCount,
    },
    {
      to: '/about',
      label: 'О нас',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_logo}>Shop</div>

      <nav className={styles.header_nav}>
        {pages.map((route, index) => (
          <NavLink
            className={(val) =>
              clsx(styles.header_link, {
                [styles.active_link]: val.isActive,
                [styles.header_cart]: route.badge,
              })
            }
            key={index}
            to={route.to}
          >
            {route.label}

            {!!route.badge && (
              <span className={styles.header_cart_badge}>{route.badge}</span>
            )}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink to='/admin' className={styles.header_link}>
            Админ
          </NavLink>
        )}

        {user ? (
          <>
            <span className={styles.header_user}>Привет, {user.name}</span>
            <button className={styles.header_logout} onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <NavLink to='/login' className={styles.header_link}>
            Войти
          </NavLink>
        )}
      </nav>
    </header>
  );
}
