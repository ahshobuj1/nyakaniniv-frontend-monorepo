/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState, useEffect} from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Receipt,
  Music,
  CreditCard,
} from 'lucide-react';
import {
  Card,
  CardContent,
  ListHeaderControls,
  PaginationControls,
} from '@repo/ui';
import {useGetMyInvoicesQuery, UnifiedInvoice} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import {getInvoicePaymentInfo} from '@/lib/invoiceHelper';
import {InvoiceFilterType} from '@/types/invoice.types';

export default function InvoicesPage() {
  const [filter, setFilter] = useState<InvoiceFilterType>('All');

  // --- Search, Sort & Pagination State ---
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Debounce search input by 400ms (industry standard best practice)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({...prev, pageIndex: 0}));
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (value: string) => {
    setSort(value);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleFilterChange = (newFilter: InvoiceFilterType) => {
    setFilter(newFilter);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const statusFilterOptions = [
    {value: 'All', label: 'All Statuses'},
    {value: 'Paid', label: 'Paid'},
    {value: 'Unpaid', label: 'Unpaid'},
    {value: 'Overdue', label: 'Overdue'},
  ];

  const sortOptions = [
    {value: 'createdAt', label: 'Date'},
    {value: 'amount', label: 'Amount'},
    {value: 'status', label: 'Status'},
  ];

  // Build clean query params for RTK Query
  const queryParams: Record<string, any> = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };
  if (debouncedSearch.trim()) queryParams.search = debouncedSearch.trim();
  if (sort) queryParams.sortBy = sort;
  if (sortOrder) queryParams.sortOrder = sortOrder;
  if (filter !== 'All') queryParams.status = filter;

  const {data: invoicesData, isLoading} = useGetMyInvoicesQuery(queryParams);
  const invoices = invoicesData?.data || [];

  const paginationMeta =
    (invoicesData as any)?.meta?.pagination || (invoicesData as any)?.meta;
  const totalRows = paginationMeta?.total ?? invoices.length;
  const totalPages =
    paginationMeta?.totalPages ??
    Math.max(1, Math.ceil(totalRows / pagination.pageSize));

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-2 font-sans">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ListHeaderControls
          title="Invoices"
          description="Manage your gig bookings and subscription invoices in one organized workspace."
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search by invoice ID, transaction reference, client..."
          filter={filter}
          onFilter={(v) => handleFilterChange(v as InvoiceFilterType)}
          filterOptions={statusFilterOptions}
          filterPlaceholder="All Statuses"
          sort={sort}
          onSort={handleSort}
          sortOrder={sortOrder}
          onSortOrder={handleSortOrder}
          sortOptions={sortOptions}
        />

        {/* Table Card */}
        <Card className="border border-gray-200 shadow-xs overflow-hidden rounded-sm bg-white">
          <CardContent className="p-0">
            <div className="p-4 md:p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#111620]">
                Invoices List
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Showing {invoices.length} of {totalRows}{' '}
                {totalRows === 1 ? 'invoice' : 'invoices'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[5%]">
                      SN
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[14%]">
                      Type
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[24%]">
                      Client / Source
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[18%]">
                      Date
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Gateway & Method
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] tracking-wider w-[13%]">
                      Amount
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[13%]">
                      Status
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[8%] text-right pr-8">
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
                  ) : invoices.length > 0 ? (
                    invoices.map((invoice: UnifiedInvoice, index: number) => {
                      const paymentInfo = getInvoicePaymentInfo(invoice);
                      const isBooking = invoice.type === 'BOOKING';
                      const clientName = isBooking
                        ? invoice.booking?.client?.name
                        : null;
                      const clientEmail = isBooking
                        ? invoice.booking?.client?.email
                        : invoice.user?.email;
                      const rowSn =
                        pagination.pageIndex * pagination.pageSize + index + 1;

                      return (
                        <tr
                          key={invoice.id}
                          className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                          <td className="py-4 px-6 text-[14px] text-[#787878] w-8">
                            {rowSn}
                          </td>
                          <td className="py-4 px-6 text-[14px]">
                            {invoice.type === 'SUBSCRIPTION' ? (
                              <span className="flex items-center gap-1.5 font-semibold text-primary">
                                <Receipt className="w-4 h-4" />
                                Subscription
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 font-semibold text-[#111620]">
                                <Music className="w-4 h-4" />
                                Event Booking
                              </span>
                            )}
                            <span
                              className="text-[12px] font-mono text-[#6B7280] block mt-0.5"
                              title={invoice.id}>
                              #{invoice.id.substring(0, 8)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              {isBooking && clientName ? (
                                <>
                                  <span className="text-[14px] font-semibold text-[#111620]">
                                    {clientName}
                                  </span>
                                  <span className="text-[13px] text-[#787878]">
                                    {clientEmail || 'No email'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-[14px] font-semibold text-[#111620]">
                                    Platform Subscription
                                  </span>
                                  <span className="text-[13px] text-[#787878]">
                                    {clientEmail || 'Plan renewal'}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-[14px] text-[#111620] flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                                {invoice.createdAt
                                  ? new Date(
                                      invoice.createdAt,
                                    ).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'N/A'}
                              </span>
                              <span className="text-[12px] text-[#787878] pl-5 mt-0.5">
                                {invoice.createdAt
                                  ? new Date(
                                      invoice.createdAt,
                                    ).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : ''}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[14px]">
                            {paymentInfo.isPaid ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#111620]">
                                  <CreditCard className="w-3.5 h-3.5 text-[#6B7280]" />
                                  {paymentInfo.gatewayLabel}
                                </span>
                                <span className="text-[12px] text-[#787878] pl-5">
                                  {paymentInfo.methodLabel}
                                </span>
                                {invoice.gatewayReference && (
                                  <span
                                    className="text-[11px] font-mono text-[#9CA3AF] pl-5 block truncate max-w-[170px]"
                                    title={invoice.gatewayReference}>
                                    Ref: {invoice.gatewayReference}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-sm bg-gray-50 border border-gray-200 text-gray-700 text-[12px] font-medium capitalize">
                                {paymentInfo.combinedLabel}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-[14px] font-semibold text-[#111620]">
                            {invoice.currencyCode || 'KES'}{' '}
                            {Number(invoice.amount || 0).toLocaleString(
                              'en-US',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {invoice.status === 'PAID' ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#10B981] text-white text-[13px] font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Paid
                              </div>
                            ) : invoice.status === 'OVERDUE' ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#EF4444] text-white text-[13px] font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                Overdue
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#F59E0B] text-white text-[13px] font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                Unpaid
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right pr-8">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/dashboard/invoices/${invoice.id}`}
                                className="p-2 rounded-sm border border-gray-200 bg-white hover:bg-gray-50 text-[#787878] transition-colors"
                                aria-label="View Invoice">
                                <Eye className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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

            {totalRows > 10 && (
              <div className="border-t border-gray-100 bg-white">
                <PaginationControls
                  pagination={pagination}
                  onPaginationChange={setPagination}
                  totalPages={totalPages}
                  totalRows={totalRows}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
