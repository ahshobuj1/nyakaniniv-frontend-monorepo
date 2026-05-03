'use client';

import React, {useState, Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import {
  Upload,
  ChevronDown,
  Type,
  Image as ImageIcon,
  Palette,
  Eye,
  Settings2,
} from 'lucide-react';
import TemplateRenderer from '@repo/builder';
import {templates} from '@repo/templates';
import {Content, Theme} from '@repo/types';

// ==========================================
// 1. Section Editor Configuration
// ==========================================
const SECTION_EDITORS: Record<
  string,
  {
    label: string;
    fields: {label: string; key: string; type: 'text' | 'textarea' | 'list'}[];
  }
> = {
  hero: {
    label: 'Hero Section',
    fields: [
      {label: 'Main Title', key: 'heroTitle', type: 'text'},
      {label: 'Sub Description', key: 'heroDescription', type: 'textarea'},
      {label: 'Background Image URL', key: 'heroImage', type: 'text'},
    ],
  },
  'behind-decks': {
    label: 'Behind the Decks',
    fields: [
      {label: 'Section Title', key: 'behindDecksTitle', type: 'text'},
      {label: 'Biography', key: 'behindDecksBio', type: 'textarea'},
      {label: 'Featured Image', key: 'behindDecksImage', type: 'text'},
    ],
  },
  about: {
    label: 'About Section',
    fields: [{label: 'About Content', key: 'aboutText', type: 'textarea'}],
  },
  contact: {
    label: 'Contact Info',
    fields: [
      {label: 'Email Address', key: 'email', type: 'text'},
      {label: 'Phone Number', key: 'phone', type: 'text'},
      {label: 'Location', key: 'location', type: 'text'},
    ],
  },
};

function ManageThemeContent() {
  const searchParams = useSearchParams();
  const themeId = searchParams.get('themeId') || 'azura';
  const template =
    templates[themeId as keyof typeof templates] || templates.azura;

  // State for content and theme settings initialized with template defaults
  const [content, setContent] = useState<Content>(template.defaultContent);
  const [themeSettings, setThemeSettings] = useState<Theme>(
    template.defaultTheme,
  );
  const [view, setView] = useState<'landing' | 'booking'>('landing');

  const handleContentChange = (key: string, value: string) => {
    setContent((prev) => ({...prev, [key]: value}));
  };

  const handleThemeChange = (key: keyof Theme, value: string) => {
    setThemeSettings((prev) => ({...prev, [key]: value}));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-6 font-sans text-slate-800">
      <div className="max-w-425 mx-auto flex flex-col h-[calc(100vh-48px)]">
        {/* Header Bar */}
        <header className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">
                Theme Editor
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Editing:{' '}
                <span className="text-primary">{themeId.toUpperCase()}</span>{' '}
                Template
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4" /> Preview Site
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">
              Save Changes
            </button>
          </div>
        </header>

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* ========================================== */}
          {/* LEFT SIDE: DEVICE PREVIEW (SCROLLABLE) */}
          {/* ========================================== */}
          <div className="flex-1 bg-slate-200/50 rounded-4xl p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200">
            {/* Perspective Background Decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px]" />
            </div>

            {/* Browser/Device Shell */}
            <div className="w-full h-full max-w-300 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative border border-white">
              {/* Browser Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center gap-4 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                </div>
                <div className="flex-1 max-w-md mx-auto h-7 bg-white rounded-lg border border-slate-200 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    https://your-stage-url.upbeat.africa
                  </span>
                </div>
                <div className="w-20" /> {/* Spacer */}
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
                <div className="origin-top transition-transform duration-300">
                  <TemplateRenderer
                    templateId={themeId}
                    content={content}
                    theme={themeSettings}
                    view={view}
                    onViewChange={setView}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT SIDE: EDITOR SIDEBAR */}
          {/* ========================================== */}
          <aside className="w-full lg:w-105 xl:w-120 bg-white rounded-4xl border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden shrink-0">
            {/* Sidebar Tabs/Header */}
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Customize Theme
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Update content and styles below.
              </p>
            </div>

            {/* Scrollable Editor Fields */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
              {/* 1. Global Styles Section */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Palette className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                    Design Tokens
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                      Brand Color
                    </label>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                      <div
                        className="w-10 h-10 rounded-lg shadow-inner relative overflow-hidden border border-white/20"
                        style={{backgroundColor: themeSettings.primaryColor}}>
                        <input
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) =>
                            handleThemeChange('primaryColor', e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 uppercase">
                        {themeSettings.primaryColor}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                      Typography
                    </label>
                    <div className="relative">
                      <select
                        value={themeSettings.fontFamily}
                        onChange={(e) =>
                          handleThemeChange('fontFamily', e.target.value)
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none hover:border-slate-200 transition-colors focus:ring-2 focus:ring-primary/5">
                        <option>Inter</option>
                        <option>Mona Sans</option>
                        <option>Outfit</option>
                        <option>Poppins</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Content Sections */}
              {Object.entries(SECTION_EDITORS).map(([sectionId, config]) => (
                <section key={sectionId}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <Type className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                      {config.label}
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {config.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                          {field.label}
                        </label>
                        {field.type === 'text' ? (
                          <input
                            type="text"
                            value={content[field.key] || ''}
                            onChange={(e) =>
                              handleContentChange(field.key, e.target.value)
                            }
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                          />
                        ) : (
                          <textarea
                            value={content[field.key] || ''}
                            onChange={(e) =>
                              handleContentChange(field.key, e.target.value)
                            }
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 h-32 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all resize-none placeholder:text-slate-300"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {/* 3. Media Assets */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                    Media Library
                  </h3>
                </div>
                <div className="group border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-white hover:border-primary/30 transition-all cursor-pointer">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest mt-4 text-slate-500">
                    Upload New Asset
                  </span>
                </div>
              </section>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 bg-slate-50/80 border-t border-slate-100">
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98]">
                Publish Changes
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

export default function ManageThemePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400 font-medium">
          Loading theme editor...
        </div>
      }>
      <ManageThemeContent />
    </Suspense>
  );
}
