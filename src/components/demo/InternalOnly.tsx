import { useDemoMode } from '@/contexts/DemoModeContext';
import { ReactNode } from 'react';

interface InternalOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const InternalOnly = ({ children, fallback = null }: InternalOnlyProps) => {
  const { isDemoMode } = useDemoMode();
  if (isDemoMode) return <>{fallback}</>;
  return <>{children}</>;
};
