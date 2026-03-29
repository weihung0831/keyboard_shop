'use client';
import React, { useState, useEffect } from 'react';
import { IconMailFilled } from '@tabler/icons-react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'motion/react';
import api from '@/lib/api';
import type { AxiosError } from 'axios';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface ValidationErrors {
  name?: string[];
  email?: string[];
  company?: string[];
  message?: string[];
}

export default function ContactFormGridWithDetails() {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');

  const set = (field: keyof ContactFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // 清除該欄位的錯誤
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError('');

    try {
      await api.post('/contact', {
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        message: form.message,
      });

      setSuccess(true);
      setForm({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; errors?: ValidationErrors }>;
      if (axiosError.response?.status === 422) {
        setErrors(axiosError.response.data?.errors ?? {});
      } else {
        setGeneralError(axiosError.response?.data?.message ?? '送出失敗，請稍後再試');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-black'>
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 pt-20 pb-10 md:px-6 md:pt-32 md:pb-20 lg:grid-cols-2'>
        <div className='relative flex flex-col items-center overflow-hidden lg:items-start'>
          <div className='flex items-start justify-start'>
            <FeatureIconContainer className='flex items-center justify-center overflow-hidden'>
              <IconMailFilled className='h-6 w-6 text-blue-500' />
            </FeatureIconContainer>
          </div>
          <h2 className='mt-9 bg-gradient-to-b from-neutral-800 to-neutral-900 bg-clip-text text-left text-xl font-bold text-transparent md:text-3xl lg:text-5xl dark:from-neutral-200 dark:to-neutral-300'>
            聯絡我們
          </h2>
          <p className='mt-8 max-w-lg text-center text-base text-neutral-600 md:text-left dark:text-neutral-400'>
            我們一直致力於提升產品與服務品質。歡迎聯絡我們，讓我們知道如何協助您。
          </p>

          <div className='mt-10 hidden flex-col items-center gap-4 md:flex-row lg:flex'>
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>contact@axis-keys.tw</p>

            <div className='h-1 w-1 rounded-full bg-neutral-500 dark:bg-neutral-400' />
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>(02) 2345-6789</p>
            <div className='h-1 w-1 rounded-full bg-neutral-500 dark:bg-neutral-400' />

            <p className='text-sm text-neutral-500 dark:text-neutral-400'>support@axis-keys.tw</p>
          </div>
          <div className='div relative mt-20 flex w-[600px] flex-shrink-0 -translate-x-10 items-center justify-center [perspective:800px] [transform-style:preserve-3d] sm:-translate-x-0 lg:-translate-x-32'>
            <Pin className='top-20 right-7' />

            <Image
              src='/world.svg'
              width={500}
              height={500}
              alt='world map'
              priority
              className='[transform:rotateX(45deg)_translateZ(0px)] dark:invert dark:filter'
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
        <div className='relative mx-auto flex w-full max-w-2xl flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-b from-gray-100 to-gray-200 p-4 sm:p-10 dark:from-neutral-900 dark:to-neutral-950'>
          <Grid size={20} />

          {/* 成功 Toast */}
          {success && (
            <div className='fixed bottom-6 right-6 z-50 rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm text-green-400 shadow-lg backdrop-blur-sm'>
              感謝您的留言，我們會盡快回覆！
            </div>
          )}

          {/* 一般錯誤 */}
          {generalError && (
            <div className='relative z-20 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className='relative z-20 w-full space-y-4'>
            <div className='mb-4 w-full'>
              <label
                className='mb-2 inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300'
                htmlFor='name'
              >
                姓名
              </label>
              <input
                id='name'
                type='text'
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder='請輸入您的姓名'
                className='shadow-input h-10 w-full rounded-md border border-transparent bg-white pl-4 text-sm text-neutral-700 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white'
              />
              {errors.name && <p className='mt-1 text-xs text-red-400'>{errors.name[0]}</p>}
            </div>
            <div className='mb-4 w-full'>
              <label
                className='mb-2 inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300'
                htmlFor='email'
              >
                電子郵件
              </label>
              <input
                id='email'
                type='email'
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder='請輸入您的電子郵件'
                className='shadow-input h-10 w-full rounded-md border border-transparent bg-white pl-4 text-sm text-neutral-700 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white'
              />
              {errors.email && <p className='mt-1 text-xs text-red-400'>{errors.email[0]}</p>}
            </div>
            <div className='mb-4 w-full'>
              <label
                className='mb-2 inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300'
                htmlFor='company'
              >
                公司名稱
              </label>
              <input
                id='company'
                type='text'
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder='請輸入您的公司名稱'
                className='shadow-input h-10 w-full rounded-md border border-transparent bg-white pl-4 text-sm text-neutral-700 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white'
              />
              {errors.company && <p className='mt-1 text-xs text-red-400'>{errors.company[0]}</p>}
            </div>
            <div className='mb-4 w-full'>
              <label
                className='mb-2 inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300'
                htmlFor='message'
              >
                留言內容
              </label>
              <textarea
                id='message'
                rows={5}
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder='請輸入您的留言內容'
                className='shadow-input w-full rounded-md border border-transparent bg-white pt-4 pl-4 text-sm text-neutral-700 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white'
              />
              {errors.message && <p className='mt-1 text-xs text-red-400'>{errors.message[0]}</p>}
            </div>
            <button
              type='submit'
              disabled={submitting}
              className='relative z-10 flex items-center justify-center rounded-md border border-transparent bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-[0px_1px_0px_0px_#FFFFFF20_inset] transition duration-200 hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 md:text-sm'
            >
              {submitting ? '送出中...' : '送出'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const Pin = ({ className }: { className?: string }) => {
  return (
    <motion.div
      style={{ transform: 'translateZ(1px)' }}
      className={cn(
        'pointer-events-none absolute z-[60] flex h-40 w-96 items-center justify-center opacity-100 transition duration-500',
        className,
      )}
    >
      <div className='h-full w-full'>
        <div className='absolute inset-x-0 top-0 z-20 mx-auto inline-block w-fit rounded-lg bg-neutral-200 px-2 py-1 text-xs font-normal text-neutral-700 dark:bg-neutral-800 dark:text-white'>
          我們在這裡
          <span className='absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-blue-400/0 transition-opacity duration-500'></span>
        </div>

        <div
          style={{
            perspective: '800px',
            transform: 'rotateX(70deg) translateZ(0px)',
          }}
          className='absolute top-1/2 left-1/2 mt-4 ml-[0.09375rem] -translate-x-1/2 -translate-y-1/2'
        >
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 0 }}
              className='absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] dark:bg-sky-500/[0.2]'
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              className='absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] dark:bg-sky-500/[0.2]'
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 4 }}
              className='absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] dark:bg-sky-500/[0.2]'
            ></motion.div>
          </>
        </div>

        <>
          <motion.div className='absolute right-1/2 bottom-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-blue-500 blur-[2px]' />
          <motion.div className='absolute right-1/2 bottom-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-blue-500' />
          <motion.div className='absolute right-1/2 bottom-1/2 z-40 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-blue-600 blur-[3px]' />
          <motion.div className='absolute right-1/2 bottom-1/2 z-40 h-[2px] w-[2px] translate-x-[0.5px] translate-y-[14px] rounded-full bg-blue-300' />
        </>
      </div>
    </motion.div>
  );
};

const FeatureIconContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative h-14 w-14 rounded-md bg-gradient-to-b from-gray-50 to-neutral-200 p-[4px] dark:from-neutral-800 dark:to-neutral-950',
        className,
      )}
    >
      <div
        className={cn(
          'relative z-20 h-full w-full rounded-[5px] bg-gray-50 dark:bg-neutral-800',
          className,
        )}
      >
        {children}
      </div>
      <div className='absolute inset-x-0 bottom-0 z-30 mx-auto h-4 w-full rounded-full bg-neutral-600 opacity-50 blur-lg'></div>
      <div className='absolute inset-x-0 bottom-0 mx-auto h-px w-[60%] bg-gradient-to-r from-transparent via-blue-500 to-transparent'></div>
      <div className='absolute inset-x-0 bottom-0 mx-auto h-px w-[60%] bg-gradient-to-r from-transparent via-blue-600 to-transparent dark:h-[8px] dark:blur-sm'></div>
    </div>
  );
};

