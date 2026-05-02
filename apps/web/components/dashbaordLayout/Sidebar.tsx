'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Palette,
  Settings,
  CalendarDays,
  CalendarCheck,
  FileText,
  CreditCard,
  ExternalLink,
  Headphones,
  X,
  HeadphonesIcon,
} from 'lucide-react';
import {useSidebar} from './SidebarContext';
import Image from 'next/image';

const sidebarGroups = [
  {
    title: 'Overview',
    items: [{label: 'Dashboard', url: '/dashboard', icon: LayoutDashboard}],
  },
  {
    title: 'My Website',
    items: [
      {label: 'Profile', url: '/dashboard/profile', icon: User},
      {label: 'Themes', url: '/dashboard/themes', icon: Palette},
      {label: 'Manage Theme', url: '/dashboard/manage-theme', icon: Settings},
      {label: 'Events', url: '/dashboard/events', icon: CalendarDays},
    ],
  },
  {
    title: 'Business',
    items: [
      {label: 'Bookings', url: '/dashboard/bookings', icon: CalendarCheck},
      {label: 'Invoices', url: '/dashboard/invoices', icon: FileText},
    ],
  },
  {
    title: 'Account',
    items: [
      {label: 'Billing & Plans', url: '/dashboard/billing', icon: CreditCard},
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const {isCollapsed, isMobileOpen, closeMobile} = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 md:relative flex flex-col h-screen bg-white border-r border-gray-200 shrink-0 font-sans transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'w-65 md:w-65'}
        `}>
        <div
          className={`h-16 flex items-center ${isCollapsed ? 'md:justify-center px-4' : 'justify-between px-6'} border-b border-gray-100`}>
          <h1
            className={`text-xl font-bold text-primary flex items-center gap-3  tracking-wide whitespace-nowrap overflow-hidden ${isCollapsed ? 'md:hidden' : 'block'}`}>
            <Image
              src={'/auth.logo.png'}
              alt="Logo"
              width={200}
              height={200}
              className="w-8"
            />
            Kenzo
          </h1>
          {/* Logo icon for desktop collapsed state */}
          <h1
            className={`hidden text-xl font-bold text-primary ${isCollapsed ? 'md:block' : 'md:hidden'}`}>
            <HeadphonesIcon className="w-5 h-5" />
          </h1>

          <button
            onClick={closeMobile}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <div
          className={`flex-1 overflow-y-auto py-6 ${isCollapsed ? 'md:px-2' : 'px-4'} space-y-6 scrollbar-hide`}>
          {sidebarGroups.map((group, index) => (
            <div key={index} className="overflow-hidden">
              <h3
                className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 whitespace-nowrap ${isCollapsed ? 'md:hidden' : 'block'}`}>
                {group.title}
              </h3>

              <div
                className={`hidden h-px bg-gray-100 my-4 mx-2 ${isCollapsed && index > 0 ? 'md:block' : 'md:hidden'}`}></div>

              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.url;

                  return (
                    <li key={itemIndex}>
                      <Link
                        href={item.url}
                        onClick={() => window.innerWidth < 768 && closeMobile()}
                        className={`flex items-center ${isCollapsed ? 'md:justify-center py-3' : 'gap-3 px-3 py-2.5'} rounded-md font-medium text-sm transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                        }`}
                        title={isCollapsed ? item.label : ''}>
                        <Icon
                          size={isCollapsed ? 22 : 18}
                          className="shrink-0"
                        />
                        <span
                          className={`whitespace-nowrap overflow-hidden ${isCollapsed ? 'md:hidden' : 'block'}`}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`p-4 border-t border-gray-100 ${isCollapsed ? 'md:flex md:flex-col md:items-center' : ''}`}>
          <Link
            href="https://subdomainafrica.vercel.app/aura"
            target="_blank"
            className={`flex items-center justify-center gap-2 w-full bg-[#fff0f0] text-primary ${isCollapsed ? 'md:py-3' : 'py-2.5'} rounded-md text-sm font-semibold hover:bg-[#ffe5e5] transition-colors mb-4`}
            title={isCollapsed ? 'View My Website' : ''}>
            <ExternalLink size={isCollapsed ? 20 : 16} className="shrink-0" />
            <span
              className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : 'block'}`}>
              View My Website
            </span>
          </Link>

          <div
            className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'gap-3 px-2'}`}>
            <div className="w-8 h-8 shrink-0 rounded-full bg-red-50 flex items-center justify-center text-primary">
              <Headphones size={18} />
            </div>
            <div
              className={`whitespace-nowrap overflow-hidden ${isCollapsed ? 'md:hidden' : 'block'}`}>
              <p className="text-[10px] font-bold text-gray-900 leading-tight">
                Powered By
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                UpBeat Africa
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
