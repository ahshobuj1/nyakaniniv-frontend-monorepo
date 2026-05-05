'use client';

import React, {Suspense} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {ArrowLeft, Check, Laptop, Smartphone, Tablet} from 'lucide-react';
import TemplateRenderer from '@repo/builder';
import {templates} from '@repo/templates';
import {Button} from '@repo/ui';

function ThemePreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeId = searchParams.get('themeId') || 'azura';
  const view = (searchParams.get('view') as 'landing' | 'booking') || 'landing';
  const template = templates[themeId as keyof typeof templates];

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        <p className="text-lg font-semibold">Template not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary font-bold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/')}
            className="p-2 flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            title="Go Back"
            variant="outline"
            size="sm">
            <ArrowLeft className="w-5 h-5" /> Back To Home
          </Button>
          <div>
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Preview Mode: <span className="text-primary">{template.id}</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Viewing theme with default content
            </p>
          </div>
        </div>

        {/* Viewport Switcher (Visual Only) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button className="p-2 bg-white shadow-sm rounded-lg text-slate-900">
            <Laptop className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/50 rounded-lg text-slate-400">
            <Tablet className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/50 rounded-lg text-slate-400">
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              router.push(`/dashboard/manage-theme?themeId=${themeId}`)
            }
            className="bg-primary cursor-pointer hover:bg-primary/80 hover:scale-103 duration-300 text-white px-5 py-3.5 rounded-md text-xs font-bold shadow-md shadow-red-100 transition-all flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> Use This Theme
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-8 lg:p-12">
        <div className="max-w-350 mx-auto bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white">
          <TemplateRenderer
            templateId={themeId}
            content={template.defaultContent}
            theme={template.defaultTheme}
            view={view}
          />
        </div>
      </main>
    </div>
  );
}

export default function ThemePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400">
          Loading preview...
        </div>
      }>
      <ThemePreviewContent />
    </Suspense>
  );
}
