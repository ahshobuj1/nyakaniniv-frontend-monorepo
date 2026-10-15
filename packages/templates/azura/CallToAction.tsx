'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';

interface CtaProps {
  content?: {
    line1?: string;
    line2Prefix?: string;
    line2Highlight?: string;
    buttonText?: string;
    bgImage?: string;
  };
}

export default function CallToAction({content}: CtaProps) {
  const line1 = content?.line1 || 'Are You Ready For';
  const line2Prefix = content?.line2Prefix || 'Book, ';
  const line2Highlight = content?.line2Highlight || 'DJ Aura';
  const buttonText = content?.buttonText || 'Book Now';
  // const bgImage = content?.bgImage || '/theme/aura/vector-azura.png';

  return (
    <section className="bg-[#f0f0f0] py-8 lg:py-[80px]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="relative bg-[#e6e6e6] rounded-[24px] overflow-hidden py-[80px] px-[20px] flex flex-col items-center justify-center text-center">
          {/* Left Vector - Fixed Size & Position */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-[50px] md:left-[20px] w-[250px] h-[250px] md:w-[400px] md:h-[400px] z-0  opacity-90 pointer-events-none">
            <Image
              src={'/theme/aura/vector-left.png'}
              alt="Background Vector"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Right Vector - Fixed Size & Position */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-[50px] md:right-[20px] w-[250px] h-[250px] md:w-[400px] md:h-[400px] z-0 opacity-90 pointer-events-none">
            <Image
              src={'/theme/aura/vector-azura.png'}
              alt="Background Vector"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-[32px]">
            <h2 className="text-[30px] md:text-[48px] font-bold text-[#111111] leading-tight tracking-tight">
              {line1} <br />
              {line2Prefix} {/* Dynamic Color Applied Here */}
              <span className="text-[var(--primary)] ">{line2Highlight}</span>
            </h2>

            {/* Dynamic Background Color Applied Here */}
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className="bg-[var(--primary)] text-white px-[36px] py-[14px] rounded-[12px] font-bold text-[18px]">
              {buttonText}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
