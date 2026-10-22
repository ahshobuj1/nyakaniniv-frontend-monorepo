/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState} from 'react';
import {
  FileCheck2,
  TrendingUp,
  Check,
  X,
  Clock,
  History,
  ShieldAlert,
  Edit3,
  User,
  Music,
} from 'lucide-react';
import {toast} from 'sonner';
import {
  useProposeQuoteMutation,
  useAcceptQuoteMutation,
  useRejectQuoteMutation,
} from '@repo/store';
import type {QuoteNegotiationCardProps} from './types';

export function QuoteNegotiationCard({
  booking,
  currencyCode,
  quotes,
  agreement,
  viewerRole = 'CLIENT',
  clientName,
  clientEmail,
  djStageName,
  djEmail,
  onQuoteUpdated,
}: QuoteNegotiationCardProps) {
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterAmount, setCounterAmount] = useState<string>('');
  const [counterMessage, setCounterMessage] = useState('');

  const [proposeQuote, {isLoading: isProposing}] = useProposeQuoteMutation();
  const [acceptQuote, {isLoading: isAccepting}] = useAcceptQuoteMutation();
  const [rejectQuote, {isLoading: isRejecting}] = useRejectQuoteMutation();

  const isViewerClient = viewerRole === 'CLIENT';
  const isViewerDj = viewerRole === 'DJ';
  const isViewerAdmin = viewerRole === 'ADMIN';

  const resolvedClientName = clientName || booking.client?.name || 'Client';
  const resolvedClientEmail = clientEmail || booking.client?.email;
  const resolvedDjStageName =
    djStageName ||
    (booking as any).tenant?.stageName ||
    (booking as any).dj?.stageName ||
    (booking as any).tenant?.user?.firstName ||
    'Artist / DJ';
  const resolvedDjEmail =
    djEmail ||
    (booking as any).tenant?.user?.email ||
    (booking as any).dj?.user?.email;

  const formatQuoteTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedQuotes = [...(quotes || [])].sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime(),
  );

  const latestQuote = sortedQuotes[0];
  const isPendingReview = latestQuote?.status === 'PROPOSED';

  // Determine whether the current viewer proposed the latest quote
  const isProposedByViewer = latestQuote
    ? (isViewerClient && latestQuote.proposedBy === 'CLIENT') ||
      (isViewerDj && latestQuote.proposedBy === 'DJ')
    : false;

  // Only the opposite party can accept or counter; Admins are in audit mode
  const canAcceptOrCounter =
    latestQuote && isPendingReview && !isProposedByViewer && !isViewerAdmin;

  const handleAcceptQuote = async (quoteId: string) => {
    if (isProposedByViewer) {
      toast.error('You cannot accept your own proposed quotation.');
      return;
    }
    try {
      await acceptQuote({
        id: booking.id,
        bookingId: booking.id,
        quoteId,
      }).unwrap();
      toast.success('Quote accepted! Agreement is now locked.');
      if (onQuoteUpdated) onQuoteUpdated();
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          'Failed to accept quote.',
      );
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      await rejectQuote({
        id: booking.id,
        bookingId: booking.id,
        quoteId,
      }).unwrap();
      toast.success('Quote declined.');
      if (onQuoteUpdated) onQuoteUpdated();
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          'Failed to decline quote.',
      );
    }
  };

  const handleProposeCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(counterAmount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    try {
      await proposeQuote({
        id: booking.id,
        bookingId: booking.id,
        amount: numAmount,
        message: counterMessage.trim() || undefined,
        notes: counterMessage.trim() || undefined,
      }).unwrap();

      toast.success(
        isViewerDj
          ? 'Quotation submitted to client!'
          : 'Counteroffer submitted to artist!',
      );
      setShowCounterForm(false);
      setCounterAmount('');
      setCounterMessage('');
      if (onQuoteUpdated) onQuoteUpdated();
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          'Failed to submit proposal.',
      );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-7 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            Pricing & Contract Terms
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">
            Quotation & Negotiation
          </h2>
        </div>

        {agreement ? (
          <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm text-xs font-semibold flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Final Agreement Confirmed</span>
          </div>
        ) : isViewerAdmin ? (
          <div className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-sm text-xs font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin Audit Inspection</span>
          </div>
        ) : null}
      </div>

      {/* Active Agreement Snapshot */}
      {agreement ? (
        <div className="p-4 rounded-sm bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900">Agreed Price</span>
            <span className="font-mono text-base font-bold text-emerald-950">
              {currencyCode} {Number(agreement.agreedAmount).toLocaleString()}
            </span>
          </div>
          <p className="text-emerald-800 text-[11px]">
            Finalized on {new Date(agreement.createdAt).toLocaleDateString()} by{' '}
            {agreement.acceptedByParty === 'CLIENT' ||
            agreement.acceptedBy === 'CLIENT'
              ? isViewerClient
                ? 'you (Client)'
                : 'the Client'
              : isViewerDj
                ? 'you (Artist)'
                : 'the Artist'}
            . Direct payment is now unlocked.
          </p>
        </div>
      ) : latestQuote && isPendingReview && canAcceptOrCounter ? (
        /* Counterparty Action Banner: Viewer has power to Accept, Counter, or Decline */
        <div className="p-4 rounded-sm bg-sky-50/70 border border-sky-200 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                {latestQuote.proposedBy === 'DJ'
                  ? `Quotation Proposal from ${resolvedDjStageName} (Artist)`
                  : `Counterproposal from ${resolvedClientName} (Client)`}
              </span>
              <p className="text-xl font-bold font-mono text-sky-950 mt-0.5">
                {currencyCode} {Number(latestQuote.amount).toLocaleString()}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-sky-800 mt-1">
                <span>
                  By{' '}
                  <strong className="text-sky-950">
                    {latestQuote.proposedBy === 'DJ'
                      ? resolvedDjStageName
                      : resolvedClientName}
                  </strong>
                </span>
                {latestQuote.proposedBy === 'DJ' && resolvedDjEmail && (
                  <span className="font-mono text-[10px] text-sky-600">
                    &lt;{resolvedDjEmail}&gt;
                  </span>
                )}
                {latestQuote.proposedBy === 'CLIENT' && resolvedClientEmail && (
                  <span className="font-mono text-[10px] text-sky-600">
                    &lt;{resolvedClientEmail}&gt;
                  </span>
                )}
                <span className="text-sky-300">•</span>
                <span className="text-[10px] text-sky-600">
                  {formatQuoteTimestamp(latestQuote.createdAt)}
                </span>
              </div>
              {(latestQuote.message || latestQuote.notes) && (
                <p className="text-sky-900 text-xs mt-1.5 italic bg-white/70 p-2 rounded-xs border border-sky-100">
                  &ldquo;{latestQuote.message || latestQuote.notes}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleAcceptQuote(latestQuote.id)}
                disabled={isAccepting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer">
                <Check className="w-3.5 h-3.5" />
                <span>
                  {isAccepting
                    ? 'Accepting...'
                    : latestQuote.proposedBy === 'CLIENT'
                      ? 'Accept Client Offer'
                      : 'Accept Quote'}
                </span>
              </button>

              <button
                onClick={() => setShowCounterForm(!showCounterForm)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-sm shadow-xs transition-colors cursor-pointer">
                <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                <span>Counteroffer</span>
              </button>

              <button
                onClick={() => handleRejectQuote(latestQuote.id)}
                disabled={isRejecting}
                className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                title="Decline this quote">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Counteroffer Inline Form */}
          {showCounterForm && (
            <form
              onSubmit={handleProposeCounter}
              className="p-3 bg-white border border-sky-200 rounded-sm space-y-3">
              <span className="text-xs font-bold text-gray-800 block">
                {isViewerDj
                  ? 'Submit Revised Proposal to Client'
                  : 'Propose Counteroffer to Artist'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Proposed Amount ({currencyCode})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Note / Explanation (Optional)
                  </label>
                  <input
                    type="text"
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder="Reason or breakdown..."
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCounterForm(false)}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProposing}
                  className="px-4 py-1.5 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
                  {isProposing ? 'Sending...' : 'Send Proposal'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : latestQuote && isPendingReview && isProposedByViewer ? (
        /* Viewer Proposed this Quote: Cannot accept own quote; can only wait or revise */
        <div className="p-4 rounded-sm bg-amber-50/70 border border-amber-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                {isViewerDj
                  ? 'Your Quotation Sent to Client'
                  : 'Your Counteroffer Sent to Artist'}
              </span>
              <p className="text-xl font-bold font-mono text-amber-950 mt-0.5">
                {currencyCode} {Number(latestQuote.amount).toLocaleString()}
              </p>
              <span className="text-xs text-amber-900 mt-1 block">
                Awaiting response from{' '}
                <strong className="text-amber-950">
                  {isViewerDj ? resolvedClientName : resolvedDjStageName}
                </strong>
                {isViewerDj && resolvedClientEmail && (
                  <span className="font-mono text-[11px] text-amber-800">
                    {' '}
                    &lt;{resolvedClientEmail}&gt;
                  </span>
                )}
                {!isViewerDj && resolvedDjEmail && (
                  <span className="font-mono text-[11px] text-amber-800">
                    {' '}
                    &lt;{resolvedDjEmail}&gt;
                  </span>
                )}
                . Waiting for them to review, accept, or reply with a
                counteroffer.
              </span>
              <span className="text-[10px] text-amber-700/80 block mt-0.5">
                Sent on {formatQuoteTimestamp(latestQuote.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCounterForm(!showCounterForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-sm transition-colors cursor-pointer">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Revise Offer</span>
              </button>
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
          </div>

          {showCounterForm && (
            <form
              onSubmit={handleProposeCounter}
              className="p-3 bg-white border border-amber-200 rounded-sm space-y-3 mt-2">
              <span className="text-xs font-bold text-gray-800 block">
                Submit Revised Quotation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    New Proposed Amount ({currencyCode})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    placeholder="e.g. 28000"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Note / Adjustment Reason
                  </label>
                  <input
                    type="text"
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder="Updated pricing note..."
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCounterForm(false)}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProposing}
                  className="px-4 py-1.5 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
                  {isProposing ? 'Updating...' : 'Update Quotation'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : isViewerAdmin && latestQuote && isPendingReview ? (
        /* Admin View */
        <div className="p-4 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-gray-900 block">
              Quote Proposed by{' '}
              {latestQuote.proposedBy === 'DJ' ? 'Artist' : 'Client'} (Pending)
            </span>
            <span className="text-gray-600 text-[11px]">
              Current proposal amount: {currencyCode}{' '}
              {Number(latestQuote.amount).toLocaleString()}. Awaiting decision
              from {latestQuote.proposedBy === 'DJ' ? 'Client' : 'Artist'}.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-xs text-[10px] font-bold">
            PROPOSED
          </span>
        </div>
      ) : !agreement && !latestQuote ? (
        <div className="p-4 rounded-sm bg-gray-50 border border-gray-200 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-gray-900 block">
                {isViewerDj
                  ? 'Propose Performance Fee'
                  : 'Awaiting Initial Quote'}
              </span>
              <span className="text-gray-600 text-[11px] mt-0.5 block">
                {isViewerDj
                  ? 'No quotation has been sent yet. Propose your fee to initiate negotiation with the client.'
                  : 'The artist is reviewing your booking request and will submit their performance fee shortly.'}
              </span>
            </div>
            {isViewerDj && (
              <button
                type="button"
                onClick={() => setShowCounterForm(!showCounterForm)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:opacity-90 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Send Quotation</span>
              </button>
            )}
          </div>

          {showCounterForm && isViewerDj && (
            <form
              onSubmit={handleProposeCounter}
              className="pt-3 border-t border-gray-200/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Proposed Fee ({currencyCode})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Pricing Notes / What&apos;s Included (Optional)
                  </label>
                  <input
                    type="text"
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder="e.g. Includes 4-hour live DJ set, sound check & travel"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCounterForm(false)}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProposing}
                  className="px-4 py-1.5 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
                  {isProposing ? 'Sending...' : 'Send Quotation'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}

      {/* Quote History */}
      {sortedQuotes.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
            <History className="w-3.5 h-3.5 text-gray-500" />
            <span>Negotiation History ({sortedQuotes.length})</span>
          </div>

          <div className="space-y-2.5">
            {sortedQuotes.map((q) => {
              const isClientProposer = q.proposedBy === 'CLIENT';
              const isViewerProposer =
                (isViewerClient && isClientProposer) ||
                (isViewerDj && !isClientProposer);

              const senderName = isClientProposer
                ? resolvedClientName
                : resolvedDjStageName;

              const senderEmail = isClientProposer
                ? resolvedClientEmail
                : resolvedDjEmail;

              const roleLabel = isClientProposer ? 'Client' : 'DJ';

              return (
                <div
                  key={q.id}
                  className="p-3.5 border border-gray-200/80 rounded-sm bg-gray-50/70 hover:bg-white hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Sender Identity with Icon, Name, (You), Email & Date */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {isClientProposer ? (
                        <div className="inline-flex items-center gap-1 font-bold text-gray-800">
                          <User className="w-3.5 h-3.5 text-gray-500" />
                          <span>{senderName}</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            ({roleLabel})
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 font-bold text-primary">
                          <Music className="w-3.5 h-3.5 text-primary" />
                          <span>{senderName}</span>
                          <span className="text-[10px] text-primary/70 font-normal">
                            ({roleLabel})
                          </span>
                        </div>
                      )}

                      {isViewerProposer && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-200/60 px-1 py-0.2 rounded-xs">
                          You
                        </span>
                      )}

                      {senderEmail && (
                        <span className="text-[10px] text-gray-400 font-mono">
                          &lt;{senderEmail}&gt;
                        </span>
                      )}

                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] text-gray-500">
                        {formatQuoteTimestamp(q.createdAt)}
                      </span>
                    </div>

                    {/* Proposal Note or Message */}
                    {(q.message || q.notes) && (
                      <p className="text-gray-600 text-xs italic bg-white/80 p-2 rounded-xs border border-gray-100">
                        &ldquo;{q.message || q.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Amount & Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">
                    <span className="font-mono font-bold text-sm text-gray-900">
                      {currencyCode} {Number(q.amount).toLocaleString()}
                    </span>

                    {/* Modern Status Badge */}
                    {q.status === 'ACCEPTED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Accepted</span>
                      </span>
                    ) : q.status === 'PROPOSED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span>
                          {isViewerProposer
                            ? 'Sent (Waiting)'
                            : 'Action Required'}
                        </span>
                      </span>
                    ) : q.status === 'SUPERSEDED' ? (
                      <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500 border border-gray-200">
                        <span>Superseded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <X className="w-3 h-3 text-rose-600" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
