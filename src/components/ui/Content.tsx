'use client';

import { motion } from 'motion/react';
import {
  IconArrowRight,
  IconShoppingCart,
  IconStar,
  IconChevronDown,
  IconKeyboard,
  IconWifi,
  IconPhone,
  IconMail,
  IconMapPin,
} from '@tabler/icons-react';
import Link from 'next/link';
import { InfiniteMovingCards } from './infinite-moving-cards';
import { CTAWithDashedGridLines } from '@/components/ui/CTAWithDashedGridLines';
import productsData from '@/data/products.json';

// 主視覺區塊組件 - 鍵盤商店首頁的核心展示區域
const HeroSection = () => {
  return (
    <div className='relative min-h-[50vh] bg-black overflow-hidden'>
      {/* 背景動態效果 */}
      <div className='absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]' />
      {/* 移除彩色漸層覆蓋以保持純淨黑色背景 */}

      <div className='relative z-10 container mx-auto px-4 pt-20 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* 左側內容區域 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-8'
          >
            {/* 品牌標語 */}
            <div className='space-y-4'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30'
              >
                <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
                <span className='text-purple-300 text-sm font-medium'>
                  Axis Keys - 台灣首選機械鍵盤專家
                </span>
              </motion.div>

              <h1 className='text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight'>
                <span className='whitespace-nowrap'>
                  <span className='inline-block'>打造你的</span>
                  <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse inline-block'>
                    完美
                  </span>
                  <span className='inline-block'>打字體驗</span>
                </span>
              </h1>

              <p className='text-xl text-gray-300 leading-relaxed max-w-lg'>
                從入門到專業，從辦公到電競，我們提供最優質的機械鍵盤產品，讓每一次按鍵都成為享受。
              </p>
            </div>

            {/* 統計數據 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='grid grid-cols-3 gap-6'
            >
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>1000+</div>
                <div className='text-gray-400 text-sm'>滿意客戶</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>50+</div>
                <div className='text-gray-400 text-sm'>精選品牌</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>24/7</div>
                <div className='text-gray-400 text-sm'>客戶服務</div>
              </div>
            </motion.div>

            {/* 行動按鈕組 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className='flex flex-col sm:flex-row gap-4'
            >
              <Link href='/products'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25'
                >
                  <IconShoppingCart size={20} />
                  立即購買
                  <IconArrowRight
                    size={16}
                    className='group-hover:translate-x-1 transition-transform'
                  />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }
                className='w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-gray-600 text-gray-300 font-medium rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-300'
              >
                了解更多
                <IconChevronDown size={16} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// 精選產品展示區塊 - 使用實際產品數據
const FeaturedProducts = () => {
  // 從實際產品數據中選取精選商品（前6個產品）
  const featuredProducts = productsData.slice(0, 6);

  return (
    <section className='py-12 md:py-16 lg:py-20 bg-black'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-12 md:mb-16'
        >
          <h2 className='text-4xl lg:text-5xl font-bold text-white mb-4'>精選商品</h2>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
            嚴選最受歡迎的機械鍵盤，品質與性能的完美結合
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {featuredProducts.map((product, index) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className='group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-gray-600/80 hover:shadow-xl hover:shadow-purple-500/10 h-[480px] flex flex-col'
              >
                {/* 產品圖片區域 */}
                <div className='relative h-48 overflow-hidden bg-gray-800 flex-shrink-0'>
                  <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10'></div>
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    whileHover={{ scale: 1.1 }}
                  />

                  {/* 庫存狀態標籤 */}
                  <div className='absolute top-4 left-4 z-20'>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.inStock
                          ? 'bg-green-500/80 text-white border border-green-400'
                          : 'bg-red-500/80 text-white border border-red-400'
                      }`}
                    >
                      {product.inStock ? '現貨供應' : '缺貨中'}
                    </div>
                  </div>

                  {/* 分類標籤 */}
                  <div className='absolute top-4 right-4 z-20'>
                    <div className='px-3 py-1 bg-purple-500/80 border border-purple-400 rounded-full'>
                      <span className='text-white text-xs font-medium'>{product.category}</span>
                    </div>
                  </div>
                </div>

                {/* 產品資訊區域 */}
                <div className='relative z-10 p-6 flex flex-col flex-grow'>
                  {/* 產品名稱 - 固定高度 */}
                  <div className='h-14 flex items-start mb-2'>
                    <h3 className='text-xl font-bold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300'>
                      {product.name}
                    </h3>
                  </div>

                  {/* 產品描述 - 固定高度 */}
                  <div className='h-10 flex items-start mb-4'>
                    <p className='text-gray-400 text-sm leading-relaxed line-clamp-2'>
                      {product.description}
                    </p>
                  </div>

                  {/* 產品規格 - 固定高度 */}
                  <div className='h-6 flex items-center gap-4 mb-4 text-sm text-gray-300'>
                    <div className='flex items-center gap-1'>
                      <IconKeyboard size={16} />
                      <span>{product.layout}</span>
                    </div>
                    {product.wireless && (
                      <div className='flex items-center gap-1'>
                        <IconWifi size={16} />
                        <span>無線</span>
                      </div>
                    )}
                  </div>

                  {/* 特色功能標籤 - 固定高度 */}
                  <div className='h-8 flex items-start mb-4'>
                    <div className='flex flex-wrap gap-1'>
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-1 text-xs bg-gray-800/60 text-gray-300 rounded-md border border-gray-700/50 group-hover:bg-gray-700/60 group-hover:border-gray-600/50 transition-colors duration-300'
                        >
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 2 && (
                        <span className='px-2 py-1 text-xs text-gray-400'>
                          +{product.features.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 彈性空間 - 推送底部內容 */}
                  <div className='flex-grow'></div>

                  {/* 底部價格和購買按鈕 - 固定在底部 */}
                  <div className='flex items-center justify-between mt-auto'>
                    <div>
                      <div className='text-2xl font-bold text-white'>
                        NT${product.price.toLocaleString()}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300'
                    >
                      <IconShoppingCart size={16} />
                      立即購買
                    </motion.div>
                  </div>
                </div>

                {/* 懸浮時的發光效果 */}
                <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500'></div>
                <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 查看更多按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='text-center mt-12'
        >
          <Link href='/products'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='group inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 font-medium rounded-xl hover:border-purple-500 hover:text-white transition-all duration-300'
            >
              查看全部商品
              <IconArrowRight
                size={20}
                className='group-hover:translate-x-1 transition-transform'
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// 客戶評價展示區塊 - 使用無限滾動卡片
const CustomerReviews = () => {
  const testimonials = [
    {
      quote:
        '這款鍵盤的手感真的太棒了！Cherry MX 藍軸的回饋感非常清脆，RGB 燈效也很漂亮，工作和遊戲都很適合。客服態度也很好，解決了我所有的疑問。',
      name: '王小明',
      title: '軟體工程師 • RGB 電競機械鍵盤',
    },
    {
      quote:
        '辦公使用非常安靜，Cherry MX 靜音軸真的很棒！同事都誇讚我的打字聲音很優雅，工作效率也提升了很多。包裝精美，品質很好。',
      name: '李美麗',
      title: '產品經理 • Cherry MX 靜音軸鍵盤',
    },
    {
      quote:
        '電競比賽必備神器！延遲極低，按鍵回饋感很好，1ms 響應時間讓我在遊戲中佔盡優勢。RGB 燈效超酷炫，朋友們都很羨慕。',
      name: '張遊戲王',
      title: '職業電競選手 • 競技版機械鍵盤',
    },
    {
      quote:
        '無線連接非常穩定，沒有任何延遲問題。電池續航力很持久，使用了一個月才需要充電。整潔的桌面讓我工作更專注。',
      name: '陳設計師',
      title: 'UI/UX 設計師 • 無線藍牙機械鍵盤',
    },
    {
      quote:
        '從下單到收貨只花了一天時間，包裝非常用心。鍵盤的做工精細，每個按鍵都很平滑。客服回應迅速，售後服務讓人放心。',
      name: '林程式員',
      title: '全端開發者 • 辦公靜音鍵盤',
    },
  ];

  return (
    <section className='py-8 md:py-12 lg:py-16 overflow-hidden'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl lg:text-5xl font-bold text-white mb-4'>客戶真實評價</h2>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
            聆聽來自全台各地用戶的真實使用感受與推薦
          </p>
        </motion.div>

        {/* 無限滾動評價卡片 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className='relative'
        >
          <InfiniteMovingCards
            items={testimonials}
            direction='right'
            speed='slow'
            pauseOnHover={true}
            className='mb-8'
          />
        </motion.div>

        {/* 統計數據 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16'
        >
          <div className='text-center'>
            <div className='text-4xl lg:text-5xl font-bold text-purple-400 mb-2'>4.9</div>
            <div className='flex justify-center mb-2'>
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} size={20} className='text-yellow-400 fill-current' />
              ))}
            </div>
            <div className='text-gray-400 text-sm'>平均評分</div>
          </div>

          <div className='text-center'>
            <div className='text-4xl lg:text-5xl font-bold text-purple-400 mb-2'>1000+</div>
            <div className='text-gray-400 text-sm'>滿意客戶</div>
          </div>

          <div className='text-center'>
            <div className='text-4xl lg:text-5xl font-bold text-purple-400 mb-2'>98%</div>
            <div className='text-gray-400 text-sm'>回購率</div>
          </div>

          <div className='text-center'>
            <div className='text-4xl lg:text-5xl font-bold text-purple-400 mb-2'>24h</div>
            <div className='text-gray-400 text-sm'>快速出貨</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 聯絡資訊快速訪問區塊
const QuickContact = () => {
  const contactInfo = [
    {
      icon: IconPhone,
      title: '客服電話',
      info: '0800-123-456',
      description: '週一至週六 9:00-21:00',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: IconMail,
      title: '電子信箱',
      info: 'support@axiskeys.tw',
      description: '24小時內回覆',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: IconMapPin,
      title: '實體門市',
      info: '台北市信義區松仁路123號',
      description: '歡迎現場體驗',
      color: 'from-purple-500 to-violet-500',
    },
  ];

  return (
    <section className='py-16 border-t border-white/20'>
      <div className='container mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-6'>
          {contactInfo.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300'
            >
              <div className='flex items-center gap-4'>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${contact.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <contact.icon size={24} className='text-white' />
                </div>
                <div className='flex-1'>
                  <h4 className='text-lg font-semibold text-white mb-1'>{contact.title}</h4>
                  <p className='text-white font-medium'>{contact.info}</p>
                  <p className='text-sm text-gray-400'>{contact.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 主內容組件
export default function Content() {
  return (
    <div className='min-h-screen bg-black'>
      <HeroSection />
      <FeaturedProducts />
      <CustomerReviews />
      <CTAWithDashedGridLines />
      <QuickContact />
    </div>
  );
}
