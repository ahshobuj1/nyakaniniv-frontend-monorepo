import PublicProfile from './PublicProfile';
import { notFound } from 'next/navigation';

export default async function PublicProfilePage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  
  // Use 127.0.0.1 instead of localhost to avoid IPv6 resolution issues in Node
  const fallbackUrl = 'http://127.0.0.1:3030';
  let API_URL = process.env.NEXT_PUBLIC_API_URL || fallbackUrl;
  
  // If NEXT_PUBLIC_API_URL is exactly localhost, replace it too for server-side
  if (API_URL.includes('localhost')) {
    API_URL = API_URL.replace('localhost', '127.0.0.1');
  }

  let initialTenant = null;
  
  try {
    const res = await fetch(`${API_URL}/tenant/v1/${subdomain}`, { 
      cache: 'no-store'
    });
    
    if (res.ok) {
      const response = await res.json();
      initialTenant = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }

  if (!initialTenant) {
    // If not found, you could return notFound() or let PublicProfile handle the 404 state.
  }

  return <PublicProfile username={subdomain} initialTenant={initialTenant} />;
}
