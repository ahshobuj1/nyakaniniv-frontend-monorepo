'use client';

import React, {useState} from 'react';
import {Calendar, CheckCircle2, Clock, Eye, Download, Receipt, Music} from 'lucide-react';
import {Card, CardContent} from '@repo/ui';
import {useGetMyInvoicesQuery, UnifiedInvoice} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';

// ==========================================
// 1. Types & Interfaces
// ==========================================
type FilterType = 'All' | 'Paid' | 'Unpaid';

export default function InvoicesPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  
  const { data: invoicesData, isLoading } = useGetMyInvoicesQuery();
  const invoices = invoicesData?.data || [];

  // Derived state for counts
  const paidCount = invoices.filter((inv) => String(inv.status).toUpperCase() === 'PAID').length;
  const unpaidCount = invoices.filter((inv) => String(inv.status).toUpperCase() === 'UNPAID').length;
  const totalCount = invoices.length;

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === 'All') return true;
    return String(invoice.status).toUpperCase() === filter.toUpperCase();
  });

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-2 font-sans">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Invoices
            </h1>
            <p className="text-[#787878] text-[15px]">
              {totalCount < 10 ? `0${totalCount}` : totalCount} total invoices
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 pt-2 pb-2">
          {/* All Tab */}
          <button
            onClick={() => setFilter('All')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold cursor-pointer transition-all border ${
              filter === 'All'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            All
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'All' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {totalCount}
            </span>
          </button>

          {/* Paid Tab */}
          <button
            onClick={() => setFilter('Paid')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold cursor-pointer transition-all border ${
              filter === 'Paid'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Paid
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'Paid' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {paidCount}
            </span>
          </button>

          {/* Unpaid Tab */}
          <button
            onClick={() => setFilter('Unpaid')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold cursor-pointer transition-all border ${
              filter === 'Unpaid'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Unpaid
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'Unpaid' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {unpaidCount}
            </span>
          </button>
        </div>

        {/* Table Card */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[5%]">
                      SN
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Type
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                      Client
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Date
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[19%]">
                      Method
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] tracking-wider w-[15%]">
                      Amount (KES)
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Status
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[10%]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <LoadingSpinner smallHeight />
                      </td>
                    </tr>
                  ) : filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice: UnifiedInvoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                        <td className="py-4 px-8 text-[14px] text-[#787878] w-8">
                          {index + 1}
                        </td>
                        <td className="py-4 px-8 text-[14px] font-semibold text-[#111620]">
                          {invoice.type === 'SUBSCRIPTION' ? (
                            <span className="flex items-center gap-1.5 text-primary">
                              <Receipt className="w-4 h-4" />
                              Subscription
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[#111620]">
                              <Music className="w-4 h-4" />
                              Event Booking
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex flex-col">
                            {invoice.type === 'BOOKING' && (invoice as any).booking?.client ? (
                              <>
                                <span className="text-[14px] font-semibold text-[#111620]">
                                  {(invoice as any).booking.client.name}
                                </span>
                                <span className="text-[13px] text-[#787878]">
                                  {(invoice as any).booking.client.email}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[14px] font-semibold text-[#111620]">
                                  Platform Subscription
                                </span>
                                <span className="text-[13px] text-[#787878]">
                                  {(invoice as any).user?.email || 'Plan renewal'}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex flex-col">
                            <span className="text-[14px] text-[#111620] flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                              {invoice.createdAt 
                                ? new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                : 'N/A'
                              }
                            </span>
                            <span className="text-[12px] text-[#787878] pl-5 mt-0.5">
                              {invoice.createdAt ? new Date(invoice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-8 text-[14px]">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700 text-[12px] font-medium capitalize">
                            {(invoice as any).method?.replace('_', ' ') || (invoice as any).transactions?.[0]?.gateway?.replace('_', ' ') || 'Paystack'}
                          </span>
                        </td>
                        <td className="py-4 px-8 text-[14px] font-semibold text-[#111620]">
                          {invoice.amount?.toString()}
                        </td>
                        <td className="py-4 px-8">
                          {invoice.status === 'PAID' ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#10B981] text-white text-[13px] font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F59E0B] text-white text-[13px] font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              Unpaid
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/dashboard/invoices/${invoice.id}`}
                              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[#787878] transition-colors"
                              aria-label="View Invoice">
                              <Eye className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-[#787878]">
                        No invoices found for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
