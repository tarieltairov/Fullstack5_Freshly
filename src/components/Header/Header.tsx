import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

import { useCart } from '../../context/CartContext';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { UserMenu } from '../UserMenu';

// Link - простая ссылка
// NavLink - ссылка с активным состоянием

interface HeaderRoute {
  to: string;
  label: string;
}

export function Header() {
  const { totalCount } = useCart();
  const { user } = useAuth();

  const pages: HeaderRoute[] = [
    {
      to: '/',
      label: 'Каталог',
    },
    {
      to: '/about',
      label: 'О нас',
    },
  ];

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.header_logo}>
        🥦 Freshly
      </Link>

      <nav className={styles.header_nav}>
        {pages.map((route, index) => (
          <NavLink
            className={(val) =>
              clsx(styles.header_link, {
                [styles.active_link]: val.isActive,
              })
            }
            key={index}
            to={route.to}
          >
            {route.label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink to='/admin' className={styles.header_link}>
            Админ
          </NavLink>
        )}

        {user ? (
          <UserMenu />
        ) : (
          <NavLink to='/login' className={styles.header_link}>
            Войти
          </NavLink>
        )}

        <NavLink
          to='/cart'
          aria-label='Корзина'
          className={({ isActive }) =>
            clsx(styles.header_cartIcon, {
              [styles.active_cartIcon]: isActive,
            })
          }
        >
          <svg
            width='22'
            height='22'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='9' cy='21' r='1' />
            <circle cx='20' cy='21' r='1' />
            <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
          </svg>

          {totalCount > 0 && (
            <span className={styles.header_cart_badge}>{totalCount}</span>
          )}
        </NavLink>
      </nav>
    </header>
  );
}
