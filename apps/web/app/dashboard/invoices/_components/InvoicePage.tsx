'use client';

import React, {useState} from 'react';
import {Calendar, CheckCircle2, Clock, Eye, Download} from 'lucide-react';
import {Card, CardContent} from '@repo/ui';

// ==========================================
// 1. Types & Interfaces
// ==========================================
export type InvoiceStatus = 'Paid' | 'Unpaid';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  email: string;
  date: string;
  total: string;
  status: InvoiceStatus;
}

// ==========================================
// 2. Dummy Data
// ==========================================
const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-010',
    clientName: 'Omar Al-Farsi',
    email: 'omar@email.com',
    date: '22 Dec 2025',
    total: '₵3,136',
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-011',
    clientName: 'Lila Chen',
    email: 'lila@email.com',
    date: '01 Jan 2026',
    total: '₵2,016',
    status: 'Unpaid',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-012',
    clientName: 'Rajesh Kumar',
    email: 'rajesh@email.com',
    date: '14 Feb 2026',
    total: '₵8,960',
    status: 'Paid',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2026-013',
    clientName: 'Sofia Martinez',
    email: 'sofia@email.com',
    date: '03 Mar 2026',
    total: '₵1,680',
    status: 'Paid',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2026-014',
    clientName: 'Isabella Rossi',
    email: 'isabella@email.com',
    date: '19 Apr 2026',
    total: '₵1,265',
    status: 'Unpaid',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2026-015',
    clientName: 'Kofi Boateng',
    email: 'kofi@email.com',
    date: '27 May 2026',
    total: '₵4,568',
    status: 'Unpaid',
  },
  {
    id: '7',
    invoiceNumber: 'INV-2026-016',
    clientName: 'Emily Watson',
    email: 'emily@email.com',
    date: '15 Jun 2026',
    total: '₵9,524',
    status: 'Paid',
  },
  {
    id: '8',
    invoiceNumber: 'INV-2026-017',
    clientName: 'Jasper Lee',
    email: 'jasper@email.com',
    date: '10 Jul 2026',
    total: '₵3,654',
    status: 'Paid',
  },
  {
    id: '9',
    invoiceNumber: 'INV-2026-018',
    clientName: 'Amina Yusuf',
    email: 'amina@email.com',
    date: '25 Aug 2026',
    total: '₵8,136',
    status: 'Unpaid',
  },
  {
    id: '10',
    invoiceNumber: 'INV-2026-019',
    clientName: 'Diego Silva',
    email: 'diego@email.com',
    date: '30 Sep 2026',
    total: '₵1,857',
    status: 'Paid',
  },
];

type FilterType = 'All' | 'Paid' | 'Unpaid';

export default function InvoicesPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [invoices] = useState<Invoice[]>(dummyInvoices);

  // Derived state for counts
  const paidCount = invoices.filter((inv) => inv.status === 'Paid').length;
  const unpaidCount = invoices.filter((inv) => inv.status === 'Unpaid').length;
  const totalCount = invoices.length;

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === 'All') return true;
    return invoice.status === filter;
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
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
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
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
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
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
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
            {/* Keeping the top border/header similar to booking, but adapting if needed. 
                Based on screenshot, the table starts directly with the header row. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Invoice
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                      Client
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Date
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Total
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
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        // Alternate row backgrounds
                        className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                        <td className="py-4 px-8 text-[14px] font-semibold text-[#111620]">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-[#111620]">
                              {invoice.clientName}
                            </span>
                            <span className="text-[13px] text-[#787878]">
                              {invoice.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-8 text-[14px] text-[#787878]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.75 h-3.75 text-[#A1A1AA]" />
                            {invoice.date}
                          </div>
                        </td>
                        <td className="py-4 px-8 text-[14px] font-semibold text-[#111620]">
                          {invoice.total}
                        </td>
                        <td className="py-4 px-8">
                          {invoice.status === 'Paid' ? (
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
                            <button
                              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[#787878] transition-colors"
                              aria-label="View Invoice">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[#787878] transition-colors"
                              aria-label="Download Invoice">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
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
