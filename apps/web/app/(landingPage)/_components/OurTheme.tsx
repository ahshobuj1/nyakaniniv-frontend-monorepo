'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import { useGetAllThemesQuery } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';

export interface ThemeItem {
  id: string;
  name: string;
  image: string;
}

const themeData: ThemeItem[] = [
  {
    id: 'azura',
    name: 'DJ AURA',
    image: '/theme/Theme1.png',
  },
  {
    id: 'kenzo',
    name: 'KENZO',
    image: '/theme/Theme2.png',
  },
  {
    id: 'azura', // Temporary fallback
    name: 'NIGHTLIFE',
    image: '/theme/Theme1.png',
  },
  {
    id: 'kenzo', // Temporary fallback
    name: 'ACOUSTIC',
    image: '/theme/Theme2.png',
  },
];

export default function OurThemes() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { data: themesResponse, isLoading } = useGetAllThemesQuery();
  const themes = themesResponse?.data || [];

  const handlePreview = (themeId: string) => {
    router.push(`/themes/preview?themeId=${themeId}`);
  };

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
            {isLoading ? (
              <div className="w-full">
                <LoadingSpinner smallHeight />
              </div>
            ) : (
              (themes.length > 0 ? themes : themeData).map((theme: any) => (
                <div
                  key={theme.id || theme.slug}
                  onClick={() => handlePreview(theme.slug || theme.id)}
                  className="min-w-full md:min-w-[calc(50%-1rem)] snap-center group/card cursor-pointer">
                  <div className="relative w-full aspect-16/13 bg-white shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out overflow-hidden transform group-hover/card:-translate-y-2">
                    <Image
                      src={theme.previewImageUrl || theme.image || '/theme/Theme1.png'}
                      alt={theme.name}
                      width={1000}
                      height={1000}
                      className="object-cover object-top transform group-hover/card:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
              ))
            )}
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
