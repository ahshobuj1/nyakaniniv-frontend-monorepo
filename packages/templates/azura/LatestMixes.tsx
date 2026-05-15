'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import {Play, SkipBack, SkipForward, Volume2} from 'lucide-react';
import {fadeUp} from './constants';

function MixCard({img, title, genre, time, delay}: any) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{y: -6}}
      transition={{delay}}
      className="bg-[#fbfbfb] rounded-[16px] p-[16px] flex flex-col gap-[16px] cursor-pointer">
      <div className="relative rounded-[12px] overflow-hidden aspect-[4/3] group w-full">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <motion.div
          whileHover={{scale: 1.1}}
          className="absolute bottom-[16px] right-[16px] size-[50px] md:size-[66px] rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
          <Play className="size-[20px] md:size-[26px] text-white fill-white ml-[2px]" />
        </motion.div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <p className="text-[#0f0f0f] text-[20px] font-medium leading-[26px] font-sans">
          {title}
        </p>
        <div className="flex items-center justify-between text-[#787878] text-[14px] font-medium font-sans">
          <span>{genre}</span>
          <span>{time}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function LatestMixes({content}: any) {
  const mixes = content?.mixes || [
    {
      img: '/theme/aura/mixes-video-avator-1.png',
      title: 'Lagos Nights Vol.3',
      genre: 'Amapiano',
      time: '58:20',
    },
    {
      img: '/theme/aura/mixes-video-avator-2.png',
      title: 'Cape Town Grooves',
      genre: 'House',
      time: '45:15',
    },
    {
      img: '/theme/aura/mixes-video-avator-3.png',
      title: 'Nairobi Vibes',
      genre: 'Afrobeats',
      time: '52:30',
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{once: true, amount: 0.15}}
      variants={{show: {transition: {staggerChildren: 0.08}}}}
      className="bg-[#f0f0f0] py-8 lg:py-[120px]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[80px] flex flex-col gap-[48px] items-center">
        <motion.div
          variants={fadeUp}
          className="text-center max-w-[585px] flex flex-col gap-[16px]">
          <h2 className="text-[#0f0f0f] font-bold text-[40px] leading-[48px]">
            Latest Mixes
          </h2>
          <p className="text-[#787878] text-[18px] leading-relaxed font-sans">
            Experience the energy. Press play to listen to recent live sets and
            curated studio mixes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] w-full">
          {mixes.map((mix: any, i: number) => (
            <MixCard
              key={i}
              img={mix.img}
              title={mix.title}
              genre={mix.genre}
              time={mix.time}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Now Playing Player */}
        <motion.div
          variants={fadeUp}
          className="bg-[#fbfbfb] rounded-[16px] shadow-sm p-[24px] flex flex-col md:flex-row items-center gap-[30px] w-full">
          <div className="relative size-[100px] shrink-0">
            <Image
              src="/theme/aura/audio.png"
              alt="Now playing"
              fill
              className="rounded-[6px] object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col gap-[10px] w-full">
            <div className="flex items-center gap-[12px]">
              <span className="bg-[var(--primary)] text-white text-[14px] px-[8px] py-[4px] rounded-[4px] font-medium font-sans">
                NOW PLAYING
              </span>
              <span className="text-[#787878] text-[16px] font-sans">
                Afrobeat • Live Set
              </span>
            </div>
            <p className="text-[#0f0f0f] text-[20px] font-semibold leading-[26px] font-sans">
              Summer Vibes Vol. 4 (Live in Accra)
            </p>
            <div className="flex items-center gap-[16px] pt-[8px] w-full">
              <span className="text-[#787878] text-[16px] font-sans">
                24:15
              </span>
              <div className="flex-1 h-[8px] bg-[#ddd] rounded-[12px] overflow-hidden">
                <motion.div
                  initial={{width: 0}}
                  whileInView={{width: '23%'}}
                  viewport={{once: true}}
                  transition={{duration: 1.2, ease: 'easeOut'}}
                  className="h-full bg-[var(--primary)] rounded-[16px]"
                />
              </div>
              <span className="text-[#787878] text-[16px] font-sans">
                1:45:00
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[20px] md:pl-[31px] md:border-l border-[#c3c3c3] self-stretch pt-4 md:pt-0">
            <SkipBack className="size-[24px] text-[#787878] cursor-pointer hover:text-[var(--primary)] transition-colors" />
            <motion.button
              whileHover={{scale: 1.08}}
              whileTap={{scale: 0.95}}
              className="size-[50px] md:size-[66px] rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
              <Volume2 className="size-[20px] md:size-[26px] text-white" />
            </motion.button>
            <SkipForward className="size-[24px] text-[#787878] cursor-pointer hover:text-[var(--primary)] transition-colors" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
