'use client';

import {Content} from '@repo/types';
import {motion} from 'framer-motion';
import {fadeUp} from './constants';

export default function About({content}: {content: Content}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{once: true}}
      variants={fadeUp}
      className="bg-white py-[100px]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[80px]">
        <h2 className="text-[#0f0f0f] font-bold text-[40px] mb-8">About Us</h2>
        <p className="text-[#787878] text-[18px] leading-relaxed max-w-[800px]">
          {content?.aboutText || 'We are a DJ service dedicated to bringing the best music experience to your events. Our team of professionals ensures every beat is perfect.'}
        </p>
      </div>
    </motion.section>
  );
}
