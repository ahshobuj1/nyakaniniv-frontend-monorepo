import React from 'react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationControlsProps {
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  totalPages: number;
  totalRows?: number;
  pageSizeOptions?: number[];
  className?: string;
}

export function PaginationControls({
  pagination,
  onPaginationChange,
  totalPages,
  totalRows,
  pageSizeOptions = [10, 20, 30, 50],
  className = '',
}: PaginationControlsProps) {
  const currentPage = pagination.pageIndex + 1;
  const safeTotalPages = Math.max(totalPages || 1, 1);

  // Hide pagination if 10 or fewer items exist
  if (totalRows !== undefined ? totalRows <= 10 : safeTotalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center justify-between px-4 py-2 bg-background gap-3 ${className}`}>
      <div className="text-sm text-muted-foreground hidden lg:block">
        Showing page {currentPage} of {safeTotalPages}
        {totalRows !== undefined && ` (${totalRows} total items)`}
      </div>
      
      <div className="flex items-center gap-3 ml-auto">
        <Label htmlFor="rows-per-page" className="text-sm hidden sm:block">
          Rows per page
        </Label>
        <Select
          value={`${pagination.pageSize}`}
          onValueChange={(v) =>
            onPaginationChange({
              ...pagination,
              pageIndex: 0,
              pageSize: Number(v),
            })
          }
        >
          <SelectTrigger className="w-20 bg-white border-gray-200 shadow-xs" id="rows-per-page">
            <SelectValue placeholder={pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-white border-gray-200 shadow-xs hover:bg-gray-50"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: 0 })}
            disabled={pagination.pageIndex === 0}
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-white border-gray-200 shadow-xs hover:bg-gray-50"
            onClick={() =>
              onPaginationChange({
                ...pagination,
                pageIndex: Math.max(0, pagination.pageIndex - 1),
              })
            }
            disabled={pagination.pageIndex === 0}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-white border-gray-200 shadow-xs hover:bg-gray-50"
            onClick={() =>
              onPaginationChange({
                ...pagination,
                pageIndex: pagination.pageIndex + 1,
              })
            }
            disabled={pagination.pageIndex >= safeTotalPages - 1}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-white border-gray-200 shadow-xs hover:bg-gray-50"
            onClick={() =>
              onPaginationChange({
                ...pagination,
                pageIndex: safeTotalPages - 1,
              })
            }
            disabled={pagination.pageIndex >= safeTotalPages - 1}
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaginationControls;
