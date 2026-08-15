'use client';

import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@repo/ui';
import { DownloadIcon, ArrowLeft, Calendar, Mail, MapPin, Phone, Music, CreditCard, Clock, FileText, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetBookingByIdQuery, useDownloadInvoicePdfMutation } from '@repo/store';

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: bookingResponse, isLoading: loading, error: fetchError } = useGetBookingByIdQuery(id);
  const booking = bookingResponse?.data;
  const error = fetchError ? (fetchError as any).data?.message || (fetchError as any).message || 'Failed to fetch booking' : null;

  const [downloadInvoicePdf, { isLoading: downloading }] = useDownloadInvoicePdfMutation();

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
  const amountFormatted = booking.totalAmount ? `KES ${Number(booking.totalAmount).toFixed(2)}` : 'Pending';

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Booking Overview</h1>
            {/* <p className="text-sm text-gray-500 mt-1">ID: {id}</p> */}
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          <span className="font-semibold uppercase text-sm tracking-wider">{booking.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Card */}
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Event Details</h3>
                <p className="text-sm text-gray-500">{booking.eventType}</p>
              </div>
            </div>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Location</p>
                  <p className="font-semibold text-gray-900">{booking.address || 'Location not specified'}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mb-3"><FileText className="w-4 h-4" /> Additional Details</p>
                <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {booking.eventDetails || 'No additional details provided by the client.'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Financial Summary</h3>
                  <p className="text-sm text-gray-500">Total Amount: {amountFormatted}</p>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">{amountFormatted}</h2>
            </div>
            <CardContent className="p-6 sm:p-8">
              {booking.invoice ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Payment Status</p>
                      <p className={`font-bold uppercase ${booking.invoice.status === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                        {booking.invoice.status}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Method</p>
                      <p className="font-bold text-gray-900 capitalize">{booking.invoice.transactions?.[0]?.gateway || 'Paystack'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white shadow-xl shadow-gray-900/10 gap-4">
                    <div>
                      <p className="font-semibold">Official Receipt</p>
                      <p className="text-xs text-gray-300 mt-1">Download a detailed PDF copy for your records.</p>
                    </div>
                    <Button 
                      onClick={() => booking.invoice && handleDownloadInvoice(booking.invoice.id)} 
                      disabled={downloading}
                      className="bg-white text-gray-900 hover:bg-gray-100 whitespace-nowrap rounded-xl"
                    >
                      {downloading ? 'Downloading...' : <><DownloadIcon className="mr-2 h-4 w-4" /> Download PDF</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-2xl">
                  <p className="text-gray-500">No payment records have been generated for this booking yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Client Info Card */}
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-3xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-primary" /> Client Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center p-3">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">{booking.client?.name?.charAt(0) || 'C'}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900">{booking.client?.name || 'Unknown Client'}</h3>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                  <p className="text-sm font-medium text-gray-700 truncate">{booking.client?.email || 'No email'}</p>
                </div>
                {booking.client?.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                    <p className="text-sm font-medium text-gray-700 truncate">{booking.client.phone}</p>
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
