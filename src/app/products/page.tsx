'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import type { Product, ProductCategory } from '@/types/product';
import { apiGetProducts, apiGetCategories } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PRODUCTS_PER_PAGE = 8;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 狀態管理
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 篩選與分頁狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // 從 URL 參數初始化狀態
  useEffect(() => {
    const page = searchParams.get('page');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    if (page) setCurrentPage(parseInt(page));
    if (category) setSelectedCategoryId(parseInt(category));
    if (search) setSearchTerm(search);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  // 載入分類列表
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiGetCategories();
        setCategories(data);
      } catch (err) {
        console.error('載入分類失敗:', err);
      }
    };
    loadCategories();
  }, []);

  // 載入商品列表
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 轉換排序參數格式
      let apiSort: 'price_asc' | 'price_desc' | 'created_at_asc' | 'created_at_desc' | undefined;
      switch (sortBy) {
        case 'price-low':
          apiSort = 'price_asc';
          break;
        case 'price-high':
          apiSort = 'price_desc';
          break;
        case 'newest':
          apiSort = 'created_at_desc';
          break;
        case 'oldest':
          apiSort = 'created_at_asc';
          break;
        default:
          apiSort = 'created_at_desc';
      }

      const response = await apiGetProducts({
        page: currentPage,
        per_page: PRODUCTS_PER_PAGE,
        category_id: selectedCategoryId || undefined,
        keyword: searchTerm || undefined,
        sort: apiSort,
      });

      setProducts(response.data);
      setTotalPages(response.meta.last_page);
      setTotalResults(response.meta.total);
    } catch (err) {
      console.error('載入商品失敗:', err);
      setError('載入商品失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategoryId, searchTerm, sortBy]);

  // 當篩選條件改變時重新載入商品
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 更新 URL 參數
  const updateURL = useCallback(
    (page: number, categoryId: number | null, search: string, sort: string) => {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      if (categoryId) params.set('category', categoryId.toString());
      if (search) params.set('search', search);
      if (sort !== 'created_at_desc') params.set('sort', sort);

      const url = params.toString() ? `?${params.toString()}` : '/products';
      router.replace(url, { scroll: false });
    },
    [router],
  );

  // 處理搜尋
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(1, selectedCategoryId, value, sortBy);
  };

  // 處理分類篩選
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    updateURL(1, categoryId, searchTerm, sortBy);
  };

  // 處理排序
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
    updateURL(1, selectedCategoryId, searchTerm, sort);
  };

  // 處理分頁
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, selectedCategoryId, searchTerm, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 處理商品點擊
  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  // 搜尋防抖
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearchTerm !== searchTerm) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  return (
    <div className='min-h-screen bg-black'>
      <div className='container mx-auto px-4 py-24'>
        {/* Filters and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='mb-8 space-y-4'
        >
          {/* Search Bar */}
          <div className='relative max-w-md mx-auto'>
            <input
              type='text'
              placeholder='搜尋鍵盤...'
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-zinc-600 bg-zinc-900/90 backdrop-blur-sm px-4 py-3 pl-10',
                'text-white placeholder-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30',
                'shadow-lg',
              )}
            />
            <svg
              className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>

          {/* Category Filters */}
          <div className='flex flex-wrap justify-center gap-2'>
            <button
              onClick={() => handleCategoryChange(null)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 shadow-lg',
                selectedCategoryId === null
                  ? 'bg-blue-600 text-white shadow-blue-500/25'
                  : 'bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700 hover:text-blue-400 border border-zinc-600',
              )}
            >
              全部
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 shadow-lg',
                  selectedCategoryId === category.id
                    ? 'bg-blue-600 text-white shadow-blue-500/25'
                    : 'bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700 hover:text-blue-400 border border-zinc-600',
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className='flex justify-center'>
            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
              className={cn(
                'rounded-lg border border-zinc-600 bg-zinc-900/90 backdrop-blur-sm px-4 py-2 text-white shadow-lg',
                'focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30',
              )}
            >
              <option value='created_at_desc'>最新上架</option>
              <option value='price-low'>價格：低到高</option>
              <option value='price-high'>價格：高到低</option>
              <option value='oldest'>最早上架</option>
            </select>
          </div>
        </motion.div>

        {/* Products Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='mb-6 text-center text-zinc-300'
        >
          {isLoading ? (
            '載入中...'
          ) : totalResults > 0 ? (
            <>
              顯示第 {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
              {Math.min(currentPage * PRODUCTS_PER_PAGE, totalResults)} 個商品，共 {totalResults}{' '}
              個結果
            </>
          ) : (
            '找到 0 個商品'
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='mb-6 text-center text-red-400'
          >
            {error}
            <button
              onClick={loadProducts}
              className='ml-2 text-blue-400 hover:text-blue-300 underline'
            >
              重試
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[...Array(PRODUCTS_PER_PAGE)].map((_, index) => (
              <div
                key={index}
                className='h-[480px] rounded-xl border border-zinc-600 bg-zinc-900/90 animate-pulse'
              >
                <div className='h-48 bg-zinc-800 rounded-t-xl' />
                <div className='p-5 space-y-3'>
                  <div className='h-6 bg-zinc-800 rounded w-3/4' />
                  <div className='h-4 bg-zinc-800 rounded w-full' />
                  <div className='h-4 bg-zinc-800 rounded w-2/3' />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard product={product} onClick={() => handleProductClick(product.id)} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-16'
          >
            <div className='mx-auto mb-4 h-24 w-24 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-600'>
              <svg
                className='h-12 w-12 text-zinc-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-xl font-semibold text-white'>找不到相符的商品</h3>
            <p className='text-zinc-300'>嘗試調整搜尋關鍵字或篩選條件</p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className='mt-12 flex flex-col items-center space-y-4'
          >
            {/* Page Info */}
            <div className='text-sm text-zinc-400'>
              第 {currentPage} 頁，共 {totalPages} 頁
            </div>

            {/* Pagination Controls */}
            <div className='flex items-center space-x-2'>
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200',
                  currentPage === 1
                    ? 'border-zinc-700 bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                    : 'border-zinc-600 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-700 hover:border-blue-400 hover:text-blue-400 shadow-lg',
                )}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className='flex items-center space-x-1'>
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  // First page and ellipsis
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className='flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-600 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-700 hover:border-blue-400 hover:text-blue-400 transition-all duration-200 shadow-lg'
                      >
                        1
                      </button>,
                    );

                    if (startPage > 2) {
                      pages.push(
                        <span key='start-ellipsis' className='px-2 text-zinc-500'>
                          ...
                        </span>,
                      );
                    }
                  }

                  // Visible page numbers
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 shadow-lg',
                          i === currentPage
                            ? 'border-blue-500 bg-blue-600 text-white shadow-blue-500/25'
                            : 'border-zinc-600 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-700 hover:border-blue-400 hover:text-blue-400',
                        )}
                      >
                        {i}
                      </button>,
                    );
                  }

                  // Last page and ellipsis
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key='end-ellipsis' className='px-2 text-zinc-500'>
                          ...
                        </span>,
                      );
                    }

                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className='flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-600 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-700 hover:border-blue-400 hover:text-blue-400 transition-all duration-200 shadow-lg'
                      >
                        {totalPages}
                      </button>,
                    );
                  }

                  return pages;
                })()}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200',
                  currentPage === totalPages
                    ? 'border-zinc-700 bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                    : 'border-zinc-600 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-700 hover:border-blue-400 hover:text-blue-400 shadow-lg',
                )}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>

            {/* Quick Jump Buttons for Mobile */}
            <div className='flex md:hidden space-x-2'>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border transition-all duration-200',
                  currentPage === 1
                    ? 'border-zinc-700 bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                    : 'border-zinc-600 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-700 hover:border-blue-400 hover:text-blue-400',
                )}
              >
                第一頁
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border transition-all duration-200',
                  currentPage === totalPages
                    ? 'border-zinc-700 bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                    : 'border-zinc-600 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-700 hover:border-blue-400 hover:text-blue-400',
                )}
              >
                最後一頁
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-black flex items-center justify-center'>
          <div className='text-white text-xl'>載入中...</div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
