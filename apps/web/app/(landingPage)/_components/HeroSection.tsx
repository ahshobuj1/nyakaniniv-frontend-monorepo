'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import { LandingPageHero } from '@repo/store';

interface HeroProps {
  hero?: LandingPageHero | null;
}

export default function Hero({ hero }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // If hero has an image use it, otherwise fallback
  const slides = [
    {
      id: 1,
      image: hero?.imageUrl1 || '/home/Hero.png',
    },
    {
      id: 2,
      image: hero?.imageUrl2 || '/home/Hero.png',
    },
    {
      id: 3,
      image: hero?.imageUrl3 || '/home/Hero.png',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const renderTitle = (title: string | null | undefined) => {
    if (!title) {
      return (
        <>
          Power Your DJ Brand{' '}
          <span className="text-primary">
            Across
            <br />
            Africa...
          </span>
        </>
      );
    }
    
    const words = title.trim().split(/\s+/);
    if (words.length < 2) return title;

    const mainPart = words.slice(0, -2).join(' ');
    const lastTwo = words.slice(-2);

    return (
      <>
        {mainPart ? mainPart + ' ' : ''}
        <span className="text-primary">
          {lastTwo[0]}
          <br />
          {lastTwo[1]}
        </span>
      </>
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-[#f0f0f0]! pt-20 pb-10 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-3xl lg:text-[5rem] leading-[1.1] font-bold text-[#111620] mb-12 tracking-tight whitespace-pre-wrap">
          {renderTitle(hero?.title)}
        </h1>

        <div className="relative w-full aspect-[21/9] md:h-[500px] bg-white/50 overflow-hidden shadow-sm group rounded-2xl">
          <div
            className="flex w-full h-full transition-transform duration-700 ease-out"
            style={{transform: `translateX(-${currentSlide * 100}%)`}}>
            {slides.map((slide, index) => (
              <div
                key={`${slide.id}-${index}`}
                className="w-full h-full shrink-0 relative overflow-hidden">
                <Image
                  src={slide?.image || '/home/Hero.png'}
                  alt={hero?.title || "UpBeat Entertainment Africa DJ Platform"}
                  fill
                  priority={index === 0}
                  quality={100}
                  unoptimized
                  className="object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                  sizes="100vw"
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
            <div className="w-16 md:w-24 h-[1.5px] bg-primary transition-all duration-500 ease-out group-hover:w-32 group-hover:bg-[#d62828] origin-left"></div>

            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] transform -translate-x-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-110 active:scale-95 text-primary relative z-10">
              <ArrowRight className="w-6 h-6 stroke-[1.5] transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>

          <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed md:text-right">
            {hero?.description || 'Get your personal website, manage bookings, and track payments — all in one platform designed for the African music industry.'}
          </p>
        </div>
      </div>
    </section>
  );
}
