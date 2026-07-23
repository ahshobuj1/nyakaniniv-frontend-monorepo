import {templates} from '@repo/templates';
import TemplateRenderer from '@repo/builder';

export default async function BookingPage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const username = params.username;
  
  // Fetch the tenant profile by subdomain
  let tenantId = '';
  let djName = '';
  let themeId = 'azura'; // Default fallback theme
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://api.upbeat.africa' : 'http://localhost:3030');
    const res = await fetch(`${baseUrl}/api/tenant/v1/${username}`, {
      cache: 'no-store',
    });
    const result = await res.json();
    if (result.success && result.data) {
      tenantId = result.data.id;
      djName = result.data.stageName;
      if (result.data.activeTheme) {
        themeId = result.data.activeTheme;
      }
    }
  } catch (error) {
    console.error('Failed to fetch tenant:', error);
  }
  
  const template = templates[themeId as keyof typeof templates] || templates.azura;

  return (
    <TemplateRenderer
      templateId={themeId}
      content={{...template.defaultContent, tenantId, ...(djName ? { djName } : {})}}
      theme={template.defaultTheme}
      view="booking"
      baseUrl={`/${username}`}
    />
  );
}
