'use client';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const FAQs = [
  {
    question: '這個網站的目的是什麼？',
    answer:
      '我們專注於提供最優質的機械鍵盤及相關配件，幫助您找到最適合的鍵盤產品，無論是辦公、遊戲還是日常使用。',
  },
  {
    question: '如何聯絡客服？',
    answer:
      '您可以透過電子郵件 support@keyboardshop.tw 或電話 02-1234-5678 聯絡我們的客服團隊。我們的服務時間為週一至週五上午 9 點至下午 6 點。',
  },
  {
    question: '如何挑選最適合的鍵盤？',
    answer:
      '您可以透過我們的搜尋功能或瀏覽不同類別來尋找合適的產品。我們提供詳細的產品規格、軸體介紹及使用建議，協助您做出最佳選擇。',
  },
  {
    question: '可以退換貨嗎？',
    answer:
      '可以的，我們提供購買後 30 天內的退換貨服務。商品須保持原包裝完整且未使用過的狀態。詳細退換貨政策請參考我們的服務條款。',
  },
  {
    question: '有提供國際配送服務嗎？',
    answer:
      '是的，我們提供台灣及部分亞洲國家的配送服務。運費及配送時間會依目的地而有所不同。詳細配送資訊請在結帳時確認。',
  },
  {
    question: '如何追蹤我的訂單？',
    answer:
      '您可以登入會員帳戶查看訂單狀態，或前往「我的訂單」頁面追蹤配送進度。商品出貨後，我們也會透過電子郵件提供物流追蹤號碼。',
  },
  {
    question: '什麼是機械軸？不同軸體有什麼差別？',
    answer:
      '機械軸是機械鍵盤的核心組件，決定按鍵的手感和聲音。常見的有紅軸（線性、安靜）、青軸（段落感、清脆聲）、茶軸（輕微段落感、適中聲音）、黑軸（線性、較重手感）等。我們建議您可以先到實體店面試打，或參考我們的軸體介紹頁面。',
  },
  {
    question: '鍵盤保固期間是多久？',
    answer:
      '我們所有機械鍵盤均提供一年保固服務，期間內如有非人為損壞的功能異常，我們將提供免費維修或更換服務。保固不包含正常磨損、人為損壞或改裝後的問題。',
  },
  {
    question: '鍵盤支援 Mac 系統嗎？',
    answer:
      '大部分機械鍵盤都支援 Mac 系統，但部分功能鍵可能需要調整。我們建議選購有 Mac 模式切換功能的鍵盤，或參考產品頁面的相容性說明。如有疑問，歡迎聯絡我們的客服團隊。',
  },
];
export default function SimpleFaqsWithBackground() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className='min-h-screen bg-black'>
      <div className='mx-auto grid w-full max-w-7xl gap-4 px-4 py-20 md:px-8 md:py-40'>
        <h2 className='text-center text-3xl font-bold tracking-tight text-neutral-800 md:text-4xl lg:text-5xl dark:text-neutral-100'>
          常見問題
        </h2>
        <p className='mx-auto max-w-2xl text-center text-lg leading-relaxed text-neutral-600 md:text-xl dark:text-neutral-300'>
          我們隨時為您解答任何疑問。如果您找不到所需的答案，請透過{' '}
          <a
            href='mailto:support@keyboardshop.tw'
            className='text-blue-600 font-medium underline hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300'
          >
            support@axis-keys.tw
          </a>{' '}
          聯絡我們。
        </p>
        <div className='mx-auto mt-10 w-full max-w-3xl'>
          {FAQs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              open={open}
              setOpen={setOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <div
      className='shadow-input mb-8 w-full cursor-pointer rounded-lg bg-white p-4 dark:bg-gray-900 border dark:border-gray-700'
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className='flex items-start'>
        <div className='relative mr-4 mt-1 h-6 w-6 flex-shrink-0'>
          <IconChevronUp
            className={cn(
              'absolute inset-0 h-6 w-6 transform text-black transition-all duration-200 dark:text-white',
              isOpen && 'rotate-90 scale-0',
            )}
          />
          <IconChevronDown
            className={cn(
              'absolute inset-0 h-6 w-6 rotate-90 scale-0 transform text-black transition-all duration-200 dark:text-white',
              isOpen && 'rotate-0 scale-100',
            )}
          />
        </div>
        <div>
          <h3 className='text-xl font-semibold text-neutral-800 dark:text-neutral-100'>
            {question}
          </h3>
          <AnimatePresence mode='wait'>
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className='mt-3 overflow-hidden text-base leading-relaxed text-neutral-600 dark:text-neutral-300'
              >
                {answer.split('').map((line, index) => (
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeOut',
                      delay: index * 0.005,
                    }}
                    key={index}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
