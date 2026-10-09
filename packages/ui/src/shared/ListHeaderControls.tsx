import React from 'react';
import {Input} from '../components/ui/input';
import {Button} from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {ArrowDownNarrowWide, ArrowUpNarrowWide, Search} from 'lucide-react';

export interface FilterTabItem {
  value: string;
  label: string;
  count?: number;
  badgeColor?: string;
}

export interface ListHeaderControlsProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  // Search
  search?: string;
  setSearch?: (value: string) => void;
  onSearch?: () => void;
  searchPlaceholder?: string;
  // Filter Dropdown
  filter?: string;
  onFilter?: (value: string) => void;
  filterOptions?: {value: string; label: string}[];
  filterPlaceholder?: string;
  // Filter Tabs / Pills with Counts
  tabs?: FilterTabItem[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  // Sort
  sort: string;
  onSort: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrder: () => void;
  sortOptions: {value: string; label: string}[];
  className?: string;
  children?: React.ReactNode;
}

export function ListHeaderControls({
  title,
  description,
  search = '',
  setSearch,
  searchPlaceholder = 'Search...',
  filter,
  onFilter,
  filterOptions,
  filterPlaceholder = 'Filter by status',
  tabs,
  activeTab,
  onTabChange,
  sort,
  onSort,
  sortOrder,
  onSortOrder,
  sortOptions,
  className = '',
  children,
}: ListHeaderControlsProps) {
  return (
    <header className={`space-y-4 mb-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {(title || description) && (
          <div>
            {title &&
              (typeof title === 'string' ? (
                <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
                  {title}
                </h1>
              ) : (
                title
              ))}
            {description &&
              (typeof description === 'string' ? (
                <p className="text-[#787878] text-[15px] mt-1">{description}</p>
              ) : (
                description
              ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {/* Status / Category Filter Dropdown */}
          {filterOptions && onFilter && (
            <Select value={filter} onValueChange={onFilter}>
              <SelectTrigger className="w-[160px] !bg-white border-gray-200 shadow-xs cursor-pointer">
                <SelectValue placeholder={filterPlaceholder} />
              </SelectTrigger>
              <SelectContent side="bottom">
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort By Dropdown */}
          <Select onValueChange={onSort} value={sort}>
            <SelectTrigger className="w-[160px] !bg-white border-gray-200 shadow-xs cursor-pointer">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent side="bottom">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order Toggle */}
          <Button
            onClick={onSortOrder}
            size="icon"
            variant="outline"
            className="!bg-white border-gray-200 shadow-xs hover:bg-gray-50 cursor-pointer"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
            {sortOrder === 'asc' ? (
              <ArrowUpNarrowWide className="h-4 w-4" />
            ) : (
              <ArrowDownNarrowWide className="h-4 w-4" />
            )}
          </Button>

          {/* Search Input (instant / debounced, without submit button) */}
          {setSearch && (
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none cursor-pointer" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8.5 !bg-white text-sm border-gray-200 shadow-xs cursor-pointer"
              />
            </div>
          )}

          {children}
        </div>
      </div>

      {/* Filter Tabs with Counts integrated directly into the header format */}
      {tabs && tabs.length > 0 && onTabChange && (
        <div className="flex items-center gap-2.5 pt-1 pb-1 overflow-x-auto ">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-primary text-primary !bg-white shadow-xs'
                    : 'border-transparent !bg-white text-[#787878] hover:bg-gray-50'
                }`}>
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                      isActive ? tab.badgeColor || 'bg-primary' : 'bg-[#D1D5DB]'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default ListHeaderControls;
