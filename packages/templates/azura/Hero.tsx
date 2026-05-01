'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  content?: {
    heroTitle?: string;
    heroDescription?: string;
    heroImage?: string;
  };
}

export default function Hero({content}: HeroProps) {
  const title = content?.heroTitle || "Bringing the energy to every dancefloor.";
  const description = content?.heroDescription || "Afrobeat, Amapiano, and Deep House specialist. Creating unforgettable rhythmic experiences across Africa and beyond.";
  const image = content?.heroImage || "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="bg-[#f0f0f0] py-[80px]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[80px] grid grid-cols-1 md:grid-cols-2 gap-[65px] items-center">
        <motion.div
          initial={{opacity: 0, x: -40}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
          className="flex flex-col gap-[30px]">
          <div className="bg-white rounded-[12px] px-[16px] py-[8px] flex items-center gap-[8px] w-fit">
            <motion.span
              animate={{scale: [1, 1.3, 1], opacity: [1, 0.6, 1]}}
              transition={{duration: 1.6, repeat: Infinity}}
              className="w-2 h-2 bg-[var(--primary)] rounded-[4px]"
            />
            <span className="text-[14px] text-[#787878] tracking-wide font-sans">
              AVAILABLE FOR BOOKING
            </span>
          </div>

          <h1 className="text-[#0f0f0f] font-bold text-5xl lg:text-[70px] leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-[#787878] text-[18px] max-w-[523px] font-sans leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-[16px]">
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: '0 10px 30px rgba(var(--primary-rgb),0.35)',
              }}
              whileTap={{scale: 0.97}}
              className="bg-[var(--primary)] text-white px-[30px] py-[16px] rounded-[16px] text-[18px] font-semibold">
              Book The DJ
            </motion.button>
            <motion.button
              whileHover={{scale: 1.03}}
              whileTap={{scale: 0.97}}
              className="bg-[#ddd] text-[#0f0f0f] px-[30px] py-[16px] rounded-[16px] text-[18px] font-semibold">
              Listen to Mixes
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0, scale: 0.9, x: 40}}
          animate={{opacity: 1, scale: 1, x: 0}}
          transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
          className="relative h-[400px] lg:h-[630px] w-full overflow-hidden rounded-[24px]">
          <Image
            src={image}
            alt="DJ Hero"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}

