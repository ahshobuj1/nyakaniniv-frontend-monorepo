import { Metadata } from 'next';
import { ScheduleDashboard } from './_components/ScheduleDashboard';

export const metadata: Metadata = {
  title: 'My Schedule & Routine | UpBeat Entertainment Africa',
  description: 'Manage your daily DJ gig schedule, call times, and routine works checklist.',
};

export default function SchedulePage() {
  return <ScheduleDashboard />;
}
