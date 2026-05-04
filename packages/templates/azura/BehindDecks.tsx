'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import {fadeUp} from './constants';

export default function BehindDecks({content}: any) {
  const tags = content?.tags || [
    'Afrobeat',
    'Amapiano',
    'Deep House',
    'Gqom',
    'Afro-Tech',
  ];
  const image = content?.behindDecksImage || '/theme/aura/decks.png';

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{once: true, amount: 0.15}}
      variants={{show: {transition: {staggerChildren: 0.08}}}}
      className="bg-[#fbfbfb] py-8 lg:py-[120px]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[80px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[80px] items-center">
        <motion.div
          variants={fadeUp}
          className="relative w-full aspect-square max-w-[500px] mx-auto">
          <div className="absolute inset-[15%_0_0_15%] bg-[#f0f0f0] rounded-[16px]" />
          <div className="relative w-[90%] h-[90%]">
            <motion.div
              whileHover={{scale: 1.02}}
              transition={{duration: 0.4}}
              className="w-full h-full relative">
              <Image
                src={image}
                alt="Behind the decks"
                fill
                className="object-cover rounded-[16px] shadow-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-[30px]">
          <h2 className="text-[#0f0f0f] font-bold text-[40px] leading-[48px]">
            Behind the Decks
          </h2>
          <p className="text-[#787878] text-[18px] leading-relaxed font-sans">
            With over 8 years of experience rocking crowds from Nairobi to
            Lagos, DJ Aura blends traditional African rhythms with modern
            electronic beats. Known for high-energy sets and seamless
            transitions, she transforms any event into an immersive sonic
            journey.
          </p>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[#787878] text-[16px] tracking-wide font-semibold font-sans uppercase">
              SIGNATURE SOUNDS
            </p>
            <div className="flex flex-wrap gap-[12px]">
              {tags.map((t: string, i: number) => (
                <motion.span
                  key={t}
                  initial={{opacity: 0, y: 10}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{delay: 0.1 + i * 0.06}}
                  whileHover={{y: -2}}
                  className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-[12px] px-[17px] py-[9px] text-[14px] text-[#0f0f0f] font-medium font-sans">
                  {t}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[30px] pt-[31px] border-t border-[#c3c3c3]">
            {[
              {v: '350+', l: 'Events Played'},
              {v: '15', l: 'Cities Toured'},
            ].map((s) => (
              <div key={s.l}>
                <div className="text-[var(--primary)] font-bold text-[40px] leading-[48px]">
                  {s.v}
                </div>
                <div className="text-[#787878] text-[16px] mt-[7px] font-sans">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
