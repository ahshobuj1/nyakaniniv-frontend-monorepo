'use client';

import {Check, ArrowRight, ChevronDown} from 'lucide-react';
import {ThemeCard} from './_components/Themecard';

export default function WebsiteThemesPage() {
  // Mock Data for the themes
  const themes = [
    {
      id: '1',
      title: 'Solar Flare',
      description: 'Bright and energetic with orange and yellow hues',
      // Replace with your actual image path
      imageUrl: '/theme/Theme1.png',
    },
    {
      id: '2',
      title: 'Abyss',
      description: 'Sleek and modern with deep blues and blacks',
      // Replace with your actual image path
      imageUrl: '/theme/Theme2.png',
    },
  ];

  return (
    <div className="w-full bg-[#f4f6f8] min-h-screen p-6 font-sans">
      <div className="w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Website Themes
            </h1>
            <p className="text-sm text-gray-500">
              Choose a template for your public DJ website
            </p>
          </div>

          <button className="bg-primary hover:bg-red-600 text-white text-sm font-medium py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
            View My Website <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Theme Banner */}
        <div className="bg-[#fff1f2] border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-[#fecdd3] p-1 rounded-md">
            <Check className="w-4 h-4 text-red-600" strokeWidth={3} />
          </div>
          <p className="text-[14px] text-gray-600">
            <span className="font-bold text-gray-900">
              Active Theme: Solar Flare
            </span>{' '}
            Currently live on your website
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="pt-2">
          <button className="bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Latest Templates <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              title={theme.title}
              description={theme.description}
              imageUrl={theme.imageUrl}
              onApply={() => console.log(`Applying ${theme.title}`)}
              onPreview={() => console.log(`Previewing ${theme.title}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
