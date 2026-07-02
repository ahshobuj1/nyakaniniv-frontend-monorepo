'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';

interface HeroProps {
  content?: {
    heroTitle?: string;
    heroDescription?: string;
    heroImage?: string;
  };
  onViewChange?: (view: string) => void;
  view?: string;
}

export default function Hero({content, onViewChange, view}: HeroProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isPreviewPage = pathname?.includes('/themes/preview');
  const themeId = searchParams?.get('themeId');

  const bookingLink = isPreviewPage
    ? `/themes/preview?themeId=${themeId}&view=booking`
    : '/book';

  const homeLink = isPreviewPage
    ? `/themes/preview?themeId=${themeId}&view=landing`
    : '/';

  const handleBookingClick = (e: React.MouseEvent) => {
    if (onViewChange) {
      e.preventDefault();
      onViewChange('booking');
    }
  };

  const title =
    content?.heroTitle || 'Bringing the energy to every dancefloor.';
  const description =
    content?.heroDescription ||
    'Afrobeat, Amapiano, and Deep House specialist. Creating unforgettable rhythmic experiences across Africa and beyond.';
  const image = content?.heroImage || '/theme/aura/default/aura-hero-1.png';

  const stairMaskUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800' preserveAspectRatio='none'%3E%3Cdefs%3E%3Cfilter id='r' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='8' result='blur' /%3E%3CfeColorMatrix in='blur' mode='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 25 -10' result='goo' /%3E%3C/filter%3E%3C/defs%3E%3Cpolygon points='-50,-50 500,-50 500,80 630,80 630,160 730,160 730,240 850,240 850,850 300,850 300,720 170,720 170,640 80,640 80,560 -50,560' fill='black' filter='url(%23r)' /%3E%3C/svg%3E";

  return (
    <section id="home" className="bg-[#f0f0f0] py-[80px]">
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
            <span className="text-[14px] text-[#787878] tracking-wide font-sans font-medium">
              AVAILABLE FOR BOOKING
            </span>
          </div>

          <h1 className="text-[#0f0f0f] font-bold text-4xl capitalize lg:text-5xl  leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-[#787878] text-[18px] max-w-[523px] font-sans leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link href={bookingLink} onClick={handleBookingClick}>
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 10px 30px rgba(var(--primary-rgb),0.35)',
                }}
                whileTap={{scale: 0.97}}
                className="bg-[var(--primary)] text-white px-5 md:px-8 py-[16px] rounded-[16px] text-base lg:text-[18px] font-semibold">
                Book The DJ
              </motion.button>
            </Link>

            <Link href={`${homeLink}#music`}>
              <motion.button
                whileHover={{scale: 1.03}}
                whileTap={{scale: 0.97}}
                className="bg-[#e5e5e5] hover:bg-[#ddd] transition-colors text-[#0f0f0f] px-5 lg:px-8 py-[16px] rounded-[16px] text-base lg:text-[18px] font-semibold">
                Listen to Mixes
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0, scale: 0.9, x: 40}}
          animate={{opacity: 1, scale: 1, x: 0}}
          transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
          className="relative h-[400px] lg:h-[630px] w-full">
          <div
            className="absolute inset-0"
            style={{
              maskImage: `url("${stairMaskUrl}")`,
              WebkitMaskImage: `url("${stairMaskUrl}")`,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}>
            <div className="absolute inset-0 rounded-[24px] overflow-hidden">
              <Image
                src={image}
                alt="DJ Hero"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
