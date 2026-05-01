'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {ChevronLeft, ChevronRight} from 'lucide-react';

export interface ThemeItem {
  id: string;
  name: string;
  image: string;
}

const themeData: ThemeItem[] = [
  {
    id: 'theme-1',
    name: 'DJ AURA',
    image: '/theme/Theme1.png',
  },
  {
    id: 'theme-2',
    name: 'KENZO',
    image: '/theme/Theme2.png',
  },
  {
    id: 'theme-3',
    name: 'NIGHTLIFE',
    image: '/theme/Theme1.png',
  },
  {
    id: 'theme-4',
    name: 'ACOUSTIC',
    image: '/theme/Theme2.png',
  },
];

export default function OurThemes() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#f0f0f0] py-24 px-6" id="themes">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#111620] mb-6">
            Our <span className="text-primary">Themes</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find the perfect design to showcase your talent. Choose from our
            library of themes, crafted for DJs in Africa.
          </p>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white w-14 h-14 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all hover:bg-primary/90 duration-300 hover:text-white text-[#111620]"
            aria-label="Previous theme">
            <ChevronLeft className="w-8 h-8 cursor-pointer stroke-[1.5]" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth pb-10 pt-4 px-2">
            {themeData.map((theme) => (
              <div
                key={theme.id}
                className="min-w-full md:min-w-[calc(50%-1rem)] snap-center group/card cursor-pointer">
                <div className="relative w-full aspect-16/13 bg-white shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out overflow-hidden transform group-hover/card:-translate-y-2">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    width={1000}
                    height={1000}
                    className="object-cover object-top transform group-hover/card:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white w-14 h-14 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-primary/90 hover:text-white cursor-pointer text-[#111620]"
            aria-label="Next theme">
            <ChevronRight className="w-8 h-8 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
