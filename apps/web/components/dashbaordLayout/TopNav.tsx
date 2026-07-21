'use client';

import {Menu, Search, Bell, ChevronsRight} from 'lucide-react';
import {useSidebar} from './SidebarContext';
import {NotificationDropdown} from './NotificationDropdown';
import {UserDropdown} from '../shared/UserDropdown';

export function TopNav() {
  const {toggleCollapse, toggleMobile, isCollapsed} = useSidebar();

  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 border-b border-gray-200 shrink-0 font-sans transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobile}
          className="md:hidden text-gray-500 hover:text-primary cursor-pointer  focus:outline-none p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Menu size={22} />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="hidden md:block text-gray-500 hover:text-primary cursor-pointer  focus:outline-none p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          {isCollapsed ? <ChevronsRight size={20} /> : <Menu size={20} />}
        </button>

        <h2 className="text-sm md:text-base font-semibold text-gray-800">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#f4f4f4] text-sm text-gray-700 rounded-md pl-9 pr-4 py-2 w-48 lg:w-64 outline-none focus:ring-1 focus:ring-gray-300 transition-all"
          />
        </div>

        <NotificationDropdown />

        <UserDropdown />
      </div>
    </header>
  );
}
