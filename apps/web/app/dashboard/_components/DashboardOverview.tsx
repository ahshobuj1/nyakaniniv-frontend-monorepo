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
  Eye,
  XCircle,
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
  useGetMyBookingsQuery,
  useUpdateBookingStatusMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation,
} from '@repo/store';

export default function DashboardOverview() {
  const [bookingToUpdate, setBookingToUpdate] = React.useState<{ 
    id: string; 
    currentStatus: string;
    isPendingCashRequest?: boolean;
    isApprovedCashRequest?: boolean;
    isInvoicePaid?: boolean;
  } | null>(null);
  const [priceInput, setPriceInput] = React.useState('');
  const [rejectBookingId, setRejectBookingId] = React.useState<string | null>(null);
  const [cashPaidBookingId, setCashPaidBookingId] = React.useState<string | null>(null);
  const [cashConfirmationText, setCashConfirmationText] = React.useState('');

  const { data: myBookingsResponse } = useGetMyBookingsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [handleCash, { isLoading: handlingCash }] = useHandleCashRequestDecisionMutation();
  const [markPaid, { isLoading: isMarkingPaid }] = useMarkCashAsPaidMutation();
  const isActionLoading = isUpdating || handlingCash || isMarkingPaid;

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
      setBookingToUpdate(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to reject booking');
    }
  };

  const handleCashDecision = async (decision: 'approve' | 'reject') => {
    if (!bookingToUpdate) return;
    try {
      await handleCash({ id: bookingToUpdate.id, decision }).unwrap();
      toast.success(`Cash request ${decision}d successfully!`);
      setBookingToUpdate(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || `Failed to ${decision} cash request`);
    }
  };

  const handleConfirmMarkCashPaid = async () => {
    if (!cashPaidBookingId) return;
    if (cashConfirmationText.trim().toUpperCase() !== 'PAID') {
      toast.error('Please type PAID to confirm');
      return;
    }
    try {
      await markPaid(cashPaidBookingId).unwrap();
      toast.success('Payment marked as paid via Cash and booking completed!');
      setCashPaidBookingId(null);
      setCashConfirmationText('');
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

  const allBookings = myBookingsResponse?.data || analytics?.recentRequests || [];
  const recentBookings = allBookings.slice(0, 7);



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
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Client
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[14%]">
                      Phone
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Event Type
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Event Date
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[16%]">
                      Payment & Amount
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[5%] text-center">
                      Details
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[1%] whitespace-nowrap">
                      Status & Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking: any, index: number) => {
                      const cashTransaction = booking.invoice?.transactions?.find((tx: any) => tx.gateway === 'CASH');
                      const isPendingCashRequest = cashTransaction?.status === 'PENDING' && !cashTransaction?.metadata?.cashApproved;
                      const isApprovedCashRequest = cashTransaction?.status === 'PENDING' && cashTransaction?.metadata?.cashApproved;
                      const isInvoicePaid = booking.invoice?.status === 'PAID';
                      
                      return (
                      <tr
                        key={booking.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                        <td className="py-5 px-8 text-[14px] font-semibold text-[#111620]">
                          <div className="flex flex-col gap-1">
                            <a 
                              href={`/dashboard/bookings/${booking.id}`}
                              className="hover:text-primary transition-colors cursor-pointer"
                            >
                              {booking.client?.name || 'Unknown Client'}
                            </a>
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
                            <span className="font-medium text-[#111620] capitalize">{booking.eventType}</span>
                            {booking.address && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-[#787878] hover:text-primary font-normal flex items-center gap-1.5 transition-colors group cursor-pointer"
                                title={`Open in Google Maps: ${booking.address}`}
                              >
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                                <span className="truncate max-w-[180px] group-hover:underline">{booking.address}</span>
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
                                <div className="flex items-center gap-1.5 font-medium text-[#111620] w-max">                           
                                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                  {new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                {timeTag && (
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 w-max">
                                    <Clock className="w-3 h-3" />
                                    {timeTag}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* Combined Payment & Amount Column */}
                        <td className="py-5 px-8 text-[14px]">
                          <div className="flex flex-col items-start gap-1.5">
                            <span className="font-semibold text-[#111620]">
                              {booking.totalAmount ? `KES ${Number(booking.totalAmount).toLocaleString()}` : '-'}
                            </span>
                            {booking.invoice ? (
                              isInvoicePaid ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Paid
                                </span>
                              ) : isApprovedCashRequest ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                                  <Clock className="w-3.5 h-3.5" />
                                  Cash Approved
                                </span>
                              ) : isPendingCashRequest ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                                  <Clock className="w-3.5 h-3.5" />
                                  Cash Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  Unpaid
                                </span>
                              )
                            ) : (
                              <span className="text-[11px] text-gray-400 italic">
                                Not Invoiced
                              </span>
                            )}
                          </div>
                        </td>

                        {/* View Details Eye Icon Button */}
                        <td className="py-5 px-8 text-center">
                          <a
                            href={`/dashboard/bookings/${booking.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="View Event Details"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </td>

                        <td className="py-5 px-8 flex flex-col items-start gap-2">
                          <button
                            onClick={() => {
                              setBookingToUpdate({ 
                                id: booking.id, 
                                currentStatus: booking.status,
                                isPendingCashRequest,
                                isApprovedCashRequest,
                                isInvoicePaid
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
                            ) : booking.status?.toLowerCase() === 'canceled' || booking.status?.toLowerCase() === 'rejected' ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500 text-white text-[13px] font-medium">
                                <XCircle className="w-3.5 h-3.5" />
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F59E0B] text-white text-[13px] font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                Pending
                              </div>
                            )}
                          </button>

                          {isPendingCashRequest && (
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
                        colSpan={7}
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
            
            {bookingToUpdate?.isPendingCashRequest && (
              <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3 text-[#D97706]">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-[13px] font-medium">
                  The client has requested to pay by cash.
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3 pt-4">
              {bookingToUpdate?.currentStatus?.toLowerCase() === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleStatusUpdate('ACCEPTED')}
                    disabled={isActionLoading}
                    className="bg-primary hover:bg-primary/90 text-white font-bold h-11 w-full rounded-[10px]"
                  >
                    {isActionLoading ? 'Processing...' : 'Accept Booking Request'}
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
                    disabled={isActionLoading}
                    className="h-11 w-full rounded-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Reject Booking
                  </Button>
                </>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && bookingToUpdate.isPendingCashRequest && (
                <>
                  <Button 
                    onClick={() => handleCashDecision('approve')}
                    disabled={isActionLoading}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-11 w-full rounded-[10px]"
                  >
                    {isActionLoading ? 'Processing...' : 'Approve Cash Request'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCashDecision('reject')}
                    disabled={isActionLoading}
                    className="h-11 w-full rounded-[10px]"
                  >
                    Reject & Demand Online Pay
                  </Button>
                </>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && bookingToUpdate.isApprovedCashRequest && (
                <Button 
                  onClick={() => {
                    if (bookingToUpdate) {
                      const id = bookingToUpdate.id;
                      setBookingToUpdate(null);
                      setCashPaidBookingId(id);
                    }
                  }}
                  disabled={isActionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isActionLoading ? 'Processing...' : 'Mark as Paid (Received Cash)'}
                </Button>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && bookingToUpdate.isInvoicePaid && (
                <Button 
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={isActionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isActionLoading ? 'Processing...' : 'Complete Event'}
                </Button>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && !bookingToUpdate.isPendingCashRequest && !bookingToUpdate.isApprovedCashRequest && !bookingToUpdate.isInvoicePaid && (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Waiting for client payment...</p>
                </div>
              )}

              {(bookingToUpdate?.currentStatus?.toLowerCase() === 'canceled' || bookingToUpdate?.currentStatus?.toLowerCase() === 'rejected') && (
                <div className="text-center py-4">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">This booking was {bookingToUpdate.currentStatus.toLowerCase()}.</p>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={() => setBookingToUpdate(null)}
                className="h-11 w-full rounded-[10px] mt-2"
              >
                Close
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

      {/* Confirm Cash Received Dialog with 'PAID' verification */}
      <Dialog 
        open={!!cashPaidBookingId} 
        onOpenChange={(open) => {
          if (!open) {
            setCashPaidBookingId(null);
            setCashConfirmationText('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[460px] bg-white rounded-2xl p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Confirm Cash Payment Received
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm leading-relaxed">
              <strong>Important:</strong> Marking this payment as received will immediately mark the invoice as <strong>PAID</strong> and transition this booking to <strong>COMPLETED</strong> status.
            </div>
            <p className="text-sm text-gray-600">
              To prevent accidental completion, please confirm by typing <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded border">PAID</span> below:
            </p>
            <Input
              type="text"
              placeholder="Type PAID to confirm"
              value={cashConfirmationText}
              onChange={(e) => setCashConfirmationText(e.target.value)}
              className="h-11 rounded-xl text-center font-bold tracking-wider uppercase text-base"
              autoFocus
            />
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCashPaidBookingId(null);
                  setCashConfirmationText('');
                }}
                disabled={isMarkingPaid}
                className="rounded-xl h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmMarkCashPaid}
                disabled={isMarkingPaid || cashConfirmationText.trim().toUpperCase() !== 'PAID'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-5 font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {isMarkingPaid ? 'Completing Booking...' : 'Confirm Cash Received'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

