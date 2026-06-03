import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types/user';

interface PrivateRouteProps {
  role?: User['role'];
}

export function PrivateRoute({ role }: PrivateRouteProps) {
  const { isAuth, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    return (
      <Navigate to={'/login'} state={{ from: location.pathname }} replace />
    );
  }

  if (role && user?.role !== role) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
