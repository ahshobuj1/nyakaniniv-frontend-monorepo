'use client';

import {MousePointer2, Hand, Upload, ChevronDown} from 'lucide-react';
import Image from 'next/image';

export default function ManageWebsite() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] p-4 font-sans text-gray-800">
      <div className="max-w-400 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage website</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit content, change fonts and choose your color paletteW
          </p>
        </div>

        {/* Main Interface Layout */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-3 flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-175">
          {/* ========================================== */}
          {/* LEFT SIDE: SCROLLABLE LANDING PAGE PREVIEW */}
          {/* ========================================== */}
          <div className="flex-1 bg-[#c5c7cb] rounded-2xl p-4 md:p-8 flex flex-col overflow-hidden">
            {/* The Scrollable Window */}
            <div className="bg-[#f9fafb] w-full h-full rounded-t-lg shadow-lg overflow-y-auto relative scroll-smooth border border-gray-100">
              {/* --- Landing Page Content Starts Here --- */}
              <div className="min-h-375">
                {' '}
                {/* Extra height to demonstrate scrolling */}
                {/* Navbar */}
                <nav className="flex items-center justify-between px-8 py-6 bg-white sticky top-0 z-10 shadow-sm">
                  <div className="text-3xl font-black tracking-tight text-primary">
                    DJ AURA
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-gray-500">
                    <span className="bg-red-50 text-primary px-4 py-1.5 rounded-full">
                      Home
                    </span>
                    <span className="hover:text-gray-900 cursor-pointer transition-colors">
                      About
                    </span>
                    <span className="hover:text-gray-900 cursor-pointer transition-colors">
                      Music
                    </span>
                    <span className="hover:text-gray-900 cursor-pointer transition-colors">
                      Events
                    </span>
                    <span className="hover:text-gray-900 cursor-pointer transition-colors">
                      Gallery
                    </span>
                  </div>
                  <button className="bg-primary hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-red-200">
                    Book Now
                  </button>
                </nav>
                {/* Hero Section */}
                <div className="px-8 py-16 flex flex-col xl:flex-row items-center gap-12 bg-white">
                  {/* Hero Text */}
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Available for Booking
                    </div>

                    <h1 className="text-5xl lg:text-[64px] leading-[1.1] font-black text-gray-900 tracking-tight">
                      Bringing the <br /> energy to every <br /> dancefloor.
                    </h1>

                    <p className="text-gray-500 text-base max-w-100 leading-relaxed">
                      Afrobeat, Amapiano, and Deep House specialist. Creating
                      unforgettable rhythmic experiences across Africa and
                      beyond.
                    </p>

                    <div className="flex gap-4 pt-2">
                      <button className="bg-primary hover:bg-red-600 text-white px-7 py-3 rounded-lg text-sm font-semibold transition-colors">
                        Book The DJ
                      </button>
                      <button className="bg-[#e5e7eb] hover:bg-gray-300 text-gray-800 px-7 py-3 rounded-lg text-sm font-semibold transition-colors">
                        Listen to Mixes
                      </button>
                    </div>
                  </div>

                  {/* Hero Image Area (Mock) */}
                  <div className="flex-1 w-full flex justify-end">
                    <div className="relative w-[90%] aspect-4/4 bg-gray-900 rounded-[40px] rounded-tl-[120px] rounded-br-[120px] overflow-hidden shadow-2xl">
                      <Image
                        src="/public/theme/Theme1.png"
                        alt="DJ playing music"
                        className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                        width={1000}
                        height={1000}
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent"></div>
                      {/* Decorative Neon Text Mock */}
                      <div className="absolute right-8 bottom-1/3 text-right">
                        <p className="text-red-400 font-bold text-xl drop-shadow-[0_0_8px_rgba(246,49,49,0.8)] tracking-widest leading-tight">
                          YOU <br /> EXACTLY <br /> YOU N <br /> TO
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* --- Dummy Content for Scroll Testing --- */}
                <div className="bg-[#f9fafb] px-8 py-20">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-gray-900">
                      Featured Mixes
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Listen to the latest sets from recent tours.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="bg-white h-64 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                        SoundCloud Player Mock
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900 px-8 py-24 text-center">
                  <h2 className="text-4xl font-black text-white mb-6">
                    Ready to bring the vibe?
                  </h2>
                  <button className="bg-primary hover:bg-red-600 text-white px-8 py-4 rounded-xl text-base font-bold transition-colors shadow-lg shadow-primary/30">
                    Book DJ AURA Now
                  </button>
                </div>
                {/* --- End Landing Page Content --- */}
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT SIDE: EDITOR SIDEBAR */}
          {/* ========================================== */}
          <div className="w-full lg:w-85 xl:w-95 bg-[#f8f9fa] rounded-2xl p-6 flex flex-col border border-gray-100 overflow-y-auto">
            <div className="border-b border-gray-200 pb-5 mb-5">
              <h2 className="font-bold text-gray-900 text-lg">
                Edit Your Content
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Switch your text and image! Choose your favorite primary color
                and font style.
              </p>
            </div>

            <div className="space-y-6 flex-1">
              {/* Interaction Tools */}
              <div className="flex gap-2">
                <button className="bg-emerald-400 p-2.5 rounded-lg text-white shadow-sm hover:bg-emerald-500 transition-colors">
                  <MousePointer2 size={18} strokeWidth={2.5} />
                </button>
                <button className="bg-white border border-gray-200 p-2.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
                  <Hand size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Text Input */}
              <div>
                <label className="text-[13px] font-bold text-gray-800 mb-2 block">
                  Text
                </label>
                <textarea
                  className="w-full rounded-xl border border-transparent shadow-sm text-[13px] p-4 h-28 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none resize-none placeholder:text-gray-400"
                  placeholder="Just pick a section of text to swap out..."></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-[13px] font-bold text-gray-800 mb-2 block">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 bg-white cursor-pointer transition-colors">
                  <Upload size={22} className="mb-2" strokeWidth={2} />
                  <span className="text-[11px] font-semibold">
                    Replace Image
                  </span>
                </div>
              </div>

              {/* Fonts & Color Section */}
              <div className="pt-2">
                <h3 className="text-[13px] font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Fonts & Color
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-800 mb-1.5 block">
                      Headlines
                    </label>
                    <div className="relative">
                      <select className="w-full p-2.5 px-3 border border-transparent shadow-sm rounded-lg text-[13px] bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-red-100 outline-none">
                        <option>Mona Sans</option>
                        <option>Inter</option>
                        <option>Outfit</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-800 mb-1.5 block">
                      Body
                    </label>
                    <div className="relative">
                      <select className="w-full p-2.5 px-3 border border-transparent shadow-sm rounded-lg text-[13px] bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-red-100 outline-none">
                        <option>Poppins</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-800 mb-1.5 block">
                      Primary Color
                    </label>
                    <div className="flex gap-2 items-center bg-white p-1 rounded-lg shadow-sm border border-transparent">
                      <div className="w-8 h-8 rounded-md bg-primary ml-1 shadow-inner"></div>
                      <input
                        type="text"
                        value="#F63131"
                        readOnly
                        className="flex-1 p-2 text-[13px] bg-transparent outline-none text-gray-600 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4">
              <button className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-colors">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
