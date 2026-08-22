'use client';

import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@repo/ui';
import { DownloadIcon, ArrowLeft, Calendar, Mail, MapPin, Phone, Music, CreditCard, Clock, FileText, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  useGetBookingByIdQuery, 
  useDownloadInvoicePdfMutation, 
  useUpdateBookingStatusMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation 
} from '@repo/store';

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: bookingResponse, isLoading: loading, error: fetchError } = useGetBookingByIdQuery(id);
  const booking = bookingResponse?.data;
  const error = fetchError ? (fetchError as any).data?.message || (fetchError as any).message || 'Failed to fetch booking' : null;

  const [downloadInvoicePdf, { isLoading: downloading }] = useDownloadInvoicePdfMutation();
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateBookingStatusMutation();
  const [handleCash, { isLoading: handlingCash }] = useHandleCashRequestDecisionMutation();
  const [markPaid, { isLoading: markingPaid }] = useMarkCashAsPaidMutation();

  const isActionLoading = updatingStatus || handlingCash || markingPaid;

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const blob = await downloadInvoicePdf(paymentId).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert('Could not download invoice. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <Link href="/dashboard/bookings">
          <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
        </Link>
        <div className="p-6 bg-red-50/80 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 shadow-sm">
          Error: {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  const isCompleted = booking.status === 'completed';
  const cashTransaction = booking.invoice?.transactions?.find((tx: any) => tx.gateway === 'CASH');
  const isPendingCashRequest = cashTransaction?.status === 'PENDING' && !cashTransaction?.metadata?.cashApproved;
  const isApprovedCashRequest = cashTransaction?.status === 'PENDING' && cashTransaction?.metadata?.cashApproved;
  const amountFormatted = booking.totalAmount ? `KES ${Number(booking.totalAmount).toFixed(2)}` : 'Pending';

  return (
    <div className="container mx-auto p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#111827]">Booking Details</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${
                isCompleted 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-[#6B7280] mt-1 font-mono">{id}</p>
          </div>
        </div>
        
        {booking.invoice && (
          <Button 
            onClick={() => booking.invoice?.id && handleDownloadInvoice(booking.invoice.id)} 
            disabled={downloading}
            className="bg-[#111827] hover:bg-gray-800 text-white rounded-lg shadow-sm"
          >
            {downloading ? 'Downloading...' : (
              <>
                <DownloadIcon className="mr-2 h-4 w-4" /> 
                Download PDF Receipt
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Event Details Card */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                <Music className="w-5 h-5 text-gray-400" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(() => {
                const rawDetails = booking.eventDetails || '';
                let startTime = '';
                let duration = '';
                const otherLines: string[] = [];

                rawDetails.split('\n').forEach((line: string) => {
                  if (line.startsWith('Start Time:')) {
                    startTime = line.replace('Start Time:', '').trim();
                  } else if (line.startsWith('Duration:')) {
                    duration = line.replace('Duration:', '').trim();
                  } else if (line.startsWith('Requirements:')) {
                    otherLines.push(line.replace('Requirements:', '').trim());
                  } else if (line.trim()) {
                    otherLines.push(line.trim());
                  }
                });

                const requirements = otherLines.join('\n').trim();
                const eventDateFormatted = booking.eventDate 
                  ? new Date(booking.eventDate).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
                  : 'N/A';

                return (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border-b border-gray-100">
                      <div className="p-5 space-y-1">
                        <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">Event Type</p>
                        <p className="font-semibold text-[#111827] capitalize">{booking.eventType || 'N/A'}</p>
                      </div>
                      <div className="p-5 space-y-1">
                        <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">Date & Time</p>
                        <p className="font-semibold text-[#111827]">
                          {eventDateFormatted}
                        </p>
                        {startTime && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[12px] font-bold border border-amber-200 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            {startTime}
                          </div>
                        )}
                      </div>
                      <div className="p-5 space-y-1">
                        <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">Duration</p>
                        <p className="font-semibold text-[#111827]">{duration || 'Custom Set'}</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-1 bg-gray-50/30 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">Venue & Location</p>
                        {booking.address && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Open Map
                          </a>
                        )}
                      </div>
                      <p className="font-medium text-[#111827] flex items-start gap-2 pt-1">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        {booking.address || 'Location not specified'}
                      </p>
                    </div>

                    {requirements && (
                      <div className="p-5 space-y-2">
                        <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">Client Requirements & Music Expectations</p>
                        <div className="text-[14px] text-[#374151] whitespace-pre-wrap leading-relaxed bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
                          {requirements}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {booking.invoice ? (
                <div className="space-y-6">
                  <div className="flex items-end justify-between pb-6 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Total Amount</p>
                      <h2 className="text-3xl font-bold text-[#111827]">{amountFormatted}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Status</p>
                      <p className={`font-semibold ${booking.invoice.status === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                        {booking.invoice.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280] text-[12px] mb-1">Invoice Number</p>
                      <p className="text-sm font-medium text-[#111827] font-mono">
                        INV-{booking.invoice.id.split('-')[0].toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#6B7280] text-[12px] mb-1">Payment Method</p>
                      <p className="text-sm font-medium text-[#111827] capitalize">
                        {booking.invoice.transactions?.[0]?.gateway?.replace('_', ' ') || 'Card / Paystack'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-[#6B7280] font-medium">No invoice generated</p>
                  <p className="text-sm text-[#9CA3AF] mt-1">Payment details are currently unavailable.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Action Center Card */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                Action Center
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {booking.status === 'pending' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Review the details and approve this booking request to generate a payment link.</p>
                  <Button 
                    className="w-full bg-[#111827] text-white hover:bg-gray-800"
                    disabled={isActionLoading}
                    onClick={() => {
                      const amount = prompt('Enter the total amount (KES) for this booking:');
                      if (amount && !isNaN(Number(amount))) {
                        updateStatus({ id, status: 'accepted' as any, totalAmount: Number(amount) });
                      }
                    }}
                  >
                    Accept Booking Request
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    disabled={isActionLoading}
                    onClick={() => confirm('Are you sure you want to reject this booking?') && updateStatus({ id, status: 'rejected' as any })}
                  >
                    Reject Booking
                  </Button>
                </div>
              )}

              {booking.status === 'accepted' && isPendingCashRequest && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 font-medium">Cash Payment Requested</p>
                    <p className="text-xs text-amber-700 mt-1">The client wants to pay by cash on site.</p>
                  </div>
                  <Button 
                    className="w-full bg-amber-500 text-white hover:bg-amber-600"
                    disabled={isActionLoading}
                    onClick={() => handleCash({ id, decision: 'approve' })}
                  >
                    Approve Cash Request
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={isActionLoading}
                    onClick={() => handleCash({ id, decision: 'reject' })}
                  >
                    Reject & Demand Online Pay
                  </Button>
                </div>
              )}

              {booking.status === 'accepted' && isApprovedCashRequest && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">You approved the cash request. Once you receive the money, mark it as paid.</p>
                  <Button 
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    disabled={isActionLoading}
                    onClick={() => confirm('Confirm you received the cash?') && markPaid(id)}
                  >
                    Mark as Paid (Received Cash)
                  </Button>
                </div>
              )}

              {booking.status === 'accepted' && booking.invoice?.status === 'PAID' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">The invoice is fully paid. After the event, mark the booking as completed.</p>
                  <Button 
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isActionLoading}
                    onClick={() => updateStatus({ id, status: 'completed' as any })}
                  >
                    Complete Event
                  </Button>
                </div>
              )}

              {booking.status === 'accepted' && !isPendingCashRequest && !isApprovedCashRequest && booking.invoice?.status !== 'PAID' && (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Waiting for client payment...</p>
                </div>
              )}

              {isCompleted && (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Booking Completed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Info Card */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" /> 
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-gray-500 uppercase">{booking.client?.name?.charAt(0) || 'C'}</span>
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-[#111827] truncate">{booking.client?.name || 'Unknown Client'}</h3>
                  <p className="text-sm text-[#6B7280]">Customer</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={`mailto:${booking.client?.email}`} className="text-[#374151] hover:text-blue-600 truncate transition-colors">
                    {booking.client?.email || 'No email provided'}
                  </a>
                </div>
                {booking.client?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={`tel:${booking.client.phone}`} className="text-[#374151] hover:text-blue-600 truncate transition-colors">
                      {booking.client.phone}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
