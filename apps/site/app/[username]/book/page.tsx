import {templates} from '@repo/templates';
import TemplateRenderer from '@repo/builder';

export default async function BookingPage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const username = params.username;
  
  // Fetch the tenant profile by subdomain
  let tenantId = '';
  try {
    const res = await fetch(`http://localhost:3030/api/tenant/v1/${username}`, {
      next: { revalidate: 60 },
    });
    const result = await res.json();
    if (result.success && result.data) {
      tenantId = result.data.id;
    }
  } catch (error) {
    console.error('Failed to fetch tenant:', error);
  }
  
  // In a real app, you would also use the fetched data to determine the themeId and content
  const themeId = 'azura'; // Mock selected theme
  const template = templates[themeId as keyof typeof templates];

  return (
    <TemplateRenderer
      templateId={themeId}
      content={{...template.defaultContent, tenantId}}
      theme={template.defaultTheme}
      view="booking"
      baseUrl={`/${username}`}
    />
  );
}
