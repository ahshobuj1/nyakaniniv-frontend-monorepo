'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';

export default function Gallery({content}: any) {
  // New config pattern
  const galleryData = content?.gallery || {
    title: 'Gallery Highlights',
    subtitle: 'Energy from recent performances.',
    images: [
      '/theme/kenzo/gallary-1.png', // Left Top
      '/theme/kenzo/gallary-2.png', // Left Bottom
      '/theme/kenzo/gallary-3.png', // Center Large
      '/theme/kenzo/gallary-4.png', // Right Top
      '/theme/kenzo/gallary-5.png', // Right Bottom
    ],
  };

  const images = galleryData.images;

  return (
    <section id="gallery" className="bg-[#fcfcfc] py-8 lg:py-[100px] font-sans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-[50px]">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-[12px] tracking-tight">
            {galleryData.title}
          </h2>
          <p className="text-[#888888] text-[15px] md:text-[16px]">
            {galleryData.subtitle}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px] md:gap-[24px]">
          {/* Left Top Image */}
          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{duration: 0.5, delay: 0.1}}
            className="relative h-[250px] md:h-[280px] rounded-[24px] overflow-hidden md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 group">
            <Image
              src={images[0] || '/theme/kenzo/default/gallary-1.png'}
              alt="Gallery 1"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </motion.div>

          {/* Left Bottom Image */}
          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{duration: 0.5, delay: 0.2}}
            className="relative h-[250px] md:h-[280px] rounded-[24px] overflow-hidden md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 group">
            <Image
              src={images[1] || '/theme/kenzo/default/gallary-2.png'}
              alt="Gallery 2"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </motion.div>

          {/* Center Large Image */}
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="relative h-[400px] md:h-auto rounded-[24px] overflow-hidden md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-3 group shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
            <Image
              src={images[2] || '/theme/kenzo/default/gallary.png'}
              alt="Gallery Main"
              fill
              priority
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Optional Overlay for Main Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>

          {/* Right Top Image */}
          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{duration: 0.5, delay: 0.3}}
            className="relative h-[250px] md:h-[280px] rounded-[24px] overflow-hidden md:col-start-4 md:col-end-5 md:row-start-1 md:row-end-2 group">
            <Image
              src={images[3] || '/theme/kenzo/default/gallary-4.png'}
              alt="Gallery 3"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </motion.div>

          {/* Right Bottom Image */}
          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{duration: 0.5, delay: 0.4}}
            className="relative h-[250px] md:h-[280px] rounded-[24px] overflow-hidden md:col-start-4 md:col-end-5 md:row-start-2 md:row-end-3 group">
            <Image
              src={images[4] || '/theme/kenzo/default/gallary-3.png'}
              alt="Gallery 4"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
