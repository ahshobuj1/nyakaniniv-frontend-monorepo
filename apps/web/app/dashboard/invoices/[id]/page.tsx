'use client';

import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@repo/ui';
import { DownloadIcon, ArrowLeft, Receipt, Calendar, CreditCard, User, Music, Building, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useDownloadInvoicePdfMutation, useGetInvoiceByIdQuery } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: invoiceResponse, isLoading: fetchLoading, error: fetchError } = useGetInvoiceByIdQuery(id);
  const [downloadInvoicePdf, { isLoading: downloadLoading }] = useDownloadInvoicePdfMutation();

  const invoice = invoiceResponse?.data;
  const error = fetchError ? (fetchError as any).data?.message || (fetchError as any).message || 'Failed to fetch invoice' : null;

  const handleDownload = async () => {
    try {
      const blob = await downloadInvoicePdf(id).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Could not download invoice. Please try again.');
    }
  };

  if (fetchLoading) {
    return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;
  }

  if (error || !invoice) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <Link href="/dashboard/invoices">
          <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
        </Link>
        <div className="p-6 bg-red-50/80 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 shadow-sm">
          Error: {error || 'Invoice not found'}
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === 'PAID';
  const amount = Number(invoice.amount).toFixed(2);
  const dateFormatted = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const isBooking = invoice.type === 'BOOKING';
  
  const booking = isBooking ? (invoice as any).booking : null;
  const subscription = !isBooking ? (invoice as any).plan : null;

  return (
    <div className="container mx-auto p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#111827]">Invoice Details</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${
                isPaid 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
            <p className="text-sm text-[#6B7280] mt-1 font-mono">{id}</p>
          </div>
        </div>
        <Button 
          onClick={handleDownload} 
          disabled={downloadLoading}
          className="bg-[#111827] hover:bg-gray-800 text-white rounded-lg shadow-sm"
        >
          {downloadLoading ? 'Generating...' : (
            <>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download PDF Receipt
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-6 pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Invoice Amount</p>
                  <h2 className="text-4xl font-bold text-[#111827]">KES {amount}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Date Issued</p>
                  <p className="font-medium text-[#111827]">{dateFormatted}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border-b border-gray-100">
                <div className="p-5 space-y-1">
                  <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px]">Type</p>
                  <p className="font-medium text-[#111827] capitalize flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-gray-400" />
                    {invoice.type.toLowerCase()}
                  </p>
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px]">Payment Method</p>
                  <p className="font-medium text-[#111827] capitalize flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    {(invoice as any).method?.replace('_', ' ') || (invoice as any).transactions?.[0]?.gateway || 'Paystack'}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-4">Item Details</p>
                <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      {isBooking ? <Music className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">
                        {isBooking ? `Booking: ${booking?.eventType || 'Event'}` : `Subscription: ${subscription?.name || 'Plan'}`}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {isBooking && booking?.eventDate ? `Scheduled for ${new Date(booking.eventDate).toLocaleDateString()}` : 'One-time charge'}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-[#111827]">KES {amount}</p>
                </div>
              </div>

              {isBooking && booking && (
                <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                  <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-4">Event Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280] text-[11px] uppercase tracking-wider mb-1">Event Type</p>
                      <p className="text-sm font-medium text-[#111827]">{booking.eventType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#6B7280] text-[11px] uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm font-medium text-[#111827]">
                        {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#6B7280] text-[11px] uppercase tracking-wider mb-1">Location</p>
                      <p className="text-sm font-medium text-[#111827] truncate" title={booking.address}>{booking.address || 'N/A'}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2">
                      View Booking Details
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" /> 
                Billing Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-5 border-b border-gray-100 space-y-1">
                <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-2">Billed To</p>
                <p className="font-semibold text-[#111827]">
                  {isBooking ? booking?.client?.name : `${(invoice as any).user?.firstName || ''} ${(invoice as any).user?.lastName || ''}`}
                </p>
                <p className="text-sm text-[#374151]">
                  {isBooking ? booking?.client?.email : (invoice as any).user?.email}
                </p>
                {isBooking && booking?.client?.phone && (
                  <p className="text-sm text-[#374151]">{booking.client.phone}</p>
                )}
              </div>
              
              {isBooking && (invoice as any).tenant && (
                <div className="p-5 space-y-1 bg-gray-50/30">
                  <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-2">Billed From (Service Provider)</p>
                  <p className="font-semibold text-[#111827]">
                    {(invoice as any).tenant?.stageName || (invoice as any).tenant?.user?.firstName || 'UpBeat DJ'}
                  </p>
                  {(invoice as any).tenant?.user?.email && (
                    <p className="text-sm text-[#374151]">{(invoice as any).tenant.user.email}</p>
                  )}
                  {((invoice as any).tenant?.city || (invoice as any).tenant?.country) && (
                    <p className="text-sm text-[#374151]">
                      {[(invoice as any).tenant?.city, (invoice as any).tenant?.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
