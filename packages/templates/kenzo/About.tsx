'use client';

import React from 'react';

export default function KenzoAbout({content}: any) {
  return (
    <section className="py-24 px-6 bg-white text-black" id="about">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">The Story</h2>
        <p className="text-lg text-gray-600 leading-relaxed">{content?.aboutText || 'Kenzo is a minimalist theme for modern artists.'}</p>
      </div>
    </section>
  );
}
