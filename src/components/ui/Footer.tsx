'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';

// 可收合區塊元件（行動裝置用）
const CollapsibleSection = ({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className='flex justify-start space-y-4 flex-col w-full text-center'>
      {/* 行動裝置可收合標題 */}
      <button
        onClick={onToggle}
        className='sm:hidden flex items-center justify-between w-full transition-colors hover:text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold'
        aria-expanded={isExpanded}
        aria-controls={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span>{title}</span>
        {isExpanded ? (
          <IconChevronUp size={20} className='transition-transform duration-200' />
        ) : (
          <IconChevronDown size={20} className='transition-transform duration-200' />
        )}
      </button>

      {/* 桌面版靜態標題 */}
      <p className='hidden sm:block transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold'>
        {title}
      </p>

      {/* 內容區塊 */}
      <div
        id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`
          sm:block overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 sm:max-h-none sm:opacity-100'}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export function SimpleFooterWithFourGrids() {
  // 行動裝置下控制各區塊展開的狀態
  const [expandedSections, setExpandedSections] = useState({
    customerService: false,
    socials: false,
    legals: false,
    signups: false,
  });
  //  切換指定區塊的展開收合狀態，保持其他區塊狀態不變
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const customerService = [
    {
      title: '聯絡我們',
      href: '/contact',
    },
    {
      title: '常見問題',
      href: '/faq',
    },
    {
      title: '線上客服',
      href: '/',
    },
    {
      title: '運送資訊',
      href: '/',
    },
    {
      title: '售後服務',
      href: '/',
    },
  ];

  const socials = [
    {
      title: 'Facebook',
      href: '/',
      icon: IconBrandFacebook,
    },
    {
      title: 'Instagram',
      href: '/',
      icon: IconBrandInstagram,
    },
    {
      title: 'Twitter',
      href: '/',
      icon: IconBrandTwitter,
    },
    {
      title: 'LinkedIn',
      href: '/',
      icon: IconBrandLinkedin,
    },
  ];
  const legals = [
    {
      title: '隱私權政策',
      href: '/',
    },
    {
      title: '服務條款',
      href: '/',
    },
    {
      title: '退換貨政策',
      href: '/',
    },
  ];

  const signups = [
    {
      title: '會員註冊',
      href: '/',
    },
    {
      title: '會員登入',
      href: '/',
    },
    {
      title: '忘記密碼',
      href: '/',
    },
  ];
  return (
    <div className='border-t border-neutral-100 dark:border-white/[0.1] px-8 py-20 bg-white dark:bg-black w-full relative overflow-hidden'>
      <div className='max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-center items-start md:px-8 pr-8 gap-8'>
        <div className='text-left sm:-ml-8 md:-ml-12 lg:-ml-16'>
          <div className='mr-0 flex justify-start mb-4 sm:-ml-4'>
            <Logo />
          </div>

          <div className='mt-2 sm:-ml-4'>&copy; 2025 Axis Keys 軸心鍵界 版權所有</div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 items-start mt-10 sm:mt-0 md:mt-0'>
          <CollapsibleSection
            title='客戶服務'
            isExpanded={expandedSections.customerService}
            onToggle={() => toggleSection('customerService')}
          >
            <ul className='transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-6'>
              {customerService.map((service, idx) => (
                <li key={`service${idx}`} className='list-none'>
                  <Link
                    className='transition-colors hover:text-text-neutral-800 '
                    href={service.href}
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection
            title='社群媒體'
            isExpanded={expandedSections.socials}
            onToggle={() => toggleSection('socials')}
          >
            <div className='flex flex-col space-y-6 items-center'>
              {socials.map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={`social${idx}`}
                    className='transition-colors hover:text-neutral-800 text-neutral-600 dark:text-neutral-300 dark:hover:text-white'
                    href={social.href}
                    title={social.title}
                    aria-label={social.title}
                  >
                    <IconComponent size={20} />
                  </Link>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title='服務政策'
            isExpanded={expandedSections.legals}
            onToggle={() => toggleSection('legals')}
          >
            <ul className='transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-6'>
              {legals.map((legal, idx) => (
                <li key={`legal${idx}`} className='list-none'>
                  <Link
                    className='transition-colors hover:text-text-neutral-800 '
                    href={legal.href}
                  >
                    {legal.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection
            title='會員中心'
            isExpanded={expandedSections.signups}
            onToggle={() => toggleSection('signups')}
          >
            <ul className='transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-6'>
              {signups.map((auth, idx) => (
                <li key={`auth${idx}`} className='list-none'>
                  <Link className='transition-colors hover:text-text-neutral-800 ' href={auth.href}>
                    {auth.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        </div>
      </div>
      <p className='text-center mt-20 text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-900 to-neutral-200 dark:to-neutral-700 inset-x-0'>
        Axis Keys
      </p>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href='/'
      className='font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20'
    >
      <div className='relative flex h-10 w-10 items-center justify-center'>
        <div className='absolute inset-0 rounded-lg bg-gradient-to-b from-gray-300 to-gray-500 shadow-lg dark:from-gray-600 dark:to-gray-800'></div>
        <div className='absolute inset-1 rounded-md bg-gradient-to-b from-white to-gray-100 dark:from-gray-700 dark:to-gray-900'></div>
        <span className='relative z-10 font-bold text-gray-800 dark:text-white'>AK</span>
      </div>
      <span className='font-medium text-lg text-black dark:text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text transition-all duration-300'>
        Axis Keys
      </span>
    </Link>
  );
};
