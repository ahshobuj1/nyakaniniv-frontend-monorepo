import {templates} from '@repo/templates';
import TemplateRenderer from '@repo/builder';

export default async function BookingPage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const username = params.username;
  
  // In a real app, fetch the user's selected theme and content from the database using 'username'
  const themeId = 'azura'; // Mock selected theme
  const template = templates[themeId as keyof typeof templates];

  return (
    <TemplateRenderer
      templateId={themeId}
      content={template.defaultContent}
      theme={template.defaultTheme}
      view="booking"
      baseUrl={`/${username}`}
    />
  );
}
