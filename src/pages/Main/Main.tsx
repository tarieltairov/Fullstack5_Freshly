import { useMemo } from 'react';
import { Pagination } from '../../components/Pagination';
import { ProductCard } from '../../components/ProductCard';
import { CATEGORIES } from '../../mock/products';
import { buildNextParams } from '../../utils/searchParams';
import styles from './Main.module.scss';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { EmptyState } from '../../components/EmptyState';

const PER_PAGE_OPTIONS = [3, 4, 6, 12] as const;
const DEFAULT_PER_PAGE = 3;

export function Main() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const page = Number(searchParams.get('page') ?? '1');
  const perPageRaw = Number(searchParams.get('perPage') ?? DEFAULT_PER_PAGE);

  const perPage = PER_PAGE_OPTIONS.includes(
    perPageRaw as (typeof PER_PAGE_OPTIONS)[number],
  )
    ? perPageRaw
    : DEFAULT_PER_PAGE;

  const updateParam = (key: string, value: string) => {
    setSearchParams(buildNextParams(searchParams, key, value));
  };

  // логика поиска
  const bySearch = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  // логика филтрации по категории
  const byCategory = category
    ? bySearch.filter((p) => p.category === category)
    : bySearch;

  const sorted = useMemo(() => {
    const list = [...byCategory];

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return list;
    }
  }, [byCategory, sort]);

  const totalPages = Math.ceil(sorted.length / perPage);

  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

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

        {/* ФИЛЬТР ПО КАТЕГОРИИ */}
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

        {/* СОРТИРОВКИ */}
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

        {/* ЛИМИТ ТОВАРОВ НА СТРАНИЦЕ */}
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

      {!paginated.length ? (
        <EmptyState
          title={!products.length ? 'Каталог пока пуст' : 'Ничего не найдено'}
          text={
            !products.length
              ? 'Скоро здесь появятся товары. Загляните позже.'
              : 'Попробуйте изменить параметры поиска или фильтра'
          }
          icon='🛒'
        />
      ) : (
        <div className={styles.productsList}>
          {paginated.map((product, index) => (
            <ProductCard {...product} key={index} />
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
