'use client';

import React from 'react';

export default function KenzoContact({content}: any) {
  return (
    <section className="py-24 px-6 bg-gray-50 text-black text-center" id="contact">
      <h2 className="text-4xl font-bold mb-12">Connect</h2>
      <div className="space-y-4">
        <p className="text-xl font-medium">{content?.email || 'kenzo@example.com'}</p>
        <p className="text-gray-500">{content?.phone || '+1 234 567 890'}</p>
      </div>
    </section>
  );
}
