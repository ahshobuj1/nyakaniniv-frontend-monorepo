'use client';

import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ArrowLeft, Bell, Calendar, CheckCircle2, MessageSquare, Tag } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetMyNotificationsQuery, useMarkAsReadMutation } from '@repo/store';

export default function NotificationDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: notificationsData, isLoading: loading, error: fetchError } = useGetMyNotificationsQuery({ id });
  const [markAsRead] = useMarkAsReadMutation();
  const notification = notificationsData?.data?.[0];
  const error = fetchError ? (fetchError as any).data?.message || (fetchError as any).message || 'Failed to fetch notification' : null;

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id).catch(console.error);
    }
  }, [notification, markAsRead]);

  if (loading) {
    return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;
  }

  if (error || !notification) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <Link href="/dashboard/notifications">
          <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
        </Link>
        <div className="p-6 bg-red-50/80 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 shadow-sm">
          Error: {error || 'Notification not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Message Detail</h1>
          <p className="text-sm text-gray-500 mt-1">Review your notification</p>
        </div>
      </div>

      <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-3xl overflow-hidden relative">
        {/* Decorative Top Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-primary via-indigo-500 to-purple-500 absolute top-0 left-0" />
        
        <CardHeader className="border-b border-gray-100 pb-8 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className={`p-4 rounded-2xl shadow-sm ${notification.isRead ? 'bg-gray-50 text-gray-400' : 'bg-primary/10 text-primary'}`}>
                <Bell className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                  {notification.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <Calendar className="w-4 h-4" />
                    {notification.createdAt && new Date(notification.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md capitalize">
                    <Tag className="w-4 h-4" />
                    {notification.type?.replace('_', ' ').toLowerCase() || 'general'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`shrink-0 px-4 py-2 rounded-full flex items-center gap-2 self-start sm:self-center ${notification.isRead ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold text-sm">{notification.isRead ? 'Read' : 'New'}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 md:p-10">
          <div className="flex gap-4">
            <MessageSquare className="w-6 h-6 text-gray-300 shrink-0 mt-1" />
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                {notification.message}
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap justify-end gap-4">
            {notification.referenceId && (
              <Link 
                href={notification.type === 'payment' 
                  ? `/dashboard/invoices/${notification.referenceId}` 
                  : `/dashboard/bookings/${notification.referenceId}`}
              >
                <Button variant="outline" className="shadow-sm rounded-xl px-6 border-primary/20 text-primary hover:bg-primary/5">
                  {notification.type === 'payment' ? 'View Invoice' : 'View Related Booking'}
                </Button>
              </Link>
            )}
             <Link href="/dashboard/notifications">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-md rounded-xl px-6">
                Back to Inbox
              </Button>
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
