'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState, UserRole } from '@repo/store';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
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
    if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
      router.replace('/auth/login');
      return;
    }

    setIsAuthorized(true);
  }, [token, user, allowedRoles, router]);

  // Show a loading spinner while checking auth state to prevent UI flicker
  if (!isAuthorized) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};
