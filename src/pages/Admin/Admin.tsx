import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../../components/ConfirmModal';
import { EmptyState } from '../../components/EmptyState';
import { CATEGORIES } from '../../constants/categories';
import { useProducts } from '../../context/ProductsContext';
import type { Category, Product, ProductPayload } from '../../types/product';
import styles from './Admin.module.scss';

interface FormState {
  title: string;
  price: string;
  imageUrl: string;
  description: string;
  category: Category;
}

const EMPTY_FORM: FormState = {
  title: '',
  price: '',
  imageUrl: '',
  description: '',
  category: 'Молочные',
};

export function Admin() {
  const {
    addProduct,
    deleteProduct,
    error,
    isLoading,
    loadProducts,
    products,
    total,
    updateProduct,
  } = useProducts();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProducts({ page: 1, limit: 100 });
  }, [loadProducts]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data: ProductPayload = {
      title: form.title.trim(),
      price: Number(form.price),
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
      category: form.category,
    };

    const result =
      editingId !== null
        ? await updateProduct(editingId, data)
        : await addProduct(data);

    setIsSubmitting(false);

    if (result) {
      resetForm();
    }
  };

  const openDeleteModal = (id: string) => {
    setOpenDelete(true);
    setDeletingId(id);
  };

  const closeDeleteModal = () => {
    setOpenDelete(false);
    setDeletingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    const deleted = await deleteProduct(deletingId);

    closeDeleteModal();

    if (deleted && editingId === deletingId) resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      title: product.title,
      price: String(product.price),
      imageUrl: product.imageUrl,
      description: product.description,
      category: product.category,
    });
  };

  return (
    <>
      <div className={styles.admin}>
        <h1 className={styles.title}>Админ-панель</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>
            {editingId !== null ? 'Редактирование' : 'Новый товар'}
          </h2>

          <div className={styles.field}>
            <label htmlFor='title'>Название</label>
            <input
              type='text'
              id='title'
              name='title'
              required
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor='price'>Цена</label>
            <input
              type='number'
              id='price'
              name='price'
              min='0'
              required
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor='imageUrl'>URL картинки</label>
            <input
              type='url'
              id='imageUrl'
              name='imageUrl'
              required
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor='category'>Категория</label>
            <select
              id='category'
              name='category'
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor='description'>Описание</label>
            <textarea
              rows={3}
              id='description'
              name='description'
              required
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {error && <p className={styles.itemMeta}>{error}</p>}

          <div className={styles.actions}>
            <button
              type='submit'
              className={styles.submit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Сохраняем...'
                : editingId !== null
                  ? 'Сохранить'
                  : 'Создать'}
            </button>

            {editingId !== null && (
              <button
                type='button'
                className={styles.cancel}
                onClick={resetForm}
              >
                Отмена
              </button>
            )}
          </div>
        </form>

        <div className={styles.list}>
          <h2>Товары ({total})</h2>

          {isLoading ? (
            <EmptyState title='Загружаем товары...' />
          ) : !products.length ? (
            <EmptyState
              title='Товаров пока нет'
              text='Создайте первый товар через форму слева'
            />
          ) : (
            products.map((p) => (
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
                  <Link className={styles.itemTitle} to={`/product/${p.id}`}>
                    {p.title}
                  </Link>
                  <p className={styles.itemMeta}>
                    {p.category} . {p.price} сом
                  </p>
                </div>

                <div className={styles.itemActions}>
                  <button className={styles.edit} onClick={() => handleEdit(p)}>
                    Редактировать
                  </button>

                  <button
                    className={styles.delete}
                    onClick={() => openDeleteModal(p.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        open={openDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
        title='Удалить товар?'
        message='Вы уверены, что хотите удалить данный товар. Удаление будет безвозвратным.'
        confirmText='Удалить'
        variant='danger'
      />
    </>
  );
}
