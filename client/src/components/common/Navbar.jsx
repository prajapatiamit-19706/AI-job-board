import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-bg-card border-b border-border-soft px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-purple-light font-bold text-xl">
        AI Job Board
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/jobs" className="text-text-muted hover:text-text-primary transition-colors">
          Jobs
        </Link>
        
        {token && user ? (
          <div className="flex items-center gap-4">
            <Link 
              to={`/${user.role}/dashboard`} 
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-text-primary">{user.name}</span>
            <NotificationBell />
            <button 
              onClick={handleLogout}
              className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-xs hover:text-text-primary transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-text-muted hover:text-text-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-purple text-white font-bold rounded-lg px-4 py-2 hover:bg-purple/90 transition-all">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
