import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import useAuth from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  useAuth(); // Initialize auth state on load

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute role="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute role="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
