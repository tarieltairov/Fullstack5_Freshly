import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { Pagination } from '../../components/Pagination';
import { ProductCard } from '../../components/ProductCard';
import { CATEGORIES } from '../../constants/categories';
import { useProducts } from '../../context/ProductsContext';
import type { Category } from '../../types/product';
import { buildNextParams } from '../../utils/searchParams';
import styles from './Main.module.scss';

const PER_PAGE_OPTIONS = [3, 4, 6, 12] as const;
const DEFAULT_PER_PAGE = 3;

export function Main() {
  const { error, isLoading, loadProducts, products, totalPages } =
    useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const pageRaw = Number(searchParams.get('page') ?? '1');
  const perPageRaw = Number(searchParams.get('perPage') ?? DEFAULT_PER_PAGE);
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const perPage = PER_PAGE_OPTIONS.includes(
    perPageRaw as (typeof PER_PAGE_OPTIONS)[number],
  )
    ? perPageRaw
    : DEFAULT_PER_PAGE;

  useEffect(() => {
    const categoryParam = CATEGORIES.includes(category as Category)
      ? (category as Category)
      : undefined;

    loadProducts({
      search,
      category: categoryParam,
      page,
      limit: perPage,
      ...getSortParams(sort),
    });
  }, [category, loadProducts, page, perPage, search, sort]);

  const updateParam = (key: string, value: string) => {
    setSearchParams(buildNextParams(searchParams, key, value));
  };

  return (
    <div className={styles.mainPage}>
      <h1 className={styles.mainPage_title}>Каталог</h1>

      <div className={styles.mainPage_controls}>
        <input
          className={styles.mainPage_search}
          type='text'
          placeholder='Найти товар'
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
        />

        <select
          className={styles.mainPage_select}
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
        >
          <option value=''>Все категории</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className={styles.mainPage_select}
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          <option value=''>Без сортировки</option>
          <option value='price-asc'>Цена по +</option>
          <option value='price-desc'>Цена по -</option>
          <option value='name-asc'>Название А-Я</option>
          <option value='name-desc'>Название Я-А</option>
        </select>

        <select
          className={styles.mainPage_select}
          value={perPage}
          onChange={(e) => updateParam('perPage', e.target.value)}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>

      {error ? (
        <EmptyState title='Не удалось загрузить каталог' text={error} />
      ) : isLoading ? (
        <EmptyState title='Загружаем каталог...' />
      ) : !products.length ? (
        <EmptyState
          title={!search && !category ? 'Каталог пока пуст' : 'Ничего не найдено'}
          text={
            !search && !category
              ? 'Скоро здесь появятся товары. Загляните позже.'
              : 'Попробуйте изменить параметры поиска или фильтра'
          }
        />
      ) : (
        <div className={styles.productsList}>
          {products.map((product) => (
            <ProductCard {...product} key={product.id} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        onChange={(p) => updateParam('page', String(p))}
        totalPages={totalPages}
      />
    </div>
  );
}

function getSortParams(sort: string) {
  switch (sort) {
    case 'price-asc':
      return { sortPrice: 'asc' as const };
    case 'price-desc':
      return { sortPrice: 'desc' as const };
    case 'name-asc':
      return { sortTitle: 'asc' as const };
    case 'name-desc':
      return { sortTitle: 'desc' as const };
    default:
      return {};
  }
}
