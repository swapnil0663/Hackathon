import { Navigate } from 'react-router-dom';
import tokenManager from '../utils/sessionManager';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = tokenManager.isAuthenticated();
  const userRole = tokenManager.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;