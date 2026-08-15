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
    <div className="container mx-auto p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#111827]">Message Detail</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${
                notification.isRead 
                  ? 'bg-gray-50 text-gray-600 border-gray-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {notification.isRead ? 'Read' : 'New'}
              </span>
            </div>
            <p className="text-sm text-[#6B7280] mt-1 font-mono">Notification ID: {id}</p>
          </div>
        </div>
      </div>

      <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border shrink-0 ${notification.isRead ? 'bg-white border-gray-200 text-gray-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl font-semibold text-[#111827] leading-tight">
                  {notification.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {notification.createdAt && new Date(notification.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 capitalize">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {notification.type?.replace('_', ' ').toLowerCase() || 'general'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1 mt-2 text-[#374151] whitespace-pre-wrap leading-relaxed text-[15px]">
              {notification.message}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            {notification.referenceId && (
              <Link 
                href={notification.type === 'payment' 
                  ? `/dashboard/invoices/${notification.referenceId}` 
                  : `/dashboard/bookings/${notification.referenceId}`}
              >
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-[#111827]">
                  {notification.type === 'payment' ? 'View Invoice Details' : 'View Related Booking'}
                </Button>
              </Link>
            )}
             <Link href="/dashboard/notifications">
              <Button className="bg-[#111827] hover:bg-gray-800 text-white">
                Back to Inbox
              </Button>
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
