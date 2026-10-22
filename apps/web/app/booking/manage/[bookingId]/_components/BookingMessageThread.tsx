'use client';

import React, { useState } from 'react';
import { Send, MessageSquare, User, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useSendBookingMessageMutation } from '@repo/store';
import type { BookingMessageThreadProps } from './types';

export function BookingMessageThread({
  bookingId,
  messages,
  clientName,
  clientEmail,
  djStageName,
  djEmail,
  viewerRole = 'CLIENT',
  onMessageSent,
}: BookingMessageThreadProps) {
  const [content, setContent] = useState('');
  const [sendMessage, { isLoading }] = useSendBookingMessageMutation();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || viewerRole === 'ADMIN') return;

    try {
      await sendMessage({
        id: bookingId,
        bookingId,
        content: content.trim(),
      }).unwrap();

      setContent('');
      toast.success('Message sent.');
      if (onMessageSent) onMessageSent();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to send message.');
    }
  };

  const sortedMessages = [...(messages || [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const getRecipientLabel = () => {
    if (viewerRole === 'DJ') return clientName || 'Client';
    return djStageName || 'DJ';
  };

  const formatMessageTimestamp = (dateStr: string | Date) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' • ' + d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-7 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            Direct Communication
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">
            Booking Messages & Negotiation Log
          </h2>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{sortedMessages.length} message{sortedMessages.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* Message History */}
      <div className="space-y-4 max-h-96 overflow-y-auto p-1">
        {sortedMessages.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
            {viewerRole === 'DJ'
              ? `No messages yet. Send a note to ${clientName || 'the client'} to discuss event logistics or payment details.`
              : `No messages yet. Send a note to ${djStageName} to discuss event logistics, music preferences, or direct payment details.`}
          </div>
        ) : (
          sortedMessages.map((msg) => {
            const isClientMsg = msg.senderType === 'CLIENT';
            const isViewerSender =
              (viewerRole === 'CLIENT' && isClientMsg) ||
              (viewerRole === 'DJ' && !isClientMsg);

            const isRightAligned = viewerRole === 'ADMIN' ? !isClientMsg : isViewerSender;
            const senderName = isClientMsg ? (clientName || 'Client') : (djStageName || 'DJ');
            const senderEmail = isClientMsg ? clientEmail : djEmail;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isRightAligned ? 'items-end' : 'items-start'
                }`}>
                {/* Sender Header with Name, Email, and Timestamp */}
                <div
                  className={`flex flex-wrap items-center gap-1.5 mb-1 text-[11px] ${
                    isRightAligned ? 'justify-end' : 'justify-start'
                  }`}>
                  {isClientMsg ? (
                    <div className="inline-flex items-center gap-1 text-gray-700 font-bold">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>{senderName}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-primary font-bold">
                      <Music className="w-3.5 h-3.5 text-primary" />
                      <span>{senderName}</span>
                    </div>
                  )}

                  {isViewerSender && (
                    <span className="text-[10px] font-semibold text-gray-400">
                      (You)
                    </span>
                  )}

                  {senderEmail && (
                    <span className="text-[10px] text-gray-400 font-mono">
                      &lt;{senderEmail}&gt;
                    </span>
                  )}

                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] text-gray-500">
                    {formatMessageTimestamp(msg.createdAt)}
                  </span>
                </div>

                {/* Message Body */}
                <div
                  className={`p-3.5 rounded-sm text-xs leading-relaxed max-w-lg break-words shadow-2xs ${
                    isViewerSender
                      ? 'bg-primary text-white shadow-xs'
                      : isRightAligned
                      ? 'bg-blue-50 text-blue-950 border border-blue-200'
                      : 'bg-gray-100 text-gray-900 border border-gray-200'
                  }`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      {viewerRole === 'ADMIN' ? (
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-sm text-[11px] text-amber-800">
          <strong>Audit Mode:</strong> Communication history is shown for administrative audit purposes. Messages can only be exchanged between the Client and DJ.
        </div>
      ) : (
        <form onSubmit={handleSend} className="pt-2 flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Message ${getRecipientLabel()}...`}
            className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
          />
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? '...' : 'Send'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
