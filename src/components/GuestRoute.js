import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = () => {
  const { user } = useAuth();

  if (user) {
    // User is authenticated, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User not authenticated, render the child routes
  return <Outlet />;
};

export default GuestRoute;