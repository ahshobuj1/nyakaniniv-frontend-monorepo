import PublicProfile from './PublicProfile';

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  return <PublicProfile username={params.username} />;
}
