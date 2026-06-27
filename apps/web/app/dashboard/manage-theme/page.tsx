'use client';

import React, {useState, useEffect, useRef, Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import {
  Upload,
  ChevronDown,
  Type,
  Palette,
  Eye,
  Settings2,
  LayoutTemplate,
} from 'lucide-react';
import TemplateRenderer from '@repo/builder';
import {templates} from '@repo/templates';
import {Content, Theme} from '@repo/types';
import {
  useAssignThemeMutation,
  useGetCurrentProfileQuery,
  useUploadTenantMediaMutation,
  useUpdateTenantProfileMutation,
} from '@repo/store';
import { toast } from 'sonner';

// ==========================================
// 0. Custom Image Uploader Component
// ==========================================
function ImageUploader({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [uploadMedia, { isLoading }] = useUploadTenantMediaMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadMedia(file).unwrap();
      if (res.data?.url) {
        onChange(res.data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload image');
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="relative w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="w-full p-2.5 bg-white border border-slate-200 border-dashed hover:border-[#F63131] rounded-lg text-[13px] text-slate-500 flex items-center justify-center gap-2 transition-colors">
          <Upload className="w-4 h-4" />
          {isLoading ? 'Uploading...' : `Upload ${label}`}
        </div>
      </div>
    </div>
  );
}

function GalleryUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploadMedia, { isLoading }] = useUploadTenantMediaMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 5) {
      toast.error('Maximum 5 images allowed in gallery');
      return;
    }

    try {
      const res = await uploadMedia(file).unwrap();
      if (res.data?.url) {
        onChange([...images, res.data.url]);
        toast.success('Image added to gallery');
      }
    } catch (err: any) {
      toast.error('Failed to upload image');
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      {images.map((img, idx) => (
        <div key={idx} className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-lg">
          <img src={img} alt="" className="w-12 h-12 rounded object-cover" />
          <div className="flex-1 flex flex-col gap-1">
            <button onClick={() => moveImage(idx, 'up')} disabled={idx === 0} className="text-[10px] text-slate-500 hover:text-slate-800 disabled:opacity-30">Move Up</button>
            <button onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1} className="text-[10px] text-slate-500 hover:text-slate-800 disabled:opacity-30">Move Down</button>
          </div>
          <button onClick={() => removeImage(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded">X</button>
        </div>
      ))}
      {images.length < 5 && (
        <div className="relative w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-full p-2.5 bg-white border border-slate-200 border-dashed hover:border-[#F63131] rounded-lg text-[13px] text-slate-500 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            {isLoading ? 'Uploading...' : 'Add Gallery Image'}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper for nested objects
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

function ManageThemeContent() {
  const searchParams = useSearchParams();
  const themeId = searchParams.get('themeId') || 'azura';
  const template =
    templates[themeId as keyof typeof templates] || templates.azura;

  const SECTION_EDITORS = template.editorConfig || {};

  // Fetch current user config
  const { data: userRes, isLoading: isUserLoading } = useGetCurrentProfileQuery();
  const tenant = userRes?.data?.tenant;
  const tenantConfig = tenant?.config;
  const subdomain = tenant?.subdomain || 'your-stage-url';

  // Content & Theme State
  const [content, setContent] = useState<Content>(template.defaultContent);
  const [themeSettings, setThemeSettings] = useState<Theme>(template.defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !isInitialized && userRes?.data) {
      const currentTenant = userRes.data.tenant;
      const currentConfig = currentTenant?.config;
      
      const mergedContent = {
        ...template.defaultContent,
        ...currentConfig?.content,
        djName: currentTenant?.stageName || currentConfig?.content?.djName || template.defaultContent.djName || 'DJ AURA',
        navbar: {
          ...template.defaultContent.navbar,
          ...currentConfig?.content?.navbar,
          djName: currentTenant?.stageName || currentConfig?.content?.navbar?.djName || template.defaultContent.navbar?.djName || 'KENZO',
        },
        instagram: currentTenant?.socialLinks?.instagram || currentConfig?.content?.instagram || template.defaultContent.instagram || '#',
        facebook: currentTenant?.socialLinks?.facebook || currentConfig?.content?.facebook || template.defaultContent.facebook || '#',
        linkedin: currentTenant?.socialLinks?.linkedin || currentConfig?.content?.linkedin || template.defaultContent.linkedin || '#',
        social: {
          ...template.defaultContent.social,
          ...currentConfig?.content?.social,
          instagram: currentTenant?.socialLinks?.instagram || currentConfig?.content?.social?.instagram || template.defaultContent.social?.instagram || '#',
          facebook: currentTenant?.socialLinks?.facebook || currentConfig?.content?.social?.facebook || template.defaultContent.social?.facebook || '#',
          linkedin: currentTenant?.socialLinks?.linkedin || currentConfig?.content?.social?.linkedin || template.defaultContent.social?.linkedin || '#',
        },
        footer: {
          ...template.defaultContent.footer,
          ...currentConfig?.content?.footer,
          logoText: currentTenant?.stageName || currentConfig?.content?.footer?.logoText || template.defaultContent.footer?.logoText || 'DJ AURA',
        },
        mixes: currentTenant?.mixTapes?.length ? currentTenant.mixTapes.map(m => ({
          img: m.coverUrl || template.defaultContent.heroImage || '/theme/aura/mixes-video-avator-1.png',
          title: m.title,
          genre: 'Various',
          time: '00:00',
          audioUrl: m.audioUrl,
        })) : template.defaultContent.mixes || [],
        latestMixes: {
          ...template.defaultContent.latestMixes,
          tracks: currentTenant?.mixTapes?.length ? currentTenant.mixTapes.map((m, i) => ({
            id: m.id || i,
            title: m.title,
            genre: 'Various',
            duration: '00:00',
            currentTime: '00:00',
            progress: 0,
            audioUrl: m.audioUrl,
            coverImage: m.coverUrl || template.defaultContent.heroImage,
          })) : template.defaultContent.latestMixes?.tracks || [],
        },
        events: {
          ...template.defaultContent.events,
          list: currentTenant?.events?.length ? currentTenant.events.map((e, i) => ({
            id: e.id || i,
            day: e.eventDate ? new Date(e.eventDate).toLocaleDateString('en-US', { day: '2-digit' }) : '',
            month: e.eventDate ? new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '',
            date: e.eventDate ? new Date(e.eventDate).toLocaleDateString() : '',
            title: e.title,
            venue: e.venueName,
            location: e.venueAddress,
            ticketUrl: '#',
          })) : template.defaultContent.events?.list || [],
        }
      };

      setContent(mergedContent);

      if (currentConfig?.theme) {
        setThemeSettings({ ...template.defaultTheme, ...currentConfig.theme });
      }
      setIsInitialized(true);
    }
  }, [userRes, isUserLoading, isInitialized, template]);

  const [view, setView] = useState<'landing' | 'booking'>('landing');

  // UX Enhancements State
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [expandedSection, setExpandedSection] = useState<string>('hero');

  // Desktop Scaling State
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // APIs
  const [assignTheme, { isLoading: isAssigning }] = useAssignThemeMutation();
  const [updateTenantProfile] = useUpdateTenantProfileMutation();

  const handlePublish = async () => {
    try {
      // Extract Stage Name and Social Links to save globally
      const stageName = content.djName || content.navbar?.djName || tenant?.stageName;
      const socialLinks = {
        instagram: content.instagram || content.social?.instagram || tenant?.socialLinks?.instagram || '',
        facebook: content.facebook || content.social?.facebook || tenant?.socialLinks?.facebook || '',
        linkedin: content.linkedin || content.social?.linkedin || tenant?.socialLinks?.linkedin || '',
      };

      // Clean up local content so it doesn't override globally managed fields
      const configContentToSave = JSON.parse(JSON.stringify(content));
      delete configContentToSave.djName;
      if (configContentToSave.navbar) delete configContentToSave.navbar.djName;
      delete configContentToSave.instagram;
      delete configContentToSave.facebook;
      delete configContentToSave.linkedin;
      if (configContentToSave.social) {
        delete configContentToSave.social.instagram;
        delete configContentToSave.social.facebook;
        delete configContentToSave.social.linkedin;
      }

      await assignTheme({ 
        themeSlug: themeId, 
        config: { content: configContentToSave, theme: themeSettings } 
      }).unwrap();

      // Save globally
      if (stageName || socialLinks.instagram || socialLinks.facebook || socialLinks.linkedin) {
        await updateTenantProfile({
          stageName,
          socialLinks,
        }).unwrap();
      }

      toast.success('Theme published successfully!');
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to publish theme');
    }
  };

  // Dynamic Scale Calculator (Webflow/Framer style)
  useEffect(() => {
    if (!previewContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const {width} = entries[0].contentRect;
      // Target Desktop Width is 1280px
      setPreviewScale(width / 1280);
    });

    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleContentChange = (key: string, value: string | string[]) => {
    setContent((prev) => {
      const keys = key.split('.');
      if (keys.length === 1) {
        return { ...prev, [key]: value };
      }
      
      // Deep clone to avoid mutating state directly
      const newContent = JSON.parse(JSON.stringify(prev));
      let current = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) current[k] = {};
        current = current[k];
      }
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const handleThemeChange = (key: keyof Theme, value: string) => {
    setThemeSettings((prev) => ({...prev, [key]: value}));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-2 lg:p-4 font-sans text-slate-800 flex flex-col">
      <div className="w-full mx-auto flex flex-col h-[calc(100vh-32px)]">
        {/* Header Bar */}
        <header className="flex items-center justify-between mb-4 shrink-0 px-2">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
              <Settings2 className="w-5 h-5 text-[#F63131]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">
                Theme Editor
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Editing:{' '}
                <span className="text-[#F63131]">{themeId.toUpperCase()}</span>{' '}
                Template
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <a href={`http://localhost:3000/${subdomain}`} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4" /> Preview Site
            </a> */}
            {/* <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" /> */}
            <button 
              onClick={handlePublish}
              disabled={isAssigning}
              className="bg-[#111620] hover:bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-70"
            >
              {isAssigning ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* ========================================== */}
          {/* LEFT SIDE: DEVICE PREVIEW (Scaled 1280px)  */}
          {/* ========================================== */}
          <div className="flex-1 bg-slate-200/50 rounded-2xl p-4 flex flex-col relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px]" />
            </div>

            <div className="w-full h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative border border-white">
              {/* Browser Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-4 shrink-0 z-10 relative">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                </div>
                <div className="flex-1 max-w-md mx-auto h-7 bg-white rounded-lg border border-slate-200 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    https://{subdomain}.upbeat.africa
                  </span>
                </div>
                <div className="w-16" />
              </div>

              {/* Scaled Desktop Preview Area */}
              <div
                ref={previewContainerRef}
                className="flex-1 overflow-hidden relative bg-slate-50">
                <div
                  className="absolute top-0 left-0 origin-top-left overflow-y-auto bg-white custom-scrollbar"
                  style={{
                    width: '1280px',
                    height:
                      previewScale > 0 ? `${100 / previewScale}%` : '100%',
                    transform: `scale(${previewScale})`,
                  }}>
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
          {/* RIGHT SIDE: SMART EDITOR SIDEBAR */}
          {/* ========================================== */}
          <aside className="w-full lg:w-85 xl:w-95 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden shrink-0">
            {/* Tabs Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex p-1 bg-slate-100/80 rounded-xl">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[13px] font-bold rounded-lg transition-all ${
                    activeTab === 'content'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  <LayoutTemplate className="w-4 h-4" />
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[13px] font-bold rounded-lg transition-all ${
                    activeTab === 'design'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  <Palette className="w-4 h-4" />
                  Design
                </button>
              </div>
            </div>

            {/* Scrollable Editor Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* TAB 1: CONTENT EDITOR */}
              {activeTab === 'content' && (
                <div className="space-y-3">
                  {Object.entries(SECTION_EDITORS).map(
                    ([sectionId, config]) => (
                      <div
                        key={sectionId}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() =>
                            setExpandedSection(
                              expandedSection === sectionId ? '' : sectionId,
                            )
                          }
                          className={`w-full flex items-center justify-between p-3.5 transition-colors ${
                            expandedSection === sectionId
                              ? 'bg-slate-50'
                              : 'hover:bg-slate-50'
                          }`}>
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-md ${expandedSection === sectionId ? 'bg-[#F63131]/10 text-[#F63131]' : 'bg-slate-100 text-slate-500'}`}>
                              <Type className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[13px] font-bold text-slate-800">
                              {config.label}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${expandedSection === sectionId ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {expandedSection === sectionId && (
                          <div className="p-4 pt-2 space-y-4 bg-slate-50 border-t border-slate-100">
                            {config.fields.map((field) => (
                              <div key={field.key} className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">
                                  {field.label}
                                </label>
                                {field.type === 'text' ? (
                                  <input
                                    type="text"
                                    value={getNestedValue(content, field.key) || ''}
                                    onChange={(e) =>
                                      handleContentChange(
                                        field.key,
                                        e.target.value,
                                      )
                                    }
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:ring-2 focus:ring-[#F63131]/20 focus:border-[#F63131] outline-none transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                  />
                                ) : field.type === 'textarea' ? (
                                  <textarea
                                    value={getNestedValue(content, field.key) || ''}
                                    onChange={(e) =>
                                      handleContentChange(
                                        field.key,
                                        e.target.value,
                                      )
                                    }
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 h-24 focus:ring-2 focus:ring-[#F63131]/20 focus:border-[#F63131] outline-none transition-all resize-none placeholder:text-slate-300 shadow-sm"
                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                  />
                                ) : field.type === 'image' ? (
                                  <ImageUploader
                                    value={getNestedValue(content, field.key) || ''}
                                    onChange={(url) => handleContentChange(field.key, url)}
                                    label={field.label}
                                  />
                                ) : field.type === 'gallery' ? (
                                  <GalleryUploader
                                    images={getNestedValue(content, field.key) || []}
                                    onChange={(urls) => handleContentChange(field.key, urls)}
                                  />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* TAB 2: DESIGN & MEDIA */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  {/* Brand Color Section */}
                  <section className="p-5 border border-slate-200 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[14px] font-bold text-slate-800">
                        Brand Color
                      </h3>
                      <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase border border-slate-200">
                        {themeSettings.primaryColor}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Custom Color Picker */}
                      <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div
                          className="w-12 h-12 rounded-full shadow-inner relative overflow-hidden border-2 border-white ring-1 ring-black/10 shrink-0"
                          style={{backgroundColor: themeSettings.primaryColor}}>
                          <input
                            type="color"
                            value={themeSettings.primaryColor}
                            onChange={(e) =>
                              handleThemeChange('primaryColor', e.target.value)
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer scale-150"
                          />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-700">
                            Custom Color
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Click circle to pick
                          </p>
                        </div>
                      </div>

                      {/* Quick Presets */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                          Quick Presets
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {[
                            '#F63131',
                            '#10B981',
                            '#3B82F6',
                            '#8B5CF6',
                            '#F59E0B',
                            '#111620',
                          ].map((color) => {
                            const isActive =
                              themeSettings.primaryColor.toUpperCase() ===
                              color.toUpperCase();
                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() =>
                                  handleThemeChange('primaryColor', color)
                                }
                                className={`w-8 h-8 rounded-full shadow-sm relative transition-all duration-200 flex items-center justify-center
                                  ${isActive ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110 ring-1 ring-black/10'}
                                `}
                                style={{backgroundColor: color}}>
                                {isActive && (
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Typography Section */}
                  <section className="p-5 border border-slate-200 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
                    <div className="mb-2">
                      <h3 className="text-[14px] font-bold text-slate-800">
                        Typography
                      </h3>
                      <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                        Select the primary font family
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {['Inter', 'Mona Sans', 'Outfit', 'Poppins'].map(
                        (font) => {
                          const isActive = themeSettings.fontFamily === font;
                          return (
                            <button
                              key={font}
                              type="button"
                              onClick={() =>
                                handleThemeChange('fontFamily', font)
                              }
                              className={`p-4 text-left rounded-xl transition-all duration-200 border group
                              ${
                                isActive
                                  ? 'border-[#F63131] bg-[#F63131]/5 shadow-sm ring-1 ring-[#F63131]'
                                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                              }
                            `}>
                              <div
                                className={`text-[20px] mb-2 transition-colors ${isActive ? 'text-[#F63131]' : 'text-slate-700 group-hover:text-slate-900'}`}
                                style={{fontFamily: font, fontWeight: 600}}>
                                Aa
                              </div>
                              <div
                                className={`text-[12px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                {font}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </section>

                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <button 
                onClick={handlePublish}
                disabled={isAssigning}
                className="w-full bg-[#F63131] hover:bg-[#F63131]/90 text-white py-3 rounded-xl text-[13px] font-bold shadow-lg shadow-[#F63131]/20 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isAssigning ? 'Publishing...' : 'Publish Changes'}
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
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
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

// ====================================
// ====================================
// ====================================
// ====================================
// ====================================
// ====================================
// ====================================
// ====================================
// ====================================
// ====================================

// 'use client';

// import {Suspense, useState} from 'react';
// import {useSearchParams} from 'next/navigation';
// import {
//   Upload,
//   ChevronDown,
//   Type,
//   Palette,
//   Eye,
//   Settings2,
//   LayoutTemplate,
// } from 'lucide-react';
// import TemplateRenderer from '@repo/builder';
// import {templates} from '@repo/templates';
// import {Content, Theme} from '@repo/types';

// // ==========================================
// // 1. Section Editor Configuration
// // ==========================================
// const SECTION_EDITORS: Record<
//   string,
//   {
//     label: string;
//     fields: {label: string; key: string; type: 'text' | 'textarea' | 'list'}[];
//   }
// > = {
//   hero: {
//     label: 'Hero Section',
//     fields: [
//       {label: 'Main Title', key: 'heroTitle', type: 'text'},
//       {label: 'Sub Description', key: 'heroDescription', type: 'textarea'},
//       {label: 'Background Image URL', key: 'heroImage', type: 'text'},
//     ],
//   },
//   'behind-decks': {
//     label: 'Behind the Decks',
//     fields: [
//       {label: 'Section Title', key: 'behindDecksTitle', type: 'text'},
//       {label: 'Biography', key: 'behindDecksBio', type: 'textarea'},
//       {label: 'Featured Image', key: 'behindDecksImage', type: 'text'},
//     ],
//   },
//   about: {
//     label: 'About Section',
//     fields: [{label: 'About Content', key: 'aboutText', type: 'textarea'}],
//   },
//   contact: {
//     label: 'Contact Info',
//     fields: [
//       {label: 'Email Address', key: 'email', type: 'text'},
//       {label: 'Phone Number', key: 'phone', type: 'text'},
//       {label: 'Location', key: 'location', type: 'text'},
//     ],
//   },
// };

// function ManageThemeContent() {
//   const searchParams = useSearchParams();
//   const themeId = searchParams.get('themeId') || 'azura';
//   const template =
//     templates[themeId as keyof typeof templates] || templates.azura;

//   // State
//   const [content, setContent] = useState<Content>(template.defaultContent);
//   const [themeSettings, setThemeSettings] = useState<Theme>(
//     template.defaultTheme,
//   );
//   const [view, setView] = useState<'landing' | 'booking'>('landing');

//   // UX Enhancements State
//   const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
//   const [expandedSection, setExpandedSection] = useState<string>('hero');

//   const handleContentChange = (key: string, value: string) => {
//     setContent((prev) => ({...prev, [key]: value}));
//   };

//   const handleThemeChange = (key: keyof Theme, value: string) => {
//     setThemeSettings((prev) => ({...prev, [key]: value}));
//   };

//   return (
//     // FIX: Reduced overall padding (p-2 lg:p-4) to maximize screen usage
//     <div className="min-h-screen bg-[#f8fafc] p-2 lg:p-4 font-sans text-slate-800">
//       {/* FIX: Removed max-w limit so it takes full width of the screen */}
//       <div className="w-full mx-auto flex flex-col h-[calc(100vh-32px)]">
//         {/* Header Bar */}
//         <header className="flex items-center justify-between mb-4 shrink-0 px-2">
//           <div className="flex items-center gap-4">
//             <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
//               <Settings2 className="w-5 h-5 text-[#F63131]" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-slate-900 leading-none">
//                 Theme Editor
//               </h1>
//               <p className="text-xs text-slate-500 mt-1.5 font-medium">
//                 Editing:{' '}
//                 <span className="text-[#F63131]">{themeId.toUpperCase()}</span>{' '}
//                 Template
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
//               <Eye className="w-4 h-4" /> Preview Site
//             </button>
//             <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
//             <button className="bg-[#111620] hover:bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">
//               Save Changes
//             </button>
//           </div>
//         </header>

//         {/* Main Work Area */}
//         <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
//           {/* ========================================== */}
//           {/* LEFT SIDE: DEVICE PREVIEW (Maximized) */}
//           {/* ========================================== */}
//           {/* FIX: Reduced padding inside preview container (p-4 instead of p-10) */}
//           <div className="flex-1 bg-slate-200/50 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200">
//             <div className="absolute inset-0 opacity-10 pointer-events-none">
//               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:20px_20px]" />
//             </div>

//             {/* FIX: Increased max-w to 1400px so the site renders much larger */}
//             <div className="w-full h-full max-w-[1400px] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative border border-white">
//               <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-4 shrink-0">
//                 <div className="flex gap-1.5">
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                 </div>
//                 <div className="flex-1 max-w-md mx-auto h-7 bg-white rounded-lg border border-slate-200 flex items-center px-3 gap-2">
//                   <div className="w-2 h-2 rounded-full bg-[#10B981]" />
//                   <span className="text-[10px] text-slate-400 font-mono truncate">
//                     https://your-stage-url.upbeat.africa
//                   </span>
//                 </div>
//                 <div className="w-16" />
//               </div>

//               <div className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
//                 <div className="origin-top transition-transform duration-300">
//                   <TemplateRenderer
//                     templateId={themeId}
//                     content={content}
//                     theme={themeSettings}
//                     view={view}
//                     onViewChange={setView}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ========================================== */}
//           {/* RIGHT SIDE: SMART EDITOR SIDEBAR (Optimized Width) */}
//           {/* ========================================== */}
//           {/* FIX: Reduced sidebar width from 450px to 360px/380px */}
//           <aside className="w-full lg:w-[340px] xl:w-[380px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden shrink-0">
//             {/* Tabs Header */}
//             <div className="p-4 border-b border-slate-100 bg-slate-50/50">
//               <div className="flex p-1 bg-slate-100/80 rounded-xl">
//                 <button
//                   onClick={() => setActiveTab('content')}
//                   className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[13px] font-bold rounded-lg transition-all ${
//                     activeTab === 'content'
//                       ? 'bg-white text-slate-900 shadow-sm'
//                       : 'text-slate-500 hover:text-slate-700'
//                   }`}>
//                   <LayoutTemplate className="w-4 h-4" />
//                   Content
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('design')}
//                   className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[13px] font-bold rounded-lg transition-all ${
//                     activeTab === 'design'
//                       ? 'bg-white text-slate-900 shadow-sm'
//                       : 'text-slate-500 hover:text-slate-700'
//                   }`}>
//                   <Palette className="w-4 h-4" />
//                   Design
//                 </button>
//               </div>
//             </div>

//             {/* Scrollable Editor Area */}
//             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//               {/* TAB 1: CONTENT EDITOR */}
//               {activeTab === 'content' && (
//                 <div className="space-y-3">
//                   {Object.entries(SECTION_EDITORS).map(
//                     ([sectionId, config]) => (
//                       <div
//                         key={sectionId}
//                         className="border border-slate-200 rounded-xl overflow-hidden bg-white">
//                         <button
//                           onClick={() =>
//                             setExpandedSection(
//                               expandedSection === sectionId ? '' : sectionId,
//                             )
//                           }
//                           className={`w-full flex items-center justify-between p-3.5 transition-colors ${
//                             expandedSection === sectionId
//                               ? 'bg-slate-50'
//                               : 'hover:bg-slate-50'
//                           }`}>
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`p-1.5 rounded-md ${expandedSection === sectionId ? 'bg-[#F63131]/10 text-[#F63131]' : 'bg-slate-100 text-slate-500'}`}>
//                               <Type className="w-3.5 h-3.5" />
//                             </div>
//                             <span className="text-[13px] font-bold text-slate-800">
//                               {config.label}
//                             </span>
//                           </div>
//                           <ChevronDown
//                             className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${expandedSection === sectionId ? 'rotate-180' : ''}`}
//                           />
//                         </button>

//                         {expandedSection === sectionId && (
//                           <div className="p-4 pt-2 space-y-4 bg-slate-50 border-t border-slate-100">
//                             {config.fields.map((field) => (
//                               <div key={field.key} className="space-y-1.5">
//                                 <label className="text-[11px] font-bold text-slate-500 ml-1">
//                                   {field.label}
//                                 </label>
//                                 {field.type === 'text' ? (
//                                   <input
//                                     type="text"
//                                     value={content[field.key] || ''}
//                                     onChange={(e) =>
//                                       handleContentChange(
//                                         field.key,
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:ring-2 focus:ring-[#F63131]/20 focus:border-[#F63131] outline-none transition-all placeholder:text-slate-300 shadow-sm"
//                                     placeholder={`Enter ${field.label.toLowerCase()}...`}
//                                   />
//                                 ) : (
//                                   <textarea
//                                     value={content[field.key] || ''}
//                                     onChange={(e) =>
//                                       handleContentChange(
//                                         field.key,
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 h-24 focus:ring-2 focus:ring-[#F63131]/20 focus:border-[#F63131] outline-none transition-all resize-none placeholder:text-slate-300 shadow-sm"
//                                     placeholder={`Enter ${field.label.toLowerCase()}...`}
//                                   />
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ),
//                   )}
//                 </div>
//               )}

//               {/* TAB 2: DESIGN & MEDIA */}
//               {activeTab === 'design' && (
//                 <div className="space-y-5">
//                   {/* Brand Color Section */}
//                   <section className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[13px] font-bold text-slate-800">
//                         Brand Color
//                       </h3>
//                       <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase border border-slate-200">
//                         {themeSettings.primaryColor}
//                       </span>
//                     </div>

//                     <div className="flex flex-col gap-4">
//                       <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
//                         <div
//                           className="w-10 h-10 rounded-full shadow-inner relative overflow-hidden border-2 border-white ring-1 ring-black/10 shrink-0"
//                           style={{backgroundColor: themeSettings.primaryColor}}>
//                           <input
//                             type="color"
//                             value={themeSettings.primaryColor}
//                             onChange={(e) =>
//                               handleThemeChange('primaryColor', e.target.value)
//                             }
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer scale-150"
//                           />
//                         </div>
//                         <div>
//                           <p className="text-[12px] font-bold text-slate-700">
//                             Custom Color
//                           </p>
//                           <p className="text-[10px] text-slate-500 font-medium">
//                             Click circle to pick
//                           </p>
//                         </div>
//                       </div>

//                       <div>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
//                           Quick Presets
//                         </p>
//                         <div className="flex flex-wrap gap-2.5">
//                           {[
//                             '#F63131',
//                             '#10B981',
//                             '#3B82F6',
//                             '#8B5CF6',
//                             '#F59E0B',
//                             '#111620',
//                           ].map((color) => {
//                             const isActive =
//                               themeSettings.primaryColor.toUpperCase() ===
//                               color.toUpperCase();
//                             return (
//                               <button
//                                 key={color}
//                                 type="button"
//                                 onClick={() =>
//                                   handleThemeChange('primaryColor', color)
//                                 }
//                                 className={`w-7 h-7 rounded-full shadow-sm relative transition-all duration-200 flex items-center justify-center
//                                   ${isActive ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110 ring-1 ring-black/10'}
//                                 `}
//                                 style={{backgroundColor: color}}>
//                                 {isActive && (
//                                   <svg
//                                     className="w-3.5 h-3.5 text-white"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor">
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={3}
//                                       d="M5 13l4 4L19 7"
//                                     />
//                                   </svg>
//                                 )}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   </section>

//                   {/* Typography Section */}
//                   <section className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3">
//                     <div className="mb-2">
//                       <h3 className="text-[13px] font-bold text-slate-800">
//                         Typography
//                       </h3>
//                       <p className="text-[11px] text-slate-500 font-medium mt-0.5">
//                         Select the primary font family
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2.5">
//                       {['Inter', 'Mona Sans', 'Outfit', 'Poppins'].map(
//                         (font) => {
//                           const isActive = themeSettings.fontFamily === font;
//                           return (
//                             <button
//                               key={font}
//                               type="button"
//                               onClick={() =>
//                                 handleThemeChange('fontFamily', font)
//                               }
//                               className={`p-3 text-left rounded-lg transition-all duration-200 border group
//                               ${
//                                 isActive
//                                   ? 'border-[#F63131] bg-[#F63131]/5 shadow-sm ring-1 ring-[#F63131]'
//                                   : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
//                               }
//                             `}>
//                               <div
//                                 className={`text-[18px] mb-1.5 transition-colors ${isActive ? 'text-[#F63131]' : 'text-slate-700 group-hover:text-slate-900'}`}
//                                 style={{fontFamily: font, fontWeight: 600}}>
//                                 Aa
//                               </div>
//                               <div
//                                 className={`text-[11px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
//                                 {font}
//                               </div>
//                             </button>
//                           );
//                         },
//                       )}
//                     </div>
//                   </section>

//                   {/* Media Library */}
//                   <section className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
//                     <div className="mb-3">
//                       <h3 className="text-[13px] font-bold text-slate-800">
//                         Media Library
//                       </h3>
//                     </div>

//                     <div className="group border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-[#F63131]/5 hover:border-[#F63131]/30 transition-all cursor-pointer">
//                       <div className="p-2.5 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 group-hover:text-[#F63131] transition-transform">
//                         <Upload className="w-4 h-4" />
//                       </div>
//                       <span className="text-[11px] font-bold uppercase tracking-widest mt-3 text-slate-500 group-hover:text-[#F63131]">
//                         Upload Asset
//                       </span>
//                     </div>
//                   </section>
//                 </div>
//               )}
//             </div>

//             {/* Sidebar Footer */}
//             <div className="p-4 bg-white border-t border-slate-100 shrink-0">
//               <button className="w-full bg-[#F63131] hover:bg-[#F63131]/90 text-white py-3 rounded-xl text-[13px] font-bold shadow-lg shadow-[#F63131]/20 transition-all active:scale-[0.98]">
//                 Publish Changes
//               </button>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default function ManageThemePage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400 font-medium">
//           Loading theme editor...
//         </div>
//       }>
//       <ManageThemeContent />
//     </Suspense>
//   );
// }

// 'use client';

// import React, {useState, Suspense} from 'react';
// import {useSearchParams} from 'next/navigation';
// import {
//   Upload,
//   ChevronDown,
//   Type,
//   Palette,
//   Eye,
//   Settings2,
//   LayoutTemplate,
// } from 'lucide-react';
// import TemplateRenderer from '@repo/builder';
// import {templates} from '@repo/templates';
// import {Content, Theme} from '@repo/types';

// // ==========================================
// // 1. Section Editor Configuration
// // ==========================================
// const SECTION_EDITORS: Record<
//   string,
//   {
//     label: string;
//     fields: {label: string; key: string; type: 'text' | 'textarea' | 'list'}[];
//   }
// > = {
//   hero: {
//     label: 'Hero Section',
//     fields: [
//       {label: 'Main Title', key: 'heroTitle', type: 'text'},
//       {label: 'Sub Description', key: 'heroDescription', type: 'textarea'},
//       {label: 'Background Image URL', key: 'heroImage', type: 'text'},
//     ],
//   },
//   'behind-decks': {
//     label: 'Behind the Decks',
//     fields: [
//       {label: 'Section Title', key: 'behindDecksTitle', type: 'text'},
//       {label: 'Biography', key: 'behindDecksBio', type: 'textarea'},
//       {label: 'Featured Image', key: 'behindDecksImage', type: 'text'},
//     ],
//   },
//   about: {
//     label: 'About Section',
//     fields: [{label: 'About Content', key: 'aboutText', type: 'textarea'}],
//   },
//   contact: {
//     label: 'Contact Info',
//     fields: [
//       {label: 'Email Address', key: 'email', type: 'text'},
//       {label: 'Phone Number', key: 'phone', type: 'text'},
//       {label: 'Location', key: 'location', type: 'text'},
//     ],
//   },
// };

// function ManageThemeContent() {
//   const searchParams = useSearchParams();
//   const themeId = searchParams.get('themeId') || 'azura';
//   const template =
//     templates[themeId as keyof typeof templates] || templates.azura;

//   // State
//   const [content, setContent] = useState<Content>(template.defaultContent);
//   const [themeSettings, setThemeSettings] = useState<Theme>(
//     template.defaultTheme,
//   );
//   const [view, setView] = useState<'landing' | 'booking'>('landing');

//   // UX Enhancements State
//   const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
//   const [expandedSection, setExpandedSection] = useState<string>('hero');

//   const handleContentChange = (key: string, value: string) => {
//     setContent((prev) => ({...prev, [key]: value}));
//   };

//   const handleThemeChange = (key: keyof Theme, value: string) => {
//     setThemeSettings((prev) => ({...prev, [key]: value}));
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-6 font-sans text-slate-800">
//       <div className="max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-48px)]">
//         {/* Header Bar */}
//         <header className="flex items-center justify-between mb-6 shrink-0">
//           <div className="flex items-center gap-4">
//             <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
//               <Settings2 className="w-5 h-5 text-[#F63131]" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-slate-900 leading-none">
//                 Theme Editor
//               </h1>
//               <p className="text-xs text-slate-500 mt-1.5 font-medium">
//                 Editing:{' '}
//                 <span className="text-[#F63131]">{themeId.toUpperCase()}</span>{' '}
//                 Template
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
//               <Eye className="w-4 h-4" /> Preview Site
//             </button>
//             <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
//             <button className="bg-[#111620] hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">
//               Save Changes
//             </button>
//           </div>
//         </header>

//         {/* Main Work Area */}
//         <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
//           {/* ========================================== */}
//           {/* LEFT SIDE: DEVICE PREVIEW */}
//           {/* ========================================== */}
//           <div className="flex-1 bg-slate-200/50 rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200">
//             <div className="absolute inset-0 opacity-10 pointer-events-none">
//               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:20px_20px]" />
//             </div>

//             <div className="w-full h-full max-w-4xl bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative border border-white">
//               <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center gap-4 shrink-0">
//                 <div className="flex gap-1.5">
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                 </div>
//                 <div className="flex-1 max-w-md mx-auto h-7 bg-white rounded-lg border border-slate-200 flex items-center px-3 gap-2">
//                   <div className="w-2 h-2 rounded-full bg-[#10B981]" />
//                   <span className="text-[10px] text-slate-400 font-mono truncate">
//                     https://your-stage-url.upbeat.africa
//                   </span>
//                 </div>
//                 <div className="w-20" />
//               </div>

//               <div className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
//                 <div className="origin-top transition-transform duration-300">
//                   <TemplateRenderer
//                     templateId={themeId}
//                     content={content}
//                     theme={themeSettings}
//                     view={view}
//                     onViewChange={setView}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ========================================== */}
//           {/* RIGHT SIDE: SMART EDITOR SIDEBAR */}
//           {/* ========================================== */}
//           <aside className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden shrink-0">
//             {/* Tabs Header */}
//             <div className="p-4 border-b border-slate-100 bg-slate-50/50">
//               <div className="flex p-1 bg-slate-100/80 rounded-xl">
//                 <button
//                   onClick={() => setActiveTab('content')}
//                   className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-bold rounded-lg transition-all ${
//                     activeTab === 'content'
//                       ? 'bg-white text-slate-900 shadow-sm'
//                       : 'text-slate-500 hover:text-slate-700'
//                   }`}>
//                   <LayoutTemplate className="w-4 h-4" />
//                   Content
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('design')}
//                   className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-bold rounded-lg transition-all ${
//                     activeTab === 'design'
//                       ? 'bg-white text-slate-900 shadow-sm'
//                       : 'text-slate-500 hover:text-slate-700'
//                   }`}>
//                   <Palette className="w-4 h-4" />
//                   Design
//                 </button>
//               </div>
//             </div>

//             {/* Scrollable Editor Area */}
//             <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
//               {/* TAB 1: CONTENT EDITOR (Accordion Style) */}
//               {activeTab === 'content' && (
//                 <div className="space-y-3">
//                   {Object.entries(SECTION_EDITORS).map(
//                     ([sectionId, config]) => (
//                       <div
//                         key={sectionId}
//                         className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
//                         {/* Accordion Header */}
//                         <button
//                           onClick={() =>
//                             setExpandedSection(
//                               expandedSection === sectionId ? '' : sectionId,
//                             )
//                           }
//                           className={`w-full flex items-center justify-between p-4 transition-colors ${
//                             expandedSection === sectionId
//                               ? 'bg-slate-50'
//                               : 'hover:bg-slate-50'
//                           }`}>
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`p-1.5 rounded-lg ${expandedSection === sectionId ? 'bg-[#F63131]/10 text-[#F63131]' : 'bg-slate-100 text-slate-500'}`}>
//                               <Type className="w-4 h-4" />
//                             </div>
//                             <span className="text-[14px] font-bold text-slate-800">
//                               {config.label}
//                             </span>
//                           </div>
//                           <ChevronDown
//                             className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${expandedSection === sectionId ? 'rotate-180' : ''}`}
//                           />
//                         </button>

//                         {/* Accordion Body */}
//                         {expandedSection === sectionId && (
//                           <div className="p-4 pt-2 space-y-4 bg-slate-50 border-t border-slate-100">
//                             {config.fields.map((field) => (
//                               <div key={field.key} className="space-y-1.5">
//                                 <label className="text-[12px] font-bold text-slate-500 ml-1">
//                                   {field.label}
//                                 </label>
//                                 {field.type === 'text' ? (
//                                   <input
//                                     type="text"
//                                     value={content[field.key] || ''}
//                                     onChange={(e) =>
//                                       handleContentChange(
//                                         field.key,
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:ring-2 focus:ring-[#F63131]/20 focus:border-[#F63131] outline-none transition-all placeholder:text-slate-300 shadow-sm"
//                                     placeholder={`Enter ${field.label.toLowerCase()}...`}
//                                   />
//                                 ) : (
//                                   <textarea
//                                     value={content[field.key] || ''}
//                                     onChange={(e) =>
//                                       handleContentChange(
//                                         field.key,
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 h-28 focus:ring-2 focus:ring-[#F63131]/20 focus:border-[#F63131] outline-none transition-all resize-none placeholder:text-slate-300 shadow-sm"
//                                     placeholder={`Enter ${field.label.toLowerCase()}...`}
//                                   />
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ),
//                   )}
//                 </div>
//               )}

//               {/* TAB 2: DESIGN & MEDIA */}
//               {/* TAB 2: DESIGN & MEDIA */}
//               {activeTab === 'design' && (
//                 <div className="space-y-6">
//                   {/* 1. Brand Color Section */}
//                   <section className="p-5 border border-slate-200 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] font-bold text-slate-800">
//                         Brand Color
//                       </h3>
//                       <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase border border-slate-200">
//                         {themeSettings.primaryColor}
//                       </span>
//                     </div>

//                     <div className="flex flex-col gap-4">
//                       {/* Custom Color Picker with Active Preview */}
//                       <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
//                         <div
//                           className="w-12 h-12 rounded-full shadow-inner relative overflow-hidden border-2 border-white ring-1 ring-black/10 shrink-0"
//                           style={{backgroundColor: themeSettings.primaryColor}}>
//                           <input
//                             type="color"
//                             value={themeSettings.primaryColor}
//                             onChange={(e) =>
//                               handleThemeChange('primaryColor', e.target.value)
//                             }
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer scale-150"
//                           />
//                         </div>
//                         <div>
//                           <p className="text-[13px] font-bold text-slate-700">
//                             Custom Color
//                           </p>
//                           <p className="text-[11px] text-slate-500 font-medium">
//                             Click circle to pick
//                           </p>
//                         </div>
//                       </div>

//                       {/* Quick Presets */}
//                       <div>
//                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
//                           Quick Presets
//                         </p>
//                         <div className="flex flex-wrap gap-3">
//                           {[
//                             '#F63131',
//                             '#10B981',
//                             '#3B82F6',
//                             '#8B5CF6',
//                             '#F59E0B',
//                             '#111620',
//                           ].map((color) => {
//                             const isActive =
//                               themeSettings.primaryColor.toUpperCase() ===
//                               color.toUpperCase();
//                             return (
//                               <button
//                                 key={color}
//                                 type="button"
//                                 onClick={() =>
//                                   handleThemeChange('primaryColor', color)
//                                 }
//                                 className={`w-8 h-8 rounded-full shadow-sm relative transition-all duration-200 flex items-center justify-center
//                                   ${isActive ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110 ring-1 ring-black/10'}
//                                 `}
//                                 style={{backgroundColor: color}}>
//                                 {isActive && (
//                                   <svg
//                                     className="w-4 h-4 text-white"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor">
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={3}
//                                       d="M5 13l4 4L19 7"
//                                     />
//                                   </svg>
//                                 )}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   </section>

//                   {/* 2. Typography Section */}
//                   <section className="p-5 border border-slate-200 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
//                     <div className="mb-2">
//                       <h3 className="text-[14px] font-bold text-slate-800">
//                         Typography
//                       </h3>
//                       <p className="text-[12px] text-slate-500 font-medium mt-0.5">
//                         Select the primary font family
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       {['Inter', 'Mona Sans', 'Outfit', 'Poppins'].map(
//                         (font) => {
//                           const isActive = themeSettings.fontFamily === font;
//                           return (
//                             <button
//                               key={font}
//                               type="button"
//                               onClick={() =>
//                                 handleThemeChange('fontFamily', font)
//                               }
//                               className={`p-4 text-left rounded-xl transition-all duration-200 border group
//                               ${
//                                 isActive
//                                   ? 'border-[#F63131] bg-[#F63131]/5 shadow-sm ring-1 ring-[#F63131]'
//                                   : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
//                               }
//                             `}>
//                               <div
//                                 className={`text-[20px] mb-2 transition-colors ${isActive ? 'text-[#F63131]' : 'text-slate-700 group-hover:text-slate-900'}`}
//                                 style={{fontFamily: font, fontWeight: 600}}>
//                                 Aa
//                               </div>
//                               <div
//                                 className={`text-[12px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
//                                 {font}
//                               </div>
//                             </button>
//                           );
//                         },
//                       )}
//                     </div>
//                   </section>

//                   {/* 3. Media Library */}
//                   <section className="p-5 border border-slate-200 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
//                     <div className="mb-4">
//                       <h3 className="text-[14px] font-bold text-slate-800">
//                         Media Library
//                       </h3>
//                     </div>

//                     <div className="group border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-[#F63131]/5 hover:border-[#F63131]/30 transition-all cursor-pointer">
//                       <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 group-hover:text-[#F63131] transition-transform">
//                         <Upload className="w-5 h-5" />
//                       </div>
//                       <span className="text-[12px] font-bold uppercase tracking-widest mt-3 text-slate-500 group-hover:text-[#F63131]">
//                         Upload Asset
//                       </span>
//                     </div>
//                   </section>
//                 </div>
//               )}
//             </div>

//             {/* Sidebar Footer */}
//             <div className="p-5 bg-white border-t border-slate-100 shrink-0">
//               <button className="w-full bg-[#F63131] hover:bg-[#F63131]/90 text-white py-3.5 rounded-xl text-[14px] font-bold shadow-lg shadow-[#F63131]/20 transition-all active:scale-[0.98]">
//                 Publish Changes
//               </button>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default function ManageThemePage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400 font-medium">
//           Loading theme editor...
//         </div>
//       }>
//       <ManageThemeContent />
//     </Suspense>
//   );
// }

// =================================================================================
// =================================================================================
// =================================================================================
//  2nd one
// =================================================================================
// =================================================================================
// =================================================================================

// 'use client';

// import React, {useState, Suspense} from 'react';
// import {useSearchParams} from 'next/navigation';
// import {
//   Upload,
//   ChevronDown,
//   Type,
//   Image as ImageIcon,
//   Palette,
//   Eye,
//   Settings2,
// } from 'lucide-react';
// import TemplateRenderer from '@repo/builder';
// import {templates} from '@repo/templates';
// import {Content, Theme} from '@repo/types';

// // ==========================================
// // 1. Section Editor Configuration
// // ==========================================
// const SECTION_EDITORS: Record<
//   string,
//   {
//     label: string;
//     fields: {label: string; key: string; type: 'text' | 'textarea' | 'list'}[];
//   }
// > = {
//   hero: {
//     label: 'Hero Section',
//     fields: [
//       {label: 'Main Title', key: 'heroTitle', type: 'text'},
//       {label: 'Sub Description', key: 'heroDescription', type: 'textarea'},
//       {label: 'Background Image URL', key: 'heroImage', type: 'text'},
//     ],
//   },
//   'behind-decks': {
//     label: 'Behind the Decks',
//     fields: [
//       {label: 'Section Title', key: 'behindDecksTitle', type: 'text'},
//       {label: 'Biography', key: 'behindDecksBio', type: 'textarea'},
//       {label: 'Featured Image', key: 'behindDecksImage', type: 'text'},
//     ],
//   },
//   about: {
//     label: 'About Section',
//     fields: [{label: 'About Content', key: 'aboutText', type: 'textarea'}],
//   },
//   contact: {
//     label: 'Contact Info',
//     fields: [
//       {label: 'Email Address', key: 'email', type: 'text'},
//       {label: 'Phone Number', key: 'phone', type: 'text'},
//       {label: 'Location', key: 'location', type: 'text'},
//     ],
//   },
// };

// function ManageThemeContent() {
//   const searchParams = useSearchParams();
//   const themeId = searchParams.get('themeId') || 'azura';
//   const template =
//     templates[themeId as keyof typeof templates] || templates.azura;

//   // State for content and theme settings initialized with template defaults
//   const [content, setContent] = useState<Content>(template.defaultContent);
//   const [themeSettings, setThemeSettings] = useState<Theme>(
//     template.defaultTheme,
//   );
//   const [view, setView] = useState<'landing' | 'booking'>('landing');

//   const handleContentChange = (key: string, value: string) => {
//     setContent((prev) => ({...prev, [key]: value}));
//   };

//   const handleThemeChange = (key: keyof Theme, value: string) => {
//     setThemeSettings((prev) => ({...prev, [key]: value}));
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-6 font-sans text-slate-800">
//       <div className="max-w-425 mx-auto flex flex-col h-[calc(100vh-48px)]">
//         {/* Header Bar */}
//         <header className="flex items-center justify-between mb-6 shrink-0">
//           <div className="flex items-center gap-4">
//             <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
//               <Settings2 className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-slate-900 leading-none">
//                 Theme Editor
//               </h1>
//               <p className="text-xs text-slate-500 mt-1.5 font-medium">
//                 Editing:{' '}
//                 <span className="text-primary">{themeId.toUpperCase()}</span>{' '}
//                 Template
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
//               <Eye className="w-4 h-4" /> Preview Site
//             </button>
//             <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
//             <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">
//               Save Changes
//             </button>
//           </div>
//         </header>

//         {/* Main Work Area */}
//         <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
//           {/* ========================================== */}
//           {/* LEFT SIDE: DEVICE PREVIEW (SCROLLABLE) */}
//           {/* ========================================== */}
//           <div className="flex-1 bg-slate-200/50 rounded-4xl p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200">
//             {/* Perspective Background Decoration */}
//             <div className="absolute inset-0 opacity-10 pointer-events-none">
//               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px]" />
//             </div>

//             {/* Browser/Device Shell */}
//             <div className="w-full h-full max-w-300 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative border border-white">
//               {/* Browser Header */}
//               <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center gap-4 shrink-0">
//                 <div className="flex gap-1.5">
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                   <div className="w-3 h-3 rounded-full bg-slate-200" />
//                 </div>
//                 <div className="flex-1 max-w-md mx-auto h-7 bg-white rounded-lg border border-slate-200 flex items-center px-3 gap-2">
//                   <div className="w-2 h-2 rounded-full bg-emerald-400" />
//                   <span className="text-[10px] text-slate-400 font-mono truncate">
//                     https://your-stage-url.upbeat.africa
//                   </span>
//                 </div>
//                 <div className="w-20" /> {/* Spacer */}
//               </div>

//               {/* Scrollable Preview Area */}
//               <div className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
//                 <div className="origin-top transition-transform duration-300">
//                   <TemplateRenderer
//                     templateId={themeId}
//                     content={content}
//                     theme={themeSettings}
//                     view={view}
//                     onViewChange={setView}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ========================================== */}
//           {/* RIGHT SIDE: EDITOR SIDEBAR */}
//           {/* ========================================== */}
//           <aside className="w-full lg:w-105 xl:w-120 bg-white rounded-4xl border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden shrink-0">
//             {/* Sidebar Tabs/Header */}
//             <div className="p-6 border-b border-slate-50 bg-slate-50/50">
//               <h2 className="text-lg font-bold text-slate-900 mb-1">
//                 Customize Theme
//               </h2>
//               <p className="text-xs text-slate-500 font-medium">
//                 Update content and styles below.
//               </p>
//             </div>

//             {/* Scrollable Editor Fields */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
//               {/* 1. Global Styles Section */}
//               <section>
//                 <div className="flex items-center gap-2 mb-6">
//                   <div className="p-1.5 bg-primary/10 rounded-lg">
//                     <Palette className="w-3.5 h-3.5 text-primary" />
//                   </div>
//                   <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
//                     Design Tokens
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
//                       Brand Color
//                     </label>
//                     <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
//                       <div
//                         className="w-10 h-10 rounded-lg shadow-inner relative overflow-hidden border border-white/20"
//                         style={{backgroundColor: themeSettings.primaryColor}}>
//                         <input
//                           type="color"
//                           value={themeSettings.primaryColor}
//                           onChange={(e) =>
//                             handleThemeChange('primaryColor', e.target.value)
//                           }
//                           className="absolute inset-0 opacity-0 cursor-pointer scale-150"
//                         />
//                       </div>
//                       <span className="text-xs font-mono font-bold text-slate-600 uppercase">
//                         {themeSettings.primaryColor}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
//                       Typography
//                     </label>
//                     <div className="relative">
//                       <select
//                         value={themeSettings.fontFamily}
//                         onChange={(e) =>
//                           handleThemeChange('fontFamily', e.target.value)
//                         }
//                         className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none hover:border-slate-200 transition-colors focus:ring-2 focus:ring-primary/5">
//                         <option>Inter</option>
//                         <option>Mona Sans</option>
//                         <option>Outfit</option>
//                         <option>Poppins</option>
//                       </select>
//                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* 2. Content Sections */}
//               {Object.entries(SECTION_EDITORS).map(([sectionId, config]) => (
//                 <section key={sectionId}>
//                   <div className="flex items-center gap-2 mb-6">
//                     <div className="p-1.5 bg-slate-100 rounded-lg">
//                       <Type className="w-3.5 h-3.5 text-slate-600" />
//                     </div>
//                     <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
//                       {config.label}
//                     </h3>
//                   </div>

//                   <div className="space-y-5">
//                     {config.fields.map((field) => (
//                       <div key={field.key} className="space-y-2">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
//                           {field.label}
//                         </label>
//                         {field.type === 'text' ? (
//                           <input
//                             type="text"
//                             value={content[field.key] || ''}
//                             onChange={(e) =>
//                               handleContentChange(field.key, e.target.value)
//                             }
//                             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
//                             placeholder={`Enter ${field.label.toLowerCase()}...`}
//                           />
//                         ) : (
//                           <textarea
//                             value={content[field.key] || ''}
//                             onChange={(e) =>
//                               handleContentChange(field.key, e.target.value)
//                             }
//                             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 h-32 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all resize-none placeholder:text-slate-300"
//                             placeholder={`Enter ${field.label.toLowerCase()}...`}
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </section>
//               ))}

//               {/* 3. Media Assets */}
//               <section>
//                 <div className="flex items-center gap-2 mb-6">
//                   <div className="p-1.5 bg-slate-100 rounded-lg">
//                     <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
//                   </div>
//                   <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
//                     Media Library
//                   </h3>
//                 </div>
//                 <div className="group border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-white hover:border-primary/30 transition-all cursor-pointer">
//                   <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
//                     <Upload className="w-6 h-6 text-slate-400" />
//                   </div>
//                   <span className="text-[11px] font-bold uppercase tracking-widest mt-4 text-slate-500">
//                     Upload New Asset
//                   </span>
//                 </div>
//               </section>
//             </div>

//             {/* Sidebar Footer */}
//             <div className="p-6 bg-slate-50/80 border-t border-slate-100">
//               <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98]">
//                 Publish Changes
//               </button>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #e2e8f0;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #cbd5e1;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default function ManageThemePage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400 font-medium">
//           Loading theme editor...
//         </div>
//       }>
//       <ManageThemeContent />
//     </Suspense>
//   );
// }
