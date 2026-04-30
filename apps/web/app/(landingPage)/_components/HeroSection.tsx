'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import {ArrowRight} from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/home/Hero.png',
  },
  {
    id: 2,
    image: '/home/Hero.png',
  },
  {
    id: 3,
    image: '/home/Hero.png',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#F5F5F5] pt-20 pb-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-[5rem] leading-[1.1] font-bold text-[#111620] mb-12 tracking-tight">
          Power Your DJ Brand{' '}
          <span className="text-[#F63131]">
            Across
            <br />
            Africa...
          </span>
        </h1>

        <div className="relative w-full aspect-21/9 md:h-125 bg-white/50 overflow-hidden shadow-sm group">
          <div
            className="flex w-full h-full transition-transform duration-700 ease-out"
            style={{transform: `translateX(-${currentSlide * 100}%)`}}>
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="w-full h-full shrink-0 relative overflow-hidden">
                <Image
                  src={slide.image}
                  alt="UpBeat Africa DJ Platform"
                  fill
                  priority
                  className="object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-10 gap-8">
          <button
            onClick={nextSlide}
            className="flex items-center group cursor-pointer focus:outline-none"
            aria-label="Next slide">
            <div className="w-16 md:w-24 h-[1.5px] bg-[#F63131] transition-all duration-500 ease-out group-hover:w-32 group-hover:bg-[#d62828] origin-left"></div>

            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] transform -translate-x-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-110 active:scale-95 text-[#F63131] relative z-10">
              <ArrowRight className="w-6 h-6 stroke-[1.5] transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>

          <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed md:text-right">
            Get your personal website, manage bookings, and track payments — all
            in one platform designed for the African music industry.
          </p>
        </div>
      </div>
    </section>
  );
}
