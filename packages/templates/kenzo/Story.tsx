'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';

export default function Story({content}: any) {
  // New config pattern
  const title = content?.story?.title || 'The Story';
  const description1 =
    content?.story?.description1 ||
    'With over a decade of experience moving crowds from intimate underground clubs to massive festival stages, DJ Kenzo creates sonic journeys that blend cultural rhythms with modern electronic beats.';
  const description2 =
    content?.story?.description2 ||
    'Known for seamless transitions and an unparalleled ability to read the room, every set is a unique experience tailored to elevate the moment.';
  const mainImage = content?.story?.mainImage || '/theme/kenzo/story.png';
  const bgImage = content?.story?.bgImage || '/theme/kenzo/stroy-bg.png';

  const stats = content?.story?.stats || [
    {value: '10+', label: 'Years Active'},
    {value: '500+', label: 'Shows'},
    {value: '25', label: 'Countries'},
  ];

  return (
    <section id="about" className="bg-[#f4f4f4] py-8 lg:py-[100px] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] lg:gap-[100px] items-center">
          <motion.div
            initial={{opacity: 0, x: -40}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
            className="relative w-full max-w-[550px] mx-auto aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]">
            <div className="absolute inset-0 rotate-[7deg] -translate-x-2 translate-y-2 z-0">
              <Image
                src={bgImage}
                alt="Story Background Shape"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="absolute inset-0 rotate-[3deg] z-10 rounded-[16px] overflow-hidden ">
              <Image
                src={mainImage}
                alt="DJ Performance Story"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, x: 40}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
            className="flex flex-col">
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#111111] mb-[24px] tracking-tight">
              {title}
            </h2>

            <p className="text-[#666666] text-[15px] md:text-[16px] leading-[1.8] mb-[20px]">
              {description1}
            </p>

            <p className="text-[#666666] text-[15px] md:text-[16px] leading-[1.8] mb-[40px]">
              {description2}
            </p>

            <div className="grid grid-cols-3 gap-[16px]">
              {stats.map((stat: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{duration: 0.5, delay: 0.2 + index * 0.1}}
                  className="bg-white rounded-[16px] py-[24px] px-[12px] flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <span className="text-[24px] md:text-[28px] font-extrabold text-[var(--primary)] mb-[4px]">
                    {stat.value}
                  </span>
                  <span className="text-[12px] md:text-[13px] text-[#888888] font-medium text-center">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
