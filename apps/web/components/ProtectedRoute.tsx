'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@repo/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('SUPER_ADMIN' | 'DJ')[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!token || !user) {
      router.replace('/auth/login');
      return;
    }
    
    // Check if user has the required role
    if (allowedRoles && !allowedRoles.includes(user.role as 'SUPER_ADMIN' | 'DJ')) {
      router.replace('/auth/login');
      return;
    }

    setIsAuthorized(true);
  }, [token, user, allowedRoles, router]);

  // Show a loading spinner while checking auth state to prevent UI flicker
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f5f7]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};
