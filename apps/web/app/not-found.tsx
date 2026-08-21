'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Disc3, Headphones, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col justify-between relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Decorative Lighting */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation / Branding */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/home/footer-logo.png"
            alt="UpBeat Entertainment Africa"
            width={120}
            height={40}
            className="w-28 h-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        <Link
          href="/"
          className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft size={16} />
          <span>Back to safety</span>
        </Link>
      </header>

      {/* Main 404 Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-center relative z-10 flex flex-col items-center justify-center my-auto">
        {/* Animated Vinyl / Turntable Graphic */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-primary/30 via-red-500/10 to-transparent p-1 animate-pulse">
            {/* Spinning vinyl disc */}
            <div className="w-full h-full rounded-full bg-[#161b22] border-4 border-slate-700/60 shadow-2xl flex items-center justify-center relative overflow-hidden group">
              {/* Vinyl grooves */}
              <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-10 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-14 rounded-full border border-white/5 pointer-events-none" />

              {/* Center record label */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-[#b91c1c] flex flex-col items-center justify-center shadow-inner relative z-10 text-white">
                <Disc3 className="w-8 h-8 animate-spin [animation-duration:8s]" />
                <span className="text-[9px] font-bold tracking-widest uppercase mt-0.5 opacity-90">404</span>
              </div>
            </div>
          </div>

          {/* Floating Soundwave Equalizer Badges */}
          <div className="absolute -left-6 md:-left-10 top-1/3 bg-[#1e2430]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg flex items-center gap-1.5 text-xs text-red-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Track Missing</span>
          </div>

          <div className="absolute -right-6 md:-right-10 bottom-1/3 bg-[#1e2430]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg flex items-center gap-1.5 text-xs text-gray-300 font-medium">
            <Headphones size={14} className="text-primary" />
            <span>Off-Beat</span>
          </div>
        </div>

        {/* 404 Headline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          Error 404 • Page Not Found
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Looks Like You <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Dropped The Beat</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
          The mix you are looking for doesn’t exist or has been moved to another stage. Let’s get you back in tune!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/#themes"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 px-6 rounded-xl border border-white/10 transition-all hover:border-white/20 hover:-translate-y-0.5 backdrop-blur-sm">
            <Disc3 size={18} className="text-primary" />
            <span>Explore Themes</span>
          </Link>
        </div>

        {/* Helpful Quick Links Cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <Link
            href="/#features"
            className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 transition-all group">
            <p className="text-xs text-gray-400 mb-1 group-hover:text-primary transition-colors font-medium">Platform</p>
            <p className="text-sm font-semibold text-white">Features & Tools</p>
          </Link>

          <Link
            href="/pricing"
            className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 transition-all group">
            <p className="text-xs text-gray-400 mb-1 group-hover:text-primary transition-colors font-medium">Subscriptions</p>
            <p className="text-sm font-semibold text-white">Pricing & Plans</p>
          </Link>

          <Link
            href="/support"
            className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 transition-all group">
            <p className="text-xs text-gray-400 mb-1 group-hover:text-primary transition-colors font-medium flex items-center gap-1">
              <HelpCircle size={12} /> Helpdesk
            </p>
            <p className="text-sm font-semibold text-white">Support & FAQ</p>
          </Link>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-500 border-t border-white/5 relative z-10">
        © {new Date().getFullYear()} UpBeat Entertainment Africa. All rights reserved.
      </footer>
    </div>
  );
}
