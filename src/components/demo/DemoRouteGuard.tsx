import { useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/contexts/DemoModeContext';

const BLOCKED_ROUTES = [
  '/settings',
  '/documentation',
  '/feature-spec',
  '/demo',
];

interface DemoRouteGuardProps {
  children: ReactNode;
}

export const DemoRouteGuard = ({ children }: DemoRouteGuardProps) => {
  const { isDemoMode } = useDemoMode();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode && BLOCKED_ROUTES.some(r => location.pathname.startsWith(r))) {
      navigate('/', { replace: true });
    }
  }, [isDemoMode, location.pathname, navigate]);

  return <>{children}</>;
};
