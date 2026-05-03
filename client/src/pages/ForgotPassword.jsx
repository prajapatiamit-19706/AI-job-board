import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useToastStore from '../store/toastStore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await axiosInstance.post('/api/auth/forgot-password', { email });
      if (data.success) {
        addToast(data.message || 'OTP sent successfully', 'success');
        navigate('/reset-password', { state: { email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-card border border-border-soft rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl text-text-primary font-bold tracking-tight text-center mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-text-muted text-sm mb-6">
          Enter your email address to receive a password reset OTP.
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-muted mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-purple text-white font-bold rounded-lg py-2 mt-4 hover:bg-purple/90 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center text-text-muted mt-6 text-sm">
          Remember your password?{' '}
          <Link to="/login" className="text-purple-light hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
