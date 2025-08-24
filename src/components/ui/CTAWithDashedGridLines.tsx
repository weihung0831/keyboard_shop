'use client';
import { cn } from '@/lib/utils';
import { IconMessageCircleQuestion } from '@tabler/icons-react';
import React from 'react';
import { HiArrowRight } from 'react-icons/hi2';
import Link from 'next/link';

export function CTAWithDashedGridLines() {
  return (
    <section className='w-full pt-8 pb-8 md:pt-24 md:pb-16 min-h-[400px] md:min-h-[500px] relative z-20 bg-black overflow-hidden'>
      <GridLineHorizontal className='top-0' offset='400px' />
      <GridLineHorizontal className='bottom-0 top-auto' offset='400px' />
      <GridLineVertical className='left-0' offset='150px' />
      <GridLineVertical className='left-auto right-0' offset='150px' />

      {/* 確保背景完全覆蓋 */}
      <div className='absolute inset-0 bg-black -z-10'></div>

      <div className='container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 justify-start relative z-10'>
        <div className='md:col-span-2 p-8 md:p-14'>
          <h2 className='text-left text-neutral-200 text-xl md:text-3xl tracking-tight font-medium'>
            為什麼選擇 <span className='font-bold text-white'>Axis Keys</span>？
          </h2>
          <p className='text-left text-neutral-200 mt-4 max-w-lg text-xl md:text-3xl tracking-tight font-medium'>
            享受 <span className='text-sky-400'>專業級</span> 機械鍵盤體驗，配備最{' '}
            <span className='text-indigo-400'>頂尖的軸體</span> 技術
          </p>

          <div className='flex items-start sm:items-center flex-col sm:flex-row sm:gap-4'>
            <Link
              href='/products'
              className='mt-8 flex space-x-2 items-center group text-base px-4 py-2 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]'
            >
              <span>立即選購</span>
              <HiArrowRight className='text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 mt-0.5 transition-transform duration-200' />
            </Link>
            <Link
              href='/contact'
              className='mt-8 flex space-x-2 items-center group text-base px-4 py-2 rounded-lg text-white border border-neutral-600 hover:border-neutral-500 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]'
            >
              <span>諮詢專家</span>
              <IconMessageCircleQuestion className='text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 mt-0.5 transition-transform duration-200' />
            </Link>
          </div>
        </div>
        <div className='border-t md:border-t-0 md:border-l border-dashed p-8 md:p-14'>
          <p className='text-base text-neutral-200'>
            &quot;這是我用過最棒的機械鍵盤！軸體手感極佳，打字體驗完全不同。絕對推薦給每一位追求品質的使用者。&quot;
          </p>
          <div className='flex flex-col text-sm items-start mt-4 gap-1'>
            <p className='font-bold text-neutral-200'>張志明</p>
            <p className='text-neutral-400'>資深程式設計師</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const GridLineHorizontal = ({ className, offset }: { className?: string; offset?: string }) => {
  return (
    <div
      style={
        {
          '--background': '#000000',
          '--color': 'rgba(255, 255, 255, 0.1)',
          '--height': '1px',
          '--width': '5px',
          '--fade-stop': '95%',
          '--offset': offset || '200px',
          '--color-dark': 'rgba(255, 255, 255, 0.1)',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
      className={cn(
        'absolute w-[calc(100%+var(--offset))] h-[var(--height)] left-[calc(var(--offset)/2*-1)]',
        'bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        'z-30 pointer-events-none',
        'dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]',
        className,
      )}
    ></div>
  );
};

const GridLineVertical = ({ className, offset }: { className?: string; offset?: string }) => {
  return (
    <div
      style={
        {
          '--background': '#000000',
          '--color': 'rgba(255, 255, 255, 0.1)',
          '--height': '5px',
          '--width': '1px',
          '--fade-stop': '95%',
          '--offset': offset || '150px',
          '--color-dark': 'rgba(255, 255, 255, 0.1)',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
      className={cn(
        'absolute h-[calc(100%+var(--offset))] w-[var(--width)] top-[calc(var(--offset)/2*-1)]',
        'bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        'z-30 pointer-events-none',
        'dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]',
        className,
      )}
    ></div>
  );
};
