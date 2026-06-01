import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LocationState {
  from?: string;
}

export function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    const result = await login({ email, password });

    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  console.log(isLoading);

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} action='' onSubmit={handleSubmit}>
        <h1 className={styles.title}>Вход</h1>

        <div className={styles.field}>
          <label htmlFor='email'>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            id='email'
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor='password'>Пароль</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            id='password'
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submit} type='submit' disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </button>

        <p className={styles.hint}>
          Нет аккаунта? <Link to={'/register'}>Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}
