'use client';

import React from 'react';

export default function KenzoHero({content}: any) {
  return (
    <section className="py-32 px-6 bg-black text-white text-center">
      <h1 className="text-6xl font-bold mb-6">{content?.heroTitle || 'Kenzo Modern Vibes'}</h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto">{content?.heroDescription || 'Elegant. Minimal. Powerful.'}</p>
    </section>
  );
}
