import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './UserMenu.module.scss';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('mousedown', onClickOutside);
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={styles.userMenu} ref={wrapperRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label='Меню пользователя'
        aria-expanded={open}
        aria-haspopup='menu'
      >
        {initials}
      </button>

      {open && (
        <div className={styles.dropdown} role='menu'>
          <div className={styles.info}>
            <div className={styles.name}>{user.name}</div>
            <div className={styles.email}>{user.email}</div>
            {user.role === 'admin' && (
              <div className={styles.role}>Администратор</div>
            )}
          </div>

          <button
            className={styles.logout}
            onClick={handleLogout}
            role='menuitem'
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
