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

import {Card, CardContent, Button} from '@repo/ui';
import Link from 'next/link';

// ==========================================
// 1. Dummy Data
// ==========================================
const summaryStats = [
  {
    title: 'Total Earnings',
    value: '₵45,280',
    trend: '+22.5%',
    isPositive: true,
    subtitle: 'vs last month',
  },
  {
    title: 'This Month',
    value: '₵8,400',
    trend: '+18.4%',
    isPositive: true,
    subtitle: 'vs last month',
  },
  {
    title: 'Upcoming Events',
    value: '06',
    trend: '+22.5%',
    isPositive: true,
    subtitle: 'vs last month',
  },
  {
    title: 'Profile Views',
    value: '12,847',
    trend: '-22.5%',
    isPositive: false,
    subtitle: 'vs last month',
  },
];

const revenueData = [
  {name: 'Jan', value: 3500},
  {name: 'Feb', value: 4500},
  {name: 'Mar', value: 4000},
  {name: 'Apr', value: 6000},
  {name: 'May', value: 5500},
  {name: 'Jun', value: 7500},
  {name: 'Jul', value: 7000},
  {name: 'Aug', value: 8500},
  {name: 'Sep', value: 8000},
  {name: 'Oct', value: 9500},
];

const bookingsData = [
  {name: 'Jan', value: 8},
  {name: 'Feb', value: 12},
  {name: 'Mar', value: 10},
  {name: 'Apr', value: 14},
  {name: 'May', value: 12},
  {name: 'Jun', value: 18},
  {name: 'Jul', value: 16},
  {name: 'Aug', value: 20},
  {name: 'Sep', value: 17},
  {name: 'Oct', value: 24},
];

const recentBookings = [
  {
    id: '1',
    clientName: 'Afia Mensah',
    eventType: 'Birthday Party',
    date: '22 Dec 2025',
    email: 'afia.mensah@example.com',
    status: 'Confirmed',
  },
  {
    id: '2',
    clientName: 'Jonas Kim',
    eventType: 'Business Meeting',
    date: '01 Jan 2026',
    email: 'jonas.kim@example.com',
    status: 'Pending',
  },
  {
    id: '3',
    clientName: 'Lila Chen',
    eventType: 'Art Exhibition',
    date: '14 Feb 2026',
    email: 'lila.chen@example.com',
    status: 'Confirmed',
  },
  {
    id: '4',
    clientName: 'Marco Rossi',
    eventType: 'Wedding Reception',
    date: '03 Mar 2026',
    email: 'marco.rossi@example.com',
    status: 'Confirmed',
  },
  {
    id: '5',
    clientName: 'Sofia Patel',
    eventType: 'Corporate Retreat',
    date: '19 Apr 2026',
    email: 'sofia.patel@example.com',
    status: 'Pending',
  },
];

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
// ==========================================
export default function DashboardOverview() {
  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-4">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Welcome, KENZO
            </h1>
            <p className="text-[#787878] text-[15px]">
              Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>

          <Link href={'https://subdomainafrica.vercel.app/shobuj'}>
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
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[18px] font-bold text-[#111620]">
                  Revenue Overview
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
                    margin={{top: 10, right: 0, left: -20, bottom: 0}}>
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
                      tick={{fill: '#A1A1AA', fontSize: 12}}
                      tickFormatter={(value) => `₵${value / 1000}k`}
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
              <button className="text-primary text-[14px] font-bold flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Client
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Event Type
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Date
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                      Email
                    </th>
                    <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                      <td className="py-5 px-8 text-[14px] font-semibold text-[#111620]">
                        {booking.clientName}
                      </td>
                      <td className="py-5 px-8 text-[14px] text-[#787878]">
                        {booking.eventType}
                      </td>
                      <td className="py-5 px-8 text-[14px] text-[#787878]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.75 h-3.75 text-[#A1A1AA]" />
                          {booking.date}
                        </div>
                      </td>
                      <td className="py-5 px-8 text-[14px] text-[#787878]">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.75 h-3.75 text-[#A1A1AA]" />
                          {booking.email}
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        {booking.status === 'Confirmed' ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#10B981] text-white text-[13px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F59E0B] text-white text-[13px] font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
