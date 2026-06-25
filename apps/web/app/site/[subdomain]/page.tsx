import PublicProfile from './PublicProfile';

export default async function PublicProfilePage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  return <PublicProfile username={subdomain} />;
}
