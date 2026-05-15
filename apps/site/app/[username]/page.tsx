import TemplateRenderer from '@repo/builder';
import {dummyUsers} from '../data';
import {notFound} from 'next/navigation';

interface PageProps {
  params: Promise<{username: string}>;
  searchParams: Promise<{templateId?: string}>;
}

export default async function Page({params, searchParams}: PageProps) {
  const {username} = await params;
  const {templateId: previewTemplateId} = await searchParams;

  const userData = dummyUsers[username.toLowerCase()];

  if (!userData) {
    notFound();
  }

  // Use previewTemplateId if provided, otherwise use the saved templateId
  const activeTemplateId = previewTemplateId || userData.templateId;

  return (
    <TemplateRenderer
      templateId={activeTemplateId}
      content={userData.content}
      theme={userData.theme}
      baseUrl={`/${username}`}
    />
  );
}
