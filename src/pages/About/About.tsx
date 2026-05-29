import { Link } from 'react-router-dom';
import styles from './About.module.scss';

interface Feature {
  icon: string;
  title: string;
  text: string;
}

interface Stat {
  value: string;
  label: string;
}

const FEATURES: Feature[] = [
  { icon: '🥦', title: 'Только свежее', text: '...' },
  { icon: '🚚', title: 'Быстрая доставка', text: '...' },
  { icon: '💚', title: 'Честные цены', text: '...' },
  { icon: '🛡️', title: 'Гарантия качества', text: '...' },
];

const STATS: Stat[] = [
  { value: '12 000+', label: 'довольных клиентов' },
  { value: '50+', label: 'категорий товаров' },
  { value: '60 мин', label: 'средняя доставка' },
  { value: '4.9 ★', label: 'рейтинг в отзывах' },
];

export function About() {
  return (
    <div className={styles.about}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>О магазине Freshly</h1>
        <p className={styles.heroLead}>...</p>
      </section>

      <section className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Почему нас выбирают</h2>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.feature}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Готовы попробовать?</h2>
        <p className={styles.ctaText}>Загляните в каталог.</p>
        <Link to='/' className={styles.ctaBtn}>
          Перейти в каталог
        </Link>
      </section>
    </div>
  );
}
