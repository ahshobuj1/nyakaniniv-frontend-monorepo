import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-[72px] flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-bold tracking-tight">UpBeat <span className="text-red-500">Admin</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/themes" className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-sm transition-colors">
            <span>Themes</span>
          </Link>
          <Link href="/dashboard/content" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
            <span>Site Content</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Live Site</p>
            <Link 
              href="http://localhost:3001/shobuj" 
              target="_blank"
              className="mt-2 block text-sm font-medium text-gray-900 hover:underline"
            >
              shobuj.deejay.africa
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome back,</span>
            <span className="font-semibold">DJ Shobuj</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900">Logout</button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
