'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import type { Product } from '@/types/product';
import productsData from '@/data/products.json';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categories = ['全部', '無線鍵盤', '有線鍵盤', '靜電容鍵盤', '電競鍵盤'];
const PRODUCTS_PER_PAGE = 8;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize state from URL parameters
  useEffect(() => {
    const page = searchParams.get('page');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    if (page) setCurrentPage(parseInt(page));
    if (category) setSelectedCategory(category);
    if (search) setSearchTerm(search);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  const products = productsData as Product[];

  const { paginatedProducts, totalPages, totalResults } = useMemo(() => {
    // Filter products
    const filtered = products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      filteredProducts: filtered,
      paginatedProducts,
      totalPages,
      totalResults: filtered.length,
    };
  }, [products, searchTerm, selectedCategory, sortBy, currentPage]);

  // Update URL parameters - 使用 useCallback 記憶化
  const updateURL = useCallback(
    (page: number, category: string, search: string, sort: string) => {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      if (category !== '全部') params.set('category', category);
      if (search) params.set('search', search);
      if (sort !== 'name') params.set('sort', sort);

      const url = params.toString() ? `?${params.toString()}` : '/products';
      router.replace(url, { scroll: false });
    },
    [router],
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    updateURL(1, selectedCategory, searchTerm, sortBy);
  }, [searchTerm, selectedCategory, sortBy, updateURL]);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, selectedCategory, searchTerm, sortBy);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 shadow-lg',
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-blue-500/25'
                    : 'bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700 hover:text-blue-400 border border-zinc-600',
                )}
              >
                {category}
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
              <option value='name'>按名稱排序</option>
              <option value='price-low'>價格：低到高</option>
              <option value='price-high'>價格：高到低</option>
              <option value='category'>按類別排序</option>
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
          {totalResults > 0 ? (
            <>
              顯示第 {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
              {Math.min(currentPage * PRODUCTS_PER_PAGE, totalResults)} 個商品，共 {totalResults}{' '}
              個結果
            </>
          ) : (
            '找到 0 個商品'
          )}
        </motion.div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          >
            {paginatedProducts.map((product, index) => (
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
        {totalPages > 1 && paginatedProducts.length > 0 && (
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