const Grid = ({ pattern, size }: { pattern?: [number, number][]; size?: number }) => {
  const [isClient, setIsClient] = useState(false);
  const [clientPattern, setClientPattern] = useState<[number, number][]>([]);

  // 預設的固定模式，避免 hydration 錯誤
  const defaultPattern: [number, number][] = [
    [8, 3],
    [9, 2],
    [7, 4],
    [10, 1],
    [8, 5],
  ];

  useEffect(() => {
    // 只在客戶端執行隨機生成
    setIsClient(true);
    if (!pattern) {
      const randomPattern: [number, number][] = [
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
      ];
      setClientPattern(randomPattern);
    }
  }, [pattern]);

  // 使用提供的 pattern，或在客戶端使用隨機生成的，否則使用預設固定模式
  const p = pattern ?? (isClient ? clientPattern : defaultPattern);
  return (
    <div className='pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]'>
      <div className='absolute inset-0 bg-gradient-to-r from-zinc-900/30 to-zinc-900/30 opacity-10 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 dark:to-zinc-900/30'>
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x='-12'
          y='4'
          squares={p}
          className='absolute inset-0 h-full w-full fill-black/100 stroke-black/100 mix-blend-overlay dark:fill-white/100 dark:stroke-white/100'
        />
      </div>
    </div>
  );
};

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: {
  width: number;
  height: number;
  x: string | number;
  y: string | number;
  squares: [number, number][];
  [key: string]: unknown;
}) {
  const patternId = useId();

  return (
    <svg aria-hidden='true' {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits='userSpaceOnUse'
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill='none' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className='overflow-visible'>
          {squares.map(([x, y], idx: number) => (
            <rect
              strokeWidth='0'
              key={`${x}-${y}-${idx}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
