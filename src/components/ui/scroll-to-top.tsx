'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className='fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-white shadow-lg transition-opacity hover:bg-neutral-700'
      aria-label='回到頂部'
    >
      <ArrowUp className='h-5 w-5' />
    </button>
  );
}
