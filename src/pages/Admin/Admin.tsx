import { useProducts } from '../../context/ProductsContext';
import { CATEGORIES } from '../../mock/products';
import styles from './Admin.module.scss';

export function Admin() {
  const { products } = useProducts();
  return (
    <div className={styles.admin}>
      <h1 className={styles.title}>Админ-панель</h1>

      <form className={styles.form}>
        <h2 className={styles.formTitle}>Новый товар</h2>

        <div className={styles.field}>
          <label htmlFor='title'>Название</label>
          <input type='text' id='title' name='title' required />
        </div>

        <div className={styles.field}>
          <label htmlFor='price'>Цена</label>
          <input type='number' id='price' name='price' required />
        </div>

        <div className={styles.field}>
          <label htmlFor='imageUrl'>URL картинки</label>
          <input type='url' id='imageUrl' name='imageUrl' required />
        </div>

        <div className={styles.field}>
          <label htmlFor='category'>Категория</label>
          <select id='category' name='category'>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor='description'>Описание</label>
          <textarea rows={3} id='description' name='description' required />
        </div>

        <div className={styles.actions}>
          <button type='submit' className={styles.submit}>
            Создать
          </button>
        </div>
      </form>

      <div className={styles.list}>
        <h2>Товары ({products.length})</h2>

        {products.map((p) => (
          <div key={p.id} className={styles.item}>
            <img
              className={styles.itemImg}
              src={p.imageUrl}
              alt={p.title}
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/120x120/16a34a/ffffff?text=${p.title}`;
              }}
            />

            <div className={styles.itemBody}>
              <h3 className={styles.itemTitle}>{p.title}</h3>
              <p className={styles.itemMeta}>
                {p.category} . {p.price} сом
              </p>
            </div>

            <div className={styles.itemActions}>
              <button className={styles.edit}>Редактировать</button>
              <button className={styles.delete}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
