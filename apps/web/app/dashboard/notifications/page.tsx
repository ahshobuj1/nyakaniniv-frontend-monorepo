'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckCircle2, CircleDot, Info, CreditCard, Calendar, Filter } from 'lucide-react';
import { useGetMyNotificationsQuery, useMarkAsReadMutation } from '@repo/store';
import { Button } from '@repo/ui';
import LoadingSpinner from '@/components/LoadingSpinner';

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: notificationsData, isLoading } = useGetMyNotificationsQuery({ page, limit: 20 });
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = notificationsData?.data || [];
  const meta = notificationsData?.meta;

  const handleMarkAsRead = async (id: string, isRead?: boolean) => {
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getIconForType = (type?: string, isRead?: boolean) => {
    const color = isRead ? 'text-gray-400' : 'text-primary';
    switch (type) {
      case 'booking_request':
        return <Calendar className={`h-5 w-5 ${color}`} />;
      case 'payment':
        return <CreditCard className={`h-5 w-5 ${color}`} />;
      case 'system':
      default:
        return <Info className={`h-5 w-5 ${color}`} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Manage and view all your notifications</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner smallHeight />
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">You're all caught up!</h3>
            <p className="text-gray-500 mt-2 max-w-sm">No new notifications to show right now. We'll let you know when something happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => router.push(`/dashboard/notifications/${notification.id}`)}
                className={`p-5 flex gap-4 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-primary/[0.02] hover:bg-primary/[0.04]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    !notification.isRead ? 'bg-white shadow-sm border border-primary/20' : 'bg-gray-50'
                  }`}>
                    {getIconForType(notification.type, notification.isRead)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className={`text-base font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                      {notification.createdAt ? timeAgo(notification.createdAt) : ''}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                    {notification.message}
                  </p>
                  
                  {!notification.isRead && (
                    <div className="mt-3 flex items-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id, notification.isRead); }}
                        className="flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
                
                {!notification.isRead && (
                  <div className="flex-shrink-0 mt-1">
                    <CircleDot className="h-2.5 w-2.5 text-primary fill-current" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center py-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={meta.page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 font-medium px-4">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={meta.page >= meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
