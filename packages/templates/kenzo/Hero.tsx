'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  content?: {
    hero: {
      heroTitle?: string;
      heroDescription?: string;
      heroImage?: string;
      badgeText?: string;
    };
  };
}

export default function Hero({content}: HeroProps) {
  const title = content?.hero?.heroTitle || 'Feel the Energy.\nOwn the Night.';
  const description =
    content?.hero?.heroDescription ||
    'International DJ and producer bringing the best of Afro-fusion, Amapiano, and Deep House to stages worldwide.';
  const image = '/theme/kenzo/kenzo-hero.png';
  // const image = content?.hero?.heroImage || '/theme/kenzo/kenzo-hero.png';
  const badgeText = content?.hero?.badgeText || 'AVAILABLE FOR BOOKING';

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt="Hero Background"
          fill
          priority
          className="object-cover object-[70%_center] md:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 lg:px-12 pt-[100px] md:pt-0">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
          className="flex flex-col gap-[24px] max-w-[650px]">
          <div className="inline-flex items-center gap-[8px] border border-white/20 bg-black/30 backdrop-blur-md rounded-full px-[16px] py-[8px] w-fit">
            <motion.span
              animate={{opacity: [1, 0.4, 1]}}
              transition={{duration: 2, repeat: Infinity}}
              className="w-1.5 h-1.5 rounded-full bg-[#10b981]"
            />
            <span className="text-[11px] md:text-[12px] font-medium tracking-wider text-gray-300 uppercase">
              Available for Booking
            </span>
          </div>

          <h1 className="text-white font-bold text-[52px] md:text-[64px] lg:text-[76px] leading-[1.1] tracking-tight whitespace-pre-line">
            {title}
          </h1>

          <p className="text-gray-300 text-[16px] md:text-[18px] leading-relaxed max-w-[500px]">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-[16px] mt-4">
            <motion.button
              whileHover={{scale: 1.03}}
              whileTap={{scale: 0.97}}
              className="bg-[var(--primary)] text-white px-8 py-3.5 rounded-[12px] text-[16px] font-semibold transition-shadow">
              Book The DJ
            </motion.button>
            <motion.button
              whileHover={{scale: 1.03}}
              whileTap={{scale: 0.97}}
              className="bg-white text-black px-8 py-3.5 rounded-[12px] text-[16px] font-semibold transition-shadow">
              Listen to Mixes
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
