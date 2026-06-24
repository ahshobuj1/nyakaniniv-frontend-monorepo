'use client';

import React from 'react';
import { useGetPublicProfileQuery } from '@repo/store';
import TemplateRenderer from '@repo/builder';
import { templates } from '@repo/templates';

interface PublicProfileProps {
  username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
  const { data: response, isLoading, isError } = useGetPublicProfileQuery(username);
  const tenant = response?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 gap-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (isError || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-sans">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xl font-semibold text-slate-800 mb-2">DJ Not Found</p>
          <p className="text-sm text-slate-500">The profile you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const themeId = tenant.theme?.slug || 'azura';
  const template = templates[themeId as keyof typeof templates] || templates['azura'];

  // Map tenant config to the template content
  // Assuming tenant.config contains the overrides for the template
  const content = tenant.config?.content;
  const mergedContent = {
    ...template.defaultContent,
    ...content,
    djName: content?.djName || tenant.stageName || template.defaultContent.djName || 'DJ AURA',
    navbar: {
      ...template.defaultContent.navbar,
      ...content?.navbar,
      djName: content?.navbar?.djName || tenant.stageName || template.defaultContent.navbar?.djName || 'KENZO',
    },
    // Map dynamic entities (mixTapes, events) into template expected formats
    mixes: tenant.mixTapes?.length ? tenant.mixTapes.map(m => ({
      img: m.coverUrl || template.defaultContent.heroImage || '/theme/aura/mixes-video-avator-1.png',
      title: m.title,
      genre: 'Various',
      time: '00:00',
      audioUrl: m.audioUrl,
    })) : template.defaultContent.mixes || [
      {
        img: '/theme/aura/mixes-video-avator-1.png',
        title: 'Lagos Nights Vol.3',
        genre: 'Amapiano',
        time: '58:20',
      }
    ],
    latestMixes: {
      ...template.defaultContent.latestMixes,
      tracks: tenant.mixTapes?.length ? tenant.mixTapes.map((m, i) => ({
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
      list: tenant.events?.length ? tenant.events.map((e, i) => ({
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

  const mergedTheme = {
    ...template.defaultTheme,
    ...tenant.config?.theme
  };

  return (
    <div className="min-h-screen bg-white">
      <TemplateRenderer
        templateId={themeId}
        content={mergedContent}
        theme={mergedTheme}
        view="landing"
      />
    </div>
  );
}
