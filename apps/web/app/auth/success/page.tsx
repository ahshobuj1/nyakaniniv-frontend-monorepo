'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full md:min-w-150 flex flex-col items-center">
        <div className="mb-6">
          <Link
            className="rounded-md p-2 hover:bg-muted/50 py-4 block"
            href="/">
            <Image
              src={'/auth.logo.png'}
              width={500}
              height={500}
              alt="logo"
              className="max-w-30 bg-contain w-auto h-auto mx-auto"
              priority
            />
          </Link>
        </div>

        <h2 className="text-[32px] font-bold text-gray-900 mb-3 tracking-tight">
          You&apos;re all set!
        </h2>

        <p className="text-gray-500 text-[15px] text-center mb-8 leading-relaxed">
          Welcome to UpBeat Entertainment Africa,{' '}
          <span className="font-bold text-gray-900">DJ!</span> Your website
          <br />
          are ready to go.
        </p>

        <Link
          href="/dashboard"
          className="w-full bg-primary text-white py-3.5 text-[15px] font-semibold hover:bg-[#e03939] transition-colors shadow-sm text-center block">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
