'use client';

import React, {Suspense, useState} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {ArrowLeft, Check, Monitor} from 'lucide-react';
import TemplateRenderer from '@repo/builder';
import {templates} from '@repo/templates';
import {Button} from '@repo/ui';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

function ThemePreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const themeId = searchParams.get('themeId') || 'azura';
  const view = (searchParams.get('view') as 'landing' | 'booking') || 'landing';
  const template = templates[themeId as keyof typeof templates];

  // State for interactive viewport switching
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-sans">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xl font-semibold text-slate-800 mb-2">
            Template not found
          </p>
          <p className="text-sm text-slate-500 mb-6">
            The theme you are looking for does not exist.
          </p>
          <Button onClick={() => router.back()} className="font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 h-auto md:h-16 py-3 md:py-0 flex flex-col md:flex-row items-center justify-between shrink-0 shadow-sm z-20 gap-4 md:gap-0">
        {/* Left: Back Button & Info */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-lg">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex flex-col items-end md:items-start text-right md:text-left">
            <h1 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
              Preview: <span className="text-primary">{template.id}</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Viewing theme with default content
            </p>
          </div>
        </div>

        {/* Center: Interactive Viewport Switcher (Hidden on small mobile) */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-md flex items-center justify-center transition-all duration-200 ${
              viewport === 'desktop'
                ? 'bg-white shadow-sm text-primary'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
            title="Desktop View">
            <Monitor className="w-4 h-4" />
          </button>
          {/* <button
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded-md flex items-center justify-center transition-all duration-200 ${
              viewport === 'tablet'
                ? 'bg-white shadow-sm text-primary'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
            title="Tablet View">
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-md flex items-center justify-center transition-all duration-200 ${
              viewport === 'mobile'
                ? 'bg-white shadow-sm text-primary'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
            title="Mobile View">
            <Smartphone className="w-4 h-4" />
          </button> */}
        </div>

        {/* Right: CTA Action */}
        <div className="w-full md:w-auto flex justify-end">
          <button
            onClick={() =>
              router.push(`/dashboard/manage-theme?themeId=${themeId}`)
            }
            className="w-full md:w-auto bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95">
            <Check className="w-4 h-4" /> Use This Theme
          </button>
        </div>
      </header>

      {/* Main Content Area with Dynamic Resizing Container */}
      <main className="flex-1 overflow-y-auto bg-[#f1f5f9] p-4 md:p-8 flex justify-center items-start custom-scrollbar">
        <div
          className={`bg-white rounded-t-2xl md:rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform origin-top mx-auto w-full min-h-full md:min-h-200 flex flex-col`}>
          {/* Rendered Template */}
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
            <TemplateRenderer
              templateId={themeId}
              content={template.defaultContent}
              theme={template.defaultTheme}
              view={view}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ThemePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 gap-4">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-medium animate-pulse">
            Preparing preview...
          </p>
        </div>
      }>
      <ThemePreviewContent />
    </Suspense>
  );
}
