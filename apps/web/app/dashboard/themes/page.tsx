'use client';

import {Check, ArrowRight, ChevronDown} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {ThemeCard} from './_components/Themecard';
import { useGetAllThemesQuery, useGetCurrentProfileQuery } from '@repo/store';

export default function WebsiteThemesPage() {
  const router = useRouter();

  const { data: profileResponse } = useGetCurrentProfileQuery();
  const activeThemeId = profileResponse?.data?.tenant?.themeId;

  const { data: themesResponse, isLoading } = useGetAllThemesQuery();
  const themes = themesResponse?.data || [];

  const handleApplyTheme = (themeSlug: string) => {
    // Redirect to manage-theme to customize and publish
    router.push(`/dashboard/manage-theme?themeId=${themeSlug}`);
  };

  const handlePreviewTheme = (themeSlug: string) => {
    router.push(`/themes/preview?themeId=${themeSlug}`);
  };

  const activeTheme = themes.find(t => t.id === activeThemeId);
  const subdomain = profileResponse?.data?.tenant?.subdomain || 'demo';

  const getLiveWebsiteUrl = () => {
    if (typeof window === 'undefined') return '#';
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${subdomain}.localhost${port}`;
    }
    
    return `https://${subdomain}.deejay.africa`;
  };

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

          <button 
            onClick={() => window.open(getLiveWebsiteUrl(), '_blank')}
            className="bg-primary hover:bg-red-600 text-white text-sm font-medium py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
            View My Website <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Theme Banner */}
        {activeTheme && (
          <div className="bg-[#fff1f2] border border-red-100 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-[#fecdd3] p-1 rounded-md">
              <Check className="w-4 h-4 text-red-600" strokeWidth={3} />
            </div>
            <p className="text-[14px] text-gray-600">
              <span className="font-bold text-gray-900">
                Active Theme: {activeTheme.name}
              </span>{' '}
              Currently live on your website
            </p>
          </div>
        )}

        {/* Filter Dropdown */}
        <div className="pt-2">
          <button className="bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Latest Templates <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Themes Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                title={theme.name || 'Unnamed Theme'}
                description={'No description available'}
                imageUrl={theme.previewImageUrl || '/theme/Theme1.png'}
                onApply={() => handleApplyTheme(theme.slug || String(theme.id))}
                onPreview={() => handlePreviewTheme(theme.slug || String(theme.id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
