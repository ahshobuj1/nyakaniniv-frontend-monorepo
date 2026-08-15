'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useGetCurrentProfileQuery, clearAuth } from '@repo/store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui';
import { ConfirmationDialog } from '../ConfirmationDialog';

export function UserDropdown() {
  const { data: profileResponse } = useGetCurrentProfileQuery();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const user = profileResponse?.data;

  const handleLogout = () => {
    dispatch(clearAuth());
    setIsLogoutDialogOpen(false);
    setIsOpen(false);
    sessionStorage.clear();
    router.push('/auth/login');
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const hasProfileImage = Boolean(user?.profileImg);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#fff0f0] text-primary font-bold text-xs md:text-sm hover:bg-[#ffe5e5] transition-colors overflow-hidden border border-blue-200 cursor-pointer">
            {hasProfileImage ? (
              <Image 
                src={user!.profileImg!} 
                alt="Profile" 
                width={36} 
                height={36} 
                className="object-cover w-full h-full"
              />
            ) : (
              getInitials()
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 rounded-xl shadow-lg border border-gray-100" align="end" sideOffset={8}>
          <div className="px-3 py-2 border-b border-gray-100 mb-2">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <div className="flex flex-col space-y-1">
            <Link 
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
            >
              <Settings size={16} />
              Profile Dashboard
            </Link>
            
            <button
              onClick={() => {
                setIsOpen(false);
                setIsLogoutDialogOpen(true);
              }}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        isOpen={isLogoutDialogOpen}
        title="Logout"
        description="Are you sure you want to logout from your account?"
        confirmText="Logout"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutDialogOpen(false)}
      />
    </>
  );
}
