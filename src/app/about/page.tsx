'use client';

import { motion } from 'motion/react';
import {
  IconSettings,
  IconHeart,
  IconRocket,
  IconTarget,
  IconUsers,
  IconStar,
} from '@tabler/icons-react';
import { Timeline } from '@/components/ui/timeline';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

// Hero Section Component
const HeroSection = () => {
  return (
    <div className='relative overflow-hidden from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 py-24 pt-32'>
      <div className='absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]' />

      <div className='container mx-auto px-6 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center max-w-4xl mx-auto'
        >
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-b from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent mb-6'>
            關於 Axis Keys
          </h1>
          <p className='text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed text-left'>
            我們專注於提供頂級機械鍵盤與客製化服務，從嚴選零件到精細組裝，確保每一次敲擊都是享受。
            <br />
            無論是打字、遊戲或創作，都能找到最貼近您需求的配置與體驗。
          </p>
          <div className='flex flex-wrap justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-400'>
            <div className='flex items-center gap-2'>
              <IconStar className='h-5 w-5 text-yellow-500' />
              <span>2024年成立</span>
            </div>
            <div className='flex items-center gap-2'>
              <IconUsers className='h-5 w-5 text-blue-500' />
              <span>10,000+ 滿意客戶</span>
            </div>
            <div className='flex items-center gap-2'>
              <IconSettings className='h-5 w-5 text-green-500' />
              <span>500+ 鍵盤型號</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Mission & Vision Section
const MissionVisionSection = () => {
  const cards = [
    {
      icon: <IconTarget className='h-8 w-8' />,
      title: '我們的使命',
      description:
        '提供可長期信賴的機械鍵盤與客製化服務：從元件嚴選、專業調音到手工組裝，並提供 30 天無條件退換與一年保固，讓每位用戶都能擁有穩定且滿意的使用體驗。',
      gradient: 'from-slate-500/10 to-zinc-600/15 dark:from-slate-400/15 dark:to-zinc-500/20',
    },
    {
      icon: <IconRocket className='h-8 w-8' />,
      title: '我們的願景',
      description:
        '成為台灣與亞洲市場中，最受信賴的機械鍵盤專業平台：整合優質供應鏈、建立專業客服與教學資源，推動鍵盤文化與客製化生態系發展。',
      gradient: 'from-slate-500/10 to-zinc-600/15 dark:from-slate-400/15 dark:to-zinc-500/20',
    },
    {
      icon: <IconHeart className='h-8 w-8' />,
      title: '我們的價值',
      description:
        '以品質、透明與服務為核心：公開零件來源與測試流程、提供專業諮詢與售後支援，並持續聆聽社群回饋，打造長期值得信賴的產品與體驗。',
      gradient: 'from-slate-500/10 to-zinc-600/15 dark:from-slate-400/15 dark:to-zinc-500/20',
    },
  ];

  return (
    <div className='py-24 bg-white dark:bg-black'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-6'>
            我們的理念 — 品質、透明與服務
          </h2>
          <p className='text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-left'>
            我們從元件選擇、軸體調音到手工組裝皆堅持嚴格標準，所有產品均經逐項測試與品質檢驗。提供
            30 天無條件退換貨與 1
            年保固，並有專業客服與客製化諮詢，協助您找到最適合的配置；同時投入社群教育與在地維修支援，確保購買、使用與保養都無後顧之憂。
          </p>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className='group h-full'
            >
              <div
                className={`
                relative p-8 rounded-2xl bg-gradient-to-br ${card.gradient}
                border border-neutral-200 dark:border-neutral-800
                hover:shadow-xl transition-all duration-300
                hover:scale-105 hover:border-neutral-300 dark:hover:border-neutral-700
                h-full flex flex-col
              `}
              >
                <div className='mb-6 text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-100 transition-colors'>
                  {card.icon}
                </div>
                <h3 className='text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4'>
                  {card.title}
                </h3>
                <p className='text-neutral-600 dark:text-neutral-400 leading-relaxed text-left flex-1'>
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Company Story Section
const CompanyStorySection = () => {
  const timelineData = [
    {
      title: '2024',
      content: (
        <div>
          <h3 className='text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4'>
            Axis Keys 誕生
          </h3>
          <p className='text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed'>
            憑藉對機械鍵盤的熱愛，我們創立了 Axis Keys，致力於為台灣用戶提供最優質的機械鍵盤選擇。
            從一個簡單的想法開始，我們希望為每位鍵盤愛好者創造完美的輸入體驗。
          </p>
        </div>
      ),
    },
    {
      title: '2024 Q2',
      content: (
        <div>
          <h3 className='text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4'>
            產品線擴展
          </h3>
          <p className='text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed'>
            與多家知名機械鍵盤品牌建立合作關係，為客戶提供更多元化的選擇。
            我們精心挑選每一個合作夥伴，確保產品品質符合我們的高標準。
          </p>
        </div>
      ),
    },
    {
      title: '2024 Q3',
      content: (
        <div>
          <h3 className='text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4'>
            社群建立
          </h3>
          <p className='text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed'>
            建立機械鍵盤愛好者社群，分享經驗、評測和定制方案。
            透過社群互動，我們更了解用戶需求，並持續改善我們的服務。
          </p>
        </div>
      ),
    },
    {
      title: '未來',
      content: (
        <div>
          <h3 className='text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4'>
            持續創新
          </h3>
          <p className='text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed'>
            計劃推出自有品牌產品，並擴展至亞洲其他市場。
            我們將持續投入研發，為機械鍵盤愛好者帶來更多創新產品和服務。
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className='py-24 bg-white dark:bg-black'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-8'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-6'>
            發展里程碑
          </h2>
          <p className='text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-left'>
            記錄我們從初創至今的實際發展歷程，包括建立供應鏈合作、擴展產品選項，以及逐步建立客戶基礎的過程。
          </p>
        </motion.div>
      </div>
      <Timeline data={timelineData} />
    </div>
  );
};

// Team Section
const TeamSection = () => {
  const teamCards = [
    {
      quote:
        '從小就是鍵盤迷，投入機械鍵盤設計與市場經營。創辦 Axis Keys 以來，推動本地客製化與高品質供應鏈，目標讓每位用戶都能找到理想的輸入工具。',
      name: '陳建明',
      title: '創辦人・執行長',
    },
    {
      quote:
        '專注於前端與產品工程，帶領工程團隊打造快速且穩定的購物與客製化體驗。以資料驅動產品決策，追求極致使用者體驗。',
      name: '李雅文',
      title: '技術長 (CTO)',
    },
    {
      quote:
        '專精於前端開發與使用者介面設計，負責構建互動豐富且響應迅速的客戶端介面，確保跨裝置一致性與良好可訪問性。',
      name: '陳怡君',
      title: '前端工程師',
    },
    {
      quote:
        '負責產品策略與供應鏈管理，深入市場與社群調研，篩選最合適的品牌與零件，確保每一款上架商品都符合品質標準。',
      name: '王志強',
      title: '產品經理',
    },
    {
      quote:
        '掌管營運與客服流程，建立退換貨與品質檢驗機制，確保從下單到收貨每一步都順暢，提升顧客滿意度。',
      name: '劉佩芳',
      title: '營運長',
    },
    {
      quote: '熱衷社群經營與內容創作，負責社群活動、教學與直播，連結鍵盤愛好者並推動交流與共創。',
      name: '張明翰',
      title: '社群與行銷經理',
    },
    {
      quote:
        '負責後端系統與 API 設計，確保資料一致性與系統可擴展性。專注於資料庫、認證與高可用性架構，讓前端與使用者體驗穩定且安全。',
      name: '吳志明',
      title: '後端工程師 / 系統架構師',
    },
  ];

  return (
    <div className='py-24 bg-white dark:bg-black'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-6'>
            我們的團隊
          </h2>
          <p className='text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-left'>
            一個涵蓋技術、產品、營運與社群的 7
            人小團隊，結合工程背景與鍵盤使用經驗，專注於建立可信賴的購買與客製化服務流程
          </p>
        </motion.div>

        <InfiniteMovingCards
          items={teamCards}
          direction='right'
          speed='slow'
          pauseOnHover={true}
          className='mx-auto'
        />
      </div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <MissionVisionSection />
      <CompanyStorySection />
      <TeamSection />
    </div>
  );
}
