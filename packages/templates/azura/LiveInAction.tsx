'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';

interface LiveInActionProps {
  content?: {
    title?: string;
    subtitle?: string;
    images?: string[];
    liveActionImages?: string[];
    [key: string]: any;
  };
}

export default function LiveInAction({content}: LiveInActionProps) {
  const title = content?.title || 'Live In Action';
  const subtitle = content?.subtitle || 'Energy from recent performances.';
  const images = content?.liveActionImages || content?.images || [
    '/theme/aura/default/live-action-1.png',
    '/theme/aura/default/live-action-2.png',
    '/theme/aura/default/live-action-3.png',
    '/theme/aura/default/live-action-4.png',
  ];

  return (
    <section id="gallery" className="bg-[#f2f2f2] py-[80px]">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="text-center mb-[48px] flex flex-col gap-[8px]">
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            className="text-[36px] md:text-[40px] font-bold text-[#0f0f0f]">
            {title}
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.1}}
            className="text-[#787878] text-[16px] font-sans">
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="relative h-[400px] md:h-[600px] w-full rounded-[16px] overflow-hidden">
            <Image
              src={images[0] || '/theme/aura/default/live-action-1.png'}
              alt="Live Performance Main"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <div className="flex flex-col gap-[16px]">
            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.1}}
              className="relative h-[250px] md:h-[292px] w-full rounded-[16px] overflow-hidden">
              <Image
                src={images[1] || '/theme/aura/default/live-action-2.png'}
                alt="Live Performance Secondary"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-[16px] flex-1">
              <motion.div
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, delay: 0.2}}
                className="relative min-h-[200px] w-full rounded-[16px] overflow-hidden">
                <Image
                  src={images[2] || '/theme/aura/default/live-action-3.png'}
                  alt="DJ Equipment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
              <motion.div
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, delay: 0.3}}
                className="relative min-h-[200px] w-full rounded-[16px] overflow-hidden">
                <Image
                  src={images[3] || '/theme/aura/default/live-action-4.png'}
                  alt="Live Performance Detail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
