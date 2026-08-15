'use client';

import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@repo/ui';
import { DownloadIcon, ArrowLeft, Receipt, Calendar, CreditCard, User, Music, Building, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useDownloadInvoicePdfMutation, useGetInvoiceByIdQuery } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    } catch (error) {
      console.error(error);
      alert('Could not download invoice. Please try again.');
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
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Invoice Details</h1>
            <p className="text-sm text-gray-500 mt-1">Transaction ID: {id}</p>
          </div>
        </div>
        <Button 
          onClick={handleDownload} 
          disabled={downloadLoading}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all rounded-xl px-6"
        >
          {downloadLoading ? 'Generating...' : (
            <>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download Receipt
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Invoice Card */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-1">Invoice Amount</p>
                <h2 className="text-4xl font-extrabold text-gray-900">KES {amount}</h2>
              </div>
              <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {isPaid ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                <span className="font-semibold">{isPaid ? 'Paid' : 'Pending'}</span>
              </div>
            </div>

            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> Date</p>
                  <p className="font-semibold text-gray-900">{dateFormatted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Receipt className="w-4 h-4" /> Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{invoice.type.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><CreditCard className="w-4 h-4" /> Method</p>
                  <p className="font-semibold text-gray-900 uppercase">{(invoice as any).method || 'Paystack'}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Item Details</h3>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                      {isBooking ? <Music className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {isBooking ? `Booking: ${booking?.eventType || 'Event'}` : `Subscription: ${subscription?.name || 'Plan'}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isBooking && booking?.eventDate ? `Scheduled for ${new Date(booking.eventDate).toLocaleDateString()}` : 'One-time charge'}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">KES {amount}</p>
                </div>
              </div>

              {isBooking && booking && (
                <div className="border-t border-gray-100 pt-8 mt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50">
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">Event Type</p>
                      <p className="font-semibold text-gray-900">{booking.eventType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">Date</p>
                      <p className="font-semibold text-gray-900">
                        {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">Location</p>
                      <p className="font-semibold text-gray-900">{booking.address || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-3 pt-4 mt-2 border-t border-blue-100/50 flex justify-end">
                      <Link href={`/dashboard/bookings/${booking.id}`}>
                        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                          View Full Booking Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-primary" /> Billing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Billed To</p>
                <p className="font-bold text-gray-900">
                  {isBooking ? booking?.client?.name : `${(invoice as any).user?.firstName || ''} ${(invoice as any).user?.lastName || ''}`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {isBooking ? booking?.client?.email : (invoice as any).user?.email}
                </p>
                {isBooking && booking?.client?.phone && (
                  <p className="text-sm text-gray-600">{booking.client.phone}</p>
                )}
              </div>
              
              {isBooking && (invoice as any).tenant && (
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Service Provider</p>
                  <p className="font-bold text-gray-900">
                    {(invoice as any).tenant?.stageName || (invoice as any).tenant?.user?.firstName || 'UpBeat DJ'}
                  </p>
                  {(invoice as any).tenant?.user?.email && (
                    <p className="text-sm text-gray-600 mt-1">{(invoice as any).tenant.user.email}</p>
                  )}
                  {((invoice as any).tenant?.city || (invoice as any).tenant?.country) && (
                    <p className="text-sm text-gray-600">
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
