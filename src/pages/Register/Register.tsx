import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Register.module.scss';
import { useState } from 'react';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    if (form.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (form.confirmPassword !== form.password) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Регистрация</h1>

        <div className={styles.field}>
          <label htmlFor='name'>Имя</label>
          <input
            onChange={handleChange}
            value={form.name}
            type='text'
            id='name'
            name='name'
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            value={form.email}
            type='email'
            id='email'
            name='email'
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor='password'>Пароль</label>
          <input
            onChange={handleChange}
            value={form.password}
            type='password'
            id='password'
            name='password'
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor='confirmPassword'>Повторите пароль</label>
          <input
            onChange={handleChange}
            value={form.confirmPassword}
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submit} type='submit' disabled={isLoading}>
          {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </button>

        <p className={styles.hint}>
          Уже есть аккаунт? <Link to={'/login'}>Войти</Link>
        </p>
      </form>
    </div>
  );
}
