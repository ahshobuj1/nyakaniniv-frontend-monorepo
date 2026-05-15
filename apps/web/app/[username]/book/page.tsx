'use client';

import React from 'react';
import {templates} from '@repo/templates';
import TemplateRenderer from '@repo/builder';
import {useParams} from 'next/navigation';

export default function UserBookingPage() {
  const params = useParams();
  const username = params.username as string;
  
  // In a real production app, fetch the user's specific theme and content from the database.
  const themeId = 'azura'; 
  const template = templates[themeId as keyof typeof templates];
  
  return (
    <TemplateRenderer
      templateId={themeId}
      content={template.defaultContent}
      theme={template.defaultTheme}
      view="booking"
    />
  );
}
