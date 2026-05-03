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
  const [showPassword, setShowPassword] = useState(false);
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
        const { userId, email } = data.data
        navigate('/verify-otp', {
          state: {
            userId,
            email,
            name: formData.name
          }
        })
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
              className={`flex-1 py-3 px-4 rounded-lg border transition-all text-sm font-medium ${formData.role === 'candidate'
                ? 'bg-purple-muted border-purple text-purple-light'
                : 'bg-bg-surface border-border-soft text-text-muted hover:border-purple/50'
                }`}
            >
              I'm a Candidate
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('employer')}
              className={`flex-1 py-3 px-4 rounded-lg border transition-all text-sm font-medium ${formData.role === 'employer'
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

          <div className="relative">
            <label className="block text-text-muted mb-1 text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2 pr-10 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
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
