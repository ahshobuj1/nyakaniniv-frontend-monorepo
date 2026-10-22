/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useConfirmCompletionMutation,
  useReportIssueMutation,
  useSubmitReviewMutation,
} from '@repo/store';
import type { PostEventCardProps } from './types';

export function PostEventCard({
  booking,
  review,
  onActionComplete,
}: PostEventCardProps) {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  const [confirmCompletion, { isLoading: isConfirming }] = useConfirmCompletionMutation();
  const [reportIssue, { isLoading: isReporting }] = useReportIssueMutation();
  const [submitReview, { isLoading: isSubmittingReview }] = useSubmitReviewMutation();

  const isCompleted = booking.status === 'COMPLETED';
  const isDisputed = booking.status === 'DISPUTED';
  const canConfirmOrDispute =
    booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS';

  const handleConfirmCompletion = async () => {
    try {
      await confirmCompletion(booking.id).unwrap();
      toast.success('Event marked as completed! Thank you.');
      if (onActionComplete) onActionComplete();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to confirm completion.');
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) return;

    try {
      await reportIssue({
        id: booking.id,
        description: issueDescription.trim(),
      }).unwrap();

      toast.success('Issue reported. The artist and platform support have been alerted.');
      setShowIssueModal(false);
      if (onActionComplete) onActionComplete();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to report issue.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview({
        id: booking.id,
        rating,
        reviewText: reviewComment.trim() || undefined,
      }).unwrap();

      toast.success('Thank you for submitting your review!');
      if (onActionComplete) onActionComplete();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit review.');
    }
  };

  if (!canConfirmOrDispute && !isCompleted && !isDisputed) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            Post-Event Lifecycle
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">
            {isCompleted ? 'Event Review & Feedback' : 'Event Completion'}
          </h2>
        </div>
      </div>

      {/* Disputed State */}
      {isDisputed && (
        <div className="p-4 rounded-sm bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Issue Reported for this Booking</span>
          </div>
          <p className="text-rose-800">
            {booking.issueDescription || 'An issue was reported by the client regarding this performance.'}
          </p>
          <span className="text-[11px] text-rose-600 block">
            Reported on: {booking.issueReportedAt ? new Date(booking.issueReportedAt).toLocaleDateString() : 'Recently'}
          </span>
        </div>
      )}

      {/* Can Confirm or Report Issue */}
      {canConfirmOrDispute && (
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Has the event concluded? Confirm below to finalize the booking and leave a rating for the artist.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleConfirmCompletion}
              disabled={isConfirming}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer">
              <CheckCircle className="w-4 h-4" />
              <span>{isConfirming ? 'Confirming...' : 'Confirm Event Concluded'}</span>
            </button>

            <button
              onClick={() => setShowIssueModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-sm transition-colors cursor-pointer">
              <Flag className="w-3.5 h-3.5" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>
      )}

      {/* Completed State: Review Display or Form */}
      {isCompleted && (
        <div className="space-y-4">
          {review ? (
            <div className="p-4 rounded-sm bg-gray-50 border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="font-bold text-gray-800 ml-1">
                  {review.rating} / 5 Stars
                </span>
              </div>
              {(review.reviewText || review.comment) && (
                <p className="text-gray-700 italic mt-1">&ldquo;{review.reviewText || review.comment}&rdquo;</p>
              )}
              <span className="text-[11px] text-gray-400 block pt-1">
                Submitted on {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3 pt-1">
              <span className="text-xs font-bold text-gray-800 block">
                Leave a Performance Review
              </span>

              {/* Star selector */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer">
                    <Star
                      className={`w-5 h-5 ${
                        s <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-gray-600 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>

              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience working with this artist..."
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Report Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Report an Issue
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Let us know what went wrong so we can record and flag this booking.
                </p>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Issue Description
                </label>
                <textarea
                  rows={4}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the issue (e.g. artist late arrival, technical breakdown, direct payment dispute)..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-sm hover:bg-gray-50 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReporting || !issueDescription.trim()}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer">
                  {isReporting ? 'Reporting...' : 'Submit Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
