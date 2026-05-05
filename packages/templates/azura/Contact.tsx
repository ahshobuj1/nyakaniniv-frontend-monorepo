'use client';

import {Content} from '@repo/types';
import {motion} from 'framer-motion';
import {fadeUp} from './constants';
import {Mail, Phone, MapPin} from 'lucide-react';

export default function Contact({content}: {content: Content}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{once: true}}
      variants={fadeUp}
      className="bg-[#f0f0f0] py-[100px]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[80px]">
        <h2 className="text-[#0f0f0f] font-bold text-[40px] mb-12 text-center">
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center text-center gap-4">
            <div className="size-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <Mail className="text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-bold">Email</h3>
            <p className="text-[#787878]">
              {content?.email || 'contact@example.com'}
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center text-center gap-4">
            <div className="size-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <Phone className="text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-bold">Phone</h3>
            <p className="text-[#787878]">
              {content?.phone || '+1 234 567 890'}
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center text-center gap-4">
            <div className="size-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <MapPin className="text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-bold">Location</h3>
            <p className="text-[#787878]">
              {content?.location || 'Lagos, Nigeria'}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
