/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {Card, CardContent, Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input} from '@repo/ui';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

// ==========================================
// 1. Dummy Data
// ==========================================
// Removed dummy data

// ==========================================
// 2. Custom Tooltip for Recharts
// ==========================================
const CustomTooltip = ({active, payload, label}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111620] text-white text-xs px-3 py-2 rounded-md shadow-lg">
        <p className="font-semibold">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// ==========================================
// 3. Main Dashboard Component
import { 
  useGetCurrentProfileQuery,
  useGetTenantAnalyticsQuery,
  useGetTenantChartsQuery,
  useUpdateBookingStatusMutation,
  useMarkBookingPaidMutation
} from '@repo/store';

export default function DashboardOverview() {
  const [bookingToUpdate, setBookingToUpdate] = React.useState<{ 
    id: string; 
    currentStatus: string;
    isCashRequested?: boolean;
    paymentId?: string;
  } | null>(null);
  const [priceInput, setPriceInput] = React.useState('');
  const [rejectBookingId, setRejectBookingId] = React.useState<string | null>(null);

  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [markPaid, { isLoading: isMarkingPaid }] = useMarkBookingPaidMutation();

  const handleStatusUpdate = async (newStatus: 'ACCEPTED' | 'COMPLETED') => {
    if (!bookingToUpdate) return;
    
    if (newStatus === 'ACCEPTED' && !priceInput) {
      toast.error('Please enter a total amount for the booking');
      return;
    }

    try {
      const payload: any = {
        id: bookingToUpdate.id,
        status: newStatus.toLowerCase(),
      };
      
      if (newStatus === 'ACCEPTED') {
        payload.totalAmount = parseFloat(priceInput);
      }

      await updateStatus(payload).unwrap();
      toast.success(`Booking marked as ${newStatus.toLowerCase()}!`);
      setBookingToUpdate(null);
      setPriceInput('');
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to update status');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectBookingId) return;
    try {
      await updateStatus({ id: rejectBookingId, status: 'rejected' as any }).unwrap();
      toast.success('Booking rejected successfully');
      setRejectBookingId(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to reject booking');
    }
  };

  const handleMarkCashPaid = async (paymentId: string) => {
    try {
      await markPaid(paymentId).unwrap();
      toast.success('Payment marked as paid via Cash!');
      setBookingToUpdate(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to mark as paid');
    }
  };

  const { data: profileResponse } = useGetCurrentProfileQuery();
  const subdomain = profileResponse?.data?.tenant?.subdomain || 'demo';
  const stageName = profileResponse?.data?.tenant?.stageName || 'DJ';

  const { data: analyticsResponse, error: analyticsError } = useGetTenantAnalyticsQuery();
  const { data: chartsResponse, error: chartsError } = useGetTenantChartsQuery();

  const analytics = analyticsResponse?.data;
  const charts = chartsResponse?.data;

  const summaryStats = [
    {
      title: 'Total Earnings',
      value: `KES ${analytics?.totalEarnings?.toLocaleString() || 0}`,
      trend: 'Total',
      isPositive: true,
      subtitle: 'all time',
    },
    {
      title: 'Pending Invoices',
      value: `KES ${analytics?.pendingInvoices?.toLocaleString() || 0}`,
      trend: 'Unpaid',
      isPositive: false,
      subtitle: 'awaiting payment',
    },
    {
      title: 'Accepted Bookings',
      value: analytics?.bookings?.accepted?.toString() || '0',
      trend: 'Confirmed',
      isPositive: true,
      subtitle: 'approved events',
    },
    {
      title: 'Pending Bookings',
      value: analytics?.bookings?.pending?.toString() || '0',
      trend: 'Action needed',
      isPositive: false,
      subtitle: 'awaiting review',
    },
  ];

  const revenueData = charts?.earningsChart?.map((item: any) => ({
    name: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    value: item.amount,
  })) || [];

  const bookingsData = charts?.bookingsChart?.map((item: any) => ({
    name: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    value: item.count,
  })) || [];

  const recentBookings = analytics?.recentRequests || [];

  const getLiveWebsiteUrl = () => {
    if (typeof window === 'undefined') return '#';
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${subdomain}.localhost${port}`;
    }
    
    return `https://${subdomain}.deejay.africa`;
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-4">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Subscription Warning */}
        {((analyticsError as any)?.status === 403 || (chartsError as any)?.status === 403) && (
          <div className="bg-[#FFF8E6] border border-[#FDE68A] text-[#D97706] px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-[14px] font-medium">
              You need an active subscription to view real-time analytics and charts. Please upgrade your plan in the Subscription tab.
            </p>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Welcome, {stageName.toUpperCase()}
            </h1>
            <p className="text-[#787878] text-[15px]">
              Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>

          <Link href={getLiveWebsiteUrl()} target="_blank">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-11 rounded-lg shadow-sm transition-all active:scale-[0.98]">
              View My Website
              <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
            </Button>
          </Link>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryStats.map((stat, index) => (
            <Card
              key={index}
              className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white">
              <CardContent className="p-6">
                <p className="text-[#787878] text-[14px] font-medium mb-3">
                  {stat.title}
                </p>
                <h3 className="text-[32px] font-bold text-[#111620] mb-3 leading-none">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex items-center text-[13px] font-bold ${stat.isPositive ? 'text-[#10B981]' : 'text-primary'}`}>
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 mr-1 stroke-[2.5]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1 stroke-[2.5]" />
                    )}
                    {stat.trend}
                  </span>
                  <span className="text-[#A1A1AA] text-[13px] ml-1">
                    {stat.subtitle}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Revenue Area Chart */}
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white flex flex-col">
            <CardContent className="p-6 md:p-8 flex-1">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                <h2 className="text-[18px] font-bold text-[#111620]">
                  Revenue Overview (KES)
                </h2>

                <div className="flex gap-2">
                  <select className="bg-[#F5F5F5] border-transparent text-[#111620] text-[13px] font-medium py-1.5 px-3 rounded-lg outline-none cursor-pointer">
                    <option>Jan - Oct</option>
                    <option>Nov - Dec</option>
                  </select>
                  <select className="bg-[#F5F5F5] border-transparent text-[#111620] text-[13px] font-medium py-1.5 px-3 rounded-lg outline-none cursor-pointer">
                    <option>2026</option>
                    <option>2025</option>
                  </select>
                </div>
              </div>

              <div className="h-70 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{top: 10, right: 0, left: -10, bottom: 0}}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor="#F63131"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F63131"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F3F4F6"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: '#A1A1AA', fontSize: 12}}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#A1A1AA',
                        fontSize: 12,
                        textAnchor: 'start',
                      }}
                      tickFormatter={(value) => `${value / 1000}k`}
                      dx={-40}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#F63131"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Bar Chart */}
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white flex flex-col">
            <CardContent className="p-6 md:p-8 flex-1">
              <div className="mb-8">
                <h2 className="text-[18px] font-bold text-[#111620] mb-1">
                  Bookings
                </h2>
                <p className="text-[13px] text-[#A1A1AA]">Per month</p>
              </div>

              <div className="h-70 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingsData}
                    margin={{top: 10, right: 0, left: -20, bottom: 0}}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F3F4F6"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: '#A1A1AA', fontSize: 12}}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: '#A1A1AA', fontSize: 12}}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar
                      dataKey="value"
                      fill="#F63131"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings Table */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
          <CardContent className="p-0">
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-[#111620]">
                Recent Bookings
              </h2>
              <Link href="/dashboard/bookings" className="text-primary text-[14px] font-bold flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                      Client
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Phone
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                      Event Type
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Date
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Amount
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[1%] whitespace-nowrap">
                      Status & Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking: any, index: number) => {
                      const cashTx = booking.invoice?.transactions?.find((tx: any) => tx.gateway === 'CASH');
                      const isCashRequested = cashTx && cashTx.status === 'PENDING';
                      
                      return (
                      <tr
                        key={booking.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                        <td className="py-5 px-8 text-[14px] font-semibold text-[#111620]">
                          <div className="flex flex-col gap-1">
                            <span>{booking.client?.name || 'Unknown Client'}</span>
                            <span className="text-[12px] text-[#787878] font-normal flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{booking.client?.email || 'N/A'}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-[14px] text-[#787878]">
                          {booking.client?.phone ? (
                            <span className="text-[13px] font-medium flex items-center gap-1.5 text-[#111620]">
                              <Phone className="w-3.5 h-3.5 shrink-0 text-[#787878]" />
                              <span className="truncate">{booking.client.phone}</span>
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-5 px-8 text-[14px] text-[#787878]">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-[#111620]">{booking.eventType}</span>
                            {booking.address && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-[#787878] hover:text-primary font-normal flex items-center gap-1.5 transition-colors group cursor-pointer"
                                title={`Open in Google Maps: ${booking.address}`}
                              >
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                                <span className="truncate max-w-[150px] group-hover:underline">{booking.address}</span>
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-5 px-8 text-[14px] text-[#787878]">
                          {(() => {
                            let timeTag = '';
                            if (booking.eventDetails && booking.eventDetails.includes('Start Time:')) {
                              const match = booking.eventDetails.match(/Start Time:\s*([^\n]+)/);
                              if (match) timeTag = match[1].trim();
                            }
                            return (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 font-medium text-[#111620]">
                                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                  {new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                {timeTag && (
                                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 w-max">
                                    {timeTag}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="py-5 px-8 text-[14px] font-medium text-[#111620]">
                          {booking.totalAmount ? `KES ${Number(booking.totalAmount).toLocaleString()}` : '-'}
                        </td>
                        <td className="py-5 px-8 flex flex-col items-start gap-2">
                          <button
                            onClick={() => {
                              setBookingToUpdate({ 
                                id: booking.id, 
                                currentStatus: booking.status,
                                isCashRequested: isCashRequested,
                                paymentId: booking.payment?.id
                              });
                              setPriceInput('');
                            }}
                            className="focus:outline-none focus:ring-2 cursor-pointer focus:ring-primary/20 rounded-md transition-transform hover:scale-105 active:scale-95"
                          >
                            {booking.status?.toLowerCase() === 'completed' ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#10B981] text-white text-[13px] font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Completed
                              </div>
                            ) : booking.status?.toLowerCase() === 'accepted' ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white text-[13px] font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Accepted
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F59E0B] text-white text-[13px] font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                Pending
                              </div>
                            )}
                          </button>

                          {isCashRequested && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF8E6] border border-[#FDE68A] text-[#D97706] text-[11px] font-bold">
                              Cash Requested
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[#787878]">
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={!!bookingToUpdate} onOpenChange={(open) => !open && setBookingToUpdate(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-none">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-[#111620]">
              Update Booking Status
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-[14px] text-[#787878]">
              Current status: <span className="font-semibold text-black uppercase">{bookingToUpdate?.currentStatus || 'Unknown'}</span>
            </p>
            
            {bookingToUpdate?.currentStatus?.toLowerCase() === 'pending' && (
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#111620]">
                  Total Amount / Price
                </label>
                <Input
                  type="number"
                  placeholder="Enter total amount (e.g. 500)"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                />
                <p className="text-[12px] text-gray-500">
                  Accepting this booking will generate an invoice for the client. An email will send to the client with the invoice and payment link.
                </p>
              </div>
            )}
            
            {bookingToUpdate?.isCashRequested && (
              <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3 text-[#D97706]">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-[13px] font-medium">
                  The client has requested to pay by cash. You can mark this booking as paid once you receive the cash.
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3 pt-4">
              {bookingToUpdate?.currentStatus?.toLowerCase() === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleStatusUpdate('ACCEPTED')}
                    disabled={isUpdating}
                    className="bg-primary hover:bg-primary/90 text-white font-bold h-11 w-full rounded-[10px]"
                  >
                    {isUpdating ? 'Updating...' : 'Accept Booking'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (bookingToUpdate) {
                        const id = bookingToUpdate.id;
                        setBookingToUpdate(null);
                        setPriceInput('');
                        setRejectBookingId(id);
                      }
                    }}
                    disabled={isUpdating}
                    className="h-11 w-full rounded-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Reject Booking
                  </Button>
                </>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && !bookingToUpdate.isCashRequested && (
                <Button 
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={isUpdating}
                  className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isUpdating ? 'Updating...' : 'Mark as Completed'}
                </Button>
              )}

              {bookingToUpdate?.isCashRequested && bookingToUpdate.paymentId && (
                <Button 
                  onClick={() => handleMarkCashPaid(bookingToUpdate.paymentId!)}
                  disabled={isMarkingPaid}
                  className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isMarkingPaid ? 'Processing...' : 'Confirm Cash Received & Mark Paid'}
                </Button>
              )}

              <Button 
                variant="outline" 
                onClick={() => setBookingToUpdate(null)}
                className="h-11 w-full rounded-[10px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Booking Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!rejectBookingId}
        title="Reject Booking Request"
        description="Are you sure you want to reject this booking request? The client will be notified and this action cannot be undone."
        confirmText="Reject Booking"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isUpdating}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectBookingId(null)}
      />
    </div>
  );
}
