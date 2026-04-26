import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await axiosInstance.post('/api/auth/register', formData);
      if (data.success) {
        setAuth(data.data, data.data.token);
        navigate(`/${data.data.role}/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-bg-card border border-border-soft rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl text-text-primary font-bold tracking-tight text-center mb-6">
          Create an account
        </h2>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('candidate')}
              className={`flex-1 py-3 px-4 rounded-lg border transition-all text-sm font-medium ${
                formData.role === 'candidate'
                  ? 'bg-purple-muted border-purple text-purple-light'
                  : 'bg-bg-surface border-border-soft text-text-muted hover:border-purple/50'
              }`}
            >
              I'm a Candidate
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('employer')}
              className={`flex-1 py-3 px-4 rounded-lg border transition-all text-sm font-medium ${
                formData.role === 'employer'
                  ? 'bg-purple-muted border-purple text-purple-light'
                  : 'bg-bg-surface border-border-soft text-text-muted hover:border-purple/50'
              }`}
            >
              I'm an Employer
            </button>
          </div>

          <div>
            <label className="block text-text-muted mb-1 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-text-muted mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {formData.role === 'employer' && (
            <div>
              <label className="block text-text-muted mb-1 text-sm">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
                placeholder="Acme Corp"
              />
            </div>
          )}

          <div>
            <label className="block text-text-muted mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple text-white font-bold rounded-lg py-2 mt-4 hover:bg-purple/90 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-text-muted mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-light hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
