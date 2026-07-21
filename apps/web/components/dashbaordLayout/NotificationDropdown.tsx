'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, CircleDot, Info, CreditCard, Calendar } from 'lucide-react';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button
} from '@repo/ui';
import { useGetMyNotificationsQuery, useGetUnreadCountQuery, useMarkAsReadMutation } from '@repo/store';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch only the latest 10 notifications for the dropdown
  const { data: notificationsData, isLoading } = useGetMyNotificationsQuery({ limit: 10 });
  const { data: unreadCountData } = useGetUnreadCountQuery(undefined, { pollingInterval: 30000 }); // Poll every 30s
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadCountData?.data?.count || 0;

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
        return <Calendar className={`h-4 w-4 ${color}`} />;
      case 'payment':
        return <CreditCard className={`h-4 w-4 ${color}`} />;
      case 'system':
      default:
        return <Info className={`h-4 w-4 ${color}`} />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 bg-[#f4f4f4] rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none cursor-pointer">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full transform translate-x-1/3 -translate-y-1/3 border-2 border-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 mr-4 mt-2 shadow-2xl rounded-xl border-gray-100" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>

        <div className="max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-600">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-primary/[0.02]' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      !notification.isRead ? 'bg-white shadow-sm border border-gray-100' : 'bg-gray-50'
                    }`}>
                      {getIconForType(notification.type, notification.isRead)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-sm truncate font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <CircleDot className="h-2 w-2 text-primary flex-shrink-0 mt-1.5 fill-current" />
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${!notification.isRead ? 'text-gray-600' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      {notification.createdAt ? timeAgo(notification.createdAt) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full text-xs font-medium text-primary hover:text-primary hover:bg-primary/5 h-8">
              See All Notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
