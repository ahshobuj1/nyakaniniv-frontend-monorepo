'use client';

import React from 'react';
import {templates} from '@repo/templates';
import TemplateRenderer from '@repo/builder';
import {useParams} from 'next/navigation';
import {useGetPublicProfileQuery} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function UserBookingPage() {
  const params = useParams();
  const username = params.subdomain as string;
  
  const { data: response, isLoading, isError } = useGetPublicProfileQuery(username);
  const tenant = response?.data;

  // In a real production app, fetch the user's specific theme and content from the database.
  const themeId = tenant?.theme?.slug || 'azura'; 
  const template = templates[themeId as keyof typeof templates] || templates['azura'];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
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
  
  return (
    <TemplateRenderer
      templateId={themeId}
      content={{
        ...template.defaultContent,
        ...tenant.config?.content,
        djName: tenant.stageName || tenant.config?.content?.djName || template.defaultContent.djName || 'Aura',
        navbar: {
          ...template.defaultContent.navbar,
          ...tenant.config?.content?.navbar,
          djName: tenant.stageName || tenant.config?.content?.navbar?.djName || template.defaultContent.navbar?.djName || 'KENZO',
        },
        tenantId: tenant.id
      }}
      theme={{
        ...template.defaultTheme,
        ...tenant.config?.theme
      }}
      view="booking"
    />
  );
}
