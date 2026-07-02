'use client';

import {Sidebar} from '@/components/dashbaordLayout/Sidebar';
import {TopNav} from '@/components/dashbaordLayout/TopNav';
import {SidebarProvider} from '@/components/dashbaordLayout/SidebarContext';
import {ProtectedRoute} from '@/components/ProtectedRoute';

import {StripeConnectPopup} from './_components/StripeConnectPopup';
import {TenantOnboardingPopup} from './_components/TenantOnboardingPopup';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['DJ', 'SUPER_ADMIN']}>
      <SidebarProvider>
        <div className="flex h-screen bg-[#f4f5f7] overflow-hidden font-sans relative">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300">
            <TopNav />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
        <StripeConnectPopup />
        <TenantOnboardingPopup />
      </SidebarProvider>
    </ProtectedRoute>
  );
}
