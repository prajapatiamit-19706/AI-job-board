import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
