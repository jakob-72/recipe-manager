import * as React from 'react';
import { useAuth } from './useAuth.ts';
import { Navigate } from 'react-router';

interface AuthenticatedProps {
  children?: React.ReactNode;
}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
