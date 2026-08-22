'use client';

import React from 'react';
import { useGetPublicProfileQuery } from '@repo/store';
import TemplateRenderer from '@repo/builder';
import { templates } from '@repo/templates';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCountryTimezone } from '@/lib/timezone';

interface PublicProfileProps {
  username: string;
  initialTenant?: any;
}

export default function PublicProfile({ username, initialTenant }: PublicProfileProps) {
  const { data: response, isLoading, isError } = useGetPublicProfileQuery(username, {
    skip: !!initialTenant,
  });
  const tenant = initialTenant || response?.data;

  if (!tenant && isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isError || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <p className="text-gray-500">The DJ profile you are looking for does not exist.</p>
      </div>
    );
  }

  const themeSlug = tenant?.theme?.slug || tenant?.config?.themeSlug || 'azura';
  const template = templates[themeSlug as keyof typeof templates] || templates.azura;

  const mergedContent = {
    ...template.defaultContent,
    ...tenant.config?.content,
    djName: tenant.stageName || tenant.config?.content?.djName || template.defaultContent.djName || 'DJ AURA',
    navbar: {
      ...template.defaultContent.navbar,
      ...tenant.config?.content?.navbar,
      djName: tenant.stageName || tenant.config?.content?.navbar?.djName || template.defaultContent.navbar?.djName || 'KENZO',
    },
    instagram: tenant.socialLinks?.instagram || tenant.config?.content?.instagram || template.defaultContent.instagram || '#',
    facebook: tenant.socialLinks?.facebook || tenant.config?.content?.facebook || template.defaultContent.facebook || '#',
    linkedin: tenant.socialLinks?.linkedin || tenant.config?.content?.linkedin || template.defaultContent.linkedin || '#',
    social: {
      ...template.defaultContent.social,
      ...tenant.config?.content?.social,
      instagram: tenant.socialLinks?.instagram || tenant.config?.content?.social?.instagram || template.defaultContent.social?.instagram || '#',
      facebook: tenant.socialLinks?.facebook || tenant.config?.content?.social?.facebook || template.defaultContent.social?.facebook || '#',
      linkedin: tenant.socialLinks?.linkedin || tenant.config?.content?.social?.linkedin || template.defaultContent.social?.linkedin || '#',
    },
    footer: {
      ...template.defaultContent.footer,
      ...tenant.config?.content?.footer,
      logoText: tenant.stageName || tenant.config?.content?.footer?.logoText || template.defaultContent.footer?.logoText || 'DJ AURA',
    },
    mixes: tenant.mixTapes?.length ? tenant.mixTapes.map((m: any) => ({
      img: m.coverUrl || template.defaultContent.heroImage || '/theme/aura/mixes-video-avator-1.png',
      title: m.title,
      genre: 'Various',
      time: '00:00',
      audioUrl: m.audioUrl,
    })) : template.defaultContent.mixes || [],
    latestMixes: {
      ...template.defaultContent.latestMixes,
      tracks: tenant.mixTapes?.length ? tenant.mixTapes.map((m: any, i: number) => ({
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
      list: tenant.events?.length ? tenant.events.map((e: any, i: number) => {
        const tzInfo = getCountryTimezone(e.venueAddress || tenant.country || tenant.city);
        const eventDateObj = e.eventDate ? new Date(e.eventDate) : null;
        const now = new Date();
        const isPast = e.status?.toLowerCase() === 'completed' || (eventDateObj && eventDateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate()));

        const day = eventDateObj ? eventDateObj.toLocaleDateString('en-US', { timeZone: tzInfo.iana, day: '2-digit' }) : '';
        const month = eventDateObj ? eventDateObj.toLocaleDateString('en-US', { timeZone: tzInfo.iana, month: 'short' }).toUpperCase() : '';
        const year = eventDateObj ? eventDateObj.toLocaleDateString('en-US', { timeZone: tzInfo.iana, year: 'numeric' }) : '';
        const fullDate = eventDateObj ? eventDateObj.toLocaleDateString('en-US', { timeZone: tzInfo.iana, month: 'short', day: 'numeric', year: 'numeric' }) : '';

        let time = e.eventTime || '';
        if (!time && eventDateObj && typeof e.eventDate === 'string' && e.eventDate.includes('T') && !e.eventDate.endsWith('T00:00:00.000Z')) {
          time = eventDateObj.toLocaleTimeString('en-US', { timeZone: tzInfo.iana, hour: '2-digit', minute: '2-digit' });
        }
        if (time && !time.includes('EAT') && !time.includes('WAT') && !time.includes('GMT') && !time.includes('SAST') && !time.includes('UTC')) {
          time = `${time} ${tzInfo.code}`;
        }

        return {
          id: e.id || i,
          day,
          month,
          year,
          date: fullDate,
          rawDate: e.eventDate,
          time,
          title: e.title,
          description: e.description,
          venue: e.venueName,
          location: e.venueAddress,
          price: e.price,
          capacity: e.capacity,
          status: e.status || (isPast ? 'completed' : 'upcoming'),
          isPast: !!isPast,
          ticketUrl: '#',
        };
      }) : template.defaultContent.events?.list || [],
    }
  };

  const mergedTheme = {
    ...template.defaultTheme,
    ...tenant.config?.theme
  };

  return (
    <div className="min-h-screen bg-white">
      <TemplateRenderer
        templateId={themeSlug}
        content={mergedContent}
        theme={mergedTheme}
        view="landing"
      />
    </div>
  );
}
