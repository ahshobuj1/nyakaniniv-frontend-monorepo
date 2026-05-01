'use client';

import {motion} from 'framer-motion';
import {Logo} from './constants';

export default function Nav({content}: any) {
  const links = content?.navLinks || ['Home', 'About', 'Music', 'Events', 'Gallery'];
  return (
    <motion.header
      initial={{y: -40, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f0f0f0]">
      <div className="max-w-[1440px] mx-auto h-[100px] px-6 lg:px-[80px] flex items-center justify-between">
        <Logo name={content?.djName} />

        <div className="flex items-center gap-[48px]">
          <nav className="hidden md:flex items-center gap-[40px] font-sans">
            {links.map((l: string, i: number) => (
              <a
                key={l}
                href="#"
                className={`text-[16px] transition-colors ${
                  i === 0
                    ? 'bg-[#f0f0f0] text-[var(--primary)] px-[14px] py-[6px] rounded-[28px] font-medium'
                    : 'text-[#787878] hover:text-[var(--primary)] font-normal'
                }`}>
                {l}
              </a>
            ))}
          </nav>
          <motion.button
            whileHover={{scale: 1.04}}
            whileTap={{scale: 0.97}}
            className="bg-[var(--primary)] text-white rounded-[16px] px-[24px] py-[12px] text-[16px] font-semibold">
            Book Now
          </motion.button>

        </div>
      </div>
    </motion.header>
  );
}

